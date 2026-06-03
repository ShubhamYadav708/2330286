const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";

const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkljoiaHR0cDovL2xvY2FsSG9zdC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzeTA2MDkzNjBAZ21haWwuY29tIiwiZXhwIjoxNzgwNDc0NzYxLCJpYXQiOjE3ODA0NzExNjEsImlzcyI6Imh0dHA6Ly80LjIyNC4xODYuMjEzIiwianRpIjoiZTc0YTVmMzEtNDk0Zi05YVmLTNjYTBkTZkNjY2ZClsImxvY2FsSG9zdCI6IkpXVCIsIm5hbWUiOiJzaHViaGFtIHlhZGF2Iiwicm9sbE5vIjoiMjMzMDI4NiIsInN1YiI6IjM5NTU3Nzg2LTFiNjYtNGE5Ny1hYjIzLWM1NzlmMTI2YTM5NyJ9fQ.BJsjY_fEPO-K5ftL3F8OWBd4GB1GdohfBC1_WWNw2A4";

type Stack = "frontend" | "backend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type FrontendPackage =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style"
  | "auth"
  | "config"
  | "middleware"
  | "utils";
type BackendPackage =
  | "cache"
  | "controller"
  | "cron_job"
  | "db"
  | "domain"
  | "route"
  | "service"
  | "auth"
  | "config"
  | "middleware"
  | "utils";

type Package = FrontendPackage | BackendPackage;

export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<void> {
  try {
    const response = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });

    if (!response.ok) {
      console.error(
        `[Logger] Failed to send log: ${response.status} ${response.statusText}`
      );
    }
  } catch (err) {
    console.error("[Logger] Error sending log:", err);
  }
}