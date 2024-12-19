export const ScanIcon = ({
  className,
  title,
  stroke,
  strokeWidth,
}: {
  className?: string;
  title?: string;
  stroke?: string;
  strokeWidth?: number;
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={"none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>{title || "Scan"}</title>
    <path
      d="M8.83594 3H8.63594C6.95578 3 6.1157 3 5.47397 3.32698C4.90948 3.6146 4.45054 4.07354 4.16292 4.63803C3.83594 5.27976 3.83594 6.11984 3.83594 7.8V8M8.83594 21H8.63594C6.95578 21 6.1157 21 5.47397 20.673C4.90948 20.3854 4.45054 19.9265 4.16292 19.362C3.83594 18.7202 3.83594 17.8802 3.83594 16.2V16M21.8359 8V7.8C21.8359 6.11984 21.8359 5.27976 21.509 4.63803C21.2213 4.07354 20.7624 3.6146 20.1979 3.32698C19.5562 3 18.7161 3 17.0359 3H16.8359M21.8359 16V16.2C21.8359 17.8802 21.8359 18.7202 21.509 19.362C21.2213 19.9265 20.7624 20.3854 20.1979 20.673C19.5562 21 18.7161 21 17.0359 21H16.8359M3.83594 12H3.84594M8.33594 12H8.34594M17.3359 12H17.3459M12.8359 12H12.8459M21.8359 12H21.8459"
      stroke={stroke || "#5C636D"}
      strokeWidth={strokeWidth || 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
