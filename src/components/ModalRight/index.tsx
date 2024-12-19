import { Fade, Slide } from "@mui/material";

import "./style.scss";
type ModalProps = {
  openModal: boolean;
  children: React.ReactNode;
  closeModal: Function;
  closeOnOverlayClick?: boolean;
};
const ModalRight = ({
  children,
  closeModal,
  closeOnOverlayClick = true,
  openModal = true,
}: ModalProps) => {
  return (
    <Fade in={openModal}>
      <div
        onClick={(e) =>
          e.target === e.currentTarget && closeOnOverlayClick && closeModal()
        }
        className="pd-modal_right"
      >
        <Slide direction="left" in={openModal} mountOnEnter unmountOnExit>
          <div className="popBox">{children} </div>
        </Slide>
      </div>
    </Fade>
  );
};

export default ModalRight;
