import type { Notification } from "../types/notification";

const TYPE_WEIGHT: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export function getPriorityScore(notification: Notification): number {
  const typeWeight = TYPE_WEIGHT[notification.Type] ?? 0;
  const recencyScore = new Date(notification.Timestamp).getTime();
  return typeWeight * 1_000_000_000_000 + recencyScore;
}

export function getTopNNotifications(
  notifications: Notification[],
  n: number = 10
): Notification[] {
  return [...notifications]
    .sort((a, b) => getPriorityScore(b) - getPriorityScore(a))
    .slice(0, n);
}