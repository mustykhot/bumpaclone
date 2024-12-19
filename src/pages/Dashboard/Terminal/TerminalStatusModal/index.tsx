import { Button } from "@mui/material";
import "./style.scss";
import Modal from "components/Modal";
import { TerminalAvailableIcon } from "assets/Icons/TerminalAvailableIcon";

type TerminalStatusModalProps = {
  openModal: boolean;
  closeModal: () => void;
  yesAction: Function;
  noAction: Function;
};

export const TerminalStatusModal = ({
  closeModal,
  openModal,
  yesAction,
  noAction,
}: TerminalStatusModalProps) => {
  return (
    <Modal openModal={openModal} closeModal={closeModal}>
      <div className="terminal_status">
        <div className="main">
          <div className="icon">
            <TerminalAvailableIcon />
          </div>
          <div className="text">
            <h2>Do you have a Bumpa Terminal Account?</h2>
            <p>
              If you already use Bumpa Terminal, choose yes. If not, choose no.
            </p>
          </div>
          <div className="button_container">
            <Button
              variant="outlined"
              onClick={() => {
                noAction();
                if (typeof mixpanel !== "undefined") {
                  mixpanel.track("web_get_terminal_action");
                }
              }}
            >
              No
            </Button>
            <Button
              onClick={() => {
                yesAction();
                if (typeof mixpanel !== "undefined") {
                  mixpanel.track("web_link_terminal_action");
                }
              }}
              variant="contained"
            >
              Yes
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
