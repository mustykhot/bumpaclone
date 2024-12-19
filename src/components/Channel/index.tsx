import { WebsiteIcon } from "assets/Icons/WebsiteIcon";
import instagram from "assets/images/instagram.png";
import "./style.scss";
type ChannelProps = {
  type: "website" | "instagram";
  title: string;
};

export const Channel = ({ type, title }: ChannelProps) => {
  const imageFunction = (type: string) => {
    switch (type) {
      case "website":
        return <WebsiteIcon />;
      case "instagram":
        return <img src={instagram} alt="instagram" width={21} height={22} />;
      default:
        return "";
        break;
    }
  };

  return (
    <div className="pd_channel_picker">
      {imageFunction(type)} <p>{title}</p>{" "}
    </div>
  );
};
