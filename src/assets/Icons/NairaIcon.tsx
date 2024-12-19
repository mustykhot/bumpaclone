export const NairaIcon = ({
  className,
  stroke,
}: {
  stroke?: string;
  className?: string;
}) => (
  <svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill={"none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>Naira</title>
    <path
      d="M6.90039 19V5L18.1004 19V5"
      stroke={stroke || "#9BA2AC"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="3.70117"
      y1="9.59961"
      x2="21.3012"
      y2="9.59961"
      stroke={stroke || "#9BA2AC"}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="3.70117"
      y1="15.1992"
      x2="21.3012"
      y2="15.1992"
      stroke={stroke || "#9BA2AC"}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
