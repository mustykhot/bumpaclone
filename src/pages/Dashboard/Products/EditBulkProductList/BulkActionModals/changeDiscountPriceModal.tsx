import Modal from "components/Modal";
import { useState } from "react";
import Button from "@mui/material/Button";
import { PercentIcon } from "assets/Icons/PercentIcon";
import InputField from "components/forms/InputField";
import { NairaIcon } from "assets/Icons/NairaIcon";
import "./style.scss";
import { getCurrencyFnc } from "utils";
type ChangePriceModalProps = {
  openModal: boolean;
  title: string;
  closeModal: () => void;
  actionFnc: (type: string, number: number) => void;
};

export const ChangeDiscountPriceModal = ({
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
            <h6>{title} discount price by : </h6>
            <div className="btn_flex">
              {[
                { label: "Percentage %", key: "percent" },
                { label: "Fixed amount N", key: "fixed" },
              ].map((item, i) => {
                return (
                  <Button
                    key={i}
                    onClick={() => {
                      setType(item.key);
                    }}
                    className={`${type === item.key ? "active" : ""}`}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="form_section">
            <InputField
              label={`Amount ${title}`}
              onChange={(e) => {
                setInputVal(e.target.value);
              }}
              prefix={
                type === "percent" ? (
                  <PercentIcon stroke="#9BA2AC" />
                ) : (
                  <p className="text-[#9BA2AC] font-semibold text-[20px]">
                    {getCurrencyFnc()}
                  </p>
                )
              }
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
                variant="contained"
                className="primary_styled_button"
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
