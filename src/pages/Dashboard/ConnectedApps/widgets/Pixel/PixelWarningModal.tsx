import { IconButton } from "@mui/material";
import Modal from "components/Modal";
import { Button } from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";
import meta from "assets/images/meta.png";

type PixelWarningModalProps = {
  openModal: boolean;
  closeModal: () => void;
  btnAction: () => void;
};

export const PixelWarningModal = ({
  closeModal,
  openModal,
  btnAction,
}: PixelWarningModalProps) => {
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

        <h2>{"Are you sure you want to disconnect Facebook Pixel?"}</h2>
        <p className="description">
          Disconnecting Facebook Pixel means you will no longer be able to
          receive Instagram DMs on your Bumpa app.
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
