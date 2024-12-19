import Modal from "components/Modal";
import info_circle from "assets/images/whiteinfo.png";
import { Button, CircularProgress, IconButton } from "@mui/material";
import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { useState } from "react";
import { OrderType } from "Models/order";
import { formatPrice } from "utils";
import SuccessModal from "./SuccessModal";
import { InfoCircleXLIcon } from "assets/Icons/InfoCircleXLIcon";
import { InfoCircleXLLIcon } from "assets/Icons/InfoCircleXLLIcon";
import {
  addOrderToCompletePayment,
  clearEntireCart,
  setCartPaymentMethod,
} from "store/slice/PosSlice";
import { useAppDispatch } from "store/store.hooks";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  createdOrder: OrderType | null;
  setCreatedOrder: (val: any) => void;
  setOpenRepayModal: any;
};

const RequestForAnotherPaymentModal = ({
  closeModal,
  openModal,
  setCreatedOrder,
  createdOrder,
  setOpenRepayModal,
}: propType) => {
  const [openSuccesModal, setOpenSuccesModal] = useState(false);
  const dispatch = useAppDispatch();
  return (
    <>
      <Modal
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
        closeOnOverlayClick={false}
      >
        <div
          className={`success_wrap ${
            createdOrder?.payment_status === "UNPAID"
              ? "unpaid_balance"
              : "partial_balance"
          }`}
        >
          <InfoCircleXLLIcon
            stroke={`${
              createdOrder?.payment_status === "UNPAID" ? "#ffffff" : "#FFB60A"
            }`}
            className="large_info_img"
          />

          <h3>
            {createdOrder?.payment_status === "UNPAID"
              ? "Unpaid Order"
              : "Partially Paid Order"}
          </h3>
          <p>
            {createdOrder?.payment_status === "UNPAID"
              ? "Record payment for this order"
              : "We noticed there’s a balance left."}
          </p>
          <div
            className={`pos_amount ${
              createdOrder?.payment_status === "UNPAID" ? "red" : "grey"
            }`}
          >
            <p className="amount">
              {" "}
              {createdOrder?.payment_status === "UNPAID"
                ? "Unpaid Amount:"
                : "Balance left:"}{" "}
            </p>{" "}
            <p className="price">
              {formatPrice(Number(createdOrder?.amount_due))}
            </p>
          </div>
          <div className="btns">
            <Button
              variant="contained"
              onClick={() => {
                closeModal();
                setOpenRepayModal(true);
              }}
              className="view_order_btn primary_styled_button"
            >
              {createdOrder?.payment_status === "UNPAID"
                ? " Record Payment"
                : " Record Balance"}
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                setOpenSuccesModal(true);
              }}
              className="receipt_btn"
            >
              Skip and continue
            </Button>
          </div>
        </div>
      </Modal>
      <SuccessModal
        openModal={openSuccesModal}
        createdOrder={createdOrder}
        setCreatedOrder={setCreatedOrder}
        closeAllModal={() => {
          setOpenSuccesModal(false);
          closeModal();
          setOpenRepayModal(false);
          setCreatedOrder(null);
          dispatch(clearEntireCart());
          dispatch(setCartPaymentMethod("BANK"));
          dispatch(addOrderToCompletePayment(null));
        }}
        closeModal={() => {
          setOpenSuccesModal(false);
        }}
      />
    </>
  );
};

export default RequestForAnotherPaymentModal;
