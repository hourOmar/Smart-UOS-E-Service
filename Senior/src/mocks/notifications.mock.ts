import { NotificationItem } from '../types';

/**
 * PLACEHOLDER NOTIFICATION DATA
 *
 * TODO: Replace with data returned by the FastAPI backend.
 *
 * Future source:
 * FastAPI backend (notifications feed).
 * Persistence: TBD — backend persistence decision. Plausibly
 * document-shaped (an append-only, loosely-structured feed), but
 * that has not been confirmed, so this is not assumed to be MongoDB
 * specifically either.
 *
 * The `unreadCount` badge value is independent of `items.length` (the
 * dropdown only shows the most recent few, while the badge reflects a
 * total unread count) — preserve that distinction when wiring up the
 * real endpoint.
 *
 * Do not leave this hardcoded in production.
 */
export const studentNotifications: { unreadCount: string; items: NotificationItem[] } = {
  unreadCount: '[3]',
  items: [
    {
      id: 1,
      title: 'Raise Capacity Update',
      desc: 'Your request for Programming I (1501263) is under Department Review.',
      time: '10m ago',
      type: 'info',
    },
    {
      id: 2,
      title: 'Incomplete Exam Approved',
      desc: 'Make-up exam scheduled for Calculus I (1402101) on Mar 22, 2026.',
      time: '2h ago',
      type: 'success',
    },
    {
      id: 3,
      title: 'Advising Alert',
      desc: 'Please confirm your degree audit with Dr. Ahmed Al Mansoori.',
      time: '1d ago',
      type: 'warning',
    },
  ],
};

export const adminNotifications: { unreadCount: string; items: NotificationItem[] } = {
  unreadCount: '[8]',
  items: [
    {
      id: 1,
      title: 'New High Priority Request',
      desc: 'Student Saif Rashid submitted Raise Capacity for Section 31.',
      time: '5m ago',
      type: 'warning',
    },
    {
      id: 2,
      title: 'Medical Documentation Verified',
      desc: 'Incomplete exam document uploaded for MATH 101 review.',
      time: '25m ago',
      type: 'info',
    },
    {
      id: 3,
      title: 'Committee Meeting Scheduled',
      desc: 'Academic petitions committee convening Thursday at 11:00 AM.',
      time: '1h ago',
      type: 'info',
    },
  ],
};
