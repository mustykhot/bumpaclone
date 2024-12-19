import { Button } from "@mui/material";
import "./style.scss";
import { HelpCircleIconLarge } from "assets/Icons/HelpCircleIconLarge";
import Modal from "components/Modal";

type CancelVerificationModalProps = {
  openModal: boolean;
  closeModal: () => void;
  handleCancelVerification: Function;
  handleDismissVerification: Function;
};

export const CancelVerificationModal = ({
  closeModal,
  openModal,
  handleCancelVerification,
  handleDismissVerification,
}: CancelVerificationModalProps) => {
  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={closeModal}
        closeOnOverlayClick={false}
      >
        <div className="cancel_verification_modal">
          <div className="main">
            <HelpCircleIconLarge />
            <div className="text">
              <h2>Are you sure you want to cancel verification?</h2>
              <p>
                Don’t worry, you will continue your verification from where you
                stopped.
              </p>
            </div>
            <div className="button_container">
              <Button
                onClick={() => {
                  handleCancelVerification();
                }}
                variant="contained"
              >
                Yes, Cancel Verification
              </Button>
              <p
                onClick={() => {
                  handleDismissVerification();
                }}
              >
                Dismiss
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
