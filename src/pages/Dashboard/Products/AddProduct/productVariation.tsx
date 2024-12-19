import { IconButton } from "@mui/material";
import uuid from "react-uuid";
import { EmptyImageIcon } from "assets/Icons/EmptyImageIcon";
import { TrashIcon } from "assets/Icons/TrashIcon";
import InputField from "components/forms/InputField";
import TableComponent from "components/table";
import { ChangeEvent, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { optionType } from "./productOptionsSection";
import { SelectVariantImage } from "./SelectVariantImageModal";
import { FormSectionHeader } from "./widget/FormSectionHeader";
import { IMAGEURL } from "utils/constants/general";
import { getCurrencyFnc, mergeArraysOfVariation } from "utils";
import { BulkChangeVariationModal } from "./bulkChangeVariationModal";
import Button from "@mui/material/Button";
import { showToast } from "store/store.hooks";
import {
  formatNumberWithCommas,
  removeFormattedNumerComma,
} from "components/forms/ValidatedInput";
import MessageModal from "components/Modal/MessageModal";
import { AddNewVariationModal } from "./AddNewVariationModal";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { GrowthModal } from "components/GrowthModal";
import { ProductMoqVariants } from "./productMoqVariants";

type ProductVariationProps = {
  options: optionType[];
  defaultVariations?: any[] | null;
  checkDiscountToVariation?: boolean;
  checkStockToVariation?: boolean;
  checkPriceToVariation?: boolean;
  isEdit?: boolean;
  variationsPendingEdit: any;
  editType?: any;
  setEditType?: any;
};

const headCell = [
  { key: "image", name: "" },
  { key: "variant", name: "Variant" },
  { key: "stock", name: "Quantity" },
  { key: "price", name: "Pricing" },
  { key: "cost", name: "Cost" },
  { key: "sales", name: "Discounted Price (Optional)" },
  { key: "weight_kg", name: "Weight" },
  { key: "barcode", name: "Barcode" },
  { key: "delete", name: "" },
];

const headCellEdit = [
  { key: "image", name: "" },
  { key: "variant", name: "Variant" },
  { key: "price", name: "Pricing" },
  { key: "stock", name: "Quantity" },
  { key: "cost", name: "Cost" },
  { key: "sales", name: "Discounted Price (optional)" },
  { key: "weight_kg", name: "Weight" },
  { key: "delete", name: "" },
];

export const ProductVariation = ({
  options,
  defaultVariations,
  checkDiscountToVariation,
  checkPriceToVariation,
  checkStockToVariation,
  variationsPendingEdit = [],
  editType,
  setEditType,
  isEdit,
}: ProductVariationProps) => {
  const [formValues, setFormValues] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [openBulkActionModal, setOpenBulkActionModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddNewVariation, setOpenAddNewVariation] = useState(false);
  const [possibleVariations, setPossibleVariations] = useState<any[]>([]);
  const [openGrowthModal, setOpenGrowthModal] = useState(false);
  const [variantImageIndex, setVariantImageIndex] = useState<null | number>(
    null
  );
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const { setValue, watch } = useFormContext();

  const handleFeildsChange =
    (name: keyof any, index: number, formatValue?: boolean) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = e.target;
      const type = e.target.type;
      let newFormValues: Array<any> = [...formValues];
      if (formatValue && !isNaN(parseInt(e.target.value?.replace(/,/g, "")))) {
        newFormValues[index][name] = formatNumberWithCommas(
          parseFloat(value.replace(/,/g, ""))
        );
      } else {
        newFormValues[index][name] = value;
      }
      setFormValues([...newFormValues]);
    };

  const handleChange = (name: string, index: number, value: any) => {
    let newFormValues: Array<any> = [...formValues];
    newFormValues[index][name] = value;
    setFormValues([...newFormValues]);
  };

  const handleAddImage = (name: string, index: number, value: any) => {
    let newFormValues: Array<any> = [...formValues];
    newFormValues[index][name] = value;
    setFormValues([...newFormValues]);
  };

  const removeFormFields = (i: number | null) => {
    if (i !== null) {
      let newFormValues = [...formValues];
      newFormValues.splice(i, 1);
      setFormValues(newFormValues);
      setIdToDelete(null);
      setOpenDeleteModal(false);
      showToast(
        isEdit
          ? `Deleted! Click 'Save Changes' to confirm your edits once you are done.`
          : "Deleted Successfully",
        "success",
        isEdit ? 8000 : 3000
      );
    }
  };

  const openVariantImageModal = (i: number) => {
    setOpenModal(true);
    setVariantImageIndex(i);
  };

  const handleBulkActionButton = (title: string, action: string) => {
    setTitle(title);
    setActionType(action);
    setOpenBulkActionModal(true);
  };

  const handleBulkAction = (val: number | string) => {
    if (actionType === "price") {
      formValues.forEach((item: any, i) => {
        if (selected.includes(item.id)) {
          handleChange("price", i, val);
        }
      });
    }
    if (actionType === "stock") {
      if (isEdit) {
        formValues.forEach((item: any, i) => {
          if (!item.quantityPassed) {
            if (selected.includes(item.id)) {
              handleChange("stock", i, val);
            }
          }
        });
      } else {
        formValues.forEach((item: any, i) => {
          if (selected.includes(item.id)) {
            handleChange("stock", i, val);
          }
        });
      }
    }
    if (actionType === "cost") {
      formValues.forEach((item: any, i) => {
        if (selected.includes(item.id)) {
          handleChange("cost", i, val);
        }
      });
    }
    if (actionType === "discount") {
      formValues.forEach((item: any, i) => {
        if (selected.includes(item.id)) {
          handleChange("sales", i, val);
        }
      });
    }
    if (actionType === "weight_kg") {
      formValues.forEach((item: any, i) => {
        if (selected.includes(item.id)) {
          handleChange("weight_kg", i, val);
        }
      });
    }
    if (actionType === "maximum_order_quantity") {
      formValues.forEach((item: any, i) => {
        handleChange("maximum_order_quantity", i, val);
      });
    }
    if (actionType === "minimum_order_quantity") {
      formValues.forEach((item: any, i) => {
        handleChange("minimum_order_quantity", i, val);
      });
    }
  };

  useEffect(() => {
    if (isEdit) {
      let retainedFormValues = variationsPendingEdit;
      if (options.length) {
        if (editType === "edit") {
          const array = options.reduce(
            (acc, option) =>
              acc.flatMap((obj: any) =>
                option.values.map((value) => {
                  return {
                    variant: `${obj.variant ? obj.variant + "-" : ""}${value}`,
                  };
                })
              ),
            [{}]
          );
          const formInputs = array.map((item: any) => {
            return {
              ...item,
              id: `internal-${uuid()}`,
              stock: "",
              cost: "",
              price: "",
              sales: "",
              image: "",
              minimum_order_quantity: "",
              maximum_order_quantity: "",
              weight_kg: "",
            };
          });
          const mergedArray = mergeArraysOfVariation(formInputs, formValues);
          let mergedArray2: any[] = retainedFormValues.concat(
            mergedArray.filter(
              (itemB: any) =>
                !retainedFormValues.some(
                  (itemA: any) => itemA.variant === itemB.variant
                )
            )
          );
          setFormValues(mergedArray2);
          setEditType("");
        } else {
          const array = options.reduce(
            (acc, option) =>
              acc.flatMap((obj: any) =>
                option.values.map((value) => {
                  return {
                    variant: `${obj.variant ? obj.variant + "-" : ""}${value}`,
                  };
                })
              ),
            [{}]
          );
          const formInputs = array.map((item: any) => {
            return {
              ...item,
              id: `internal-${uuid()}`,
              barcode: "",
              stock: "",
              cost: "",
              price: "",
              sales: "",
              image: "",
              weight_kg: "",
              minimum_order_quantity: "",
              maximum_order_quantity: "",
            };
          });
          const mergedArray = mergeArraysOfVariation(formInputs, formValues);
          setFormValues(mergedArray);
        }
      } else {
        setFormValues(retainedFormValues);
      }
    } else {
      if (options.length) {
        const array = options.reduce(
          (acc, option) =>
            acc.flatMap((obj: any) =>
              option.values.map((value) => {
                return {
                  variant: `${obj.variant ? obj.variant + "-" : ""}${value}`,
                };
              })
            ),
          [{}]
        );
        const formInputs = array.map((item: any) => {
          return {
            ...item,
            id: `${uuid()}`,
            barcode: "",
            stock: "",
            cost: "",
            price: "",
            sales: "",
            image: "",
            weight_kg: "",
            minimum_order_quantity: "",
            maximum_order_quantity: "",
          };
        });
        const mergedArray = mergeArraysOfVariation(formInputs, formValues);
        setFormValues(mergedArray);
      } else {
        setFormValues([]);
      }
    }
    // eslint-disable-next-line
  }, [options, watch]);

  useEffect(() => {
    if (checkPriceToVariation && watch("price")) {
      formValues.forEach((item: any, i) => {
        handleChange("price", i, watch("price"));
      });
    }
    if (checkDiscountToVariation && watch("sales")) {
      formValues.forEach((item: any, i) => {
        handleChange("sales", i, watch("sales"));
      });
    }
  }, [
    checkPriceToVariation,
    checkDiscountToVariation,
    watch("price"),
    watch("sales"),
  ]);

  useEffect(() => {
    setValue("variations", formValues);
  }, [formValues, setValue]);
  useEffect(() => {
    if (defaultVariations) {
      setFormValues(defaultVariations);
    }
  }, [defaultVariations]);

  // setting expected variations
  useEffect(() => {
    if (options.length) {
      const array = options.reduce(
        (acc, option) =>
          acc.flatMap((obj: any) =>
            option.values.map((value) => {
              return {
                variant: `${obj.variant ? obj.variant + "-" : ""}${value}`,
              };
            })
          ),
        [{}]
      );
      const formInputs = array.map((item: any) => {
        return {
          ...item,
          barcode: "",
          stock: "",
          cost: "",
          price: "",
          sales: "",
          image: "",
          weight_kg: "",
          minimum_order_quantity: "",
          maximum_order_quantity: "",
        };
      });
      setPossibleVariations(formInputs);
    } else {
      setPossibleVariations([]);
    }
  }, [options]);
  return (
    <>
      <SelectVariantImage
        openModal={openModal}
        handleFeildsChange={handleAddImage}
        variantImageIndex={variantImageIndex}
        closeModal={() => {
          setOpenModal(false);
        }}
      />
      <AddNewVariationModal
        openModal={openAddNewVariation}
        closeModal={() => {
          setOpenAddNewVariation(false);
        }}
        existingVariantList={formValues}
        optionList={options}
        possibleVariantList={possibleVariations}
        setFormValues={setFormValues}
      />

      <BulkChangeVariationModal
        openModal={openBulkActionModal}
        closeModal={() => {
          setOpenBulkActionModal(false);
        }}
        title={title}
        actionFnc={(val: number | string) => {
          handleBulkAction(val);
        }}
      />

      <MessageModal
        openModal={openDeleteModal}
        closeModal={() => {
          setOpenDeleteModal(false);
        }}
        icon={<TrashIcon />}
        btnChild={
          <Button
            onClick={() => {
              removeFormFields(idToDelete);
              setOpenDeleteModal(false);
            }}
            className="error"
          >
            Yes, delete
          </Button>
        }
        description="Are you sure you want to delete"
      />

      <GrowthModal
        openModal={openGrowthModal}
        closeModal={() => {
          setOpenGrowthModal(false);
        }}
        title={`Generate barcodes easily on the Growth Plan`}
        subtitle={`Get better inventory tracking when you use Bumpa’s barcode generator.`}
        growthFeatures={[
          "Generate barcodes for better inventory tracking",
          "Upload business logo on website",
          "Create unique barcodes for your products & sell faster.",
        ]}
        buttonText={`Upgrade to Growth`}
        eventName="scan-barcode"
      />

      {formValues?.length ? (
        <div className="pd_product_variation">
          <FormSectionHeader
            title="Product Variation"
            otherElement={
              isEdit && possibleVariations?.length > formValues?.length ? (
                <Button
                  startIcon={<PlusIcon stroke="#009444" />}
                  variant="outlined"
                  onClick={() => {
                    setOpenAddNewVariation(true);
                  }}
                >
                  Add new variation
                </Button>
              ) : (
                ""
              )
            }
          />
          <div className="variation_table">
            <div className="table_action_container">
              <p>Bulk Action :</p>

              <Button
                className="icon_action_button"
                onClick={() => {
                  if (selected?.length) {
                    handleBulkActionButton("Input Quantity", "stock");
                  } else {
                    showToast("Please select variations", "error");
                  }
                }}
              >
                Input Quantity
              </Button>

              <Button
                className="icon_action_button"
                onClick={() => {
                  if (selected?.length) {
                    handleBulkActionButton("Input Price", "price");
                  } else {
                    showToast("Please select variations", "error");
                  }
                }}
              >
                Input Price
              </Button>
              <Button
                className="icon_action_button"
                onClick={() => {
                  if (selected?.length) {
                    handleBulkActionButton("Input Cost", "cost");
                  } else {
                    showToast("Please select variations", "error");
                  }
                }}
              >
                Input Cost
              </Button>

              <Button
                className="icon_action_button"
                onClick={() => {
                  if (selected?.length) {
                    handleBulkActionButton("Input Discount", "discount");
                  } else {
                    showToast("Please select variations", "error");
                  }
                }}
              >
                Input Discounted Price
              </Button>

              <Button
                className="icon_action_button"
                onClick={() => {
                  if (selected?.length) {
                    handleBulkActionButton("Input Weight", "weight_kg");
                  } else {
                    showToast("Please select variations", "error");
                  }
                }}
              >
                Input Weight
              </Button>
            </div>
            <TableComponent
              isLoading={false}
              showPagination={false}
              headCells={isEdit ? headCellEdit : headCell}
              selectMultiple={true}
              selected={selected}
              setSelected={setSelected}
              tableData={formValues.map((item, i) => ({
                variant: item.variant,
                image: (
                  <div className={`image_details`}>
                    {item.image ? (
                      <img
                        src={`${IMAGEURL}${item.image}`}
                        alt="variation"
                        onClick={() => {
                          openVariantImageModal(i);
                        }}
                      />
                    ) : (
                      <EmptyImageIcon
                        onClick={() => {
                          openVariantImageModal(i);
                        }}
                      />
                    )}
                  </div>
                ),
                stock: isEdit ? (
                  item.quantityPassed ? (
                    <InputField
                      value={item.stock}
                      type={"text"}
                      extraClass={`quantity disabled`}
                      onClick={() => {
                        showToast(
                          "You can only edit quantity on the product details page",
                          "error"
                        );
                      }}
                    />
                  ) : (
                    <InputField
                      value={item.stock}
                      onChange={handleFeildsChange("stock", i, true)}
                      type={"text"}
                      extraClass={"quantity"}
                    />
                  )
                ) : (
                  <InputField
                    value={item.stock}
                    onChange={handleFeildsChange("stock", i, true)}
                    type={"text"}
                    extraClass={"quantity"}
                  />
                ),
                price: (
                  <InputField
                    value={item.price}
                    onChange={handleFeildsChange("price", i, true)}
                    type={"text"}
                    extraClass={"price"}
                    prefix={
                      <p className="text-[#222D37] text-[20px]">
                        {getCurrencyFnc()}
                      </p>
                    }
                  />
                ),
                cost: (
                  <InputField
                    value={item.cost}
                    onChange={handleFeildsChange("cost", i, true)}
                    type={"text"}
                    extraClass={"price"}
                    prefix={
                      <p className="text-[#222D37] text-[20px]">
                        {getCurrencyFnc()}
                      </p>
                    }
                  />
                ),
                sales: (
                  <InputField
                    value={item.sales}
                    onChange={handleFeildsChange("sales", i, true)}
                    type={"text"}
                    // disabled={
                    //   isEdit ? (item.has_discount ? true : false) : false
                    // }
                    extraClass={"discount"}
                    prefix={
                      <p className="text-[#222D37] text-[20px]">
                        {getCurrencyFnc()}
                      </p>
                    }
                  />
                ),
                weight_kg: (
                  <InputField
                    value={item.weight_kg}
                    onChange={handleFeildsChange("weight_kg", i, true)}
                    type={"text"}
                    extraClass={"quantity"}
                  />
                ),
                barcode: (
                  <InputField
                    name="barcode"
                    value={item.barcode}
                    openUpgradeModal={openGrowthModal}
                    setOpenUpgradeModal={setOpenGrowthModal}
                    onChange={handleFeildsChange("barcode", i)}
                    extraClass={"discount"}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                  />
                ),

                delete: (
                  <IconButton
                    type="button"
                    className="icon_button_container"
                    onClick={() => {
                      setIdToDelete(i);
                      setOpenDeleteModal(true);
                    }}
                  >
                    <TrashIcon />
                  </IconButton>
                ),
                id: item.id,
                // id: i,
              }))}
            />
          </div>
        </div>
      ) : (
        ""
      )}

      <ProductMoqVariants
        formValues={formValues}
        setFormValues={setFormValues}
        handleChange={handleChange}
        handleBulkActionButton={handleBulkActionButton}
        handleFeildsChange={handleFeildsChange}
        isEdit={isEdit}
      />
    </>
  );
};
