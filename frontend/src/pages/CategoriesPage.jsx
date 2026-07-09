// src/pages/CategoriesPage.jsx
import React, { useEffect, useState } from "react";
import { useCart } from "../Context/CartContext.jsx";

const CategoriesPage = () => {
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeSub, setActiveSub] = useState({}); // per category

  // Fetch categories
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then(res => res.json())
      .then(setCategories)
      .catch(err => console.error("Categories fetch error:", err));
  }, []);

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(setProducts)
      .catch(err => console.error("Products fetch error:", err));
  }, []);

  // Get subcategories for a category
  const getSubcategories = (categoryName) => {
    return [
      ...new Set(
        products
          .filter(p => p.category === categoryName)
          .map(p => p.subcategory)
      ),
    ];
  };

  // Handle add to cart with stock check
  const handleAddToCart = (product, qty = 1) => {
    if (product.stock !== undefined && product.stock < qty) {
      alert(`Only ${product.stock} items in stock for "${product.name}"`);
      return;
    }
    addToCart(product, qty);
    alert(`Added ${qty} "${product.name}" to cart`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 px-4 py-12">
      <h1 className="text-3xl font-bold text-purple-800 mb-10 text-center">
        Shop by Category
      </h1>

      <div className="max-w-7xl mx-auto space-y-12">
        {categories.map(category => {
          const subcategories = getSubcategories(category.name);
          const selectedSub = activeSub[category.name];

          return (
            <div
              key={category._id}
              className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6"
            >
              {/* Category Header */}
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                <img
  src={
    product.images?.[0]
      ? `${import.meta.env.VITE_API_URL}${product.images[0]}`
      : "/placeholder.png"
  }
  alt={product.name}
  className="w-full h-48 object-cover"
/>

                <h2 className="text-2xl font-semibold text-purple-800">
                  {category.name}
                </h2>
              </div>

              {/* Subcategories */}
              {subcategories.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {subcategories.map(sub => (
                    <button
                      key={sub}
                      onClick={() =>
                        setActiveSub(prev => ({
                          ...prev,
                          [category.name]:
                            prev[category.name] === sub ? null : sub,
                        }))
                      }
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        selectedSub === sub
                          ? "bg-purple-500 text-white"
                          : "bg-white border border-purple-300 text-purple-700 hover:bg-purple-100"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}

              {/* Products */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .filter(p => p.category === category.name)
                  .filter(p =>
                    selectedSub ? p.subcategory === selectedSub : true
                  )
                  .map(product => (
                    <div
                      key={product._id}
                      className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                    >
                      <img
                        src={product.images?.[0] || "/images/placeholder.png"}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4 flex flex-col gap-2">
                        <h4 className="font-semibold text-purple-800">
                          {product.name}
                        </h4>
                        <p className="text-sm text-purple-600">
                          {product.subcategory}
                        </p>
                        <p className="mt-2 font-bold text-purple-700">
                          ${product.price}
                        </p>
                        {product.stock !== undefined && (
                          <p className="text-sm text-gray-500">
                            {product.stock} in stock
                          </p>
                        )}

                        <button
                          onClick={() => handleAddToCart(product, 1)}
                          className="mt-3 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-full font-semibold hover:scale-105 transition"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesPage;
