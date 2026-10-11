"""
Supabase client foundation.

This module only builds a connected client. It does not query any table
(Request, Raise_Capacity, Student, Program, Course, Takes, Section) — those
retrieval functions belong to app/retrieval in a later phase.
"""

from supabase import Client, create_client

from app.config import settings


def get_supabase_client() -> Client:
    if not settings.supabase_url or not settings.supabase_key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_KEY must be set in the environment "
            "(see .env.example)."
        )
    return create_client(settings.supabase_url, settings.supabase_key)
