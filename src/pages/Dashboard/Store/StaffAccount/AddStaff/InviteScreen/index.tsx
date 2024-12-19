import Modal from "components/Modal";
import "./style.scss";
import { BigCheckCircleIcon } from "assets/Icons/BigCheckCircleIcon";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SquareCloseIcon from "assets/Icons/SquareCloseIcon";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  name?: string;
};

const InviteScreen = ({ closeModal, openModal, name }: propType) => {
  const navigate = useNavigate();

  const handleAddStaff = () => {
    navigate("/dashboard/staff");
    closeModal();
  };

  return (
    <Modal
      closeModal={() => {
        handleAddStaff();
      }}
      openModal={openModal}
    >
      <div className="setup-modal">
        <div>
          <div className="setup-modal__close">
            <span
              onClick={() => {
                handleAddStaff();
              }}
            >
              <SquareCloseIcon />
            </span>
          </div>
        </div>
        <div className="setup-modal__content">
          {" "}
          <div className="setup-modal__title-section">
            <div className="setup-modal__title-icon">
              <BigCheckCircleIcon />
            </div>
            <h3>Invite Sent!</h3>
          </div>
          <div className="setup-modal__body-section">
            <p>An invite has been sent to {name} to join your team on Bumpa.</p>
            <Button
              className="primary_styled_button"
              onClick={handleAddStaff}
              variant="contained"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InviteScreen;
