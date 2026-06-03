import { Log } from "../logging_middleware/src/index";
const NOTIFICATIONS_API =
  "http://4.224.186.213/evaluation-service/notifications";
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkljoiaHR0cDovL2xvY2FsSG9zdC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzeTA2MDkzNjBAZ21haWwuY29tIiwiZXhwIjoxNzgwNDc0NzYxLCJpYXQiOjE3ODA0NzExNjEsImlzcyI6Imh0dHA6Ly80LjIyNC4xODYuMjEzIiwianRpIjoiZTc0YTVmMzEtNDk0Zi05YVmLTNjYTBkTZkNjY2ZClsImxvY2FsSG9zdCI6IkpXVCIsIm5hbWUiOiJzaHViaGFtIHlhZGF2Iiwicm9sbE5vIjoiMjMzMDI4NiIsInN1YiI6IjM5NTU3Nzg2LTFiNjYtNGE5Ny1hYjIzLWM1NzlmMTI2YTM5NyJ9fQ.BJsjY_fEPO-K5ftL3F8OWBd4GB1GdohfBC1_WWNw2A4";

// ------- Types -------
interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

interface NotificationsResponse {
  notifications: Notification[];
}

// ------- Weight map: Placement > Result > Event -------
const TYPE_WEIGHT: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

// ------- Fetch all notifications -------
async function fetchNotifications(): Promise<Notification[]> {
  Log("frontend", "info", "api", "Fetching all notifications from evaluation service");

  const response = await fetch(NOTIFICATIONS_API, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    Log("frontend", "error", "api", `Failed to fetch notifications: ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch notifications: ${response.statusText}`);
  }

  const data: NotificationsResponse = await response.json();
  Log("frontend", "info", "api", `Fetched ${data.notifications.length} notifications successfully`);
  return data.notifications;
}

// ------- Priority Score Calculation -------
// Score = typeWeight * 1,000,000 + recencyScore (newer = higher unix ms)
function getPriorityScore(notification: Notification): number {
  const typeWeight = TYPE_WEIGHT[notification.Type] ?? 0;
  const recencyScore = new Date(notification.Timestamp).getTime();
  return typeWeight * 1_000_000_000_000 + recencyScore;
}

// ------- Get Top N priority notifications -------
function getTopNNotifications(
  notifications: Notification[],
  n: number = 10
): Notification[] {
  Log("frontend", "debug", "utils", `Calculating priority scores for ${notifications.length} notifications`);

  const scored = notifications.map((n) => ({
    notification: n,
    score: getPriorityScore(n),
  }));

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, n).map((s) => s.notification);
  Log("frontend", "info", "utils", `Top ${n} priority notifications selected: ${top.map(n => n.Type).join(", ")}`);
  return top;
}

// ------- Main -------
async function main() {
  try {
    Log("frontend", "info", "page", "Priority Inbox algorithm starting");

    const allNotifications = await fetchNotifications();
    const topN = getTopNNotifications(allNotifications, 10);

    console.log("\n===== TOP 10 PRIORITY NOTIFICATIONS =====\n");
    topN.forEach((n, i) => {
      console.log(`${i + 1}. [${n.Type}] ${n.Message}`);
      console.log(`   ID: ${n.ID}`);
      console.log(`   Timestamp: ${n.Timestamp}`);
      console.log(`   Priority Score: ${getPriorityScore(n)}`);
      console.log("---");
    });

    Log("frontend", "info", "page", "Priority Inbox algorithm completed successfully");
  } catch (err) {
    Log("frontend", "fatal", "page", `Priority Inbox algorithm failed: ${err}`);
    console.error("Error:", err);
  }
}

main();