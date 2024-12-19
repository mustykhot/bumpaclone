import { ModalTitleSection } from "components/Modal/ModalTitleSection";
import { useState } from "react";
import Rating from "@mui/material/Rating";
import { SubmitButton } from "components/forms/SubmitButton";
import Modal from "components/Modal";
import Select from "@mui/material/Select/Select";
import MenuItem from "@mui/material/MenuItem";
import { useFormContext } from "react-hook-form";
import { IMAGEURL } from "utils/constants/general";
import { formatPrice, truncateString } from "utils";
import parse from "html-react-parser";
import { getVariationPrice } from "../../widget/InventoryTable";

type PreviewProductModalProps = {
  openModal: boolean;
  closeModal: () => void;
  previewProduct: any;
};

export const PreviewProductModal = ({
  closeModal,
  openModal,
  previewProduct,
}: PreviewProductModalProps) => {
  const [value, setValue] = useState<number | null>(5);
  const [clipDescription, setClipDescription] = useState(true);
  const [count, setCount] = useState(1);
  const [selectedImage, setSelectedimage] = useState<{
    name: string;
    path: string;
  } | null>(null);

  const handleOperate = (operator: string) => {
    if (operator === "add") {
      setCount(count + 1);
    } else {
      setCount(count - 1);
    }
  };

  // const name = watch("title");
  // const description = watch("description");
  // const amount = watch("price");
  // const productImages = watch("images");
  // const discount = watch("discount");
  // const addDiscount = watch("addDiscount");
  // const options = watch("options");

  return (
    <Modal openModal={openModal} closeModal={closeModal}>
      {previewProduct && (
        <div className="preview_product_modal">
          <ModalTitleSection title="Product Preview" closeModal={closeModal} />
          <div className="preview_content">
            <div className="image_section">
              <div
                className="big_image_container"
                style={{
                  backgroundImage: `url(${IMAGEURL}${
                    selectedImage
                      ? selectedImage.path
                      : previewProduct.images?.[0]
                      ? previewProduct.images?.[0]?.path
                      : ""
                  })`,
                }}
              ></div>
              <div className="image_flex">
                {previewProduct.images?.map((item: any) => {
                  return (
                    <img
                      src={`${IMAGEURL}${item.path}`}
                      alt="products"
                      onClick={() => {
                        setSelectedimage(item);
                      }}
                    />
                  );
                })}
              </div>
            </div>
            <div className="product_details">
              <h4 className="product_name">{previewProduct.title}</h4>
              <div className="product_price_container">
                {previewProduct.variations &&
                previewProduct.variations.length ? (
                  <p className="price">
                    {getVariationPrice(previewProduct?.variations)}
                  </p>
                ) : (
                  <>
                    <p className="price">
                      {previewProduct.sales
                        ? formatPrice(Math.round(previewProduct.sales))
                        : formatPrice(previewProduct.price)}
                    </p>
                    {previewProduct.sales ? (
                      <p className="old_price">
                        {formatPrice(previewProduct.price)}
                      </p>
                    ) : (
                      ""
                    )}
                    {previewProduct.sales ? (
                      <div className="discount">
                        <span>
                          -
                          {(
                            ((previewProduct.price - previewProduct.sales) /
                              previewProduct.price) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                )}
              </div>
              <div className="rating">
                <Rating
                  name="simple-controlled"
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                />
              </div>
              <div className="product_description">
                <p className={`description ${clipDescription ? "" : ""}`}>
                  {clipDescription
                    ? truncateString(previewProduct.description || "", 50)
                    : previewProduct.description}
                </p>
                {previewProduct.description &&
                  previewProduct.description.length > 50 && (
                    <span
                      onClick={() => {
                        setClipDescription(!clipDescription);
                      }}
                    >
                      View {clipDescription ? "more" : "less"}
                    </span>
                  )}
              </div>
              <div className="count_container">
                <div
                  onClick={() => {
                    handleOperate("minus");
                  }}
                  className="operator"
                >
                  <span>-</span>
                </div>
                <div className="operator">
                  <span>{count}</span>
                </div>
                <div
                  onClick={() => {
                    handleOperate("add");
                  }}
                  className="operator"
                >
                  <span>+</span>
                </div>
              </div>
              <div className="option_select">
                {previewProduct.options?.map((item: any, i: number) => {
                  return (
                    <Select
                      key={item.name}
                      defaultValue={item.name}
                      className="select"
                    >
                      <MenuItem disabled value={item.name}>
                        {item.name}
                      </MenuItem>
                      {item.values.map((option: string) => {
                        return (
                          <MenuItem key={option} value={10}>
                            {option}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  );
                })}
              </div>

              <SubmitButton disabled={true} text="Add to Cart" />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
