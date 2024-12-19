export const FillArrowIcon = ({
  className,
  stroke,
}: {
  className?: string;
  stroke?: string;
}) => (
  <svg
    width="8"
    height="6"
    viewBox="0 0 8 6"
    fill={"none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>Fill Arrow</title>
    <path
      d="M7.09832 0.5L0.901685 0.5C0.15069 0.5 -0.269991 1.25351 0.193991 1.7676L3.29231 5.20055C3.65265 5.59982 4.34735 5.59982 4.70769 5.20055L7.80601 1.7676C8.26999 1.25351 7.84931 0.5 7.09832 0.5Z"
      fill={stroke || "#5C636D"}
    />
  </svg>
);
