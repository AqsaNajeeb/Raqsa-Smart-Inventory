import { useEffect, useState } from 'react';
import DashboardCard from '../../Components/vendor/DashboardCard';
import api from '../../api/axios';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DASHBOARD DATA =================
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productRes, orderRes] = await Promise.all([
        api.get('/products/my-products'),
        api.get('/orders/vendor'),
      ]);

      const productData = Array.isArray(productRes.data)
        ? productRes.data
        : Array.isArray(productRes.data.products)
        ? productRes.data.products
        : [];

      const orderData = Array.isArray(orderRes.data.orders)
        ? orderRes.data.orders
        : [];

      setProducts(productData);
      setOrders(orderData);
    } catch (err) {
      console.error('Dashboard fetch failed', err);
      setProducts([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ================= CALCULATE METRICS =================
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const lowStockCount = products.filter(
    p => (p.stockQuantity ?? 0) <= (p.reorderLevel ?? 0)
  ).length;

  return (
    <>
      {loading ? (
        <p className="text-purple-600 font-semibold">Loading dashboard...</p>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-purple-700 mb-6">
            Dashboard Overview 🍭
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <DashboardCard title="Products" value={products.length} />
            <DashboardCard title="Orders" value={orders.length} />
            <DashboardCard title="Revenue" value={`$${totalRevenue.toFixed(2)}`} />
            <DashboardCard title="Low Stock" value={lowStockCount} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white/80 rounded-xl shadow-lg p-6">
              <h3 className="text-purple-700 font-semibold mb-4">Recent Orders</h3>
              {orders.length === 0 ? (
                <p className="text-gray-600">No orders yet.</p>
              ) : (
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                  {orders.slice(0, 10).map(order => (
                    <li
                      key={order._id}
                      className="flex justify-between items-center bg-pink-50 rounded-xl px-4 py-2"
                    >
                      <span className="font-medium text-purple-700">
                        {order.customer?.name || 'Unknown Customer'}
                      </span>
                      <span className="text-sm text-gray-600">
                        ${order.totalPrice?.toFixed(2) || 0}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          order.status === 'delivered'
                            ? 'text-green-600'
                            : order.status === 'confirmed'
                            ? 'text-purple-500'
                            : order.status === 'cancelled'
                            ? 'text-red-500'
                            : 'text-yellow-600'
                        }`}
                      >
                        {order.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Low Stock Products */}
            <div className="bg-white/80 rounded-xl shadow-lg p-6">
              <h3 className="text-purple-700 font-semibold mb-4">Low Stock Products</h3>
              {lowStockCount === 0 ? (
                <p className="text-green-500">All products are sufficiently stocked 🎉</p>
              ) : (
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                  {products
                    .filter(p => (p.stockQuantity ?? 0) <= (p.reorderLevel ?? 0))
                    .map(p => (
                      <li
                        key={p._id}
                        className="flex justify-between items-center bg-pink-50 rounded-xl px-4 py-2"
                      >
                        <span className="font-medium text-purple-700">{p.name}</span>
                        <span className="text-sm text-gray-600">
                          Stock: {p.stockQuantity ?? 0}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
