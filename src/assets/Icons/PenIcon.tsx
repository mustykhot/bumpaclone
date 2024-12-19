import React from "react";

const PenIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.28907 9.85406L10.6641 2.47903C11.4278 1.71532 12.666 1.71532 13.4297 2.47903C14.1934 3.24274 14.1934 4.48096 13.4297 5.24467L6.0547 12.6197L1.90625 14.0025L3.28907 9.85406Z"
        fill={props.color || "#00233F"}
        fillOpacity="0.1"
        stroke={props.color || "#00233F"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PenIcon;
