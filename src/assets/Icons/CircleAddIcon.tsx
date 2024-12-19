export const CircleAddIcon = ({
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
    <title>Add</title>

    <g clip-path="url(#clip0_10190_16523)">
      <path
        d="M9.99984 6.66666V13.3333M6.6665 9.99999H13.3332M18.3332 9.99999C18.3332 14.6024 14.6022 18.3333 9.99984 18.3333C5.39746 18.3333 1.6665 14.6024 1.6665 9.99999C1.6665 5.39762 5.39746 1.66666 9.99984 1.66666C14.6022 1.66666 18.3332 5.39762 18.3332 9.99999Z"
        stroke={stroke || "#EFF2F7"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_10190_16523">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
