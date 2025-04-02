import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://45.122.253.163:8891/api/orders";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
          throw new Error("Lỗi khi lấy đơn hàng!");
        }
        const data = await response.json();
        console.log("Dữ liệu đơn hàng:", data);
        setOrder(data);
        setStatus(data.status);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",
    PROCESSING: "bg-blue-100 text-blue-700 border-blue-300",
    SHIPPED: "bg-purple-100 text-purple-700 border-purple-300",
    DELIVERED: "bg-green-100 text-green-700 border-green-300",
    CANCELLED: "bg-red-100 text-red-700 border-red-300",
  };

  const statusLabels = {
    PENDING: "Chờ xử lý",
    PROCESSING: "Đang xử lý",
    SHIPPED: "Đã giao cho vận chuyển",
    DELIVERED: "Đã giao hàng",
    CANCELLED: "Đã hủy",
  };

  const updateStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/${id}/status?sendEmail=false`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Lỗi khi cập nhật trạng thái!");
      }

      setOrder(data.order);
      toast.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-xl">
        <p className="text-center text-gray-600 p-8">Không tìm thấy đơn hàng</p>
        <button
          className="w-full bg-blue-600 text-white font-medium px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          onClick={() => navigate("/admin/orders")}>
          ⬅ Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-xl">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Chi Tiết Đơn Hàng
          </h2>
          <p className="text-gray-500 text-sm">
            Mã đơn: <span className="font-medium">{order.orderNumber}</span> |
            Ngày đặt:{" "}
            <span className="font-medium">
              {new Date(order.orderDate).toLocaleDateString("vi-VN")}
            </span>
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[order.status]
            }`}>
            {statusLabels[order.status] || order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Thông tin đơn hàng */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 className="font-bold text-gray-700 mb-3 flex items-center">
            <span className="bg-blue-100 text-blue-700 p-1 rounded mr-2">
              🛒
            </span>
            Thông Tin Đơn Hàng
          </h3>
          <div className="space-y-2">
            <p className="text-lg font-bold text-gray-800">
              Tổng tiền:{" "}
              <span className="text-red-500">
                {order.totalAmount?.toLocaleString() || "Đang tải..."} ₫
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Phương thức thanh toán: <span className="font-medium">COD</span>
            </p>
          </div>
        </div>

        {/* Thông tin giao hàng */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 md:col-span-2">
          <h3 className="font-bold text-gray-700 mb-3 flex items-center">
            <span className="bg-green-100 text-green-700 p-1 rounded mr-2">
              🚚
            </span>
            Thông Tin Giao Hàng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-500">Người nhận:</p>
              <p className="font-medium">
                {order.shippingDetail.recipientName || "Không có"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Số điện thoại:</p>
              <p className="font-medium">
                {order.shippingDetail.phoneNumber || "Không có"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email:</p>
              <p className="font-medium">
                {order.shippingDetail.email || "Không có"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Địa chỉ:</p>
              <p className="font-medium">
                {order.shippingDetail.address || "Không có"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cập nhật trạng thái */}
      <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 mb-6">
        <h3 className="font-bold text-gray-700 mb-3 flex items-center">
          <span className="bg-blue-100 text-blue-700 p-1 rounded mr-2">⚙️</span>
          Cập Nhật Trạng Thái
        </h3>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-grow">
            <select
              className={`p-2 border rounded-lg w-full ${
                statusColors[status] || "bg-gray-100 text-gray-700"
              }`}
              value={status}
              onChange={handleStatusChange}>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s] || s}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center justify-center"
            onClick={updateStatus}>
            <span className="mr-1">✔</span> Cập nhật
          </button>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <span className="bg-purple-100 text-purple-700 p-1 rounded mr-2">
            📦
          </span>
          Sản Phẩm Trong Đơn Hàng
        </h3>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                  <th className="p-4 text-left">Sản Phẩm</th>
                  <th className="p-4 text-center">Số Lượng</th>
                  <th className="p-4 text-right">Đơn Giá</th>
                  <th className="p-4 text-right">Tổng Tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.orderDetails.map((detail, index) => (
                  <tr
                    key={detail.id}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}>
                    <td className="p-4">
                      <div className="flex items-center">
                        <img
                          src={detail.product.primaryImage.url}
                          alt={detail.product.name}
                          className="w-16 h-16 object-cover rounded-lg mr-3 border border-gray-200"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {detail.product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Mã: {detail.product.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">{detail.quantity}</td>
                    <td className="p-4 text-right font-medium">
                      {detail.unitPrice.toLocaleString()} ₫
                    </td>
                    <td className="p-4 text-right font-bold text-gray-800">
                      {detail.subtotal.toLocaleString()} ₫
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan="3" className="p-4 text-right font-bold">
                    Tổng cộng:
                  </td>
                  <td className="p-4 text-right font-bold text-lg text-red-600">
                    {order.totalAmount.toLocaleString()} ₫
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Nút quay lại */}
      <div className="flex justify-between">
        <button
          className="bg-gray-200 text-gray-700 font-medium px-6 py-2 rounded-lg hover:bg-gray-300 transition flex items-center"
          onClick={() => navigate("/admin/orders")}>
          ⬅ Quay lại danh sách
        </button>

        <button
          className="bg-green-50 text-green-700 border border-green-300 font-medium px-6 py-2 rounded-lg hover:bg-green-100 transition flex items-center"
          onClick={() => window.print()}>
          🖨️ In đơn hàng
        </button>
      </div>
    </div>
  );
}

export default OrderDetail;
