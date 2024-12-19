import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@mui/material/Button";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import ModalRight from "components/ModalRight";
import InputField from "components/forms/InputField";
import EmptyResponse from "components/EmptyResponse";
import { formatNumberWithCommas } from "components/forms/ValidatedInput";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { IMAGEURL, alt_image_url } from "utils/constants/general";
import { getCurrencyFnc } from "utils";
import "./style.scss";
type ProductModalProps = {
  openModal: boolean;
  closeModal: () => void;
  resetFnc: () => void;
  extraClose: () => void;
  functionToAddEditedVariationValueToForm: any;
  productsToBeEdited: any;
  variantEditorTitle: string;
  variantEditorType: string;
  variantEditorAction: string;
};

const SingleProduct = ({
  product,
  functionToChangeSingleValue,
  variantEditorType,
}: {
  product: any;
  variantEditorType: string;
  functionToChangeSingleValue: (
    val: number | string,
    variationId: string
  ) => void;
}) => {
  const [openVariant, setOpenVariant] = useState(true);
  return (
    <>
      <div className="single_related_product">
        <div className="related_product_flex">
          <div className="left_container">
            <img src={product.alt_image_url} alt="product" />
          </div>
          <div className="right_container">
            <div className="top">
              <p className="name">{product.title}</p>
              <div className="price_container">
                <ChevronDownIcon
                  className={openVariant ? "rotate" : ""}
                  onClick={() => {
                    setOpenVariant(!openVariant);
                  }}
                />
              </div>
            </div>
            <div className="bottom">
              <p className="count">{product.stock} in Stock</p>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {openVariant && (
            <motion.div
              className="display_variant"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ type: "just" }}
            >
              {product.variations.map((item: any) => {
                if (item.isChecked) {
                  return (
                    <div
                      className=" related_product_flex variant"
                      key={item.id}
                    >
                      <div className="left_container">
                        <img
                          src={
                            item.image
                              ? `${IMAGEURL}${item.image}`
                              : alt_image_url
                          }
                          alt="product"
                        />
                        <div className="text_side">
                          <p className="name">{item.variant}</p>
                          <p className="count">{item.stock} in Stock</p>
                        </div>
                      </div>
                      <div className="right_container">
                        <InputField
                          prefix={
                            <p className="text-[#9BA2AC] font-semibold text-[20px]">
                              {getCurrencyFnc()}
                            </p>
                          }
                          value={
                            variantEditorType === "price"
                              ? item.price
                              : variantEditorType === "cost"
                              ? item.cost
                              : item.sales || 0
                          }
                          type="text"
                          className="price_input"
                          onChange={(e) => {
                            if (
                              !isNaN(
                                parseInt(e.target.value?.replace(/,/g, ""))
                              ) ||
                              e.target.value.length === 0
                            ) {
                              if (e.target.value.length === 0) {
                                functionToChangeSingleValue("", item.id);
                              } else {
                                functionToChangeSingleValue(
                                  formatNumberWithCommas(
                                    parseFloat(
                                      String(e.target.value)?.replace(/,/g, "")
                                    )
                                  ),
                                  item.id
                                );
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const ProductVariationPriceAndDiscountInputEditorModal = ({
  openModal,
  closeModal,
  productsToBeEdited,
  functionToAddEditedVariationValueToForm,
  extraClose,
  variantEditorTitle,
  variantEditorType,
  resetFnc,
  variantEditorAction,
}: ProductModalProps) => {
  const [preparedProduct, setPreparedProduct] = useState<any>(null);
  const [bulkInput, setBulkInput] = useState("");

  const onSubmit = () => {
    if (preparedProduct && preparedProduct.length) {
      let finalList = preparedProduct.map((item: any) => {
        return {
          ...item,
          variations: item.variations.map((el: any) => {
            return {
              image: el.image,
              price: el.price,
              sales: el.sales,
              stock: el.stock,
              cost: el.cost,
              variant: el.variant,
              weight_kg: el.weight_kg,
              elId: el.elId,
            };
          }),
        };
      });
      functionToAddEditedVariationValueToForm(finalList);
      closeModal();
      extraClose();
    }
  };

  useEffect(() => {
    if (productsToBeEdited && productsToBeEdited.length) {
      setPreparedProduct(productsToBeEdited);
    }
  }, [productsToBeEdited]);

  const functionToChangeSingleValue = (
    value: number | string,
    variationId: string
  ) => {
    setPreparedProduct((prevProdList: any) => {
      return prevProdList.map((product: any) => {
        const updatedVariations = product.variations.map((variation: any) => {
          if (variation.id === variationId) {
            if (variantEditorType === "price") {
              return { ...variation, price: value };
            } else if (variantEditorType === "discount") {
              return { ...variation, sales: value };
            }
          }
          return variation;
        });

        return { ...product, variations: updatedVariations };
      });
    });
  };

  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
          resetFnc();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children variation_editor_box">
          <div className="top_section">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
                resetFnc();
              }}
              title={variantEditorTitle}
            />

            <div className="add_related_product_container ">
              <div className="list_product_to_add_container">
                {preparedProduct && preparedProduct.length ? (
                  preparedProduct.map((item: any) => {
                    return (
                      <SingleProduct
                        functionToChangeSingleValue={
                          functionToChangeSingleValue
                        }
                        variantEditorType={variantEditorType}
                        product={item}
                        key={item.id}
                      />
                    );
                  })
                ) : (
                  <EmptyResponse message="No Product Available" />
                )}
              </div>
            </div>
          </div>

          <div className="productOptionSubmit bottom_section">
            <Button
              type="button"
              className="cancel"
              onClick={() => {
                resetFnc();
                closeModal();
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
    </>
  );
};
