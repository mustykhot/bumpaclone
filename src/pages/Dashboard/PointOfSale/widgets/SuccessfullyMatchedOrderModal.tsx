import Modal from "components/Modal";
import check_circle from "assets/images/checkcircle.png";
import { Button, CircularProgress, IconButton } from "@mui/material";
import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { useState } from "react";
import { TransactionListType } from "services/api.types";
import { formatPrice } from "utils";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  btnAction?: () => void;
  order_id?: number;
  transaction: TransactionListType | null;
};

const SuccessfullyMatchOrderModal = ({
  closeModal,
  openModal,
  btnAction,
  order_id,
  transaction,
}: propType) => {
  return (
    <>
      <Modal
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
        closeOnOverlayClick={false}
        className="confirm_payment_and_match"
      >
        <div className="success_wrap">
          <img
            src={check_circle}
            alt="check circle"
            style={{ margin: "auto", marginTop: "24px", marginBottom: "24px" }}
          />
          <h3>Payment Matched!</h3>
          <p>
            You’ve successfully matched a payment of
            {` ${formatPrice(Number(transaction?.amount || 0))} `}
            {transaction?.customer?.name
              ? `from ${transaction?.customer?.name} `
              : ""}
            to Order ID: {order_id}
          </p>

          <div className="btns">
            <Button
              variant="contained"
              onClick={() => {
                btnAction && btnAction();
              }}
              className="view_order_btn"
            >
              Continue
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SuccessfullyMatchOrderModal;
