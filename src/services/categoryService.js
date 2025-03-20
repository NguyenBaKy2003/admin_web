const API_URL = "http://localhost:8080/api/categories";

// Lấy danh sách các danh mục
export const getCategories = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
