import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import moment from "moment";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import { InfoIcon } from "assets/Icons/InfoIcon";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import ValidatedInput from "components/forms/ValidatedInput";
import SelectField from "components/forms/SelectField";
import Loader from "components/Loader";
import MessageModal from "components/Modal/MessageModal";
import { TransactionsToMatchModal } from "pages/Dashboard/PointOfSale/widgets/TransactionsToMatchModal";
import { OrderType } from "Models/order";
import { useCreateTransactionMutation, useMatchOrderMutation } from "services";
import { showToast } from "store/store.hooks";
import { TRANSACTION_MODES_WITH_ICON } from "../../CreateOrder/paymentSection";
import { TransactionListType } from "services/api.types";
import { formatPrice, handleError } from "utils";
import { getObjWithValidValues } from "utils/constants/general";

import "./style.scss";

type ProductModalProps = {
  openModal: boolean;
  closeModal: () => void;
  order_id: string;
  customer_id?: string;
  order: OrderType | null;
  closeOnOverlayClick?: boolean;
  extraAction?: () => void;
};
export type RecordPaymentFields = {
  amount: number;
  transaction_date: string;
  method: string;
  notes?: string;
};

export const RecordPaymentModal = ({
  openModal,
  closeModal,
  order_id,
  customer_id,
  order,
  closeOnOverlayClick,
  extraAction,
}: ProductModalProps) => {
  const [activeTransaction, setActiveTransaction] =
    useState<TransactionListType | null>(null);
  const [openMatchModal, setOpenMatchModal] = useState(false);

  const methods = useForm<RecordPaymentFields>({
    mode: "all",
  });
  const {
    formState: { isValid },
    setValue,
    handleSubmit,
    reset,
    watch,
  } = methods;
  const [transaction, { isLoading }] = useCreateTransactionMutation();
  const [matchOrder, { isLoading: loadMatchOrder }] = useMatchOrderMutation();
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const onSubmit: SubmitHandler<RecordPaymentFields> = async (data) => {
    if (data.method === "TERMINAL") {
      const payload = {
        order_id,
        transaction_id: activeTransaction?.id,
        customer_id: activeTransaction?.customer?.id,
      };
      try {
        let result = await matchOrder(getObjWithValidValues(payload));
        if ("data" in result) {
          if (result.data.error) {
            showToast(result.data.error, "error");
          } else {
            showToast("Terminal transaction matched successfully", "success");
            reset();
            setOpenWarningModal(false);
            closeModal();
            setActiveTransaction(null);
            extraAction && extraAction();
          }
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    } else {
      const payload = {
        ...data,
        order_id,
        customer_id,
        amount: data.amount,
        transaction_date: moment(data.transaction_date).format("DD/MM/YYYY"),
      };
      try {
        let result = await transaction(payload);
        if ("data" in result) {
          if (result.data.error) {
            showToast(result.data.error, "error");
          } else {
            if (order?.origin === "website") {
              showToast("Payment recorded successfully", "success");
            } else {
              showToast(
                "Recorded successfully, Your customer has received a payment confirmation email",
                "success"
              );
            }
            reset();
            setOpenWarningModal(false);
            extraAction && extraAction();
            closeModal();
          }
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };
  useEffect(() => {
    setValue("method", "TERMINAL");
    if (order) {
      if (
        order.payment_status === "UNPAID" ||
        order.payment_status === "PARTIALLY_PAID"
      ) {
        setValue("amount", Number(order.amount_due));
      }
    }
  }, [order]);

  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        {(isLoading || loadMatchOrder) && <Loader />}
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full h-full"
            action=""
          >
            <div className="modal_right_children pd_record_payment">
              <div className="top_section">
                <ModalRightTitle
                  closeModal={() => {
                    closeModal();
                  }}
                  title="Record Payment"
                />

                <div className="brief_form">
                  <ValidatedInput
                    name="transaction_date"
                    label="Transaction Date"
                    type={"date"}
                    defaultValue={moment().format("YYYY-MM-DD")}
                  />
                  <SelectField
                    name="method"
                    selectOption={TRANSACTION_MODES_WITH_ICON.map((item) => {
                      return {
                        value: item.value,
                        key: item.label,
                        icon: item.icon,
                      };
                    })}
                    label="Transaction Mode"
                  />
                  {watch("method") === "TERMINAL" ? (
                    <div className="cover_customer_select select_terminal">
                      <div
                        onClick={() => {
                          setOpenMatchModal(true);
                        }}
                        className="pick_cutomer"
                      >
                        <label>Select Terminal Payment</label>
                        <div>
                          <p>
                            {activeTransaction ? (
                              `${
                                activeTransaction?.meta?.sender_name
                              } - ${formatPrice(
                                Number(activeTransaction?.amount)
                              )}`
                            ) : (
                              <span>Select Payment</span>
                            )}
                          </p>
                          <ChevronDownIcon />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ValidatedInput
                      name="amount"
                      label="Amount"
                      type={"number"}
                      rules={{
                        validate: (value) => {
                          return (
                            Number(value) <= Number(order?.amount_due) ||
                            "Value can not be more than amount owed"
                          );
                        },
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="productOptionSubmit bottom_section">
                <Button type="button" className="cancel" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={!isValid}
                  onClick={() => {
                    if (order?.origin === "website") {
                      setOpenWarningModal(true);
                    } else {
                      onSubmit({
                        amount: watch("amount"),
                        transaction_date: watch("transaction_date"),
                        method: watch("method"),
                      });
                    }
                  }}
                  className="save"
                >
                  Save{" "}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </ModalRight>
      <MessageModal
        openModal={openWarningModal}
        closeModal={() => {
          setOpenWarningModal(false);
        }}
        extraClass="increase_height"
        icon={<InfoIcon stroke="#5C636D" />}
        btnChild={
          <Button
            onClick={() => {
              onSubmit({
                amount: watch("amount"),
                transaction_date: watch("transaction_date"),
                method: watch("method"),
              });
            }}
            variant="contained"
            className="primary_styled_button"
          >
            {isLoading || loadMatchOrder ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Yes, continue"
            )}
          </Button>
        }
        description={
          "You can record this payment if you have received the payment offline. Your customer will receive a payment confirmation email."
        }
      />

      <TransactionsToMatchModal
        openModal={openMatchModal}
        closeModal={() => {
          setOpenMatchModal(false);
        }}
        isSkip={false}
        actionFnc={(transaction: TransactionListType) => {
          setActiveTransaction(transaction);
          setOpenMatchModal(false);
        }}
      />
    </>
  );
};
