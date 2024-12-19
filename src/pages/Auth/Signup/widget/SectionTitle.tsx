import { ReactNode } from "react";
import "./style.scss";

type SectionTitleProps = {
  title: string;
  description?: ReactNode;
  extraDesc?: string;
  pre?: boolean;
};

export const SectionTitle = ({
  title,
  description,
  extraDesc,
  pre,
}: SectionTitleProps) => (
  <div className="pd_sectionTitle">
    <h1>{title}</h1>
    <p className={`description ${pre && "pre"}`}>
      {description}
      <span>{extraDesc}</span>
    </p>
  </div>
);
