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

import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  addOrderToCompletePayment,
  addTotalTax,
  clearEntireCart,
  selectBankPaymentReceived,
  selectCartDiscount,
  selectCartDiscountAndCartTotalAmount,
  selectCartDiscountType,
  selectCartDiscountValue,
  selectCartPaymentMethod,
  selectCustomerDetails,
  selectDiscount,
  selectPosCartItems,
  selectPosCartSubTotal,
  selectTaxList,
  selectTotalTax,
  setBankPaymentRecieved,
  setCartPaymentMethod,
} from "store/slice/PosSlice";
import InputField from "components/forms/InputField";
import {
  useCreateOrdersMutation,
  useGetStoreInformationQuery,
  useMatchOrderMutation,
} from "services";
import moment from "moment";
import { OrderType } from "Models/order";
import PaymentFailed from "../PaymentFailed";
import SuccessModal from "../SuccessModal";
import ConfirmPaymentModal from "../ConfirmPaymentModal";

import GenerateBankModal from "../GenerateBankModal/GenerateBankModal";
import {
  formatNumberWithCommas,
  removeFormattedNumerComma,
} from "components/forms/ValidatedInput";
import { IStoreInformation } from "Models/store";
import { TransactionsToMatchModal } from "../TransactionsToMatchModal";
import { TransactionListType } from "services/api.types";
import ConfirmPaymentAndMatchModal from "../ConfirmPaymentAndMatchModal";
import SuccessfullyMatchOrderModal from "../SuccessfullyMatchedOrderModal";

type propType = {
  openModal: boolean;
  refetchFnc?: any;
  setOpenAskRepayModal: any;
  createdOrder: OrderType | null;
  setCreatedOrder: any;
  closeModal: () => void;
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
];

const CheckoutModal = ({
  closeModal,
  openModal,
  refetchFnc,
  setOpenAskRepayModal,
  createdOrder,
  setCreatedOrder,
  storeData,
}: propType) => {
  const selectMainDiscount = useAppSelector(selectDiscount);
  const cartDiscountAndCartTotalAmount = useAppSelector(
    selectCartDiscountAndCartTotalAmount
  );
  const [confirmPayment, setConfirmPayment] = useState(false);

  const [paymentType, setPaymentType] = useState("full");
  const [amountCollected, setAmountCollected] = useState("");
  const dispatch = useAppDispatch();
  const cartPaymentMethod = useAppSelector(selectCartPaymentMethod);
  const taxTotal = useAppSelector(selectTotalTax);
  const cartSubTotal = useAppSelector(selectPosCartSubTotal);
  const taxesList = useAppSelector(selectTaxList);
  const cartCustomer = useAppSelector(selectCustomerDetails);
  const cartDiscount = useAppSelector(selectCartDiscount);
  const cartDiscountValue = useAppSelector(selectCartDiscountValue);
  const cartDiscountType = useAppSelector(selectCartDiscountType);
  const cartItems = useAppSelector(selectPosCartItems);
  const [openSuccesModal, setOpenSuccesModal] = useState(false);
  const [openFailureModal, setOpenFailureModal] = useState(false);
  const [openGenerateBank, setOpenGenerateBank] = useState(false);
  const bankPaymentReceived = useAppSelector(selectBankPaymentReceived);
  const [hasPayment, setHasPayment] = useState(true);
  const [transactionToMatch, setTransactionToMatch] =
    useState<TransactionListType | null>(null);
  const [openMatchModal, setOpenMatchModal] = useState(false);
  const [openConfirmMatchModal, setOpenConfirmMatchModal] = useState(false);
  const [useAnotherBank, setUseAnotherBank] = useState("no");
  const [matchedSuccesfully, setMatchedSuccessfully] = useState(false);
  const [matchOrder, { isLoading: loadMatchOrder }] = useMatchOrderMutation();
  const cartDiscountAndCarTTotalValue = useAppSelector(
    selectCartDiscountAndCartTotalAmount
  );

  const getLastTotalWithoutTax = () => {
    if (cartDiscountAndCartTotalAmount) {
      return cartDiscountAndCartTotalAmount;
    } else if (selectMainDiscount.value) {
      if (selectMainDiscount.type === "fixed") {
        return cartSubTotal - Number(selectMainDiscount.value);
      } else if (selectMainDiscount.type === "percentage") {
        let amountCalculated = (selectMainDiscount.value / 100) * cartSubTotal;
        return cartSubTotal - Number(amountCalculated);
      }
    } else {
      return cartSubTotal;
    }
  };
  const getLastSubTotalWithoutCurrency = () => {
    if (cartDiscountAndCarTTotalValue) {
      return cartDiscountAndCarTTotalValue;
    } else if (selectMainDiscount.value) {
      if (selectMainDiscount.type === "fixed") {
        return cartSubTotal - Number(selectMainDiscount.value);
      } else if (selectMainDiscount.type === "percentage") {
        let amountCalculated = (selectMainDiscount.value / 100) * cartSubTotal;
        return cartSubTotal - Number(amountCalculated);
      }
    } else {
      return cartSubTotal;
    }
  };

  const getLastTotal = () => {
    if (cartDiscountAndCartTotalAmount) {
      return formatPrice(
        cartDiscountAndCartTotalAmount +
          (taxTotal / 100) * cartDiscountAndCartTotalAmount
      );
    } else if (selectMainDiscount.value) {
      if (selectMainDiscount.type === "fixed") {
        let newTotal = cartSubTotal - Number(selectMainDiscount.value);
        return formatPrice(newTotal + (taxTotal / 100) * newTotal);
      } else if (selectMainDiscount.type === "percentage") {
        let amountCalculated = (selectMainDiscount.value / 100) * cartSubTotal;
        let newTotal = cartSubTotal - Number(amountCalculated);

        return formatPrice(newTotal + (taxTotal / 100) * newTotal);
      }
    } else {
      return formatPrice(cartSubTotal + (taxTotal / 100) * cartSubTotal);
    }
  };

  const getLastTotalWithoutCurrency = () => {
    if (cartDiscountAndCartTotalAmount) {
      return (
        cartDiscountAndCartTotalAmount +
        (taxTotal / 100) * cartDiscountAndCartTotalAmount
      );
    } else if (selectMainDiscount.value) {
      if (selectMainDiscount.type === "fixed") {
        let newTotal = cartSubTotal - Number(selectMainDiscount.value);
        return newTotal + (taxTotal / 100) * newTotal;
      } else if (selectMainDiscount.type === "percentage") {
        let amountCalculated = (selectMainDiscount.value / 100) * cartSubTotal;
        let newTotal = cartSubTotal - Number(amountCalculated);
        return newTotal + (taxTotal / 100) * newTotal;
      }
    } else {
      return cartSubTotal + (taxTotal / 100) * cartSubTotal;
    }
  };

  const getLastTaxTotal = () => {
    if (cartDiscountAndCartTotalAmount) {
      return formatPrice(
        Number(((taxTotal / 100) * cartDiscountAndCartTotalAmount).toFixed(2))
      );
    } else if (selectMainDiscount.value) {
      if (selectMainDiscount.type === "fixed") {
        let newTotal = cartSubTotal - Number(selectMainDiscount.value);
        return formatPrice((taxTotal / 100) * newTotal);
      } else if (selectMainDiscount.type === "percentage") {
        let amountCalculated = (selectMainDiscount.value / 100) * cartSubTotal;
        let newTotal = cartSubTotal - Number(amountCalculated);
        return formatPrice((taxTotal / 100) * newTotal);
      }
    } else {
      formatPrice(Number(((taxTotal / 100) * cartSubTotal).toFixed(2)));
    }
  };

  const getLastProductTotalWithoutCurrency = () => {
    if (cartDiscountAndCarTTotalValue) {
      return cartDiscountAndCarTTotalValue;
    } else {
      return cartSubTotal;
    }
  };
  const getPercentageDiscountValue = (total: any, percent: any) => {
    let totalNumber = Number(total);
    let totalPercent = Number(percent);
    let calculatedValue = (totalNumber * totalPercent) / 100;
    return calculatedValue;
  };
  const [createOrder, { isLoading: loadOrder }] = useCreateOrdersMutation();

  const submitOrder = async (
    isHasPayment: boolean,
    cb: () => void,
    cb2?: () => void
  ) => {
    const taxAmount = ((taxTotal || 0) / 100) * (getLastTotalWithoutTax() || 0);
    const payload = {
      customer_id: cartCustomer ? cartCustomer?.id : null,
      channel: "WEB",
      origin: "pos",
      tax: taxAmount,
      taxes: taxesList,
      discount: cartDiscount || selectMainDiscount.value,
      discount_type: cartDiscountType || selectMainDiscount.type,
      discount_val: cartDiscountValue
        ? cartDiscountValue
        : selectMainDiscount.type === "percentage"
        ? getPercentageDiscountValue(
            getLastProductTotalWithoutCurrency(),
            selectMainDiscount.value
          )
        : selectMainDiscount.value,
      items: cartItems.map((item: any) => {
        return getObjWithValidValues({
          id: item.itemId ? item.itemId : item.id,
          variant: item.variant ? item.variant : null,
          url: item.url,
          name: item.variantName || item.name,
          unit: item.unit,
          price: item.price,
          total: Number(item.price) * Number(item.quantity),
          thumbnail_url: item.image,
          quantity: item.quantity,
          discount_type: item.discount_type,
          discount_val: item.discount_val,
          discount: item.discount,
        });
      }),
      sub_total: getLastProductTotalWithoutCurrency(),
      grand_total: getLastTotalWithoutCurrency(),
      total: getLastTotalWithoutCurrency(),
      order_date: moment(new Date()).format("DD/MM/YYYY"),
      payment_amount: isHasPayment
        ? cartPaymentMethod === "CASH" ||
          cartPaymentMethod === "POS" ||
          (cartPaymentMethod === "BANK" && !storeData?.terminal) ||
          useAnotherBank === "yes"
          ? Number(removeFormattedNumerComma(amountCollected)) >=
            (getLastTotalWithoutCurrency() || 0)
            ? getLastTotalWithoutCurrency()
            : removeFormattedNumerComma(amountCollected)
          : getLastTotalWithoutCurrency()
        : "",
      payment_method: cartPaymentMethod,
      hasPayment: isHasPayment,
    };
    if (payload.items && payload.items.length) {
      try {
        let result = await createOrder(getObjWithValidValues(payload));
        if ("data" in result) {
          showToast("Created successfully", "success");
          dispatch(clearEntireCart());
          setCreatedOrder(result.data);
          setAmountCollected("");
          setPaymentType("full");
          setUseAnotherBank("no");
          dispatch(setCartPaymentMethod("BANK"));
          closeModal();
          refetchFnc && refetchFnc();
          if (typeof _cio !== "undefined") {
            _cio.track("web_order_add", payload);
          }
          if (typeof mixpanel !== "undefined") {
            mixpanel.track("web_order_add", payload);
          }
          if (typeof _cio !== "undefined") {
            _cio.track("web_order_paid", payload);
          }
          if (typeof mixpanel !== "undefined") {
            mixpanel.track("web_order_paid", payload);
          }

          if (Number(result.data.amount_due) <= 0) {
            setOpenSuccesModal(true);
          } else {
            setOpenAskRepayModal(true);
            dispatch(addOrderToCompletePayment(result.data));
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
    } else {
      showToast("Please add product to cart to proceed", "error", 5000);
      cb2 && cb2();
    }
  };

  const submitOrderToMatch = async (
    transaction: TransactionListType | null,
    cb?: () => void,
    cb2?: () => void
  ) => {
    const taxAmount = ((taxTotal || 0) / 100) * (getLastTotalWithoutTax() || 0);
    const payload = {
      customer_id: cartCustomer ? cartCustomer?.id : null,
      channel: "WEB",
      origin: "pos",
      tax: taxAmount,
      taxes: taxesList,
      discount: cartDiscount || selectMainDiscount.value,
      discount_type: cartDiscountType || selectMainDiscount.type,
      discount_val: cartDiscountValue
        ? cartDiscountValue
        : selectMainDiscount.type === "percentage"
        ? getPercentageDiscountValue(
            getLastProductTotalWithoutCurrency(),
            selectMainDiscount.value
          )
        : selectMainDiscount.value,
      items: cartItems.map((item: any) => {
        return getObjWithValidValues({
          id: item.itemId ? item.itemId : item.id,
          variant: item.variant ? item.variant : null,
          url: item.url,
          name: item.variantName || item.name,
          unit: item.unit,
          price: item.price,
          total: Number(item.price) * Number(item.quantity),
          thumbnail_url: item.image,
          quantity: item.quantity,
          discount_type: item.discount_type,
          discount_val: item.discount_val,
          discount: item.discount,
        });
      }),
      sub_total: getLastProductTotalWithoutCurrency(),
      grand_total: getLastTotalWithoutCurrency(),
      total: getLastTotalWithoutCurrency(),
      order_date: moment(new Date()).format("DD/MM/YYYY"),
      payment_amount: "",
      payment_method: cartPaymentMethod,
      hasPayment: false,
    };
    if (payload.items && payload.items.length) {
      try {
        let result = await createOrder(getObjWithValidValues(payload));
        if ("data" in result) {
          showToast("Created successfully", "success");
          dispatch(clearEntireCart());
          setCreatedOrder(result.data);
          setUseAnotherBank("no");
          closeModal();
          dispatch(setCartPaymentMethod("BANK"));
          refetchFnc && refetchFnc();
          if (typeof _cio !== "undefined") {
            _cio.track("web_order_add", payload);
          }
          if (typeof mixpanel !== "undefined") {
            mixpanel.track("web_order_add", payload);
          }
          if (typeof _cio !== "undefined") {
            _cio.track("web_order_paid", payload);
          }
          if (typeof mixpanel !== "undefined") {
            mixpanel.track("web_order_paid", payload);
          }
          matchOrderFnc({
            orderToLink: result.data.id,
            activeTransaction: transaction,
          });
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
    } else {
      showToast("Please add product to cart to proceed", "error", 5000);
      cb2 && cb2();
    }
  };

  const matchOrderFnc = async ({
    orderToLink,
    activeTransaction,
    cb,
  }: {
    orderToLink: number;
    activeTransaction: TransactionListType | null;
    cb?: () => void;
  }) => {
    if (orderToLink && activeTransaction) {
      const payload = {
        order_id: orderToLink,
        transaction_id: activeTransaction?.id,
        customer_id: activeTransaction?.customer?.id,
      };
      try {
        let result = await matchOrder(getObjWithValidValues(payload));
        if ("data" in result) {
          if (result.data.error) {
            showToast(result.data.error, "error");
          } else {
            setMatchedSuccessfully(true);
            setCreatedOrder(result.data.order);

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
    let total = getLastTotalWithoutCurrency();
    if (total !== undefined) {
      setAmountCollected(
        formatNumberWithCommas(parseFloat(String(total)?.replace(/,/g, "")))
      );
    }
  }, [cartSubTotal, taxTotal, selectMainDiscount]);

  return (
    <>
      <Modal
        closeModal={() => {
          closeModal();
          setAmountCollected("");
        }}
        openModal={openModal}
        closeOnOverlayClick={false}
      >
        <div className="pos_checkout_modal_wrap">
          <div className="close_btn">
            <p className="modal_title">Payment</p>
            <IconButton
              onClick={() => {
                closeModal();
                setAmountCollected("");
              }}
              type="button"
              className="close_btn_wrap"
            >
              <CloseSqIcon />
            </IconButton>
          </div>

          <div className="container_for_payment_types">
            <div className="total_payment_display">
              <p className="explain">Total Amount:</p>
              <p className="total_text">{getLastTotal()}</p>
            </div>

            <div className="payment_method_container">
              <h5>Payment Method</h5>
              <div className={`method_flex`}>
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
                    }`}
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
                    (getLastTotalWithoutCurrency() || 0) >
                    0 && (
                    <div className="calculate_change">
                      <p>
                        Change:
                        {formatPrice(
                          Number(removeFormattedNumerComma(amountCollected)) -
                            (getLastTotalWithoutCurrency() || 0)
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
                  setHasPayment(true);
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
                    setHasPayment(true);
                  }}
                  className={`view_order_btn`}
                  disabled={amountCollected || !loadOrder ? false : true}
                >
                  Confirm Bank Transfer
                </Button>
              )}
            <Button
              variant="outlined"
              onClick={() => {
                setHasPayment(false);
                submitOrder(false, () => {
                  closeModal();
                });
              }}
              className={`view_order_btn`}
            >
              {loadOrder ? (
                <CircularProgress size="1.5rem" sx={{ color: "#009444" }} />
              ) : (
                "Skip Payment"
              )}
            </Button>
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
        isLoading={loadOrder}
        total={
          hasPayment
            ? cartPaymentMethod === "CASH" ||
              cartPaymentMethod === "POS" ||
              (cartPaymentMethod === "BANK" && !storeData?.terminal) ||
              useAnotherBank === "yes"
              ? formatPrice(Number(removeFormattedNumerComma(amountCollected)))
              : getLastTotal()
            : formatPrice(0)
        }
        btnAction={(cb?: () => void) => {
          submitOrder(
            true,
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
        skipLoad={loadOrder}
        skipAction={() => {
          submitOrder(false, () => {
            closeModal();
            setOpenMatchModal(false);
          });
        }}
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
        isLoading={loadOrder || loadMatchOrder}
        createloading={loadOrder}
        matchLoading={loadMatchOrder}
        amountToMatch={Number(transactionToMatch?.amount || 0)}
        orderTotal={getLastTotalWithoutCurrency() || 0}
        btnAction={() => {
          if (createdOrder) {
            matchOrderFnc({
              orderToLink: createdOrder.id,
              activeTransaction: transactionToMatch,
            });
          } else {
            submitOrderToMatch(transactionToMatch);
          }
        }}
      />
      <SuccessfullyMatchOrderModal
        openModal={matchedSuccesfully}
        closeModal={() => {
          setMatchedSuccessfully(false);
        }}
        order_id={createdOrder?.id}
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
            if (createdOrder) {
              matchOrderFnc({
                orderToLink: createdOrder.id,
                activeTransaction: transactionToMatch,
              });
            } else {
              submitOrderToMatch(transactionToMatch);
            }
          } else {
            submitOrder(hasPayment, () => {
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

export default CheckoutModal;
