import inspect

import app.agent as agent_module
from app.schemas.priority_decision import FactorExplanations, PriorityDecision
from tests.test_gemini_prompt import _evidence


def _fake_decision():
    return PriorityDecision(
        priority="MEDIUM",
        reasoning="Because of the evidence.",
        factor_explanations=FactorExplanations(
            graduation="g", degree_progress="d", course_requirement="c",
            course_availability="a", previous_attempts="p", prerequisite="pr", progression="prog",
        ),
        key_evidence=["Remaining credits: 33"],
    )


def test_request_id_passed_to_phase5_builder(monkeypatch):
    calls = {}

    def fake_build(request_id):
        calls["request_id"] = request_id
        return _evidence()

    monkeypatch.setattr(agent_module, "build_prioritization_evidence", fake_build)
    monkeypatch.setattr(agent_module, "load_prioritization_policy", lambda: {"priority_levels": {}})
    monkeypatch.setattr(agent_module, "get_priority_decision", lambda evidence, policy: _fake_decision())

    agent_module.prioritize_raise_capacity_request("REQ-99")
    assert calls["request_id"] == "REQ-99"


def test_policy_loaded(monkeypatch):
    calls = {"loaded": False}

    monkeypatch.setattr(agent_module, "build_prioritization_evidence", lambda request_id: _evidence())

    def fake_load_policy():
        calls["loaded"] = True
        return {"priority_levels": {}}

    monkeypatch.setattr(agent_module, "load_prioritization_policy", fake_load_policy)
    monkeypatch.setattr(agent_module, "get_priority_decision", lambda evidence, policy: _fake_decision())

    agent_module.prioritize_raise_capacity_request("REQ-1")
    assert calls["loaded"] is True


def test_evidence_and_policy_passed_to_gemini(monkeypatch):
    sentinel_evidence = _evidence()
    sentinel_policy = {"priority_levels": {"High": "..."}}
    received = {}

    monkeypatch.setattr(agent_module, "build_prioritization_evidence", lambda request_id: sentinel_evidence)
    monkeypatch.setattr(agent_module, "load_prioritization_policy", lambda: sentinel_policy)

    def fake_get_priority_decision(evidence, policy):
        received["evidence"] = evidence
        received["policy"] = policy
        return _fake_decision()

    monkeypatch.setattr(agent_module, "get_priority_decision", fake_get_priority_decision)

    agent_module.prioritize_raise_capacity_request("REQ-1")
    assert received["evidence"] is sentinel_evidence
    assert received["policy"] is sentinel_policy


def test_decision_returned(monkeypatch):
    monkeypatch.setattr(agent_module, "build_prioritization_evidence", lambda request_id: _evidence())
    monkeypatch.setattr(agent_module, "load_prioritization_policy", lambda: {"priority_levels": {}})
    monkeypatch.setattr(agent_module, "get_priority_decision", lambda evidence, policy: _fake_decision())

    result = agent_module.prioritize_raise_capacity_request("REQ-1")
    assert result.request_id == "REQ-1"
    assert result.priority == "MEDIUM"
    assert result.reasoning == "Because of the evidence."
    assert result.factor_explanations.graduation == "g"
    assert result.key_evidence == ["Remaining credits: 33"]


def test_no_python_priority_scoring_logic_exists():
    source = inspect.getsource(agent_module)
    assert '"HIGH"' not in source
    assert '"MEDIUM"' not in source
    assert '"LOW"' not in source
    assert '"MANUAL_REVIEW"' not in source


def test_technical_failure_propagates_not_swallowed(monkeypatch):
    from app.pipeline.priority_decision_errors import GeminiRequestError

    monkeypatch.setattr(agent_module, "build_prioritization_evidence", lambda request_id: _evidence())
    monkeypatch.setattr(agent_module, "load_prioritization_policy", lambda: {"priority_levels": {}})

    def failing_get_priority_decision(evidence, policy):
        raise GeminiRequestError("simulated failure")

    monkeypatch.setattr(agent_module, "get_priority_decision", failing_get_priority_decision)

    try:
        agent_module.prioritize_raise_capacity_request("REQ-1")
        assert False, "expected GeminiRequestError to propagate"
    except GeminiRequestError:
        pass
