const SkeletonCard = () => {
  return (
    <div className="bg-white/80 rounded-xl shadow-lg p-4 animate-pulse">
      <div className="h-40 bg-pink-200/60 rounded-lg mb-4"></div>
      <div className="h-4 bg-purple-200/60 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-pink-200/60 rounded w-1/2 mb-4"></div>
      <div className="flex gap-2">
        <div className="h-8 bg-blue-200/60 rounded-lg w-1/2"></div>
        <div className="h-8 bg-red-200/60 rounded-lg w-1/2"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
