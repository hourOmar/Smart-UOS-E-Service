"""
Manual/live check: retrieves UoS academic evidence for one course from
the real, official CS degree page. Read-only — makes a single GET
request, modifies nothing.

Run:
    python -m scripts.check_uos_course <COURSE_ID>
"""

import sys

from app.retrieval.uos_academic_info import get_uos_course_evidence


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: python -m scripts.check_uos_course <COURSE_ID>")
        raise SystemExit(1)

    course_id = int(sys.argv[1])
    evidence = get_uos_course_evidence(course_id)
    print(evidence.model_dump_json(indent=2))


if __name__ == "__main__":
    main()
