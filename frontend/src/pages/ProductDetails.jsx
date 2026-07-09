// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../Context/CartContext.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  // Fetch product details from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    alert(`Added ${quantity} "${product.name}" to cart`);
  };

  if (loading) return <p className="text-center mt-10">Loading product...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  // Compute image URL
  const productImage = product.images?.[0]
    ? `${import.meta.env.VITE_API_URL}${product.images[0]}`
    : "/images/placeholder.png";

  return (
    <div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      {/* Product Image */}
      <img
        src={productImage}
        alt={product.name || "Product Image"}
        className="w-full rounded-lg object-cover"
        onError={(e) => (e.target.src = "/images/placeholder.png")}
      />

      {/* Product Details */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-xl font-semibold">${product.price ?? "N/A"}</p>

        {/* Description */}
        {product.description ? (
          <div>
            <h2 className="text-lg font-semibold mb-1">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>
        ) : (
          <p className="text-gray-500 mb-2">No description available.</p>
        )}

        {/* Features */}
        {product.features?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Features</h2>
            <ul className="list-disc list-inside text-gray-700">
              {product.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Specifications */}
        {product.specifications && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Specifications</h2>
            <p className="text-gray-700 whitespace-pre-line">{product.specifications}</p>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mt-4">
          <span className="font-medium">Quantity:</span>
          <div className="flex items-center border rounded-full overflow-hidden">
            <button
              className="px-3 py-1 hover:bg-gray-200"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >
              -
            </button>
            <span className="px-4">{quantity}</span>
            <button
              className="px-3 py-1 hover:bg-gray-200"
              onClick={() =>
                setQuantity(q => (product.stock ? Math.min(q + 1, product.stock) : q + 1))
              }
            >
              +
            </button>
          </div>
          {product.stock !== undefined && (
            <span className="text-sm text-gray-500">{product.stock} in stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="mt-4 bg-primary text-black px-6 py-3 rounded-lg hover:bg-primary/90 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
