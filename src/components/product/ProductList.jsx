import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS

const API_URL = "http://localhost:8080/api/products";

function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get(API_URL)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Lỗi khi lấy danh sách sản phẩm:", err));
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        await axios.delete(`${API_URL}/${productId}`);
        setProducts(products.filter((product) => product.id !== productId));

        // ✅ Hiển thị thông báo thành công
        toast.success("Xóa sản phẩm thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);

        // ❌ Hiển thị thông báo lỗi
        toast.error("Xóa sản phẩm thất bại!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    }
  };

  return (
    <div className="p-4">
      {/* Thêm ToastContainer vào đây */}
      <ToastContainer />

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Danh Sách Sản Phẩm
        </h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
          onClick={() => navigate("/products/new")}>
          + Thêm sản phẩm
        </button>
      </div>

      {/* Table Responsive */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full bg-white">
          <thead className="bg-blue-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-center">Ảnh</th>
              <th className="p-3 text-left">Tên sản phẩm</th>
              <th className="p-3 text-right hidden md:table-cell">Giá</th>
              <th className="p-3 text-left hidden md:table-cell">Danh mục</th>
              <th className="p-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b transition hover:bg-gray-100">
                <td className="p-3">{product.id}</td>

                {/* Hình ảnh sản phẩm */}
                <td className="p-3 flex justify-center">
                  {product.primaryImage ? (
                    <img
                      src={product.primaryImage.url}
                      alt={product.primaryImage.altText}
                      className="w-10 h-10 md:w-14 md:h-14 object-cover rounded-md shadow-sm"
                    />
                  ) : (
                    <span className="text-gray-500 text-xs">Không có ảnh</span>
                  )}
                </td>

                <td className="p-3">{product.name}</td>
                <td className="p-3 text-right hidden md:table-cell">
                  {product.price.toLocaleString()} ₫
                </td>
                <td className="p-3 hidden md:table-cell">
                  {product.category.name}
                </td>

                {/* Nút Sửa/Xóa */}
                <td className="p-3 flex justify-center space-x-2">
                  <button
                    className="bg-green-500 text-white p-2 text-xs md:text-sm rounded-md hover:bg-green-600 transition"
                    onClick={() => navigate(`/products/edit/${product.id}`)}>
                    Sửa
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 text-xs md:text-sm rounded-md hover:bg-red-600 transition"
                    onClick={() => handleDelete(product.id)}>
                    Xóa
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

export default ProductList;
