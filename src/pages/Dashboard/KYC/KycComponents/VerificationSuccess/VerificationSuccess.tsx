import { Button } from "@mui/material";
import Modal from "components/Modal";
import { SuccessCheckLarge } from "assets/Icons/SuccessCheckLarge";

type VerificationSuccessModalProps = {
  openModal: boolean;
  closeModal: () => void;
  fromCac: boolean;
};

export const VerificationSuccessModal = ({
  closeModal,
  openModal,
  fromCac,
}: VerificationSuccessModalProps) => {
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
              <h2>Verification Successful</h2>
              <p>
                Your account has been successfully verified and upgraded to tier{" "}
                {fromCac ? "2" : "1"}
              </p>
            </div>
            <div className="button_container">
              <Button
                onClick={() => {
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
