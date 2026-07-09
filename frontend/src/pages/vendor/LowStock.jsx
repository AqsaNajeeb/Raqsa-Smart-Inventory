import { useEffect, useState } from 'react';
import { getLowStockProducts } from '../../api/vendor';
import LowStockBadge from '../../Components/vendor/LowStockBadge';

const LowStock = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowStock();

    // Poll every 1 min for new low-stock items
    const interval = setInterval(fetchLowStock, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchLowStock = async () => {
    setLoading(true);
    try {
      const res = await getLowStockProducts();
      const data = Array.isArray(res.data.products) ? res.data.products : [];

      setItems((prev) => {
        // Mark new low-stock products and filter out restocked items
        return data.map((p) => ({
          ...p,
          isNew: !prev.some((old) => old._id === p._id)
        }));
      });
    } catch (err) {
      console.error('Low stock fetch failed', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-red-500 mb-6">
        Low Stock Alerts ⚠️
      </h2>

      {loading ? (
        <p className="text-purple-500">Loading alerts...</p>
      ) : items.length === 0 ? (
        <p className="text-green-500 font-semibold">
          🎉 All products are well stocked!
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((p) => (
            <div
              key={p._id}
              className={`flex justify-between bg-white/80 rounded-xl shadow-lg p-4 transition-all duration-500
                ${p.isNew ? 'ring-2 ring-pink-500 animate-pulse' : ''}`}
            >
              <div>
                <h3 className="font-semibold text-purple-700">{p.name}</h3>
                <p className="text-sm text-gray-600">
                  Stock: {p.stockQuantity ?? 0} | Reorder at: {p.reorderLevel ?? 0}
                </p>
              </div>
              <LowStockBadge
                stock={p.stockQuantity ?? 0}
                reorderLevel={p.reorderLevel ?? 0}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default LowStock;
