// src/components/layout/AppHeader.jsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Translate as TranslateIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

function AppHeader({ onDrawerToggle }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "white",
        color: "primary.main",
      }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { lg: "none" } }} // Ẩn khi lg trở lên
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, color: "primary.main", fontFamily: "cursive" }}>
          Admin Dashboard
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit">
            <TranslateIcon />
          </IconButton>
          <Typography variant="body2" sx={{ mx: 1 }}>
            ENGLISH
          </Typography>
          <IconButton color="inherit">
            <ExpandMoreIcon />
          </IconButton>
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
          <IconButton color="inherit">
            <RefreshIcon />
          </IconButton>
          <Avatar
            sx={{ ml: 2 }}
            alt="NBK"
            src="https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-6/344542573_1016776169700186_59734981782926054_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHE3pzgZ09WIumVk2SaUlzW8AfSrMmpN6nwB9Ksyak3qRO3GRAQCJN5k0u9DAbLgHWd1mkLGJGTGZQ8xITqFMmC&_nc_ohc=WeHIy021Iv0Q7kNvgEUyUis&_nc_oc=AdjW7d_n1k0KlNo0bl0LgiQKT6lBRgMflX4Xs8bJqNoW0G_FGDbTBRqTBW-K0cYFJgKqQQt_KcuscGCH3DgJCzza&_nc_zt=23&_nc_ht=scontent.fhan20-1.fna&_nc_gid=KWdBW0PCPtjMF_FmK9zkKw&oh=00_AYHwzruGMwu5QIyAMDyAbmpAIGbJe3NbJeaRx9cV6bLdtA&oe=67DB16C8"
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AppHeader;
