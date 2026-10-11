"""
Manual/live check: retrieves the full Supabase evidence for one real
Raise Capacity Request_ID from your actual Supabase project.

Run:
    python -m scripts.check_raise_capacity_request <REQUEST_ID>
"""

import sys

from app.retrieval.evidence import get_supabase_evidence


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: python -m scripts.check_raise_capacity_request <REQUEST_ID>")
        raise SystemExit(1)

    request_id = sys.argv[1]
    evidence = get_supabase_evidence(request_id)
    print(evidence.model_dump_json(indent=2))


if __name__ == "__main__":
    main()
