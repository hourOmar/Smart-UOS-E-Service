"""
Reusable Gemini client for the backend.

Uses the current official Google GenAI SDK (``google-genai``):

    from google import genai

The deprecated ``google-generativeai`` package is intentionally not used.

This module is deliberately tiny. Later, the AI agents (starting with the
Raise Capacity agents described in docs/ARCHITECTURE.md §7) will import
``get_client()`` / ``generate_text()`` from here instead of constructing
their own client. No agent logic lives here.
"""

from __future__ import annotations

from functools import lru_cache

from google import genai

from app.config import GEMINI_MODEL, require_gemini_api_key


@lru_cache(maxsize=1)
def get_client() -> genai.Client:
    """Return a process-wide singleton Gemini client.

    The API key comes from the ``GEMINI_API_KEY`` environment variable
    (loaded by ``app.config``), never from a hard-coded value.
    """
    return genai.Client(api_key=require_gemini_api_key())


def generate_text(prompt: str, *, model: str | None = None) -> str:
    """Send a single prompt to Gemini and return the plain-text response."""
    client = get_client()
    response = client.models.generate_content(
        model=model or GEMINI_MODEL,
        contents=prompt,
    )
    return (response.text or "").strip()
