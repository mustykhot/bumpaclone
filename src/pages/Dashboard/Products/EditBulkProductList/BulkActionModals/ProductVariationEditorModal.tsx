import { useEffect, useState } from "react";
import uuid from "react-uuid";
import Button from "@mui/material/Button";
import { Checkbox } from "@mui/material";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import EmptyResponse from "components/EmptyResponse";
import { AnimatePresence, motion } from "framer-motion";
import { IMAGEURL, alt_image_url } from "utils/constants/general";
import { ProductVariationInputEditorModal } from "./ProductVariationInputEditorModal";
import { ProductVariationPricePercentageOrFixedModal } from "./ProductVariationPricePercentageOrFixedPickerModal";
type ProductModalProps = {
  openModal: boolean;
  variantEditorTitle: string;
  variantEditorType: string;
  variantEditorAction: string;
  closeModal: () => void;
  productsToBeEdited: any;
  functionToAddEditedVariationValueToForm: any;
};

const SingleProduct = ({
  product,
  preparedProduct,
  setPreparedProduct,
}: {
  product: any;
  preparedProduct: any[];
  setPreparedProduct: React.Dispatch<any>;
}) => {
  const [openVariant, setOpenVariant] = useState(false);

  const updateVariation = (checked: boolean, variantId: string) => {
    setPreparedProduct((prevProdList: any) => {
      return prevProdList.map((product: any) => {
        const updatedVariations = product.variations.map((variation: any) => {
          if (variation.id === variantId) {
            return { ...variation, isChecked: !checked };
          }
          return variation;
        });

        return { ...product, variations: updatedVariations };
      });
    });
  };

  const updateSelectedVariant = (checked: boolean, variantIds: string[]) => {
    setPreparedProduct((prevProdList: any) => {
      return prevProdList.map((product: any) => {
        const updatedVariations = product.variations.map((variation: any) => {
          if (variantIds.includes(variation.id)) {
            return { ...variation, isChecked: checked };
          }
          return variation;
        });

        return { ...product, variations: updatedVariations };
      });
    });
  };
  return (
    <>
      <div className="single_related_product">
        <div className="related_product_flex">
          <div className="left_container">
            <Checkbox
              checked={product.variations.some((item: any) => item.isChecked)}
              onChange={(e) => {
                updateSelectedVariant(
                  e.target.checked,
                  product.variations.map((item: any) => item.id)
                );
              }}
            />
            <img src={product.alt_image_url} alt="product" />
          </div>
          <div className="right_container">
            <div className="top">
              <p className="name">{product.title}</p>
              <div className="price_container">
                {/* <p className="price"></p> */}
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
                return (
                  <div className=" related_product_flex" key={item.id}>
                    <div className="left_container">
                      <Checkbox
                        checked={item.isChecked}
                        onChange={(e) => {
                          updateVariation(item.isChecked, item.id);
                        }}
                      />
                      <img
                        src={
                          item.image
                            ? `${IMAGEURL}${item.image}`
                            : alt_image_url
                        }
                        alt="product"
                      />
                    </div>
                    <div className="right_container">
                      <div className="top">
                        <p className="name">{item.variant}</p>
                      </div>
                      <div className="bottom">
                        <p className="count">{item.stock} in Stock</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const ProductVariationEditorModal = ({
  openModal,
  closeModal,
  productsToBeEdited,
  functionToAddEditedVariationValueToForm,
  variantEditorTitle,
  variantEditorType,
  variantEditorAction,
}: ProductModalProps) => {
  const [preparedProduct, setPreparedProduct] = useState<any>(null);
  const [finalPreparedProduct, setFinalPreparedProduct] = useState<any>(null);
  const [openInputModal, setOpenInputModal] = useState(false);

  const [openFixedOrPercentageModal, setOpenFixedOrPercentageModal] =
    useState(false);

  const onSubmit = () => {
    if (preparedProduct) {
      const filter = preparedProduct
        .map((product: any) => {
          if (product.variations.some((item: any) => item.isChecked)) {
            return {
              ...product,
            };
          }
        })
        .filter((item: any) => item !== undefined);
      setFinalPreparedProduct(filter);
      if (variantEditorType === "stock" || variantEditorType === "weight_kg") {
        setOpenInputModal(true);
      } else {
        setOpenFixedOrPercentageModal(true);
      }
    }
  };

  useEffect(() => {
    if (productsToBeEdited && productsToBeEdited.length) {
      setPreparedProduct(
        productsToBeEdited.map((item: any) => {
          return {
            ...item,
            variations: item.variations.map((el: any) => {
              return {
                ...el,
                id: `${uuid()}`,
              };
            }),
          };
        })
      );
    }
  }, [productsToBeEdited]);

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
              title="Select Variants"
            >
              <p className="mt-[16px] text-[#5C636D] font-[14px] ">
                You can uncheck variations you do not want to edit
              </p>
            </ModalRightTitle>
            <div className="add_related_product_container">
              <div className="list_product_to_add_container">
                {preparedProduct && preparedProduct.length ? (
                  preparedProduct.map((item: any) => {
                    return (
                      <SingleProduct
                        preparedProduct={preparedProduct}
                        setPreparedProduct={setPreparedProduct}
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
      <ProductVariationInputEditorModal
        openModal={openInputModal}
        closeModal={() => {
          setOpenInputModal(false);
        }}
        extraClose={closeModal}
        functionToAddEditedVariationValueToForm={
          functionToAddEditedVariationValueToForm
        }
        productsToBeEdited={finalPreparedProduct}
        variantEditorTitle={variantEditorTitle}
        variantEditorType={variantEditorType}
        variantEditorAction={variantEditorAction}
      />
      <ProductVariationPricePercentageOrFixedModal
        openModal={openFixedOrPercentageModal}
        closeModal={() => {
          setOpenFixedOrPercentageModal(false);
        }}
        extraClose={closeModal}
        functionToAddEditedVariationValueToForm={
          functionToAddEditedVariationValueToForm
        }
        productsToBeEdited={finalPreparedProduct}
        variantEditorTitle={variantEditorTitle}
        variantEditorType={variantEditorType}
        variantEditorAction={variantEditorAction}
      />
    </>
  );
};
