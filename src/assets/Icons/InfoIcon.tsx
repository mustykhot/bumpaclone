export const InfoIcon = ({
  className,
  stroke,
}: {
  className?: string;
  stroke?: string;
}) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_2605_67519)">
      <path
        d="M7.00008 9.33073V6.9974M7.00008 4.66406H7.00591M12.8334 6.9974C12.8334 10.2191 10.2217 12.8307 7.00008 12.8307C3.77842 12.8307 1.16675 10.2191 1.16675 6.9974C1.16675 3.77573 3.77842 1.16406 7.00008 1.16406C10.2217 1.16406 12.8334 3.77573 12.8334 6.9974Z"
        stroke={stroke || "white"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_2605_67519">
        <rect width="20" height="20" fill={stroke || "white"} />
      </clipPath>
    </defs>
  </svg>
);
