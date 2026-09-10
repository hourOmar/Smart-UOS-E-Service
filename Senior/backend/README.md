# Backend

Server-side of Smart UoS E-Service. Per
[docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) this is the only planned
backend service: FastAPI owns all Supabase/MongoDB access and all
LLM/agent execution. The React frontend never holds a provider API key.

## Status

Bootstrapping. So far this contains **only** the Gemini API connection
setup and the Supabase/PostgreSQL connection setup — no FastAPI app, no
routes, and no agent logic yet. The first agent (Raise Capacity) is not
built.

## Layout

```
backend/
├── app/
│   ├── config.py            # loads backend/.env: GEMINI_API_KEY / GEMINI_MODEL / DATABASE_URL
│   └── services/
│       ├── gemini.py        # reusable Gemini client (google-genai SDK)
│       └── database.py      # reusable Postgres access (SQLAlchemy 2.x + psycopg 3)
├── requirements.txt
├── .env.example             # GEMINI_API_KEY= / DATABASE_URL=
└── .env                     # real secrets, git-ignored, you create this
```

## Setup

```
cd backend
python -m venv .venv
.venv\Scripts\activate            # Windows
pip install -r requirements.txt
copy .env.example .env            # then fill in the values
```

## Environment variables (`backend/.env`, server-side only)

| Name | Purpose | Where to get it |
|---|---|---|
| `GEMINI_API_KEY` | Gemini auth | Google AI Studio |
| `DATABASE_URL` | Supabase Postgres connection string (includes DB password) | Supabase dashboard → **Connect** → **Connection string** → **Transaction pooler** |

`DATABASE_URL` may be pasted as `postgres://…` or `postgresql://…`;
`database.py` normalizes it to `postgresql+psycopg://…` and enforces
`sslmode=require`.

These are **server-side** secrets. They must never appear in the frontend
`.env.local` or as `VITE_` variables, and the backend does not use the
`@supabase/supabase-js` package.
