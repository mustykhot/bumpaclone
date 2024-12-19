export const UserCircleIcon = ({
  className,
  stroke,
  strokeWidth,
}: {
  className?: string;
  stroke?: string;
  strokeWidth?: number;
}) => (
  <svg
    width="33"
    height="32"
    viewBox="0 0 33 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7.60312 25.918C8.41422 24.007 10.308 22.6667 12.5147 22.6667H20.5147C22.7215 22.6667 24.6152 24.007 25.4263 25.918M21.8481 12.6667C21.8481 15.6123 19.4602 18.0001 16.5147 18.0001C13.5692 18.0001 11.1814 15.6123 11.1814 12.6667C11.1814 9.72123 13.5692 7.33341 16.5147 7.33341C19.4602 7.33341 21.8481 9.72123 21.8481 12.6667ZM29.8481 16.0001C29.8481 23.3639 23.8785 29.3334 16.5147 29.3334C9.15093 29.3334 3.1814 23.3639 3.1814 16.0001C3.1814 8.63628 9.15093 2.66675 16.5147 2.66675C23.8785 2.66675 29.8481 8.63628 29.8481 16.0001Z"
      stroke={stroke || "#009444"}
      strokeWidth={strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
