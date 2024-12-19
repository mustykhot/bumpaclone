import { Button } from "@mui/material";
import Modal from "components/Modal";
import { SuccessCheckLarge } from "assets/Icons/SuccessCheckLarge";

type NinSuccessModalProps = {
  openModal: boolean;
  closeModal: () => void;
  handleContinueToCac: Function;
};

export const NinSuccessModal = ({
  closeModal,
  openModal,
  handleContinueToCac,
}: NinSuccessModalProps) => {
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
              <h2>NIN Verified</h2>
              <p>
                We’ve successfully verified your National Identity Number (NIN)
              </p>
            </div>
            <div className="button_container">
              <Button
                onClick={() => {
                  handleContinueToCac();
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
