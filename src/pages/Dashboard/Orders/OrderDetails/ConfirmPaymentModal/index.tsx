import { Fade, Slide } from "@mui/material";
import { IconButton, Button } from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";
import "./style.scss";
import { alt_image_url } from "utils/constants/general";

type ModalProps = {
  openModal: boolean;
  closeModal: Function;
  actionBtn1: () => void;
  actionBtn2: () => void;
  image: string;
  status: string;
};

const ConfirmPaymentModal = ({
  openModal,
  closeModal,
  actionBtn1,
  actionBtn2,
  status,
  image,
}: ModalProps) => {
  return (
    <Fade in={openModal}>
      <div
        onClick={(e) => e.target === e.currentTarget && closeModal()}
        className={`modal-wrap `}
      >
        <Slide direction="up" in={openModal} mountOnEnter unmountOnExit>
          <div className="modal-content msg-modal confirm_payment_modal ">
            <div className="top_side">
              <h3>Proof Of Payment</h3>
              <IconButton
                className="icon_button_container"
                onClick={() => {
                  closeModal();
                }}
              >
                <XIcon />
              </IconButton>
            </div>
            <div
              className="mid_side"
              //   style={{
              //     backgroundImage: `url(${image ? image : alt_image_url})`,
              //   }}
            >
              <img src={image ? image : alt_image_url} alt="proof of payment" />
            </div>
            {status !== "PAID" && (
              <div className="bottom_side">
                <Button
                  onClick={() => {
                    actionBtn2();
                    closeModal();
                  }}
                  className={"error"}
                  variant="outlined"
                >
                  Reject Payment
                </Button>
                <Button
                  onClick={() => {
                    actionBtn1();
                    closeModal();
                  }}
                  variant="contained"
                  className="primary_styled_button"
                >
                  Confirm Payment
                </Button>
              </div>
            )}
          </div>
        </Slide>
      </div>
    </Fade>
  );
};

export default ConfirmPaymentModal;
