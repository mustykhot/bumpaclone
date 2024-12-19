export const CheckedCircleIcon = ({
  className,
  strokeWidth,
}: {
  className?: string;
  strokeWidth?: number;
}) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill={"none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>Check</title>
    <g clipPath="url(#clip0_2091_49939)">
      <path
        d="M3.75 6L5.25 7.5L8.25 4.5M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z"
        stroke="#009444"
        strokeWidth={strokeWidth || 1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_2091_49939">
        <rect width="12" height="12" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
