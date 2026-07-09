const LowStockBadge = ({ stock, reorderLevel }) => {
  const critical = stock <= reorderLevel / 2;

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold
        ${critical
          ? 'bg-red-200 text-red-700'
          : 'bg-yellow-200 text-yellow-700'
        }`}
    >
      {critical ? 'Critical' : 'Low Stock'}
    </span>
  );
};

export default LowStockBadge;
