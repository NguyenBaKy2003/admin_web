import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { fetchRevenueData } from "../data/mockData.js";

function RevenueChart() {
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchRevenueData();
      setRevenueData(data);
    };
    loadData();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-xl p-5">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        30 Day Revenue History
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={revenueData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4F46E5" // Màu tím đậm Tailwind
            strokeWidth={2.5}
            dot={false}
          />
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
          <XAxis dataKey="date" className="text-gray-500" />
          <YAxis
            tickFormatter={(value) => `${(value / 1e6).toFixed(2)} TR`}
            className="text-gray-500"
          />
          <Tooltip
            formatter={(value) => `${value.toLocaleString()} VND`}
            contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;
