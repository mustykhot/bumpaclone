import { useState, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "components/forms/SubmitButton";
import Button from "@mui/material/Button";
import ValidatedInput from "components/forms/ValidatedInput";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import SelectCustomer from "./widget/SelectCustomer";
import ConfirmPaymentModal from "./widget/ConfirmPaymentModal";
import PaymentFailed from "./widget/PaymentFailed";
import { Divider, IconButton } from "@mui/material";
import {
  PosItemsType,
  addCustomerDetails,
  clearEntireCart,
  selectCartDiscount,
  selectCartDiscountAndCartTotalAmount,
  selectCartDiscountType,
  selectCartDiscountValue,
  selectCartPaymentMethod,
  selectCustomerDetails,
  selectPosCartItems,
  selectPosCartSubTotal,
  selectPosCartTotal,
  selectTaxList,
  selectTotalTax,
} from "store/slice/PosSlice";
import CustomerDetails from "./widget/CustomerDetails";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { getObjWithValidValues } from "utils/constants/general";
import { useCreateCustomerMutation, useCreateOrdersMutation } from "services";
import { formatNumber, formatPrice, getCurrencyFnc, handleError } from "utils";
import { ResetPassword } from "pages/Auth/ResetPassword";
import moment from "moment";
import SuccessModal from "./widget/SuccessModal";
import { OrderType } from "Models/order";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import { selectUserLocation } from "store/slice/AuthSlice";

export type CustomerDetailsFields = {
  name: string;
  phone: string;
  email: string;
};

const CustomerSection = ({
  setShowDetails,
}: {
  setShowDetails: (val: boolean) => void;
}) => {
  const [openSuccesModal, setOpenSuccesModal] = useState(false);
  const [openFailureModal, setOpenFailureModal] = useState(false);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [confirmPayment, setConfirmPayment] = useState(false);
  const cartCustomer = useAppSelector(selectCustomerDetails);
  const cartItems = useAppSelector(selectPosCartItems);
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();
  const taxTotal = useAppSelector(selectTotalTax);
  const cartTotal = useAppSelector(selectPosCartTotal);
  const cartDiscountValue = useAppSelector(selectCartDiscountValue);
  const cartDiscountType = useAppSelector(selectCartDiscountType);
  const cartDiscount = useAppSelector(selectCartDiscount);
  const [createOrder, { isLoading: loadOrder }] = useCreateOrdersMutation();
  const cartDiscountAndCarTTotalValue = useAppSelector(
    selectCartDiscountAndCartTotalAmount
  );
  const paymentMethod = useAppSelector(selectCartPaymentMethod);
  const taxesList = useAppSelector(selectTaxList);
  const [createdOrder, setCreatedOrder] = useState<OrderType | null>(null);
  const cartSubTotal = useAppSelector(selectPosCartSubTotal);
  const dispatch = useAppDispatch();
  const userLocation = useAppSelector(selectUserLocation);
  const methods = useForm<CustomerDetailsFields>({
    mode: "all",
  });
  const {
    formState: { isValid },
    handleSubmit,
    reset,
  } = methods;

  const onSubmit: SubmitHandler<CustomerDetailsFields> = async (data) => {
    try {
      let result = await createCustomer(getObjWithValidValues(data));
      if ("data" in result) {
        showToast("Created successfully", "success");
        dispatch(addCustomerDetails(result.data.customer));
        if (typeof _cio !== "undefined") {
          _cio.track("web_customer_add", data);
        }
        reset();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };
  function getTotalItemsInCart(cart: PosItemsType[]) {
    let totalItems = 0;
    for (const item of cart) {
      totalItems += item.quantity;
    }
    return totalItems;
  }

  const submitOrder = async (cb: () => void) => {
    const payload = {
      customer_id: cartCustomer ? cartCustomer?.id : null,
      channel: "WEB",
      origin: "POS",
      tax: taxTotal,
      taxes: taxesList,
      discount: cartDiscount,
      discount_type: cartDiscountType,
      discount_val: cartDiscountValue,
      location_id: userLocation?.id,
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
      sub_total: cartDiscountAndCarTTotalValue
        ? cartDiscountAndCarTTotalValue
        : cartSubTotal,
      grand_total: cartDiscountAndCarTTotalValue
        ? cartDiscountAndCarTTotalValue +
          (taxTotal / 100) * cartDiscountAndCarTTotalValue
        : cartSubTotal + (taxTotal / 100) * cartSubTotal,
      total: cartDiscountAndCarTTotalValue
        ? cartDiscountAndCarTTotalValue +
          (taxTotal / 100) * cartDiscountAndCarTTotalValue
        : cartSubTotal + (taxTotal / 100) * cartSubTotal,
      order_date: moment(new Date()).format("DD/MM/YYYY"),
      payment_amount: cartDiscountAndCarTTotalValue
        ? cartDiscountAndCarTTotalValue +
          (taxTotal / 100) * cartDiscountAndCarTTotalValue
        : cartSubTotal + (taxTotal / 100) * cartSubTotal,
      payment_method: paymentMethod,
      hasPayment: true,
    };
    if (payload.items && payload.items.length) {
      try {
        let result = await createOrder(getObjWithValidValues(payload));
        if ("data" in result) {
          showToast("Created successfully", "success");
          dispatch(clearEntireCart());
          setOpenSuccesModal(true);
          setCreatedOrder(result.data);
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
        } else {
          setOpenFailureModal(true);
        }
        cb();
      } catch (error) {
        setOpenFailureModal(true);
        cb();
      }
    } else {
      showToast("Please add product to cart to proceed", "error", 5000);
    }
  };
  return (
    <>
      <div className="right-section customer-section">
        <div className="check_white">
          <div className="checkout">
            {cartCustomer ? (
              <CustomerDetails />
            ) : (
              <>
                <div className="header_row">
                  <IconButton
                    type="button"
                    onClick={() => {
                      setShowDetails(false);
                    }}
                    className="icon_button_container pad "
                  >
                    <BackArrowIcon />
                  </IconButton>
                  <span className="details_header">Customers Details </span>
                  <span className="light_header">(optional)</span>
                </div>

                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="checkout_div" style={{ marginTop: "25px" }}>
                      <div className="cover_customer_select">
                        <div
                          onClick={() => {
                            setOpenCustomer(true);
                          }}
                          className="pick_cutomer"
                        >
                          <label>Add Existing Customer</label>
                          <div>
                            <p>Select Customer</p>
                            <ChevronDownIcon />
                          </div>
                        </div>
                      </div>
                      <Divider className="pos_divider">
                        Or add as a new customer
                      </Divider>

                      <ValidatedInput
                        name="name"
                        placeholder="Full Name"
                        label="Full Name"
                        type={"text"}
                      />
                      <ValidatedInput
                        name="phone"
                        placeholder="Phone Number"
                        label="Phone Number"
                        type={"number"}
                        required={false}
                      />
                      <ValidatedInput
                        required={false}
                        name="email"
                        placeholder="example@gmail.com"
                        label="Email Address"
                        type={"email"}
                      />
                      <div className="button_section">
                        <SubmitButton
                          disabled={!isValid}
                          text="Save"
                          isLoading={isLoading}
                          type={"submit"}
                        />
                      </div>
                    </div>
                  </form>
                </FormProvider>
              </>
            )}
          </div>
        </div>

        <div className="coupon summary">
          <div className="coupon_wrapper">
            <p className="details_header">Summary</p>

            <div className="coupon_details_wrap">
              <div className="cart_total">
                <p className="p_text">Total Products</p>
                <p className="coupon_amount">
                  {getTotalItemsInCart(cartItems)}
                </p>
              </div>
              {cartDiscountValue && (
                <div className="cart_total">
                  <p className="p_text">Discount</p>
                  <p className="coupon_amount">
                    {formatPrice(cartDiscountValue)}
                  </p>
                </div>
              )}
              {taxTotal === 0 && !cartDiscountValue ? (
                ""
              ) : (
                <div className="cart_total">
                  <p className="p_text">Subtotal</p>
                  <p className="coupon_amount">
                    {formatPrice(cartDiscountAndCarTTotalValue || cartSubTotal)}
                  </p>
                </div>
              )}

              {taxTotal !== 0 && (
                <div className="cart_total">
                  <p className="p_text">Tax</p>
                  <p className="coupon_amount">
                    {getCurrencyFnc()}
                    {cartDiscountAndCarTTotalValue
                      ? formatNumber(
                          Number(
                            (
                              (taxTotal / 100) *
                              cartDiscountAndCarTTotalValue
                            ).toFixed(2)
                          )
                        )
                      : formatNumber(
                          Number(((taxTotal / 100) * cartSubTotal).toFixed(2))
                        )}
                  </p>
                </div>
              )}
              <div className="cart_total cart_total_div details_total">
                <p className="total_text">Total </p>
                <p className="total_text">
                  {formatPrice(
                    cartDiscountAndCarTTotalValue
                      ? cartDiscountAndCarTTotalValue +
                          (taxTotal / 100) * cartDiscountAndCarTTotalValue
                      : cartSubTotal + (taxTotal / 100) * cartSubTotal
                  )}
                </p>
              </div>
            </div>
            <Button
              variant="contained"
              className="w-full pay-btn primary_styled_button"
              onClick={() => {
                setConfirmPayment(true);
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      <SelectCustomer
        openModal={openCustomer}
        closeModal={() => {
          setOpenCustomer(false);
        }}
      />

      <ConfirmPaymentModal
        openModal={confirmPayment}
        isLoading={loadOrder}
        total={formatPrice(
          cartDiscountAndCarTTotalValue
            ? cartDiscountAndCarTTotalValue +
                (taxTotal / 100) * cartDiscountAndCarTTotalValue
            : cartSubTotal + (taxTotal / 100) * cartSubTotal
        )}
        btnAction={() => {
          submitOrder(() => {
            setConfirmPayment(false);
          });
        }}
        closeModal={() => {
          setConfirmPayment(false);
          setShowDetails(false);
        }}
      />
      <PaymentFailed
        openModal={openFailureModal}
        btnAction={() => {
          setOpenFailureModal(false);
          setConfirmPayment(true);
          submitOrder(() => {
            setConfirmPayment(false);
          });
        }}
        closeModal={() => {
          setOpenFailureModal(false);
          setShowDetails(false);
        }}
      />
      <SuccessModal
        openModal={openSuccesModal}
        setShowDetails={setShowDetails}
        createdOrder={createdOrder}
        closeModal={() => {
          setOpenSuccesModal(false);
          setShowDetails(false);
        }}
      />
    </>
  );
};

export default CustomerSection;
