import React from 'react';

/**
 * DashboardCard
 * Reusable card for vendor dashboard metrics
 * Props:
 *  - title: string (e.g., "Products")
 *  - value: string or number (e.g., 10, "$1500")
 */
const DashboardCard = ({ title, value }) => {
  return (
    <div className="bg-white/80 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-2xl transition">
      <h3 className="text-purple-700 font-semibold text-lg">{title}</h3>
      <p className="text-pink-500 font-bold text-3xl mt-2">{value}</p>
    </div>
  );
};

export default DashboardCard;
