import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import moment from "moment";
import { CheckCircleLargeIcon } from "assets/Icons/CheckCircleLarge";
import { LargeWarningIcon } from "assets/Icons/LargeWarningIcon";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { HelpCircleIcon } from "assets/Icons/Sidebar/HelpCircleIcon";
import SelectField from "components/forms/SelectField";
import ErrorMsg from "components/ErrorMsg";
import Loader from "components/Loader";
import TextEditor from "components/forms/TextEditor";
import ValidatedInput from "components/forms/ValidatedInput";
import MessageModal from "components/Modal/MessageModal";
import { QuickAddProductModal } from "../widgets/addProduct/QuickAddProduct";
import { RecordPaymentModal } from "../widgets/RecordPayment/RecordPayment";
import SuccesfulOrderEditModal from "./EditOrderModals/SuccesfulOrderEditModal";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import { ProductSection } from "./productSection";
import { SelectCustomerModal } from "../widgets/customer/SelectCustomer";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  useEditOrdersMutation,
  useGetCustomersQuery,
  useGetSingleOrdersQuery,
  useRefundOrderMutation,
} from "services";
import {
  addToCart,
  clearCart,
  initialAddToCart,
  selectProductItems,
} from "store/slice/OrderSlice";
import { ShippingType, TaxType } from "services/api.types";
import { SALESCHANNEL } from "utils/constants/general";
import { formatPrice, handleError } from "utils";
import { useCopyToClipboardHook } from "hooks/useCopyToClipboardHook";
import { OrderType } from "Models/order";
import "./style.scss";

export type CreateOrderFeilds = {
  customer: { name: string; id: string };
  origin: string;
  channel: string;
  date: string;
  shipping_price: number;
  shipping_option?: ShippingType;
  items: any;
  total: number;
  sub_total: number;
  discount_val?: number;
  discount?: number;
  discount_val2?: number;
  discount_type2?: string;
  discount_type?: string;
  grand_total: number;
  order_date: any;
  payment_amount?: number;
  payment_method?: string;
  hasPayment: string;
  tax?: number;
  taxes?: TaxType[];
  taxPercent?: number;
  note?: string;
};

export const EditOrder = ({ discardFnc }: { discardFnc?: () => void }) => {
  const { id } = useParams();
  const [openCustomer, setOpenCustomer] = useState(false);
  const [editOrder, { isLoading }] = useEditOrdersMutation();
  const location = useLocation();
  const prevOrderDetails = location?.state?.orderDetails;
  const addedProducts = useAppSelector(selectProductItems);
  const [searchCustomers, setSearchCustomers] = useState("");
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [payStatus, setPayStatus] = useState("");
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openRefundModal, setOpenRefundModal] = useState(false);
  const [openRefundLaterModal, setOpenRefundLaterModal] = useState(false);
  const [editedOrder, setEditedOrder] = useState<OrderType | null>(null);
  const [refundOrder, { isLoading: refundLoad }] = useRefundOrderMutation();
  const dispatch = useAppDispatch();
  const {
    data: orderData,
    isLoading: orderLoad,
    isError,
  } = useGetSingleOrdersQuery(id);
  const { isCopied, handleCopyClick } = useCopyToClipboardHook(
    orderData ? orderData.order.order_page : ""
  );

  const { data } = useGetCustomersQuery({
    limit: 200,
    page: 1,
    search: searchCustomers,
  });

  const methods = useForm<CreateOrderFeilds>({
    mode: "all",
  });
  const {
    formState: { isValid },
    handleSubmit,
    watch,
    setValue,
    reset,
  } = methods;
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<CreateOrderFeilds> = async (data) => {
    let taxAmount = (
      ((data.taxPercent || 0) / 100) *
      (data.total - (data.discount || 0))
    ).toFixed(2);

    const payload = {
      customer_id: data.customer.id,
      channel: "WEB",
      origin: data.origin,
      shipping_price: data.shipping_price,
      shipping_option: data.shipping_option,
      tax: taxAmount,
      taxes: data.taxes,
      discount: data.discount_val,
      discount_type: data.discount_type,
      discount_val: data.discount,
      note: data.note,
      items: addedProducts.map((item) => {
        return {
          id: item.itemId ? item.itemId : item.id,
          variant: item.variant ? item.variant : null,
          url: item.url,
          name: item.name,
          unit: item.unit,
          price: item.price,
          total: item.price,
          discount: item.discount,
          description: item.description,
          thumbnail_url: item.thumbnail_url,
          quantity: item.quantity,
        };
      }),
      sub_total: data.total,
      grand_total:
        data.total -
        (data.discount || 0) +
        Number(data.shipping_price || 0) +
        Number(taxAmount || 0),
      total:
        data.total -
        (data.discount || 0) +
        Number(data.shipping_price || 0) +
        Number(taxAmount || 0),
      order_date: moment(data.order_date).format("DD/MM/YYYY"),
      payment_amount:
        data.hasPayment === "PAID"
          ? data.total -
            (data.discount || 0) +
            Number(data.shipping_price || 0) +
            Number(taxAmount || 0)
          : data.payment_amount
          ? data.payment_amount
          : "",
      payment_method: data.payment_method,
      hasPayment:
        data.hasPayment === "PAID" || data.hasPayment === "PARTIALLY_PAID"
          ? true
          : false,
    };

    if (payload.items && payload.items.length) {
      try {
        let result = await editOrder({ body: payload, id });
        if ("data" in result) {
          setEditedOrder(result?.data?.order);
          showToast("Saved Successfuly", "success");
          if (result?.data?.order?.payment_status === "UNPAID") {
            dispatch(clearCart());
            navigate(`/dashboard/orders/${result.data.order.id}`);
          } else if (result?.data?.order?.payment_status === "PARTIALLY_PAID") {
            if (result?.data?.order?.should_refund) {
              setOpenSuccessModal(true);
              setPayStatus("refund");
            } else if (
              Number(prevOrderDetails?.amount_paid) <
              Number(result?.data?.order?.total)
            ) {
              setOpenSuccessModal(true);
              setPayStatus("record");
            } else {
              dispatch(clearCart());
              navigate(`/dashboard/orders/${result.data.order.id}`);
            }
          } else if (result?.data?.order?.payment_status === "PAID") {
            if (result?.data?.order?.should_refund) {
              setOpenSuccessModal(true);
              setPayStatus("refund");
            } else if (
              Number(prevOrderDetails?.total) <
              Number(result?.data?.order?.total)
            ) {
              setOpenSuccessModal(true);
              setPayStatus("record");
            } else {
              dispatch(clearCart());
              navigate(`/dashboard/orders/${result.data.order.id}`);
            }
          }
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    } else {
      showToast("Please Select Product to proceed", "error", 5000);
    }
  };

  const refundFnc = async () => {
    const payload = {
      amount: Number(editedOrder?.amount_paid) - Number(editedOrder?.total),
      transaction_date: moment(new Date()).format("DD/MM/YYYY"),
    };
    try {
      let result = await refundOrder({
        id: `${editedOrder?.id}`,
        body: payload,
      });
      if ("data" in result) {
        if (result.data.error) {
          showToast(result.data.error, "error");
        } else {
          showToast("Refund recorded successfuly", "success");
          setOpenRefundModal(false);
          dispatch(clearCart());
          navigate(`/dashboard/orders/${orderData?.order?.id}`);
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (orderData?.order) {
      const { order } = orderData;
      setValue("customer", {
        name: order.customer?.name || "",
        id: order.customer ? `${order.customer.id}` : "",
      });
      setValue("origin", order.origin);
      setValue("order_date", moment(order.order_date).format("YYYY-MM-DD"));
      const prepItems = order.items.map((item: any) => {
        return {
          id: item.variant ? item.variant : item.id,
          variant: item.variant ? item.variant : null,
          itemId: item.variant ? item.id : null,
          url: item.url,
          name: item.name,
          unit: item.unit,
          price: item.price,
          total: item.price,
          discount: item.discount,
          description: item.description,
          thumbnail_url: item.thumbnail_url,
          quantity: item.quantity,
          stock: item.available_quantity,
        };
      });

      const getTotalTaxPercent = order?.taxes?.reduce(
        (total: number, item: TaxType) => {
          return total + item.percent;
        },
        0
      );
      setValue("taxPercent", getTotalTaxPercent);
      dispatch(initialAddToCart(prepItems));
      setValue("tax", Number(order.tax));
      setValue("taxes", order.taxes);
      setValue("shipping_price", Number(order.shipping_price));
      setValue("shipping_option", order.shipping_option);
      setValue("discount_type", order.discount_type);
      setValue("discount_type2", order.discount_type);
      setValue("discount_val2", Number(order.discount));
      setValue("discount", Number(order.discount_val));
      setValue("discount_val", Number(order.discount));
      setValue("note", order.note);
      setValue("hasPayment", order.payment_status);
      setValue("payment_amount", Number(order.amount_paid));
      let orderMethod =
        order &&
        order.transactions &&
        order.transactions.length &&
        order.transactions[0]
          ? order.transactions[0]?.method
          : "";
      setValue("payment_method", orderMethod);
    }
  }, [orderData]);
  useEffect(() => {
    const cleanupFunction = () => {
      dispatch(clearCart());
    };
    const unlisten = () => {
      cleanupFunction();
    };
    return () => {
      cleanupFunction();
      unlisten();
    };
  }, [navigate]);

  if (isError) {
    return <ErrorMsg error={"Something went wrong"} />;
  }
  if (orderLoad) {
    return <Loader />;
  }

  return (
    <>
      {isLoading && <Loader />}
      <div className="pd_create_order">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form_section">
              <ModalHeader
                text="Edit Order"
                closeModal={() => {
                  if (discardFnc) {
                    discardFnc();
                  } else {
                    dispatch(clearCart());
                    navigate(-1);
                  }
                }}
              />

              <div className="form_field_container">
                <div className="order_details_container">
                  <FormSectionHeader title="Order Details" />
                  <div className="px-[16px]">
                    <div className="cover_customer_select">
                      <div
                        onClick={() => {
                          setOpenCustomer(true);
                        }}
                        className="pick_cutomer"
                      >
                        <label>Select Customer</label>
                        <div>
                          <p>
                            {watch("customer")
                              ? watch("customer").name
                              : "Select customers"}
                          </p>
                          <ChevronDownIcon />
                        </div>
                      </div>
                    </div>

                    <div className="form-group-flex">
                      {orderData?.order?.origin !== "website" && (
                        <SelectField
                          name="origin"
                          selectOption={SALESCHANNEL}
                          label="Sales Channel"
                        />
                      )}
                      <ValidatedInput
                        name="order_date"
                        label="Order Date"
                        type={"date"}
                      />
                    </div>
                  </div>
                </div>
                <ProductSection
                  isEdit={true}
                  setOpenCreateProductModal={setOpenProductModal}
                />

                <div className="pt-[8px] px-[16px] pb-[16px] ">
                  <TextEditor
                    label="Additional Notes"
                    required={false}
                    name="note"
                  />{" "}
                </div>
              </div>
            </div>
            <div className="submit_form_section">
              <div className="button_container2">
                <Button
                  onClick={() => {
                    reset();
                    dispatch(clearCart());
                    navigate(-1);
                  }}
                  className="discard"
                >
                  Cancel
                </Button>
              </div>
              <div className="button_container">
                <LoadingButton
                  loading={false}
                  variant="contained"
                  className="add"
                  type="submit"
                  // disabled={!isValid}
                >
                  Save Changes
                </LoadingButton>
              </div>
            </div>

            <SelectCustomerModal
              openModal={openCustomer}
              searchCustomers={searchCustomers}
              setSearchCustomers={setSearchCustomers}
              customerList={data?.customers?.data.map((item) => {
                return { name: item.name, id: `${item.id}` };
              })}
              closeModal={() => {
                setOpenCustomer(false);
              }}
            />
          </form>
        </FormProvider>
      </div>
      <QuickAddProductModal
        openModal={openProductModal}
        extraFnc={(item: any) => {
          dispatch(addToCart(item));
        }}
        closeModal={() => {
          setOpenProductModal(false);
        }}
      />
      <SuccesfulOrderEditModal
        openModal={openSuccessModal}
        closeModal={() => {
          setOpenSuccessModal(false);
          dispatch(clearCart());
          navigate(`/dashboard/orders/${orderData?.order?.id}`);
        }}
        icon={
          payStatus === "record" ? (
            <CheckCircleLargeIcon />
          ) : (
            <LargeWarningIcon />
          )
        }
        btnAction={() => {
          if (payStatus === "record") {
            setOpenPaymentModal(true);
          } else {
            setOpenRefundModal(true);
          }
        }}
        description_text={
          payStatus === "record"
            ? "Next step: Record payment if you’ve received payment or share this order with your customer to receive payment if you haven’t."
            : "Record how much payment was refunded to account for products removed from this order."
        }
        title={
          payStatus === "record"
            ? "Order Edited Successfully"
            : "Did you refund this customer?"
        }
        btnText={payStatus === "record" ? "Record Payment" : "Yes, I Refunded"}
        secondBtnText={
          payStatus === "record"
            ? isCopied
              ? "Copied"
              : "Copy Link to Share Order"
            : "I’ll Refund Later"
        }
        secondBtnAction={() => {
          if (payStatus === "record") {
            handleCopyClick();
          } else {
            setOpenRefundLaterModal(true);
          }
        }}
      />
      {orderData && (
        <>
          <RecordPaymentModal
            closeOnOverlayClick={false}
            order_id={`${orderData?.order?.id}`}
            customer_id={
              editedOrder?.customer ? `${editedOrder?.customer.id}` : ""
            }
            order={editedOrder}
            openModal={openPaymentModal}
            closeModal={() => {
              setOpenPaymentModal(false);
            }}
            extraAction={() => {
              dispatch(clearCart());
              navigate(`/dashboard/orders/${orderData?.order?.id}`);
            }}
          />

          <MessageModal
            openModal={openRefundLaterModal}
            closeModal={() => {
              setOpenRefundLaterModal(false);
            }}
            icon={<HelpCircleIcon />}
            remove_icon_bg
            title="Refund Later?"
            btnChild={
              <Button
                onClick={() => {
                  dispatch(clearCart());
                  navigate(`/dashboard/orders/${orderData?.order?.id}`);
                }}
                className="primary_styled_button"
                variant="contained"
              >
                I’ll Refund Later
              </Button>
            }
            description={`By clicking “I’ll Refund Later”, you’ll have to manually mark the order as Refunded.`}
          />

          <MessageModal
            openModal={openRefundModal}
            closeModal={() => {
              setOpenRefundModal(false);
            }}
            icon={<InfoCircleIcon stroke="#5C636D" />}
            title="Confirm Refund"
            remove_icon_bg
            btnChild={
              <Button
                onClick={() => {
                  refundFnc();
                }}
                className="primary_styled_button"
                variant="contained"
              >
                {refundLoad ? (
                  <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
                ) : (
                  "Yes, I’ve Refunded"
                )}
              </Button>
            }
            description={`Are you sure you’ve refunded the amount of ${formatPrice(
              Number(editedOrder?.amount_paid) - Number(editedOrder?.total)
            )}?`}
          />
        </>
      )}
    </>
  );
};
