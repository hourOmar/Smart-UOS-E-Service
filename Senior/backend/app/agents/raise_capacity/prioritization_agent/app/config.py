"""
Configuration foundation for the Request Prioritization Agent.

Loads settings from environment variables (see .env.example for the full
list). Nothing in this module talks to Supabase, the UoS website, or
Gemini — it only exposes the values those clients will need once they are
implemented in a later phase.
"""

import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    # Supabase / PostgreSQL
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_key: str = os.getenv("SUPABASE_KEY", "")

    # Gemini
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "")
    # Optional ordered list of additional models to try, in order, if
    # gemini_model fails with a temporary/retryable error (503
    # service-unavailable, 429 rate-limit). Comma-separated, e.g.
    # "gemini-2.5-flash,gemini-2.0-flash". Empty by default: no fallback,
    # behavior is unchanged from before this setting existed.
    gemini_fallback_models: list[str] = [
        m.strip() for m in os.getenv("GEMINI_FALLBACK_MODELS", "").split(",") if m.strip()
    ]

    # Official UoS website (exact URL(s) to be confirmed in a later phase)
    uos_study_plan_base_url: str = os.getenv("UOS_STUDY_PLAN_BASE_URL", "")


settings = Settings()
