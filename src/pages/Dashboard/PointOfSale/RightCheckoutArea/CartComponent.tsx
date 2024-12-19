import React, { useEffect, useState } from "react";
import "../style.scss";
import ClearIcon from "@mui/icons-material/Clear";
import product from "../../../../assets/images/product.png";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { MinusIcon } from "assets/Icons/MinusIcon";
import { IconButton } from "@mui/material";
import { formatPrice, truncateString } from "utils";
import {
  addToPosCart,
  decreasePosCart,
  getPosTotals,
  inputPosCartQuantity,
  removeItemFromPosCart,
  selectActiveCartDiscount,
} from "store/slice/PosSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { MinusCircleRedIcon } from "assets/Icons/MinusCircleRedIcon";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  product: any;
  id: any;
  name: string;
  price: number;
  quantity: number;
  amountLeft?: number;
  stock: number;
  options?: string;
  image: string;
};

const CartComponent = (props: Props) => {
  const dispatch = useAppDispatch();
  const [showMinusIcon, setShowMinusIcon] = useState(false);
  return (
    <>
      <div
        id={props.id}
        className="pos_checkout_card"
        onMouseEnter={() => {
          setShowMinusIcon(true);
        }}
        onMouseLeave={() => {
          setShowMinusIcon(false);
        }}
      >
        <AnimatePresence>
          {showMinusIcon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "just" }}
              className={"red_circle"}
            >
              <IconButton
                onClick={() => {
                  dispatch(removeItemFromPosCart(props.product));
                  dispatch(getPosTotals());
                }}
              >
                <MinusCircleRedIcon />
              </IconButton>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="left_checkout_card_side">
          <img src={props.image} />
          <div className="text_box">
            <p className="name">{truncateString(props.name, 20)}</p>
            {props.options && <p className="p_options">{props.options}</p>}
            <p className="price"> {formatPrice(props.price)}</p>
          </div>
        </div>
        <div className="right_checkout_card_side">
          <div className="manage_qty">
            <IconButton
              type="button"
              className="reduce minus"
              onClick={() => {
                // decreaseItemQty(props.ele.qty);
                dispatch(decreasePosCart(props.product));
                dispatch(getPosTotals());
              }}
            >
              {props.quantity === 1 ? <TrashIcon /> : <MinusIcon />}
            </IconButton>
            <input
              type="number"
              value={props.quantity}
              onChange={(e) => {
                if (props.stock >= Number(e.target.value)) {
                  dispatch(
                    inputPosCartQuantity({
                      ...props.product,
                      input: Number(e.target.value),
                    })
                  );
                  dispatch(getPosTotals());
                }
              }}
            />{" "}
            <IconButton
              type="button"
              className="add_btn"
              disabled={props.quantity === props.stock}
              onClick={() => {
                dispatch(addToPosCart(props.product));
                dispatch(getPosTotals());
              }}
            >
              <PlusIcon />
            </IconButton>
          </div>
          {props.amountLeft && props.amountLeft <= 4 ? (
            <p className="stock_alert">
              <InfoCircleIcon stroke="#D90429" />{" "}
              {` ${props.amountLeft} items left`}
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default CartComponent;
