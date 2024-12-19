import Modal from "components/Modal";
import ModalRight from "components/ModalRight";
import info_circle from "../../../../../assets/images/info-circle.png";
import { Button, CircularProgress, IconButton } from "@mui/material";
import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { IMAGEURL } from "utils/constants/general";
import { formatPrice, truncateString } from "utils";
import { useState } from "react";
import { MinusIcon } from "assets/Icons/MinusIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { showToast } from "store/store.hooks";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  item: any;
  onChangeSelect: any;
  addtoCart: any;
  selectedVariant: any;
  unavailable: boolean;
};
const DisplaySingleOption = ({
  option,
  onChangeSelect,
}: {
  option: any;
  onChangeSelect: any;
}) => {
  const [selectedOptionValue, setSelectedOptionValue] = useState("");
  return (
    <div className="single_item_option">
      <p className="option_name">{option.name}</p>
      <div className="option_value_flex">
        {option.values.map((item: any, i: number) => (
          <Button
            onClick={() => {
              setSelectedOptionValue(item);
              onChangeSelect(item, option.name);
            }}
            className={`single_option_value ${
              item === selectedOptionValue ? "active" : ""
            }`}
          >
            {item}
          </Button>
        ))}
      </div>
    </div>
  );
};
const PickVariantModal = ({
  closeModal,
  openModal,
  item,
  addtoCart,
  onChangeSelect,
  selectedVariant,
  unavailable,
}: propType) => {
  const [quantity, setQuantity] = useState(1);
  return (
    <Modal
      closeModal={() => {
        closeModal();
        setQuantity(1);
      }}
      openModal={openModal}
      closeOnOverlayClick={false}
    >
      <div className="pick_variant_modal_wrap">
        <div className="close_btn">
          <p className="modal_title">Choose Variation</p>
          <IconButton
            onClick={() => {
              setQuantity(1);
              closeModal();
            }}
            type="button"
            className="close_btn_wrap"
          >
            <CloseSqIcon />
          </IconButton>
        </div>

        <div className="product_variaton_display">
          <div className="about_product">
            <img
              src={
                selectedVariant && selectedVariant?.image
                  ? `${IMAGEURL}${selectedVariant?.image}`
                  : `${item.alt_image_url}`
              }
              alt="item"
            />
            <div className="image_text">
              <p className="name">
                {truncateString(item.name, 15)}{" "}
                {selectedVariant && `(${selectedVariant?.variant})`}
              </p>

              <p className="price">
                {selectedVariant
                  ? formatPrice(Number(selectedVariant.price))
                  : formatPrice(Number(item.price))}
              </p>
              {selectedVariant && selectedVariant?.prevPrice && (
                <p className="slashed_price">
                  {formatPrice(Number(selectedVariant.prevPrice))}
                </p>
              )}
              {selectedVariant && (
                <p
                  className={`amount_in_stock ${
                    selectedVariant?.quantity === 0 ? "error" : ""
                  }`}
                >
                  {selectedVariant?.quantity} in stock
                </p>
              )}

              <div className="manage_qty">
                <IconButton
                  type="button"
                  className="icon_btn"
                  onClick={() => {
                    if (quantity > 1) {
                      setQuantity(quantity - 1);
                    }
                  }}
                >
                  <MinusIcon />
                </IconButton>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    if (selectedVariant) {
                      setQuantity(Number(e.target.value));
                    }
                  }}
                />{" "}
                <IconButton
                  type="button"
                  className="icon_btn add"
                  disabled={quantity === selectedVariant?.quantity}
                  onClick={() => {
                    setQuantity(quantity + 1);
                  }}
                >
                  <PlusIcon />
                </IconButton>
              </div>
            </div>
          </div>
          {unavailable && (
            <p className="unavailable">Variation is unavailble</p>
          )}

          <div className="product_options_container">
            {item.options.map((option: any, i: number) => (
              <DisplaySingleOption
                onChangeSelect={onChangeSelect}
                option={option}
                key={i}
              />
            ))}
          </div>
        </div>

        <div className="btns">
          <Button
            variant="contained"
            disabled={
              selectedVariant && selectedVariant?.quantity !== 0 ? false : true
            }
            onClick={() => {
              if (quantity > selectedVariant?.quantity) {
                showToast(
                  "Quantity should be lesser or equal to stock ",
                  "error"
                );
              } else {
                addtoCart(quantity);
                closeModal();
                setQuantity(1);
              }
            }}
            className="view_order_btn "
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PickVariantModal;
