export const ShareIcon = ({
  className,
  stroke,
}: {
  className?: string;
  stroke?: string;
}) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill={"none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>Share</title>
    <path
      d="M7.15833 11.2587L12.85 14.5753M12.8417 5.42533L7.15833 8.74199M17.5 4.16699C17.5 5.5477 16.3807 6.66699 15 6.66699C13.6193 6.66699 12.5 5.5477 12.5 4.16699C12.5 2.78628 13.6193 1.66699 15 1.66699C16.3807 1.66699 17.5 2.78628 17.5 4.16699ZM7.5 10.0003C7.5 11.381 6.38071 12.5003 5 12.5003C3.61929 12.5003 2.5 11.381 2.5 10.0003C2.5 8.61961 3.61929 7.50033 5 7.50033C6.38071 7.50033 7.5 8.61961 7.5 10.0003ZM17.5 15.8337C17.5 17.2144 16.3807 18.3337 15 18.3337C13.6193 18.3337 12.5 17.2144 12.5 15.8337C12.5 14.4529 13.6193 13.3337 15 13.3337C16.3807 13.3337 17.5 14.4529 17.5 15.8337Z"
      stroke={stroke || "#5C636D"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
