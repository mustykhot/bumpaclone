import { ReactNode } from "react";
import "./style.scss";
type SummaryCardProps = {
  color: "green" | "yellow" | "blue" | "red" | "clear" | "default";
  count: string | number;
  title?: string | ReactNode;
  icon?: ReactNode | string;
  handleClick?: any;
};

export const SummaryCard = ({
  color,
  count,
  title,
  icon,
  handleClick,
}: SummaryCardProps) => (
  <div
    onClick={() => {
      handleClick && handleClick();
    }}
    className={`pd_summary_overview_card ${color} ${
      handleClick ? "cursor-pointer" : ""
    } `}
  >
    <div className="text_box">
      <h3>{count}</h3>
      <p>{title}</p>
    </div>
    {icon && <div className="icon_box">{icon}</div>}
  </div>
);
