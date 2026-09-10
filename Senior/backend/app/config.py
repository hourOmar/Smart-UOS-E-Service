"""
Backend configuration.

Loads environment variables from ``backend/.env`` (see ``.env.example``)
and exposes them to the rest of the backend. Nothing here is ever sent to
the frontend — this module is server-side only.

Per docs/ARCHITECTURE.md §4 and §9, FastAPI owns all LLM/agent execution
and all provider API keys. The React frontend must never hold a Gemini
key, so ``GEMINI_API_KEY`` is a plain (non-``VITE_``) server-side variable.
"""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

# backend/.env  (this file is app/config.py -> parents[1] == backend/)
BACKEND_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_DIR / ".env")

# Read once at import time. Values are intentionally never logged.
GEMINI_API_KEY: str | None = os.environ.get("GEMINI_API_KEY")

# Server-side PostgreSQL connection string for the Supabase database
# (contains the database password — privileged, server-side only, never
# a VITE_* variable). Obtain it from the Supabase dashboard: Connect ->
# "Connection string" -> Transaction pooler. Store it in backend/.env as
# DATABASE_URL. See backend/README.md.
DATABASE_URL: str | None = os.environ.get("DATABASE_URL")

# Currently supported Gemini model used for lightweight calls / the
# connection check. Override with GEMINI_MODEL in backend/.env if needed.
# (gemini-2.5-flash is no longer served to new API keys; the API itself
# points new projects at the gemini-3.x flash line.)
GEMINI_MODEL: str = os.environ.get("GEMINI_MODEL", "gemini-3.6-flash")


def require_gemini_api_key() -> str:
    """Return the Gemini API key, or raise a clear error if it is missing.

    Callers that actually need to reach Gemini use this so a missing key
    fails fast with an actionable message instead of a vague SDK error.
    """
    if not GEMINI_API_KEY:
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Create backend/.env (copy from "
            "backend/.env.example) and set GEMINI_API_KEY to a valid "
            "Google AI Studio API key."
        )
    return GEMINI_API_KEY


def require_database_url() -> str:
    """Return the Supabase Postgres connection string, or raise clearly.

    Fails fast with an actionable message instead of a vague driver error
    when ``DATABASE_URL`` has not been configured in ``backend/.env``.
    """
    if not DATABASE_URL:
        raise RuntimeError(
            "DATABASE_URL is not set. In the Supabase dashboard open "
            "Connect -> Connection string -> Transaction pooler, copy the "
            "URI (it includes your database password), and add it to "
            "backend/.env as DATABASE_URL=..."
        )
    return DATABASE_URL
