export const SendIcon = ({
  className,
  stroke,
  strokeWidth,
}: {
  className?: string;
  stroke?: string;
  strokeWidth?: number;
}) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill={"none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>Send Icon</title>
    <g clipPath="url(#clip0_2271_6768)">
      <path
        d="M8.74964 11.2501L17.4996 2.50014M8.85596 11.5235L11.0461 17.1552C11.239 17.6513 11.3355 17.8994 11.4745 17.9718C11.595 18.0346 11.7385 18.0347 11.8591 17.972C11.9982 17.8998 12.0949 17.6518 12.2884 17.1559L17.7804 3.08281C17.9551 2.63516 18.0424 2.41133 17.9946 2.26831C17.9532 2.1441 17.8557 2.04663 17.7315 2.00514C17.5885 1.95736 17.3646 2.0447 16.917 2.21939L2.84386 7.71134C2.34796 7.90486 2.10001 8.00163 2.02775 8.14071C1.96512 8.26129 1.9652 8.40483 2.02798 8.52533C2.1004 8.66433 2.34846 8.7608 2.84458 8.95373L8.47625 11.1438C8.57696 11.183 8.62731 11.2026 8.66972 11.2328C8.7073 11.2596 8.74016 11.2925 8.76697 11.3301C8.79721 11.3725 8.8168 11.4228 8.85596 11.5235Z"
        stroke={stroke || "white"}
        strokeWidth={strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_2271_6768">
        <rect width="20" height="20" fill={stroke || "white"} />
      </clipPath>
    </defs>
  </svg>
);
