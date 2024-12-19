import { useState, ChangeEvent, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import { Divider, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "./style.scss";
import ModalRight from "components/ModalRight";
import { optionType } from "./productOptionsSection";
import InputField from "components/forms/InputField";
import { ClearIcon } from "assets/Icons/ClearIcon";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import uuid from "react-uuid";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { PlusCircleIcon } from "assets/Icons/PlusCircleIcon";
import { showToast } from "store/store.hooks";

const checkInputToRemoveClearIcon = (
  input?: string,
  itemList?: optionType[] | [],
  nameOfOption?: string
): boolean => {
  if (itemList?.length && input && nameOfOption) {
    const lowerCaseInput = input.toLowerCase();
    const filteredItems = itemList.filter(
      (item) => item.name.toLowerCase() === nameOfOption.toLowerCase()
    );
    if (filteredItems.length === 0) {
      return false;
    }
    const valuesToCheck = filteredItems[0].values.map((value) =>
      value.toLowerCase()
    );
    return valuesToCheck.includes(lowerCaseInput);
  } else {
    return false;
  }
};

type AddProductOptionsModalProps = {
  openModal: boolean;
  closeModal: () => void;
  options: [] | optionType[];
  selectedOption: optionType | null;
  setOptions: React.Dispatch<React.SetStateAction<[] | optionType[]>>;
  generateVariation?: (optionParam: optionType[]) => void;
  setSelectedOption: React.Dispatch<React.SetStateAction<optionType | null>>;
  removeOption?: (id: string) => void;
  editType?: any;
  setEditType?: any;
  isEdit?: boolean;
  variationsPendingEdit?: any;
  optionsPendingEdit?: [] | optionType[];
};

export const AddProductOptionsModal = ({
  openModal,
  closeModal,
  options,
  setOptions,
  selectedOption = null,
  generateVariation,
  removeOption,
  setSelectedOption,
  editType,
  setEditType,
  isEdit,
  variationsPendingEdit,
  optionsPendingEdit,
}: AddProductOptionsModalProps) => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [optionValue, setOptionValue] = useState<string[]>([""]);
  const inputRef = useRef<HTMLInputElement>(null);
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
      options[itemIndex].values = optionValue.map((item) => item.trim());
      let copy = [...options];
      let item = { ...copy[itemIndex] };
      item.name = name;
      item.values = optionValue.map((item) => item.trim());

      copy[itemIndex] = item;
      setOptions(copy);
      resetFields();
      generateVariation && generateVariation(copy);
      setSelectedOption(null);
    } else {
      // let checkOptionValue = optionValue
      //   .map((item) => {
      //     if (item) {
      //       return item;
      //     }
      //   })
      //   .filter((el) => el !== undefined);

      let checkOptionValue = optionValue.filter((item) => item);

      if (name && checkOptionValue?.length) {
        setOptions([
          ...options,
          {
            name,
            values: checkOptionValue.map((item) => item.trim()),
            id: `${uuid()}`,
          },
        ]);
        resetFields();
        generateVariation &&
          generateVariation([
            ...options,
            {
              name,
              values: checkOptionValue.map((item) => item.trim()),
              id: `${uuid()}`,
            },
          ]);
      }
    }
  };

  const handleFeildsChange =
    (index: number) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = e.target;
      if (value.includes("-")) {
        showToast('Special character "-" is not allowed', "warning");
      } else {
        if (isEdit) {
          if (
            checkInputToRemoveClearIcon(
              value,
              optionsPendingEdit,
              selectedOption?.name
            )
          ) {
            showToast("Value already exists", "error");
          } else {
            let newFormValues: Array<string> = [...optionValue];
            newFormValues[index] = value;
            setOptionValue([...newFormValues]);
          }
        } else {
          let newFormValues: Array<string> = [...optionValue];
          newFormValues[index] = value;
          setOptionValue([...newFormValues]);
        }
      }
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

  useEffect(() => {
    if (
      inputRef.current &&
      optionValue &&
      optionValue?.length &&
      !selectedOption
    ) {
      inputRef.current.focus();
    }
  }, [optionValue?.length]);
  return (
    <ModalRight
      closeModal={() => {
        closeModal();
        resetFields();
        setEditType("");
      }}
      openModal={openModal}
    >
      <div className="modal_right_children">
        <div className="top_section">
          <ModalRightTitle
            closeModal={() => {
              resetFields();
              closeModal();
              setEditType("");
            }}
            title="Add options"
          />

          {/* we will display options created here */}

          <div className="pl-[32px] pr-[32px] ">
            <div className="display_created_options">
              {options?.map((item, i) => (
                <div className="product_option_section mb-[20px]" key={i}>
                  <div className="single_option_display">
                    <p className="title">{item.name}</p>
                    <div className="item_container_flex">
                      <div className="item_container">
                        {item.values.map((value, i) => (
                          <div key={i} className="single_option">
                            <p>{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="action_container">
                        <Button
                          onClick={() => {
                            setEditType("edit");
                            setSelectedOption({
                              name: item.name,
                              values: item.values,
                              id: item.id,
                            });
                          }}
                          variant="outlined"
                        >
                          Edit
                        </Button>

                        {isEdit ? (
                          variationsPendingEdit?.length ? (
                            ""
                          ) : (
                            <IconButton
                              onClick={() => {
                                removeOption && removeOption(item.id);
                              }}
                              className="icon_button_container pad"
                            >
                              <TrashIcon />
                            </IconButton>
                          )
                        ) : (
                          <IconButton
                            onClick={() => {
                              removeOption && removeOption(item.id);
                            }}
                            className="icon_button_container pad"
                          >
                            <TrashIcon />
                          </IconButton>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <>
              <InputField
                value={name}
                autoComplete="off"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                disabled={
                  isEdit
                    ? variationsPendingEdit?.length
                      ? true
                      : false
                    : false
                }
                label="Option Type"
                placeholder="e.g Size, Colour etc."
              />

              <div className="list_of_options">
                <>
                  <label className="add_label">Option Value</label>
                  {optionValue?.map((item, i) => {
                    return (
                      <InputField
                        autoComplete="off"
                        value={item}
                        placeholder="XL, Red"
                        ref={i === optionValue?.length - 1 ? inputRef : null}
                        key={i}
                        onChange={handleFeildsChange(i)}
                        disabled={
                          isEdit
                            ? checkInputToRemoveClearIcon(
                                item,
                                optionsPendingEdit,
                                selectedOption?.name
                              )
                            : false
                        }
                        suffix={
                          i > 0 ? (
                            isEdit ? (
                              checkInputToRemoveClearIcon(
                                item,
                                optionsPendingEdit,
                                selectedOption?.name
                              ) ? (
                                ""
                              ) : (
                                <IconButton
                                  onClick={() => {
                                    removeFormFields(i);
                                  }}
                                >
                                  <ClearIcon />
                                </IconButton>
                              )
                            ) : (
                              <IconButton
                                onClick={() => {
                                  removeFormFields(i);
                                }}
                              >
                                <ClearIcon />
                              </IconButton>
                            )
                          ) : (
                            ""
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
                    disabled={
                      optionValue[optionValue?.length - 1] ? false : true
                    }
                  >
                    Add more values
                  </Button>
                </>
              </div>
              {isEdit ? (
                variationsPendingEdit?.length ? (
                  ""
                ) : (
                  <Divider
                    onClick={() => {
                      handleAddOption();
                    }}
                    className="add_location_divider"
                  >
                    <div className="flex_box">
                      <PlusCircleIcon /> <p>Save and add new option</p>
                    </div>
                  </Divider>
                )
              ) : (
                <Divider
                  onClick={() => {
                    handleAddOption();
                  }}
                  className="add_location_divider"
                >
                  <div className="flex_box">
                    <PlusCircleIcon /> <p>Save and add new option</p>
                  </div>
                </Divider>
              )}
            </>
          </div>
        </div>

        <div className="productOptionSubmit bottom_section">
          <Button
            type="button"
            className="cancel"
            onClick={() => {
              resetFields();
              closeModal();
              setEditType("");
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="save"
            onClick={() => {
              handleAddOption();
              closeModal();
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};
