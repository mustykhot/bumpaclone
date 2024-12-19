import { Button } from "@mui/material";
import "./style.scss";
import { FailIconLarge } from "assets/Icons/FailIconLarge";
import Modal from "components/Modal";

type CacFailModalProps = {
  openModal: boolean;
  closeModal: () => void;
  errorMessage: any;
  handleOpenCancelModal: Function;
};

export const CacFailModal = ({
  closeModal,
  openModal,
  errorMessage,
  handleOpenCancelModal,
}: CacFailModalProps) => {
  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={closeModal}
        closeOnOverlayClick={false}
      >
        <div className="cac_modal success">
          <div className="main">
            <FailIconLarge />
            <div className="text">
              <h2>Verification Failed</h2>
              <p>
                {errorMessage && errorMessage?.data?.message
                  ? errorMessage?.data?.message
                  : "We couldn’t verify your your CAC"}
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
