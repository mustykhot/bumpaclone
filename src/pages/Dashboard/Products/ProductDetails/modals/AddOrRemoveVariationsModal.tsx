import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Checkbox, CircularProgress, IconButton } from "@mui/material";
import { MinusIcon } from "assets/Icons/MinusIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";
import InputField from "components/forms/InputField";
import NormalSelectField from "components/forms/NormalSelectField";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { handleError } from "utils";
import { useUpdateProductStockMutation } from "services";
import { showToast } from "store/store.hooks";
import "./style.scss";

type Props = {
  openModal: boolean;
  closeModal: () => void;
  type: string;
  variations: any;
};

const SelectComponent = ({
  variations,
  item,
  handleChange,
  i,
  formValues,
}: {
  variations: any;
  item: any;
  handleChange: any;
  i: any;
  formValues: any;
}) => {
  const [quantity, setQuantity] = useState("");
  useEffect(() => {
    let id = item.product_variation_id;
    let filtered = variations.filter((el: any) => el.id === id);
    setQuantity(filtered[0]?.quantity);
  }, [item.product_variation_id]);
  return (
    <div className="flex items-center hold_quant gap-1">
      {quantity && <p> ({quantity})</p>}
      <NormalSelectField
        name="variant"
        placeholder="Select Variant"
        className="select_variant"
        selectOption={
          variations && variations?.length
            ? variations?.map((item: any) => {
                return {
                  key: item.variant,
                  value: item.id,
                  disabled: formValues.some(
                    (obj: any) => obj.product_variation_id === item.id
                  ),
                };
              })
            : []
        }
        value={item.product_variation_id}
        handleCustomChange={(e) => {
          handleChange("product_variation_id", i, e.target.value);
        }}
      />
    </div>
  );
};

export const AddOrRemoveVariationsModal = ({
  openModal,
  closeModal,
  type,
  variations,
}: Props) => {
  const { id } = useParams();
  const [selectAll, setSelectAll] = useState(false);
  const [updateStock, { isLoading }] = useUpdateProductStockMutation();
  const [formValues, setFormValues] = useState<any[]>([
    { product_variation_id: "", quantity: "" },
  ]);
  const [formData, setFormData] = useState({
    reason: "",
  });

  const handleChange = (name: string, index: number, value: any) => {
    let newFormValues: Array<any> = [...formValues];
    newFormValues[index][name] = value;
    setFormValues([...newFormValues]);
  };
  const removeFormFields = (i: number) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };
  const addFormFields = () => {
    setFormValues((prev) => [
      ...prev,
      { product_variation_id: "", quantity: "" },
    ]);
  };
  const onSubmit = async () => {
    let payload = {
      action: type,
      // reason: formData.reason,
      variations: formValues
        ?.map((item) => {
          if (
            item.product_variation_id &&
            item?.quantity &&
            item?.quantity !== 0
          ) {
            return {
              product_variation_id: item.product_variation_id,
              quantity: item?.quantity,
            };
          }
        })
        .filter((item) => item !== undefined),
    };
    if (payload?.variations?.length) {
      try {
        // @ts-ignore
        let result = await updateStock({ body: payload, id: Number(id || 0) });
        if ("data" in result) {
          showToast("Saved Successfuly", "success");
          setFormData({
            reason: "",
          });

          resetFnc();
          closeModal();
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    } else {
      showToast("Select at least one variant", "error");
    }
  };

  const resetFnc = () => {
    setFormValues([{ product_variation_id: "", quantity: "" }]);
    setSelectAll(false);
  };

  useEffect(() => {
    if (selectAll && variations && variations?.length) {
      let list = variations?.map((item: any) => {
        return { product_variation_id: item.id, quantity: "" };
      });
      setFormValues(list);
    } else {
      setFormValues([{ product_variation_id: "", quantity: "" }]);
    }
  }, [selectAll, variations]);

  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
          resetFnc();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children pd_show_variations">
          <div className="top_section">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
                resetFnc();
              }}
              className="remove_border"
              title={type === "add" ? "Add Item" : "Remove Item"}
            ></ModalRightTitle>
            <div className="form_box">
              <div className="check_container">
                <Checkbox
                  checked={selectAll}
                  onChange={(e) => {
                    setSelectAll(!selectAll);
                  }}
                />
                <p>Select all variation</p>
              </div>

              <div className="variation_table">
                {formValues?.map((item: any, i: number) => {
                  return (
                    <div key={i} className="row">
                      <div className="input_cover">
                        <SelectComponent
                          variations={variations}
                          i={i}
                          item={item}
                          formValues={formValues}
                          handleChange={handleChange}
                        />
                        <InputField
                          name="quantity"
                          placeholder="How many?"
                          type={"number"}
                          value={item?.quantity}
                          containerClass={"input_quantity_box"}
                          onChange={(e) => {
                            handleChange("quantity", i, e.target.value);
                          }}
                        />
                      </div>
                      {formValues?.length === 1 ? (
                        <IconButton
                          onClick={() => {
                            addFormFields();
                          }}
                          className="btn green"
                        >
                          <PlusIcon stroke="#009444" />
                        </IconButton>
                      ) : formValues?.length === variations?.length ? (
                        <IconButton
                          onClick={() => {
                            removeFormFields(i);
                          }}
                          className="btn error"
                        >
                          <MinusIcon stroke="#D90429" />
                        </IconButton>
                      ) : i === formValues?.length - 1 ? (
                        <IconButton
                          onClick={() => {
                            addFormFields();
                          }}
                          className="btn green"
                        >
                          <PlusIcon stroke="#009444" />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => {
                            removeFormFields(i);
                          }}
                          className="btn error"
                        >
                          <MinusIcon stroke="#D90429" />
                        </IconButton>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className=" bottom_section">
            <Button type="button" className="cancel" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="button"
              className="save"
              disabled={formValues?.length ? false : true}
              onClick={() => {
                onSubmit();
              }}
            >
              {isLoading ? (
                <CircularProgress sx={{ color: "#ffffff" }} size="1.5rem" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </ModalRight>
    </>
  );
};
