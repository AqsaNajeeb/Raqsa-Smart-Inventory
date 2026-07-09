import React, { useState } from 'react';
import { useCart } from '../Context/CartContext';
import api from '../api/axios';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

// ✅ Vite env
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

const CheckoutForm = () => {
  const { cartItems, clearUserCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  /* ================= TOTALS (SAFE) ================= */
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const shippingFee = subtotal > 500 ? 0 : 20;
  const total = subtotal + tax + shippingFee;

  /* ================= STATE ================= */
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // ❌ Empty cart protection
    if (cartItems.length === 0) {
      setMessage('Your cart is empty.');
      setLoading(false);
      return;
    }

    try {
      /* ================= COD ================= */
      if (paymentMethod === 'COD') {
        const { data } = await api.post(
          `${import.meta.env.VITE_API_URL}/api/orders`,
          {
            paymentMethod: 'COD',
            paymentConfirmed: true,
            cartItems,
            shippingAddress
          }
        );

        if (data.success) {
          clearUserCart();
          navigate('/profile'); // or /order-success
        }
      }

      /* ================= STRIPE ================= */
      if (paymentMethod === 'STRIPE') {
        if (!stripe || !elements) {
          setMessage('Stripe not loaded yet.');
          setLoading(false);
          return;
        }

        // 1️⃣ Create Payment Intent (BACKEND)
        const { data } = await api.post(
          `${import.meta.env.VITE_API_URL}/api/payments/create-intent`
        );

        const clientSecret = data.clientSecret;
        // 2️⃣ Confirm Card Payment (FRONTEND)
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)
          }
        });

        if (result.error) {
          setMessage(result.error.message);
          setLoading(false);
          return;
        }

        if (result.paymentIntent.status === 'succeeded') {
          // 3️⃣ Create Order AFTER successful payment
          const orderRes = await api.post(
            `${import.meta.env.VITE_API_URL}/api/orders`,
            {
              paymentMethod: 'STRIPE',
              paymentConfirmed: true,
              paymentIntentId: result.paymentIntent.id,
              shippingAddress
            }
          );

          if (orderRes.data.success) {
            clearUserCart();
            navigate('/profile');
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="relative min-h-screen py-12 overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-48 -left-48 w-[60rem] h-[60rem]
          bg-gradient-to-br from-purple-600 via-pink-500 to-pink-300
          opacity-30 rounded-full blur-[140px] animate-blob" />

        <div className="absolute -bottom-56 -right-56 w-[65rem] h-[65rem]
          bg-gradient-to-tr from-white via-pink-500 to-pink-400
          opacity-25 rounded-full blur-[160px] animate-blob animation-delay-2s" />

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[70rem] h-[70rem]
          bg-gradient-to-tl from-pink-600 via-purple-700 to-white
          opacity-20 rounded-full blur-[180px] animate-blob animation-delay-4s" />
      </div>

      <form
        onSubmit={handlePlaceOrder}
        className="relative z-10 max-w-2xl mx-auto mt-16 bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-purple-900">
          Secure Checkout
        </h2>

        <h3 className="font-semibold mb-4 text-purple-800 text-lg">
          Shipping Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            { name: 'fullName', placeholder: 'Full Name' },
            { name: 'phone', placeholder: 'Phone Number' },
            { name: 'address', placeholder: 'Address', span: true },
            { name: 'city', placeholder: 'City' },
            { name: 'postalCode', placeholder: 'Postal Code' },
            { name: 'country', placeholder: 'Country', span: true }
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
              required
              onChange={handleChange}
              className={`border border-purple-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                field.span ? 'md:col-span-2' : ''
              }`}
            />
          ))}
        </div>

        <h3 className="font-semibold mb-3 text-purple-800 text-lg">
          Payment Method
        </h3>

        <div className="space-y-3 mb-6 text-purple-700">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              checked={paymentMethod === 'COD'}
              onChange={() => setPaymentMethod('COD')}
            />
            Cash on Delivery
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              checked={paymentMethod === 'STRIPE'}
              onChange={() => setPaymentMethod('STRIPE')}
            />
            Pay with Card (Stripe)
          </label>
        </div>

        {paymentMethod === 'STRIPE' && (
          <div className="border border-purple-200 bg-white/70 backdrop-blur-sm p-4 rounded-xl mb-8">
            <CardElement />
          </div>
        )}

        <div className="border-t border-purple-200 pt-6 mb-8 text-sm text-purple-800">
          <div className="flex justify-between mb-1">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Shipping</span>
            <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee}`}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-3 text-purple-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-full text-white font-semibold transition-transform duration-300 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105'
          }`}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>

        {message && (
          <p className="text-center text-red-500 mt-4">{message}</p>
        )}
      </form>

      <style>
        {`
          @keyframes blob {
            0%,100% { transform: translate(0,0) scale(1); }
            33% { transform: translate(30px,-50px) scale(1.1); }
            66% { transform: translate(-20px,20px) scale(0.9); }
          }
          .animate-blob { animation: blob 12s infinite; }
          .animation-delay-2s { animation-delay: 2s; }
          .animation-delay-4s { animation-delay: 4s; }
          @media (prefers-reduced-motion: reduce) {
            .animate-blob { animation: none; }
          }
        `}
      </style>
    </div>
  );
};

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Checkout;