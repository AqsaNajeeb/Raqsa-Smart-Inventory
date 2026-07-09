const AnalyticsCard = ({ title, children }) => {
  return (
    <div className="bg-white/80 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-purple-700 mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
};

export default AnalyticsCard;
