"""
Minimal fake for the google-genai client, used so Phase 6 unit tests
never make a real Gemini API call. Mimics only
client.models.generate_content(model, contents, config) -> response
with a .text attribute, matching how app/pipeline/get_priority_decision.py
uses the real client.

Two ways to configure behavior:
- response_text=/raise_exc=: one fixed behavior applied to every call.
  Used by tests that only ever expect a single generate_content call.
- responses=[{"response_text": ...} | {"raise_exc": ...}, ...]: a
  sequence of behaviors consumed one per call, in order — used to
  simulate a primary-model failure followed by a fallback-model
  attempt. Calling generate_content more times than there are
  configured responses raises AssertionError, so a fallback test fails
  loudly if Gemini is called more times than expected.
"""

from types import SimpleNamespace
from typing import Any, Optional


class _FakeModels:
    def __init__(
        self,
        response_text: Optional[str] = None,
        raise_exc: Optional[Exception] = None,
        responses: Optional[list[dict[str, Any]]] = None,
    ):
        self._fixed = {"response_text": response_text, "raise_exc": raise_exc}
        self._responses = responses
        self.calls: list[dict] = []
        self.last_call: Optional[dict] = None

    def generate_content(self, model, contents, config):
        call = {"model": model, "contents": contents, "config": config}
        self.calls.append(call)
        self.last_call = call

        if self._responses is not None:
            call_index = len(self.calls) - 1
            if call_index >= len(self._responses):
                raise AssertionError(
                    f"generate_content called {len(self.calls)} time(s), but only "
                    f"{len(self._responses)} fake response(s) were configured."
                )
            behavior = self._responses[call_index]
        else:
            behavior = self._fixed

        if behavior.get("raise_exc") is not None:
            raise behavior["raise_exc"]
        return SimpleNamespace(text=behavior.get("response_text"))


class FakeGeminiClient:
    def __init__(
        self,
        response_text: Optional[str] = None,
        raise_exc: Optional[Exception] = None,
        responses: Optional[list[dict[str, Any]]] = None,
    ):
        self.models = _FakeModels(response_text, raise_exc, responses)
