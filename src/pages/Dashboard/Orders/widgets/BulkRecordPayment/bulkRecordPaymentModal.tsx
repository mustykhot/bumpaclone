import Modal from "components/Modal";
import { useState } from "react";
import Button from "@mui/material/Button";
import { PercentIcon } from "assets/Icons/PercentIcon";
import InputField from "components/forms/InputField";
import { NairaIcon } from "assets/Icons/NairaIcon";
import NormalSelectField from "components/forms/NormalSelectField";
import { TRANSACTION_MODES } from "utils/constants/general";
type BulkRecordPaymentModalProps = {
  openModal: boolean;
  closeModal: () => void;
  actionFnc: (val: string) => void;
};

export const BulkRecordPaymentModal = ({
  closeModal,
  openModal,
  actionFnc,
}: BulkRecordPaymentModalProps) => {
  const [inputVal, setInputVal] = useState("BANK");
  return (
    <>
      <Modal openModal={openModal} closeModal={closeModal}>
        <div className="change_value_container">
          <div className="title_section">
            <h6>Select payment method </h6>
          </div>
          <div className="form_section">
            <NormalSelectField
              label={"Payment method"}
              name="method"
              onChange={(e: any) => {
                setInputVal(e.target.value);
              }}
              value={inputVal}
              selectOption={TRANSACTION_MODES.map((item) => {
                return { value: item.value, key: item.label };
              })}
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
