import Modal from "components/Modal";
import { Button, IconButton } from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";
import shipbubble from "assets/images/shipbubble.png";
import "./style.scss";

type ModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const ShipBubbleConnectedModal = ({
  openModal,
  closeModal,
}: ModalProps) => {
  return (
    <Modal
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <div className="pd_shipbubble_connected_modal">
        <div className="header">
          <div className="text_flex"></div>
          <IconButton
            onClick={() => {
              closeModal();
            }}
            className="icon_button_container"
          >
            <XIcon />
          </IconButton>
        </div>

        <img src={shipbubble} alt="shipbubble" />

        <p className="title">Shipbubble Connected</p>
        <p className="desc">You’ve connected your Bumpa to Shipbubble</p>
        <div className="benefit">
          <p>Benefits of shipbubble</p>
          <ul>
            {[1, 2, 3].map((item) => (
              <li>You can now add weight-based shipping to your store.</li>
            ))}
          </ul>
        </div>

        <div className="blue_box">
          <p>
            Go to Shipping Settings {">"} Advanced Shipping to use the
            Shipbubble integration
          </p>
        </div>
        <Button variant="contained" className="primary_styled_button">
          Go to Advanced Shipping{" "}
        </Button>
      </div>
    </Modal>
  );
};
