import { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import "./style.scss";
import CheckoutComponent from "./posComponents/CheckoutComponent";
import InputField from "components/forms/InputField";
import { BankIcon } from "assets/Icons/BankIcon";
import { TabContainer } from "./posComponents/TabContainer";
import { CreditCardIcon } from "assets/Icons/CreditCardIcon";
import { motion } from "framer-motion";
import Products from "./posComponents/Products";
import Collections from "./posComponents/Collections";
import SuccessModal from "./posComponents/widget/SuccessModal";
import CustomerSection from "./posComponents/CustomerSection";
import ValidatedInput from "components/forms/ValidatedInput";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "components/forms/SubmitButton";
import empty from "assets/images/emptycart.png";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { ChevronRight } from "assets/Icons/ChevronRight";
import { CheckSmall } from "assets/Icons/CheckSmall";
import { ExIcon } from "assets/Icons/ExIcon";
import { SelectTaxModal } from "./posComponents/widget/SelectTax";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  removeDiscount,
  selectActiveCartDiscount,
  selectCartDiscountAndCartTotalAmount,
  selectCartDiscountValue,
  selectPosCartItems,
  selectPosCartSubTotal,
  selectPosCartTotal,
  selectTotalTax,
  setActiveCartDiscount,
  setCartDiscountAndCartTotalAmount,
  setCartDiscount,
  selectCartPaymentMethod,
  setCartPaymentMethod,
  PosItemsType,
  bulkAddToPosCart,
  clearEntireCart,
} from "store/slice/PosSlice";
import { formatNumber, formatPrice, getCurrencyFnc, handleError } from "utils";
import { EditIcon } from "assets/Icons/EditIcon";
import { CircularProgress, IconButton } from "@mui/material";
import { useAddCouponToCartMutation } from "services";

const mainTabs = [
  { name: "Products", value: "products" },
  { name: "Collections", value: "collections" },
];
const paymentMethodList = [
  { name: "Bank Transfer", value: "BANK" },
  { name: "Card", value: "POS" },
  { name: "Cash", value: "CASH" },
];

export const PointOfSale = () => {
  const parentScrollRef = useRef<any>(null);
  // const parentScrollRef = useRef<HTMLDivElement | null>(null); // Initialize as null
  const posCartItems = useAppSelector(selectPosCartItems);
  const [paymentMethod, setPaymentMethod] = useState<string>();
  const [tab, setTab] = useState("products");
  const [showDetails, setShowDetails] = useState(false);
  const [showTax, setShowTax] = useState(false);
  const taxTotal = useAppSelector(selectTotalTax);
  const cartDiscountValue = useAppSelector(selectCartDiscountValue);
  const cartDiscountAndCartTotalAmount = useAppSelector(
    selectCartDiscountAndCartTotalAmount
  );
  const cartSubTotal = useAppSelector(selectPosCartSubTotal);
  const [addCouponCode, { isLoading }] = useAddCouponToCartMutation();
  const [couponApiState, setCouponApiState] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const activeCartDiscount = useAppSelector(selectActiveCartDiscount);
  const cartPaymentMethod = useAppSelector(selectCartPaymentMethod);
  const [inputCoupon, setInputCoupon] = useState(activeCartDiscount || "");
  const dispatch = useAppDispatch();
  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const addCouponToCartFunction = async () => {
    let payload = {
      code: inputCoupon,
      cart: {
        total: cartSubTotal,
        sub_total: cartSubTotal,
        items: posCartItems.map((item: any) => {
          return {
            id: item.itemId ? item.itemId : item.id,
            name: item.name,
            price: item.price,
            variant: item.variant,
            quantity: item.quantity,
            total: item.total,
          };
        }),
      },
    };
    try {
      let result = await addCouponCode(payload);
      if ("data" in result) {
        setCouponApiState("success");
        dispatch(
          setCartDiscount({
            discount_val: result.data.cart.discount_val,
            discount_type: result.data.cart.discount_type,
            discount: result.data.cart.discount,
            couponCode: inputCoupon,
          })
        );
        dispatch(setCartDiscountAndCartTotalAmount(result.data.cart.total));
        let cartItem = posCartItems;
        let resultItems = result.data.cart.items;
        const mergedArray: PosItemsType[] = [];
        resultItems.forEach((item2) => {
          const item1 = cartItem.find((item1) => {
            if (item2.variant) {
              return item1.variant === item2.variant;
            } else {
              return item1.id === item2.id;
            }
          });
          if (item1) {
            const mergedItem = {
              ...item2,
              ...item1,
              discount: item2.discount,
              discount_type: item2.discount_type,
              discount_val: item2.discount_val,
            };
            mergedArray.push(mergedItem);
          }
        });
        dispatch(bulkAddToPosCart(mergedArray));
      } else {
        handleError(result);
        setCouponApiState("error");
      }
    } catch (error) {
      setCouponApiState("error");
      handleError(error);
    }
  };

  useEffect(() => {
    if (activeCartDiscount) {
      addCouponToCartFunction();
    }
  }, [cartSubTotal]);

  return (
    <div className="pos_container">
      <div className="pos-home">
        <div className={"left-section"} ref={parentScrollRef}>
          <div className="name_tab_container">
            <div className="name_container">
              <h3 className="name">Point Of Sale</h3>
            </div>
            <div className="tabs_container ">
              <Box>
                <Tabs
                  value={tab}
                  onChange={handleChangeTab}
                  variant="scrollable"
                  scrollButtons={false}
                >
                  {mainTabs.map((item, i) => (
                    <Tab
                      key={i}
                      value={item.value}
                      label={item.name}
                      // className={` ${tab === item.value ? "active_header" : ""}`}
                    />
                  ))}
                </Tabs>
              </Box>
            </div>
          </div>
          <div className={`  product_and_collection_container `}>
            {tab === "products" && (
              <Products scrollableTarget={parentScrollRef} />
            )}
            {tab === "collections" && <Collections />}
          </div>

          {/* <TabContainer /> */}
        </div>

        {/* cart */}
        {!showDetails && (
          <div className="right-section">
            {posCartItems.length >= 1 ? (
              <div className="check_white">
                <div className="checkout">
                  <div className="checkout_title_box">
                    <h1>Cart</h1>
                    <Button
                      onClick={() => {
                        dispatch(clearEntireCart());
                      }}
                      variant="outlined"
                    >
                      Cancel Order
                    </Button>
                  </div>

                  <div className="checkout_div">
                    <div className="checkout_wrapper">
                      {posCartItems.map((ele) => (
                        <CheckoutComponent
                          product={ele}
                          key={ele.id}
                          id={ele.id}
                          name={ele.name}
                          price={ele.total}
                          quantity={ele.quantity}
                          options={ele.options}
                          amountLeft={ele.amountLeft}
                          stock={ele.stock}
                          image={ele.image}
                          // increaseItemQty={increaseItemQty}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="checkout-empty">
                <div className="wrapper">
                  <img src={empty} />
                  <h4>Cart is Empty</h4>
                  <p>
                    Items you add to cart will <br /> appear here.
                  </p>
                </div>
              </div>
            )}
            {posCartItems.length >= 1 && (
              <div className="coupon">
                <div className="coupon_wrapper">
                  <p className="c_header">Enter Coupon Code</p>
                  <InputField
                    placeholder="Coupon"
                    extraClass={`coupon_input  ${
                      couponApiState === "success" ? "success" : ""
                    } ${
                      couponApiState === "error" && activeCartDiscount
                        ? "error"
                        : ""
                    } `}
                    onChange={(e) => {
                      setInputCoupon(e.target.value);
                      if (!e.target.value) {
                        setCouponApiState("");
                      }
                    }}
                    value={inputCoupon}
                    suffix={
                      <Button
                        onClick={() => {
                          if (cartDiscountAndCartTotalAmount) {
                            setAppliedCoupon("");
                            dispatch(removeDiscount());
                            setInputCoupon("");
                          } else {
                            if (inputCoupon) {
                              dispatch(setActiveCartDiscount(inputCoupon));
                              addCouponToCartFunction();
                            }
                          }
                        }}
                        className="apply_txt text-#009444"
                      >
                        {isLoading ? (
                          <CircularProgress
                            size="1.5rem"
                            sx={{ color: "#009444" }}
                          />
                        ) : cartDiscountAndCartTotalAmount ? (
                          "Remove"
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    }
                  />
                  {couponApiState === "success" && activeCartDiscount && (
                    <p className="coupon_success ">
                      <CheckSmall /> Coupon applied successfully
                    </p>
                  )}
                  {couponApiState === "error" && activeCartDiscount && (
                    <p className="coupon_success coupon_error">
                      <ExIcon /> Invalid coupon
                    </p>
                  )}

                  <div className="coupon_details_wrap">
                    <div className="cart_total">
                      <p className="p_text">Total Product Value:</p>
                      <p className="coupon_amount">
                        {formatPrice(cartSubTotal)}
                      </p>
                    </div>
                    {cartDiscountAndCartTotalAmount && cartDiscountValue && (
                      <>
                        <div className="cart_total bold_border">
                          <p className="p_text">
                            Discount: <span>{activeCartDiscount}</span>
                          </p>
                          <p className="coupon_amount discount">
                            <span></span> {formatPrice(cartDiscountValue)}
                          </p>
                        </div>
                        <div className="cart_total sub_total">
                          <p className="p_text">Sub Total:</p>
                          <p className="coupon_amount">
                            {formatPrice(cartDiscountAndCartTotalAmount)}
                          </p>
                        </div>
                      </>
                    )}

                    <div className="cart_total extra_action">
                      <p className="action_name">Tax</p>
                      {taxTotal !== 0 ? (
                        <span className="result_collected">
                          {getCurrencyFnc()}
                          {cartDiscountAndCartTotalAmount
                            ? formatNumber(
                                Number(
                                  (
                                    (taxTotal / 100) *
                                    cartDiscountAndCartTotalAmount
                                  ).toFixed(2)
                                )
                              )
                            : formatNumber(
                                Number(
                                  ((taxTotal / 100) * cartSubTotal).toFixed(2)
                                )
                              )}

                          <IconButton
                            onClick={() => {
                              setShowTax(true);
                            }}
                            className="icon_btn"
                          >
                            <EditIcon stroke="#009444" />
                          </IconButton>
                        </span>
                      ) : (
                        <Button
                          className="coupon_amount vat"
                          onClick={() => {
                            setShowTax(true);
                          }}
                        >
                          Add Taxes
                          <ChevronRight />
                        </Button>
                      )}
                    </div>
                    <div className="cart_total cart_total_div">
                      <p className="total_text">Total Amount</p>
                      <p className="total_text">
                        {formatPrice(
                          cartDiscountAndCartTotalAmount
                            ? cartDiscountAndCartTotalAmount +
                                (taxTotal / 100) *
                                  cartDiscountAndCartTotalAmount
                            : cartSubTotal + (taxTotal / 100) * cartSubTotal
                        )}
                      </p>
                    </div>
                  </div>

                  <p className="pay_text">Payment Method</p>
                  <div className="payment_options ">
                    {paymentMethodList.map((item) => (
                      <Button
                        className={
                          cartPaymentMethod === item.value
                            ? "payment_btn active"
                            : "payment_btn large"
                        }
                        startIcon={
                          item.value === "BANK" ? (
                            <BankIcon
                              stroke={
                                cartPaymentMethod === item.value ? "#fff" : ""
                              }
                            />
                          ) : (
                            <CreditCardIcon
                              stroke={
                                cartPaymentMethod === item.value ? "#fff" : ""
                              }
                            />
                          )
                        }
                        onClick={() => {
                          dispatch(setCartPaymentMethod(item.value));
                        }}
                      >
                        {item.name}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="contained"
                    className="w-full pay-btn primary_styled_button"
                    // onClick={() =>{setOpenSuccesModal(true)}}
                    onClick={() => {
                      if (posCartItems.length) {
                        if (cartPaymentMethod) {
                          setShowDetails(true);
                        } else {
                          showToast(
                            "Select payment method to proceed",
                            "error"
                          );
                        }
                      } else {
                        showToast("Add products to cart to proceed", "error");
                      }
                    }}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* set tax */}
        {showTax && (
          <SelectTaxModal
            openModal={showTax}
            closeModal={() => {
              setShowTax(false);
            }}
          />
        )}

        {/* customer */}
        {showDetails && (
          <CustomerSection setShowDetails={setShowDetails} />
          // <div className="right-section ">
          //   <div className="check_white">
          //     <div className="checkout">
          //       <span className="header_row">
          //         <span className="details_header">Customers Details </span>
          //         <span className="light_header">(optional)</span>
          //       </span>
          //       <FormProvider {...methods}>
          //         <div className="checkout_div" style={{ marginTop: "25px" }}>
          //           <ValidatedInput
          //             name="Full Name"
          //             placeholder="Full Name"
          //             label="Full Name"
          //             type={"text"}
          //           />
          //           <ValidatedInput
          //             name="Phone Number"
          //             placeholder="Phone Number"
          //             label="Phone Number"
          //             type={"number"}
          //           />
          //           <ValidatedInput
          //             name="email"
          //             placeholder="example@gmail.com"
          //             label="Email Address (optional)"
          //             type={"email"}
          //           />
          //           <div className="button_section">
          //             <SubmitButton
          //               text="Save"
          //               isLoading={false}
          //               type={"submit"}
          //             />
          //           </div>
          //         </div>
          //       </FormProvider>
          //     </div>
          //   </div>

          //   <div className="coupon">
          //     <div className="coupon_wrapper">
          //       <p className="details_header">Summary</p>

          //       <div className="coupon_details_wrap">
          //         <div className="cart_total">
          //           <p className="p_text">Total Products</p>
          //           <p className="coupon_amount">23</p>
          //         </div>
          //         <div className="cart_total">
          //           <p className="p_text">Shipping</p>
          //           <p className="coupon_amount">N2000</p>
          //         </div>
          //         <div className="cart_total">
          //           <p className="p_text">Discount</p>
          //           <p className="coupon_amount">N30,000</p>
          //         </div>
          //         <div className="cart_total">
          //           <p className="p_text">Subtotal</p>
          //           <p className="coupon_amount">N32,000</p>
          //         </div>
          //         <div className="cart_total cart_total_div details_total">
          //           <p className="total_text">Total </p>
          //           <p className="total_text">N310,000</p>
          //         </div>
          //       </div>
          //       <Button
          //         variant="contained"
          //         className="w-full pay-btn "
          //         onClick={() => {
          //           setOpenSuccesModal(true);
          //         }}
          //       >
          //         Pay
          //       </Button>
          //     </div>
          //   </div>
          // </div>
        )}
      </div>
    </div>
  );
};
