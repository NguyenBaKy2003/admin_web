import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Lỗi khi lấy danh sách đơn hàng:", err))
      .finally(() => setLoading(false));
  }, []);

  // Xóa đơn hàng
  const cancelOrder = async (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này không?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setOrders(orders.filter((order) => order.id !== id));
      alert("Đơn hàng đã được hủy.");
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      alert("Không thể hủy đơn hàng.");
    }
  };

  // Lọc đơn hàng
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.totalAmount.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "PROCESSING":
        return "bg-blue-500";
      case "SHIPPED":
        return "bg-purple-500";
      case "DELIVERED":
        return "bg-green-500";
      default:
        return "bg-red-500";
    }
  };

  const getStatusTranslation = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lý";
      case "PROCESSING":
        return "Đang xử lý";
      case "SHIPPED":
        return "Đang giao";
      case "DELIVERED":
        return "Đã giao";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Danh Sách Đơn Hàng
        </h2>
        <p className="text-gray-600">
          Quản lý và theo dõi tất cả đơn hàng của bạn
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hoặc giá trị..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="PROCESSING">Đang xử lý</option>
            <option value="SHIPPED">Đang giao</option>
            <option value="DELIVERED">Đã giao</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow border-l-4 border-blue-500">
          <p className="text-gray-500 font-medium">Tổng Đơn Hàng</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow border-l-4 border-green-500">
          <p className="text-gray-500 font-medium">Đơn Đã Giao</p>
          <p className="text-2xl font-bold">
            {orders.filter((order) => order.status === "DELIVERED").length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow border-l-4 border-yellow-500">
          <p className="text-gray-500 font-medium">Đơn Chờ Xử Lý</p>
          <p className="text-2xl font-bold">
            {orders.filter((order) => order.status === "PENDING").length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-4 text-left font-medium">Mã Đơn</th>
                  <th className="p-4 text-left font-medium hidden md:table-cell">
                    Ngày Đặt
                  </th>
                  <th className="p-4 text-left font-medium">Trạng Thái</th>
                  <th className="p-4 text-right font-medium hidden md:table-cell">
                    Tổng Tiền
                  </th>
                  <th className="p-4 text-center font-medium">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-800">
                      {order.orderNumber}
                    </td>
                    <td className="p-4 text-gray-600 hidden md:table-cell">
                      {new Date(order.orderDate).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                          order.status
                        )}`}>
                        {getStatusTranslation(order.status)}
                      </span>
                    </td>
                    <td className="p-4 text-right text-gray-800 font-medium hidden md:table-cell">
                      {order.totalAmount.toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition text-sm font-medium"
                          onClick={() => navigate(`/orders/${order.id}`)}>
                          Chi tiết
                        </button>
                        {order.status !== "DELIVERED" &&
                          order.status !== "CANCELLED" && (
                            <button
                              className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition text-sm font-medium"
                              onClick={() => cancelOrder(order.id)}>
                              Hủy
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-2">Không tìm thấy đơn hàng nào</p>
            <p className="text-gray-400 text-sm">
              Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderList;
