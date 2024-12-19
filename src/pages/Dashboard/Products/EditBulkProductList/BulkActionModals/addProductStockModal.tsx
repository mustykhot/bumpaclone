import Modal from "components/Modal";
import { useState } from "react";
import Button from "@mui/material/Button";
import { PercentIcon } from "assets/Icons/PercentIcon";
import InputField from "components/forms/InputField";
import { NairaIcon } from "assets/Icons/NairaIcon";
import "./style.scss";
type ChangePriceModalProps = {
  openModal: boolean;
  closeModal: () => void;
  actionFnc: (number: number) => void;
};

export const AddProductStockModal = ({
  closeModal,
  openModal,
  actionFnc,
}: ChangePriceModalProps) => {
  const [inputVal, setInputVal] = useState("");
  return (
    <>
      <Modal openModal={openModal} closeModal={closeModal}>
        <div className="change_value_container">
          <div className="title_section">
            <h6>Change Stock Quantity: </h6>
          </div>
          <div className="form_section">
            <InputField
              label={`Change stock quantity to :`}
              onChange={(e) => {
                setInputVal(e.target.value);
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
                    actionFnc(Number(inputVal));
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
