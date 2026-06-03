import { useState } from "react";
import {
  Box, CssBaseline, AppBar, Toolbar, Typography,
  Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, IconButton, useMediaQuery, useTheme
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MenuIcon from "@mui/icons-material/Menu";
import AllNotificationsPage from "./pages/AllNotificationsPage";
import PriorityInboxPage from "./pages/PriorityInboxPage";
import { Log } from "./utils/logger";

const DRAWER_WIDTH = 220;

const NAV_ITEMS = [
  { label: "All Notifications", icon: <NotificationsIcon />, page: "all" },
  { label: "Priority Inbox", icon: <EmojiEventsIcon />, page: "priority" },
];

export default function App() {
  const [activePage, setActivePage] = useState("all");
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleNav = (page: string) => {
    Log("frontend", "info", "page", `Navigated to ${page} page`);
    setActivePage(page);
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" px={2} mb={1}>
        CAMPUS NOTIFICATIONS
      </Typography>
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.page} disablePadding>
            <ListItemButton
              selected={activePage === item.page}
              onClick={() => handleNav(item.page)}
              sx={{
                borderRadius: 1, mx: 1,
                "&.Mui-selected": {
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                  "& .MuiListItemIcon-root": { color: "primary.contrastText" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} elevation={1}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <NotificationsIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={700} noWrap>Campus Notifications</Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { width: DRAWER_WIDTH } }}>
          {drawer}
        </Drawer>
        <Drawer variant="permanent"
          sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" } }}
          open>
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }, mt: 8, bgcolor: "grey.50", minHeight: "100vh" }}>
        {activePage === "all" && <AllNotificationsPage />}
        {activePage === "priority" && <PriorityInboxPage />}
      </Box>
    </Box>
  );
}