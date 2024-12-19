export const CreditCardIcon = ({ 
    className,
    stroke
     }: 
    { className?: string; stroke?:string }) => (
    <svg
      width="23"
      height="16"
      viewBox="0 0 23 16"
      fill={"none"}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Right Arrow</title>
      <path
        d="M21.5 6H1.5M10.5 10H5.5M1.5 4.2L1.5 11.8C1.5 12.9201 1.5 13.4802 1.71799 13.908C1.90973 14.2843 2.21569 14.5903 2.59202 14.782C3.01984 15 3.57989 15 4.7 15L18.3 15C19.4201 15 19.9802 15 20.408 14.782C20.7843 14.5903 21.0903 14.2843 21.282 13.908C21.5 13.4802 21.5 12.9201 21.5 11.8V4.2C21.5 3.0799 21.5 2.51984 21.282 2.09202C21.0903 1.7157 20.7843 1.40974 20.408 1.21799C19.9802 1 19.4201 1 18.3 1L4.7 1C3.5799 1 3.01984 1 2.59202 1.21799C2.2157 1.40973 1.90973 1.71569 1.71799 2.09202C1.5 2.51984 1.5 3.07989 1.5 4.2Z"
        stroke={stroke || "#5C636D" }
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

