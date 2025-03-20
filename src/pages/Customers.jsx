import React from "react";
import CustomersList from "../components/customer/CustomersList.jsx";

function Customers() {
  return (
    <div className="">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Quản lý sản phẩm
        </h2>
        <CustomersList />
      </div>
    </div>
  );
}

export default Customers;
