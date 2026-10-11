"""
Live, read-only Phase 5 check: builds the complete final
PrioritizationEvidencePackage for one real Raise Capacity request and
prints it as readable JSON. Does NOT call Gemini and does NOT produce a
HIGH/MEDIUM/LOW decision — Phase 5 only assembles evidence.

Run:
    python -m scripts.check_prioritization_evidence <REQUEST_ID>
"""

import sys

from app.pipeline.build_prioritization_evidence import build_prioritization_evidence


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: python -m scripts.check_prioritization_evidence <REQUEST_ID>")
        raise SystemExit(1)

    request_id = sys.argv[1]
    package = build_prioritization_evidence(request_id)
    print(package.model_dump_json(indent=2))


if __name__ == "__main__":
    main()
