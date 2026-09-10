"""
Reusable PostgreSQL access for the backend (Supabase database).

Connection strategy
-------------------
A direct PostgreSQL connection via SQLAlchemy 2.x + psycopg 3 — this is
Supabase's documented way to connect a server-side app or ORM, and it is
the standard database layer for FastAPI. It is deliberately NOT the
frontend ``@supabase/supabase-js`` package and NOT the PostgREST-based
``service_role`` REST client: future AI-agent tools need real SQL
(joins, aggregates, read-only query tools), which a SQLAlchemy ``Engine``
provides directly.

The connection string lives only in ``backend/.env`` as ``DATABASE_URL``
(server-side, never a ``VITE_*`` variable, never logged). This module is
independent of Gemini and of any agent logic.

Nothing here changes grants, RLS, schemas, or data — callers issue
read-only statements.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Any

from sqlalchemy import Engine, create_engine, text
from sqlalchemy.engine import Row

from app.config import require_database_url


def _normalize_url(url: str) -> str:
    """Force the SQLAlchemy + psycopg (v3) driver and TLS.

    Accepts whatever the Supabase dashboard hands out (``postgres://`` or
    ``postgresql://``) and returns a ``postgresql+psycopg://`` URL with
    ``sslmode=require`` (Supabase requires TLS).
    """
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://") :]
    if url.startswith("postgresql://"):
        url = "postgresql+psycopg://" + url[len("postgresql://") :]
    if "sslmode=" not in url:
        url += ("&" if "?" in url else "?") + "sslmode=require"
    return url


@lru_cache(maxsize=1)
def get_engine() -> Engine:
    """Return a process-wide singleton SQLAlchemy Engine for Supabase.

    ``pool_pre_ping`` keeps pooled connections healthy across the idle
    gaps typical of a request/agent workload. ``prepare_threshold=None``
    disables implicit server-side prepared statements so the engine works
    behind Supabase's transaction pooler (pgbouncer), and is harmless on
    the session pooler / a direct connection.
    """
    return create_engine(
        _normalize_url(require_database_url()),
        pool_pre_ping=True,
        future=True,
        connect_args={"prepare_threshold": None},
    )


def fetch_rows(sql: str, params: dict[str, Any] | None = None) -> list[Row[Any]]:
    """Run a single read-only SQL statement and return the rows.

    Intended for SELECTs. Parameters are bound (``:name`` placeholders),
    never string-formatted into the SQL.
    """
    with get_engine().connect() as conn:
        result = conn.execute(text(sql), params or {})
        return list(result.fetchall())
