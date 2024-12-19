import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { PercentIcon } from "assets/Icons/PercentIcon";
import ModalRight from "components/ModalRight";
import InputField from "components/forms/InputField";
import {
  formatNumberWithCommas,
  removeFormattedNumerComma,
} from "components/forms/ValidatedInput";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "./style.scss";
import { ProductVariationPriceAndDiscountInputEditorModal } from "./ProductVariationPriceAndDiscountInputEditorModal";
import { getCurrencyFnc } from "utils";

type ProductModalProps = {
  openModal: boolean;
  closeModal: () => void;
  extraClose: () => void;
  functionToAddEditedVariationValueToForm: any;
  productsToBeEdited: any;
  variantEditorTitle: string;
  variantEditorType: string;
  variantEditorAction: string;
};

export const ProductVariationPricePercentageOrFixedModal = ({
  openModal,
  closeModal,
  productsToBeEdited,
  functionToAddEditedVariationValueToForm,
  extraClose,
  variantEditorTitle,
  variantEditorType,
  variantEditorAction,
}: ProductModalProps) => {
  const [preparedProduct, setPreparedProduct] = useState<any>(null);
  const [openFinalModal, setOpenFinalModal] = useState(false);
  const [bulkInput, setBulkInput] = useState("");
  const [type, setType] = useState("percent");
  const onSubmit = () => {
    if (preparedProduct && preparedProduct.length) {
      functionToChangeAllValues(bulkInput);
      setOpenFinalModal(true);
    }
  };

  useEffect(() => {
    if (productsToBeEdited && productsToBeEdited.length) {
      setPreparedProduct(productsToBeEdited);
    }
  }, [productsToBeEdited]);

  const functionToChangeAllValues = (value: string) => {
    setPreparedProduct((prevProdList: any) => {
      if (variantEditorType === "price") {
        if (type === "percent") {
          return prevProdList.map((product: any) => {
            const updatedVariations = product.variations.map(
              (variation: any) => {
                let price = Number(removeFormattedNumerComma(variation.price));
                let calc =
                  (Number(value) *
                    Number(removeFormattedNumerComma(variation.price))) /
                  100;
                let calculation =
                  variantEditorAction === "Increase"
                    ? price + calc
                    : price - calc;

                return {
                  ...variation,
                  price: !variation.isChecked
                    ? formatNumberWithCommas(
                        parseFloat(String(variation.price)?.replace(/,/g, ""))
                      )
                    : calculation > 0
                    ? formatNumberWithCommas(
                        parseFloat(String(calculation)?.replace(/,/g, ""))
                      )
                    : 0,
                };
              }
            );

            return { ...product, variations: updatedVariations };
          });
        } else if (type === "fixed") {
          return prevProdList.map((product: any) => {
            const updatedVariations = product.variations.map(
              (variation: any) => {
                let calculation =
                  variantEditorAction === "Increase"
                    ? Number(removeFormattedNumerComma(variation.price)) +
                      Number(value)
                    : Number(removeFormattedNumerComma(variation.price)) -
                      Number(value);

                return {
                  ...variation,
                  price: !variation.isChecked
                    ? formatNumberWithCommas(
                        parseFloat(String(variation.price)?.replace(/,/g, ""))
                      )
                    : calculation > 0
                    ? formatNumberWithCommas(
                        parseFloat(String(calculation)?.replace(/,/g, ""))
                      )
                    : 0,
                };
              }
            );

            return { ...product, variations: updatedVariations };
          });
        }
      } else if (variantEditorType === "discount") {
        if (type === "percent") {
          return prevProdList.map((product: any) => {
            const updatedVariations = product.variations.map(
              (variation: any) => {
                let price = Number(
                  removeFormattedNumerComma(variation.sales || 0)
                );
                let calc =
                  (Number(value) *
                    Number(removeFormattedNumerComma(variation?.sales || 0))) /
                  100;
                let calculation =
                  variantEditorAction === "Increase"
                    ? price + calc
                    : price - calc;

                return {
                  ...variation,
                  sales: !variation.isChecked
                    ? formatNumberWithCommas(
                        parseFloat(
                          String(variation.sales || 0)?.replace(/,/g, "")
                        )
                      )
                    : calculation > 0
                    ? formatNumberWithCommas(
                        parseFloat(String(calculation)?.replace(/,/g, ""))
                      )
                    : 0,
                };
              }
            );

            return { ...product, variations: updatedVariations };
          });
        } else if (type === "fixed") {
          return prevProdList.map((product: any) => {
            const updatedVariations = product.variations.map(
              (variation: any) => {
                let calculation =
                  variantEditorAction === "Increase"
                    ? Number(removeFormattedNumerComma(variation.sales || 0)) +
                      Number(value)
                    : Number(removeFormattedNumerComma(variation.sales || 0)) -
                      Number(value);

                return {
                  ...variation,
                  sales: !variation.isChecked
                    ? formatNumberWithCommas(
                        parseFloat(
                          String(variation.sales || 0)?.replace(/,/g, "")
                        )
                      )
                    : calculation > 0
                    ? formatNumberWithCommas(
                        parseFloat(String(calculation)?.replace(/,/g, ""))
                      )
                    : 0,
                };
              }
            );

            return { ...product, variations: updatedVariations };
          });
        }
      } else if (variantEditorType === "cost") {
        if (type === "percent") {
          return prevProdList.map((product: any) => {
            const updatedVariations = product.variations.map(
              (variation: any) => {
                let cost = Number(
                  removeFormattedNumerComma(variation?.cost || 0)
                );
                let calc =
                  (Number(value) *
                    Number(removeFormattedNumerComma(variation?.cost || 0))) /
                  100;
                let calculation =
                  variantEditorAction === "Increase"
                    ? cost + calc
                    : cost - calc;

                return {
                  ...variation,
                  cost: !variation.isChecked
                    ? formatNumberWithCommas(
                        parseFloat(
                          String(variation?.cost || 0)?.replace(/,/g, "")
                        )
                      )
                    : calculation > 0
                    ? formatNumberWithCommas(
                        parseFloat(String(calculation)?.replace(/,/g, ""))
                      )
                    : 0,
                };
              }
            );

            return { ...product, variations: updatedVariations };
          });
        } else if (type === "fixed") {
          return prevProdList.map((product: any) => {
            const updatedVariations = product.variations.map(
              (variation: any) => {
                let calculation =
                  variantEditorAction === "Increase"
                    ? Number(removeFormattedNumerComma(variation?.cost || 0)) +
                      Number(value)
                    : Number(removeFormattedNumerComma(variation?.cost || 0)) -
                      Number(value);

                return {
                  ...variation,
                  cost: !variation.isChecked
                    ? formatNumberWithCommas(
                        parseFloat(
                          String(variation?.cost || 0)?.replace(/,/g, "")
                        )
                      )
                    : calculation > 0
                    ? formatNumberWithCommas(
                        parseFloat(String(calculation)?.replace(/,/g, ""))
                      )
                    : 0,
                };
              }
            );
            return { ...product, variations: updatedVariations };
          });
        }
      }
    });
  };

  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
          setBulkInput("");
          setPreparedProduct(productsToBeEdited);
        }}
        openModal={openModal}
      >
        <div className="modal_right_children variation_editor_box">
          <div className="top_section">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
                setBulkInput("");
                setPreparedProduct(productsToBeEdited);
              }}
              title={variantEditorTitle}
            />

            <div className="bulk_increase">
              <div className="button_cover">
                <p className="text_p">{variantEditorTitle} by:</p>
                <div className="btn_flex">
                  {[
                    { label: "Percentage %", key: "percent" },
                    { label: "Fixed amount N", key: "fixed" },
                  ].map((item, i) => {
                    return (
                      <Button
                        key={i}
                        onClick={() => {
                          setType(item.key);
                        }}
                        className={`${type === item.key ? "active" : ""}`}
                      >
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <InputField
                type="number"
                label="Enter Value"
                value={bulkInput}
                className="bulk_input"
                onChange={(e) => {
                  setBulkInput(e.target.value);
                }}
                prefix={
                  type === "percent" ? (
                    <PercentIcon stroke="#9BA2AC" />
                  ) : (
                    <p className="text-[#9BA2AC] font-semibold text-[20px]">
                      {getCurrencyFnc()}
                    </p>
                  )
                }
              />
            </div>
          </div>

          <div className="productOptionSubmit bottom_section">
            <Button
              type="button"
              className="cancel"
              onClick={() => {
                closeModal();
                setBulkInput("");
                setPreparedProduct(productsToBeEdited);
              }}
            >
              Cancel
            </Button>
            <Button type="button" className="save" onClick={onSubmit}>
              Proceed
            </Button>
          </div>
        </div>
      </ModalRight>

      <ProductVariationPriceAndDiscountInputEditorModal
        openModal={openFinalModal}
        closeModal={() => {
          setOpenFinalModal(false);
        }}
        extraClose={() => {
          closeModal();
          setBulkInput("");
          extraClose();
        }}
        functionToAddEditedVariationValueToForm={
          functionToAddEditedVariationValueToForm
        }
        resetFnc={() => {
          setPreparedProduct(productsToBeEdited);
        }}
        productsToBeEdited={preparedProduct}
        variantEditorTitle={variantEditorTitle}
        variantEditorType={variantEditorType}
        variantEditorAction={variantEditorAction}
      />
    </>
  );
};
