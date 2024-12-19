import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@mui/material/Button";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import ModalRight from "components/ModalRight";
import InputField from "components/forms/InputField";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import EmptyResponse from "components/EmptyResponse";
import { IMAGEURL } from "utils/constants/general";
import "./style.scss";
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

const SingleProduct = ({
  product,
  functionToChangeSingleValue,
  variantEditorType,
}: {
  product: any;
  variantEditorType: string;
  functionToChangeSingleValue: (val: number, variationId: string) => void;
}) => {
  console.log(product, "single product");
  const [openVariant, setOpenVariant] = useState(true);
  return (
    <>
      <div className="single_related_product">
        <div className="related_product_flex">
          <div className="left_container">
            <img src={`${product.alt_image_url}`} alt="product" />
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
                          src={`${
                            item.image
                              ? `${IMAGEURL}${item.image}`
                              : product.alt_image_url
                          } `}
                          alt="product"
                        />
                        <div className="text_side">
                          <p className="name">{item.variant}</p>
                        </div>
                      </div>

                      <div className="right_container">
                        <InputField
                          value={Number(
                            variantEditorType === "weight_kg"
                              ? item.weight_kg
                              : 0
                          )}
                          type="number"
                          onChange={(e) => {
                            functionToChangeSingleValue(
                              Number(e.target.value),
                              item.id
                            );
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

export const ProductVariationInputEditorModal = ({
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
      setBulkInput("");
    }
  };
  useEffect(() => {
    if (productsToBeEdited && productsToBeEdited.length) {
      setPreparedProduct(productsToBeEdited);
    }
  }, [productsToBeEdited]);

  const functionToChangeSingleValue = (value: number, variationId: string) => {
    setPreparedProduct((prevProdList: any) => {
      return prevProdList.map((product: any) => {
        const updatedVariations = product.variations.map((variation: any) => {
          if (variation.id === variationId) {
            if (variantEditorType === "weight_kg") {
              return { ...variation, weight_kg: value };
            }
          }
          return variation;
        });

        return { ...product, variations: updatedVariations };
      });
    });
  };

  const functionToChangeAllValues = (value: string) => {
    setPreparedProduct((prevProdList: any) => {
      if (variantEditorType === "weight_kg") {
        return prevProdList.map((product: any) => {
          const updatedVariations = product.variations.map((variation: any) => {
            let calculation =
              variantEditorAction === "Increase"
                ? Number(variation.weight_kg) + Number(value)
                : Number(variation.weight_kg) - Number(value);

            return {
              ...variation,
              weight_kg: calculation > 0 ? calculation : 0,
            };
          });

          return { ...product, variations: updatedVariations };
        });
      }
    });
  };

  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children variation_editor_box">
          <div className="top_section">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              title={variantEditorTitle}
            />

            <div className="bulk_increase">
              <p className="text_p">{variantEditorTitle} by:</p>

              <InputField
                type="number"
                value={bulkInput}
                extraClass="bulk_input_on_button"
                onChange={(e) => {
                  setBulkInput(e.target.value);
                }}
                suffix={
                  <Button
                    onClick={() => {
                      functionToChangeAllValues(bulkInput);
                    }}
                    className="last_button"
                  >
                    {variantEditorAction === "Increase" ? "Add" : "Subtract"}
                  </Button>
                }
              />
            </div>

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
            <Button type="button" className="cancel" onClick={closeModal}>
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
