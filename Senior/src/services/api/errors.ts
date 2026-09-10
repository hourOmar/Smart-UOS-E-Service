/**
 * Thrown by the API client when a future FastAPI request fails.
 * Kept intentionally small — this is not a general error framework,
 * just enough shape for callers to branch on HTTP status if needed.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly path: string;

  constructor(message: string, status: number, path: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.path = path;
  }
}
