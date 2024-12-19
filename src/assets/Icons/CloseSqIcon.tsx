import { MouseEventHandler } from "react";
const CloseSqIcon = ({
  className,
  handleClick,
  stroke,
}: {
  className?: string;
  stroke?: string;
  handleClick?: MouseEventHandler<SVGSVGElement> | undefined;
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={"none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    onClick={handleClick}
  >
    <title>Clear</title>
    <path
      d="M18 6L6 18M6 6L18 18" 
      stroke={stroke || "#222D37"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default CloseSqIcon