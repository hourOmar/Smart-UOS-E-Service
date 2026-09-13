import { supabase } from './client';

export interface NotificationRow {
  Notification_ID: number;
  Notification_Date: string;
  Message: string;
  Is_Read: boolean;
  Auth_User_ID: string;
  Request_ID: string | null;
}

/**
 * Retrieve notifications for one Auth user, most recent first.
 * Auth_User_ID matches auth.users.id directly — no email lookup needed.
 */
export async function listNotificationsForUser(
  authUserId: string
): Promise<NotificationRow[]> {
  const { data, error } = await supabase
    .from('Notification')
    .select('*')
    .eq('Auth_User_ID', authUserId)
    .order('Notification_Date', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error loading notifications:', error);
    throw error;
  }

  return (data ?? []) as NotificationRow[];
}

/** Marks every unread notification for this user as read. */
export async function markAllNotificationsRead(
  authUserId: string
): Promise<void> {
  const { error } = await supabase
    .from('Notification')
    .update({ Is_Read: true })
    .eq('Auth_User_ID', authUserId)
    .eq('Is_Read', false);

  if (error) {
    console.error('Error marking notifications read:', error);
    throw error;
  }
}
