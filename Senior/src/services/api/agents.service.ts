// src/services/api/agents.service.ts
// The dashboard's "messenger" to the Python backend that runs the agents.

const AGENT_API_URL =
  import.meta.env.VITE_AGENT_API_URL ?? 'http://localhost:8000';

// Mirrors the agent's FinalAgentResult (prioritize_raise_capacity_request).
export interface PrioritizationResult {
  requestId: string;
  priority: string; // exactly what Gemini decided
  reasoning: string;
  factorExplanations: Record<string, string>;
  keyEvidence: string[];
}

export async function prioritizeRaiseCapacityRequest(
  requestId: string
): Promise<PrioritizationResult> {
  const res = await fetch(
    `${AGENT_API_URL}/agents/raise-capacity/prioritize`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request_id: requestId }),
    }
  );

  if (!res.ok) {
    throw new Error(`Prioritization failed (${res.status})`);
  }

  const data = await res.json();
  return {
    requestId: data.request_id ?? requestId,
    priority: data.priority,
    reasoning: data.reasoning,
    factorExplanations: data.factor_explanations ?? {},
    keyEvidence: data.key_evidence ?? [],
  };
}