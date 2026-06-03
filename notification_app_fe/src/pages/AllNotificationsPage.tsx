import {
  Box, Typography, CircularProgress, Alert, Button,
  Select, MenuItem, FormControl, InputLabel, Stack,
  Pagination, TextField, Tooltip, IconButton, Badge
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationCard } from "../components/NotificationCard";
import { Log } from "../utils/logger";
import { useEffect } from "react";
import type { NotificationType } from "../types/notification";

export default function AllNotificationsPage() {
  const {
    notifications, loading, error, filterType, setFilterType,
    page, setPage, limit, setLimit, markAsViewed, markAllViewed,
    isViewed, unreadCount, reload,
  } = useNotifications();

  useEffect(() => {
    Log("frontend", "info", "page", "All Notifications page mounted");
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h5" fontWeight={700}>All Notifications</Typography>
          <Badge badgeContent={unreadCount} color="error">
            <Box sx={{ width: 8 }} />
          </Badge>
          <Typography variant="body2" color="text.secondary">({unreadCount} unread)</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Mark all as viewed">
            <IconButton onClick={markAllViewed} color="primary"><DoneAllIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton onClick={reload}><RefreshIcon /></IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filterType}
            label="Type"
            onChange={(e) => {
              Log("frontend", "info", "component", `Filter changed to: ${e.target.value || "all"}`);
              setFilterType(e.target.value as NotificationType | "");
              setPage(1);
            }}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Per page"
          type="number"
          value={limit}
          onChange={(e) => {
            const val = Math.max(1, parseInt(e.target.value) || 10);
            setLimit(val);
            setPage(1);
          }}
          sx={{ width: 100 }}
          inputProps={{ min: 1, max: 100 }}
        />
      </Stack>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          <Button size="small" onClick={reload} sx={{ ml: 2 }}>Retry</Button>
        </Alert>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}

      {!loading && notifications.map((n) => (
        <NotificationCard
          key={n.ID}
          notification={n}
          isViewed={isViewed(n.ID)}
          onView={markAsViewed}
        />
      ))}

      {!loading && notifications.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={Math.ceil(100 / limit)}
            page={page}
            onChange={(_, val) => {
              Log("frontend", "info", "component", `Navigated to page ${val}`);
              setPage(val);
            }}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}