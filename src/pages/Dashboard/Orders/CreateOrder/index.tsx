import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import moment from "moment";
import { PlayCircleIcon } from "assets/Icons/PlayCircleIcon";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import SelectField from "components/forms/SelectField";
import ValidatedInput from "components/forms/ValidatedInput";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import { PaymentSection } from "./paymentSection";
import { ProductSection } from "./productSection";
import { QuickAddProductModal } from "../widgets/addProduct/QuickAddProduct";
import { SelectCustomerModal } from "../widgets/customer/SelectCustomer";
import Loader from "components/Loader";
import {
  showToast,
  showVideoModal,
  useAppDispatch,
  useAppSelector,
} from "store/store.hooks";
import {
  useCreateOrdersMutation,
  useGetCustomersQuery,
  useMatchOrderMutation,
} from "services";
import { handleError } from "utils";
import {
  addToCart,
  clearCart,
  selectProductItems,
} from "store/slice/OrderSlice";
import {
  CustomerType,
  ShippingType,
  ShipBubbleType,
  TaxType,
  TransactionListType,
} from "services/api.types";
import { SALESCHANNEL, getObjWithValidValues } from "utils/constants/general";
import { selectUserLocation } from "store/slice/AuthSlice";
import "./style.scss";

export type CreateOrderFeilds = {
  customer: { name: string; id: string };
  customer_details: any;
  origin: string;
  channel: string;
  date: string;
  shipping_price: number | null;
  shipping_option?: ShippingType;
  automatedShippingCourier?: ShipBubbleType | null;
  shipping_record_id?: number | null;
  items: any;
  total: number;
  sub_total: number;
  discount_val?: number;
  discount_val2?: number;
  discount_type2?: string;
  discount?: number;
  discount_type?: string;
  grand_total: number;
  order_date: string;
  payment_amount?: number;
  payment_method?: string;
  hasPayment: string;
  tax?: number;
  taxes?: TaxType[];
  taxPercent?: number;
  note?: string;
  terminal?: TransactionListType;
};

export type IProp = {
  discardFnc?: () => void;
  preSelectedCustomer?: string;
  onSuccess?: (payload: any) => void;
  from?: string;
};

export const CreateOrder = ({
  discardFnc,
  preSelectedCustomer,
  onSuccess,
  from,
}: IProp) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("PAID");
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [customerId, setCustomerId] = useState<number>(0);
  const [searchCustomers, setSearchCustomers] = useState("");

  const addedProducts = useAppSelector(selectProductItems);
  const userLocation = useAppSelector(selectUserLocation);

  const [createOrder, { isLoading }] = useCreateOrdersMutation();
  const [matchOrder, { isLoading: loadMatchOrder }] = useMatchOrderMutation();

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

  const onSubmit: SubmitHandler<CreateOrderFeilds> = async (data) => {
    let taxAmount = (
      ((data.taxPercent || 0) / 100) *
      (data.total - (data.discount || 0))
    ).toFixed(2);
    const payload = {
      customer_id:
        preSelectedCustomer && customerId
          ? customerId
          : data.customer
          ? data.customer.id
          : null,
      channel: "WEB",
      origin: data.origin,
      shipping_price: data.automatedShippingCourier
        ? data?.automatedShippingCourier?.price
        : data.shipping_price,
      shipping_option: data.shipping_option,
      shipping_record_id: data.shipping_record_id,
      tax: taxAmount,
      taxes: data.taxes,
      discount: data.discount_val,
      discount_type: data.discount_type,
      discount_val: data.discount,
      location_id: userLocation?.id,
      note: data.note,
      items: addedProducts.map((item: any) => {
        return {
          id: item.itemId ? item.itemId : item.id,
          variant: item.variant ? item.variant : null,
          url: item.url,
          name: item.name,
          unit: item.unit,
          price: item.price,
          total: Number(item.price) * Number(item.quantity),
          discount: item.discount,
          description: item.description,
          thumbnail_url: item.thumbnail_url,
          quantity: item.quantity,
        };
      }),
      // sub_total: data.total - (data.discount || 0),
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
      payment_amount: data?.terminal
        ? ""
        : data.hasPayment === "PAID"
        ? data.total -
          (data.discount || 0) +
          Number(data.shipping_price || 0) +
          Number(taxAmount || 0)
        : data.payment_amount
        ? data.payment_amount
        : "",
      payment_method: data?.terminal ? "BANK" : data.payment_method,
      hasPayment: data?.terminal
        ? false
        : data.hasPayment === "PAID" || data.hasPayment === "PARTIALLY_PAID"
        ? true
        : false,
    };
    if (payload.items && payload.items.length) {
      if (data?.payment_method === "TERMINAL" && !data?.terminal) {
        showToast(
          "Please Select a terminal transaction or change payment method",
          "warning"
        );
      } else {
        try {
          let result = await createOrder(getObjWithValidValues(payload));

          if ("data" in result) {
            dispatch(clearCart());
            if (typeof _cio !== "undefined") {
              _cio.track("web_order_add", payload);
            }
            if (typeof mixpanel !== "undefined") {
              mixpanel.track("web_order_add", payload);
            }

            if (data.hasPayment === "PAID") {
              if (typeof _cio !== "undefined") {
                _cio.track("web_order_paid", payload);
              }
              if (typeof mixpanel !== "undefined") {
                mixpanel.track("web_order_paid", payload);
              }
            }
            if (data.hasPayment === "UNPAID") {
              if (typeof _cio !== "undefined") {
                _cio.track("web_order_unpaid", payload);
              }
              if (typeof mixpanel !== "undefined") {
                mixpanel.track("web_order_unpaid", payload);
              }
            }

            if (data.hasPayment === "UNPAID" && !data?.terminal) {
              showToast(
                "You will be able to send an invoice and record the payment from the order page.",
                "success",
                7000
              );
            } else {
              showToast("Order Created successfully", "success");
            }

            if (data?.terminal) {
              matchOrderFnc({
                orderToLink: result?.data?.id,
                activeTransaction: data?.terminal,
              });
            } else {
              if (onSuccess) {
                onSuccess(result);
              }
              if (discardFnc) {
                discardFnc();
              } else {
                navigate(
                  `/dashboard/orders/${
                    result.data.id
                  }?isFirst=${true}&paymentMethod=${data?.payment_method}`
                );
              }
            }
          } else {
            handleError(result);
          }
        } catch (error) {
          handleError(error);
        }
      }
    } else {
      showToast("Please Select Product to proceed", "error", 5000);
    }
  };

  const matchOrderFnc = async ({
    orderToLink,
    activeTransaction,
  }: {
    orderToLink: number;
    activeTransaction: TransactionListType;
  }) => {
    const payload = {
      order_id: orderToLink,
      transaction_id: activeTransaction?.id,
      customer_id: activeTransaction?.customer?.id,
    };
    try {
      let result = await matchOrder(getObjWithValidValues(payload));
      if ("data" in result) {
        if (result.data.error) {
          showToast(
            "Terminal transaction couldn't be matched, you can proceed to record payment in order details page",
            "error",
            10000
          );
          navigate(`/dashboard/orders/${orderToLink}?isFirst=${true}`);
        } else {
          if (discardFnc) {
            discardFnc();
          } else {
            showToast("Terminal transaction matched successfully", "success");
            navigate(`/dashboard/orders/${orderToLink}?isFirst=${true}`);
          }
        }
      } else {
        handleError(
          result,
          "Terminal transaction couldn't be matched, you can proceed to record payment in order details page",
          10000
        );

        navigate(`/dashboard/orders/${orderToLink}?isFirst=${true}`);
      }
    } catch (error) {
      handleError(
        error,
        "Terminal transaction couldn't be matched, you can proceed to record payment in order details page",
        10000
      );
      navigate(`/dashboard/orders/${orderToLink}?isFirst=${true}`);
    }
  };

  useEffect(() => {
    if (from) {
      setValue("origin", from);
    } else {
      setValue("origin", "walk-in");
    }
  }, []);

  useEffect(() => {
    if (data && preSelectedCustomer) {
      const value = data?.customers?.data.find(
        (item: any) => item.handle == preSelectedCustomer
      ) as CustomerType;

      setCustomerId(value.id);
    }
  }, [data]);

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

  return (
    <>
      {(isLoading || loadMatchOrder) && <Loader />}
      <div className="pd_create_order">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form_section">
              <ModalHeader
                text="Create Order"
                closeModal={() => {
                  if (discardFnc) {
                    discardFnc();
                  } else {
                    dispatch(clearCart());
                    navigate(-1);
                  }
                }}
                button={
                  preSelectedCustomer === undefined && (
                    <Button
                      className="video"
                      onClick={() => {
                        showVideoModal(
                          true,
                          <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/2X45P4APa_s?si=T7Pl8wJpI8z73sGO"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          ></iframe>,
                          "How to create order"
                        );
                      }}
                      startIcon={<PlayCircleIcon />}
                    >
                      Watch video tutorial
                    </Button>
                  )
                }
              />
              <div className="form_field_container">
                <div className="order_details_container">
                  <FormSectionHeader title="Order Details" />
                  <div className="px-[16px]">
                    {preSelectedCustomer === undefined && (
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
                              {watch("customer") ? (
                                watch("customer").name
                              ) : (
                                <span>Select customers</span>
                              )}
                            </p>
                            <ChevronDownIcon />
                          </div>
                        </div>
                        <div className="extra_message">
                          <InfoCircleIcon />
                          <p>
                            Leave blank if you don’t have customer’s contact
                            information
                          </p>{" "}
                        </div>
                      </div>
                    )}
                    <div className="form-group-flex">
                      <SelectField
                        name="origin"
                        selectOption={SALESCHANNEL}
                        label="Sales Channel"
                      />

                      <ValidatedInput
                        name="order_date"
                        label="Order Date"
                        type={"date"}
                        defaultValue={moment().format("YYYY-MM-DD")}
                      />
                    </div>
                  </div>
                </div>
                <ProductSection
                  setOpenCreateProductModal={setOpenProductModal}
                />
                <PaymentSection
                  selectedPaymentStatus={selectedPaymentStatus}
                  setSelectedPaymentStatus={setSelectedPaymentStatus}
                />
              </div>
            </div>
            <div className="submit_form_section">
              <div className="button_container2">
                <Button
                  onClick={() => {
                    reset();
                    setSelectedPaymentStatus("PAID");
                    dispatch(clearCart());
                  }}
                  className="discard"
                >
                  Clear
                </Button>
              </div>

              <div className="button_container">
                <Button
                  variant="contained"
                  type="button"
                  onClick={() => {
                    reset();
                    dispatch(clearCart());
                    setSelectedPaymentStatus("PAID");
                    if (from === "instagram" && discardFnc) {
                      discardFnc();
                    } else {
                      navigate(-1);
                    }
                  }}
                  className="preview"
                >
                  Cancel
                </Button>

                <LoadingButton
                  loading={false}
                  variant="contained"
                  className="add"
                  type="submit"
                >
                  Create
                </LoadingButton>
              </div>
            </div>

            <SelectCustomerModal
              openModal={openCustomer}
              searchCustomers={searchCustomers}
              setSearchCustomers={setSearchCustomers}
              customerList={data?.customers?.data.map((item: any) => {
                return { name: item.name, id: `${item.id}` };
              })}
              closeModal={() => {
                setOpenCustomer(false);
              }}
            />
          </form>
        </FormProvider>
        <QuickAddProductModal
          openModal={openProductModal}
          extraFnc={(item: any) => {
            dispatch(addToCart(item));
            if (watch("shipping_record_id")) {
              setValue("shipping_record_id", null);
              setValue("automatedShippingCourier", null);
              setValue("shipping_price", null);
              showToast(
                "The selected shipping record has been cleared. Please re-add it.",
                "warning",
                6000
              );
            }
          }}
          closeModal={() => {
            setOpenProductModal(false);
          }}
        />
      </div>
    </>
  );
};
