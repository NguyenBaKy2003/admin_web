const API_URL = "http://localhost:8080/api/products";

// Lấy danh sách sản phẩm
export const getProducts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Lấy thông tin chi tiết sản phẩm theo ID
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

// Thêm sản phẩm mới
export const createProduct = async (productData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("Failed to create product");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    return null;
  }
};
