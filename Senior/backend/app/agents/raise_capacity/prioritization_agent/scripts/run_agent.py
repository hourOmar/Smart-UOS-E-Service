"""
The first true end-to-end Agent 2 run: real Supabase, live UoS page,
local KB, Python deterministic evaluations, the Phase 5 evidence
package, the prioritization policy, and a live Gemini call.

Prints only Request_ID, Priority, Reasoning, and factor explanations —
never API keys, Supabase keys, or unnecessary PII.

Run:
    python -m scripts.run_agent <REQUEST_ID>
"""

import sys

from app.agent import prioritize_raise_capacity_request

_SEPARATOR = "=" * 70

_FACTOR_DISPLAY_NAMES = {
    "graduation": "Graduation",
    "degree_progress": "Degree Progress",
    "course_requirement": "Course Requirement",
    "course_availability": "Course Availability",
    "previous_attempts": "Previous Attempts",
    "prerequisite": "Prerequisite",
    "progression": "Progression",
}


def _print_result(result) -> None:
    print(_SEPARATOR)
    print("REQUEST PRIORITIZATION AGENT - RAISE CAPACITY")
    print(_SEPARATOR)
    print()
    print("PRIORITY ASSESSMENT")
    print()
    print("Request:")
    print(result.request_id)
    print()
    print("Priority:")
    print(result.priority)
    print()
    print("Reasoning:")
    print(result.reasoning)
    print()
    print("Factor Explanations:")
    print()
    for factor, explanation in result.factor_explanations.model_dump().items():
        display_name = _FACTOR_DISPLAY_NAMES.get(factor, factor.replace("_", " ").title())
        print(f"{display_name}:")
        print(explanation)
        print()
    if result.key_evidence:
        print("Key Evidence:")
        for item in result.key_evidence:
            print(f"- {item}")
        print()
    print(_SEPARATOR)
    print("AGENT TEST COMPLETE")
    print(_SEPARATOR)


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: python -m scripts.run_agent <REQUEST_ID>")
        raise SystemExit(1)

    request_id = sys.argv[1]
    result = prioritize_raise_capacity_request(request_id)
    _print_result(result)


if __name__ == "__main__":
    main()
