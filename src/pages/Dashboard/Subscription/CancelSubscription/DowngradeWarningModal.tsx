import { IconButton } from "@mui/material";
import Modal from "components/Modal";
import { Button } from "@mui/material";
import "./style.scss";
import { XIcon } from "assets/Icons/XIcon";

import { CancelSubscriptionIcon } from "assets/Icons/CancelSubscriptionIcon";

type DowngradeWarningModalProps = {
  openModal: boolean;
  closeModal: () => void;
  btnAction?: () => void;
};

export const DowngradeWarningModal = ({
  closeModal,
  openModal,
  btnAction,
}: DowngradeWarningModalProps) => {
  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={() => {
          closeModal();
        }}
      >
        <div className={`cancel_subscription_modal success`}>
          <div className="cancel_section">
            <div className="text_box"></div>

            <IconButton
              onClick={() => {
                closeModal();
              }}
              className="icon_button_container"
            >
              <XIcon />
            </IconButton>
          </div>
          <div className="cancel_successful_container">
            <CancelSubscriptionIcon />
            <h3>You’re about to downgrade</h3>
            <p>
              You will no longer have access to benefit that comes with your
              current plan. Are you sure?
            </p>
            <div className="btn_box">
              <Button
                onClick={() => {
                  closeModal();
                }}
                variant="contained"
                className="primary_styled_button"
              >
                No, it’s a mistake
              </Button>
              <Button
                onClick={() => {
                  btnAction && btnAction();
                  closeModal();
                }}
                className="done"
              >
                Yes I want to downgrade
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
