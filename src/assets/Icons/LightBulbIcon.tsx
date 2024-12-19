export const LightBulbIcon = ({
  className,
  stroke,
  strokeWidth,
}: {
  className?: string;
  stroke?: string;
  strokeWidth?: number;
}) => (
  <svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill={"none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>Light</title>
    <path
      d="M10.5 17.6586V20C10.5 21.1046 11.3954 22 12.5 22C13.6046 22 14.5 21.1046 14.5 20V17.6586M12.5 2V3M3.5 12H2.5M6 5.5L5.3999 4.8999M19 5.5L19.6002 4.8999M22.5 12H21.5M18.5 12C18.5 15.3137 15.8137 18 12.5 18C9.18629 18 6.5 15.3137 6.5 12C6.5 8.68629 9.18629 6 12.5 6C15.8137 6 18.5 8.68629 18.5 12Z"
      stroke={stroke || "#5C636D"}
      strokeWidth={strokeWidth || 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
