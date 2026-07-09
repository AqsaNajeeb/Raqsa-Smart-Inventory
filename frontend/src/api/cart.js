import api from "./axios";

// Get logged-in user's cart
export const fetchCart = async () => {
  const { data } = await api.get("/cart"); // make sure api is configured with token
  return data.cart; // backend should return { cart: {...} }
};

// Add item to cart
export const addItemToCart = async (product, quantity = 1) => {
  const { data } = await api.post("/cart/add", {
    productId: product._id, // send product ID
    quantity,
  });
  return data.cart;
};

// Update quantity
export const updateCartItem = async (productId, quantity) => {
  const { data } = await api.put("/cart/update", { productId, quantity });
  return data.cart;
};

// Remove item
export const removeCartItem = async (productId) => {
  const { data } = await api.delete(`/cart/remove/${productId}`);
  return data.cart;
};

// Clear cart
export const clearCart = async () => {
  await api.delete("/cart/clear");
};
