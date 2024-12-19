import { Button } from "@mui/material";
import "./style.scss";
import { FailIconLarge } from "assets/Icons/FailIconLarge";
import Modal from "components/Modal";

type BvnFailModalProps = {
  openModal: boolean;
  closeModal: () => void;
  errorMessage: any;
  handleOpenCancelModal: Function;
};

export const BvnFailModal = ({
  closeModal,
  openModal,
  errorMessage,
  handleOpenCancelModal,
}: BvnFailModalProps) => {
  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={closeModal}
        closeOnOverlayClick={false}
      >
        <div className="bvn_modal success">
          <div className="main">
            <FailIconLarge />
            <div className="text">
              <h2>Verification Failed</h2>
              <p>
                {errorMessage && errorMessage?.data?.message
                  ? errorMessage?.data?.message
                  : "We couldn’t verify your Bank Verification Number (BVN)"}
              </p>
            </div>
            <div className="button_container">
              <Button
                onClick={() => {
                  closeModal();
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
