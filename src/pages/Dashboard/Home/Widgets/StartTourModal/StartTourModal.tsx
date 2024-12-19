import { Button } from "@mui/material";
import "./style.scss";
import confetti from "assets/images/confetti.png";
import Modal from "components/Modal";
import { setIsFirstLogin } from "store/slice/NotificationSlice";
import { useAppDispatch } from "store/store.hooks";

type StartTourModalProps = {
  openModal: boolean;
  closeModal: () => void;
  btnAction: Function;
};

export const StartTourModal = ({
  closeModal,
  openModal,
  btnAction,
}: StartTourModalProps) => {
  const dispatch = useAppDispatch();

  return (
    <Modal
      openModal={openModal}
      closeModal={closeModal}
      closeOnOverlayClick={false}
    >
      <div className="connect_modal general_modal success_modal tour_modal">
        <img src={confetti} alt="confetti" />

        <h2>Welcome to your new Bumpa Dashboard</h2>

        <p className="description">
          Let’s walk you through everything you need to know about your
          dashboard.
        </p>

        <div className="button_container">
          <Button
            onClick={() => {
              dispatch(setIsFirstLogin(true));
              btnAction();
              closeModal();
            }}
            variant="contained"
            className="primary primary_styled_button"
          >
            Start walkthrough
          </Button>
        </div>
      </div>
    </Modal>
  );
};
