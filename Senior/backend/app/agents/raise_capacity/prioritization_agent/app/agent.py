"""
Agent 2 entry point: the complete Request Prioritization Agent for
Raise Capacity, request_id in, final priority decision out.

    request_id
        -> build_prioritization_evidence(request_id)  
        -> load_prioritization_policy()               
        -> get_priority_decision(evidence, policy)      
        -> FinalAgentResult

Python assigns no priority anywhere in this
file; the value returned is exactly what Gemini decided.
"""

from app.pipeline.build_prioritization_evidence import build_prioritization_evidence
from app.pipeline.get_priority_decision import get_priority_decision
from app.pipeline.prioritization_policy import load_prioritization_policy
from app.schemas.priority_decision import FinalAgentResult


def prioritize_raise_capacity_request(request_id: str) -> FinalAgentResult:
    evidence = build_prioritization_evidence(request_id)
    policy = load_prioritization_policy()
    decision = get_priority_decision(evidence, policy)

    return FinalAgentResult(
        request_id=request_id,
        priority=decision.priority,
        reasoning=decision.reasoning,
        factor_explanations=decision.factor_explanations,
        key_evidence=decision.key_evidence,
    )
