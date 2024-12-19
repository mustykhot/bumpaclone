import { useState, ChangeEvent } from "react";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import Button from "@mui/material/Button";
import uuid from "react-uuid";
import InputField from "components/forms/InputField";
import { Divider, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ClearIcon } from "assets/Icons/ClearIcon";
import { PlusCircleIcon } from "assets/Icons/PlusCircleIcon";

type CreateProductOptionProps = {
  openModal: boolean;
  closeModal: () => void;
  addCreateProductOption: (options: any) => void;
};

export const CreateProductOptionModal = ({
  openModal,
  closeModal,
  addCreateProductOption,
}: CreateProductOptionProps) => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [optionValue, setOptionValue] = useState<string[]>([""]);
  const [options, setOptions] = useState<any[]>([]);

  const [optionFormList, setOptionFormList] = useState<
    { name: string; values: { title: string; id: string }[]; id: string }[]
  >([{ name: "", values: [{ title: "", id: `${uuid()}` }], id: `${uuid()}` }]);

  const resetFields = () => {
    setName("");
    setOptionValue([""]);
    setId("");
  };
  const test = [
    {
      name: "size",
      value: ["L", "XL"],
    },
    {
      name: "Color",
      value: ["red", "blue"],
    },
  ];
  const test2 = [
    {
      name: "Size",
      value: ["L", "XL"],
    },
    {
      name: "Maker",
      value: ["red", "blue"],
    },
  ];

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
    } else {
      setOptions([...options, { name, values: optionValue, id: `${uuid()}` }]);
      resetFields();
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

  const submitFnc = () => {
    let finalArray = optionFormList.map((item) => {
      return {
        name: item.name,
        values: item.values.map((el) => el.title),
        id: item.id,
      };
    });
    addCreateProductOption(finalArray);
    closeModal();
    setOptionFormList([
      { name: "", values: [{ title: "", id: `${uuid()}` }], id: `${uuid()}` },
    ]);
  };

  const funtionToAddValueToOptionFormList = (value: string, id: string) => {
    let copy = [...optionFormList];
    copy.forEach((item) => {
      if (item.id === id) {
        item.name = value;
      }
    });
    setOptionFormList(copy);
  };

  const functionToAddNewValueToArray = (id: string) => {
    let copy = [...optionFormList];
    copy.forEach((item) => {
      if (item.id === id) {
        item.values = [...item.values, { title: "", id: `${uuid()}` }];
      }
    });
    setOptionFormList(copy);
  };
  const functionToRemoveValueFromArray = (id: string, valId: string) => {
    let copy = [...optionFormList];
    copy.forEach((item) => {
      if (item.id === id) {
        item.values = item.values.filter((el) => el.id !== valId);
      }
    });
    setOptionFormList(copy);
  };

  const functionToEditValueInArray = (
    value: string,
    id: string,
    valId: string
  ) => {
    let copy = [...optionFormList];
    copy.forEach((item) => {
      if (item.id === id) {
        let valCopy = item.values;
        valCopy.forEach((val) => {
          if (val.id === valId) {
            val.title = value;
          }
        });
        item.values = valCopy;
      }
    });
    setOptionFormList(copy);
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
            title="Product Option"
          />
          <div className="pl-[32px] pr-[32px] ">
            <>
              {optionFormList.map((item, i) => {
                return (
                  <>
                    <InputField
                      value={item.name}
                      autoComplete="off"
                      onChange={(e) => {
                        funtionToAddValueToOptionFormList(
                          e.target.value,
                          item.id
                        );
                      }}
                      label="Option Type"
                      placeholder="e.g Size, Colour etc."
                    />
                    <div className="list_of_options">
                      {item.values.map((val, i) => {
                        return (
                          <>
                            <label className="add_label">Option Value</label>
                            <InputField
                              autoComplete="off"
                              value={val.title}
                              key={i}
                              onChange={(e) => {
                                functionToEditValueInArray(
                                  e.target.value,
                                  item.id,
                                  val.id
                                );
                              }}
                              suffix={
                                i > 0 && (
                                  <IconButton
                                    onClick={() => {
                                      functionToRemoveValueFromArray(
                                        item.id,
                                        val.id
                                      );
                                    }}
                                  >
                                    <ClearIcon />
                                  </IconButton>
                                )
                              }
                            />
                          </>
                        );
                      })}
                      <Button
                        onClick={() => {
                          functionToAddNewValueToArray(item.id);
                        }}
                        startIcon={<AddIcon />}
                      >
                        Add more values
                      </Button>
                    </div>
                  </>
                );
              })}
            </>
            {/* <>
              <InputField
                value={name}
                autoComplete="off"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                label="Option"
                placeholder="e.g Size, Colour etc."
              />
              <div className="list_of_options">
                <>
                  <label className="add_label">Option Values</label>
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
                    Add new value
                  </Button>
                </>
              </div>
            </> */}

            <Divider onClick={() => {}} className="add_location_divider">
              <div
                onClick={() => {
                  // setOptionFormList((prev) => [
                  //   ...prev,
                  //   {
                  //     name: "",
                  //     value: [{ title: "", id: `${uuid()}` }],
                  //     id: `${uuid()}`,
                  //   },
                  // ]);
                  setOptionFormList((prev) => [
                    ...prev,
                    {
                      name: "",
                      id: `${uuid()}`,
                      values: [{ title: "", id: `${uuid()}` }],
                    },
                  ]);
                }}
                className="flex_box cursor-pointer"
              >
                <PlusCircleIcon /> <p>Add another option</p>
              </div>
            </Divider>
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
