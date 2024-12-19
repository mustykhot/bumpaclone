export const ChevronDownIcon = ({
  className,
  onClick,
  stroke,
}: {
  className?: string;
  onClick?: () => void;
  stroke?: string;
}) => (
  <svg
    width="14"
    height="8"
    viewBox="0 0 14 8"
    fill={"none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    onClick={onClick}
  >
    <title>Chevron Down</title>
    <path
      d="M1 1L7 7L13 1"
      stroke={stroke || "#848D99"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
