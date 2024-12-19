import React from "react";

export const PaintPourIcon = ({
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
    <title>Paint</title>
    <g clip-path="url(#clip0_12115_859)">
      <path
        d="M13.3331 9.16667L1.66641 9.16667M8.33308 3.33334L6.66641 1.66667M11.6664 18.3333L1.66641 18.3333M18.3331 13.3333C18.3331 14.2538 17.5869 15 16.6664 15C15.7459 15 14.9997 14.2538 14.9997 13.3333C14.9997 12.4129 16.6664 10.8333 16.6664 10.8333C16.6664 10.8333 18.3331 12.4129 18.3331 13.3333ZM7.49975 2.50001L13.2236 8.22386C13.5536 8.55388 13.7186 8.71888 13.7805 8.90916C13.8348 9.07653 13.8348 9.25682 13.7805 9.42419C13.7186 9.61446 13.5536 9.77947 13.2236 10.1095L9.38536 13.9477C8.72534 14.6077 8.39532 14.9378 8.01478 15.0614C7.68004 15.1702 7.31946 15.1702 6.98472 15.0614C6.60417 14.9378 6.27416 14.6077 5.61413 13.9477L2.7187 11.0523C2.05867 10.3923 1.72866 10.0622 1.60501 9.6817C1.49625 9.34696 1.49625 8.98638 1.60501 8.65164C1.72866 8.2711 2.05867 7.94108 2.7187 7.28105L7.49975 2.50001Z"
        stroke={stroke || "#0D1821"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_12115_859">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
