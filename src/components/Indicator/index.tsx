import { ArrowDownRightIcon } from "assets/Icons/ArrowDownRightIcon";
import { ArrowUpRightIcon } from "assets/Icons/ArrowUpRightIcon";
import "./style.scss";
import { classNames } from "react-easy-crop/helpers";
type IndicatorProps = {
  isIncrease?: boolean;
  indicatorText?: string;
  className?: string;
};

export const Indicator = ({ isIncrease, indicatorText, className }: IndicatorProps) => (
  <p className={`indicator ${isIncrease ? "increase" : "decrease"} ${className}`}>
    {isIncrease ? <ArrowUpRightIcon /> : <ArrowDownRightIcon />}
    {indicatorText}
  </p>
);
