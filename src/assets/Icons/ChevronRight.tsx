export const ChevronRight = ({
  className,
  stroke,
  strokeWidth,
}: {
  className?: string;
  stroke?: string;
  strokeWidth?: number;
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={"none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>Right Arrow</title>
    <path
      d="M9 18L15 12L9 6"
      stroke={stroke || "#9BA2AC"}
      strokeWidth={strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
