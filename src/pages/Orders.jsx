import React from "react";
import OrderList from "../components/order/OrderList";

function Orders() {
  return (
    <div className="">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Quản lý đơn hàng
        </h2>
        <OrderList />
      </div>
    </div>
  );
}

export default Orders;
