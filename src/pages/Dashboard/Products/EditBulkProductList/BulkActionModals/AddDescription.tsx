import { useState, useEffect } from "react";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import Button from "@mui/material/Button";
import NormalTextEditor from "components/forms/NormalTextEditor";

type AddDescriptionProps = {
  openModal: boolean;
  closeModal: () => void;
  description: {
    index: number;
    value: string;
  };
  handleChange: (name: string, index: number, value: any) => void;
};

export const AddDescription = ({
  openModal,
  closeModal,
  description,
  handleChange,
}: AddDescriptionProps) => {
  const [value, setValue] = useState("");

  const submitFnc = () => {
    handleChange("details", description.index, value);
    setValue("");
    closeModal();
  };
  useEffect(() => {
    setValue(description.value);
  }, [description]);
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
            title="Product Description"
          />
          <div className="px-[32px]">
            <NormalTextEditor
              value={value}
              label="Enter Description"
              handleChange={(val: string) => {
                setValue(val);
              }}
            />
          </div>
        </div>
        <div className=" bottom_section">
          <Button type="button" className="cancel" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="button" className="save" onClick={submitFnc}>
            Save
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};
