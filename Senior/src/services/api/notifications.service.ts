import { UserRole, NotificationItem } from '../../types';
import { apiClient } from './client';

/**
 * FUTURE BACKEND BOUNDARY — NOT YET CALLED ANYWHERE
 *
 * Currently sourced from src/mocks/notifications.mock.ts
 * (studentNotifications / adminNotifications), used by Header.tsx.
 *
 * Future source: FastAPI → backend (TBD — backend persistence
 * decision; this data is plausibly document-shaped — an
 * append-only, loosely-structured feed — but that has not been
 * confirmed, so it is not assumed to be MongoDB specifically).
 *
 * `unreadCount` is kept separate from `items.length` deliberately —
 * see the mock file's own comment: the dropdown only shows the most
 * recent few notifications, while the badge reflects a total unread
 * count that may exceed what's displayed.
 */
export interface NotificationsResponse {
  unreadCount: string;
  items: NotificationItem[];
}

export function getNotifications(role: UserRole): Promise<NotificationsResponse> {
  return apiClient.get<NotificationsResponse>(`/notifications?role=${role}`);
}
