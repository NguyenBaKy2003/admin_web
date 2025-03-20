import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:8080/api/categories";

function CategoriesForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); // Thêm mô tả
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (id) {
      axios.get(`${API_URL}/${id}`).then((res) => {
        setName(res.data.name);
        setDescription(res.data.description || ""); // Nếu không có thì mặc định ""
        setParentCategory(res.data.parentCategory?.id || "");
      });
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      const parentCategories = res.data.filter(
        (cat) => cat.parentCategory === null
      );
      setCategories(parentCategories);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryData = {
      name,
      description, // Gửi description lên API
      parentCategory: parentCategory ? { id: parentCategory } : null,
    };

    try {
      if (id) {
        await axios.put(`${API_URL}/${id}`, categoryData);
        alert("Cập nhật danh mục thành công!");
      } else {
        await axios.post(API_URL, categoryData);
        alert("Thêm danh mục thành công!");
      }
      navigate("/categories");
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {id ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Tên danh mục */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Tên danh mục:
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Nhập tên danh mục..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Mô tả danh mục */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Mô tả danh mục:
          </label>
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Nhập mô tả danh mục..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Danh mục cha */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Danh mục cha:
          </label>
          <select
            className="w-full p-2 border rounded"
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}>
            <option value="">-- Không có (Tạo danh mục cha) --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Nút hành động */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded">
            {id ? "Lưu thay đổi" : "Thêm danh mục"}
          </button>
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={() => navigate("/categories")}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default CategoriesForm;
