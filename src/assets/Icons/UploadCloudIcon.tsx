export const UploadCloudIcon = ({
  className,
  stroke,
}: {
  className?: string;
  stroke?: string;
}) => (
  <svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill={"none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>Upload Cloud</title>
    <path
      d="M4.5 16.2422C3.29401 15.435 2.5 14.0602 2.5 12.5C2.5 10.1564 4.29151 8.23129 6.57974 8.01937C7.04781 5.17213 9.52024 3 12.5 3C15.4798 3 17.9522 5.17213 18.4203 8.01937C20.7085 8.23129 22.5 10.1564 22.5 12.5C22.5 14.0602 21.706 15.435 20.5 16.2422M8.5 16L12.5 12M12.5 12L16.5 16M12.5 12V21"
      stroke={stroke || "#9BA2AC"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
