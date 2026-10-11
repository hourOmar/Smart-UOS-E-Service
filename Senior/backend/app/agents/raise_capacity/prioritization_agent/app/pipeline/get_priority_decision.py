"""
Calls Gemini for one prioritization decision, using structured output so
the result is machine-validated rather than parsed from free-form text.

get_priority_decision(evidence, policy) does exactly what section 15
describes: serialize evidence + policy into the controlled prompt (via
gemini_prompt.build_gemini_prompt), call Gemini with a Pydantic response
schema, validate the result, and return a PriorityDecision. A technical
failure at any step (missing config, API/network error, malformed or
schema-invalid response) raises one of the typed errors in
priority_decision_errors.py — it never becomes a priority value.

Fallback strategy: models_to_try is the ordered list
[settings.gemini_model, *settings.gemini_fallback_models]. Each model is
attempted in order against the IDENTICAL request (same evidence, policy,
prompt, response schema, and GenerateContentConfig — only model= varies).
A model is skipped in favor of the next one ONLY on a temporary/retryable
Gemini error (HTTP 503 service-unavailable or 429 rate-limit/resource-
exhausted — the SDK's own typed google.genai.errors.APIError.code). Any
other exception — configuration problems, a different API error (e.g.
400/401/403), or a plain network/timeout exception — raises immediately
without trying further models, so a real problem is never masked by a
fallback attempt. If every model in the list fails with a retryable
error, a single GeminiRequestError is raised naming every model tried
and its error. The google-genai SDK does not retry on its own here (no
retry_options is configured on the client or the request), so this loop
is the only retry behavior in the stack.
"""

from typing import Any, Optional

from google.genai import types
from google.genai.errors import APIError
from pydantic import ValidationError

from app.config import settings
from app.integrations.gemini_client import get_gemini_client
from app.pipeline.gemini_prompt import build_gemini_prompt
from app.pipeline.priority_decision_errors import (
    GeminiConfigurationError,
    GeminiRequestError,
    GeminiResponseValidationError,
)
from app.schemas.priority_decision import PriorityDecision
from app.schemas.prioritization_evidence import PrioritizationEvidencePackage

_RETRYABLE_STATUS_CODES = {429, 503}


def _is_retryable_gemini_error(exc: Exception) -> bool:
    return isinstance(exc, APIError) and exc.code in _RETRYABLE_STATUS_CODES


def get_priority_decision(
    evidence: PrioritizationEvidencePackage,
    policy: dict,
    client: Optional[Any] = None,
) -> PriorityDecision:
    if not settings.gemini_model:
        raise GeminiConfigurationError(
            "GEMINI_MODEL must be set in the environment (see .env.example)."
        )

    client = client or get_gemini_client()
    system_instruction, user_content = build_gemini_prompt(evidence, policy)
    config = types.GenerateContentConfig(
        system_instruction=system_instruction,
        response_mime_type="application/json",
        response_schema=PriorityDecision,
    )

    models_to_try = [settings.gemini_model, *settings.gemini_fallback_models]
    response = None
    retryable_failures: list[tuple[str, Exception]] = []

    for model in models_to_try:
        print(f"Trying Gemini model: {model}")
        try:
            response = client.models.generate_content(
                model=model, contents=user_content, config=config
            )
        except Exception as exc:
            if _is_retryable_gemini_error(exc):
                print(f"Temporary server error with {model}: {exc}")
                retryable_failures.append((model, exc))
                continue
            raise GeminiRequestError(
                f"Gemini API call failed on model {model!r}: {exc}"
            ) from exc
        else:
            print(f"Success with model: {model}")
            break
    else:
        details = "; ".join(f"{failed_model}: {err}" for failed_model, err in retryable_failures)
        raise GeminiRequestError(
            "Gemini API call failed on all configured models "
            f"({', '.join(models_to_try)}): {details}"
        )

    raw_text = getattr(response, "text", None)
    if not raw_text:
        raise GeminiResponseValidationError("Gemini returned an empty response.")

    try:
        return PriorityDecision.model_validate_json(raw_text)
    except ValidationError as exc:
        raise GeminiResponseValidationError(
            f"Gemini response failed schema validation: {exc}"
        ) from exc
