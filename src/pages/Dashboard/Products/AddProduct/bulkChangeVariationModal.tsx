import Modal from "components/Modal";
import { useState } from "react";
import Button from "@mui/material/Button";
import { PercentIcon } from "assets/Icons/PercentIcon";
import InputField from "components/forms/InputField";
import { NairaIcon } from "assets/Icons/NairaIcon";
import "./style.scss";
import { formatNumberWithCommas } from "components/forms/ValidatedInput";
type BulkChangeVariationModalProps = {
  openModal: boolean;
  title: string;
  closeModal: () => void;
  actionFnc: (number: number | string) => void;
};

export const BulkChangeVariationModal = ({
  closeModal,
  openModal,
  actionFnc,
  title,
}: BulkChangeVariationModalProps) => {
  const [inputVal, setInputVal] = useState("");
  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={() => {
          closeModal();
          setInputVal("");
        }}
      >
        <div className="change_value_container">
          <div className="title_section">
            <h6>{title} </h6>
          </div>
          <div className="form_section">
            <InputField
              label={"Input Value"}
              value={inputVal}
              type="text"
              onChange={(e) => {
                if (
                  !isNaN(parseInt(e.target.value?.replace(/,/g, ""))) ||
                  e.target.value.length === 0
                ) {
                  if (e.target.value.length === 0) {
                    setInputVal("");
                  } else {
                    setInputVal(
                      formatNumberWithCommas(
                        parseFloat(e.target.value.replace(/,/g, ""))
                      )
                    );
                  }
                }
              }}
            />

            <div className="btn_flex">
              <Button
                onClick={() => {
                  setInputVal("");

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
                    setInputVal("");
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
