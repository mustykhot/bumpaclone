import { ReactNode } from "react";
import { IconButton } from "@mui/material";
import { Button } from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";
import Modal from "components/Modal";
import "./style.scss";
type ModalProps = {
  openModal: boolean;
  closeModal: Function;
  isLoading?: boolean;
  btnAction: () => void;
  secondBtnAction: () => void;
  icon: ReactNode;
  title: string;
  description_text: string;
  second_description_text?: string;
  btnText?: string;
  secondBtnText?: string;
  isError?: boolean;
};

const SuccesfulOrderEditModal = ({
  openModal,
  closeModal,
  btnAction,
  isLoading,
  icon,
  description_text,
  title,
  second_description_text,
  btnText,
  secondBtnText,
  secondBtnAction,
  isError = false,
}: ModalProps) => {
  return (
    <Modal
      openModal={openModal}
      closeOnOverlayClick={false}
      closeModal={closeModal}
    >
      <div className="cancel_subscription_modal pd_edited_successfully success">
        <div className="cancel_section">
          <div className="text_box"></div>

          <IconButton
            onClick={() => {
              closeModal();
            }}
            className="icon_button_container"
          >
            <XIcon />
          </IconButton>
        </div>
        <div className="cancel_successful_container">
          {icon}
          <h3>{title}</h3>
          <p className="desc">{description_text}</p>

          <div className="btn_box">
            <Button
              onClick={btnAction}
              className={`submit ${
                isError ? "red_bg" : "primary_styled_button"
              }  `}
              variant="contained"
            >
              {btnText}
            </Button>
            <Button
              className="second_btn"
              variant="outlined"
              onClick={() => {
                secondBtnAction();
              }}
            >
              {secondBtnText}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SuccesfulOrderEditModal;
