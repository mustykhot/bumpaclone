export const UserIcon = ({
  className,
  stroke,
}: {
  className?: string;
  stroke?: string;
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12.0001 15C8.83002 15 6.01089 16.5306 4.21609 18.906C3.8298 19.4172 3.63665 19.6728 3.64297 20.0183C3.64785 20.2852 3.81546 20.6219 4.02546 20.7867C4.29728 21 4.67396 21 5.42733 21H18.5729C19.3262 21 19.7029 21 19.9747 20.7867C20.1847 20.6219 20.3523 20.2852 20.3572 20.0183C20.3635 19.6728 20.1704 19.4172 19.7841 18.906C17.9893 16.5306 15.1702 15 12.0001 15Z"
      stroke={stroke || "#222D37"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.0001 12C14.4854 12 16.5001 9.98528 16.5001 7.5C16.5001 5.01472 14.4854 3 12.0001 3C9.51481 3 7.5001 5.01472 7.5001 7.5C7.5001 9.98528 9.51481 12 12.0001 12Z"
      stroke={stroke || "#222D37"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
