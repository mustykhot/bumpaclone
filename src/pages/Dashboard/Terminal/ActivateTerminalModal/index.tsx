import { Button, IconButton } from "@mui/material";
import "./style.scss";
import { XIcon } from "assets/Icons/XIcon";
import BumpaTerminalLogo from "assets/images/bumpa-terminal-logo.svg";
import BumpaTerminalImageLarge from "assets/images/bumpa-terminal-image-large.svg";
import Modal from "components/Modal";

type ActivateTerminalModalProps = {
  openModal: boolean;
  closeModal: () => void;
  btnAction: Function;
};

export const ActivateTerminalModal = ({
  closeModal,
  openModal,
  btnAction,
}: ActivateTerminalModalProps) => {
  return (
    <>
      <Modal openModal={openModal} closeModal={closeModal}>
        <div className="activate_terminal_modal">
          <div className="cancel_section">
            <IconButton
              onClick={() => {
                closeModal();
              }}
              className="icon_button_container"
            >
              <XIcon stroke="#FFFFFF" />
            </IconButton>
          </div>
          <div className="activate_terminal_modal--main">
            <div className="header_section">
              <img src={BumpaTerminalLogo} alt="Bumpa Terminal Logo" />
              <h2>New Offline Payment Method</h2>
              <p className="description">
                Use Bumpa Terminal to receive payments offline
              </p>
            </div>
            <div className="payment_method_section">
              <img src={BumpaTerminalImageLarge} alt="Bumpa Terminal Image" />
            </div>
            <div className="button_container">
              <Button
                onClick={() => {
                  if (typeof mixpanel !== "undefined") {
                    mixpanel.track("web_terminal_introduction");
                  }
                  btnAction();
                }}
                variant="contained"
              >
                Continue
              </Button>
            </div>
            <div className="learn_more">
              <a target="_blank" href="https://terminal.getbumpa.com/">
                Learn more about Bumpa Terminal
              </a>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
