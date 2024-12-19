import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import ValidatedInput from "components/forms/ValidatedInput";
import { NairaIcon } from "assets/Icons/NairaIcon";
import NormalSelectField from "components/forms/NormalSelectField";
import { useEffect, useState } from "react";
import InputField from "components/forms/InputField";
import SelectField from "components/forms/SelectField";
import { useFormContext } from "react-hook-form";
import { useAppSelector } from "store/store.hooks";
import { selectTotal } from "store/slice/OrderSlice";
type ProductModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const AddDiscountModal = ({
  openModal,
  closeModal,
}: ProductModalProps) => {
  const { setValue, watch } = useFormContext();
  const [discount, setDiscount] = useState<any>(
    watch("discount_val2") ? watch("discount_val2") : ""
  );
  const [type, setType] = useState<any>(
    watch("discount_type2") ? watch("discount_type2") : "fixed"
  );
  const [error, setError] = useState<string>("");
  const total = useAppSelector(selectTotal);

  const submitFnc = () => {
    setValue("discount_type", type);
    setValue("discount_val", Number(discount));
  };

  useEffect(() => {
    if (!isNaN(discount)) {
      if (type === "percentage") {
        if (Number(discount) > 100) {
          setError("Percentage must be less than or equal to 100");
        } else {
          setError("");
        }
      } else {
        if (Number(discount) > total) {
          setError("Discount value can not be more than total order amount");
        } else {
          setError("");
        }
      }
    } else {
      setError("Enter a valid number");
    }
  }, [type, discount]);

  useEffect(() => {
    if (watch("discount_type2")) {
      setType(watch("discount_type2"));
    }
    if (watch("discount_val2")) {
      setDiscount(watch("discount_val2"));
    }
  }, []);

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
            title="Add discount"
          />

          <div className="brief_form ">
            <SelectField
              name="discount_type2"
              required={false}
              defaultValue="fixed"
              selectOption={[
                {
                  value: "fixed",
                  key: "Fixed",
                },
                {
                  value: "percentage",
                  key: "Percentage",
                },
              ]}
              handleCustomChange={(val) => {
                setType(val);
              }}
              label="Select Discount Type"
            />
            <ValidatedInput
              name="discount_val2"
              label="Discount"
              required={false}
              type={"number"}
              min={1}
              extraError={error}
              onChange={(e) => {
                setDiscount(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="productOptionSubmit bottom_section">
          <Button type="button" className="cancel" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={error ? true : false}
            className="save"
            onClick={() => {
              submitFnc();
              closeModal();
            }}
          >
            Apply Discount
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};
