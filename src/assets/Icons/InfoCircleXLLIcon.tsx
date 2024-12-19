export const InfoCircleXLLIcon = ({
  className,
  stroke,
}: {
  className?: string;
  stroke?: string;
}) => (
  <svg
    width="136"
    height="135"
    viewBox="0 0 136 135"
    fill={"none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>Info Circle</title>
    <path
      d="M67.9994 89.8334V67.375M67.9994 44.9167H68.0555M124.145 67.375C124.145 98.3835 99.0078 123.521 67.9994 123.521C36.9909 123.521 11.8535 98.3835 11.8535 67.375C11.8535 36.3665 36.9909 11.2292 67.9994 11.2292C99.0078 11.2292 124.145 36.3665 124.145 67.375Z"
      stroke={stroke || "#F4A408"}
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
