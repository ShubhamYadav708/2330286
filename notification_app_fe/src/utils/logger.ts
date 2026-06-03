const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN || "";

type Stack = "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package = "api" | "component" | "hook" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils";

export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<void> {
  try {
    await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
  } catch (err) {
    console.error("[Logger] Failed to send log:", err);
  }
}