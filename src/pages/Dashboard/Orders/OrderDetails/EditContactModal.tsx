import Modal from "components/Modal";
import { useState } from "react";
import Button from "@mui/material/Button";
import { PercentIcon } from "assets/Icons/PercentIcon";
import InputField from "components/forms/InputField";
import { NairaIcon } from "assets/Icons/NairaIcon";
import "./style.scss";
type EditContactModalProps = {
  openModal: boolean;
  title: string;
  closeModal: () => void;
  actionFnc: (number: any) => void;
};

export const EditContactModal = ({
  closeModal,
  openModal,
  actionFnc,
  title,
}: EditContactModalProps) => {
  const [inputVal, setInputVal] = useState("");
  return (
    <>
      <Modal openModal={openModal} closeModal={closeModal}>
        <div className="change_value_container">
          <div className="title_section">
            <h6>Add customer's {title} </h6>
          </div>
          <div className="form_section">
            <InputField
              label={`Input ${title}`}
              type={title === "email" ? "email" : "number"}
              onChange={(e) => {
                setInputVal(e.target.value);
              }}
            />

            <div className="btn_flex">
              <Button
                onClick={() => {
                  if (inputVal) {
                    actionFnc(inputVal);
                    closeModal();
                  }
                }}
                className="primary_styled_button"
                variant="contained"
              >
                Apply
              </Button>
              <Button
                onClick={() => {
                  closeModal();
                }}
                variant="outlined"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
