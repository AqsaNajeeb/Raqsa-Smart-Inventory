import React, { useState } from "react";
import { useCart } from "../Context/CartContext.jsx";
import { X, Plus, Minus, ShoppingCart, Heart, Star } from "lucide-react";

const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleAddToWishlist = () => {
    const existing = JSON.parse(localStorage.getItem("wishlist")) || [];

    const alreadyExists = existing.find(p => p._id === product._id);
    if (alreadyExists) {
      alert("This product is already in your wishlist.");
      return;
    }

    const updated = [...existing, product];
    localStorage.setItem("wishlist", JSON.stringify(updated));

    alert("Product added to wishlist ❤️");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-11/12 max-w-4xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-700 hover:text-purple-900 z-10"
        >
          <X />
        </button>

        {/* Image */}
        <div className="relative bg-gradient-to-br from-purple-100 to-pink-100">
          <img
  src={
    product.images?.[0]
      ? `${import.meta.env.VITE_API_URL}${product.images[0]}`
      : "/images/placeholder.png"
  }
  alt={product.name}
  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
/>

        </div>

        {/* Details */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-purple-900">{product.name}</h2>
            <p className="text-xl font-semibold text-purple-700 mt-2">
              ${product.price}
            </p>

            <div className="flex items-center mt-2 text-yellow-500">
              <Star className="w-4 h-4 mr-1 fill-yellow-400" />
              <span className="font-medium">{product.rating || 4.5}</span>
            </div>

            {product.description && (
              <p className="text-purple-700 mt-4 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <span className="font-medium text-purple-800">Quantity</span>
            <div className="flex items-center mt-2 border rounded-full w-fit overflow-hidden bg-white shadow-sm">
              <button
                className="px-3 py-1 hover:bg-purple-100"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-semibold">{quantity}</span>
              <button
                className="px-3 py-1 hover:bg-purple-100"
                onClick={() => setQuantity(q => q + 1)}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-full font-semibold shadow-md hover:scale-105 transition flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>

            <button
              onClick={handleAddToWishlist}
              className="flex-1 bg-purple-100 text-purple-800 py-3 rounded-full font-semibold hover:bg-purple-200 transition flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
