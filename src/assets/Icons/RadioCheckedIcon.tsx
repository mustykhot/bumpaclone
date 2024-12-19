export const RadioCheckedIcon = ({
  className,
  fill,
}: {
  className?: string;
  fill?: string;
}) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_557_961)">
      <mask
        id="mask0_557_961"
        // style="mask-type:luminance"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="18"
        height="18"
      >
        <path
          d="M9.00001 16.5C9.98511 16.5013 10.9607 16.3079 11.8709 15.9309C12.781 15.5539 13.6076 15.0007 14.3033 14.3033C15.0007 13.6076 15.5539 12.781 15.9309 11.8709C16.3079 10.9607 16.5013 9.98511 16.5 9.00001C16.5013 8.01491 16.3078 7.03927 15.9308 6.12917C15.5539 5.21906 15.0007 4.39242 14.3033 3.69676C13.6076 2.99927 12.781 2.44613 11.8709 2.06914C10.9607 1.69215 9.98511 1.49873 9.00001 1.50001C8.01491 1.49875 7.03927 1.69218 6.12917 2.06917C5.21906 2.44616 4.39242 2.99928 3.69676 3.69676C2.99928 4.39242 2.44616 5.21906 2.06917 6.12917C1.69218 7.03927 1.49875 8.01491 1.50001 9.00001C1.49873 9.98511 1.69215 10.9607 2.06914 11.8709C2.44613 12.781 2.99927 13.6076 3.69676 14.3033C4.39242 15.0007 5.21906 15.5539 6.12917 15.9308C7.03927 16.3078 8.01491 16.5013 9.00001 16.5Z"
          fill="white"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M6 9L8.25 11.25L12.75 6.75"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </mask>
      <g mask="url(#mask0_557_961)">
        <path d="M0 0H18V18H0V0Z" fill={fill || "#009444"} />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_557_961">
        <rect width="18" height="18" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
