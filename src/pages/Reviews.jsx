import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/reviews");
      setReviews(response.data);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách đánh giá!");
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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Danh sách đánh giá</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((review) => (
          <div key={review.id} className=" p-4 rounded-lg shadow-md">
            <img
              src={review.product.primaryImage.url}
              alt={review.product.primaryImage.altText}
              className="w-full h-40 object-cover mb-2"
            />
            <h3 className="text-lg font-semibold">{review.product.name}</h3>
            <p className="text-gray-600">Người đánh giá: {review.user.firstName} {review.user.lastName}</p>
            <p className="text-yellow-500">Đánh giá: {"⭐".repeat(review.rating)}</p>
            <p className="text-gray-800 italic">"{review.comment}"</p>
            <button
              onClick={() => handleDelete(review.id)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2"
            >
              <FaTrash /> Xóa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;