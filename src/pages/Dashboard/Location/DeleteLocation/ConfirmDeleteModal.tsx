import { ReactNode } from "react";
import { Button } from "@mui/material";
import { CircularProgress, IconButton } from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";
import Modal from "components/Modal";
import "./style.scss";
type ModalProps = {
  openModal: boolean;
  closeModal: Function;
  isLoading?: boolean;
  btnAction: () => void;
  icon: ReactNode;
  title: string;
  description_text: string;
  second_description_text?: string;
  btnText?: string;
  isError?: boolean;
  displayCancel?: boolean;
};

const ConfirmDeleteModal = ({
  openModal,
  closeModal,
  btnAction,
  isLoading,
  icon,
  description_text,
  title,
  second_description_text,
  btnText,
  isError = true,
  displayCancel = true,
}: ModalProps) => {
  return (
    <Modal openModal={openModal} closeModal={closeModal}>
      <div className="cancel_subscription_modal pd_delete_location success">
        <div className="cancel_section">
          <div className="text_box"></div>

          <IconButton
            onClick={() => {
              closeModal();
            }}
            disabled={isLoading}
            className="icon_button_container"
          >
            <XIcon />
          </IconButton>
        </div>
        <div className="cancel_successful_container">
          {icon}
          <h3>{title}</h3>
          <p className="desc">{description_text}</p>
          {second_description_text && (
            <p className="grey">{second_description_text}</p>
          )}

          <div className="btn_box">
            <Button
              onClick={btnAction}
              className={`submit ${
                isError ? "error" : "primary_styled_button"
              } `}
              variant="contained"
            >
              {isLoading ? (
                <CircularProgress size="1.5rem" sx={{ color: "white" }} />
              ) : (
                btnText || "Yes, delete store"
              )}
            </Button>
            {displayCancel && (
              <Button
                className="done"
                disabled={isLoading}
                onClick={() => {
                  closeModal();
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
