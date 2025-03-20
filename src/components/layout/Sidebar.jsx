import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  Category as CategoryIcon, // Icon cho Product
  People as PeopleIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

function Sidebar({ mobileOpen, handleDrawerToggle }) {
  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}>
        {sidebarContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open>
        {sidebarContent}
      </Drawer>
    </>
  );
}

const sidebarContent = (
  <div>
    <Toolbar>
      <Typography variant="h6" noWrap>
        Dashboard
      </Typography>
    </Toolbar>
    <Divider />
    <List>
      <ListItemButton component={Link} to="/">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>

      <ListItemButton component={Link} to="/orders">
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </ListItemButton>

      <ListItemButton component={Link} to="/customers">
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Customers" />
      </ListItemButton>
      <ListItemButton component={Link} to="/products">
        <ListItemIcon>
          <CategoryIcon />
        </ListItemIcon>
        <ListItemText primary="Products" />
      </ListItemButton>
      <ListItemButton component={Link} to="/categories">
        <ListItemIcon>
          <CategoryIcon />
        </ListItemIcon>
        <ListItemText primary="Categories" />
      </ListItemButton>

      <ListItemButton component={Link} to="/invoices">
        <ListItemIcon>
          <ReceiptIcon />
        </ListItemIcon>
        <ListItemText primary="Invoices" />
      </ListItemButton>

      <ListItemButton component={Link} to="/reviews">
        <ListItemIcon>
          <CommentIcon />
        </ListItemIcon>
        <ListItemText primary="Reviews" />
      </ListItemButton>
    </List>
  </div>
);

export default Sidebar;
