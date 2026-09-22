type EstraProps = {
  className?: string;
};

export default function Estra({ className }: EstraProps) {
  const blue = "#8AA8FF";

  return (
    <svg
      viewBox="0 0 82 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Estra"
    >
      <rect
        x="14"
        y="19.5"
        width="54"
        height="13"
        rx="6.5"
        fill={blue}
        transform="rotate(9, 41, 26)"
      />

      <rect
        x="23"
        y="43.5"
        width="36"
        height="13"
        rx="6.5"
        fill={blue}
        transform="rotate(9, 41, 50)"
      />

      <rect
        x="14"
        y="67.5"
        width="54"
        height="13"
        rx="6.5"
        fill={blue}
        transform="rotate(9, 41, 74)"
      />
    </svg>
  );
}