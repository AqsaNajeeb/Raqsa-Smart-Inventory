// src/Context/CartContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

/* ================= CONTEXT ================= */

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

/* ================= PROVIDER ================= */

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= NORMALIZER ================= */

  const mapCartItems = (items = []) =>
    items.map((i) => ({
      id: i.productId?._id || i._id,
      name: i.productId?.name || 'Unknown Product',
      price: i.productId?.price || 0,
      image:
  i.productId?.images?.[0]
    ? `${import.meta.env.VITE_API_URL}${i.productId.images[0]}`
    : i.image || "/placeholder.png",
      quantity: i.quantity || 1,
      stock: i.productId?.stock ?? 100,
    }));

  /* ================= LOAD CART ================= */

  const loadCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      setCartItems(mapCartItems(data?.cart?.items));
    } catch (err) {
      console.error('Failed to load cart', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD ON LOGIN ================= */

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated]);

  /* ================= ADD TO CART ================= */

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      const res = await api.post('/cart/add', {
        productId: product._id,
        quantity,
      });

      const cart =
        res.data?.cart ||
        res.data || // fallback if backend sent cart directly
        null;

      if (!cart?.items) {
        console.error('Invalid cart response:', res.data);
        throw new Error('Invalid cart response');
      }

      setCartItems(mapCartItems(cart.items));
      alert(`${product.name} added to cart`);
    } catch (err) {
      console.error('Failed to add to cart', err);
      alert('Failed to add product to cart');
    }
  };

  /* ================= UPDATE QUANTITY ================= */

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated || quantity < 1) return;

    try {
      const { data } = await api.put('/cart/update', {
        productId,
        quantity,
      });
      setCartItems(mapCartItems(data.cart.items));
    } catch (err) {
      console.error('Failed to update cart', err);
      alert('Failed to update quantity');
    }
  };

  /* ================= REMOVE ITEM ================= */

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;

    try {
      const { data } = await api.delete(`/cart/remove/${productId}`);
      setCartItems(mapCartItems(data.cart.items));
    } catch (err) {
      console.error('Failed to remove item', err);
      alert('Failed to remove product');
    }
  };

  /* ================= CLEAR CART ================= */

  const clearUserCart = async () => {
    if (!isAuthenticated) return;

    try {
      await api.delete('/cart/clear');
      setCartItems([]);
    } catch (err) {
      console.error('Failed to clear cart', err);
    }
  };

  /* ================= PROVIDER VALUE ================= */

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearUserCart,
        reloadCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
