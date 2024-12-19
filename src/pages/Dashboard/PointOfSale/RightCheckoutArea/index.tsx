import {
  PosItemsType,
  addTaxes,
  addTotalTax,
  bulkAddToPosCart,
  clearEntireCart,
  clearTaxes,
  removeDiscount,
  selectActiveCartDiscount,
  selectCartDiscountAndCartTotalAmount,
  selectCartDiscountValue,
  selectCouponCode,
  selectCustomerDetails,
  selectDiscount,
  selectPosCartItems,
  selectPosCartSubTotal,
  selectTaxList,
  selectTotalTax,
  setActiveCartDiscount,
  setCartDiscount,
  setCartDiscountAndCartTotalAmount,
} from "store/slice/PosSlice";
import "./style.scss";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import EmptyResponse from "components/EmptyResponse";
import emptycart from "assets/images/emptycart.png";
import { Avatar, Button, IconButton } from "@mui/material";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { useEffect, useState } from "react";
import SelectCustomer from "../widgets/SelectCustomer/SelectCustomer";
import { PlusCircleIcon } from "assets/Icons/PlusCircleIcon";
import { TrashIcon } from "assets/Icons/TrashIcon";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { AddDiscountOrCouponModal } from "./AddDiscountOrCouponModal";
import {
  useAddCouponToCartMutation,
  useGetStoreInformationQuery,
  useGetTaxQuery,
} from "services";
import { formatPrice, handleError } from "utils";
import { SelectTaxModal } from "./SelectTax";
import { TaxType } from "services/api.types";
import CartComponent from "./CartComponent";
import CheckoutModal from "../widgets/CheckoutModal/CheckoutModal";
import RequestCustomerModal from "../widgets/RequestCustomerModal";
import CompletePaymentModal from "../widgets/CompletePaymentModal/CompletePaymentModal";
import { OrderType } from "Models/order";
import RequestForAnotherPaymentModal from "../widgets/RequestForAnotherPaymentModal";
import { GeneralModal } from "pages/Dashboard/ConnectedApps/widgets/Modals/GeneralModal";
import { InfoCircleXLLIcon } from "assets/Icons/InfoCircleXLLIcon";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import { GrowthModal } from "components/GrowthModal";
const RightCheckoutArea = ({
  refetchFnc,
  taxDataList,
}: {
  refetchFnc?: any;
  taxDataList?: TaxType[];
}) => {
  const posCartItems = useAppSelector(selectPosCartItems);
  const posCustomer = useAppSelector(selectCustomerDetails);
  const [openSelectCustomerModal, setOpenSelectCustomerModal] = useState(false);
  const cartDiscountValue = useAppSelector(selectCartDiscountValue);
  const posCouponCode = useAppSelector(selectCouponCode);
  const [openDiscountModal, setOpenDiscountModal] = useState(false);
  const [openTaxModal, setOpenTaxModal] = useState(false);
  const dispatch = useAppDispatch();
  const [addCouponCode, { isLoading }] = useAddCouponToCartMutation();
  const activeCartDiscount = useAppSelector(selectActiveCartDiscount);
  const taxesList = useAppSelector(selectTaxList);
  const selectMainDiscount = useAppSelector(selectDiscount);
  const [createdOrder, setCreatedOrder] = useState<OrderType | null>(null);
  const [openClearCartModal, setOpenClearCartModal] = useState(false);
  const { data: storeData } = useGetStoreInformationQuery();
  const [openRequestCustomerModal, setOpenRequestCustomerModal] =
    useState(false);
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const [openGrowthModal, setOpenGrowthModal] = useState(false);
  const cartDiscountAndCartTotalAmount = useAppSelector(
    selectCartDiscountAndCartTotalAmount
  );
  const taxTotal = useAppSelector(selectTotalTax);
  const cartSubTotal = useAppSelector(selectPosCartSubTotal);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);

  const addCouponToCartFunction = async (
    inputCoupon: string,
    cb?: () => void
  ) => {
    dispatch(setActiveCartDiscount(inputCoupon));
    let payload = {
      code: inputCoupon,
      cart: {
        total: cartSubTotal,
        sub_total: cartSubTotal,
        items: posCartItems.map((item) => {
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
        cb && cb();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };
  const [openAskRepayModal, setOpenAskRepayModal] = useState(false);
  const [openRepayModal, setOpenRepayModal] = useState(false);
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

  const getLastTaxTotal = () => {
    const taxAmount = ((taxTotal || 0) / 100) * (getLastTotalWithoutTax() || 0);

    return formatPrice(taxAmount);
  };

  useEffect(() => {
    if (taxDataList && taxDataList?.length) {
      let filteredTaxes = taxDataList?.filter((item) => item?.flags?.pos_apply);
      dispatch(addTaxes(filteredTaxes));
      const getTotalTax = filteredTaxes.reduce(
        (total: number, item: TaxType) => {
          return total + item.percent;
        },
        0
      );
      dispatch(addTotalTax(getTotalTax));
    }
  }, [taxDataList]);

  useEffect(() => {
    if (activeCartDiscount) {
      addCouponToCartFunction(activeCartDiscount);
    }
  }, [cartSubTotal]);

  return (
    <>
      <div className="pd_right_checkout_area">
        {posCartItems.length ? (
          <div className="checkout_full_state">
            <div className="clear_cart_side">
              <p>Cart</p>
              <Button
                onClick={() => {
                  setOpenClearCartModal(true);
                }}
              >
                Clear Cart
              </Button>
            </div>
            <div
              onClick={() => {
                setOpenSelectCustomerModal(true);
              }}
              className="customer_side"
            >
              <div className="left_avatar">
                <Avatar
                  alt="profile"
                  className="avatar"
                  sx={{
                    width: {
                      xs: "32px",
                      md: "40px",
                    },
                    height: { xs: "32px", md: "40px" },
                  }}
                ></Avatar>
                <div className="customer_name_box">
                  {posCustomer ? (
                    <div className="name_flex">
                      <p className="name">{posCustomer?.name}</p>
                      <p className="email">
                        {posCustomer?.phone} | {posCustomer?.email}
                      </p>
                    </div>
                  ) : (
                    <p>Add Customer</p>
                  )}
                </div>
              </div>
              <ChevronRight />
            </div>
            <div className="cart_item_discount_tax_total">
              <div className="top_part">
                <div className="cart_item_list">
                  {posCartItems.map((ele: any) => (
                    <CartComponent
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
                <div className="discount_section">
                  <div className="add_discount_section">
                    <div
                      onClick={() => {
                        if (cartDiscountValue || selectMainDiscount.value) {
                        } else {
                          setOpenDiscountModal(true);
                        }
                      }}
                      className="green_box"
                    >
                      <div className="left_green">
                        {cartDiscountValue || selectMainDiscount.value ? (
                          <p>Discount</p>
                        ) : (
                          <>
                            {" "}
                            <PlusCircleIcon stroke="#009444" />
                            <p>Add Discount</p>
                          </>
                        )}
                      </div>
                      <div className="right_green">
                        {cartDiscountValue || selectMainDiscount.value ? (
                          <p>
                            -{" "}
                            {cartDiscountValue
                              ? formatPrice(cartDiscountValue)
                              : selectMainDiscount && selectMainDiscount?.value
                              ? selectMainDiscount.type === "fixed"
                                ? formatPrice(selectMainDiscount.value)
                                : formatPrice(
                                    (selectMainDiscount.value / 100) *
                                      cartSubTotal
                                  )
                              : ""}
                          </p>
                        ) : (
                          <ChevronRight />
                        )}
                      </div>
                    </div>
                    {cartDiscountValue ||
                      (selectMainDiscount.value && (
                        <IconButton
                          onClick={() => {
                            dispatch(removeDiscount());
                          }}
                          className="icon_button_container"
                        >
                          <TrashIcon />
                        </IconButton>
                      ))}
                  </div>
                  {posCouponCode && (
                    <div className="display_code_flex">
                      <div className="display_code">
                        <p>{posCouponCode}</p>
                        <IconButton
                          onClick={() => {
                            dispatch(removeDiscount());
                          }}
                        >
                          <CloseSqIcon />
                        </IconButton>
                      </div>
                    </div>
                  )}
                </div>
                <div className="discount_section">
                  <div className="add_discount_section">
                    <div
                      onClick={() => {
                        setOpenTaxModal(true);
                      }}
                      className="green_box"
                    >
                      <div className="left_green">
                        {taxTotal ? (
                          <p>Tax</p>
                        ) : (
                          <>
                            <PlusCircleIcon stroke="#009444" />
                            <p>Add Tax</p>
                          </>
                        )}
                      </div>
                      <div className="right_green">
                        {taxTotal ? (
                          <p>{getLastTaxTotal()}</p>
                        ) : (
                          <ChevronRight />
                        )}
                      </div>
                    </div>
                    {taxTotal !== 0 && (
                      <IconButton
                        onClick={() => {
                          dispatch(clearTaxes());
                        }}
                        className="icon_button_container"
                      >
                        <TrashIcon />
                      </IconButton>
                    )}
                  </div>
                  {taxesList && taxesList.length ? (
                    <div className="display_code_flex">
                      {taxesList.map((item: any, i: number) => (
                        <div key={i} className="display_code">
                          <p>{item.name}</p>
                          <IconButton
                            onClick={() => {
                              let remainingList = taxesList.filter(
                                (el) => el.id !== item.id
                              );
                              const getTotalTax = remainingList.reduce(
                                (total: number, item: TaxType) => {
                                  return total + item.percent;
                                },
                                0
                              );
                              dispatch(addTotalTax(getTotalTax));
                              dispatch(addTaxes(remainingList));
                            }}
                          >
                            <CloseSqIcon />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="pos_checkout_section">
                <div className="total_box">
                  <p className="total_text">Total</p>
                  <p className="total_amount">{getLastTotal()}</p>
                </div>
                <Button
                  onClick={() => {
                    if (
                      isSubscriptionExpired ||
                      isSubscriptionType !== "growth"
                    ) {
                      setOpenGrowthModal(true);
                    } else {
                      if (posCustomer) {
                        setOpenCheckoutModal(true);
                      } else {
                        setOpenRequestCustomerModal(true);
                      }
                    }
                  }}
                  className="checkout_btn"
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="checkout_empty_state">
            <EmptyResponse
              image={emptycart}
              message="Cart is empty"
              extraText="Items you add to cart will appear here."
            />
          </div>
        )}
      </div>
      <SelectCustomer
        openModal={openSelectCustomerModal}
        closeModal={() => {
          setOpenSelectCustomerModal(false);
        }}
      />
      <RequestCustomerModal
        openModal={openRequestCustomerModal}
        closeModal={() => {
          setOpenRequestCustomerModal(false);
        }}
        btnAction1={() => {
          setOpenSelectCustomerModal(true);
        }}
        btnAction2={() => {
          setOpenCheckoutModal(true);
        }}
      />
      <AddDiscountOrCouponModal
        openModal={openDiscountModal}
        isLoading={isLoading}
        actionFnc={(val: string, cb?: () => void) => {
          addCouponToCartFunction(val, cb);
        }}
        closeModal={() => {
          setOpenDiscountModal(false);
        }}
      />
      <SelectTaxModal
        openModal={openTaxModal}
        closeModal={() => {
          setOpenTaxModal(false);
        }}
      />
      <CheckoutModal
        openModal={openCheckoutModal}
        setOpenAskRepayModal={setOpenAskRepayModal}
        refetchFnc={refetchFnc}
        createdOrder={createdOrder}
        storeData={storeData?.store}
        setCreatedOrder={setCreatedOrder}
        closeModal={() => {
          setOpenCheckoutModal(false);
        }}
      />
      <CompletePaymentModal
        openModal={openRepayModal}
        setOpenAskRepayModal={setOpenAskRepayModal}
        refetchFnc={refetchFnc}
        createdOrder={createdOrder}
        storeData={storeData?.store}
        setCreatedOrder={setCreatedOrder}
        closeModal={() => {
          setOpenRepayModal(false);
        }}
      />
      <RequestForAnotherPaymentModal
        openModal={openAskRepayModal}
        setOpenRepayModal={setOpenRepayModal}
        createdOrder={createdOrder}
        setCreatedOrder={setCreatedOrder}
        closeModal={() => {
          setOpenAskRepayModal(false);
        }}
      />
      <GeneralModal
        openModal={openClearCartModal}
        closeModal={() => {
          setOpenClearCartModal(false);
        }}
        image={<InfoCircleXLLIcon />}
        title="Confirm to Clear Cart"
        description="Are you sure you want to clear this cart? All Items in this cart will be removed."
        btnText="Yes, clear cart"
        btnAction={() => {
          dispatch(clearEntireCart());
          dispatch(addTaxes([]));
          dispatch(addTotalTax(0));
          if (taxDataList && taxDataList?.length) {
            let filteredTaxes = taxDataList?.filter(
              (item) => item?.flags?.pos_apply
            );
            dispatch(addTaxes(filteredTaxes));
            const getTotalTax = filteredTaxes.reduce(
              (total: number, item: TaxType) => {
                return total + item.percent;
              },
              0
            );
            dispatch(addTotalTax(getTotalTax));
          }
          setOpenClearCartModal(false);
        }}
        isCancel={true}
        reduceMargin
        btnError
      />
      <GrowthModal
        openModal={openGrowthModal}
        closeModal={() => {
          setOpenGrowthModal(false);
        }}
        title={`Sell faster with Point of Sale on the Growth Plan`}
        subtitle={`Process sales in your physical store faster with Point of Sale software.`}
        growthFeatures={[
          "Automatically record all physical sales at the point of checkout.",
          "Connect your website & store inventory to Bumpa with Point of Sale.",
          "Track products sold with barcode generator & scanner software.",
          "Issue unlimited invoices & receipts.",
        ]}
        buttonText={`Upgrade to Growth`}
        eventName="point-of-sale"
      />
    </>
  );
};

export default RightCheckoutArea;
