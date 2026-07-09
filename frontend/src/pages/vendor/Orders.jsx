import { useEffect, useState } from 'react';
import api from '../../api/axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH VENDOR ORDERS =================
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/vendor');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= UPDATE ORDER STATUS =================
  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders(prev =>
        prev.map(o => (o._id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      console.error('Status update failed', err);
      alert('Failed to update order status.');
    }
  };

  if (loading) {
    return (
      <p className="text-purple-600 text-center mt-6">
        Loading orders...
      </p>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-purple-700 mb-6">
        Vendor Orders 📦
      </h2>

      {orders.length === 0 ? (
        <p className="text-green-500 font-semibold">
          No orders yet.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order._id}
              className="bg-white/80 rounded-xl shadow-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-purple-700">
                  Order by {order.customer?.name || 'Unknown Customer'}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  Total: ${order.totalPrice.toFixed(2)} | Status:{' '}
                  {order.status.toUpperCase()}
                </p>

                <ul className="ml-4 mt-2 list-disc text-gray-700">
  {order.products.map(p => (
    <li key={p.productId}>
      {p.name} × {p.quantity} (${(p.price * p.quantity).toFixed(2)})
    </li>
  ))}
</ul>

              </div>

              <div className="mt-3 md:mt-0 md:ml-4">
                <select
                  value={order.status}
                  disabled={order.status === 'cancelled'}
                  onChange={e =>
                    updateStatus(order._id, e.target.value)
                  }
                  className="p-2 rounded-lg border border-purple-300"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Orders;
