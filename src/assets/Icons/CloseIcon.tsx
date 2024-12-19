import * as React from "react";

type Props = { bg?: string; color?: string } & React.SVGProps<SVGSVGElement>;

const CloseIcon = (props: Props) => (
  <svg
    width={32}
    height={32}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx={16} cy={16} r={16} fill={props.bg || "#EEF1F5"} />
    <path
      d="m20 12-8 8M12 12l8 8"
      stroke={props.color || "#434343"}
      strokeWidth={1.333}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CloseIcon;
