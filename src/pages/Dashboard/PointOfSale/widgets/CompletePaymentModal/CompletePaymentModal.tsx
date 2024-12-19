import Modal from "components/Modal";
import ModalRight from "components/ModalRight";
import info_circle from "../../../../../assets/images/info-circle.png";
import { Button, CircularProgress, IconButton } from "@mui/material";
import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { IMAGEURL, getObjWithValidValues } from "utils/constants/general";
import {
  formatNumber,
  formatPrice,
  getCurrencyFnc,
  handleError,
  truncateString,
} from "utils";
import { useEffect, useState } from "react";
import { MinusIcon } from "assets/Icons/MinusIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  addOrderToCompletePayment,
  clearEntireCart,
  selectBankMultiplePaymentReceived,
  selectBankPaymentReceived,
  selectCartDiscount,
  selectCartDiscountAndCartTotalAmount,
  selectCartDiscountType,
  selectCartDiscountValue,
  selectCartPaymentMethod,
  selectCustomerDetails,
  selectDiscount,
  selectOrderToCompletePayment,
  selectPosCartItems,
  selectPosCartSubTotal,
  selectSecondBankMultiplePaymentReceived,
  selectTaxList,
  selectTotalTax,
  setBankMultiplePaymentRecieved,
  setBankPaymentRecieved,
  setCartPaymentMethod,
  setSecondBankMultiplePaymentRecieved,
} from "store/slice/PosSlice";
import InputField from "components/forms/InputField";
import {
  useCreateOrdersMutation,
  useCreateTransactionMutation,
  useMatchOrderMutation,
} from "services";
import { getTotals } from "store/slice/OrderSlice";
import moment from "moment";
import { OrderType } from "Models/order";

import SelectField from "components/forms/SelectField";
import NormalSelectField from "components/forms/NormalSelectField";
import GenerateBankModal from "../GenerateBankModal/GenerateBankModal";
import ConfirmPaymentModal from "../ConfirmPaymentModal";
import PaymentFailed from "../PaymentFailed";
import SuccessModal from "../SuccessModal";
import {
  formatNumberWithCommas,
  removeFormattedNumerComma,
} from "components/forms/ValidatedInput";
import { IStoreInformation } from "Models/store";
import { TransactionListType } from "services/api.types";
import ConfirmPaymentAndMatchModal from "../ConfirmPaymentAndMatchModal";
import { TransactionsToMatchModal } from "../TransactionsToMatchModal";
import SuccessfullyMatchOrderModal from "../SuccessfullyMatchedOrderModal";

type propType = {
  openModal: boolean;
  refetchFnc?: any;
  setOpenAskRepayModal: any;
  closeModal: () => void;
  createdOrder: OrderType | null;
  setCreatedOrder: any;
  storeData?: IStoreInformation;
};

const posPaymentMethodList = [
  {
    value: "BANK",
    label: "Bank Transfer",
  },
  {
    value: "POS",
    label: "Card",
  },

  {
    value: "CASH",
    label: "Cash",
  },
  // {
  //   value: "USSD",
  //   label: "USSD",
  // },
];
const posPaymentTypeList = [
  {
    value: "full",
    label: "Full Payment",
  },
  {
    value: "part",
    label: "Part Payment",
  },
];

const CompletePaymentModal = ({
  closeModal,
  openModal,
  refetchFnc,
  setOpenAskRepayModal,
  createdOrder,
  setCreatedOrder,
  storeData,
}: propType) => {
  const [confirmPayment, setConfirmPayment] = useState(false);
  const [paymentType, setPaymentType] = useState("full");
  const [amountCollected, setAmountCollected] = useState("");
  const dispatch = useAppDispatch();
  const cartPaymentMethod = useAppSelector(selectCartPaymentMethod);
  const [openSuccesModal, setOpenSuccesModal] = useState(false);
  const [openFailureModal, setOpenFailureModal] = useState(false);
  const [openGenerateBank, setOpenGenerateBank] = useState(false);
  const [transaction, { isLoading }] = useCreateTransactionMutation();
  const orderToComplete = useAppSelector(selectOrderToCompletePayment);
  const [transactionToMatch, setTransactionToMatch] =
    useState<TransactionListType | null>(null);
  const [openMatchModal, setOpenMatchModal] = useState(false);
  const [openConfirmMatchModal, setOpenConfirmMatchModal] = useState(false);
  const [useAnotherBank, setUseAnotherBank] = useState("no");
  const [matchedSuccesfully, setMatchedSuccessfully] = useState(false);
  const [matchOrder, { isLoading: loadMatchOrder }] = useMatchOrderMutation();

  const onSubmit = async (cb: () => void, cb2?: () => void) => {
    const payload = {
      order_id: `${orderToComplete?.id}`,
      customer_id: `${orderToComplete?.customer?.id || ""}`,
      amount:
        cartPaymentMethod === "CASH" ||
        cartPaymentMethod === "POS" ||
        (cartPaymentMethod === "BANK" && !storeData?.terminal) ||
        useAnotherBank === "yes"
          ? Number(removeFormattedNumerComma(amountCollected)) >=
            Number(orderToComplete?.amount_due)
            ? Number(orderToComplete?.amount_due || 0)
            : removeFormattedNumerComma(amountCollected || 0)
          : Number(orderToComplete?.amount_due || 0),
      transaction_date: moment(new Date()).format("DD/MM/YYYY"),
      method: cartPaymentMethod || "",
    };
    try {
      let removedNull = getObjWithValidValues(payload);
      let result = await transaction(removedNull);
      if ("data" in result) {
        if (result.data.error) {
          showToast(result.data.error, "error");
        } else {
          showToast("Payment recorded successfully", "success");
          dispatch(clearEntireCart());
          setAmountCollected("");
          setPaymentType("full");
          dispatch(setCartPaymentMethod("BANK"));
          closeModal();
          setCreatedOrder(result.data.order);
          if (result.data.order.amount_due <= 0) {
            setOpenSuccesModal(true);
            closeModal();
          } else {
            setOpenAskRepayModal(true);
            dispatch(addOrderToCompletePayment(result.data.order));
          }
        }
      } else {
        setOpenFailureModal(true);
      }
      cb();
      cb2 && cb2();
    } catch (error) {
      setOpenFailureModal(true);
      cb();
      cb2 && cb2();
    }
  };

  const onSubmitToMatch = async (
    transactionToMatch: TransactionListType | null,
    cb?: () => void,
    cb2?: () => void
  ) => {
    const payload = {
      order_id: `${orderToComplete?.id}`,
      customer_id: `${orderToComplete?.customer?.id || ""}`,
      amount: transactionToMatch?.amount,
      transaction_date: moment(new Date()).format("DD/MM/YYYY"),
      method: cartPaymentMethod || "",
    };
    try {
      let removedNull = getObjWithValidValues(payload);
      let result = await transaction(removedNull);
      if ("data" in result) {
        if (result.data.error) {
          showToast(result.data.error, "error");
        } else {
          showToast("Payment recorded successfully", "success");
          dispatch(clearEntireCart());
          setUseAnotherBank("no");
          dispatch(setCartPaymentMethod("BANK"));
          closeModal();
          setCreatedOrder(result.data.order);
          matchOrderFnc({
            activeTransaction: transactionToMatch,
          });
        }
      } else {
        setOpenFailureModal(true);
      }
      cb && cb();
      cb2 && cb2();
    } catch (error) {
      setOpenFailureModal(true);
      cb && cb();
      cb2 && cb2();
    }
  };

  const matchOrderFnc = async ({
    activeTransaction,
    cb,
  }: {
    activeTransaction: TransactionListType | null;
    cb?: () => void;
  }) => {
    if (activeTransaction) {
      const payload = {
        order_id: orderToComplete?.id,
        transaction_id: activeTransaction?.id,
        customer_id: activeTransaction?.customer?.id,
      };
      try {
        let result = await matchOrder(getObjWithValidValues(payload));
        if ("data" in result) {
          if (result.data.error) {
            showToast(result.data.error, "error");
          } else {
            setCreatedOrder(result.data.order);
            setMatchedSuccessfully(true);
            cb && cb();
          }
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    } else {
      showToast("Select a transaction to match", "error");
    }
  };

  useEffect(() => {
    let total = orderToComplete?.amount_due;
    if (total !== undefined) {
      setAmountCollected(
        formatNumberWithCommas(parseFloat(String(total)?.replace(/,/g, "")))
      );
    }
  }, [orderToComplete]);
  return (
    <>
      <Modal
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
        closeOnOverlayClick={false}
      >
        <div className="pos_complete_payment_modal_wrap">
          <div className="close_btn">
            <p className="modal_title">Payment</p>
            <IconButton
              onClick={() => {
                closeModal();
                setOpenSuccesModal(true);
              }}
              type="button"
              className="close_btn_wrap"
            >
              <CloseSqIcon />
            </IconButton>
          </div>

          <div className="container_for_payment_types">
            <div className="total_payment_display">
              <p className="explain">Balance:</p>
              <p className="total_text">
                {formatPrice(Number(orderToComplete?.amount_due))}
              </p>
            </div>

            <div className="payment_method_container">
              <h5>Payment Method</h5>
              <div className={`method_flex  `}>
                {posPaymentMethodList.map((item, i: number) => (
                  <Button
                    key={i}
                    onClick={() => {
                      dispatch(setCartPaymentMethod(item.value));
                      if (item.value === "BANK") {
                        setUseAnotherBank("no");
                      }
                    }}
                    className={`${
                      item.value === cartPaymentMethod ? "active" : ""
                    }  `}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>

              {cartPaymentMethod === "BANK" &&
                storeData?.terminal &&
                useAnotherBank === "no" && (
                  <div className="display_terminal_bank_details">
                    <p className="title bolden">
                      Share Bank Account Details To Customer:
                    </p>
                    <div className="details_flex">
                      <p className="light">Bank Name:</p>
                      <p className="bold">{storeData?.terminal?.bank_name}</p>
                    </div>
                    <div className="details_flex">
                      <p className="light">Account Name:</p>
                      <p className="bold">
                        {storeData?.terminal?.account_name}
                      </p>
                    </div>
                    <div className="details_flex white">
                      <p className="light">Account Number:</p>
                      <p className="bold green">
                        {storeData?.terminal?.account_number}
                      </p>
                    </div>
                  </div>
                )}

              <>
                {(cartPaymentMethod === "CASH" ||
                  cartPaymentMethod === "POS" ||
                  (cartPaymentMethod === "BANK" && !storeData?.terminal) ||
                  useAnotherBank === "yes") && (
                  <InputField
                    type="text"
                    onChange={(e) => {
                      if (
                        !isNaN(parseInt(e.target.value?.replace(/,/g, ""))) ||
                        e.target.value.length === 0
                      ) {
                        if (e.target.value.length === 0) {
                          setAmountCollected("");
                        } else {
                          setAmountCollected(
                            formatNumberWithCommas(
                              parseFloat(
                                String(e.target.value)?.replace(/,/g, "")
                              )
                            )
                          );
                        }
                      }
                    }}
                    label="Enter amount collected"
                    value={amountCollected as any}
                  />
                )}
                {amountCollected &&
                  (cartPaymentMethod === "CASH" ||
                    cartPaymentMethod === "POS" ||
                    (cartPaymentMethod === "BANK" && !storeData?.terminal) ||
                    useAnotherBank === "yes") &&
                  Number(removeFormattedNumerComma(amountCollected)) -
                    Number(orderToComplete?.amount_due) >
                    0 && (
                    <div className="calculate_change">
                      <p>
                        Change:{" "}
                        {formatPrice(
                          Number(removeFormattedNumerComma(amountCollected)) -
                            Number(orderToComplete?.amount_due)
                        )}
                      </p>
                    </div>
                  )}
              </>
            </div>
          </div>

          <div className="btns">
            {(cartPaymentMethod === "CASH" ||
              cartPaymentMethod === "POS" ||
              (cartPaymentMethod === "BANK" && !storeData?.terminal) ||
              useAnotherBank === "yes") && (
              <Button
                variant="contained"
                onClick={() => {
                  setConfirmPayment(true);
                }}
                className={`view_order_btn`}
                disabled={amountCollected ? false : true}
              >
                Confirm Payment
              </Button>
            )}
            {cartPaymentMethod === "BANK" &&
              storeData?.terminal &&
              useAnotherBank === "no" && (
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenMatchModal(true);
                  }}
                  className={`view_order_btn`}
                  disabled={amountCollected || !isLoading ? false : true}
                >
                  Confirm Bank Transfer
                </Button>
              )}
            {/* {cartPaymentMethod === "BANK" && storeData?.terminal && (
              <div className="new_account_box flex justify-end">
                {useAnotherBank === "no" && (
                  <Button
                    onClick={() => {
                      setUseAnotherBank("yes");
                    }}
                  >
                    Used a different bank account?
                  </Button>
                )}
                {useAnotherBank === "yes" && (
                  <Button
                    onClick={() => {
                      setUseAnotherBank("no");
                    }}
                  >
                    Used a terminal bank account?
                  </Button>
                )}
              </div>
            )} */}
          </div>
        </div>
      </Modal>
      <ConfirmPaymentModal
        openModal={confirmPayment}
        isLoading={isLoading}
        total={
          cartPaymentMethod === "CASH" ||
          cartPaymentMethod === "POS" ||
          (cartPaymentMethod === "BANK" && !storeData?.terminal)
            ? formatPrice(Number(removeFormattedNumerComma(amountCollected)))
            : formatPrice(Number(orderToComplete?.amount_due))
        }
        btnAction={(cb?: () => void) => {
          onSubmit(
            () => {
              setConfirmPayment(false);
            },
            () => {
              cb && cb();
            }
          );
        }}
        closeModal={() => {
          setConfirmPayment(false);
        }}
      />

      <SuccessModal
        openModal={openSuccesModal}
        createdOrder={createdOrder}
        setCreatedOrder={setCreatedOrder}
        closeAllModal={() => {
          setOpenSuccesModal(false);
          closeModal();
          setConfirmPayment(false);
          setCreatedOrder(null);
          setOpenFailureModal(false);
          dispatch(clearEntireCart());
          setAmountCollected("");
          setPaymentType("full");
          dispatch(setCartPaymentMethod("BANK"));
          dispatch(addOrderToCompletePayment(null));
        }}
        closeModal={() => {
          setOpenSuccesModal(false);
        }}
      />
      <GenerateBankModal
        dispatchAction={() => {
          dispatch(setBankPaymentRecieved("yes"));
        }}
        openModal={openGenerateBank}
        closeModal={() => {
          setOpenGenerateBank(false);
        }}
      />

      <TransactionsToMatchModal
        openModal={openMatchModal}
        closeModal={() => {
          setOpenMatchModal(false);
        }}
        isSkip={false}
        actionFnc={(transaction: TransactionListType) => {
          setTransactionToMatch(transaction);
          setOpenConfirmMatchModal(true);
        }}
      />
      <ConfirmPaymentAndMatchModal
        openModal={openConfirmMatchModal}
        closeModal={() => {
          setOpenConfirmMatchModal(false);
        }}
        amountToMatch={Number(transactionToMatch?.amount || 0)}
        orderTotal={Number(orderToComplete?.amount_due || 0)}
        isLoading={loadMatchOrder}
        matchLoading={loadMatchOrder}
        btnAction={() => {
          matchOrderFnc({
            activeTransaction: transactionToMatch,
          });
        }}
      />
      <SuccessfullyMatchOrderModal
        openModal={matchedSuccesfully}
        closeModal={() => {
          setMatchedSuccessfully(false);
        }}
        order_id={orderToComplete?.id}
        transaction={transactionToMatch}
        btnAction={() => {
          if (Number(createdOrder?.amount_due) <= 0) {
            setOpenSuccesModal(true);
          } else {
            setOpenAskRepayModal(true);
            dispatch(addOrderToCompletePayment(createdOrder));
          }
          setMatchedSuccessfully(false);
          setOpenMatchModal(false);
          setOpenConfirmMatchModal(false);
          setTransactionToMatch(null);
        }}
      />
      <PaymentFailed
        openModal={openFailureModal}
        btnAction={() => {
          setOpenFailureModal(false);
          setConfirmPayment(true);

          if (
            transactionToMatch &&
            cartPaymentMethod === "BANK" &&
            storeData?.terminal
          ) {
            matchOrderFnc({
              activeTransaction: transactionToMatch,
            });
          } else {
            onSubmit(() => {
              setConfirmPayment(false);
            });
          }
        }}
        closeModal={() => {
          setOpenFailureModal(false);
        }}
      />
    </>
  );
};

export default CompletePaymentModal;
