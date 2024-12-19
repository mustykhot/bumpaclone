import React, { useEffect, useState } from "react";
import "../style.scss";
import { motion } from "framer-motion";
import ClearIcon from "@mui/icons-material/Clear";
import product from "../../../../assets/images/product.png";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { MinusIcon } from "assets/Icons/MinusIcon";
import { IconButton } from "@mui/material";
import { formatPrice } from "utils";
import {
  addToPosCart,
  decreasePosCart,
  getPosTotals,
  inputPosCartQuantity,
  removeItemFromPosCart,
  selectActiveCartDiscount,
} from "store/slice/PosSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";

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

const CheckoutComponent = (props: Props) => {
  const dispatch = useAppDispatch();
  return (
    <motion.div id={props.id} className="flex checkout_card mt-6">
      <motion.div className="checkout_container">
        <div className="details">
          <div className="flex">
            <div className="img">
              <img src={props.image} />
            </div>
            <div className="name">
              <p className="p_name">{props.name}</p>
              {props.options && <p className="p_options">{props.options}</p>}
              {props.amountLeft && props.amountLeft <= 4 ? (
                <p className="stock_alert">
                  {`Only ${props.amountLeft} left in stock`}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className="quantity ">
          <p className="pt_price" style={{ textAlign: "right" }}>
            {formatPrice(props.price)}
          </p>
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
        </div>
      </motion.div>

      <div className="delete">
        <IconButton
          onClick={() => {
            dispatch(removeItemFromPosCart(props.product));
            dispatch(getPosTotals());
          }}
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      </div>
    </motion.div>
  );
};

export default CheckoutComponent;
