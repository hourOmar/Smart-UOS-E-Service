/**
 * Mock request IDs are formatted like "#RC-2026-088". The leading "#"
 * isn't a valid/clean URL path segment, so route params strip it and
 * these two helpers convert between the two forms consistently.
 *
 * Once a real backend exists, route params would carry whatever
 * identifier the FastAPI backend actually uses — this is a
 * mock-data-era convenience, not a schema decision.
 */
export function toRequestSlug(requestId: string): string {
  return requestId.replace(/^#/, '');
}

export function fromRequestSlug(slug: string): string {
  return slug.startsWith('#') ? slug : `#${slug}`;
}
