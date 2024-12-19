import { IconButton } from "@mui/material";
import Modal from "components/Modal";
import { Button } from "@mui/material";
import "./style.scss";
import { XIcon } from "assets/Icons/XIcon";

type WarningModalProps = {
  openModal: boolean;
  closeModal: () => void;
  btnAction?: Function;
  exludeAction?: Function;
};

export const WarningModal = ({
  closeModal,
  openModal,
  btnAction,
  exludeAction,
}: WarningModalProps) => {
  return (
    <Modal openModal={openModal} closeModal={closeModal}>
      <div className=" warning_modal">
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

        <h2>
          One or more of the selected products is already on an active discount
        </h2>

        <p className="description">
          Adding the product will remove it from the active discount.
        </p>

        <div className="button_container">
          <Button
            onClick={() => {
              btnAction && btnAction();
            }}
            variant="contained"
            className="primary"
          >
            Yes, add to discount
          </Button>
          <Button
            onClick={() => {
              exludeAction && exludeAction();
            }}
            variant="outlined"
            className="cancel"
          >
            Exclude product
          </Button>
        </div>
      </div>
    </Modal>
  );
};
