import { useEffect, useState } from 'react';
import AnalyticsCard from '../../Components/vendor/AnalyticsCard';
import SkeletonCard from '../../Components/vendor/SkeletonCard';
import api from '../../api/axios';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';

const COLORS = ['#f472b6', '#c084fc', '#60a5fa', '#34d399', '#fbbf24'];

const Analytics = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [productRes, orderRes] = await Promise.all([
        api.get('/products/my-products'),   // vendor products
        api.get('/orders/vendor')           // vendor orders
      ]);

      const productData = Array.isArray(productRes.data.products) ? productRes.data.products : [];
      const orderData = Array.isArray(orderRes.data.orders) ? orderRes.data.orders : [];

      setProducts(productData);
      setOrders(orderData);
    } catch (err) {
      console.error('Analytics fetch failed', err);
      setProducts([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DYNAMIC DATA ----------------

  // Inventory Data
  const inventoryData = products.map(p => ({
    name: p.name,
    stock: p.stockQuantity ?? 0,
    lowStock: (p.stockQuantity ?? 0) <= (p.reorderLevel ?? 0)
  }));

  // Sales Map
  const salesMap = {};
  orders.forEach(order => {
    order.products?.forEach(p => {
      const pid = p.productId?._id;
      if (!pid) return;
      salesMap[pid] = (salesMap[pid] || 0) + (p.quantity ?? 0);
    });
  });

  const salesData = products
    .filter(p => salesMap[p._id] > 0)
    .map(p => ({ name: p.name, value: salesMap[p._id] }));

  const topProducts = [...products]
    .sort((a, b) => (salesMap[b._id] || 0) - (salesMap[a._id] || 0))
    .slice(0, 5);

  // Revenue Data (daily for last 30 days)
  const today = new Date();
  const revenueMap = {};
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    revenueMap[key] = 0;
  }

  orders.forEach(order => {
    const dateKey = new Date(order.createdAt).toISOString().slice(0, 10);
    if (revenueMap[dateKey] !== undefined) {
      revenueMap[dateKey] += order.totalPrice ?? 0;
    }
  });

  const revenueData = Object.entries(revenueMap).map(([date, revenue]) => ({ date, revenue }));

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice ?? 0), 0);
  const lowStockCount = inventoryData.filter(p => p.lowStock).length;
  const totalInventoryValue = products.reduce((sum, p) => sum + ((p.stockQuantity ?? 0) * (p.price ?? 0)), 0);

  return (
    <>
      <h2 className="text-2xl font-bold text-purple-700 mb-8">
        Analytics & Insights 📊
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Inventory Levels */}
          <AnalyticsCard title="Inventory Levels">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={inventoryData}>
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="stock"
                  fill="#c084fc"
                  radius={[6, 6, 0, 0]}
                  label={{ position: 'top' }}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-2 text-sm text-gray-500">
              Total inventory value: ${totalInventoryValue.toFixed(2)}
            </p>
          </AnalyticsCard>

          {/* Revenue Trends */}
          <AnalyticsCard title="Revenue Trends (Last 30 Days)">
            {revenueData.every(d => d.revenue === 0) ? (
              <p className="text-gray-500 text-sm">No revenue data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <XAxis dataKey="date" hide />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </AnalyticsCard>

          {/* Sales Distribution */}
          <AnalyticsCard title="Sales Distribution">
            {salesData.length === 0 ? (
              <p className="text-gray-500 text-sm">No sales recorded yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={salesData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {salesData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </AnalyticsCard>

          {/* Top Products */}
          <AnalyticsCard title="Top Products">
            {topProducts.length === 0 ? (
              <p className="text-gray-500 text-sm">No sales data available.</p>
            ) : (
              <ul className="space-y-3">
                {topProducts.map((p, i) => (
                  <li
                    key={p._id}
                    className={`flex justify-between items-center px-4 py-2 rounded-xl ${
                      (p.stockQuantity ?? 0) <= (p.reorderLevel ?? 0)
                        ? 'bg-red-50'
                        : 'bg-pink-50'
                    }`}
                  >
                    <span className="font-semibold text-purple-700">
                      #{i + 1} {p.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      Sold: {salesMap[p._id] ?? 0}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </AnalyticsCard>

          {/* Summary: Revenue & Inventory Health */}
          <AnalyticsCard title="Revenue & Inventory Health">
            <p className="text-green-600 font-semibold">
              Total Revenue: ${totalRevenue.toFixed(2)}
            </p>
            <p className="text-pink-600 font-semibold mt-2">
              {lowStockCount} product{lowStockCount !== 1 && 's'} need restocking.
            </p>
            <p className="text-gray-600 mt-1 text-sm">
              Total inventory value: ${totalInventoryValue.toFixed(2)}
            </p>
          </AnalyticsCard>

        </div>
      )}
    </>
  );
};

export default Analytics;
