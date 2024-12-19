import { useEffect, useState } from "react";
import { Button, CircularProgress, IconButton } from "@mui/material";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { LargeWarningIcon } from "assets/Icons/LargeWarningIcon";
import { TagIcon } from "assets/Icons/TagIcon";
import Modal from "components/Modal";
import { OrderItemType } from "Models/order";
import { formatPrice, formatTransactionPrice, isValidNumber } from "utils";
import "./style.scss";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  btnAction: () => void;
  actionType: string;
  itemList?: OrderItemType[];
  isLoading: boolean;
  totalAmountPaid?: string;
  currency_code: string;
};

const ConfirmResolveModal = ({
  closeModal,
  openModal,
  actionType,
  itemList,
  btnAction,
  isLoading,
  totalAmountPaid,
  currency_code,
}: propType) => {
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    if (itemList?.length) {
      let total = 0;
      itemList.forEach((product) => {
        if (product.unavailable_quantity) {
          let price = isValidNumber(Number(product.price))
            ? parseFloat(product.price)
            : 0;
          total += product.unavailable_quantity * price;
        }
      });
      setAmount(total);
    }
  }, [itemList]);
  return (
    <Modal
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
      closeOnOverlayClick={false}
    >
      <div className="pd_confirm_resolve_modal">
        <div className="close_btn">
          <p className="modal_title"></p>
          <IconButton
            disabled={isLoading}
            onClick={() => {
              closeModal();
            }}
            type="button"
            className="close_btn_wrap"
          >
            <CloseSqIcon />
          </IconButton>
        </div>

        <div className="content_section">
          <LargeWarningIcon className="warning_icon" />
          <h4 className="title">
            {actionType === "REFUND"
              ? "Refund Excess Items"
              : actionType === "REFUND ALL"
              ? "Confirm Full Refund"
              : "Fulfil this order"}
          </h4>
          <p className="description">
            {actionType === "REFUND"
              ? `You are to refund this customer a total of ${formatTransactionPrice(
                  amount,
                  currency_code
                )} for the product(s) below with not enough stock.`
              : actionType === "REFUND ALL"
              ? ` Are you sure you want to issue a full refund of ${formatTransactionPrice(
                  Number(totalAmountPaid),
                  currency_code
                )} to the customer? This will cancel their entire order.`
              : "The quantity of the products below will be increased in order to resolve this order."}
          </p>
          {itemList?.length && actionType !== "REFUND ALL" ? (
            <div className="item_list">
              {itemList?.map((item) => {
                return (
                  item.unavailable_quantity && (
                    <div className="single_order_product">
                      <div className="left_box">
                        <div className="tag_box">
                          <TagIcon />
                        </div>
                        <div className="name_box">
                          <p className="name">{item.name}</p>
                          <p className="price">
                            {formatPrice(Number(item.price))}
                          </p>
                        </div>
                      </div>
                      <p className="quantity">
                        Qty : {item.unavailable_quantity}
                      </p>
                    </div>
                  )
                );
              })}
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="btns">
          <Button
            variant="contained"
            disabled={isLoading}
            className="primary_styled_button"
            onClick={() => {
              btnAction();
            }}
          >
            {isLoading ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : actionType === "REFUND" || actionType === "REFUND ALL" ? (
              "I’ve Refunded"
            ) : (
              "Fulfil this order"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmResolveModal;
