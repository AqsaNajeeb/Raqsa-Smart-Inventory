import React, { useState, useEffect } from "react";
import ProductModal from "./ProductModal";
import { useSearch } from "../Context/SearchContext.jsx";
import api from "../api/axios";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { searchTerm } = useSearch();

  // Fetch products and categories from backend at runtime
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get("/categories"),
          api.get("/products"),
        ]);

        setCategories(Array.isArray(catRes.data?.categories) ? catRes.data.categories : []);
        setProducts(Array.isArray(prodRes.data?.products) ? prodRes.data.products : []);
      } catch (err) {
        console.error("Error fetching shop data:", err);
        setCategories([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, []);

  // Filter products
  const filteredProducts = products.filter((prod) => {
    const prodName = prod.name || "";
    const prodPrice = typeof prod.price === "number" ? prod.price : 0;
    const matchesCategory = !activeCategory || prod.category?._id === activeCategory._id;
    const matchesSubcategory = !activeSubcategory || prod.subcategory === activeSubcategory;
    const matchesSearch = prodName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = prodPrice >= priceRange[0] && prodPrice <= priceRange[1];

    return matchesCategory && matchesSubcategory && matchesSearch && matchesPrice;
  });

  // Sorting
  if (sortOption === "price-low")
    filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  if (sortOption === "price-high")
    filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setActiveSubcategory(null);
    setPriceRange([0, 500]);
  };

  const handleSubcategoryClick = (sub) => setActiveSubcategory(sub);

  const resetFilters = () => {
    setActiveCategory(null);
    setActiveSubcategory(null);
    setPriceRange([0, 500]);
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8">
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[35rem] h-[35rem] bg-gradient-to-br from-purple-600 via-pink-500 to-pink-300 opacity-40 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-400 opacity-30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/2 w-[45rem] h-[45rem] bg-gradient-to-tl from-pink-600 via-purple-700 to-blue-500 opacity-25 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile filter toggle */}
        <div className="flex justify-between lg:hidden mb-4">
          <h2 className="text-xl font-bold text-purple-900">Shop</h2>
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 py-2 bg-purple-400 text-white rounded-lg shadow hover:bg-pink-400 transition"
          >
            Filters
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`fixed inset-0 z-50 lg:static lg:translate-x-0 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } bg-white/80 backdrop-blur-md p-6 w-3/4 max-w-xs lg:w-1/4 lg:block rounded-xl shadow-lg`}
        >
          <div className="flex justify-end mb-4 lg:hidden">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-purple-900 font-bold text-lg"
            >
              ✕
            </button>
          </div>

          <h3 className="text-xl font-bold mb-4 text-purple-900">Filters</h3>

          {/* Categories */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Categories</h4>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <label key={cat._id} className="flex items-center mb-1 cursor-pointer text-purple-900">
                  <input
                    type="radio"
                    name="category"
                    checked={activeCategory?._id === cat._id}
                    onChange={() => handleCategoryClick(cat)}
                    className="mr-2 accent-pink-400"
                  />
                  {cat.name}
                </label>
              ))
            ) : (
              <p className="text-gray-500">No categories available</p>
            )}
          </div>

          {/* Subcategories */}
          {activeCategory?.subcategories?.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Subcategories</h4>
              {activeCategory.subcategories.map((sub) => (
                <label key={sub} className="flex items-center mb-1 cursor-pointer text-purple-900">
                  <input
                    type="radio"
                    name="subcategory"
                    checked={activeSubcategory === sub}
                    onChange={() => handleSubcategoryClick(sub)}
                    className="mr-2 accent-pink-400"
                  />
                  {sub}
                </label>
              ))}
            </div>
          )}

          {/* Price range */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Price Range (${priceRange[0]} - ${priceRange[1]})</h4>
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="w-full accent-pink-400"
            />
          </div>

          <button
            onClick={resetFilters}
            className="w-full py-2 mt-4 bg-purple-400 hover:bg-pink-400 text-white rounded-lg transition"
          >
            Reset Filters
          </button>
        </aside>

        {/* Overlay */}
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-40 lg:hidden" />}

        {/* Products */}
        <div className="flex-1">
          <div className="flex justify-end mb-6">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-300 focus:outline-none"
            >
              <option value="default">Sort by Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-400"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-purple-700">
              <h2 className="text-2xl font-semibold mb-2">No Products Found</h2>
              <p>Try adjusting your filters or search.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod._id}
                  className="bg-white/80 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300 cursor-pointer group"
                  onClick={() => setSelectedProduct(prod)}
                >
                  <img
                    src={
                      prod.images?.[0]
                        ? `${import.meta.env.VITE_API_URL}${prod.images[0]}`
                        : "/placeholder.png"
                    }
                    alt={prod.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-purple-900">{prod.name}</h3>
                    <p className="text-purple-700">${prod.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

      {/* Blob animations */}
      <style>
        {`
          @keyframes blob {
            0%,100% { transform: translate(0px,0px) scale(1);}
            33% { transform: translate(30px,-50px) scale(1.1);}
            66% { transform: translate(-20px,20px) scale(0.9);}
          }
          .animate-blob { animation: blob 10s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}
      </style>
    </div>
  );
};

export default Shop;
