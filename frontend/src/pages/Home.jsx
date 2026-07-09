import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Truck,
  Shield,
  Star,
  ChevronRight,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import api from '../api/axios';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/products?limit=4');
      setFeaturedProducts(response.data?.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setFeaturedProducts([]);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <Truck className="w-8 h-8" />, title: 'Free Shipping', description: 'On orders over $50' },
    { icon: <Shield className="w-8 h-8" />, title: 'Secure Payment', description: '100% secure transactions' },
    { icon: <Star className="w-8 h-8" />, title: 'Best Quality', description: 'Premium products guaranteed' },
    { icon: <ShoppingBag className="w-8 h-8" />, title: 'Easy Returns', description: '30-day return policy' },
  ];

  const renderSkeletons = () =>
    Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-white/70 rounded-xl p-4 shadow animate-pulse">
        <div className="h-48 bg-purple-200/50 rounded mb-4"></div>
        <div className="h-4 bg-purple-200/50 rounded mb-2"></div>
        <div className="h-3 bg-purple-200/40 rounded mb-4"></div>
        <div className="h-8 bg-purple-200/50 rounded"></div>
      </div>
    ));

  const getStockBadge = (count) => {
    if (count === 0) return { text: 'Out of Stock', color: 'bg-red-500' };
    if (count <= 5) return { text: 'Low Stock', color: 'bg-yellow-500' };
    return { text: 'In Stock', color: 'bg-green-500' };
  };

  return (
    <div className="animate-fade-in min-h-screen relative overflow-hidden">

      {/* 🔥 LARGE PREMIUM BACKGROUND BLOBS */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-48 -left-48 w-[60rem] h-[60rem]
          bg-gradient-to-br from-purple-600 via-pink-500 to-pink-300
          opacity-40 rounded-full blur-[140px] animate-blob">
        </div>

        <div className="absolute -bottom-56 -right-56 w-[65rem] h-[65rem]
          bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-400
          opacity-35 rounded-full blur-[160px] animate-blob animation-delay-2s">
        </div>

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2
          w-[70rem] h-[70rem]
          bg-gradient-to-tl from-pink-600 via-purple-700 to-blue-500
          opacity-20 rounded-full blur-[180px] animate-blob animation-delay-4s">
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-20 text-center px-4 z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-purple-900">
            Welcome to <span className="text-pink-600">Raqsa</span>
          </h1>

          <p className="text-xl mb-8 text-purple-800">
            Discover amazing products at unbeatable prices.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/shop"
              aria-label="Shop products"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-md hover:from-pink-500 hover:to-purple-500 transition"
            >
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/contact"
              className="border-2 border-purple-700 text-purple-700 px-6 py-3 rounded-full hover:bg-purple-700 hover:text-white transition"
            >
              Contact Us
            </Link>
          </div>

          {/* Trust signals */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
            <div className="flex items-center justify-center gap-3 bg-white/70 backdrop-blur-md px-4 py-3 rounded-lg shadow-sm">
              <Shield className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                Secure Checkout
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 bg-white/70 backdrop-blur-md px-4 py-3 rounded-lg shadow-sm">
              <Truck className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                Fast Delivery
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 bg-white/70 backdrop-blur-md px-4 py-3 rounded-lg shadow-sm">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                Easy Returns
              </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-purple-700">
          <ChevronDown />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-purple-900">
            Why Choose Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-md p-6 text-center rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-purple-800">
                  {feature.title}
                </h3>
                <p className="text-purple-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-purple-900">
              Featured Products
            </h2>
            <Link to="/shop" className="flex items-center text-purple-700 hover:text-pink-600">
              View All <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          {hasError && (
            <div className="mb-6 text-center text-red-600">
              Unable to load featured products.
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {renderSkeletons()}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 text-purple-700">
              No featured products available.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => {
                const stock = getStockBadge(product.countInStock);
                return (
                  <div
                    key={product._id}
                    className="bg-white/80 backdrop-blur-md rounded-xl overflow-hidden shadow hover:shadow-xl transition"
                  >
                    <div className="relative">
                      <img
  src={
    product.images?.[0]
      ? `${import.meta.env.VITE_API_URL}${product.images[0]}`
      : "/placeholder.png"
  }
  alt={product.name}
  loading="lazy"
  onError={(e) => (e.target.src = "/placeholder.png")}
  className="w-full h-48 object-cover"
/>

                      <span
                        className={`absolute top-4 left-4 ${stock.color} text-white px-3 py-1 rounded-full text-xs`}
                      >
                        {stock.text}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 text-purple-900">
                        {product.name}
                      </h3>
                      <p className="text-purple-700 text-sm mb-3 truncate">
                        {product.description}
                      </p>

                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-purple-900">
                          ${product.price}
                        </span>

                        <button
                          disabled={product.countInStock === 0}
                          className={`py-2 px-4 rounded-full text-sm transition ${
                            product.countInStock === 0
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-purple-500 hover:bg-pink-500 text-white'
                          }`}
                        >
                          {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 text-center p-12 rounded-xl bg-white/40 backdrop-blur-md">
          <h2 className="text-4xl font-bold mb-4 text-purple-900">
            Ready to Shop?
          </h2>
          <p className="text-xl mb-6 text-purple-800">
            ⭐ Rated 4.8 by 500+ customers
          </p>
          <Link
            to="/signup"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-full shadow-md hover:from-pink-500 hover:to-purple-500 transition"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Animations */}
      <style>
        {`
          @keyframes blob {
            0%,100% { transform: translate(0,0) scale(1); }
            33% { transform: translate(30px,-50px) scale(1.1); }
            66% { transform: translate(-20px,20px) scale(0.9); }
          }
          .animate-blob { animation: blob 10s infinite; }
          @media (prefers-reduced-motion: reduce) {
            .animate-blob { animation: none; }
          }
        `}
      </style>
    </div>
  );
};

export default Home;
