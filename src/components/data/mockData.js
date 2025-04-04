import axios from "axios";

export const fetchMetrics = async () => {
  try {
    const [ordersRes, usersRes, reviewsRes] = await Promise.all([
      axios.get("https://backend.kadoma.vn/api/orders"),
      axios.get("https://backend.kadoma.vn/api/users"),
      axios.get("https://backend.kadoma.vn/api/reviews"),
    ]);

    const orders = ordersRes.data;

    // Tính tổng doanh thu từ danh sách đơn hàng
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const formattedRevenue = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "VND",
    }).format(totalRevenue);

    return {
      totalRevenue: formattedRevenue, // Doanh thu tổng, làm tròn 2 số thập phân
      totalOrders: orders.length, // Tổng số đơn hàng
      totalCustomers: usersRes.data.length, // Tổng số khách hàng
      totalReviews: reviewsRes.data.length, // Tổng số đánh giá
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
// Fetch revenue data from API
export const fetchRevenueData = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/orders");
    const orders = response.data;

    // Nhóm doanh thu theo ngày
    const revenueByDate = {};

    orders.forEach((order) => {
      const date = order.orderDate.split("T")[0]; // YYYY-MM-DD
      if (!revenueByDate[date]) {
        revenueByDate[date] = 0;
      }
      revenueByDate[date] += order.totalAmount;
    });

    // Chuyển đổi thành mảng để hiển thị trên biểu đồ
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

// Fetch new customers from API
export const fetchNewCustomers = async () => {
  try {
    const response = await axios.get("http://45.122.253.163:8891/api/users");
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

// Fetch pending reviews from API
export const fetchPendingReviews = async () => {
  try {
    const response = await axios.get("http://45.122.253.163:8891/api/reviews");
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
      rating: review.rating || 0, // Nếu không có thì hiển thị 0 sao
      reviewDate: review.reviewDate
        ? new Date(review.reviewDate).toLocaleDateString("vi-VN")
        : "Không xác định",
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đánh giá:", error);
    return [];
  }
};
