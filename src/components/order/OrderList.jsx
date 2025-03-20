import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <p className="text-center text-gray-600">Đang tải...</p>;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Danh Sách Đơn Hàng
        </h2>
      </div>

      {/* Table Responsive */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full bg-white">
          <thead className="bg-blue-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-3 text-left">Mã Đơn</th>
              <th className="p-3 text-left hidden md:table-cell">Ngày Đặt</th>
              <th className="p-3 text-left">Trạng Thái</th>
              <th className="p-3 text-right hidden md:table-cell">Tổng Tiền</th>
              <th className="p-3 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b transition hover:bg-gray-100">
                <td className="p-3">{order.orderNumber}</td>
                <td className="p-3 hidden md:table-cell">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-md text-white text-xs md:text-sm ${
                      order.status === "PENDING"
                        ? "bg-yellow-500"
                        : order.status === "PROCESSING"
                        ? "bg-blue-500"
                        : order.status === "SHIPPED"
                        ? "bg-purple-500"
                        : order.status === "DELIVERED"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}>
                    {order.status}
                  </span>
                </td>

                <td className="p-3 text-right hidden md:table-cell">
                  {order.totalAmount.toLocaleString()} ₫
                </td>
                <td className="p-3 flex justify-center space-x-2">
                  {/* Nút Xem */}
                  <button
                    className="bg-green-500 text-white p-2 text-xs md:text-sm rounded-md hover:bg-green-600 transition"
                    onClick={() => navigate(`/orders/${order.id}`)}>
                    Xem
                  </button>

                  {/* Nút Hủy */}
                  <button
                    className="bg-red-500 text-white p-2 text-xs md:text-sm rounded-md hover:bg-red-600 transition"
                    onClick={() => cancelOrder(order.id)}>
                    Hủy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderList;
