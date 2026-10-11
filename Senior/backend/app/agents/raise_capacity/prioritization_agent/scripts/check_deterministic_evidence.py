"""
Live, read-only Phase 4 check: retrieves real Supabase evidence, real
UoS evidence, fetches the student's Takes records for the requested
course's prerequisite courses, and runs every Phase 4 deterministic
calculation. Prints the structured result only — no Gemini call, no
HIGH/MEDIUM/LOW decision.

Run:
    python -m scripts.check_deterministic_evidence <REQUEST_ID>
"""

import sys

from app.deterministic.evidence import build_deterministic_evidence
from app.deterministic.prerequisite_evaluator import required_prerequisite_course_ids
from app.integrations.supabase_client import get_supabase_client
from app.retrieval.evidence import get_supabase_evidence
from app.retrieval.prerequisite_history import get_takes_for_courses
from app.retrieval.uos_academic_info import get_uos_course_evidence


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: python -m scripts.check_deterministic_evidence <REQUEST_ID>")
        raise SystemExit(1)

    request_id = sys.argv[1]

    client = get_supabase_client()
    supabase_evidence = get_supabase_evidence(request_id, client=client)
    uos_evidence = get_uos_course_evidence(supabase_evidence.raise_capacity.course_id)

    required_course_ids = required_prerequisite_course_ids(uos_evidence.prerequisites)
    prerequisite_takes_records = get_takes_for_courses(
        client, supabase_evidence.student.student_id, required_course_ids
    )

    deterministic_evidence = build_deterministic_evidence(
        supabase_evidence, uos_evidence, prerequisite_takes_records
    )

    print(deterministic_evidence.model_dump_json(indent=2))


if __name__ == "__main__":
    main()
