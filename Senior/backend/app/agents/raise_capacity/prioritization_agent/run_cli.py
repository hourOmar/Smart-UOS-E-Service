"""
Standalone CLI entry point for the Prioritization Agent.
Runs as its own separate process so this agent's own `app` package never
collides with the main backend's `app` package.

Usage: python run_cli.py <request_id>
"""

import sys
import json

from app.agent import prioritize_raise_capacity_request


def _to_plain_dict(result) -> dict:
    if hasattr(result, "model_dump"):
        return result.model_dump()
    if hasattr(result, "dict"):
        return result.dict()
    if hasattr(result, "__dict__"):
        return dict(vars(result))
    return result


def main() -> None:
    if len(sys.argv) != 2:
        print(json.dumps({"error": "usage: run_cli.py <request_id>"}))
        sys.exit(1)

    request_id = sys.argv[1]

    try:
        result = prioritize_raise_capacity_request(request_id)
        print(json.dumps(_to_plain_dict(result)))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()