import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:8080/api/users";

function CustomersList() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    axios
      .get(API_URL)
      .then((res) => setCustomers(res.data))
      .catch((err) => toast.error("Lỗi khi tải danh sách khách hàng!"));
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
    <div className="p-6  mx-auto bg-white shadow-lg rounded-xl">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Danh Sách Khách Hàng</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Họ và Tên</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Số Điện Thoại</th>
              <th className="p-3 border">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border">
                <td className="p-3 border">{customer.lastName} {customer.firstName}</td>
                <td className="p-3 border">{customer.email}</td>
                <td className="p-3 border text-center">{customer.phoneNumber}</td>
                <td className="p-3 border text-center">
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition"
                    onClick={() => deleteCustomer(customer.id)}>
                    ❌ Xóa
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

export default CustomersList;