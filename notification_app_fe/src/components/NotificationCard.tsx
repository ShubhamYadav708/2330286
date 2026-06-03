import {
  Card, CardContent, Typography, Chip, Box, IconButton, Tooltip
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import EventIcon from "@mui/icons-material/Event";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import type { Notification } from "../types/notification";
import { Log } from "../utils/logger";

interface Props {
  notification: Notification;
  isViewed: boolean;
  onView: (id: string) => void;
  showScore?: boolean;
  score?: number;
}

const TYPE_CONFIG = {
  Placement: { color: "success" as const, icon: <WorkIcon fontSize="small" /> },
  Result: { color: "warning" as const, icon: <SchoolIcon fontSize="small" /> },
  Event: { color: "info" as const, icon: <EventIcon fontSize="small" /> },
};

export function NotificationCard({ notification, isViewed, onView, showScore, score }: Props) {
  const config = TYPE_CONFIG[notification.Type];

  const handleView = () => {
    if (!isViewed) {
      Log("frontend", "info", "component", `User viewed notification: ${notification.ID} [${notification.Type}]`);
      onView(notification.ID);
    }
  };

  return (
    <Card
      elevation={isViewed ? 1 : 3}
      sx={{
        mb: 1.5,
        borderLeft: 4,
        borderColor: isViewed ? "grey.300" : `${config.color}.main`,
        opacity: isViewed ? 0.75 : 1,
        transition: "all 0.2s ease",
        cursor: "pointer",
        "&:hover": { elevation: 4, transform: "translateX(2px)" },
      }}
      onClick={handleView}
    >
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1} flex={1}>
            {!isViewed && (
              <FiberManualRecordIcon sx={{ fontSize: 10, color: `${config.color}.main` }} />
            )}
            <Chip
              icon={config.icon}
              label={notification.Type}
              color={config.color}
              size="small"
              variant={isViewed ? "outlined" : "filled"}
            />
            <Typography
              variant="body2"
              fontWeight={isViewed ? 400 : 600}
              sx={{ flex: 1 }}
            >
              {notification.Message}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            {showScore && score !== undefined && (
              <Typography variant="caption" color="text.secondary">
                Score: {score.toLocaleString()}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              {new Date(notification.Timestamp).toLocaleString()}
            </Typography>
            {!isViewed && (
              <Tooltip title="Mark as viewed">
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); handleView(); }}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}