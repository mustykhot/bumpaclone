import Modal from "components/Modal";
import { useState } from "react";
import { PercentIcon } from "assets/Icons/PercentIcon";
import InputField from "components/forms/InputField";
import { NairaIcon } from "assets/Icons/NairaIcon";
import "./style.scss";
import { CircularProgress, IconButton } from "@mui/material";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Radio, Button } from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import { getCurrencyFnc } from "utils";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  selectActiveCartDiscount,
  selectPosCartItems,
  setActiveCartDiscount,
  setDiscount,
} from "store/slice/PosSlice";
type ModalProps = {
  openModal: boolean;
  isLoading: boolean;
  closeModal: () => void;
  actionFnc: (val: string, cb?: () => void) => void;
};
const options = [
  {
    label: "Fixed Amount",
    value: "fixed",
  },
  {
    label: "Percentage Discount",
    value: "percentage",
  },
];
const typeList = [
  { label: "Fixed Amount", value: "discount" },
  { label: "Coupon", value: "coupon" },
];
export const AddDiscountOrCouponModal = ({
  closeModal,
  openModal,
  isLoading,
  actionFnc,
}: ModalProps) => {
  const posCartItems = useAppSelector(selectPosCartItems);
  const activeCartDiscount = useAppSelector(selectActiveCartDiscount);
  const [inputVal, setInputVal] = useState(activeCartDiscount || "");
  const [discountVal, setDiscountVal] = useState("");
  const dispatch = useAppDispatch();
  const [type, setType] = useState("discount");
  const [discountType, setDiscountType] = useState("fixed");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountType((event.target as HTMLInputElement).value);
  };
  const submitFnc = () => {
    if (type === "coupon") {
      actionFnc(inputVal, () => {
        closeModal();
      });
    } else {
      dispatch(setDiscount({ type: discountType, value: discountVal }));
      closeModal();
    }
  };

  return (
    <>
      <Modal openModal={openModal} closeModal={closeModal}>
        <div className="change_value_container for_pos">
          <div className="title_section w-full flex justify-between items-center">
            <h6>Add Discount</h6>
            <IconButton
              onClick={() => {
                closeModal();
              }}
              type="button"
              className="icon_button_container"
            >
              <CloseSqIcon />
            </IconButton>
          </div>
          <div className="select_discount_type">
            {typeList.map((item, i: number) => (
              <Button
                key={i}
                onClick={() => {
                  setType(item.value);
                }}
                className={`${item.value === type ? "active" : ""}`}
              >
                {item.value}
              </Button>
            ))}
          </div>
          <div className="form_section">
            {type === "coupon" && (
              <InputField
                label={"Enter Coupon Code"}
                type="text"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                }}
              />
            )}

            {type === "discount" && (
              <div className="fixed_amount_section">
                <div className="select_fixed_amount_type">
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={discountType}
                      onChange={handleChange}
                      className="flex_radio"
                    >
                      {options.map((item, i) => (
                        <FormControlLabel
                          value={item.value}
                          key={i}
                          className={"radio_label"}
                          control={<Radio />}
                          label={item.label}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </div>

                <InputField
                  name="amount"
                  label={
                    discountType === "fixed"
                      ? "Enter Amount"
                      : "Percentage discount"
                  }
                  type={"number"}
                  value={discountVal}
                  onChange={(e) => {
                    setDiscountVal(e.target.value);
                  }}
                  prefix={
                    discountType === "fixed" ? (
                      <p className="text-[#222D37] text-[20px]">
                        {getCurrencyFnc()}
                      </p>
                    ) : (
                      <PercentIcon />
                    )
                  }
                />
              </div>
            )}

            <div className="btn_flex">
              <Button
                onClick={() => {
                  if (inputVal || discountVal) {
                    submitFnc();
                  }
                }}
                className="primary_styled_button"
                variant="contained"
              >
                {isLoading ? (
                  <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
