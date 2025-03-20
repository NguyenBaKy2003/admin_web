import React, { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom"; // Dùng Outlet để hiển thị các trang con
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";

// Sidebar width
const drawerWidth = 240;

function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppHeader
        onDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* Vùng hiển thị nội dung */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: "100%", lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
        }}>
        <Toolbar /> {/* Để tránh nội dung bị che khuất bởi AppHeader */}
        <Outlet /> {/* Nội dung sẽ được render dựa trên route */}
      </Box>
    </Box>
  );
}

export default MainLayout;
