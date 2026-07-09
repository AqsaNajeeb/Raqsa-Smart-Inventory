import React from 'react';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext.jsx';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity),
    0
  );
  const tax = subtotal * 0.08;
  const shipping = subtotal > 500 ? 0 : 20;
  const total = subtotal + tax + shipping;
  const remainingForFreeShipping = Math.max(500 - subtotal, 0);
  const shippingProgress = Math.min((subtotal / 500) * 100, 100);

  return (
    <div className="min-h-screen relative overflow-hidden animate-fade-in">

      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[35rem] h-[35rem] bg-gradient-to-br from-purple-600 via-pink-500 to-pink-300 opacity-40 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-400 opacity-30 rounded-full blur-3xl animate-blob animation-delay-2s"></div>
        <div className="absolute top-1/3 left-1/2 w-[45rem] h-[45rem] bg-gradient-to-tl from-pink-600 via-purple-700 to-blue-500 opacity-25 rounded-full blur-3xl animate-blob animation-delay-4s"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <p className="text-sm text-purple-700 mb-4">
          Home / <span className="font-semibold">Cart</span>
        </p>

        <h1 className="text-3xl font-bold text-purple-900 mb-8 flex items-center">
          <ShoppingCart className="h-8 w-8 mr-3" />
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-xl shadow-xl">
            <ShoppingCart className="h-24 w-24 text-purple-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-purple-800 mb-2">
              Your cart is empty
            </h2>
            <p className="text-purple-700 mb-6">
              Looks like your cart is waiting to be filled ✨
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:scale-105 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => {
                const productImage =
                  item.image ||
                  item.images?.[0] ||
                  item.product?.images?.[0] ||
                  'https://via.placeholder.com/150';

                // Correct item ID from backend
                const itemId = item._id || item.productId || item.id;

                return (
                  <div
                    key={itemId}
                    className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 transition-all hover:shadow-xl"
                  >
                    <div className="flex items-center">
                      <img
                        src={productImage}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg mr-6 border"
                      />

                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-purple-900">
                          {item.name}
                        </h3>

                        <p className="text-purple-700 font-bold text-lg mt-1">
                          ${item.price?.toFixed(2)}
                        </p>

                        <p className="text-sm text-purple-600 mt-1">
                          Line total: ${(item.price * item.quantity).toFixed(2)}
                        </p>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-3">
                            <button
                              disabled={item.quantity === 1}
                              className={`p-2 rounded-full ${
                                item.quantity === 1
                                  ? 'bg-gray-200 cursor-not-allowed'
                                  : 'bg-purple-100 hover:bg-purple-200'
                              }`}
                              onClick={() =>
                                updateQuantity(itemId, item.quantity - 1)
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </button>

                            <span className="text-lg font-medium">
                              {item.quantity}
                            </span>

                            <button
                              className="p-2 rounded-full bg-purple-100 hover:bg-purple-200"
                              onClick={() =>
                                updateQuantity(itemId, item.quantity + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeFromCart(itemId)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-purple-900 mb-4">
                  Order Summary
                </h2>

                <div className="mb-4">
                  <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-purple-700 mt-1">
                    {subtotal >= 500
                      ? '🎉 You unlocked FREE shipping!'
                      : `Add $${remainingForFreeShipping.toFixed(
                          2
                        )} more for free shipping`}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Tax (8%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t pt-4 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-purple-900">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  disabled={cartItems.length === 0}
                  onClick={() => navigate('/checkout')}
                  className={`w-full py-3 rounded-full font-semibold shadow-md transition mb-3 ${
                    cartItems.length === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105'
                  }`}
                >
                  Proceed to Checkout
                </button>

                <div className="flex items-center justify-center text-sm text-purple-700 mb-3">
                  <ShieldCheck className="h-4 w-4 mr-1" />
                  Secure & encrypted checkout
                </div>

                <button
                  onClick={() => navigate('/shop')}
                  className="w-full bg-purple-100 text-purple-800 py-3 rounded-full font-semibold hover:bg-purple-200 transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes blob {
            0%,100% { transform: translate(0px,0px) scale(1); }
            33% { transform: translate(30px,-50px) scale(1.1); }
            66% { transform: translate(-20px,20px) scale(0.9); }
          }
          .animate-blob { animation: blob 10s infinite; }
          .animation-delay-2s { animation-delay: 2s; }
          .animation-delay-4s { animation-delay: 4s; }
        `}
      </style>
    </div>
  );
};

export default Cart;
