import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import parse from "html-react-parser";
import Lottie from "react-lottie";
import moment from "moment";
import { Button, Chip, CircularProgress, IconButton } from "@mui/material";

import { TrashIcon } from "assets/Icons/TrashIcon";
import { CoinSwapIcon } from "assets/Icons/CoinSwapIcon";
import { InfoCircleXLIcon } from "assets/Icons/InfoCircleXLIcon";
import { LargeWarningIcon } from "assets/Icons/LargeWarningIcon";
import { PrimaryFillIcon } from "assets/Icons/PrimaryFillIcon";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { InfoIcon } from "assets/Icons/InfoIcon";
import { PrinterIcon } from "assets/Icons/PrinterIcon";
import { CoinLargeIcon } from "assets/Icons/CoinLargeIcon";
import { ShareIcon } from "assets/Icons/ShareIcon";
import { XCircleIcon } from "assets/Icons/XCircleIcon";
import { EditIcon } from "assets/Icons/EditIcon";
import { WhatsappIcon2Icon } from "assets/Icons/WhatsappIcon2";
import { MAil01Icon } from "assets/Icons/Mail01Icon";
import { PhoneIcon } from "assets/Icons/PhoneIcon";
import ErrorMsg from "components/ErrorMsg";
import Loader from "components/Loader";
import { PickupBookingModal } from "./PickupBookingModal";
import MessageModal from "components/Modal/MessageModal";
import DropDownWrapper from "components/DropDownWrapper";
import { GrowthModal } from "components/GrowthModal";
import { UpgradeModal } from "components/UpgradeModal";
import ConfirmPaymentModal from "./ConfirmPaymentModal";
import { EditContactModal } from "./EditContactModal";
import { EditAddressModal } from "./EditAddressModal";
import { SelectCustomerModal } from "./customer/SelectCustomer";
import { ComponentToPrint } from "pages/Dashboard/PointOfSale/widgets/SuccessModal";
import ConfirmResolveModal from "./ConfirmResolveModal";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { BootstrapTooltip } from "pages/Dashboard/Transactions/TransactionHistoryTable";
import { getOriginImage } from "..";
import { RecordPaymentModal } from "../widgets/RecordPayment/RecordPayment";
import TerminalModal from "../widgets/TerminalModal/TerminalModal";
import { PermissionsType } from "Models";
import { OrderItemType, OrderType } from "Models/order";
import { useCopyToClipboardHook } from "hooks/useCopyToClipboardHook";
import useShowInvoiceRestriction from "hooks/useShowInvoiceRestriction";
import SuccesfulOrderEditModal from "../CreateOrder/EditOrderModals/SuccesfulOrderEditModal";
import {
  useActionOrdersMutation,
  useAllAnalyticsSummaryQuery,
  useCreateTransactionMutation,
  useDeleteOrdersMutation,
  useEditCustomerMutation,
  useEditOrdersMutation,
  useGetCheckoutTerminalQuery,
  useGetSingleOrdersQuery,
  useRefundOrderMutation,
  useRequestOrderPaymentMutation,
  useResolveOrderMutation,
} from "services";
import {
  selectCurrentStore,
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
  selectPermissions,
  selectUserLocation,
} from "store/slice/AuthSlice";
import { showToast, useAppSelector } from "store/store.hooks";
import {
  IMAGEURL,
  convertAddress,
  convertAddressToCopy,
  defaultOptions,
  rearrangeProducts,
} from "utils/constants/general";
import {
  calculateTotalAmount,
  checkValidShippingAddress,
  formatTransactionPrice,
  handleError,
  removeFirstZero,
  translateOrderPaymentStatus,
  translateOrderShippmentStatus,
  translateOrderStatus,
} from "utils";

import "./style.scss";
import ShippingSection from "./ShippingSection";

type GeneralActionType =
  | "CONFIRMBANK"
  | "REJECTBANK"
  | "RECORDPAYMENT"
  | "SENDPAYMENTREQUEST"
  | "MARKASSHIPPED"
  | "MARKASDELIVERED"
  | "MARKASRETURNED"
  | "CANCELORDER"
  | "";
export const resolveOrderList = [
  {
    value: "REFUND",
    key: "Refund Excess Item(s)",
  },

  {
    value: "REFUND ALL",
    key: "Refund Entire Order",
  },
  {
    value: "FULFIL",
    key: "Fulfil Order",
  },
];

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const componentRef = useRef() as MutableRefObject<HTMLDivElement>;

  const [openModal, setOpenModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState<null | OrderType>(null);
  const [orderHistoryDates, setOrderHistoryDates] = useState<
    { created_at: string; order_number: string }[]
  >([]);
  const [openTrackShipmentModal, setOpenTrackShipmentModal] = useState(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [play, setPlay] = useState(false);
  const [viewAllProducts, setViewAllProducts] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openRequestPayment, setOpenRequestPayment] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [isDownloadingReceipt, setIsDownloadingReceipt] = useState(false);
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);
  const [openGeneralWarningModal, setOpenGeneralWarningModal] = useState(false);
  const [openGeneralWarningAction, setOpenGeneralWarningAction] =
    useState<GeneralActionType>("");
  const [openGeneralWarningMessage, setOpenGeneralWarningMessage] =
    useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [shippingStatus, setShippingStatus] = useState("");
  const [editContactModal, setEditContactModal] = useState(false);
  const [editContactAction, setEditContactAction] = useState("");
  const [editAddressModal, setEditAddressModal] = useState(false);
  const [editAddressAction, setEditAddressAction] = useState("");
  const [isEditAddress, setIsEditAddress] = useState(false);
  const [selectCustomerModal, setSelectCustomerModal] = useState(false);
  const [resolveOrderAction, setResolveOrderAction] = useState("");
  const [openResolveModal, setOpenResolveModal] = useState(false);
  const [checkContact, setCheckContact] = useState(false);
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [openRefund, setOpenRefund] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [openIsEditPendingModal, setOpenIsEditPendingModal] = useState(false);
  const [openIsRejectPaymentModal, setOpenIsRejectPaymentModal] =
    useState(false);
  const [currentLimit, setCurrentLimit] = useState(0);
  const [nextLimit, setNextLimit] = useState(0);
  const [isStarterUpgrade, setIsStarterUpgrade] = useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const [openGrowthModal, setOpenGrowthModal] = useState(false);
  const [openTerminalModal, setOpenTerminalModal] = useState(false);
  const [openShippingWarning, setOpenShippingWarning] = useState(false);
  const [isGrowthUpgrade, setIsGrowthUpgrade] = useState(false);
  const [maxPlan, setMaxPlan] = useState(false);

  const [deleteOrders, { isLoading: loadDelete }] = useDeleteOrdersMutation();
  const [resolveOrders, { isLoading: loadResolve }] = useResolveOrderMutation();
  const [actionOrders, { isLoading: loadAction }] = useActionOrdersMutation();
  const [requestPayment, { isLoading: loadRequest }] =
    useRequestOrderPaymentMutation();
  const [editOrder, { isLoading: loadEdit }] = useEditOrdersMutation();
  const [editCustomer, { isLoading: editCustomerLoading }] =
    useEditCustomerMutation();
  const [refundOrder, { isLoading: refundLoad }] = useRefundOrderMutation();
  const { data, isLoading, isError, isFetching } = useGetSingleOrdersQuery(id);
  const { data: checkoutTerminal } = useGetCheckoutTerminalQuery();

  const storeData = useAppSelector(selectCurrentStore);
  const userPermission: PermissionsType = useAppSelector(selectPermissions);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const userLocation = useAppSelector(selectUserLocation);

  const { isCopied, handleCopyClick } = useCopyToClipboardHook(
    data ? data.order.order_page : ""
  );

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const searchParams = new URLSearchParams(location.search);
  const isFirst = searchParams.get("isFirst");
  const backAction = searchParams.get("backAction");
  const paymentMethod = searchParams.get("paymentMethod");

  const canManageOrder = isStaff ? userPermission?.orders?.manage : true;
  const hasTerminal = checkoutTerminal?.success;

  const isRestricted = useShowInvoiceRestriction();
  const requestPaymentOrderFnc = async (id: string) => {
    try {
      let result = await requestPayment({ id });
      setCheckContact(false);
      if ("data" in result) {
        if (result.data.error) {
          showToast(result.data.error, "error");
        } else {
          showToast(
            "Payment request link successfully sent to customer",
            "success"
          );
          setOpenRequestPayment(false);
        }
      } else {
        handleError(result);
      }
      if (typeof mixpanel !== "undefined") {
        mixpanel.track("web_request_payment", id);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const editContactFunction = async (val: any) => {
    let payload: any;
    if (editContactAction === "email") {
      payload = { email: val };
    } else {
      payload = { phone: val };
    }

    try {
      let result = await editCustomer({
        body: payload,
        id: `${activeOrder?.customer?.id}`,
      });
      if ("data" in result) {
        showToast("Customer details edited successfully", "success");
        if (checkContact) {
          setOpenRequestPayment(true);
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const editAddressFunction = async (val: any, callback?: () => void) => {
    let order = activeOrder?.customer;
    let payloadCustomer: any;

    const handleCustomerEdit = async () => {
      if (val.isBoth) {
        payloadCustomer = {
          addresses: [
            {
              type: "SHIPPING",
              default: 0,
              last_name: order?.last_name,
              first_name: order?.first_name,
              phone: val?.phone || order?.phone,

              street: val?.street,
              city: val?.city,
              state: val?.state,
              country: val?.country,
              zip: Number(val?.zip),
            },
            {
              type: "BILLING",
              default: 0,
              last_name: order?.last_name,
              first_name: order?.first_name,
              phone: val?.phone || order?.phone,
              street: val?.street,
              city: val?.city,
              state: val?.state,
              country: val?.country,
              zip: Number(val?.zip),
            },
          ],
        };
      } else {
        if (editAddressAction === "billing") {
          payloadCustomer = {
            addresses: [
              {
                type: "SHIPPING",
                default: 0,
                last_name: order?.last_name,
                first_name: order?.first_name,
                phone: val?.phone || order?.phone,
                street: order?.shipping_address?.street,
                city: order?.shipping_address?.city,
                state: order?.shipping_address?.state,
                country: order?.shipping_address?.country,
                zip: Number(order?.shipping_address?.zip),
              },
              {
                type: "BILLING",
                default: 0,
                last_name: order?.last_name,
                first_name: order?.first_name,
                phone: val?.phone || order?.phone,
                street: val?.street,
                city: val?.city,
                state: val?.state,
                country: val?.country,
                zip: val?.zip ? Number(val?.zip) : "",
              },
            ],
          };
        } else {
          payloadCustomer = {
            addresses: [
              {
                type: "SHIPPING",
                default: 0,
                last_name: order?.last_name,
                first_name: order?.first_name,
                phone: val?.phone || order?.phone,
                street: val?.street,
                city: val?.city,
                state: val?.state,
                country: val?.country,
                zip: val?.zip ? Number(val?.zip) : "",
              },
              {
                type: "BILLING",
                default: 0,
                last_name: order?.last_name,
                first_name: order?.first_name,
                phone: val?.phone || order?.phone,
                street: order?.billing_address?.street,
                city: order?.billing_address?.city,
                state: order?.billing_address?.state,
                country: order?.billing_address?.country,
                zip: Number(order?.billing_address?.zip),
              },
            ],
          };
        }
      }
      try {
        let result = await editCustomer({
          body: payloadCustomer,
          id: `${activeOrder?.customer?.id}`,
        });
        if ("data" in result) {
          showToast("Customer details edited successfully", "success");
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    };

    if (editAddressAction === "shipping") {
      let payload = {
        ...activeOrder,
        order_date: moment(activeOrder?.order_date).format("DD/MM/YYYY"),
        shipping_details: {
          street: val?.street,
          city: val?.city,
          state: val?.state,
          country: val?.country,
          last_name: order?.last_name,
          first_name: order?.first_name,
          zip: val?.zip ? Number(val?.zip) : "",
          type: "SHIPPING",
          phone: val?.phone || order?.phone,
        },
      };
      try {
        let result = await editOrder({ body: payload, id });
        if ("data" in result) {
          showToast("Saved successfully", "success");
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }

      if (val.isBoth || val.applyShipping) {
        let payloadBoth;
        if (val.isBoth) {
          payloadBoth = {
            addresses: [
              {
                type: "SHIPPING",
                default: 0,
                last_name: order?.last_name,
                first_name: order?.first_name,
                street: val?.street,
                city: val?.city,
                state: val?.state,
                country: val?.country,
                zip: val?.zip ? Number(val?.zip) : "",
                phone: val?.phone || order?.phone,
              },
              {
                type: "BILLING",
                default: 0,
                last_name: order?.last_name,
                first_name: order?.first_name,
                phone: val?.phone || order?.phone,
                street: val?.street,
                city: val?.city,
                state: val?.state,
                country: val?.country,
                zip: val?.zip ? Number(val?.zip) : "",
              },
            ],
          };
        } else if (val.applyShipping) {
          payloadBoth = {
            addresses: [
              {
                type: "SHIPPING",
                default: 0,
                last_name: order?.last_name,
                first_name: order?.first_name,
                phone: val?.phone || order?.phone,
                street: val?.street,
                city: val?.city,
                state: val?.state,
                country: val?.country,
                zip: val?.zip ? Number(val?.zip) : "",
              },
              {
                type: "BILLING",
                default: 0,
                last_name: order?.last_name,
                first_name: order?.first_name,
                phone: val?.phone || order?.phone,
                street: order?.billing_address?.street,
                city: order?.billing_address?.city,
                state: order?.billing_address?.state,
                country: order?.billing_address?.country,
                zip: Number(order?.billing_address?.zip),
              },
            ],
          };
        }

        try {
          let result = await editCustomer({
            body: payloadBoth,
            id: `${activeOrder?.customer?.id}`,
          });
          if ("data" in result) {
            showToast("Customer details edited successfully", "success");
          } else {
            handleError(result);
          }
        } catch (error) {
          handleError(error);
        }
      }
    } else {
      handleCustomerEdit();
    }

    callback && callback();
  };

  const refundFnc = async () => {
    const payload = {
      amount: Number(activeOrder?.amount_paid) - Number(activeOrder?.total),
      transaction_date: moment(new Date()).format("DD/MM/YYYY"),
    };
    try {
      let result = await refundOrder({
        id: `${activeOrder?.id}`,
        body: payload,
      });
      if ("data" in result) {
        if (result.data.error) {
          showToast(result.data.error, "error");
        } else {
          showToast("Refund recorded successfuly", "success");
          setOpenRefund(false);
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const resetActions = () => {
    setShippingStatus("");
    setOrderStatus("");
  };

  const actionOrderFnc = async (action: string, body?: any) => {
    try {
      let result = await actionOrders({ id, action, body });
      if ("data" in result) {
        if (result.data.error) {
          showToast(result.data.error, "error");
          resetActions();
        } else {
          if (action === "markAsDelivered") {
            showToast("Delivery email sent to customer", "success", 3000);
          } else if (action === "markAsShipped") {
            showToast(
              "Customer has been notified that item has been shipped",
              "success",
              3000
            );
          } else if (action === "markAsReturned") {
            showToast("Updated successfully", "success", 3000);
          } else if (
            action === "markAsPartiallyPaid" ||
            action === "markAsUnpaid"
          ) {
            showToast(
              "Successful, The customer has been notified via email that the payment for this order was not received.",
              "success",
              7000
            );
          } else {
            showToast("Updated successfully", "success");
          }

          if (openIsEditPendingModal) {
            navigate(`/dashboard/orders/edit/${id}`, {
              state: {
                orderDetails: data?.order,
              },
            });
          }

          setOpenGeneralWarningModal(false);
          setOpenGeneralWarningMessage("");
          setOpenGeneralWarningAction("");
          resetActions();
        }
      } else {
        handleError(result);
        resetActions();
      }
    } catch (error) {
      handleError(error);
      resetActions();
    }
  };

  const deleteOrderFnc = async () => {
    try {
      let result = await deleteOrders(id);
      if ("data" in result) {
        if (result.data.error) {
          showToast(result.data.error, "error");
        } else {
          showToast("Deleted successfully", "success");
          setOpenDeleteModal(false);
          navigate(-1);
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const resolveOrderFnc = async (action: string) => {
    let payload = {
      action,
    };
    try {
      let result = await resolveOrders({ id: `${id}`, body: payload });
      if ("data" in result) {
        if (result.data.error) {
          showToast(result.data.error, "error");
        } else {
          showToast("Resolved successfully", "success");
          setOpenResolveModal(false);
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const { data: analytics } = useAllAnalyticsSummaryQuery({
    type: "orders",
    location_id: userLocation?.id,
  });

  const invoiceLimits = {
    free: { current: 30, next: 1000 },
    starter: { current: 1000, next: 2000 },
    pro: { current: 2000, next: 5000 },
    growth: { current: 5000, next: "" },
  };

  const handleInvoiceLimitExceeded = (subscriptionType: string) => {
    switch (subscriptionType) {
      case "free":
        setCurrentLimit(invoiceLimits.free.current);
        setNextLimit(invoiceLimits.free.next);
        setIsStarterUpgrade(true);
        break;
      case "starter":
        setCurrentLimit(invoiceLimits.starter.current);
        setNextLimit(invoiceLimits.starter.next);
        setIsProUpgrade(true);
        break;
      case "pro":
        setCurrentLimit(invoiceLimits.pro.current);
        // @ts-ignore
        setNextLimit(invoiceLimits.pro.next);
        setIsGrowthUpgrade(true);
        setMaxPlan(true);
      case "growth":
        setCurrentLimit(invoiceLimits.growth.current);
        // @ts-ignore
        setNextLimit();
        setIsGrowthUpgrade(true);
      case "trial":
        setCurrentLimit(invoiceLimits.pro.current);
        setIsGrowthUpgrade(true);
        setMaxPlan(true);
        break;
      default:
        break;
    }
    setOpenUpgradeModal(true);
  };
  const handleDownloadInvoice = () => {
    if (isRestricted && isSubscriptionType != "growth") {
      handleInvoiceLimitExceeded(isSubscriptionType);
      return;
    }
    if (activeOrder) {
      window.open(activeOrder?.invoice_pdf, "_blank");
    }
  };

  const resetToLatestOrder = () => {
    if (data?.order) {
      setActiveOrder({ ...data?.order, isLatest: true });
    }
  };
  const filterOrderHistory = (order_number: string) => {
    let orderHistory = data?.order?.order_history || [];
    let filteredHistory = orderHistory?.filter(
      (item) => item.order_number === order_number
    );
    if (filteredHistory.length) {
      setActiveOrder(filteredHistory[0].order);
    }
  };

  const [transaction, { isLoading: loadConfirmPendingPayment }] =
    useCreateTransactionMutation();

  const handleConfirmPendingPayment = async () => {
    const payload = {
      order_id: `${activeOrder?.id || ""}`,
      transaction_date: moment(new Date()).format("DD/MM/YYYY"),
      amount: Number(activeOrder?.amount_due || 0),
      method: "BANK",
      customer_id: `${activeOrder?.customer?.id || ""}`,
    };
    try {
      let result = await transaction(payload);
      if ("data" in result) {
        if (result.data.error) {
          showToast(result.data.error, "error");
        } else {
          showToast(
            "Updated successfully, This has sent a payment confirmation email to your customer.",
            "success",
            7000
          );
          if (openIsEditPendingModal) {
            navigate(`/dashboard/orders/edit/${id}`, {
              state: {
                orderDetails: data?.order,
              },
            });
          }
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const generalWarningFunction = (action: GeneralActionType) => {
    switch (action) {
      case "MARKASSHIPPED":
        actionOrderFnc("markAsShipped");
        break;
      case "MARKASDELIVERED":
        actionOrderFnc("markAsDelivered");
        break;
      case "MARKASRETURNED":
        actionOrderFnc("markAsReturned");
        break;
      case "CANCELORDER":
        actionOrderFnc("changeStatus", {
          status: "CANCELLED",
        });
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (isFirst) {
      setPlay(true);
    }
  }, [isFirst]);

  useEffect(() => {
    if (paymentMethod) {
      if (paymentMethod === "BANK" && !hasTerminal) {
        setOpenTerminalModal(true);
      }
    }
  }, [paymentMethod]);

  useEffect(() => {
    setTimeout(() => {
      if (isFirst) {
        setPlay(false);
        searchParams.delete("isFirst");
      }
      if (paymentMethod) {
        searchParams.delete("paymentMethod");
      }

      const newUrl = `${window.location.origin}${window.location.pathname}${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`;
      window.history.replaceState(null, "", newUrl);
    }, 2000);
  }, [isFirst, paymentMethod]);

  useEffect(() => {
    if (userPermission !== undefined) {
      setIsStaff(true);
    } else {
      setIsStaff(false);
    }
  }, [userPermission]);

  useEffect(() => {
    if (activeOrder) {
      setOrderStatus(activeOrder?.status);
      setShippingStatus(activeOrder?.shipping_status);
    }
  }),
    [activeOrder];

  useEffect(() => {
    if (activeOrder) {
      if (activeOrder?.items?.length) {
        const totalValue = activeOrder?.items.reduce((acc: any, item: any) => {
          const itemTotal = Number(item.quantity) * Number(item.price);
          return acc + itemTotal;
        }, 0);
        setTotalValue(totalValue);
      }
    }
  }, [activeOrder]);

  useEffect(() => {
    if (data?.order) {
      setActiveOrder({ ...data?.order, isLatest: true });
      let history = data?.order?.order_history
        ? data?.order?.order_history?.map((item) => {
            return {
              created_at: item.created_at,
              order_number: item.order_number,
            };
          })
        : [];
      setOrderHistoryDates(history);
    }
  }, [data]);

  useEffect(() => {
    if (analytics && analytics[0] && analytics[0]?.value) {
      setTotalOrderCount(Number(analytics[0]?.value));
    }
  }, [analytics]);

  if (isError) {
    return <ErrorMsg error={"Something went wrong"} />;
  }
  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {isFetching && <Loader />}
      <div className="cover_receipt_to_print">
        <ComponentToPrint createdOrder={data?.order} ref={componentRef} />
      </div>
      {(loadAction ||
        loadConfirmPendingPayment ||
        loadRequest ||
        loadEdit ||
        editCustomerLoading) && <Loader />}

      <MessageModal
        openModal={openRequestPayment}
        closeModal={() => {
          setOpenRequestPayment(false);
        }}
        icon={<CoinLargeIcon />}
        title="Send Payment Request"
        remove_icon_bg={true}
        btnChild={
          <Button
            onClick={() => {
              requestPaymentOrderFnc(`${id}`);
            }}
            className="primary_styled_button"
            variant="contained"
          >
            Yes, Send
          </Button>
        }
        description={`You’re about to send an sms payment request to ${data?.order.customer?.name}.`}
      />
      <MessageModal
        openModal={openRefund}
        closeModal={() => {
          setOpenRefund(false);
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
        description={`Are you sure you’ve refunded  the amount of ${formatTransactionPrice(
          Number(activeOrder?.amount_paid) - Number(activeOrder?.total),
          data?.order?.currency_code
        )}?`}
      />
      <MessageModal
        openModal={openDeleteModal}
        closeModal={() => {
          setOpenDeleteModal(false);
        }}
        icon={<TrashIcon />}
        btnChild={
          <Button onClick={deleteOrderFnc} className="error">
            {loadDelete ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Yes, delete"
            )}
          </Button>
        }
        description="Are you sure you want to delete this order?"
      />
      <TerminalModal
        openModal={openTerminalModal}
        closeModal={() => {
          setOpenTerminalModal(false);
        }}
        btnAction={() => {
          navigate("/dashboard?fromTerminalModal=true");
        }}
      />
      {data && activeOrder && (
        <>
          <div className="pd_order_details_container">
            {play && (
              <div className="lottie_absolute_div">
                <Lottie
                  isStopped={!play}
                  options={defaultOptions}
                  height={"100%"}
                  width={"100%"}
                />
              </div>
            )}
            <ModalHeader
              text={`Order Details ${
                !activeOrder?.order_history ? "(Edited)" : ""
              }`}
              closeModal={() => {
                if (backAction) {
                  navigate(-1);
                } else {
                  navigate("/dashboard/orders");
                }
              }}
              button={
                canManageOrder && (
                  <div className="action_buttons">
                    {orderHistoryDates?.length ? (
                      <DropDownWrapper
                        origin="right"
                        closeOnChildClick
                        className="navbar_dropdown location_picker"
                        action={
                          <Button
                            className="grey_btn"
                            endIcon={<PrimaryFillIcon />}
                          >
                            Order History
                          </Button>
                        }
                      >
                        <div className="cover_buttons">
                          <ul className="select_list btn_list">
                            {orderHistoryDates?.map((item) => (
                              <li key={item.order_number}>
                                <Button
                                  onClick={() => {
                                    filterOrderHistory(item.order_number);
                                  }}
                                >
                                  {`${moment(item.created_at).format(
                                    "LL"
                                  )} - ${moment(item.created_at).format("LT")}`}
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </DropDownWrapper>
                    ) : (
                      ""
                    )}
                    {!activeOrder?.order_history && (
                      <Button
                        className="primary_styled_button"
                        variant="contained"
                        onClick={resetToLatestOrder}
                      >
                        View Latest Version
                      </Button>
                    )}
                    {canManageOrder && activeOrder?.order_history && (
                      <>
                        <Button
                          onClick={() => {
                            if (activeOrder?.should_resolve === 1) {
                              showToast("Resolve Order to continue", "warning");
                            } else {
                              handleCopyClick();
                              if (typeof _cio !== "undefined") {
                                _cio.track("web_share_order");
                              }
                              if (typeof mixpanel !== "undefined") {
                                mixpanel.track("web_share_order");
                              }
                            }
                          }}
                          startIcon={<ShareIcon />}
                          className="grey_btn"
                        >
                          {isCopied ? "Link Copied" : "Share Order"}
                        </Button>
                        {data.order.status === "COMPLETED" ||
                        data.order.status === "CANCELLED" ? (
                          ""
                        ) : (
                          <>
                            <Button
                              onClick={() => {
                                if (activeOrder?.should_resolve === 1) {
                                  showToast(
                                    "Resolve Order to continue",
                                    "warning"
                                  );
                                } else {
                                  setOpenGeneralWarningAction("CANCELORDER");
                                  setOpenGeneralWarningMessage(
                                    "This  will cancel the order, return the items to inventory, and adjust the transaction amounts accordingly."
                                  );
                                  setOpenGeneralWarningModal(true);
                                }
                              }}
                              startIcon={<XCircleIcon />}
                              className="grey_btn"
                            >
                              Cancel order
                            </Button>
                          </>
                        )}
                        {data.order.status === "COMPLETED" ? (
                          ""
                        ) : (
                          <Button
                            startIcon={<EditIcon stroke="#009444" />}
                            variant="outlined"
                            onClick={() => {
                              if (activeOrder?.should_resolve === 1) {
                                showToast(
                                  "Resolve Order to continue",
                                  "warning"
                                );
                              } else {
                                if (
                                  activeOrder?.currency_code ===
                                  storeData?.settings?.currency
                                ) {
                                  if (data.order.payment_status === "PENDING") {
                                    setOpenIsEditPendingModal(true);
                                  } else {
                                    navigate(`/dashboard/orders/edit/${id}`, {
                                      state: {
                                        orderDetails: data.order,
                                      },
                                    });
                                  }
                                } else {
                                  showToast(
                                    "Orders in a different currency from the store currency cannot be edited.",
                                    "warning"
                                  );
                                }
                              }
                            }}
                          >
                            Edit order
                          </Button>
                        )}
                        {data.order.payment_status === "UNPAID" ||
                        data.order.payment_status === "PENDING" ? (
                          <IconButton
                            onClick={(e) => {
                              if (activeOrder?.should_resolve === 1) {
                                showToast(
                                  "Resolve Order to continue",
                                  "warning"
                                );
                              } else {
                                setOpenDeleteModal(true);
                              }
                            }}
                            type="button"
                            className="icon_button_container"
                          >
                            <TrashIcon />
                          </IconButton>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </div>
                )
              }
            />
            <div className="order_details_flex_container">
              <div className="left_section">
                <div className="about_order section">
                  <div className="top_order_details_box">
                    <div className="title_side">
                      <BootstrapTooltip
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -8],
                                },
                              },
                            ],
                          },
                        }}
                        title={`The Order Id is #${activeOrder?.id} `}
                        placement="top"
                      >
                        <div className="flex items-center mb-[12px] cursor-pointer">
                          <h3 className="order_id">
                            Order #{activeOrder?.order_number}
                          </h3>{" "}
                          <IconButton>
                            <InfoCircleIcon />
                          </IconButton>
                        </div>
                      </BootstrapTooltip>

                      <div className="status_chip_flex">
                        <div className="single_status">
                          <p>Order: </p>
                          <Chip
                            color={
                              translateOrderStatus(activeOrder?.status)?.color
                            }
                            label={
                              translateOrderStatus(activeOrder?.status)?.label
                            }
                          />
                        </div>
                        <div className="single_status">
                          <p>Payment: </p>
                          <Chip
                            color={
                              translateOrderPaymentStatus(
                                activeOrder?.payment_status
                              )?.color
                            }
                            label={
                              translateOrderPaymentStatus(
                                activeOrder?.payment_status
                              )?.label
                            }
                          />
                        </div>
                        <div className="single_status">
                          <p>Shipping: </p>
                          <Chip
                            color={
                              translateOrderShippmentStatus(
                                activeOrder?.shipping_status
                              )?.color
                            }
                            label={
                              translateOrderShippmentStatus(
                                activeOrder?.shipping_status
                              )?.label
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="date_side">
                      <p className="light">Date</p>
                      <p className="bold">
                        {moment(
                          activeOrder?.order_history
                            ? activeOrder?.order_date
                            : activeOrder?.created_at
                        ).format("ll")}{" "}
                      </p>
                    </div>
                  </div>
                  <div className="about_customer_section">
                    <div className="details_row">
                      <div className="details_column">
                        <p className="title">Channel</p>
                        <div className="flex items-center gap-2 ">
                          <img
                            src={getOriginImage(activeOrder?.origin).image}
                            alt={getOriginImage(activeOrder?.origin).name}
                            width={28}
                            height={28}
                          />
                          <p className="content">
                            {getOriginImage(activeOrder?.origin).name}
                          </p>
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          if (activeOrder?.customer) {
                            navigate(
                              `/dashboard/customers/${activeOrder?.customer?.id}`
                            );
                          }
                        }}
                        className="details_column cursor-pointer"
                      >
                        <p className="title">Customer</p>

                        {activeOrder?.customer ? (
                          <p className="content">
                            {activeOrder?.customer?.name}
                          </p>
                        ) : (
                          canManageOrder &&
                          activeOrder?.order_history && (
                            <Button
                              onClick={() => {
                                if (activeOrder?.should_resolve === 1) {
                                  showToast(
                                    "Resolve Order to continue",
                                    "warning"
                                  );
                                } else {
                                  setSelectCustomerModal(true);
                                }
                              }}
                              sx={{ height: "36px", marginTop: "10px" }}
                              variant="outlined"
                            >
                              Add customer
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                    {activeOrder?.customer ? (
                      <div className="details_row address_row">
                        <div className="details_column">
                          <p className="title">Billing Address</p>
                          <p className="description">
                            {activeOrder?.customer &&
                            activeOrder?.customer?.billing_address
                              ? activeOrder?.customer?.billing_address
                                  .country ||
                                activeOrder?.customer?.billing_address.state ||
                                activeOrder?.customer?.billing_address.street ||
                                activeOrder?.customer?.billing_address.city
                                ? convertAddress(
                                    activeOrder?.customer?.billing_address
                                  )
                                : canManageOrder &&
                                  activeOrder?.order_history && (
                                    <Button
                                      onClick={() => {
                                        setEditAddressAction("billing");
                                        setEditAddressModal(true);
                                      }}
                                      sx={{ height: "36px", marginTop: "10px" }}
                                      variant="outlined"
                                    >
                                      Add billing address
                                    </Button>
                                  )
                              : canManageOrder &&
                                activeOrder?.order_history && (
                                  <Button
                                    onClick={() => {
                                      setEditAddressAction("billing");
                                      setEditAddressModal(true);
                                    }}
                                    sx={{ height: "36px", marginTop: "10px" }}
                                    variant="outlined"
                                  >
                                    Add billing address
                                  </Button>
                                )}
                          </p>
                        </div>
                        <div className="details_column">
                          <p className="title">Contact Details</p>

                          <div
                            onClick={() => {
                              if (activeOrder?.customer?.phone) {
                                window.open(
                                  `https://wa.me/234${removeFirstZero(
                                    activeOrder?.customer?.phone
                                  )}`,
                                  "_blank"
                                );
                              } else {
                                setEditContactModal(true);
                                setEditContactAction("phone");
                              }
                            }}
                            className="contact"
                          >
                            <IconButton
                              type="button"
                              className="icon_button_container small"
                            >
                              <PhoneIcon />
                            </IconButton>
                            <p>
                              {activeOrder?.customer?.phone || "Add contact"}
                            </p>
                          </div>
                          {activeOrder?.shipping_details?.alternative_phone && (
                            <div
                              onClick={() => {
                                window.open(
                                  `https://wa.me/234${removeFirstZero(
                                    activeOrder?.shipping_details
                                      ?.alternative_phone
                                  )}`,
                                  "_blank"
                                );
                              }}
                              className="contact"
                            >
                              <IconButton
                                type="button"
                                className="icon_button_container small"
                              >
                                <PhoneIcon />
                              </IconButton>
                              <p>
                                {
                                  activeOrder?.shipping_details
                                    ?.alternative_phone
                                }
                              </p>
                            </div>
                          )}
                          <div
                            onClick={() => {
                              if (activeOrder?.customer?.email) {
                                window.open(
                                  `mailto:${activeOrder?.customer?.email}`,
                                  "_blank"
                                );
                              } else {
                                setEditContactModal(true);
                                setEditContactAction("email");
                              }
                            }}
                            className="contact"
                          >
                            <IconButton
                              type="button"
                              className="icon_button_container small"
                            >
                              <MAil01Icon />
                            </IconButton>
                            <p>{activeOrder?.customer?.email || "Add email"}</p>
                          </div>
                          {activeOrder?.customer?.phone && (
                            <div
                              onClick={() => {
                                window.open(
                                  `https://wa.me/234${removeFirstZero(
                                    activeOrder?.customer?.phone
                                  )}`,
                                  "_blank"
                                );
                              }}
                              className="contact"
                            >
                              <IconButton
                                type="button"
                                className="icon_button_container small"
                              >
                                <WhatsappIcon2Icon />
                              </IconButton>
                              <p className="green">Send message</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="product_display_container">
                  <div className="product_display_section section">
                    <p className="product_title">
                      Products ({activeOrder?.items.length})
                    </p>
                    {activeOrder?.items?.filter(
                      (item) => item.unavailable_quantity
                    )?.length ? (
                      <div className="unavailable_title">
                        <InfoCircleXLIcon stroke={"#F4A408"} />
                        <p>
                          {
                            activeOrder?.items?.filter(
                              (item) => item.unavailable_quantity
                            )?.length
                          }{" "}
                          product(s) requires your attention
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                    {rearrangeProducts(activeOrder?.items).map(
                      (item: OrderItemType, i: number) => {
                        if (viewAllProducts ? true : i < 3) {
                          return (
                            <div
                              key={i}
                              onClick={() => {
                                navigate(
                                  item.variant
                                    ? `/dashboard/products/variant/${item.variant}}`
                                    : `/dashboard/products/${item.id}`
                                );
                              }}
                              className={`second_single_product ${
                                item.unavailable_quantity
                                  ? "unavailable_product"
                                  : ""
                              }`}
                            >
                              <div className="order-item-details">
                                <div className="left_single">
                                  <img
                                    src={
                                      item.thumbnail_url &&
                                      item.thumbnail_url.includes("amazon")
                                        ? item.thumbnail_url
                                        : `${IMAGEURL}${item.thumbnail_url}`
                                    }
                                    alt="product"
                                  />
                                  <div className="text_side">
                                    <p className="name">{item.name}</p>
                                    <p className="quantity">
                                      {item.quantity} x{" "}
                                      {formatTransactionPrice(
                                        Number(item.price),
                                        data?.order?.currency_code
                                      )}
                                    </p>
                                    {item.unavailable_quantity ? (
                                      <p className="unavailable">
                                        Unavailable Stock Qty:{" "}
                                        {item.unavailable_quantity}
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                                <div className="right_single">
                                  <p className="total_amount">
                                    {formatTransactionPrice(
                                      Number(item.quantity) *
                                        Number(item.price),
                                      data?.order?.currency_code
                                    )}
                                  </p>
                                </div>
                              </div>
                              <p className="product-note">
                                Note: Please ensure that the product doesn’t
                                come creased as the last product I got had that
                                same issue and I had to now spend extra money to
                                get it sorted.
                              </p>
                            </div>
                          );
                        }
                      }
                    )}
                    {activeOrder?.items.length <= 3 ? (
                      ""
                    ) : (
                      <Button
                        onClick={() => {
                          setViewAllProducts(!viewAllProducts);
                        }}
                        className="view_btn"
                      >
                        View {viewAllProducts ? "less" : "all"} products
                      </Button>
                    )}
                  </div>

                  {activeOrder?.should_resolve === 1 &&
                    activeOrder?.order_history && (
                      <div className="resolve_order_box">
                        {resolveOrderList.map((item, i: number) => (
                          <Button
                            key={i}
                            variant={
                              item.value === "FULFIL" ? "contained" : "outlined"
                            }
                            onClick={() => {
                              setResolveOrderAction(item.value);
                              setOpenResolveModal(true);
                            }}
                            className={`${item.key} ${
                              item.value === "FULFIL"
                                ? "primary_styled_button"
                                : ""
                            } `}
                          >
                            {item.key}
                          </Button>
                        ))}
                      </div>
                    )}
                </div>

                {activeOrder?.note && (
                  <div className="section notes_setion">
                    <p className="title">Additional Note</p>
                    <p className="content">{parse(activeOrder?.note)}</p>
                  </div>
                )}
                {activeOrder?.transactions?.length ? (
                  <div className="transaction_section section">
                    <h3 className="title">Transactions</h3>
                    {activeOrder?.transactions?.map((item: any, i: number) => {
                      return (
                        <div className="single_transaction_box" key={i}>
                          <div className="top_side">
                            <h4>{item.method}</h4>
                            <p className="faint">
                              {formatTransactionPrice(
                                Number(
                                  item.is_customer_charged
                                    ? item.amount_settled
                                    : item?.amount
                                ),
                                data?.order?.currency_code
                              )}
                            </p>
                          </div>
                          <p className="date">
                            {moment(item.created_at).format("LLL")}
                          </p>
                        </div>
                      );
                    })}

                    {activeOrder?.refunds?.length &&
                    !activeOrder?.should_refund ? (
                      <div className="single_transaction_box">
                        <div className="top_side">
                          <h4>Amount Refunded</h4>
                          <p className="faint red">
                            -
                            {formatTransactionPrice(
                              calculateTotalAmount(activeOrder?.refunds),
                              data?.order?.currency_code
                            )}
                          </p>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {Number(activeOrder?.total) -
                      Number(activeOrder?.amount_paid) <
                      0 &&
                      !activeOrder?.should_refund && (
                        <div className="single_transaction_box">
                          <div className="top_side">
                            <h4>Amount Refunded</h4>
                            <p className="faint red">
                              -
                              {formatTransactionPrice(
                                Number(activeOrder?.total) -
                                  Number(activeOrder?.amount_paid),
                                data?.order?.currency_code
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  ""
                )}

                {Number(activeOrder?.total) - Number(activeOrder?.amount_paid) <
                  0 &&
                  activeOrder?.origin === "pos" && (
                    <div className="change_summary section">
                      <p>Change</p>
                      <p className="change">
                        {formatTransactionPrice(
                          Number(activeOrder?.total) -
                            Number(activeOrder?.amount_paid),
                          data?.order?.currency_code
                        )}
                      </p>
                    </div>
                  )}
              </div>
              <div className="right_section">
                <div className="payment_summary section">
                  <div className="summary_topic">
                    <p>Payment Summary</p>
                    {activeOrder?.order_history && (
                      <div className="right">
                        {activeOrder?.payment_status !== "PAID" &&
                          activeOrder?.origin !== "pos" && (
                            <Button
                              onClick={() => {
                                if (activeOrder?.should_resolve === 1) {
                                  showToast(
                                    "Resolve Order to continue",
                                    "warning"
                                  );
                                } else {
                                  handleDownloadInvoice();
                                }
                              }}
                              variant="contained"
                              className="primary_styled_button"
                            >
                              {isDownloadingInvoice ? (
                                <CircularProgress
                                  size="1rem"
                                  sx={{ color: "#009444" }}
                                />
                              ) : (
                                "Download Invoice"
                              )}
                            </Button>
                          )}
                        {activeOrder?.payment_status === "PAID" &&
                          activeOrder?.origin !== "pos" && (
                            <Button
                              onClick={() => {
                                if (activeOrder?.should_resolve === 1) {
                                  showToast(
                                    "Resolve Order to continue",
                                    "warning"
                                  );
                                } else {
                                  handleDownloadInvoice();
                                }
                              }}
                              variant="contained"
                              className="primary_styled_button"
                            >
                              {isDownloadingReceipt ? (
                                <CircularProgress
                                  size="1rem"
                                  sx={{ color: "#ffffff" }}
                                />
                              ) : (
                                "Download Receipt"
                              )}
                            </Button>
                          )}

                        {activeOrder?.origin === "pos" &&
                          activeOrder?.order_history && (
                            <Button
                              onClick={() => {
                                if (activeOrder?.should_resolve === 1) {
                                  showToast(
                                    "Resolve Order to continue",
                                    "warning"
                                  );
                                } else {
                                  handlePrint();
                                }
                              }}
                              variant="contained"
                              className="primary_styled_button"
                            >
                              Print Receipt
                            </Button>
                          )}
                      </div>
                    )}
                  </div>
                  <div className="payment_summary_container">
                    <div className="single_payment_summary">
                      <div className="top">
                        <p className="left bold">Sub Total</p>
                        <p className="amount">
                          {formatTransactionPrice(
                            totalValue,
                            data?.order?.currency_code
                          )}
                        </p>
                      </div>
                    </div>

                    {Number(activeOrder?.discount) !== 0 ||
                    activeOrder?.coupon_code ? (
                      <>
                        {" "}
                        {activeOrder?.coupon_code ? (
                          <div className="single_payment_summary ">
                            <div className="top">
                              <p className="left bold">Coupon</p>
                              <p className="amount ">
                                {activeOrder?.coupon_code}
                              </p>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="single_payment_summary">
                          <div className="top">
                            <p className="left bold">Discount</p>
                            {activeOrder?.discount_type === "fixed" && (
                              <p className="amount ">
                                <span></span>{" "}
                                {formatTransactionPrice(
                                  Number(activeOrder?.discount),
                                  activeOrder?.currency_code
                                )}
                              </p>
                            )}
                          </div>
                          {activeOrder?.discount_type === "percentage" && (
                            <div className="bottom">
                              <div className="text_flex">
                                <p className="light">
                                  % {Number(activeOrder?.discount)}
                                </p>
                                <p className="amount">
                                  <span></span>{" "}
                                  {formatTransactionPrice(
                                    Number(activeOrder?.discount_val),
                                    activeOrder?.currency_code
                                  )}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    <div className="single_payment_summary">
                      <div className="top">
                        <p className="left bold">Shipping Fee</p>
                      </div>
                      <div className="bottom">
                        <div className="text_flex">
                          <p className="light">
                            {activeOrder?.shipping_option
                              ? activeOrder?.shipping_option?.name
                              : "None selected"}
                          </p>
                          <p className="amount">
                            {formatTransactionPrice(
                              Number(activeOrder?.shipping_price),
                              activeOrder?.currency_code
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="single_payment_summary">
                      <div className="top">
                        <p className="left bold">Taxes</p>
                        <p className="amount">
                          {formatTransactionPrice(
                            Number(activeOrder?.tax || 0),
                            activeOrder?.currency_code
                          )}
                        </p>
                      </div>
                      {activeOrder?.taxes && activeOrder?.taxes.length ? (
                        <div className="bottom">
                          {activeOrder?.taxes.map((item, i: number) => {
                            return (
                              <div key={i} className="text_flex">
                                <p className="light">
                                  {item.name} - {`${item.percent}%`}
                                </p>
                                <p className="amount">
                                  {formatTransactionPrice(
                                    (Number(activeOrder?.sub_total) *
                                      Number(item.percent)) /
                                      100,
                                    data?.order?.currency_code
                                  )}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="single_payment_summary">
                      <div className="top">
                        <p className="left bold total">Total Amount</p>
                        <p className="amount total">
                          {formatTransactionPrice(
                            Number(activeOrder?.total),
                            activeOrder?.currency_code
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="payment_status_section section">
                  <div className="pendingAndPaidBox">
                    <div className="left">
                      <p className="stat_p">Payment Status</p>
                    </div>
                    <Chip
                      color={
                        translateOrderPaymentStatus(activeOrder?.payment_status)
                          ?.color
                      }
                      label={
                        translateOrderPaymentStatus(activeOrder?.payment_status)
                          ?.label
                      }
                    />
                  </div>

                  {/* bottom side */}
                  {activeOrder?.payment_status === "PAID" &&
                  activeOrder?.proof_urls &&
                  activeOrder?.order_history &&
                  activeOrder?.proof_urls?.length ? (
                    <Button
                      onClick={() => {
                        if (activeOrder?.should_resolve === 1) {
                          showToast("Resolve Order to continue", "warning");
                        } else {
                          setOpenConfirmModal(true);
                        }
                      }}
                      variant="outlined"
                      className=" confirm_btn"
                    >
                      View proof of payment
                    </Button>
                  ) : (
                    ""
                  )}
                  {activeOrder?.payment_status === "PENDING" &&
                    canManageOrder &&
                    activeOrder?.order_history && (
                      <Button
                        onClick={() => {
                          if (activeOrder?.should_resolve === 1) {
                            showToast("Resolve Order to continue", "warning");
                          } else {
                            setOpenConfirmModal(true);
                          }
                        }}
                        variant="contained"
                        className="primary_styled_button confirm_btn"
                      >
                        Confirm Bank Transfer
                      </Button>
                    )}
                  {activeOrder?.payment_status === "PARTIALLY_PAID" && (
                    <div className="amount_due_container">
                      <div className="due_flex">
                        <p>Amount Paid</p>
                        <p>
                          {formatTransactionPrice(
                            Number(activeOrder?.amount_paid),
                            activeOrder?.currency_code
                          )}
                        </p>
                      </div>
                      <div className="due_flex">
                        <p>Amount Due</p>
                        <p>
                          {formatTransactionPrice(
                            Number(activeOrder?.amount_due),
                            activeOrder?.currency_code
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  {(activeOrder?.payment_status === "UNPAID" ||
                    activeOrder?.payment_status === "PARTIALLY_PAID") &&
                    canManageOrder &&
                    activeOrder?.order_history && (
                      <div className="record_flex">
                        <Button
                          onClick={() => {
                            if (activeOrder?.should_resolve === 1) {
                              showToast("Resolve Order to continue", "warning");
                            } else {
                              setOpenModal(true);
                            }
                          }}
                          variant="contained"
                          className="primary_styled_button"
                        >
                          Record Payment
                        </Button>
                        <Button
                          onClick={() => {
                            if (activeOrder?.should_resolve === 1) {
                              showToast("Resolve Order to continue", "warning");
                            } else {
                              if (activeOrder?.customer) {
                                if (activeOrder?.customer?.phone) {
                                  setOpenRequestPayment(true);
                                } else {
                                  setEditContactModal(true);
                                  setEditContactAction("phone");
                                  setCheckContact(true);
                                }
                              } else {
                                showToast(
                                  "To proceed with your request, please provide the customer's information.",
                                  "warning",
                                  6000
                                );
                              }
                            }
                          }}
                          variant="outlined"
                        >
                          Request Payment
                        </Button>
                      </div>
                    )}
                </div>

                {activeOrder?.should_refund && activeOrder?.order_history && (
                  <div className="payment_status_section section">
                    <div className="pendingAndPaidBox">
                      <div className="left gap-4">
                        <CoinSwapIcon />
                        <div className="text_box">
                          <p className="pending_refund">Pending Refund</p>
                          <p className="small_p">
                            {formatTransactionPrice(
                              Number(activeOrder?.amount_paid) -
                                Number(activeOrder?.total),
                              data?.order?.currency_code
                            )}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          if (activeOrder?.should_resolve === 1) {
                            showToast("Resolve Order to continue", "warning");
                          } else {
                            setOpenRefund(true);
                          }
                        }}
                        variant="outlined"
                        className="small_btn"
                      >
                        I’ve Refunded
                      </Button>
                    </div>
                  </div>
                )}

                <ShippingSection
                  activeOrder={activeOrder}
                  openShippingWarning={openShippingWarning}
                  setOpenShippingWarning={setOpenShippingWarning}
                  setEditAddressAction={setEditAddressAction}
                  setEditAddressModal={setEditAddressModal}
                  setIsEditAddress={setIsEditAddress}
                  canManageOrder={canManageOrder}
                  setSelectCustomerModal={setSelectCustomerModal}
                  setOpenGeneralWarningMessage={setOpenGeneralWarningMessage}
                  setOpenGeneralWarningAction={setOpenGeneralWarningAction}
                  setOpenGeneralWarningModal={setOpenGeneralWarningModal}
                  handleInvoiceLimitExceeded={handleInvoiceLimitExceeded}
                  isRestricted={isRestricted}
                  isSubscriptionType={isSubscriptionType}
                />
              </div>
            </div>
          </div>

          <SuccesfulOrderEditModal
            openModal={openIsEditPendingModal}
            closeModal={() => {
              setOpenIsEditPendingModal(false);
            }}
            icon={<LargeWarningIcon />}
            btnAction={() => {
              setOpenConfirmModal(true);
            }}
            description_text={
              "To edit a pending order, you have to confirm or reject payment for the order first."
            }
            title={"Attention"}
            btnText={"Confirm Payment"}
            secondBtnText={"Reject Payment"}
            secondBtnAction={() => {
              setOpenIsRejectPaymentModal(true);
            }}
          />
          <RecordPaymentModal
            order_id={`${activeOrder?.id}`}
            customer_id={
              activeOrder?.customer ? `${activeOrder?.customer.id}` : ""
            }
            order={activeOrder}
            openModal={openModal}
            closeModal={() => {
              setOpenModal(false);
            }}
          />
          <ConfirmPaymentModal
            openModal={openConfirmModal}
            status={activeOrder?.payment_status}
            actionBtn1={() => {
              handleConfirmPendingPayment();
            }}
            actionBtn2={() => {
              if (activeOrder?.amount_paid !== "0.00") {
                actionOrderFnc("markAsPartiallyPaid");
              } else {
                actionOrderFnc("markAsUnpaid");
              }
            }}
            image={
              activeOrder?.proof_urls && activeOrder?.proof_urls?.length
                ? `${activeOrder?.proof_urls[0]}`
                : ""
            }
            closeModal={() => {
              setOpenConfirmModal(false);
            }}
          />
          <EditContactModal
            title={editContactAction}
            openModal={editContactModal}
            closeModal={() => {
              setEditContactModal(false);
            }}
            actionFnc={(val) => {
              editContactFunction(val);
            }}
          />
          <EditAddressModal
            title={editAddressAction}
            openModal={editAddressModal}
            order={isEditAddress ? activeOrder : null}
            closeModal={() => {
              setEditAddressModal(false);
            }}
            actionFnc={(val, callback) => {
              editAddressFunction(val, () => {
                callback && callback();
                setOpenShippingWarning(false);
              });
            }}
          />
          <SelectCustomerModal
            openModal={selectCustomerModal}
            order={activeOrder}
            closeModal={() => {
              setSelectCustomerModal(false);
            }}
          />
          <SuccesfulOrderEditModal
            openModal={openIsRejectPaymentModal}
            closeModal={() => {
              setOpenIsRejectPaymentModal(false);
            }}
            icon={<LargeWarningIcon />}
            btnAction={() => {
              if (activeOrder?.amount_paid !== "0.00") {
                actionOrderFnc("markAsPartiallyPaid");
              } else {
                actionOrderFnc("markAsUnpaid");
              }
            }}
            description_text={
              "Rejecting payment for a pending order marks the order as Unpaid or Partially Paid"
            }
            title={"Are you sure you want to reject this payment?"}
            btnText={"Reject Payment"}
            isError={true}
            secondBtnText={"Cancel"}
            secondBtnAction={() => {
              setOpenIsRejectPaymentModal(false);
              setOpenIsEditPendingModal(false);
            }}
          />
          <UpgradeModal
            openModal={openUpgradeModal}
            closeModal={() => setOpenUpgradeModal(false)}
            starter={isStarterUpgrade}
            pro={isProUpgrade}
            growth={isGrowthUpgrade}
            width={maxPlan ? "600px" : ""}
            title={
              isGrowthUpgrade
                ? `Send ${nextLimit} invoices with the Growth Plan`
                : `Send up to ${nextLimit} invoices or more with a higher Bumpa plan`
            }
            subtitle={`Send out invoices/receipts to all your customers, no matter their size.`}
            starterFeatures={[
              "Send up to 1,000 invoices/receipts",
              "Unlimited customer records",
              "Create 5 customer groups",
              "Get 100 messaging credits to send bulk SMS/Emails to customers",
            ]}
            proFeatures={[
              "Send up to 1,000 invoices/receipts",
              "Unlimited customer records",
              "Create 20 customer groups",
              "Get 200 messaging credits to send SMS/Emails to customers.",
            ]}
            growthFeatures={[
              "Send up to 5,000 invoices/receipts",
              "Unlimited customer records",
              "Create 100 customer groups",
              "Get 1,000 messaging credits to send SMS/Emails to customers.",
            ]}
            eventName="invoice"
          />
          {openGrowthModal && (
            <GrowthModal
              openModal={openGrowthModal}
              closeModal={() => {
                setOpenGrowthModal(false);
              }}
            />
          )}
          <MessageModal
            openModal={openGeneralWarningModal}
            extraClass={"increase_height"}
            closeModal={() => {
              setOpenGeneralWarningModal(false);
              setOpenGeneralWarningMessage("");
              setOpenGeneralWarningAction("");
            }}
            icon={<InfoIcon stroke="#5C636D" />}
            btnChild={
              <Button
                onClick={() => {
                  generalWarningFunction(openGeneralWarningAction);
                }}
                variant="contained"
                className="primary_styled_button"
              >
                Yes, continue
              </Button>
            }
            description={openGeneralWarningMessage}
          />
          <ConfirmResolveModal
            openModal={openResolveModal}
            closeModal={() => {
              setOpenResolveModal(false);
            }}
            currency_code={data?.order?.currency_code}
            totalAmountPaid={data?.order?.amount_paid}
            isLoading={loadResolve}
            btnAction={() => {
              resolveOrderFnc(resolveOrderAction);
            }}
            actionType={resolveOrderAction}
            itemList={data?.order?.items || []}
          />
        </>
      )}
    </>
  );
};

export default OrderDetails;
