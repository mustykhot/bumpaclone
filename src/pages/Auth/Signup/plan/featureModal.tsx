import Modal from "components/Modal";
import { IconButton } from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";


type FeatureModalProps = {
  openModal: boolean;
  closeModal: () => void;
  features?: any[];
  title?: any;
};

export const FeatureModal = ({
  openModal,
  closeModal,
  features,
  title,
}: FeatureModalProps) => (
  <Modal closeModal={closeModal} openModal={openModal}>
    <div className="feature_modal">
      <div className="title_box">
        <div className="text">
          <h3>{title} Features</h3>
          <p>Subscribing to {title} gives you access to these:</p>
        </div>
        <IconButton
          type="button"
          onClick={closeModal}
          className="icon_button_container"
        >
          <XIcon />
        </IconButton>
      </div>
      <ul>
        {features?.map((item: any, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  </Modal>
);
