// A drawn pizza. Toppings are placed in a fixed pattern (same input → same picture),
// so it can be used as a live preview on the Build page.

const SHAPES = [
  { match: "pepperoni", kind: "pepperoni" },
  { match: "sausage", kind: "pepperoni" },
  { match: "mushroom", kind: "mushroom" },
  { match: "black olive", kind: "ring", color: "#2A2421" },
  { match: "green olive", kind: "ring", color: "#7C8F3A" },
  { match: "jalapeno", kind: "ring", color: "#3D8B3A" },
  { match: "onion", kind: "ring", color: "#8D4A89" },
  { match: "capsicum", kind: "strip", color: "#3A8A3E" },
  { match: "paneer", kind: "cube", color: "#FFF7E4" },
  { match: "chicken", kind: "chunk", color: "#A8713E" },
  { match: "keema", kind: "crumb", color: "#7E4E2B" },
  { match: "tomato", kind: "tomato" },
  { match: "peprika", kind: "flake", color: "#E0552A" },
  { match: "paprika", kind: "flake", color: "#E0552A" },
  { match: "corn", kind: "dot", color: "#F2C33C" },
  { match: "beans", kind: "bean", color: "#3A2A22" },
];

const shapeFor = (name) =>
  SHAPES.find((s) => name.toLowerCase().includes(s.match)) || { kind: "dot", color: "#9A8F86" };

function Piece({ shape, x, y, rot }) {
  const t = `translate(${x} ${y}) rotate(${rot})`;
  switch (shape.kind) {
    case "pepperoni":
      return (
        <g transform={t}>
          <circle r="10" fill="#B3271B" />
          <circle cx="-3" cy="-2" r="1.6" fill="#7E1A12" />
          <circle cx="3" cy="3" r="1.3" fill="#7E1A12" />
        </g>
      );
    case "mushroom":
      return (
        <g transform={t}>
          <path d="M-8 1 A8 7 0 0 1 8 1 Z" fill="#C9A27E" />
          <rect x="-2.5" y="0" width="5" height="6" rx="1.5" fill="#E6D2B8" />
        </g>
      );
    case "ring":
      return <circle transform={t} r="5" fill="none" stroke={shape.color} strokeWidth="2.6" />;
    case "strip":
      return <rect transform={t} x="-8" y="-2" width="16" height="4" rx="2" fill={shape.color} />;
    case "cube":
      return <rect transform={t} x="-4.5" y="-4.5" width="9" height="9" rx="1.5" fill={shape.color} stroke="#E3CF9F" />;
    case "chunk":
      return <rect transform={t} x="-6" y="-4" width="12" height="8" rx="3.5" fill={shape.color} />;
    case "crumb":
      return <circle transform={t} r="3.4" fill={shape.color} />;
    case "tomato":
      return (
        <g transform={t}>
          <circle r="7.5" fill="#D9412B" />
          <circle r="4" fill="#EE7A5E" />
        </g>
      );
    case "flake":
      return <rect transform={t} x="-3" y="-1.5" width="6" height="3" rx="1" fill={shape.color} />;
    case "bean":
      return <ellipse transform={t} rx="4" ry="2.6" fill={shape.color} />;
    default:
      return <circle transform={t} r="3" fill={shape.color} />;
  }
}

function PizzaArt({ toppings = [], size = 220, spin = false, className = "", title = "Pizza illustration" }) {
  const unique = [...new Set(toppings.map((t) => t.trim()).filter(Boolean))];
  const total = unique.length * (unique.length > 6 ? 4 : 6);

  // Sunflower (golden-angle) spiral spreads pieces evenly; toppings take turns
  const pieces = Array.from({ length: total }, (_, i) => {
    const name = unique[i % unique.length];
    const radius = 10 + 62 * Math.sqrt((i + 0.5) / total);
    const angle = i * 2.39996;
    return {
      key: `${name}-${i}`,
      shape: shapeFor(name),
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      rot: (i * 83) % 360,
    };
  });

  return (
    <svg
      viewBox="-110 -110 220 220"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      className={`pizza-art ${spin ? "pizza-art--spin" : ""} ${className}`}
    >
      <circle r="104" fill="#D99A4E" />
      <circle r="98" fill="#E8B266" />
      <circle r="88" fill="#C8321F" />
      <circle r="84" fill="#F4D27C" />
      <circle cx="-30" cy="-22" r="22" fill="#F8E2A2" opacity="0.7" />
      <circle cx="34" cy="28" r="26" fill="#F8E2A2" opacity="0.6" />
      <circle cx="18" cy="-40" r="14" fill="#EFC566" opacity="0.6" />
      {pieces.map((p) => (
        <Piece key={p.key} shape={p.shape} x={p.x} y={p.y} rot={p.rot} />
      ))}
    </svg>
  );
}

export default PizzaArt;
