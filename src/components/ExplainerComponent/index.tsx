import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import "./style.scss";
const ExplainerComponent = ({ text }: { text: string }) => {
  return (
    <div className="pd_explainer_component">
      <InfoCircleIcon />
      <p>{text}</p>
    </div>
  );
};

export default ExplainerComponent;
