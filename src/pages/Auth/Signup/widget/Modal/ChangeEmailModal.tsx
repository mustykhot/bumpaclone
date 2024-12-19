import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@mui/material";
import "./style.scss";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import ValidatedInput from "components/forms/ValidatedInput";

interface IProp {
  setShowModal: () => void;
  showModal: boolean;
  initialEmail: string;
}

const ChangeEmailModal = ({ setShowModal, showModal, initialEmail }: IProp) => {
  const { setValue } = useFormContext();
  const [updatedEmail, setUpdatedEmail] = useState(initialEmail);

  const handleUpdateEmail = () => {
    setValue("email", updatedEmail);
    setShowModal();
  };

  return (
    <div className="add-modal">
      <ModalRight closeModal={setShowModal} openModal={showModal}>
        <div className="modal_right_children">
          <div className="top_section">
            <ModalRightTitle
              className="add-modal__right-title"
              closeModal={setShowModal}
              title="Change Email Address"
            >
              <p>
                We'll send a six digit code to the email address you provided.
              </p>
            </ModalRightTitle>
            <div className="add-modal__container">
              <div className="">
                <ValidatedInput
                  name="email"
                  label="Email Address"
                  type={"email"}
                  placeholder="Enter Email Address"
                  containerClass="pd-staff-input"
                  value={updatedEmail}
                  onChange={(e: any) => setUpdatedEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bottom_section">
            <div>
              <Button type="button" onClick={setShowModal} className="cancel">
                Cancel
              </Button>
              <Button
                type="submit"
                className="save"
                onClick={handleUpdateEmail}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </ModalRight>
    </div>
  );
};

export default ChangeEmailModal;
