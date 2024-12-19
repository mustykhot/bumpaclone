export const BarIcon = ({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={"none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>{title || "Bar"}</title>
    <path
      d="M18 20V10M12 20V4M6 20V14"
      stroke={"#5C636D"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
