import { IconButton } from "@mui/material";
import Modal from "components/Modal";
import { Button } from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";
import paystack from "assets/images/paystack2.png";
import { CheckCircleIcon } from "assets/Icons/CheckCircleIcon";

type PaystackWarningModalProps = {
  openModal: boolean;
  closeModal: () => void;
  btnAction: () => void;
};

export const PaystackWarningModal = ({
  closeModal,
  openModal,
  btnAction,
}: PaystackWarningModalProps) => {
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
        <img src={paystack} alt="app" className="app_image" />

        <h2>Are you sure you want to disconnect Paystack?</h2>

        <p className="description">
          Disabling Paystack will limit your customers to bank transfers which
          can experience downtime, delays, or turn customers away
        </p>

        <div className="extra_paystack_note">
          <h4>NOTE:</h4>
          <h5>
            67% of Bumpa top merchants recommend turning on Paystack for the
            following reasons:
          </h5>
          <div className="list_flex">
            {[
              "Confirm payment in 60 seconds",
              "Has 5 payment options: Card, Bank, Transfer, USSD, Visa QR code.",
              "Automatically records sales.",
              "Comes only at a 1.5% charge",
            ].map((item, i) => {
              return (
                <div key={i} className="flex">
                  <CheckCircleIcon />
                  <p>{item}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="button_container">
          <Button
            onClick={() => {
              btnAction();
            }}
            variant="contained"
            className="primary error"
          >
            Turn Off
          </Button>
        </div>
      </div>
    </Modal>
  );
};
