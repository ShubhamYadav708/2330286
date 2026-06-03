export type NotificationType = "Placement" | "Result" | "Event";

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
}

export interface FetchNotificationsParams {
  limit?: number;
  page?: number;
  notification_type?: NotificationType | "";
}