import vegIcon from "../assets/images/veg.png";
import nonVegIcon from "../assets/images/non-veg.png";

function VegMark({ type, size = 18, className = "" }) {
  const isVeg = type === "veg";
  return (
    <img
      src={isVeg ? vegIcon : nonVegIcon}
      alt={isVeg ? "Veg" : "Non-veg"}
      title={isVeg ? "Veg" : "Non-veg"}
      width={size}
      height={size}
      className={`veg-mark ${className}`}
    />
  );
}

export default VegMark;
