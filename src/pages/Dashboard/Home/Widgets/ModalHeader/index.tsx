import { ReactNode } from "react";
import { IconButton } from "@mui/material";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import "./style.scss";
import { useNavigate } from "react-router-dom";
type ModalHeaderProps = {
  extraText?: string;
  text: string | ReactNode;
  extraClass?: string;
  button?: ReactNode;
  closeModal?: () => void;
};

export const ModalHeader = ({
  extraText,
  text,
  button,
  closeModal,
  extraClass,
}: ModalHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className={`modal_header ${extraClass}`}>
      <div className="back_button">
        <IconButton
          type="button"
          onClick={() => {
            if (closeModal) {
              closeModal();
            } else {
              navigate(-1);
            }
          }}
          className="icon_button_container"
        >
          <BackArrowIcon />
        </IconButton>
        <div className="content">
          {typeof text === "string" ? <p>{text}</p> : text}
          {extraText && <span>{extraText}</span>}
        </div>
      </div>

      {button}
    </div>
  );
};
