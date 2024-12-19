export const CheckCircleLargeIcon = ({
  className,
  stroke,
}: {
  className?: string;
  stroke?: string;
}) => (
  <svg
    width="136"
    height="135"
    viewBox="0 0 136 135"
    fill={"none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>Large Check Circle</title>
    <path
      d="M42.7347 67.5013L59.5785 84.3451L93.266 50.6576M124.146 67.5013C124.146 98.5098 99.0088 123.647 68.0003 123.647C36.9918 123.647 11.8545 98.5098 11.8545 67.5013C11.8545 36.4928 36.9918 11.3555 68.0003 11.3555C99.0088 11.3555 124.146 36.4928 124.146 67.5013Z"
      stroke="url(#paint0_linear_2091_50786)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2091_50786"
        x1="10.7415"
        y1="67.2701"
        x2="121.679"
        y2="67.2701"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor={stroke || "#39B54A"} />
        <stop offset="1" stopColor={stroke || "#009444"} />
      </linearGradient>
    </defs>
  </svg>
);
