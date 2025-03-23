import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash, FaStar, FaUser, FaSearch, FaFilter } from "react-icons/fa";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, 5, 4, 3, 2, 1

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/reviews");
      setReviews(response.data);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách đánh giá!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/reviews/${id}`);
      setReviews(reviews.filter((review) => review.id !== id));
      toast.success("Đã xóa đánh giá thành công!");
    } catch (error) {
      toast.error("Lỗi khi xóa đánh giá!");
    }
  };

  const filteredReviews = reviews.filter((review) => {
    // Filter by rating
    if (filter !== "all" && review.rating !== parseInt(filter)) {
      return false;
    }

    // Filter by search text
    const productName = review.product.name.toLowerCase();
    const userName =
      `${review.user.firstName} ${review.user.lastName}`.toLowerCase();
    const comment = review.comment.toLowerCase();
    const searchTerm = search.toLowerCase();

    return (
      productName.includes(searchTerm) ||
      userName.includes(searchTerm) ||
      comment.includes(searchTerm)
    );
  });

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={index < rating ? "text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 container mx-auto max-w-6xl">
      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Danh sách đánh giá
          </h2>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search box */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm đánh giá..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-64"
              />
            </div>

            {/* Filter dropdown */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white w-full sm:w-48">
                <option value="all">Tất cả đánh giá</option>
                <option value="5">5 sao</option>
                <option value="4">4 sao</option>
                <option value="3">3 sao</option>
                <option value="2">2 sao</option>
                <option value="1">1 sao</option>
              </select>
            </div>
          </div>
        </div>

        {/* Total count */}
        <p className="text-gray-600 mb-4">
          Hiển thị {filteredReviews.length} / {reviews.length} đánh giá
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white rounded-xl p-8 shadow-md text-center">
          <div className="text-gray-400 text-6xl mb-4">😔</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Không tìm thấy đánh giá nào
          </h3>
          <p className="text-gray-500">
            {search || filter !== "all"
              ? "Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác"
              : "Chưa có đánh giá nào trong hệ thống"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl">
              <div className="relative">
                <img
                  src={review.product.primaryImage.url}
                  alt={review.product.primaryImage.altText}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 right-0 bg-white bg-opacity-90 px-3 py-1 m-2 rounded-lg">
                  {renderStars(review.rating)}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                  {review.product.name}
                </h3>

                <div className="flex items-center mb-3 text-gray-600">
                  <FaUser className="mr-2 text-gray-400" />
                  <p>
                    {review.user.firstName} {review.user.lastName}
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-gray-700 italic">
                    "{review.comment || "Không có nhận xét"}"
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {review.createdAt
                      ? formatDate(review.createdAt)
                      : "Không rõ ngày"}
                  </span>

                  <button
                    onClick={() => handleDelete(review.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2">
                    <FaTrash size={14} /> Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reviews;
