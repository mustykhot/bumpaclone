import Modal from "components/Modal";
import { useState } from "react";
import Button from "@mui/material/Button";
import { PercentIcon } from "assets/Icons/PercentIcon";
import InputField from "components/forms/InputField";
import { NairaIcon } from "assets/Icons/NairaIcon";
import "./style.scss";
type ChangePriceModalProps = {
  openModal: boolean;
  title: string;
  closeModal: () => void;
  actionFnc: (type: string, number: number) => void;
};

export const ChangeProductStockModal = ({
  closeModal,
  openModal,
  actionFnc,
  title,
}: ChangePriceModalProps) => {
  const [type, setType] = useState("percent");
  const [inputVal, setInputVal] = useState("");
  return (
    <>
      <Modal openModal={openModal} closeModal={closeModal}>
        <div className="change_value_container">
          <div className="title_section">
            <h6>{title} stock quantity : </h6>
          </div>
          <div className="form_section">
            <InputField
              label={`${title} stock quantity by:`}
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
                    actionFnc(type, Number(inputVal));
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
