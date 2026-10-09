import { useState } from "react";

// Shows `fallback` if the image link is broken (the pizza photos are hotlinked)
function SafeImage({ src, alt, fallback, className = "", ...rest }) {
  const [failed, setFailed] = useState(!src);

  if (failed) return fallback;
  return (
    <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} {...rest} />
  );
}

export default SafeImage;
