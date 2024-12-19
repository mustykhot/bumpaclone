
export const CheckSmall = ({
  className,
  stroke,
}: {
  className?: string;
  stroke?: string;
}) => (
  <svg 
    width="16" height="16" 
    viewBox="0 0 16 16" fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    >
  <g clip-path="url(#clip0_7876_162782)">
  <mask id="mask0_7876_162782" 
  // style="mask-type:luminance" 
  maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
  <path 
  d="M8.00017 14.6667C8.87581 14.6678 9.74305 14.4959 10.552 14.1608C11.361 13.8257 12.0958 13.334 12.7142 12.714C13.3342 12.0956 13.8258 11.3608 14.1609 10.5519C14.496 9.74287 14.668 8.87563 14.6668 7.99998C14.6679 7.12434 14.496 6.25711 14.1609 5.44813C13.8258 4.63914 13.3341 3.90435 12.7142 3.28598C12.0958 2.66599 11.361 2.17432 10.552 1.83921C9.74305 1.50411 8.87581 1.33218 8.00017 1.33332C7.12453 1.3322 6.2573 1.50414 5.44831 1.83924C4.63933 2.17434 3.90454 2.66601 3.28617 3.28598C2.66619 3.90435 2.17453 4.63914 1.83942 5.44813C1.50432 6.25711 1.33239 7.12434 1.3335 7.99998C1.33237 8.87563 1.50429 9.74287 1.8394 10.5519C2.1745 11.3608 2.66618 12.0956 3.28617 12.714C3.90454 13.334 4.63933 13.8256 5.44831 14.1607C6.2573 14.4958 7.12453 14.6678 8.00017 14.6667Z" 
  fill="white" 
  stroke={stroke || "white"} 
  strokeWidth="1.33333" 
  strokeLinejoin="round"
  />
  <path d="M5.3335 8.00006L7.3335 10.0001L11.3335 6.00006" stroke="black" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  </mask>
  <g mask="url(#mask0_7876_162782)">
  <path d="M0 6.10352e-05H16V16.0001H0V6.10352e-05Z" fill="#009444"/>
  </g>
  </g>
  <defs>
  <clipPath id="clip0_7876_162782">
  <rect width="16" height="16" fill="white"/>
  </clipPath>
  </defs>
  </svg>
  
);

