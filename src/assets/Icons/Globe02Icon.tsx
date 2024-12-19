export const Globe02Icon = ({
  className,
  stroke,
  strokeWidth,
}: {
  className?: string;
  stroke?: string;
  strokeWidth?: number;
}) => (
  <svg
    width="110"
    height="110"
    viewBox="0 0 110 110"
    fill={"none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>Globe</title>
    <path
      d="M55.0013 9.16797C66.4655 21.7188 72.9806 38.0065 73.3346 55.0013C72.9806 71.9961 66.4655 88.2839 55.0013 100.835M55.0013 9.16797C43.5371 21.7188 37.022 38.0065 36.668 55.0013C37.022 71.9961 43.5371 88.2839 55.0013 100.835M55.0013 9.16797C29.6883 9.16797 9.16797 29.6883 9.16797 55.0013C9.16797 80.3144 29.6883 100.835 55.0013 100.835M55.0013 9.16797C80.3144 9.16797 100.835 29.6883 100.835 55.0013C100.835 80.3144 80.3144 100.835 55.0013 100.835M11.4597 41.2513H98.5431M11.4596 68.7513H98.543"
      stroke={stroke || "#009444"}
      strokeWidth={strokeWidth || 3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
