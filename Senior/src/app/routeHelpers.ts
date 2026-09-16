/**
 * Mock request IDs are formatted like "#RC-2026-088". The leading "#"
 * isn't a valid/clean URL path segment, so route params strip it and
 * these two helpers convert between the two forms consistently.
 *
 * Once a real backend exists, route params would carry whatever
 * identifier the FastAPI backend actually uses — this is a
 * mock-data-era convenience, not a schema decision.
 */
/**
 * Convert a DB Request_ID (e.g. "STUD_RSCA_RSCA_000005") into a URL-safe slug
 * (e.g. "stud-rsca-rsca-000005").
 */
export function toRequestSlug(requestId: string): string {
  return requestId.replace(/#/g, '').replace(/_/g, '-').toLowerCase();
}

/**
 * Reverse the transformation: slug back to DB Request_ID
 * (e.g. "stud-rsca-rsca-000005" -> "STUD_RSCA_RSCA_000005").
 */
export function fromRequestSlug(slug: string): string {
  return slug.replace(/-/g, '_').toUpperCase();
}