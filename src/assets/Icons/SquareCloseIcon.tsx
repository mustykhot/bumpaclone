import * as React from "react";

type Props = { bg?: string; color?: string } & React.SVGProps<SVGSVGElement>;

const SquareCloseIcon = (props: Props) => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="44" height="44" rx="8" fill={props.bg || "#EFF1F3"} />
    <path
      d="M28 16L16 28M16 16L28 28"
      stroke={props.color || "#222D37"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SquareCloseIcon;
