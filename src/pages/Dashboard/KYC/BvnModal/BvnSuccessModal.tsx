import { Button } from "@mui/material";
import "./style.scss";
import Modal from "components/Modal";
import { SuccessCheckLarge } from "assets/Icons/SuccessCheckLarge";

type BvnSuccessModalProps = {
  openModal: boolean;
  closeModal: () => void;
  handleContinueToNin: Function;
};

export const BvnSuccessModal = ({
  closeModal,
  openModal,
  handleContinueToNin,
}: BvnSuccessModalProps) => {
  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={closeModal}
        closeOnOverlayClick={false}
      >
        <div className="bvn_modal success">
          <div className="main">
            <SuccessCheckLarge />
            <div className="text">
              <h2>BVN Verified</h2>
              <p>
                We’ve successfully verified your Bank Verification Number (BVN)
              </p>
            </div>
            <div className="button_container">
              <Button
                onClick={() => {
                  handleContinueToNin();
                  closeModal();
                }}
                variant="contained"
                className="primary primary_styled_button"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
