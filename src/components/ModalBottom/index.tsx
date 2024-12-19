import { Fade, Slide } from "@mui/material";

import "./style.scss";
type ModalProps = {
  openModal: boolean;
  children: React.ReactNode;
  closeModal: Function;
};
const ModalBottom = ({
  children,
  closeModal,
  openModal = true,
}: ModalProps) => {
  return (
    <Fade in={openModal}>
      <div
        onClick={(e) => e.target === e.currentTarget && closeModal()}
        className="pd-modal_bottom"
      >
        <Slide direction="up" in={openModal} mountOnEnter unmountOnExit>
          <div className="popBoxBottom">{children} </div>
        </Slide>
      </div>
    </Fade>
  );
};

export default ModalBottom;
