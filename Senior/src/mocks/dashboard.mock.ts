/**
 * PLACEHOLDER DASHBOARD METRICS
 *
 * TODO: Replace with a backend API response calculated from request
 * records.
 *
 * Future source:
 * FastAPI backend-calculated aggregate endpoint.
 * Persistence: TBD — backend persistence decision for the underlying
 * request records this would be calculated from.
 *
 * Do not leave this hardcoded in production.
 */
export const adminDashboardStats = {
  pendingRequests: '[124]',
  highPriority: '[32]',
  approvedRequests: '[86]',
  avgProcessingTime: '[2 days]',
};

export const studentDashboardStats = {
  totalRequests: '[24]',
  pending: '[4]',
  approved: '[16]',
  rejected: '[4]',
};

/**
 * PLACEHOLDER — CONSOLIDATED REQUEST-TYPE COUNTS
 *
 * This replaces two previously-duplicated copies of the same numbers:
 * a dead `requestTypeCards` array that used to live here (never
 * imported anywhere — deleted in the Phase 9 cleanup) and a
 * locally-hardcoded array inside AdminDashboard.tsx. Both copies held
 * identical pending/total values for all 5 request types, so they
 * were merged into this single source. AdminDashboard.tsx now looks
 * up these counts by request-type id instead of hardcoding them
 * locally.
 *
 * Note: StudentDashboard.tsx does not currently display pending/total
 * counts on its request-type cards at all (only an ETA + status
 * badge), so nothing there needed to change to consume this.
 *
 * TODO: Replace with backend-calculated per-request-type counts.
 * Future source:
 * FastAPI backend-calculated endpoint, grouped by request type.
 * Persistence: TBD — backend persistence decision.
 */
export const requestTypeCounts: Record<string, { pending: string; total: string }> = {
  rc: { pending: '[18] pending', total: '[38] total' },
  ie: { pending: '[8] pending', total: '[22] total' },
  gc: { pending: '[12] pending', total: '[28] total' },
  pc: { pending: '[15] pending', total: '[24] total' },
  ce: { pending: '[10] pending', total: '[18] total' },
};
