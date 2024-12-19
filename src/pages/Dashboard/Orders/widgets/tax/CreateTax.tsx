import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { NairaIcon } from "assets/Icons/NairaIcon";
import { useState } from "react";
import InputField from "components/forms/InputField";
import TextAreaField from "components/forms/TextAreaField";
import Checkbox from "@mui/material/Checkbox";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
import { useCreateTaxMutation } from "services";
import { CircularProgress } from "@mui/material";
import { PercentIcon } from "assets/Icons/PercentIcon";
type TaxModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const CreateTaxModal = ({ openModal, closeModal }: TaxModalProps) => {
  const [title, setTitle] = useState("");
  const [percentage, setPercentage] = useState("");
  const [description, setDescription] = useState("");

  const [createTax, { isLoading }] = useCreateTaxMutation();

  const onSubmit = async () => {
    const payload = {
      name: title,
      percent: Number(percentage),
      description: description,
    };

    try {
      let result = await createTax(payload);
      if ("data" in result) {
        showToast("Created successfully", "success");
        closeModal();
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
            title="Create Tax"
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
              name="percentage"
              prefix={<PercentIcon />}
              label="Percentage"
              type={"number"}
              required={true}
              onChange={(e) => {
                setPercentage(e.target.value);
              }}
            />
            <TextAreaField
              label="Description (optional)"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              height={"h-[120px]"}
            />
            {/* <div className="visible">
              <Checkbox />
              <p>Compound Tax</p>
            </div> */}
          </div>
        </div>

        <div className=" bottom_section">
          <Button type="button" className="cancel" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            disabled={title && percentage ? false : true}
            type="button"
            className="save"
            onClick={onSubmit}
          >
            {isLoading ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};
