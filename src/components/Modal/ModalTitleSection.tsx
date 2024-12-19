import IconButton from "@mui/material/IconButton";
import { XIcon } from "assets/Icons/XIcon";

type ModalTitleSectionProps = {
  title: string;
  explanation?: string;
  closeModal: () => void;
};

export const ModalTitleSection = ({
  title,
  closeModal,
  explanation,
}: ModalTitleSectionProps) => (
  <div className="modal_title_container">
    <div className="text_section">
      <h4>{title}</h4>
      {explanation && <p>{explanation}</p>}
    </div>

    <IconButton onClick={closeModal}>
      <XIcon />
    </IconButton>
  </div>
);
