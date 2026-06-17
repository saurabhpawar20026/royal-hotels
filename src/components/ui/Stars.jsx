import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// Read-only star rating. `value` 0–5, supports halves.
export default function Stars({ value = 0, size }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (value >= i) stars.push(<FaStar key={i} />);
    else if (value >= i - 0.5) stars.push(<FaStarHalfAlt key={i} />);
    else stars.push(<FaRegStar key={i} className="empty" />);
  }
  return (
    <span className="stars" style={size ? { fontSize: size } : undefined} aria-label={`${value} out of 5 stars`}>
      {stars}
    </span>
  );
}
