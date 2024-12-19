import Modal from "components/Modal";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { PercentIcon } from "assets/Icons/PercentIcon";
import InputField from "components/forms/InputField";
import { NairaIcon } from "assets/Icons/NairaIcon";
import "./style.scss";
import { formatNumberWithCommas } from "components/forms/ValidatedInput";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { IconButton, MenuItem, Select } from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";
import uuid from "react-uuid";
import NormalSelectField from "components/forms/NormalSelectField";
import { MinusIcon } from "assets/Icons/MinusIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { LargeWarningIcon } from "assets/Icons/LargeWarningIcon";
import { TagIcon } from "assets/Icons/TagIcon";
import { InfoCircleXLLIcon } from "assets/Icons/InfoCircleXLLIcon";
import { useFormContext } from "react-hook-form";
type BulkChangeVariationModalProps = {
  openModal: boolean;
  closeModal: () => void;
  closeParentModal: () => void;
  formulatedVariant: { name: string; id: string; errorText: string }[];
  setFormValues: any;
};

export const ConfirmAdditionModal = ({
  closeModal,
  openModal,
  formulatedVariant,
  setFormValues,
  closeParentModal,
}: BulkChangeVariationModalProps) => {
  const { watch } = useFormContext();
  const [filteredList, setFilteredList] = useState<
    { name: string; id: string; errorText: string }[]
  >([]);

  useEffect(() => {
    if (formulatedVariant?.length) {
      const list = formulatedVariant.filter(
        (item) => item.errorText !== "error"
      );
      setFilteredList(list);
    }
  }, [formulatedVariant]);

  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={() => {
          closeModal();
        }}
      >
        <div className="confirm_addition_modal">
          <div className="title_section">
            <h4></h4>
            <IconButton
              type="button"
              onClick={() => {
                closeModal();
              }}
              className="icon_button_container"
            >
              <XIcon />
            </IconButton>
          </div>

          <div className="icon_and_title">
            <InfoCircleXLLIcon stroke="#009444" />
            <h3>Confirm Variations</h3>
            <p>Crosscheck to confirm variations to be added</p>
          </div>
          <div className="list_variation_section">
            {filteredList?.length
              ? filteredList?.map((item) => (
                  <div key={item.id} className="single_list">
                    <IconButton className="icon_btn">
                      <TagIcon />
                    </IconButton>
                    <p>{item.name}</p>
                  </div>
                ))
              : ""}
          </div>
          <div className="button_section">
            <Button
              className={`add `}
              variant="contained"
              onClick={() => {
                const listToAdd = filteredList.map((item) => {
                  return {
                    variant: item.name,
                    id: `internal-${uuid()}`,
                    barcode: "",
                    stock: "",
                    cost: "",
                    price: "",
                    sales: "",
                    image: "",
                  };
                });
                setFormValues((prev: any) => {
                  return [...listToAdd, ...prev];
                });
                closeModal();
                closeParentModal();
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
