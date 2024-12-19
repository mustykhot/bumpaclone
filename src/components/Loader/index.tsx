import "./style.scss";
import { DashCircle } from "assets/Icons/DashCircle";

const Loader = () => {
  return (
    <div className="loader">
      <div className="loader__icon">
        <DashCircle stroke="#009444" />
      </div>
    </div>
  );
};

export default Loader;
