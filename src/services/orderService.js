const API_URL = "https://api.example.com/orders";

export const getOrders = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};
