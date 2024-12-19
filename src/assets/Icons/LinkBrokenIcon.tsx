export const LinkBrokenIcon = ({
  className,
  stroke,
}: {
  className?: string;
  stroke?: string;
}) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill={"none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>Link Broken</title>
    <g clipPath="url(#clip0_2006_46737)">
      <path
        d="M6.00004 2.66536V1.33203M10 13.332V14.6654M2.66671 5.9987H1.33337M13.3334 9.9987H14.6667M3.27618 3.27484L2.33337 2.33203M12.7239 12.7226L13.6667 13.6654M8.00004 11.7699L6.58583 13.1841C5.54443 14.2255 3.85599 14.2255 2.81459 13.1841C1.77319 12.1428 1.77319 10.4543 2.81459 9.41291L4.2288 7.9987M11.7713 7.9987L13.1855 6.58448C14.2269 5.54309 14.2269 3.85465 13.1855 2.81325C12.1441 1.77185 10.4557 1.77185 9.41425 2.81325L8.00004 4.22746"
        stroke={stroke || "#D90429"}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_2006_46737">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
