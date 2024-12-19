import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { NairaIcon } from "assets/Icons/NairaIcon";
import { useState } from "react";
import InputField from "components/forms/InputField";
import TextAreaField from "components/forms/TextAreaField";
import Checkbox from "@mui/material/Checkbox";
import { useCreateShippingMutation } from "services";
import { showToast } from "store/store.hooks";
import { getCurrencyFnc, handleError } from "utils";
import { CircularProgress } from "@mui/material";
type ShippingModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const CreateShippingModal = ({
  openModal,
  closeModal,
}: ShippingModalProps) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [createShipping, { isLoading }] = useCreateShippingMutation();

  const onSubmit = async () => {
    const payload = {
      name: title,
      price: Number(amount),
      description: description,
      visible: isCheck,
    };
    try {
      let result = await createShipping(payload);
      if ("data" in result) {
        showToast("Created successfully", "success");
        closeModal();
        if (typeof _cio !== "undefined") {
          _cio.track("web_shipping", payload);
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <ModalRight
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <div className="modal_right_children">
        <div className="top_section">
          <ModalRightTitle
            closeModal={() => {
              closeModal();
            }}
            title="Create Shipping Modal"
          />

          <div className="brief_form">
            <InputField
              name="title"
              label="Title"
              required={true}
              type={"text"}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <InputField
              name="price"
              required={true}
              prefix={
                <p className="text-[#000000] font-semibold text-[20px]">
                  {getCurrencyFnc()}
                </p>
              }
              label="Price"
              type={"number"}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
            <TextAreaField
              label="Description (optional)"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              height={"h-[120px]"}
            />
            <div className="visible">
              <Checkbox
                checked={isCheck}
                onChange={() => {
                  setIsCheck(!isCheck);
                }}
              />
              <p>Visible on web checkout</p>
            </div>
          </div>
        </div>

        <div className=" bottom_section">
          <Button type="button" className="cancel" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={title && amount ? false : true}
            className="save"
            onClick={onSubmit}
          >
            {isLoading ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};
