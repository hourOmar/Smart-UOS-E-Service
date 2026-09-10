/**
 * Base URL of the future FastAPI backend, read from the
 * VITE_API_BASE_URL environment variable (see .env.example).
 *
 * Nothing in the current application calls the backend yet — this
 * exists so the API client boundary has a real configuration point
 * ready for when service functions are actually wired into pages.
 */
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
