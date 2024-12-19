export const SettlementIcon = ({
  className,
  title,
  stroke,
}: {
  className?: string;
  title?: string;
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
    <title>{title || "Settlement"}</title>
    <g clip-path="url(#clip0_10690_188572)">
      <path
        d="M1.94987 12.1554C1.20743 9.37521 1.92675 6.28592 4.10783 4.10484C7.3622 0.85047 12.6386 0.85047 15.8929 4.10484C19.1473 7.35921 19.1473 12.6356 15.8929 15.8899C13.7119 18.071 10.6226 18.7903 7.84243 18.0479M12.5005 12.4975V7.49748M12.5005 7.49748H7.5005M12.5005 7.49748L4.16701 15.8308"
        stroke={stroke || "#009444"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_10690_188572">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
