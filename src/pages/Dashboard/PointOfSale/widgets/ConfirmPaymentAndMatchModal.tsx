import Modal from "components/Modal";
import info_circle from "assets/images/info-circle.png";
import { Button, CircularProgress, IconButton } from "@mui/material";
import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { useState } from "react";
import { formatPrice } from "utils";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  btnAction?: (cb?: () => void) => void;
  isLoading?: boolean;
  createloading?: boolean;
  matchLoading?: boolean;
  orderTotal: number;
  amountToMatch: number;
};

const ConfirmPaymentAndMatchModal = ({
  closeModal,
  openModal,
  btnAction,
  isLoading,
  createloading,
  matchLoading,
  orderTotal,
  amountToMatch,
}: propType) => {
  return (
    <>
      <Modal
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
        closeOnOverlayClick={false}
      >
        <div className="success_wrap">
          <img
            src={info_circle}
            alt=""
            style={{ margin: "auto", marginTop: "24px", marginBottom: "24px" }}
          />
          <h3>Confirm to match payment</h3>
          <p>
            {createloading
              ? "Creating Order ...."
              : matchLoading
              ? "Matching transaction to order ..."
              : "Are you sure you want to match this payment?"}
          </p>

          {amountToMatch > orderTotal && (
            <p className="change_box">
              Change : {formatPrice(amountToMatch - orderTotal)}{" "}
            </p>
          )}

          <div className="btns">
            <Button
              variant="contained"
              onClick={() => {
                btnAction && btnAction();
              }}
              className="view_order_btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size="1.5rem" sx={{ color: "#009444" }} />
              ) : (
                "Yes, Match Payment"
              )}
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                closeModal();
              }}
              disabled={isLoading}
              className="receipt_btn"
            >
              No, Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmPaymentAndMatchModal;
