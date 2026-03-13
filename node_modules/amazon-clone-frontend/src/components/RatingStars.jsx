function RatingStars({ rating = 0, count = 0 }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1 text-xs">
      <div className="flex text-yellow-400">
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`full-${i}`}>&#9733;</span>
        ))}
        {halfStar && <span>&#9733;</span>}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">
            &#9733;
          </span>
        ))}
      </div>
      <span className="text-gray-600">({count})</span>
    </div>
  );
}

export default RatingStars;

