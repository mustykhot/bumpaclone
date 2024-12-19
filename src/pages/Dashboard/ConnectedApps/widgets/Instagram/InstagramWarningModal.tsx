import { IconButton } from "@mui/material";
import Modal from "components/Modal";
import { Button } from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";
import meta from "assets/images/meta.png";

type InstagramWarningModalProps = {
  openModal: boolean;
  type?: string;
  title?: string;
  description?: string;
  closeModal: () => void;
  btnAction: () => void;
};

export const InstagramWarningModal = ({
  closeModal,
  openModal,
  title,
  description,
  type = "error",
  btnAction,
}: InstagramWarningModalProps) => {
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

        <h2>{title || "Are you sure you want to disconnect meta?"}</h2>
        <p className="description">
          {description ||
            "Disconnecting Meta means you will no longer receive messages from Instagram on your Bumpa app"}
        </p>
        <div className="button_container mt-[20px]">
          <Button
            onClick={() => {
              btnAction();
            }}
            variant="contained"
            className={`primary ${
              type === "error" ? "error" : "primary_styled_button"
            }`}
          >
            {type === "error" ? "Disconnect" : "Continue"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
