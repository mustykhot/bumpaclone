import { IconButton } from "@mui/material";
import Modal from "components/Modal";
import { Button } from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";
import meta from "assets/images/meta.png";

type AnalyticsModalProps = {
  openModal: boolean;
  closeModal: () => void;
  btnAction: () => void;
};

export const AnalyticsWarningModal = ({
  closeModal,
  openModal,
  btnAction,
}: AnalyticsModalProps) => {
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
        <img src={meta} alt="app" className="app_image" />

        <h2>{"Are you sure you want to disconnect Google Analytics?"}</h2>
        <p className="description">
          Disconnecting Google Analytics means you will no longer be able to track your Google Ads
        </p>
        <div className="button_container mt-[20px]">
          <Button
            onClick={() => {
              btnAction();
            }}
            variant="contained"
            className={`primary error`}
          >
            Disconnect{" "}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
