import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://45.122.253.163:8891/api/categories";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [openCategories, setOpenCategories] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios
      .get(API_URL)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  };

  const toggleCategory = (id) => {
    setOpenCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEdit = (id) => {
    navigate(`/admin/categories/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchCategories();
        alert("Xóa danh mục thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        alert("Không thể xóa danh mục, có thể danh mục đang được sử dụng!");
      }
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Danh mục sản phẩm
      </h2>

      {/* Nút chuyển đến trang thêm danh mục */}
      <button
        onClick={() => navigate("/admin/categories/new")}
        className="w-full bg-blue-500 text-white py-2 rounded mb-4">
        Thêm danh mục
      </button>

      {/* Danh sách danh mục */}
      <ul className="space-y-2">
        {categories
          .filter((cat) => !cat.parentCategory)
          .map((parent) => (
            <li key={parent.id} className=" p-3 rounded-md bg-gray-100">
              <div className="flex justify-between items-center">
                <div
                  className="cursor-pointer"
                  onClick={() => toggleCategory(parent.id)}>
                  <span className="text-lg font-semibold">
                    📂 {parent.name}
                  </span>
                  <span className="ml-2">
                    {openCategories[parent.id] ? "🔼" : "🔽"}
                  </span>
                </div>
                <div>
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleEdit(parent.id)}>
                    Sửa
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(parent.id)}>
                    Xóa
                  </button>
                </div>
              </div>

              {/* Danh mục con */}
              {openCategories[parent.id] &&
                categories
                  .filter((cat) => cat.parentCategory?.id === parent.id)
                  .map((child) => (
                    <div
                      key={child.id}
                      className="ml-6 mt-2 p-2 bg-gray-50 rounded-md flex justify-between">
                      <span>📄 {child.name}</span>
                      <div>
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                          onClick={() => handleEdit(child.id)}>
                          Sửa
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => handleDelete(child.id)}>
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default CategoryList;
