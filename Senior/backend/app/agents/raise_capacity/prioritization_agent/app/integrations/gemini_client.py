"""
Gemini client foundation.

This module only builds a connected client. It does not send any prompt,
evidence package, or prioritization policy — that belongs to app/pipeline
in a later phase, once the evidence schema and prompt are defined.
"""

from google import genai

from app.config import settings


def get_gemini_client() -> genai.Client:
    if not settings.gemini_api_key:
        raise RuntimeError(
            "GEMINI_API_KEY must be set in the environment (see .env.example)."
        )
    return genai.Client(api_key=settings.gemini_api_key)
