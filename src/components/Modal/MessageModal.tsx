import { Button, Fade, Slide } from "@mui/material";
import { ReactNode } from "react";
import "./style.scss";

type ModalProps = {
  openModal: boolean;
  cta?: ReactNode;
  btnChild?: ReactNode;
  icon?: ReactNode;
  otherChildren?: ReactNode;
  img?: ReactNode;
  closeModal: Function;
  description?: string;
  iconBg?: string;
  padding?: string | number;
  otherClasses?: string;
  title?: string;
  remove_icon_bg?: boolean;
  extraClass?: string;
  hideCancel?: boolean;
  disabled?: boolean;
  closeOnOverlayClick?: boolean;
  cancelBtnText?: string;
  cancelBtnAction?: () => void;
};

const MessageModal = ({
  otherChildren,
  closeModal,
  openModal = true,
  icon,
  description,
  cta,
  otherClasses,
  iconBg,
  padding = "32px",
  img,
  title,
  btnChild,
  remove_icon_bg,
  extraClass,
  hideCancel = false,
  disabled,
  closeOnOverlayClick = true,
  cancelBtnText,
  cancelBtnAction,
}: ModalProps) => {
  return (
    <Fade in={openModal}>
      <div
        onClick={(e) =>
          e.target === e.currentTarget && closeOnOverlayClick && closeModal()
        }
        className={`modal-wrap ${otherClasses || ""}`}
      >
        <Slide direction="up" in={openModal} mountOnEnter unmountOnExit>
          <div
            style={{ paddingLeft: padding, paddingRight: padding }}
            className={`modal-content msg-modal ${extraClass} ${
              remove_icon_bg ? "remove_height" : ""
            }`}
          >
            {img ? (
              img
            ) : (
              <div
                className={`icon-wrap ${
                  remove_icon_bg ? "remove_icon_bg" : ""
                } ${iconBg || "bg-primary-100"}`}
              >
                {icon}
              </div>
            )}

            <div className="my-auto">
              {title && <div className="title">{title}</div>}
              <div className="description">{description}</div>
              {otherChildren}
            </div>

            {cta || (
              <div className="btn_flex">
                {!hideCancel && (
                  <Button
                    variant="outlined"
                    type="button"
                    onClick={() => {
                      if (cancelBtnAction) {
                        cancelBtnAction();
                      } else {
                        closeModal();
                      }
                    }}
                    disabled={disabled}
                  >
                    {cancelBtnText || "Cancel"}
                  </Button>
                )}

                {btnChild}
              </div>
            )}
          </div>
        </Slide>
      </div>
    </Fade>
  );
};

export default MessageModal;
