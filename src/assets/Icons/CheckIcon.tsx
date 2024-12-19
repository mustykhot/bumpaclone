export const CheckIcon = ({
  className,
  stroke,
}: {
  className?: string;
  stroke?: string;
}) => (
  <svg
    width="43"
    height="30"
    viewBox="0 0 43 30"
    fill={"none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>Check</title>
    <path
      d="M40.1654 2L14.4987 27.6667L2.83203 16"
      stroke={stroke || "white"}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
