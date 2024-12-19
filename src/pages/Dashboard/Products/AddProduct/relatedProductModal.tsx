import { useState } from "react";
import Button from "@mui/material/Button";
import { Checkbox } from "@mui/material";
import "./style.scss";
import ModalRight from "components/ModalRight";
import InputField from "components/forms/InputField";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { demoProduct, relatedProductType } from "./relatedProduct";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { AnimatePresence, motion } from "framer-motion";
type RelatedProductModalProps = {
  openModal: boolean;
  closeModal: () => void;
  setRelatedProduct: React.Dispatch<React.SetStateAction<string[]>>;
  relatedProduct: string[];
};

const SingleRelatedProduct = ({
  product,
  selectedProductsId,
  setSelectedProductsId,
}: {
  product: relatedProductType;
  selectedProductsId: string[];
  setSelectedProductsId: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [openVariant, setOpenVariant] = useState(false);
  const updateSelectedProduct = (id: string) => {
    if (selectedProductsId.includes(id)) {
      const filteredList = selectedProductsId.filter((item) => item !== id);
      setSelectedProductsId(filteredList);
    } else {
      setSelectedProductsId((prev) => [...prev, id]);
    }
  };
  const updateSelectedVariant = (
    list: relatedProductType[] | undefined,
    checked: boolean
  ) => {
    const variantIds = list?.map((item: relatedProductType) => {
      return item.id;
    });

    if (checked && variantIds) {
      let clone = variantIds?.map((row: string) => row);
      setSelectedProductsId((prev) => [...prev, ...clone]);
    } else if (!checked && variantIds) {
      let filtered = selectedProductsId.filter(
        (item) => !variantIds?.includes(item)
      );
      setSelectedProductsId(filtered);
    }
  };
  return (
    <div className="single_related_product">
      <div className="related_product_flex">
        <div className="left_container">
          {product.variant ? (
            <Checkbox
              checked={product.variant.some((item) =>
                selectedProductsId.includes(item.id)
              )}
              onChange={(e) => {
                updateSelectedVariant(product.variant, e.target.checked);
              }}
            />
          ) : (
            <Checkbox
              checked={selectedProductsId.includes(product.id)}
              onChange={(e) => {
                if (product.variant) {
                } else {
                  updateSelectedProduct(product.id);
                }
              }}
            />
          )}
          <img src={product.image} alt="product" />
        </div>
        <div className="right_container">
          <div className="top">
            <p className="name">{product.name}</p>
            <div className="price_container">
              <p className="price">{product.price}</p>
              {product.variant ? (
                <ChevronDownIcon
                  className={openVariant ? "rotate" : ""}
                  onClick={() => {
                    setOpenVariant(!openVariant);
                  }}
                />
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="bottom">
            <p className="count">{product.count} in Stock</p>
            {!product.isPublished && <p className="isPublished">Unpuplishd</p>}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {product.variant && openVariant && (
          <motion.div
            className="display_variant"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ type: "just" }}
          >
            {product.variant.map((item) => {
              return (
                <div className=" related_product_flex" key={item.id}>
                  <div className="left_container">
                    <Checkbox
                      checked={selectedProductsId.includes(item.id)}
                      onChange={(e) => {
                        updateSelectedProduct(item.id);
                      }}
                    />
                    <img src={item.image} alt="product" />
                  </div>
                  <div className="right_container">
                    <div className="top">
                      <p className="name">{item.name}</p>
                      <div className="price_container">
                        <p className="price">{item.price}</p>
                      </div>
                    </div>
                    <div className="bottom">
                      <p className="count">{item.count} in Stock</p>
                      {!item.isPublished && (
                        <p className="isPublished">Unpuplishd</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const RelatedProductModal = ({
  openModal,
  closeModal,
  relatedProduct,
  setRelatedProduct,
}: RelatedProductModalProps) => {
  const [searchValue, setSearchValue] = useState("");
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
            title="Select Products"
          />
          <div className="add_related_product_container">
            <div className="description_box">
              <p>
                Products added to the Related Products section are products
                visible to your customers on your storefront as “Similar
                Product” upon clicking on a particular product. You can only
                select a maximum of 4 products.
              </p>
            </div>
            <InputField
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              label="Option"
              placeholder="Color"
              containerClass="search_field"
              suffix={<SearchIcon />}
            />

            <div className="selected_count">
              <p>{relatedProduct?.length} Selected</p>
            </div>

            <div className="list_product_to_add_container">
              {demoProduct.map((item: relatedProductType) => {
                return (
                  <SingleRelatedProduct
                    selectedProductsId={relatedProduct}
                    setSelectedProductsId={setRelatedProduct}
                    product={item}
                    key={item.id}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="productOptionSubmit bottom_section">
          <Button type="button" className="cancel" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="button" className="save" onClick={closeModal}>
            Save
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};
