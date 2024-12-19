import { useState, useEffect } from "react";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import Button from "@mui/material/Button";
import { optionType } from "../../AddProduct/productOptionsSection";
import { IconButton } from "@mui/material";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { EditProductOptionFormModal } from "./EditProductOptionFormModal";

type EditProductOptionProps = {
  openModal: boolean;
  closeModal: () => void;
  productOptionsToBeEdited: optionType[];
  addCreateProductOption: (options: any) => void;
};

export const EditProductOptionModal = ({
  openModal,
  closeModal,
  addCreateProductOption,
  productOptionsToBeEdited,
}: EditProductOptionProps) => {
  const [optionList, setOptionList] = useState<optionType[]>([]);
  const [selectedOption, setSelectedOption] = useState<optionType | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const removeOption = (id: string) => {
    const newArray = optionList.filter((item) => item.id !== id);
    setOptionList(newArray);
  };
  const submitFnc = () => {
    addCreateProductOption(optionList);
    closeModal();
    setOptionList([]);
  };

  useEffect(() => {
    setOptionList(productOptionsToBeEdited);
  }, [productOptionsToBeEdited]);

  return (
    <>
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

            {optionList.map((item, i) => {
              return (
                <div className="product_option_section px-[32px]" key={i}>
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
                            setSelectedOption({
                              name: item.name,
                              values: item.values,
                              id: item.id,
                            });
                            setOpenEditModal(true);
                          }}
                          variant="outlined"
                        >
                          Edit
                        </Button>
                        <IconButton
                          onClick={() => {
                            removeOption(item.id);
                          }}
                          className="icon_button_container pad"
                        >
                          <TrashIcon />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
      <EditProductOptionFormModal
        openModal={openEditModal}
        options={optionList}
        setOptions={setOptionList}
        setSelectedOption={setSelectedOption}
        selectedOption={selectedOption}
        closeModal={() => {
          setOpenEditModal(false);
          setSelectedOption(null);
        }}
      />
    </>
  );
};
