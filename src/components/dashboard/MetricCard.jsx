// src/components/dashboard/MetricCard.jsx
import React from "react";
import { Paper, Box, Typography } from "@mui/material";

function MetricCard({ icon, title, value }) {
  return (
    <Paper sx={{ p: 2, display: "flex", borderRadius: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          width: 70,
          height: 70,
          borderRadius: 1,
        }}>
        {icon}
      </Box>
      <Box sx={{ ml: 2 }}>
        <Typography color="textSecondary" variant="body2">
          {title}
        </Typography>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}

export default MetricCard;
