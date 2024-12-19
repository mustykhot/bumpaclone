import { ReactNode } from "react";
import { IconButton } from "@mui/material";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
type ModalRightTitleProps = {
  closeModal: Function;
  title?: string;
  extraChild?: ReactNode;
  children?: ReactNode;
  className?: string;
  extraElementOnCancel?: ReactNode;
};

export const ModalRightTitle = ({
  closeModal,
  title,
  extraChild,
  children,
  className,
  extraElementOnCancel,
}: ModalRightTitleProps) => (
  <div className={`${className}  title_box`}>
    <div className="cancel_button_section">
      <IconButton
        type="button"
        onClick={() => {
          closeModal();
        }}
        className="icon_button_container pad"
      >
        <BackArrowIcon />
      </IconButton>
      {extraElementOnCancel}
    </div>

    <div className="text_box">
      <p> {title}</p>
      {extraChild}
    </div>
    {children}
  </div>
);
