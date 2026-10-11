import json

import pytest
from google.genai import errors as genai_errors

from app.pipeline.get_priority_decision import get_priority_decision
from app.pipeline.priority_decision_errors import (
    GeminiConfigurationError,
    GeminiRequestError,
    GeminiResponseValidationError,
)
from tests.gemini_fakes import FakeGeminiClient
from tests.test_gemini_prompt import POLICY, _evidence


# Pin the Gemini model settings for every test so results never depend on
# a local .env. Tests that need a specific model override these values.
@pytest.fixture(autouse=True)
def _default_gemini_models(monkeypatch):
    monkeypatch.setattr("app.pipeline.get_priority_decision.settings.gemini_model", "gemini-test-model")
    monkeypatch.setattr("app.pipeline.get_priority_decision.settings.gemini_fallback_models", [])


def _server_error(message="This model is currently experiencing high demand."):
    return genai_errors.ServerError(503, {"message": message, "status": "UNAVAILABLE"})


def _rate_limit_error():
    return genai_errors.ClientError(429, {"message": "Resource exhausted.", "status": "RESOURCE_EXHAUSTED"})


def _bad_request_error():
    return genai_errors.ClientError(400, {"message": "Invalid argument.", "status": "INVALID_ARGUMENT"})


def _unauthorized_error():
    return genai_errors.ClientError(401, {"message": "API key invalid.", "status": "UNAUTHENTICATED"})


def _forbidden_error():
    return genai_errors.ClientError(403, {"message": "Permission denied.", "status": "PERMISSION_DENIED"})

VALID_PAYLOAD = {
    "priority": "MEDIUM",
    "reasoning": "Because of the evidence.",
    "factor_explanations": {
        "graduation": "g",
        "degree_progress": "d",
        "course_requirement": "c",
        "course_availability": "a",
        "previous_attempts": "p",
        "prerequisite": "pr",
        "progression": "prog",
    },
    "key_evidence": ["Remaining credits: 33"],
}


def test_valid_response_returns_priority_decision():
    client = FakeGeminiClient(response_text=json.dumps(VALID_PAYLOAD))
    decision = get_priority_decision(_evidence(), POLICY, client=client)
    assert decision.priority == "MEDIUM"
    assert decision.reasoning == "Because of the evidence."


def test_client_is_called_with_configured_model(monkeypatch):
    monkeypatch.setattr("app.pipeline.get_priority_decision.settings.gemini_model", "gemini-test-model")
    client = FakeGeminiClient(response_text=json.dumps(VALID_PAYLOAD))
    get_priority_decision(_evidence(), POLICY, client=client)
    assert client.models.last_call["model"] == "gemini-test-model"


def test_missing_gemini_model_raises_configuration_error(monkeypatch):
    monkeypatch.setattr("app.pipeline.get_priority_decision.settings.gemini_model", "")
    client = FakeGeminiClient(response_text=json.dumps(VALID_PAYLOAD))
    with pytest.raises(GeminiConfigurationError):
        get_priority_decision(_evidence(), POLICY, client=client)


def test_gemini_api_failure_raises_request_error_not_a_priority():
    client = FakeGeminiClient(raise_exc=ConnectionError("simulated network failure"))
    with pytest.raises(GeminiRequestError):
        get_priority_decision(_evidence(), POLICY, client=client)


def test_empty_response_raises_validation_error():
    client = FakeGeminiClient(response_text="")
    with pytest.raises(GeminiResponseValidationError):
        get_priority_decision(_evidence(), POLICY, client=client)


def test_malformed_json_raises_validation_error():
    client = FakeGeminiClient(response_text="{not valid json")
    with pytest.raises(GeminiResponseValidationError):
        get_priority_decision(_evidence(), POLICY, client=client)


def test_invalid_priority_enum_raises_validation_error():
    payload = dict(VALID_PAYLOAD, priority="URGENT")
    client = FakeGeminiClient(response_text=json.dumps(payload))
    with pytest.raises(GeminiResponseValidationError):
        get_priority_decision(_evidence(), POLICY, client=client)


def test_empty_reasoning_raises_validation_error():
    payload = dict(VALID_PAYLOAD, reasoning="")
    client = FakeGeminiClient(response_text=json.dumps(payload))
    with pytest.raises(GeminiResponseValidationError):
        get_priority_decision(_evidence(), POLICY, client=client)


def test_missing_factor_explanation_raises_validation_error():
    incomplete_factors = dict(VALID_PAYLOAD["factor_explanations"])
    del incomplete_factors["progression"]
    payload = dict(VALID_PAYLOAD, factor_explanations=incomplete_factors)
    client = FakeGeminiClient(response_text=json.dumps(payload))
    with pytest.raises(GeminiResponseValidationError):
        get_priority_decision(_evidence(), POLICY, client=client)


# 22. Technical failure is NOT converted into MANUAL_REVIEW
def test_technical_failure_never_produces_manual_review():
    client = FakeGeminiClient(raise_exc=TimeoutError("simulated timeout"))
    try:
        get_priority_decision(_evidence(), POLICY, client=client)
        assert False, "expected GeminiRequestError to be raised"
    except GeminiRequestError:
        pass  # correct: a technical failure, not a MANUAL_REVIEW PriorityDecision


# Ordered multi-model fallback behavior.


def _set_models(monkeypatch, primary, fallbacks):
    monkeypatch.setattr("app.pipeline.get_priority_decision.settings.gemini_model", primary)
    monkeypatch.setattr("app.pipeline.get_priority_decision.settings.gemini_fallback_models", fallbacks)


# Preferred model succeeds -> no fallback is attempted.
def test_preferred_model_success_does_not_call_fallback(monkeypatch):
    _set_models(monkeypatch, "gemini-primary-model", ["gemini-fallback-model"])
    client = FakeGeminiClient(response_text=json.dumps(VALID_PAYLOAD))

    decision = get_priority_decision(_evidence(), POLICY, client=client)

    assert decision.priority == "MEDIUM"
    assert len(client.models.calls) == 1
    assert client.models.calls[0]["model"] == "gemini-primary-model"


# Preferred model returns 503 -> the next configured model is attempted.
def test_preferred_model_503_falls_back_to_next_model(monkeypatch):
    _set_models(monkeypatch, "gemini-primary-model", ["gemini-fallback-model"])
    client = FakeGeminiClient(
        responses=[
            {"raise_exc": _server_error()},
            {"response_text": json.dumps(VALID_PAYLOAD)},
        ]
    )

    decision = get_priority_decision(_evidence(), POLICY, client=client)

    assert decision.priority == "MEDIUM"
    assert len(client.models.calls) == 2
    assert client.models.calls[0]["model"] == "gemini-primary-model"
    assert client.models.calls[1]["model"] == "gemini-fallback-model"


# Preferred model returns 429/rate-limit -> the next configured model is attempted.
def test_preferred_model_429_falls_back_to_next_model(monkeypatch):
    _set_models(monkeypatch, "gemini-primary-model", ["gemini-fallback-model"])
    client = FakeGeminiClient(
        responses=[
            {"raise_exc": _rate_limit_error()},
            {"response_text": json.dumps(VALID_PAYLOAD)},
        ]
    )

    decision = get_priority_decision(_evidence(), POLICY, client=client)

    assert decision.priority == "MEDIUM"
    assert len(client.models.calls) == 2
    assert client.models.calls[1]["model"] == "gemini-fallback-model"


# Multiple models in a row return retryable errors -> the loop continues
# through the whole ordered list until one succeeds.
def test_multiple_retryable_failures_continue_through_the_list(monkeypatch):
    _set_models(monkeypatch, "gemini-primary-model", ["gemini-fallback-1", "gemini-fallback-2"])
    client = FakeGeminiClient(
        responses=[
            {"raise_exc": _server_error()},
            {"raise_exc": _rate_limit_error()},
            {"response_text": json.dumps(VALID_PAYLOAD)},
        ]
    )

    decision = get_priority_decision(_evidence(), POLICY, client=client)

    assert decision.priority == "MEDIUM"
    assert len(client.models.calls) == 3
    assert [call["model"] for call in client.models.calls] == [
        "gemini-primary-model",
        "gemini-fallback-1",
        "gemini-fallback-2",
    ]


# 400/401/403 -> stop immediately, no fallback attempted for any of them.
@pytest.mark.parametrize(
    "make_error",
    [_bad_request_error, _unauthorized_error, _forbidden_error],
)
def test_non_retryable_client_errors_stop_immediately(monkeypatch, make_error):
    _set_models(monkeypatch, "gemini-primary-model", ["gemini-fallback-model"])
    client = FakeGeminiClient(responses=[{"raise_exc": make_error()}])

    with pytest.raises(GeminiRequestError):
        get_priority_decision(_evidence(), POLICY, client=client)

    assert len(client.models.calls) == 1


# Unexpected/programming exception -> stop immediately, never treated as a model-availability problem.
def test_unexpected_exception_stops_immediately(monkeypatch):
    _set_models(monkeypatch, "gemini-primary-model", ["gemini-fallback-model"])
    client = FakeGeminiClient(responses=[{"raise_exc": ConnectionError("simulated network failure")}])

    with pytest.raises(GeminiRequestError):
        get_priority_decision(_evidence(), POLICY, client=client)

    assert len(client.models.calls) == 1


# All configured models fail with retryable errors -> one clear GeminiRequestError naming all of them.
def test_all_configured_models_failing_raises_clear_request_error(monkeypatch):
    _set_models(monkeypatch, "gemini-primary-model", ["gemini-fallback-1", "gemini-fallback-2"])
    client = FakeGeminiClient(
        responses=[
            {"raise_exc": _server_error()},
            {"raise_exc": _rate_limit_error()},
            {"raise_exc": _server_error(message="Still unavailable.")},
        ]
    )

    with pytest.raises(GeminiRequestError) as exc_info:
        get_priority_decision(_evidence(), POLICY, client=client)

    assert len(client.models.calls) == 3
    message = str(exc_info.value)
    assert "gemini-primary-model" in message
    assert "gemini-fallback-1" in message
    assert "gemini-fallback-2" in message


# An invalid structured response from a fallback model still follows the
# existing validation behavior — it is not treated as an availability failure.
def test_fallback_invalid_response_still_raises_validation_error(monkeypatch):
    _set_models(monkeypatch, "gemini-primary-model", ["gemini-fallback-model"])
    client = FakeGeminiClient(
        responses=[
            {"raise_exc": _server_error()},
            {"response_text": "{not valid json"},
        ]
    )

    with pytest.raises(GeminiResponseValidationError):
        get_priority_decision(_evidence(), POLICY, client=client)


# Edge case: no fallback models configured -> old single-model behavior is preserved exactly.
def test_no_fallback_configured_raises_immediately_on_retryable_error(monkeypatch):
    _set_models(monkeypatch, "gemini-primary-model", [])
    client = FakeGeminiClient(responses=[{"raise_exc": _server_error()}])

    with pytest.raises(GeminiRequestError):
        get_priority_decision(_evidence(), POLICY, client=client)

    assert len(client.models.calls) == 1
