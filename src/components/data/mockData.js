import axios from "axios";
import { getAuthHeader } from "../data/authHeader.js"; // hoặc điều chỉnh lại path

// Lấy tổng hợp số liệu
export const fetchMetrics = async () => {
  try {
    const [ordersRes, usersRes, reviewsRes] = await Promise.all([
      axios.get("https://backend.kadoma.vn/api/orders", getAuthHeader()),
      axios.get("https://backend.kadoma.vn/api/users", getAuthHeader()),
      axios.get("https://backend.kadoma.vn/api/reviews", getAuthHeader()),
    ]);

    const orders = ordersRes.data;

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const formattedRevenue = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(totalRevenue);

    return {
      totalRevenue: formattedRevenue,
      totalOrders: orders.length,
      totalCustomers: usersRes.data.length,
      totalReviews: reviewsRes.data.length,
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu tổng hợp:", error);
    return {
      totalRevenue: "0.00",
      totalOrders: 0,
      totalCustomers: 0,
      totalReviews: 0,
    };
  }
};

// Lấy dữ liệu doanh thu theo ngày
export const fetchRevenueData = async () => {
  try {
    const response = await axios.get(
      "https://backend.kadoma.vn/api/orders",
      getAuthHeader()
    );
    const orders = response.data;

    const revenueByDate = {};
    orders.forEach((order) => {
      const date = order.orderDate.split("T")[0];
      if (!revenueByDate[date]) {
        revenueByDate[date] = 0;
      }
      revenueByDate[date] += order.totalAmount;
    });

    return Object.keys(revenueByDate)
      .map((date) => ({
        date,
        value: revenueByDate[date],
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
    return [];
  }
};

// Lấy danh sách khách hàng mới
export const fetchNewCustomers = async () => {
  try {
    const response = await axios.get(
      "https://backend.kadoma.vn/api/users",
      getAuthHeader()
    );
    return response.data.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar || "https://randomuser.me/api/portraits/men/39.jpg",
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khách hàng mới:", error);
    return [];
  }
};

// Lấy đánh giá chờ duyệt
export const fetchPendingReviews = async () => {
  try {
    const response = await axios.get(
      "https://backend.kadoma.vn/api/reviews",
      getAuthHeader()
    );
    return response.data.map((review) => ({
      id: review.id,
      name: review.user
        ? `${review.user.firstName} ${review.user.lastName}`
        : "Anonymous",
      avatar:
        review.user?.avatar ||
        "https://randomuser.me/api/portraits/women/28.jpg",
      text: review.comment?.trim()
        ? review.comment
        : "Không có nội dung đánh giá.",
      productName: review.product?.name || "Sản phẩm không xác định",
      productImage:
        review.product?.primaryImage?.url || "https://via.placeholder.com/100",
      rating: review.rating || 0,
      reviewDate: review.reviewDate
        ? new Date(review.reviewDate).toLocaleDateString("vi-VN")
        : "Không xác định",
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đánh giá:", error);
    return [];
  }
};
