import "./style.scss";
import { Fade, Slide } from "@mui/material";

type ModalProps = {
  openModal: boolean;
  children: React.ReactNode;
  closeModal: Function;
  className?: string;
  closeOnOverlayClick?: boolean;
};

function Modal({
  openModal,
  children,
  closeModal,
  className,
  closeOnOverlayClick = true,
}: ModalProps) {
  return (
    <>
      <Fade in={openModal}>
        <div className={`modal-wrap ${className}`}>
          <Slide direction="down" in={openModal} mountOnEnter unmountOnExit>
            <div
              onClick={(e) =>
                e.target === e.currentTarget &&
                closeOnOverlayClick &&
                closeModal()
              }
              className="modal-content"
            >
              {children}
            </div>
          </Slide>
        </div>
      </Fade>
    </>
  );
}

export default Modal;
