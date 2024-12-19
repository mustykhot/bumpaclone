import { IconButton } from "@mui/material";
import Modal from "components/Modal";
import { Button } from "@mui/material";
import "./style.scss";
import { XIcon } from "assets/Icons/XIcon";
import { ReactNode } from "react";
import { CheckCircleLargeIcon } from "assets/Icons/CheckCircleLarge";
import confetti from "assets/images/confetti.png";
import { FailedIcon } from "assets/Icons/FailedIcon";

type SuccessfulConnectionModalProps = {
  openModal: boolean;
  closeModal: () => void;
  image?: ReactNode;
  title?: string;
  description?: string;
  btnText?: string;
  btnAction?: Function;
  isCancel?: boolean;
  isMeta?: boolean;
  isFailed?: boolean;
  isPending?: boolean;
  addDoneBtn?: boolean;
  designedText?: string;
  reduceSpacing?: boolean;
};

export const SuccessfulConnectionModal = ({
  closeModal,
  openModal,
  title,
  description,
  btnAction,
  isMeta,
  isFailed,
  btnText,
  isPending,
  addDoneBtn,
  designedText,
  reduceSpacing,
}: SuccessfulConnectionModalProps) => {
  return (
    <Modal openModal={openModal} closeModal={closeModal}>
      <div className="connect_modal general_modal success_modal">
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
        {isMeta ? (
          <img src={confetti} alt="confetti" width={160} height={160} />
        ) : isPending ? (
          <FailedIcon
            lightStroke="#FFF8E7"
            stroke="#F4A408"
            className="middle_icon"
          />
        ) : isFailed ? (
          <FailedIcon className="middle_icon" />
        ) : (
          <CheckCircleLargeIcon
            className={`middle_icon ${reduceSpacing ? "reduce" : ""} `}
          />
        )}

        <h2>{title}</h2>

        <p className="description">{description}</p>

        {designedText && (
          <div className="designed_text">
            <p>{designedText}</p>
          </div>
        )}

        <div
          className={`button_container mt-[20px] ${
            reduceSpacing ? "reduce" : ""
          }`}
        >
          <Button
            onClick={() => {
              btnAction && btnAction();
            }}
            variant="contained"
            className="primary primary_styled_button"
          >
            {btnText || "Start Selling"}
          </Button>
          {addDoneBtn && (
            <Button
              onClick={() => {
                closeModal();
              }}
              variant="outlined"
              className="secondary"
            >
              Done
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
