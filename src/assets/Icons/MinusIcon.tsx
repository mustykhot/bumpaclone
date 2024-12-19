export const MinusIcon = ({ 
    className,
    stroke
     }: 
    { className?: string; stroke?:string }) => (
    <svg
      width="15"
      height="2"
      viewBox="0 0 15 2"
      fill={"none"}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Subtract</title>
      <path
        d="M1.4165 1H13.0832" 
        stroke={stroke || "#5C636D" }
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

