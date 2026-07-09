const StatCard = ({ title, value, color }) => {
  const colors = {
    pink: 'text-pink-500',
    blue: 'text-blue-500',
    green: 'text-green-500'
  };

  return (
    <div className="bg-white/80 rounded-xl shadow-lg p-6 text-center">
      <h3 className="text-xl font-semibold text-purple-700">{title}</h3>
      <p className={`text-4xl font-bold mt-3 ${colors[color]}`}>
        {value}
      </p>
    </div>
  );
};

export default StatCard;
