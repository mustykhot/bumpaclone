import { Button, CircularProgress, IconButton } from "@mui/material";
import { InfoCircleXLIcon } from "assets/Icons/InfoCircleXLIcon";
import "./style.scss";
import { ReactNode } from "react";
import CloseIcon from "assets/Icons/CloseIcon";
import { XIcon } from "assets/Icons/XIcon";
type propType = {
  text: string | ReactNode;
  title?: string;
  isCancel?: boolean;
  color: string;
  btnText?: string;
  iconColor?: string;
  btnAction?: () => void;
  cancelAction?: () => void;
  icon?: ReactNode;
  isLoading?: boolean;
};
const InfoBox = ({
  title,
  text,
  color,
  btnText,
  btnAction,
  iconColor,
  cancelAction,
  icon,
  isCancel = false,
  isLoading,
}: propType) => {
  return (
    <div className={`pd_info_box ${color}`}>
      <div className="text_side">
        {icon || <InfoCircleXLIcon stroke={iconColor} />}
        <div className="title_explanation">
          <p className="title">{title}</p>
          <p className={`${title ? "" : "description"}`}>{text}</p>
        </div>
      </div>

      <div className={`button_side ${isCancel ? "" : "no_cancel"}`}>
        {btnAction && (
          <Button
            onClick={() => {
              btnAction();
            }}
            className="btn"
          >
            {btnText}
          </Button>
        )}
        {isCancel && (
          <IconButton
            className="cancel_btn"
            onClick={() => {
              cancelAction && cancelAction();
            }}
          >
            {isLoading ? (
              <CircularProgress size="1.5rem" sx={{ color: "#000000" }} />
            ) : (
              <XIcon />
            )}
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default InfoBox;
