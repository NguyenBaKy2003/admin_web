import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://backend.kadoma.vn/api/users";

function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    setLoading(true);
    axios
      .get(API_URL)
      .then((res) => {
        setCustomers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Lỗi khi tải danh sách khách hàng!");
        setLoading(false);
      });
  };

  const deleteCustomer = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      axios
        .delete(`${API_URL}/${id}`)
        .then(() => {
          toast.success("Xóa khách hàng thành công!");
          setCustomers(customers.filter((customer) => customer.id !== id));
        })
        .catch((err) => toast.error("Lỗi khi xóa khách hàng!"));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Danh Sách Khách Hàng
        </h2>
        <button
          onClick={fetchCustomers}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition">
          🔄 Làm mới
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg">
          <p className="text-gray-600 text-lg">
            Không có khách hàng nào trong danh sách
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left font-medium text-gray-700 border-b">
                  Họ và Tên
                </th>
                <th className="p-4 text-left font-medium text-gray-700 border-b">
                  Email
                </th>
                <th className="p-4 text-left font-medium text-gray-700 border-b">
                  Số Điện Thoại
                </th>
                <th className="p-4 text-center font-medium text-gray-700 border-b">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr
                  key={customer.id}
                  className={`hover:bg-gray-50 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}>
                  <td className="p-4 border-b border-gray-200">
                    <div className="font-medium text-gray-800">
                      {customer.lastName} {customer.firstName}
                    </div>
                  </td>
                  <td className="p-4 border-b border-gray-200">
                    <div className="text-gray-600">{customer.email}</div>
                  </td>
                  <td className="p-4 border-b border-gray-200">
                    <div className="text-gray-600">{customer.phoneNumber}</div>
                  </td>
                  <td className="p-4 border-b border-gray-200">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                        onClick={() =>
                          (window.location.href = `/edit/${customer.id}`)
                        }>
                        ✏️ Sửa
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        onClick={() => deleteCustomer(customer.id)}>
                        ❌ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CustomersList;
