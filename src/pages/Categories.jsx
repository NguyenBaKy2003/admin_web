import React from "react";
import CategoryList from "../components/product/CategoryList";

function Categories() {
  return (
    <div className="">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Quản lý danh mục
        </h2>
        <CategoryList />
      </div>
    </div>
  );
}

export default Categories;
