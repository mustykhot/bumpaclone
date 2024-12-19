import { MouseEventHandler } from "react";
export const ClearIcon = ({
  className,
  handleClick,
  stroke,
}: {
  className?: string;
  stroke?: string;
  handleClick?: MouseEventHandler<SVGSVGElement> | undefined;
}) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill={"none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    onClick={handleClick}
  >
    <title>Clear</title>
    <path
      d="M14.1666 5.83331L5.83325 14.1666M5.83325 5.83331L14.1666 14.1666"
      stroke={stroke || "#009444"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
