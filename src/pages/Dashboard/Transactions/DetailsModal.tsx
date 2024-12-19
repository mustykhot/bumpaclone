import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import ValidatedInput from "components/forms/ValidatedInput";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import SelectField from "components/forms/SelectField";
import ValidatedTextArea from "components/forms/ValidatedTextArea";
import { TRANSACTION_MODES } from "utils/constants/general";
import { useCreateTransactionMutation } from "services";
import { showToast } from "store/store.hooks";
import { formatPrice, formatTransactionPrice, handleError } from "utils";
import Loader from "components/Loader";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { TransactionListType } from "services/api.types";

type ProductModalProps = {
  openModal: boolean;
  closeModal: () => void;
  details: TransactionListType | null;
  setOpenUnpaidModal: any;
};

export const DetailsModal = ({
  openModal,
  closeModal,
  details,
  setOpenUnpaidModal,
}: ProductModalProps) => {
  const navigate = useNavigate();
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
            title="Transaction Details"
          />
          <div className="pd_transaction_details_modal">
            <div className="flex_details">
              <p className="light">Transaction Date & Time</p>
              <p className="bold">
                {moment(details?.created_at).format("lll")} |
                {moment().format("lt")}
              </p>
            </div>
            <div className="flex_details">
              <p className="light">Customer</p>
              <p className="bold">
                {details?.method === "WALLET"
                  ? details?.recipient?.account_name
                    ? details?.recipient?.account_name
                    : details?.order
                    ? "Unnamed Customer"
                    : "None Selected"
                  : details?.method === "TRANSFER"
                  ? details?.meta?.sender_name
                    ? details?.meta?.sender_name
                    : details?.order
                    ? "Unnamed Customer"
                    : "None Selected"
                  : details?.customer?.name
                  ? details?.customer?.name
                  : details?.order
                  ? "Unnamed Customer"
                  : "None Selected"}
              </p>
            </div>
            <div className="flex_details">
              <p className="light">Amount Collected</p>
              <p className="bold">
                {details?.is_customer_charged
                  ? formatTransactionPrice(
                      Number(details?.amount_settled) || 0,
                      details?.currency
                    )
                  : formatTransactionPrice(
                      Number(details?.amount) || 0,
                      details?.currency
                    )}
              </p>
            </div>
            <div className="flex_details">
              <p className="light">Transaction Type</p>
              <p className="bold">{details?.method}</p>
            </div>
            {Number(details?.amount || 0) < 0 ? (
              ""
            ) : (
              <Button
                onClick={() => {
                  if (details?.order_id) {
                    navigate(
                      `/dashboard/orders/${
                        details?.order_id
                      }?backAction=${true}`
                    );
                  } else {
                    setOpenUnpaidModal(true);
                  }
                }}
                variant="contained"
              >
                {details?.order_id ? "View Order" : "Match Order"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </ModalRight>
  );
};
