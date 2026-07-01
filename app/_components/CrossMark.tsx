type CrossMarkProps = {
  size: number;
  onClick?: () => void;
  className?: string;
};

export default function CrossMark({
  size,
  onClick,
  className,
}: CrossMarkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className={`text-black active:opacity-50 transition-opacity hover:cursor-pointer ${className ?? ""}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* top-left → bottom-right */}
        <rect
          x="10"
          y="43"
          width="80"
          height="14"
          rx="4"
          transform="rotate(45 50 50)"
        />
        {/* bottom-left → top-right */}
        <rect
          x="10"
          y="43"
          width="80"
          height="14"
          rx="4"
          transform="rotate(-45 50 50)"
        />
      </svg>
    </button>
  );
}
