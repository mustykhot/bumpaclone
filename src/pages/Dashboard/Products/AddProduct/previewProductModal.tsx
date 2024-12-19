import { useState } from "react";
import { useFormContext } from "react-hook-form";
import Select from "@mui/material/Select/Select";
import MenuItem from "@mui/material/MenuItem";
import Rating from "@mui/material/Rating";
import { ModalTitleSection } from "components/Modal/ModalTitleSection";
import { SubmitButton } from "components/forms/SubmitButton";
import Modal from "components/Modal";
import { removeFormattedNumerComma } from "components/forms/ValidatedInput";
import { IMAGEURL } from "utils/constants/general";
import { formatPrice, truncateString } from "utils";
import { getVariationPrice } from "../widget/InventoryTable";

type PreviewProductModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const PreviewProductModal = ({
  closeModal,
  openModal,
}: PreviewProductModalProps) => {
  const { watch } = useFormContext();
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

  const name = watch("title");
  const description = watch("description");
  const amount = removeFormattedNumerComma(watch("price") || 0) as number;
  const productImages = watch("images");
  const discount = removeFormattedNumerComma(watch("sales") || 0) as number;

  const addDiscount = watch("addDiscount");
  const options = watch("options");
  const variations = watch("variations");

  return (
    <Modal openModal={openModal} closeModal={closeModal}>
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
                    : watch("images")?.[0]
                    ? watch("images")?.[0]?.path
                    : ""
                })`,
              }}
            ></div>
            <div className="image_flex">
              {productImages?.map((item: any, i: number) => {
                return (
                  <img
                    key={i}
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
            <h4 className="product_name">{name}</h4>
            <div className="product_price_container">
              {variations?.length ? (
                <p className="price">{getVariationPrice(variations)}</p>
              ) : (
                <>
                  <p className="price">
                    {discount
                      ? formatPrice(Math.round(discount))
                      : formatPrice(amount)}
                  </p>
                  {discount ? (
                    <p className="old_price">{formatPrice(amount)}</p>
                  ) : (
                    ""
                  )}
                  {discount ? (
                    <div className="discount">
                      <span>
                        -{(((amount - discount) / amount) * 100).toFixed(1)}%
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
                  ? truncateString(description || "", 50)
                  : description}
              </p>
              {description && description?.length > 50 && (
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
              {options?.map((item: any) => {
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
    </Modal>
  );
};
