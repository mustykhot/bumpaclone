import { IconButton } from "@mui/material";
import Modal from "components/Modal";
import { Button } from "@mui/material";
import "./style.scss";
import { XIcon } from "assets/Icons/XIcon";
import { ReactNode } from "react";

type GeneralModalProps = {
  openModal: boolean;
  closeModal: () => void;
  image?: ReactNode;
  title?: string;
  description?: string;
  btnText?: string | ReactNode;
  btnAction?: Function;
  isCancel?: boolean;
  reduceMargin?: boolean;
  btnError?: boolean;
};

export const GeneralModal = ({
  closeModal,
  openModal,
  image,
  title,
  description,
  btnText,
  btnAction,
  isCancel,
  btnError,
  reduceMargin,
}: GeneralModalProps) => {
  return (
    <Modal openModal={openModal} closeModal={closeModal}>
      <div className="connect_modal general_modal">
        <div className="cancel_section">
          <IconButton
            onClick={() => {
              closeModal();
            }}
            className="icon_button_container"
          >
            <XIcon />
          </IconButton>
        </div>

        {image && image}

        <h2>{title}</h2>

        <p className="description">{description}</p>

        <div
          className={`button_container ${reduceMargin ? "reduceMargin" : ""}`}
        >
          <Button
            onClick={() => {
              btnAction && btnAction();
            }}
            variant="contained"
            className={`primary primary_styled_button ${
              btnError ? "btnError" : ""
            }`}
          >
            {btnText}
          </Button>
          {isCancel && (
            <Button onClick={closeModal} variant="outlined" className="cancel">
              No, Cancel
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
