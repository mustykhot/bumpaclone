import DropDownWrapper from "components/DropDownWrapper";
import { IconButton } from "@mui/material";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import "./style.scss";
type IndicatorComponentProps = {
  text?: string;
  hover?: boolean;
  origin?: string;
  extraClass?: string;
  description?: string;
};

export const IndicatorComponent = ({
  text,
  hover,
  description,
  origin = "left",
  extraClass,
}: IndicatorComponentProps) => (
  <div className={`pd_indicator_component ${origin}`}>
    <DropDownWrapper
      closeOnChildClick
      hover={hover}
      action={
        <IconButton
          size="small"
          sx={{ mr: "-0.7rem" }}
          className={`info_button ${extraClass}`}
        >
          <InfoCircleIcon />
        </IconButton>
      }
    >
      <p className="indicator_paragraph">{text}</p>
    </DropDownWrapper>
    {description && <p className="description">{description}</p>}
  </div>
);
