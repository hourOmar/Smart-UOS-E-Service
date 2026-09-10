import { API_BASE_URL } from './config';
import { ApiError } from './errors';

/**
 * TEMPORARY AUTHENTICATION
 *
 * No auth header is attached here because the current login is a
 * simulated, client-side-only prototype (see LoginPage.tsx) with
 * nothing real to send. Once real authentication exists, this is
 * where a session token would be attached to outgoing requests.
 *
 * TODO: Replace with the final authentication mechanism before
 * production deployment.
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(`Request to ${path} failed with status ${response.status}`, response.status, path);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

/**
 * FUTURE BACKEND BOUNDARY
 *
 * The only place in the frontend that is allowed to talk to the
 * network for application data. Every request goes to FastAPI
 * (API_BASE_URL) — never directly to Supabase, MongoDB, or an LLM
 * provider. FastAPI owns those integrations.
 *
 * Nothing in the current application calls this yet; every page still
 * reads local mock data (src/mocks/, and each feature's mocks/
 * folder). This client exists so future service modules — see
 * requests.service.ts, users.service.ts, and each feature's api/
 * folder — have one consistent, typed place to issue HTTP requests
 * once the backend exists.
 */
export const apiClient = {
  get: <T>(path: string): Promise<T> => request<T>(path, { method: 'GET' }),

  post: <T>(path: string, body?: unknown): Promise<T> =>
    request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),

  patch: <T>(path: string, body?: unknown): Promise<T> =>
    request<T>(path, { method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined }),
};
