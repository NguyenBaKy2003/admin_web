import React, { useEffect, useState } from "react";
import { Grid, CircularProgress } from "@mui/material";
import MetricCard from "../components/dashboard/MetricCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import PendingReviews from "../components/dashboard/PendingReviews";
import NewCustomers from "../components/dashboard/NewCustormers.jsx";
import {
  MonetizationOn as MoneyIcon,
  ShoppingCart as ShoppingCartIcon,
  Message as MessageIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { fetchMetrics } from "../components/data/mockData.js"; // Import API

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      const data = await fetchMetrics();
      setMetrics(data);
      setLoading(false);
    };
    loadMetrics();
  }, []);

  if (loading) {
    return <CircularProgress />; // Hiển thị vòng tròn loading khi đang lấy dữ liệu
  }

  return (
    <>
      {/* Dashboard Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            icon={<MoneyIcon sx={{ fontSize: 40, color: "#3f51b5" }} />}
            title="Total Revenue"
            value={`${metrics.totalRevenue}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            icon={<ShoppingCartIcon sx={{ fontSize: 40, color: "#3f51b5" }} />}
            title="New Orders"
            value={metrics.totalOrders}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            icon={<MessageIcon sx={{ fontSize: 40, color: "#3f51b5" }} />}
            title="Pending Reviews"
            value={metrics.totalReviews}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            icon={<PersonAddIcon sx={{ fontSize: 40, color: "#3f51b5" }} />}
            title="New Customers"
            value={metrics.totalCustomers}
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <RevenueChart />
        </Grid>
        <Grid item xs={12} md={4}>
          <PendingReviews />
        </Grid>
        <Grid item xs={12}>
          <NewCustomers />
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
