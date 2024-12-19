import { useState } from "react";
import Button from "@mui/material/Button";
import InputField from "components/forms/InputField";
import Modal from "components/Modal";

import "./style.scss";

type ModalProps = {
  openModal: boolean;

  closeModal: () => void;
  actionFnc: (number: number | string) => void;
};

export const AddProductWeightModal = ({
  closeModal,
  openModal,
  actionFnc,
}: ModalProps) => {
  const [inputVal, setInputVal] = useState("");

  return (
    <>
      <Modal openModal={openModal} closeModal={closeModal}>
        <div className="change_value_container">
          <div className="title_section">
            <h6> Change Weight: </h6>
          </div>
          <div className="form_section">
            <InputField
              label={`Change weight to :`}
              type="text"
              value={inputVal}
              onChange={(e) => {
                if (e.target.value.length === 0) {
                  setInputVal("");
                } else {
                  setInputVal(e.target.value);
                }
              }}
            />

            <div className="btn_flex">
              <Button
                onClick={() => {
                  closeModal();
                }}
                variant="outlined"
              >
                Cancel
              </Button>
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
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
