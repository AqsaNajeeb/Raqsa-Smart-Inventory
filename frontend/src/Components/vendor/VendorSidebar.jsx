import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

const Sidebar = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const link =
    "flex justify-between items-center px-4 py-3 rounded-xl font-semibold text-purple-700 hover:bg-pink-200";

  // ================= FETCH UNREAD MESSAGES COUNT =================
  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/contact"); // <-- singular
      const messages = res.data.messages || [];
      const unread = messages.filter((msg) => msg.status === "unread").length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch unread messages count", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    // Optional: Poll every 60 seconds for new messages
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-md shadow-lg p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-8">🍬 Vendor</h2>

      <nav className="space-y-2">
        <NavLink to="/vendor" end className={link}>
          Dashboard
        </NavLink>
        <NavLink to="/vendor/orders" className={link}>
          Orders
        </NavLink>
        <NavLink to="/vendor/products" className={link}>
          Products
        </NavLink>
        <NavLink to="/vendor/add-product" className={link}>
          Add Product
        </NavLink>
        <NavLink to="/vendor/low-stock" className={link}>
          Low Stock
        </NavLink>
        <NavLink to="/vendor/analytics" className={link}>
          Analytics
        </NavLink>
        <NavLink to="/vendor/messages" className={link}>
          Messages
          {unreadCount > 0 && (
            <span className="ml-2 inline-block px-2 py-1 text-xs font-bold text-white bg-pink-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
