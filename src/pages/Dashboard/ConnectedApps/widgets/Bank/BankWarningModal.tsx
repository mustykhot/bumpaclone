import { IconButton } from "@mui/material";
import Modal from "components/Modal";
import { Button } from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";
import bank from "assets/images/bank.png";

type BankWarningModalProps = {
  openModal: boolean;
  closeModal: () => void;
  btnAction: () => void;
};

export const BankWarningModal = ({
  closeModal,
  openModal,
  btnAction,
}: BankWarningModalProps) => {
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
        <img src={bank} alt="app" className="app_image" />

        <h2>Are you sure you want to turn on Bank Transfer </h2>

        <p className="description">
          Please note that bank transfers can experience downtimes, delays, or
          turn away customers who prefer other payment methods.
        </p>

        <div className="extra_note">
          <h5>NOTE:</h5>
          <p>
            Top Bumpa merchants recommend turning on both Paystack and Bank
            Transfers to give buyers option to choose and prevent payment
            delays.
          </p>
          <p>
            Additionally, bank transfers directly to your account may not work
            effectively with Reserved Inventory, as items are held until payment
            is confirmed. This can lead to delays due to the manual confirmation
            process.
          </p>
        </div>

        <div className="button_container">
          <Button
            onClick={() => {
              btnAction();
            }}
            variant="contained"
            className="primary primary_styled_button"
          >
            Turn On
          </Button>
        </div>
      </div>
    </Modal>
  );
};
