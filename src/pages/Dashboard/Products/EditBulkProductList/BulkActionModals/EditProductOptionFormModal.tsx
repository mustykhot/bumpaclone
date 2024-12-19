import { useState, ChangeEvent, useEffect } from "react";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "./style.scss";
import ModalRight from "components/ModalRight";
import InputField from "components/forms/InputField";
import { ClearIcon } from "assets/Icons/ClearIcon";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import uuid from "react-uuid";
import { optionType } from "../../AddProduct/productOptionsSection";
type EditProductOptionFormModalProps = {
  openModal: boolean;
  closeModal: () => void;
  options: [] | optionType[];
  selectedOption: optionType | null;
  setOptions: React.Dispatch<React.SetStateAction<[] | optionType[]>>;
  generateVariation?: (optionParam: optionType[]) => void;
  setSelectedOption: React.Dispatch<React.SetStateAction<optionType | null>>;
};

export const EditProductOptionFormModal = ({
  openModal,
  closeModal,
  options,
  setOptions,
  selectedOption = null,
  generateVariation,
  setSelectedOption,
}: EditProductOptionFormModalProps) => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [optionValue, setOptionValue] = useState<string[]>([""]);
  const resetFields = () => {
    setName("");
    setOptionValue([""]);
    setId("");
  };
  const handleAddOption = () => {
    const itemIndex = options.findIndex((item) => {
      return item.id === id;
    });

    if (itemIndex >= 0) {
      options[itemIndex].name = name;
      options[itemIndex].values = optionValue;
      // 1. Make a shallow copy of the items
      let copy = [...options];
      // 2. Make a shallow copy of the item you want to mutate
      let item = { ...copy[itemIndex] };
      // 3. Replace the property you're intested in
      item.name = name;
      item.values = optionValue;
      // 4. Put it back into our array. N.B. we *are* mutating the array here,
      //    but that's why we made a copy first
      copy[itemIndex] = item;
      // 5. Set the state to our new copy
      setOptions(copy);
      setSelectedOption(null);
      closeModal();
    } else {
      setOptions([...options, { name, values: optionValue, id: `${uuid()}` }]);
      resetFields();
      closeModal();
    }
  };

  const handleFeildsChange =
    (index: number) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = e.target;
      let newFormValues: Array<string> = [...optionValue];
      newFormValues[index] = value;
      setOptionValue([...newFormValues]);
    };
  const removeFormFields = (i: number) => {
    let newFormValues = [...optionValue];
    newFormValues.splice(i, 1);
    setOptionValue(newFormValues);
  };

  useEffect(() => {
    if (selectedOption) {
      setName(selectedOption.name);
      setOptionValue(selectedOption.values);
      setId(selectedOption.id);
    }
  }, [selectedOption]);
  return (
    <ModalRight
      closeModal={() => {
        closeModal();
        resetFields();
      }}
      openModal={openModal}
    >
      <div className="modal_right_children">
        <div className="top_section">
          <ModalRightTitle
            closeModal={() => {
              resetFields();
              closeModal();
            }}
            title="Edit option"
          />
          <div className="pl-[32px] pr-[32px] ">
            <InputField
              value={name}
              autoComplete="off"
              onChange={(e) => {
                setName(e.target.value);
              }}
              label="Option Type"
              placeholder="e.g Size, Colour etc."
            />

            <div className="list_of_options">
              <>
                <label className="add_label">Option Value</label>
                {optionValue.map((item, i) => {
                  return (
                    <InputField
                      autoComplete="off"
                      value={item}
                      key={i}
                      onChange={handleFeildsChange(i)}
                      suffix={
                        i > 0 && (
                          <IconButton
                            onClick={() => {
                              removeFormFields(i);
                            }}
                          >
                            <ClearIcon />
                          </IconButton>
                        )
                      }
                    />
                  );
                })}

                <Button
                  onClick={() => {
                    setOptionValue((prev) => [...prev, ""]);
                  }}
                  startIcon={<AddIcon />}
                >
                  Add more values
                </Button>
              </>
            </div>
          </div>
        </div>

        <div className="productOptionSubmit bottom_section">
          <Button
            type="button"
            className="cancel"
            onClick={() => {
              resetFields();
              closeModal();
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="save"
            onClick={() => {
              handleAddOption();
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};
