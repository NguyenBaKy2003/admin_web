import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS của thư viện

const API_URL = "http://localhost:8080/api/orders";
const ORDER_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/${id}`)
      .then((res) => {
        setOrder(res.data);
        setStatus(res.data.status);
      })
      .catch((err) => toast.error("Lỗi khi lấy đơn hàng!"));
  }, [id]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  const updateStatus = () => {
    axios
      .put(`${API_URL}/${id}/status`, { status })
      .then((res) => {
        setOrder(res.data);
        toast.success("Cập nhật trạng thái thành công!");
      })
      .catch((err) => toast.error("Lỗi khi cập nhật trạng thái!"));
  };

  if (!order) return <p className="text-center text-gray-600">Đang tải...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-xl">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Chi Tiết Đơn Hàng
      </h2>
      <p className="text-gray-600">
        Mã đơn: <span className="font-semibold">{order.orderNumber}</span>
      </p>
      <p className="text-gray-600">
        Ngày đặt:{" "}
        <span className="font-semibold">
          {new Date(order.orderDate).toLocaleDateString()}
        </span>
      </p>
      <p className="text-lg font-bold text-gray-800 mt-2">
        Tổng tiền:{" "}
        <span className="text-red-500">
          {order.totalAmount.toLocaleString()} ₫
        </span>
      </p>

      {/* Thông tin giao hàng */}
      {/* Thông tin giao hàng */}
      <div className="bg-gray-100 p-4 rounded-lg mt-4">
        <h3 className="text-lg font-bold text-gray-700">Thông Tin Giao Hàng</h3>
        <p className="text-gray-600">
          👤 Người nhận:{" "}
          <span className="font-semibold">
            {order.shippingDetail.recipientName}
          </span>
        </p>
        <p className="text-gray-600">
          📍 Địa chỉ:{" "}
          <span className="font-semibold">{order.shippingDetail.address}</span>
        </p>
        <p className="text-gray-600">
          📞 Số điện thoại:{" "}
          <span className="font-semibold">
            {order.shippingDetail.phoneNumber}
          </span>
        </p>
        <p className="text-gray-600">
          📧 Email:{" "}
          <span className="font-semibold">{order.shippingDetail.email}</span>
        </p>

        {/* Chọn trạng thái giao hàng */}
        <div className="mt-2">
          <label className="block text-gray-700 font-semibold">
            🚚 Trạng thái:
          </label>

          <select
            className={`mt-1 p-2 border border-2 rounded-md w-full md:w-auto ${
              statusColors[status] || "bg-gray-100 text-gray-700"
            }`}
            value={status}
            onChange={handleStatusChange}>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s} className={statusColors[s]}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <button
          className="mt-3 bg-green-600 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
          onClick={updateStatus}>
          ✔ Cập nhật trạng thái
        </button>
      </div>

      {/* Danh sách sản phẩm trong đơn hàng */}
      <h3 className="text-lg font-bold mt-4">Sản Phẩm Trong Đơn Hàng</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Hình Ảnh</th>
              <th className="p-3 border">Tên Sản Phẩm</th>
              <th className="p-3 border">Số Lượng</th>
              <th className="p-3 border">Đơn Giá</th>
              <th className="p-3 border">Tổng Tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.orderDetails.map((detail) => (
              <tr key={detail.id} className="border">
                <td className="p-3 border text-center">
                  <img
                    src={detail.product.primaryImage.url}
                    alt={detail.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="p-3 border">{detail.product.name}</td>
                <td className="p-3 border text-center">{detail.quantity}</td>
                <td className="p-3 border text-right">
                  {detail.unitPrice.toLocaleString()} ₫
                </td>
                <td className="p-3 border text-right">
                  {detail.subtotal.toLocaleString()} ₫
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="mt-6 w-full md:w-auto bg-blue-600 text-white font-medium px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        onClick={() => navigate("/orders")}>
        ⬅ Quay lại
      </button>
    </div>
  );
}

export default OrderDetail;
