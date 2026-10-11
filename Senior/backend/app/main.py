"""
Smart UoS E-Service — FastAPI backend entry point.

Per docs/ARCHITECTURE.md Sec.4 and Sec.9, and app/config.py's own comments:
FastAPI owns all agent execution and all provider API keys. The React
frontend never talks to Gemini, Supabase, or MySQL directly -- it only
ever calls this server.

Prioritization flow (Raise Capacity):
  1. Look in Raise_Capacity for an already-saved result for this request.
     If there is one, return it immediately (the agent does NOT run again).
  2. Otherwise run the agent, save the full output to the database, return it.
  3. A per-request lock makes sure two callers asking for the same request
     at the same moment (student form + admin dashboard) only run the agent once.
"""

import json
import subprocess
import sys
import threading
from pathlib import Path

import psycopg
from psycopg.types.json import Json
from fastapi import FastAPI, HTTPException  # pyright: ignore[reportMissingImports]
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.config import require_database_url

app = FastAPI(title="Smart UoS E-Service Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BACKEND_DIR = Path(__file__).resolve().parents[1]
PRIORITIZATION_AGENT_DIR = (
    BACKEND_DIR / "app" / "agents" / "raise_capacity" / "prioritization_agent"
)
PRIORITIZATION_RUNNER = PRIORITIZATION_AGENT_DIR / "run_cli.py"


class PrioritizeRequest(BaseModel):
    request_id: str


# ---------------------------------------------------------------- locking
_locks_guard = threading.Lock()
_locks: dict[str, threading.Lock] = {}


def _lock_for(request_id: str) -> threading.Lock:
    with _locks_guard:
        return _locks.setdefault(request_id, threading.Lock())


# ------------------------------------------------------------ persistence
def _get_saved_result(request_id: str) -> dict | None:
    """Return the agent output already saved for this request, or None."""
    try:
        with psycopg.connect(require_database_url()) as conn:
            with conn.cursor() as cur:
                cur.execute(
                    'SELECT "Priority_Level", "Priority_Result" '
                    'FROM "Raise_Capacity" WHERE "Request_ID" = %s',
                    (request_id,),
                )
                row = cur.fetchone()
    except Exception as e:
        print(f"[prioritize] could not read saved result: {e!r}")
        return None

    if not row:
        return None
    level, result = row
    if level and isinstance(result, dict):
        return result
    return None


def _save_result(request_id: str, data: dict) -> None:
    """Persist the full agent output so it survives refreshes and the
    agent never needs to run again for this request."""
    clean = {k: v for k, v in data.items() if not k.startswith("_")}
    with psycopg.connect(require_database_url()) as conn:
        with conn.cursor() as cur:
            cur.execute(
                'UPDATE "Raise_Capacity" '
                'SET "Priority_Level" = %s, "Priority_Result" = %s '
                'WHERE "Request_ID" = %s',
                (clean["priority"], Json(clean), request_id),
            )
        conn.commit()


# ------------------------------------------------------------------ agent
def _run_prioritization_agent(request_id: str) -> dict:
    if not PRIORITIZATION_RUNNER.exists():
        raise HTTPException(
            status_code=500,
            detail=f"run_cli.py not found at {PRIORITIZATION_RUNNER}",
        )

    result = subprocess.run(
        [sys.executable, str(PRIORITIZATION_RUNNER), request_id],
        cwd=str(PRIORITIZATION_AGENT_DIR),
        capture_output=True,
        text=True,
        timeout=60,
    )

    if result.returncode != 0:
        print(f"[prioritize] AGENT FAILED — stderr: {result.stderr!r} | stdout: {result.stdout!r}")
        raise HTTPException(
            status_code=500,
            detail=f"Prioritization agent failed: {result.stderr or result.stdout}",
        )

    try:
        last_line = result.stdout.strip().splitlines()[-1]
        data = json.loads(last_line)
    except (json.JSONDecodeError, IndexError):
        print(f"[prioritize] UNPARSEABLE OUTPUT — full stdout: {result.stdout!r}")
        raise HTTPException(
            status_code=500,
            detail=f"Prioritization agent returned unparseable output: {result.stdout}",
        )

    if "error" in data:
        raise HTTPException(status_code=500, detail=data["error"])

    return data


# -------------------------------------------------------------- endpoints
@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/agents/raise-capacity/prioritize")
def prioritize_raise_capacity(payload: PrioritizeRequest):
    request_id = payload.request_id

    # Only one run per request at a time; a second caller waits here and then
    # finds the saved result below instead of running the agent again.
    with _lock_for(request_id):
        saved = _get_saved_result(request_id)
        if saved is not None:
            return {**saved, "cached": True}

        data = _run_prioritization_agent(request_id)

        try:
            _save_result(request_id, data)
        except Exception as e:
            print(f"[prioritize] PERSISTENCE FAILED: {e!r}")
            data["_persistence_warning"] = f"Priority computed but not saved: {e}"

        return data