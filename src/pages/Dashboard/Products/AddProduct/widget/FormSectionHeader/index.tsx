import { ReactNode } from "react";
import "./style.scss";
import { IndicatorComponent } from "components/IndicatorComponent";
type FormSectionHeaderProps = {
  title: string;
  otherElement?: ReactNode;
  infoText?: string;
};

export const FormSectionHeader = ({
  title,
  otherElement,
  infoText,
}: FormSectionHeaderProps) => (
  <div className="form_section_header">
    <p>
      {title} {infoText && <IndicatorComponent text={infoText} />}{" "}
    </p>
    {otherElement}
  </div>
);
