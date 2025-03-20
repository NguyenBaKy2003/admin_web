import React from "react";
import ProductList from "../components/product/ProductList";

function Product() {
  return (
    <div className="">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Quản lý sản phẩm
        </h2>
        <ProductList />
      </div>
    </div>
  );
}

export default Product;
