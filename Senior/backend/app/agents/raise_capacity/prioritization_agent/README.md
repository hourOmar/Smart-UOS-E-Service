# Request Prioritization Agent for Raise Capacity

An AI agent that assigns a priority to a University of Sharjah **Raise Capacity** request (a student asking for a seat in a full section). Given a `Request_ID`, it gathers the relevant academic evidence, computes all factual values in Python, and asks Gemini to make an evidence-grounded prioritization decision under the university's prioritization policy.

## Pipeline

```
Request_ID
  -> Supabase retrieval       (request, student, course, section, Takes history)
  -> UoS curriculum retrieval (live CS degree page: categories, prerequisites, dependent courses, total credits)
  -> Local knowledge base     (course offerings, grade policy, prioritization policy)
  -> Deterministic evaluation (Python: terms, remaining credits, prerequisites, offerings, attempts, progression)
  -> Evidence package         (structured, with missing/conflicting evidence explicitly flagged)
  -> Gemini decision          (structured JSON output, validated with Pydantic)
  -> Final result             (priority, reasoning, per-factor explanations)
```

Python performs every deterministic calculation; Gemini only interprets the supplied evidence under the supplied policy. Technical failures (unknown `Request_ID`, API errors, invalid Gemini responses) raise errors and are never converted into a priority.

## Prioritization factors

1. Graduation proximity
2. Degree progress
3. Course requirement
4. Course availability
5. Previous attempts
6. Prerequisite completion
7. Academic progression

## Possible outputs

| Priority | Meaning |
|---|---|
| `HIGH` | Denying the request could delay the student's expected graduation. |
| `MEDIUM` | No graduation delay expected, but the course matters for academic progression. |
| `LOW` | No graduation delay and no significant progression impact. |
| `MANUAL_REVIEW` | Essential evidence is missing, unresolved, or materially conflicting. |

The full policy is in [`app/knowledge/raise_capacity/prioritization_rules.json`](app/knowledge/raise_capacity/prioritization_rules.json).

## Setup

Requires Python 3.11 or later.

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in your own values. `.env` is git-ignored and must never be committed.

| Variable | Required | Description |
|---|---|---|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_KEY` | Yes | Supabase API key (read access to the request tables) |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `GEMINI_MODEL` | Yes | Gemini model name, e.g. `gemini-2.5-pro` |
| `GEMINI_FALLBACK_MODELS` | No | Comma-separated models to try if the primary model returns a temporary 429/503 error |

## Usage

Run from the project root:

```bash
python -m scripts.run_agent <REQUEST_ID>
```

Diagnostic scripts for individual pipeline stages are in [`scripts/`](scripts/) and are run the same way, e.g. `python -m scripts.check_prioritization_evidence <REQUEST_ID>`.

## Tests

```bash
python -m pytest
```

The test suite runs offline: Supabase and Gemini are replaced with fakes, and UoS parsing is tested against a saved HTML fixture. No `.env` is needed to run the tests.

## Limitations

The agent reads curriculum data (course categories, prerequisites, dependent courses, total credits) from the live University of Sharjah Computer Science degree page at run time. If the page's structure changes, retrieval fails with an explicit error rather than producing incorrect evidence, and the parser in `app/retrieval/uos_html_parser.py` may need to be updated.
