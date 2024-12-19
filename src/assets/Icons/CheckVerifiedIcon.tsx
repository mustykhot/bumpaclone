export const CheckVerifiedIcon = ({
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
    <title>Check</title>
    <g clipPath="url(#clip0_2172_4149)">
      <path
        d="M7.49935 9.99984L9.16602 11.6665L12.916 7.9165M7.6676 17.1672C7.94072 17.1311 8.21663 17.2052 8.4342 17.3728L9.4369 18.1422C9.76835 18.3968 10.2294 18.3968 10.56 18.1422L11.6006 17.3432C11.795 17.1941 12.0404 17.1283 12.283 17.1608L13.5847 17.332C13.9986 17.3867 14.3976 17.1561 14.5578 16.77L15.0587 15.5589C15.1522 15.3321 15.3318 15.1525 15.5586 15.059L16.7696 14.558C17.1557 14.3988 17.3862 13.9988 17.3316 13.5849L17.1668 12.3303C17.1307 12.0572 17.2048 11.7813 17.3723 11.5637L18.1417 10.5609C18.3963 10.2295 18.3963 9.76836 18.1417 9.43782L17.3427 8.3971C17.1937 8.20267 17.1279 7.9573 17.1603 7.71472L17.3316 6.4129C17.3862 5.99902 17.1557 5.59996 16.7696 5.43978L15.5586 4.93887C15.3318 4.84535 15.1522 4.66573 15.0587 4.43888L14.5578 3.2278C14.3985 2.8417 13.9986 2.61115 13.5847 2.66578L12.283 2.83707C12.0404 2.87041 11.795 2.80467 11.6015 2.65652L10.5609 1.85747C10.2294 1.60285 9.76835 1.60285 9.43782 1.85747L8.39717 2.65652C8.20274 2.80467 7.95739 2.87041 7.71482 2.83892L6.41307 2.66763C5.99922 2.61301 5.60018 2.84355 5.44001 3.22966L4.94005 4.44073C4.84561 4.66665 4.666 4.84628 4.44009 4.94072L3.22908 5.44071C2.843 5.60089 2.61246 5.99995 2.66709 6.41383L2.83837 7.71564C2.86985 7.95823 2.80411 8.20359 2.65598 8.3971L1.85697 9.43782C1.60236 9.76929 1.60236 10.2304 1.85697 10.5609L2.65598 11.6016C2.80504 11.7961 2.87078 12.0414 2.83837 12.284L2.66709 13.5859C2.61246 13.9997 2.843 14.3988 3.22908 14.559L4.44009 15.0599C4.66692 15.1534 4.84654 15.333 4.94005 15.5599L5.44093 16.7709C5.60018 17.157 6.00015 17.3876 6.414 17.333L7.6676 17.1672Z"
        stroke={stroke || "#0059DE"}
        strokeWidth={strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_2172_4149">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
