import React, { useEffect, useState } from "react";
import { Paper, Typography, Grid, Box, Avatar } from "@mui/material";
import { fetchNewCustomers } from "../data/mockData.js";

function NewCustomers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const getCustomers = async () => {
      const data = await fetchNewCustomers();
      setCustomers(data);
    };

    getCustomers();
  }, []);

  return (
    <Paper sx={{ p: 2, borderRadius: 1 }}>
      <Typography variant="h6" component="div" gutterBottom>
        New Customers
      </Typography>
      <Grid container spacing={2}>
        {customers.map((customer) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={customer.id}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 1,
              }}>
              <Avatar
                alt={customer.name}
                src={customer.avatar || "https://via.placeholder.com/56"}
                sx={{ width: 56, height: 56, mb: 1 }}
              />
              <Typography variant="body2" align="center">
                {customer.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default NewCustomers;
