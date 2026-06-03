import { Log } from "../utils/logger";
import type { Notification, NotificationsResponse, FetchNotificationsParams } from "../types/notification";

const BASE_URL = "http://4.224.186.213/evaluation-service";
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN || "";

export async function fetchNotifications(
  params: FetchNotificationsParams = {}
): Promise<Notification[]> {
  const query = new URLSearchParams();
  if (params.limit) query.set("limit", String(params.limit));
  if (params.page) query.set("page", String(params.page));
  if (params.notification_type) query.set("notification_type", params.notification_type);

  const url = `${BASE_URL}/notifications${query.toString() ? "?" + query.toString() : ""}`;

  Log("frontend", "info", "api", `Fetching notifications with params: ${JSON.stringify(params)}`);

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
  });

  if (!response.ok) {
    Log("frontend", "error", "api", `Notifications fetch failed: ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch notifications: ${response.statusText}`);
  }

  const data: NotificationsResponse = await response.json();
  Log("frontend", "info", "api", `Successfully fetched ${data.notifications.length} notifications`);
  return data.notifications;
}