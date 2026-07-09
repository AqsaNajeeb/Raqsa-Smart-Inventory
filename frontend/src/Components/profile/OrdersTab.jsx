import React, { useState } from 'react';
import { Package } from 'lucide-react';

const OrdersTab = ({ orders }) => {
  const [openOrderId, setOpenOrderId] = useState(null);

  const toggleDetails = (id) => {
    setOpenOrderId(prev => (prev === id ? null : id));
  };

  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-xl">
      <h2 className="text-xl font-semibold mb-6 text-purple-800">
        Order History
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-10">
          <Package className="mx-auto text-purple-400 mb-3" size={48} />
          <p className="text-purple-700 font-medium">
            You haven’t placed any orders yet
          </p>
          <p className="text-sm text-purple-500 mt-1">
            Once you place an order, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const subtotal = order.products.reduce(
              (sum, p) => sum + p.price * p.quantity,
              0
            );
            const tax = subtotal * 0.08;
            const shipping = subtotal > 500 ? 0 : 20;

            return (
              <div
                key={order._id}
                className="bg-white border border-purple-200 rounded-lg p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left */}
                  <div>
                    <p className="text-sm text-purple-500">Order ID</p>
                    <p className="font-semibold text-purple-800">
                      #{order._id.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Placed on{' '}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Center */}
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      {order.status}
                    </span>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <p className="text-lg font-bold text-purple-800">
                      ${Number(order.totalPrice).toFixed(2)}
                    </p>
                    <button
                      onClick={() => toggleDetails(order._id)}
                      className="text-sm px-4 py-2 rounded-full border border-purple-400 text-purple-700 hover:bg-purple-100 transition"
                    >
                      {openOrderId === order._id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>

                {/* DETAILS PANEL */}
                {openOrderId === order._id && (
                  <div className="mt-5 border-t pt-4 space-y-4">
                    <div className="space-y-3">
                      {order.products.map((p, i) => (
                        <div
                          key={i}
                          className="flex justify-between text-sm text-gray-700"
                        >
                          <div>
                            <p className="font-medium text-purple-700">
                              {p.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ${p.price.toFixed(2)} × {p.quantity}
                            </p>
                          </div>
                          <div className="font-medium">
                            ${(p.price * p.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-3 text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (8%)</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>${shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-purple-800 pt-2">
                        <span>Total</span>
                        <span>${Number(order.totalPrice).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
