import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import confetti from "assets/images/confetti.png";
import Modal from "components/Modal";

type propType = {
  openModal: boolean;
  closeModal: () => void;
};

export const OnboardingSuccessModal = ({ closeModal, openModal }: propType) => {
  const navigate = useNavigate();

  return (
    <Modal
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
      closeOnOverlayClick={false}
    >
      <div className="connect_modal general_modal success_modal onboarding_success_modal">
        <img src={confetti} alt="confetti" />
        <h2>Congratulations!</h2>
        <p className="description">
          You’ve completed onboarding and your website is now ready to launch.
        </p>
        <div className="button_container">
          <Button
            onClick={() => {
              navigate("/dashboard/customisation/customise-theme");
              closeModal();
            }}
            variant="contained"
            className="primary primary_styled_button"
          >
            Launch Website
          </Button>
          <Button
            onClick={() => {
              closeModal();
            }}
            variant="outlined"
          >
            I’ll do this later
          </Button>
        </div>
      </div>
    </Modal>
  );
};
