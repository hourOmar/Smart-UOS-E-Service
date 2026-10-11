"""
Exceptions for the Phase 6 Gemini decision boundary. All of these are
TECHNICAL failures — they must propagate as exceptions and must never be
silently turned into a priority value (in particular, never into
MANUAL_REVIEW). A technical failure means the agent could not produce a
decision at all, which is an application error, not an academic
priority judgment.
"""


class PriorityDecisionError(Exception):
    """Base class for Phase 6 Gemini decision errors."""


class GeminiConfigurationError(PriorityDecisionError):
    """GEMINI_API_KEY or GEMINI_MODEL is not configured."""


class GeminiRequestError(PriorityDecisionError):
    """The Gemini API call itself failed (network/API error)."""


class GeminiResponseValidationError(PriorityDecisionError):
    """Gemini's response could not be validated as a PriorityDecision:
    empty response, malformed JSON, invalid priority enum, empty
    reasoning, or a missing/empty factor explanation."""
