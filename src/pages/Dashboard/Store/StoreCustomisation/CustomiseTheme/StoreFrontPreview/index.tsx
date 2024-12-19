import { Link } from "react-router-dom";
import { ArrowRightIcon } from "assets/Icons/ArrowRightIcon";
import "./style.scss";
import storefront from "assets/images/store-front.svg";

const StoreForePreview = () => {
  return (
    <div className="store-front">
      <div className="store-front__heading">
        <Link to={"/dashboard/customisation/customise-theme"}>
          <ArrowRightIcon />
        </Link>
        <h3>Storefront Preview</h3>
      </div>

      <div className="store-front__store-view">
        <img src={storefront} alt="preview" />
      </div>
    </div>
  );
};

export default StoreForePreview;
