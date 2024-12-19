import { Button } from "@mui/material";
import "./style.scss";
import { FailIconLarge } from "assets/Icons/FailIconLarge";
import Modal from "components/Modal";

type TerminalFailModalProps = {
  openModal: boolean;
  closeModal: () => void;
  errorMessage: any;
  handleOpenCancelModal: () => void;
  handleTryAgain: () => void;
  from?: string;
};

export const TerminalFailModal = ({
  closeModal,
  openModal,
  errorMessage,
  handleOpenCancelModal,
  handleTryAgain,
  from,
}: TerminalFailModalProps) => {
  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={closeModal}
        closeOnOverlayClick={false}
      >
        <div className="response_modal">
          <div className="main">
            <FailIconLarge />
            <div className="text">
              <h2>
                {from === "getTerminal"
                  ? "Couldn’t Create Terminal Account"
                  : "Unable to Link Terminal"}
              </h2>
              <p>
                {errorMessage && errorMessage?.data?.message
                  ? errorMessage?.data?.message
                  : from === "getTerminal"
                  ? "We couldn’t create  a Terminal Account Number"
                  : "We couldn’t link your Bumpa Terminal Account Number to you Bumpa Account"}
              </p>
            </div>
            <div className="button_container">
              <Button
                onClick={() => {
                  handleTryAgain();
                }}
                variant="contained"
                className="primary primary_styled_button try"
              >
                Try Again
              </Button>
              <Button
                onClick={() => {
                  if (window.FreshworksWidget) {
                    window.FreshworksWidget("open");
                  }
                }}
                variant="outlined"
              >
                Need Help? Contact Support
              </Button>
              <p
                onClick={() => {
                  handleOpenCancelModal();
                }}
              >
                Cancel
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
