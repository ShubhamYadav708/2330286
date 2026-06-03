import {
  Box, Typography, CircularProgress, Alert, Button,
  Slider, Stack, Chip, Tooltip, IconButton
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useState, useEffect } from "react";
import { fetchNotifications } from "../api/notifications";
import { getTopNNotifications, getPriorityScore } from "../utils/priority";
import { NotificationCard } from "../components/NotificationCard";
import type { Notification } from "../types/notification";
import { Log } from "../utils/logger";

const VIEWED_KEY = "viewed_notification_ids";
function getViewedIds(): Set<string> {
  try {
    const stored = localStorage.getItem(VIEWED_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch { return new Set(); }
}
function saveViewedIds(ids: Set<string>) {
  localStorage.setItem(VIEWED_KEY, JSON.stringify(Array.from(ids)));
}

export default function PriorityInboxPage() {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [topN, setTopN] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<string>>(getViewedIds);

  const priorityNotifications = getTopNNotifications(allNotifications, topN);

  const load = async () => {
    setLoading(true);
    setError(null);
    Log("frontend", "info", "page", `Priority Inbox loading top ${topN} notifications`);
    try {
      const data = await fetchNotifications();
      setAllNotifications(data);
      Log("frontend", "info", "page", `Priority Inbox loaded ${data.length} notifications`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      Log("frontend", "error", "page", `Priority Inbox failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Log("frontend", "info", "page", "Priority Inbox page mounted");
    load();
  }, []);

  const markAsViewed = (id: string) => {
    setViewedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveViewedIds(next);
      return next;
    });
  };

  const typeCounts = {
    Placement: priorityNotifications.filter((n) => n.Type === "Placement").length,
    Result: priorityNotifications.filter((n) => n.Type === "Result").length,
    Event: priorityNotifications.filter((n) => n.Type === "Event").length,
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EmojiEventsIcon color="warning" />
          <Typography variant="h5" fontWeight={700}>Priority Inbox</Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={load}><RefreshIcon /></IconButton>
        </Tooltip>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Showing top <strong>{topN}</strong> notifications ranked by importance (Placement &gt; Result &gt; Event) and recency.
      </Typography>

      <Box sx={{ mb: 3, px: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Show top N: <strong>{topN}</strong>
        </Typography>
        <Slider
          value={topN}
          min={5}
          max={Math.max(20, allNotifications.length)}
          step={5}
          marks={[
            { value: 5, label: "5" },
            { value: 10, label: "10" },
            { value: 15, label: "15" },
            { value: 20, label: "20" },
          ]}
          onChange={(_, val) => setTopN(val as number)}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        <Chip label={`Placement: ${typeCounts.Placement}`} color="success" size="small" />
        <Chip label={`Result: ${typeCounts.Result}`} color="warning" size="small" />
        <Chip label={`Event: ${typeCounts.Event}`} color="info" size="small" />
      </Stack>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          <Button size="small" onClick={load} sx={{ ml: 2 }}>Retry</Button>
        </Alert>
      )}

      {!loading && priorityNotifications.map((n, i) => (
        <Box key={n.ID} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          <Typography variant="caption" sx={{ mt: 2, minWidth: 24, fontWeight: 700, color: i < 3 ? "warning.main" : "text.secondary" }}>
            #{i + 1}
          </Typography>
          <Box sx={{ flex: 1 }}>
            <NotificationCard
              notification={n}
              isViewed={viewedIds.has(n.ID)}
              onView={markAsViewed}
              showScore
              score={getPriorityScore(n)}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}