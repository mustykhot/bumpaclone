export const TransactionIcon = ({
  className,
  isActive,
  title,
}: {
  className?: string;
  isActive?: boolean;
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
    <title>{title || "Transaction"}</title>
    <path
      d="M20 17H4M4 17L8 13M4 17L8 21M4 7H20M20 7L16 3M20 7L16 11"
      stroke={isActive ? "#009444" : "#5C636D"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
