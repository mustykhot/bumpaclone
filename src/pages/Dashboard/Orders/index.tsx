import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import {
  Button,
  Select,
  MenuItem,
  Chip,
  IconButton,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import "./style.scss";
import moment from "moment";
import Papa from "papaparse";
import { onMessageListener } from "firebase";
import order from "assets/images/order.png";
import { BoxNumberIcon } from "assets/Icons/BoxNumberIcon";
import { InvoiceNoteIcon } from "assets/Icons/InvoiceNoteIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { BankIcon } from "assets/Icons/BankIcon";
import { ExportCSVIcon } from "assets/Icons/ExportCSVIcon";
import { ShoppingBagIcon } from "assets/Icons/ShoppingBagIcon";
import { CoinsHand } from "assets/Icons/CoinsHand";
import { FileCheckIcon } from "assets/Icons/FileCheckIcon";
import { FileMinusIcon } from "assets/Icons/FileMinusIcon";
import { FillArrowIcon } from "assets/Icons/FillArrowIcon";
import ordernumberimg from "assets/images/ordernumberimg.png";
import { FluentWarningIcon } from "assets/Icons/FluentWarningIcon";
import jiji from "assets/images/origin/jiji.png";
import konga from "assets/images/origin/konga.png";
import facebook from "assets/images/origin/facebook.png";
import flutterwave from "assets/images/origin/flutterwave.png";
import instagramOrigin from "assets/images/origin/instagram.png";
import walkin from "assets/images/origin/walkin.png";
import jumia from "assets/images/origin/jumia.png";
import paystack from "assets/images/origin/paystack.png";
import physical from "assets/images/origin/physical.png";
import snapchat from "assets/images/origin/snapchat.png";
import { RefrshIcon } from "assets/Icons/RefreshIcon";
import twitter from "assets/images/origin/twitter.png";
import whatsapp from "assets/images/origin/whatsapp.png";
import EmptyResponse from "components/EmptyResponse";
import MessageModal from "components/Modal/MessageModal";
import InputField from "components/forms/InputField";
import InfoBox from "components/InfoBox";
import TableComponent from "components/table";
import PageUpdateModal from "components/PageUpdateModal";
import ErrorMsg from "components/ErrorMsg";
import { SummaryCard } from "components/SummaryCard";
import { UpgradeModal } from "components/UpgradeModal";
import DateRangeDropDown from "components/DateRangeDropDown";
import Loader from "components/Loader";
import { ViewNoteModal } from "./ViewNote";
import { PermissionsType } from "Models";
import { OrderType } from "Models/order";
import {
  API_URL,
  currencySymbols,
  ORDERSTATUS,
  PAGEUPDATEVERSIONS,
  SALESCHANNELFILTER,
  SHIPPINGSTATUS,
} from "utils/constants/general";
import {
  useActionOrdersMutation,
  useAllAnalyticsSummaryQuery,
  useCreateTransactionMutation,
  useDeleteOrdersMutation,
  useGetLoggedInUserQuery,
  useGetOrdersQuery,
  useGetStoreInformationQuery,
  useSetAppFlagMutation,
} from "services";
import {
  formatNumber,
  formatPrice,
  formatTransactionPrice,
  handleError,
  translateOrderPaymentStatus,
  translateOrderShippmentStatus,
  translateOrderStatus,
} from "utils";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { TransactionField } from "services/api.types";
import {
  selectCurrentStore,
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
  selectToken,
} from "store/slice/AuthSlice";
import { selectPermissions } from "store/slice/AuthSlice";
import { BulkRecordPaymentModal } from "./widgets/BulkRecordPayment/bulkRecordPaymentModal";
import { addOrderFilter, selectOrderFilters } from "store/slice/FilterSlice";
import { selectUserLocation } from "store/slice/AuthSlice";
import "./style.scss";
import { BootstrapTooltip } from "../Transactions/TransactionHistoryTable";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { set } from "date-fns";

const orderPageUpdates: { title: string; description: string }[] = [
  {
    title: "Reserve inventory",
    description:
      "Reserve items in the cart for a set period to prevent/minimise overselling. Inventory is temporarily held until the purchase is completed or the reservation time expires.",
  },
  {
    title: "Time to cancel",
    description:
      "Set a  time limit after which unpaid orders will be automatically cancelled if payment is not made. This will remove the item from reserved inventory and other customers can purchase.",
  },
];
const headCell = [
  {
    key: "image",
    name: "",
  },
  {
    key: "order",
    name: "Order ID & Name",
  },
  {
    key: "total",
    name: "Total",
  },
  {
    key: "status",
    name: "Status",
  },

  {
    key: "payment",
    name: "Payment",
  },

  {
    key: "shipping",
    name: "Shipping",
  },
  {
    key: "date",
    name: "Date",
  },
  {
    key: "action",
    name: "",
  },
];

// CSV Table
const tableHeaders = [
  "Order ID",
  "Customer",
  "Product",
  "Total",
  "Order Status",
  "Payment Status",
  "Shipping Status",
  "Sales Channel",
  "Date",
];

export const getOriginImage = (origin: string) => {
  switch (origin) {
    case "walk-in":
      return {
        image: walkin,
        name: "Physical Sale",
      };
    case "pos":
      return {
        image: walkin,
        name: "POS",
      };
    case "facebook":
      return {
        image: facebook,
        name: "Facebook",
      };
    case "flutterwave":
      return {
        image: flutterwave,
        name: "Flutterwave",
      };
    case "instagram":
      return {
        image: instagramOrigin,
        name: "Instagram",
      };
    case "jiji":
      return {
        image: jiji,
        name: "Jiji",
      };
    case "jumia":
      return {
        image: jumia,
        name: "Jumia",
      };
    case "konga":
      return {
        image: konga,
        name: "Konga",
      };
    case "paystack":
      return {
        image: paystack,
        name: "Paystack",
      };
    case "snapchat":
      return {
        image: snapchat,
        name: "Snapchat",
      };
    case "whatsapp":
      return {
        image: whatsapp,
        name: "Whatsapp",
      };
    case "others":
      return {
        image: physical,
        name: "Others",
      };
    case "website":
      return {
        image: physical,
        name: "Website",
      };
    case "twitter":
      return {
        image: twitter,
        name: "X/Twitter",
      };
    default:
      return {
        image: walkin,
        name: "Sale",
      };
  }
};

export const Orders = () => {
  const [selected, setSelected] = useState<string[] | number[]>([]);
  const [dataCount, setDataCount] = useState("25");
  const [loadDownload, setLoadDownload] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectBulk, setSelectBulk] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const location_id = searchParams.get("location_id");
  const userPermission: PermissionsType = useAppSelector(selectPermissions);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const isStaff = userPermission !== undefined;
  const canManageOrder = isStaff ? userPermission?.orders?.manage : true;
  const { data: userData } = useGetLoggedInUserQuery();
  const [setAppFlag, { isLoading: loadFlag }] = useSetAppFlagMutation();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [showOrderNumber, setShowOrderNumber] = useState(false);
  const [openNoteModal, setOpenNoteModal] = useState(false);
  // table actions
  const [idTobeDeleted, setIdTobeDeleted] = useState("");
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const [isGrowthUpgrade, setIsGrowthUpgrade] = useState(false);
  const [isStarterUpgrade, setIsStarterUpgrade] = useState(false);
  const [isExportUpgrade, setIsExportUpgrade] = useState(false);
  // Bulk actions
  const [bulkOrderStatus, setBulkOrderStatus] = useState("");
  const [bulkPaymentStatus, setBulkPaymentStatus] = useState("");
  const [bulkBankStatus, setBulkBankStatus] = useState("");
  const [bulkShippingStatus, setBulkShippingStatus] = useState("");
  const [openBankModal, setOpenBankModal] = useState(false);
  const [maxPlan, setMaxPlan] = useState(false);
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);
  const [openModalForBulkUnpaidOrders, setOpenModalForBulkUnpaidOrders] =
    useState(false);
  const orderFilters = useAppSelector(selectOrderFilters);
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const userLocation = useAppSelector(selectUserLocation);
  const { data, isLoading, isFetching, isError, refetch } = useGetOrdersQuery({
    limit: Number(dataCount),
    search: orderFilters?.search,
    page: orderFilters?.page,
    channel: orderFilters?.channel,
    should_resolve: orderFilters?.should_resolve,
    paid_status: orderFilters?.payment_status,
    status: orderFilters?.order_status,
    location_id: Number(location_id || userLocation?.id),
    shipping_status: orderFilters?.shipping_status,
    from_date: orderFilters?.date
      ? moment(new Date(orderFilters?.date[0]?.startDate)).format(
          "DD/MM/YYYYTHH:mm:ss"
        )
      : "",
    to_date: orderFilters?.date
      ? moment(new Date(orderFilters?.date[0]?.endDate)).format(
          "DD/MM/YYYYTHH:mm:ss"
        )
      : "",
  });

  const { data: storeData, isLoading: loadStore } =
    useGetStoreInformationQuery();

  const downloadCount = storeData?.store?.meta?.receipt?.download_count ?? 0;
  const maxDownloads = storeData?.store?.meta?.receipt?.max_download ?? 0;

  const { data: attentionOrders, refetch: refetchAttention } =
    useGetOrdersQuery({
      page: 1,
      should_resolve: "yes",
    });
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const deleteInBulk = async () => {
    try {
      setIsDeleteLoading(true);
      const productRequests = selected?.map((id) => {
        return deleteOrderFnc(`${id}`);
      });

      const responses = (await Promise.all(productRequests)).filter(
        (item) => item
      );
      if (responses?.length) {
        setSelected([]);
        showToast("Orders successfully deleted", "success");
        setOpenDeleteModal(false);
      }
    } catch (error) {
      showToast(
        "Failed to delete one or more order(s). Please try again.",
        "error"
      );
    } finally {
      setIsDeleteLoading(false);
    }
  };
  const updateAppFlag = async (isOrderNumber?: boolean) => {
    let payload: any;
    if (isOrderNumber) {
      payload = {
        ...userData?.app_flags,
        webapp_updates: {
          ...userData?.app_flags?.webapp_updates,
          order_number: true,
        },
      };
    } else {
      payload = {
        ...userData?.app_flags,
        webapp_updates: {
          ...userData?.app_flags?.webapp_updates,
          order_page: {
            version: PAGEUPDATEVERSIONS.ORDERSPAGE,
            status: true,
          },
        },
      };
    }

    try {
      let result = await setAppFlag(payload);
      if ("data" in result) {
        if (isOrderNumber) {
          setShowOrderNumber(false);
        } else {
          setOpenUpdateModal(false);
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
    if (isOrderNumber) {
      setShowOrderNumber(false);
    } else {
      setOpenUpdateModal(false);
    }
  };

  const {
    data: analytics,
    isLoading: analyticsLoading,
    refetch: refetchAnalytics,
  } = useAllAnalyticsSummaryQuery({
    type: "orders",
    location_id: userLocation?.id,
  });

  onMessageListener()
    .then((payload: any) => {
      refetch();
      refetchAttention();
      refetchAnalytics();
    })
    .catch((err) => {});

  const mergePDFs = async () => {
    setIsDownloadingInvoice(true);
    let pdfUrls = selectBulk.map((item) => item.shipping_slip);

    try {
      const fetchPromises = pdfUrls.map(async (url) => {
        const response = await fetch(url);
        const pdfBytes = await response.arrayBuffer();
        return pdfBytes;
      });

      const pdfBytesArray = await Promise.all(fetchPromises);

      const mergedPdf = await PDFDocument.create();

      for (const pdfBytes of pdfBytesArray) {
        const pdfDoc = await PDFDocument.load(pdfBytes, {
          ignoreEncryption: true,
        });

        const copiedPages = await mergedPdf.copyPages(
          pdfDoc,
          pdfDoc.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const mergedPdfBlob = new Blob([mergedPdfBytes], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(mergedPdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
    } catch (error) {
      showToast("Error downloading document", "error");
      setIsDownloadingInvoice(false);
    } finally {
      setIsDownloadingInvoice(false);
    }
  };

  const resetFilters = () => {
    dispatch(
      addOrderFilter({
        date: null,
        order_status: "",
        payment_status: "PAID,PARTIALLY_PAID",
        shipping_status: "",
        channel: "",
        search: "",
        should_resolve: "",
      })
    );
  };
  const resetActions = () => {
    setBulkOrderStatus("");
    setBulkPaymentStatus("");
    setBulkBankStatus("");
    setBulkShippingStatus("");
  };

  const [deleteOrders, { isLoading: loadDelete }] = useDeleteOrdersMutation();
  const [actionOrders, { isLoading: loadAction }] = useActionOrdersMutation();
  const [transaction, { isLoading: loadTransaction }] =
    useCreateTransactionMutation();

  const transactionFnc = async (payload: TransactionField) => {
    try {
      let result = await transaction(payload);
      if ("data" in result) {
        if (result.data.error) {
          showToast(result.data.error, "error");
        } else {
          if (typeof _cio !== "undefined") {
            _cio.track("web_bulk_order_edit", payload);
          }
        }
        setOpenBankModal(false);
      } else {
        handleError(result);
        setOpenBankModal(false);
      }
    } catch (error) {
      handleError(error);
      setOpenBankModal(false);
    }
  };

  const markAsPaidFnc = async (payload: TransactionField) => {
    try {
      let result = await transaction(payload);

      if ("data" in result) {
        if (result.data.error) {
          showToast(result.data.error, "error");
        } else {
          if (typeof _cio !== "undefined") {
            _cio.track("web_bulk_order_edit", payload);
          }
        }
        setOpenBankModal(false);
      } else {
        handleError(result);
        setOpenBankModal(false);
      }
    } catch (error) {
      handleError(error);
      setOpenBankModal(false);
    }
  };

  const actionOrderFnc = async (id: string, action: string, body?: any) => {
    try {
      let result = await actionOrders({ id, action, body });
      if ("data" in result) {
        if (result.data.error) {
          showToast(result.data.error, "error");
        } else {
          if (typeof _cio !== "undefined") {
            _cio.track("web_bulk_order_edit", { id, action, body });
          }
          setOpenDeleteModal(false);
        }
      } else {
        handleError(result);
      }
      setIdTobeDeleted("");
    } catch (error) {
      handleError(error);
      setIdTobeDeleted("");
    }
  };

  const deleteOrderFnc = async (id: string, callback?: () => void) => {
    try {
      let result = await deleteOrders(id);
      if ("data" in result) {
        if (result.data.error) {
          showToast(result.data.error, "error");
        } else {
          if (callback) {
            showToast("Deleted successfully", "success");
            setOpenDeleteModal(false);
            setIdTobeDeleted("");
          }
          return true;
        }
      } else {
        handleError(result);
      }
      callback && callback();
    } catch (error) {
      handleError(error);
      setIdTobeDeleted("");
    }
  };

  const bulkDelete = async () => {
    deleteInBulk();
  };

  const bulkAction = async (action: string, body?: any) => {
    if (action === "markAsPaid") {
      let preparedArray = selectBulk.filter(
        (item) => item.payment_status === "UNPAID"
      );
      if (preparedArray.length) {
        try {
          setIsUpdating(true);
          const orderRequests = preparedArray?.map((item) => {
            let prepare = {
              transaction_date: moment(new Date()).format("DD/MM/YYYY"),
              method: body.value,
              order_id: item.id,
              customer_id: item.customer ? item.customer.id : "",
              amount: item.grand_total,
            };
            return markAsPaidFnc(prepare);
          });

          const responses = await Promise.all(orderRequests);
          if (responses?.length) {
            showToast("Orders successfully updated", "success");
            setSelected([]);
            setSelectBulk([]);
            resetActions();
          }
        } catch (error) {
          showToast(
            "Failed to update one or more order(s). Please try again.",
            "error"
          );
        } finally {
          setIsUpdating(false);
        }
      } else {
        showToast("Select unpaid orders", "error", 8000);
        resetActions();
      }
    } else if (action === "markAsUnPaid") {
      let preparedArray = selectBulk.filter(
        (item) => item.payment_status === "PENDING"
      );
      if (preparedArray.length) {
        try {
          setIsUpdating(true);
          const orderRequests = preparedArray?.map((item) => {
            if (item.amount_paid === "0.00") {
              return actionOrderFnc(`${item.id}`, action, body);
            } else {
              return actionOrderFnc(`${item.id}`, "markAsPartiallyPaid", body);
            }
          });

          const responses = await Promise.all(orderRequests);
          if (responses?.length) {
            showToast("Orders successfully updated", "success");
            setSelected([]);
            setSelectBulk([]);
            resetActions();
          }
        } catch (error) {
          showToast(
            "Failed to update one or more order(s). Please try again.",
            "error"
          );
        } finally {
          setIsUpdating(false);
        }
      } else {
        showToast("Select pending payment orders", "error", 8000);
        resetActions();
      }
    } else if (action === "changeStatus") {
      let preparedArray = selectBulk.filter(
        (item) =>
          item.payment_status === "PAID" || item.order_status === "COMPLETED"
      );
      if (preparedArray.length) {
        showToast("You can't cancel a paid or completed  order", "error", 8000);
        resetActions();
      } else {
        try {
          setIsUpdating(true);
          const orderRequests = selectBulk?.map((item) => {
            return actionOrderFnc(`${item.id}`, action, body);
          });

          const responses = await Promise.all(orderRequests);
          if (responses?.length) {
            showToast("Orders successfully updated", "success");
            setSelected([]);
            setSelectBulk([]);
            resetActions();
          }
        } catch (error) {
          showToast(
            "Failed to update one or more order(s). Please try again.",
            "error"
          );
        } finally {
          setIsUpdating(false);
        }
      }
    } else {
      try {
        setIsUpdating(true);
        const orderRequests = selected?.map((item) => {
          return actionOrderFnc(`${item}`, action, body);
        });

        const responses = await Promise.all(orderRequests);
        if (responses?.length) {
          showToast("Orders successfully updated", "success");
          setSelected([]);
          setSelectBulk([]);
          resetActions();
        }
      } catch (error) {
        showToast(
          "Failed to update one or more order(s). Please try again.",
          "error"
        );
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const bulkConfirmBank = async () => {
    let preparedArray = selectBulk.filter(
      (item) => item.payment_status === "PENDING"
    );
    if (preparedArray.length) {
      try {
        setIsUpdating(true);
        const orderRequests = preparedArray?.map((item) => {
          let prepare = {
            order_id: item.id,
            transaction_date: moment(new Date()).format("L"),
            amount: item.amount_due,
            method: "BANK",
            customer_id: item.customer.id,
          };
          return transactionFnc(prepare);
        });

        const responses = await Promise.all(orderRequests);
        if (responses?.length) {
          showToast("Orders successfully updated", "success");
          setSelectBulk([]);
          setSelected([]);
          resetActions();
        }
      } catch (error) {
        showToast(
          "Failed to update one or more order(s). Please try again.",
          "error"
        );
      } finally {
        setIsUpdating(false);
      }
    } else {
      showToast("Select orders with pending payment status", "error", 8000);
      resetActions();
    }
  };

  const handleDownloadCSV = async () => {
    try {
      setLoadDownload(true);
      const response = await fetch(
        `${API_URL}orders?location_id=${userLocation?.id}&limit=1000000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const data = await response.json();
      if (data && data?.orders?.data && data?.orders?.data.length) {
        let orderList = data.orders.data;
        const csvData = [
          tableHeaders,
          ...orderList.map((row: OrderType) => [
            row.id,
            row.customer?.name,
            `${row?.items?.map((item: any) => item.name).join(", ")}`,
            row.grand_total,
            row.status,
            row.payment_status,
            row.shipping_status,
            row.origin,
            moment(row.order_date).format("ll"),
          ]),
        ];
        const csv = Papa.unparse(csvData);

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "orders.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setLoadDownload(false);
        setOpenDownloadModal(false);
      }
    } catch (error) {
      setLoadDownload(false);
      showToast("Something went wrong", "error");
    }
  };

  const handleDownload = () => {
    if (isSubscriptionExpired) {
      setIsExportUpgrade(true);
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
    }
    if (
      isSubscriptionType === "growth" ||
      isSubscriptionType === "pro" ||
      isSubscriptionType === "trial"
    ) {
      setOpenDownloadModal(true);
    } else {
      setIsExportUpgrade(true);
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
    }
  };
  const handleMerge = () => {
    if (
      isSubscriptionExpired ||
      isSubscriptionType == "starter" ||
      isSubscriptionType == "free"
    ) {
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
      return;
    }

    const availableDonwloads = maxDownloads - downloadCount;
    const remainingDownloads = availableDonwloads - selected.length;

    if (isSubscriptionType === "growth") {
      mergePDFs();
    } else if (isSubscriptionType === "pro") {
      if (remainingDownloads < 0) {
        setIsGrowthUpgrade(true);
        setOpenUpgradeModal(true);
      } else {
        mergePDFs();
      }
    } else if (isSubscriptionType === "trial") {
      if (remainingDownloads < 0) {
        setIsProUpgrade(true);
        setOpenUpgradeModal(true);
      } else {
        mergePDFs();
      }
    } else {
      mergePDFs();
    }
  };

  const handleSelectClick = () => {
    setIsProUpgrade(true);
    setOpenUpgradeModal(true);
  };

  useEffect(() => {
    if (userData) {
      if (
        userData?.app_flags?.webapp_updates?.order_page?.version >=
        PAGEUPDATEVERSIONS.ORDERSPAGE
      ) {
        if (userData?.app_flags?.webapp_updates?.order_page?.status) {
          setOpenUpdateModal(false);
        } else {
          setOpenUpdateModal(true);
        }
      } else {
        setOpenUpdateModal(true);
      }

      if (userData?.app_flags?.webapp_updates?.order_number) {
        setShowOrderNumber(false);
      } else {
        setShowOrderNumber(true);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (attentionOrders?.orders?.data.length === 0) {
      dispatch(
        addOrderFilter({
          should_resolve: "",
        })
      );
    }
  }, [attentionOrders]);

  useEffect(() => {
    setSelectBulk([]);
    setSelected([]);
  }, [userLocation?.id]);

  return (
    <>
      {(loadAction || loadTransaction || isUpdating) && <Loader />}
      <MessageModal
        openModal={openDownloadModal}
        closeModal={() => {
          setOpenDownloadModal(false);
        }}
        icon={<ExportCSVIcon stroke="#5C636D" />}
        btnChild={
          <Button
            onClick={() => {
              handleDownloadCSV();
            }}
            className="primary_styled_button"
            variant="contained"
          >
            {loadDownload ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Yes, Download"
            )}
          </Button>
        }
        description="Download all Orders"
      />
      <MessageModal
        openModal={openDeleteModal}
        closeModal={() => {
          setOpenDeleteModal(false);
        }}
        icon={<TrashIcon stroke="#5C636D" />}
        btnChild={
          <Button
            disabled={loadDelete || isDeleteLoading}
            onClick={() => {
              if (idTobeDeleted) {
                deleteOrderFnc(idTobeDeleted, () => {
                  setOpenDeleteModal(false);
                  setSelectBulk([]);
                  setSelected([]);
                });
              } else {
                bulkDelete();
              }
            }}
            className="error"
          >
            {loadDelete || isDeleteLoading ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Yes, delete"
            )}
          </Button>
        }
        description="Are you sure you want to delete selected orders?"
      />
      <MessageModal
        openModal={openBankModal}
        closeModal={() => {
          setOpenBankModal(false);
          resetActions();
        }}
        icon={<BankIcon />}
        btnChild={
          <Button
            className="primary_styled_button"
            onClick={() => {
              bulkConfirmBank();
            }}
            variant="contained"
          >
            {loadTransaction ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Confirm bank transfer"
            )}
          </Button>
        }
        description="Are you sure you want to confirm bank transfer?
        This cannot be undone."
      />
      <BulkRecordPaymentModal
        actionFnc={(val: string) => {
          bulkAction("markAsPaid", { value: val });
        }}
        openModal={openModalForBulkUnpaidOrders}
        closeModal={() => {
          setOpenModalForBulkUnpaidOrders(false);
          resetActions();
        }}
      />
      {openUpgradeModal && isExportUpgrade ? (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => {
            setIsExportUpgrade(false);
            setOpenUpgradeModal(false);
          }}
          pro={isProUpgrade}
          width={"800px"}
          title={`Export your Orders into a CSV.`}
          subtitle={`View your sales breakdown better in a CSV at any time`}
          proFeatures={[
            "Download all your order details into a CSV",
            "No order downloads from different location",
            "Get and compare Order Analytics by specific dates",
          ]}
          growthFeatures={[
            "Download all your order details into a CSV",
            "Download orders from different store locations",
            "Get and compare Order Analytics by specific dates",
          ]}
          eventName="export-order-csv"
        />
      ) : (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => setOpenUpgradeModal(false)}
          pro={isProUpgrade}
          growth={isGrowthUpgrade}
          title={`Edit Multiple Orders At Once on Pro or Growth`}
          subtitle={`Save time & edit multiple order with one click.`}
          proFeatures={[
            "Mark multiple products as Shipped, Delivered or Paid at once.",
            "Export Order CSV",
            "Send up to 2,000 invoices/reciepts monthly",
            "Cannot breakdown orders by location",
          ]}
          growthFeatures={[
            "Mark multiple products as Shipped, Delivered or Paid at once.",
            "Export Order CSV",
            "Send up to 5,000 invoices/receipts monthly",
            "View order breakdown in multiple store locations",
          ]}
          eventName="bulk-order-action"
        />
      )}
      <div
        className={`pd_orders ${
          data &&
          data?.orders?.data.length === 0 &&
          !orderFilters?.search &&
          !orderFilters?.channel &&
          !orderFilters?.order_status &&
          !orderFilters?.shipping_status &&
          !orderFilters?.payment_status &&
          !orderFilters?.date &&
          !orderFilters?.should_resolve
            ? "empty"
            : ""
        }`}
      >
        {data &&
        data?.orders?.data.length === 0 &&
        !orderFilters?.search &&
        !isFetching &&
        !isLoading &&
        !orderFilters?.channel &&
        !orderFilters?.order_status &&
        !orderFilters?.shipping_status &&
        !orderFilters?.payment_status &&
        !orderFilters?.date &&
        !orderFilters?.should_resolve ? (
          canManageOrder ? (
            <EmptyResponse
              message="Create new order"
              image={order}
              extraText="You can create and record orders here ."
              btn={
                <Button
                  sx={{
                    padding: "12px 24px",
                  }}
                  variant="contained"
                  className="primary_styled_button"
                  startIcon={<PlusIcon />}
                  onClick={() => {
                    navigate("create");
                  }}
                >
                  Create Order
                </Button>
              }
            />
          ) : (
            <ErrorMsg error={"Unauthorized access"} />
          )
        ) : (
          <div className="order_container">
            {showOrderNumber && (
              <InfoBox
                title="Order ID is now Order Number"
                text="We’ve updated order ID and changed it to order number."
                color="green"
                isCancel
                isLoading={loadFlag}
                cancelAction={() => {
                  updateAppFlag(true);
                }}
                icon={<BoxNumberIcon />}
              />
            )}
            {attentionOrders?.orders?.data?.length ? (
              <InfoBox
                text="You have some orders that require your attention. Please attend to them."
                color="yellow"
                btnText="Resolve Orders"
                iconColor="#F4A408"
                icon={<FluentWarningIcon />}
                btnAction={() => {
                  dispatch(
                    addOrderFilter({
                      date: null,
                      order_status: "",
                      payment_status: "PAID,PARTIALLY_PAID",
                      shipping_status: "",
                      channel: "",
                      search: "",
                      page: 1,
                      should_resolve: "yes",
                    })
                  );
                }}
              />
            ) : (
              ""
            )}

            <div className="title_section">
              <h3 className="name_of_section">Orders</h3>

              {canManageOrder && (
                <div className="btn_flex">
                  <Button
                    startIcon={<InvoiceNoteIcon />}
                    variant={"outlined"}
                    onClick={() => {
                      setOpenNoteModal(true);
                    }}
                  >
                    Invoice Note
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleDownload}
                    className="thick_border"
                    startIcon={<ExportCSVIcon />}
                  >
                    Export CSV
                  </Button>

                  <Button
                    startIcon={<PlusIcon />}
                    component={Link}
                    to="create"
                    variant={"contained"}
                    className="primary_styled_button"
                  >
                    Create Order
                  </Button>
                </div>
              )}
            </div>
            <div className="summary_section">
              {analyticsLoading ? (
                [1, 2, 3, 4].map((item) => (
                  <div key={item} className="summary_skeleton">
                    <Skeleton animation="wave" width={"100%"} />
                    <Skeleton animation="wave" width={"100%"} />
                    <Skeleton animation="wave" width={"100%"} />
                  </div>
                ))
              ) : (
                <>
                  <SummaryCard
                    count={
                      analytics && analytics[0] && analytics[0]?.value
                        ? formatNumber(Number(analytics[0]?.value))
                        : 0
                    }
                    handleClick={() => {
                      resetFilters();
                    }}
                    title={
                      analytics && analytics[0] && analytics[0]?.title
                        ? analytics[0]?.title
                        : "Total Orders"
                    }
                    icon={<ShoppingBagIcon />}
                    color={"green"}
                  />
                  <SummaryCard
                    count={
                      analytics && analytics[1] && analytics[1]?.value
                        ? analytics[1]?.value
                        : 0
                    }
                    title={
                      analytics && analytics[1] && analytics[1]?.title
                        ? analytics[1]?.title
                        : "Amount Owed"
                    }
                    icon={<CoinsHand />}
                    color={"red"}
                    handleClick={() => {
                      resetFilters();
                      dispatch(
                        addOrderFilter({
                          payment_status: "UNPAID,PARTIALLY_PAID",
                          page: 1,
                        })
                      );
                    }}
                  />
                  <SummaryCard
                    count={
                      analytics && analytics[2] && analytics[2]?.value
                        ? formatNumber(Number(analytics[2]?.value))
                        : 0
                    }
                    title={
                      analytics && analytics[2] && analytics[2]?.title
                        ? analytics[2]?.title
                        : "Completed Orders"
                    }
                    icon={<FileCheckIcon />}
                    handleClick={() => {
                      resetFilters();
                      dispatch(
                        addOrderFilter({
                          order_status: "COMPLETED",
                          page: 1,
                        })
                      );
                    }}
                    color={"blue"}
                  />{" "}
                  <SummaryCard
                    count={
                      analytics && analytics[3] && analytics[3]?.value
                        ? formatNumber(Number(analytics[3]?.value))
                        : 0
                    }
                    title={
                      analytics && analytics[3] && analytics[3]?.title
                        ? analytics[3]?.title
                        : "Unpaid Orders"
                    }
                    handleClick={() => {
                      resetFilters();

                      dispatch(
                        addOrderFilter({
                          payment_status: "UNPAID",
                          page: 1,
                        })
                      );
                    }}
                    icon={<FileMinusIcon />}
                    color={"yellow"}
                  />
                </>
              )}
            </div>

            <div className="table_section">
              <div className="table_action_container">
                <div className="left_section">
                  {selected.length ? (
                    <div className="show_selected_actions">
                      <p>Selected: {selected.length}</p>
                      {canManageOrder && (
                        <Button
                          onClick={() => {
                            setOpenDeleteModal(true);
                          }}
                          startIcon={<TrashIcon />}
                        >
                          Delete
                        </Button>
                      )}

                      {canManageOrder &&
                        (isSubscriptionExpired ||
                        isSubscriptionType === "free" ||
                        isSubscriptionType === "starter" ? (
                          <Select
                            displayEmpty
                            onClick={handleSelectClick}
                            className="my-select dark large"
                            inputProps={{ "aria-label": "Without label" }}
                            renderValue={(selected) => {
                              return `Bank Transfer`;
                            }}
                            readOnly
                          />
                        ) : (
                          <Select
                            displayEmpty
                            value={bulkBankStatus}
                            onChange={(e) => {
                              setBulkBankStatus(e.target.value);
                              if (e.target.value === "confirm") {
                                setOpenBankModal(true);
                              } else if (e.target.value === "reject") {
                                bulkAction("markAsUnpaid");
                              }
                            }}
                            className="my-select dark large"
                            inputProps={{ "aria-label": "Without label" }}
                            renderValue={(selected) => {
                              return `Bank Transfer`;
                            }}
                          >
                            <MenuItem value="confirm">Confirm</MenuItem>
                            <MenuItem value="reject">Reject</MenuItem>
                          </Select>
                        ))}

                      {canManageOrder &&
                        (isSubscriptionExpired ||
                        isSubscriptionType === "free" ||
                        isSubscriptionType === "starter" ? (
                          <Select
                            displayEmpty
                            onClick={handleSelectClick}
                            className="my-select dark large"
                            inputProps={{ "aria-label": "Without label" }}
                            renderValue={(selected) => {
                              return `Mark shipping as: `;
                            }}
                            readOnly
                          />
                        ) : (
                          <Select
                            displayEmpty
                            value={bulkShippingStatus}
                            onChange={(e) => {
                              setBulkShippingStatus(e.target.value);
                              if (e.target.value === "delivered") {
                                bulkAction("markAsDelivered");
                              } else if (e.target.value === "shipped") {
                                bulkAction("markAsShipped");
                              } else if (e.target.value === "returned") {
                                bulkAction("markAsReturned");
                              }
                            }}
                            className="my-select dark large"
                            inputProps={{ "aria-label": "Without label" }}
                            renderValue={(selected) => {
                              return `Mark shipping as: ${selected}`;
                            }}
                          >
                            <MenuItem disabled value="">
                              Shipping status
                            </MenuItem>
                            <MenuItem value="delivered">Delivered</MenuItem>
                            <MenuItem value="shipped">Shipped</MenuItem>
                            <MenuItem value="returned">Returned</MenuItem>
                          </Select>
                        ))}
                      {canManageOrder &&
                        (isSubscriptionExpired ||
                        isSubscriptionType === "free" ||
                        isSubscriptionType === "starter" ? (
                          <Select
                            displayEmpty
                            onClick={handleSelectClick}
                            className="my-select dark large"
                            inputProps={{ "aria-label": "Without label" }}
                            renderValue={(selected) => {
                              return `Mark payment as: `;
                            }}
                            readOnly
                          />
                        ) : (
                          <Select
                            displayEmpty
                            value={bulkPaymentStatus}
                            onChange={(e) => {
                              setBulkPaymentStatus(e.target.value);
                              if (e.target.value === "paid") {
                                setOpenModalForBulkUnpaidOrders(true);
                              } else if (e.target.value === "unpaid") {
                                bulkAction("markAsUnpaid");
                              }
                            }}
                            className="my-select dark large"
                            inputProps={{ "aria-label": "Without label" }}
                            renderValue={(selected) => {
                              return `Mark payment as: ${selected}`;
                            }}
                          >
                            <MenuItem disabled value="">
                              Payment status
                            </MenuItem>
                            <MenuItem value="paid">Paid</MenuItem>
                          </Select>
                        ))}
                      <Button
                        onClick={handleMerge}
                        className={`filter_button `}
                      >
                        {isDownloadingInvoice ? (
                          <CircularProgress
                            size="1rem"
                            sx={{ color: "#222d37" }}
                          />
                        ) : (
                          "Download Slips"
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="filter_container">
                      <IconButton
                        onClick={() => {
                          refetch();
                          refetchAttention();
                          refetchAnalytics();
                        }}
                        className="icon_button_container medium"
                      >
                        <RefrshIcon />
                      </IconButton>
                      <Button
                        onClick={() => {
                          resetFilters();
                          resetActions();
                        }}
                        className={`filter_button `}
                      >
                        Clear Filters
                      </Button>
                      <DateRangeDropDown
                        origin={"left"}
                        setCustomState={(val: any) => {
                          dispatch(
                            addOrderFilter({
                              date: val,
                              page: 1,
                            })
                          );
                        }}
                        action={
                          <Button
                            variant="outlined"
                            endIcon={<FillArrowIcon stroke="#5C636D" />}
                            className="drop_btn"
                          >
                            {orderFilters && orderFilters?.date
                              ? `${moment(
                                  orderFilters?.date[0]?.startDate
                                ).format("D/MM/YYYY")} - ${moment(
                                  orderFilters?.date[0]?.endDate
                                ).format("D/MM/YYYY")}`
                              : "Select date range"}
                          </Button>
                        }
                      />
                      <Select
                        displayEmpty
                        value={orderFilters?.order_status}
                        onChange={(e) => {
                          dispatch(
                            addOrderFilter({
                              order_status: e.target.value,
                              page: 1,
                            })
                          );
                        }}
                        className="my-select dark"
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem disabled value="">
                          Order status
                        </MenuItem>
                        {ORDERSTATUS.map((item, i) => {
                          return (
                            <MenuItem key={i} value={item.value}>
                              {item.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      <Select
                        displayEmpty
                        value={orderFilters?.payment_status}
                        onChange={(e) => {
                          dispatch(
                            addOrderFilter({
                              payment_status: e.target.value,
                              page: 1,
                            })
                          );
                        }}
                        className="my-select dark large"
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem disabled value="">
                          Payment status
                        </MenuItem>
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="PAID,PARTIALLY_PAID">
                          Paid, Partially Paid
                        </MenuItem>
                        <MenuItem value="PAID">Paid</MenuItem>
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="PARTIALLY_PAID">
                          Partially Paid
                        </MenuItem>

                        <MenuItem value="UNPAID">Unpaid</MenuItem>
                      </Select>
                      <Select
                        displayEmpty
                        value={orderFilters?.shipping_status}
                        onChange={(e) => {
                          dispatch(
                            addOrderFilter({
                              shipping_status: e.target.value,
                              page: 1,
                            })
                          );
                        }}
                        className="my-select dark"
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem disabled value="">
                          Shipping status
                        </MenuItem>
                        {SHIPPINGSTATUS.map((item, i) => {
                          return (
                            <MenuItem key={i} value={item.value}>
                              {item.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {attentionOrders?.orders?.data?.length ? (
                        <Button
                          onClick={() => {
                            dispatch(
                              addOrderFilter({
                                date: null,
                                order_status: "",
                                payment_status: "PAID,PARTIALLY_PAID",
                                shipping_status: "",
                                channel: "",
                                search: "",
                                page: 1,
                                should_resolve: "yes",
                              })
                            );
                          }}
                          className={`filter_button attention ${
                            orderFilters?.should_resolve ? "active" : ""
                          }`}
                          startIcon={<FluentWarningIcon />}
                        >
                          Attention
                          <span className="red_dot"></span>
                        </Button>
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                </div>
                {selected.length ? (
                  ""
                ) : (
                  <div className="search_container">
                    {/**/}
                    <Select
                      displayEmpty
                      value={orderFilters?.channel}
                      onChange={(e) => {
                        dispatch(
                          addOrderFilter({
                            channel: e.target.value,
                            page: 1,
                          })
                        );
                      }}
                      className="my-select dark"
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem disabled value="">
                        Sales Channel
                      </MenuItem>
                      {SALESCHANNELFILTER.map((item, i) => {
                        return (
                          <MenuItem key={i} value={item.value}>
                            {item.key}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <InputField
                      type={"text"}
                      containerClass="search_field"
                      value={orderFilters?.search}
                      onChange={(e: any) => {
                        dispatch(
                          addOrderFilter({
                            search: e.target.value,
                            page: 1,
                          })
                        );
                      }}
                      placeholder="Search"
                      suffix={<SearchIcon />}
                    />
                  </div>
                )}
              </div>
              {orderFilters?.date && !isFetching && !isLoading && (
                <div className="display_summary_block">
                  <p className="date">
                    Order Summary:
                    <span>
                      {` ${moment(
                        new Date(orderFilters?.date[0]?.startDate)
                      ).format("DD/MM/YYYY")} - ${moment(
                        new Date(orderFilters?.date[0]?.endDate)
                      ).format("DD/MM/YYYY")}`}
                    </span>
                  </p>

                  <div className="btn_flex">
                    <div className="total">
                      <p>
                        Total Orders: <span>{data?.summary?.count}</span>
                      </p>
                    </div>
                    {data?.summary?.data?.length
                      ? data?.summary?.data?.map((item) => (
                          <>
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
                              title={`This is the total amount of ${item?.currency_code} order items, excluding shipping fees or taxes`}
                              placement="top-start"
                            >
                              <div className="total">
                                <p>
                                  SubTotal Amount:
                                  <span>
                                    {formatTransactionPrice(
                                      Number(item?.subtotal || 0),
                                      item?.currency_code
                                    )}
                                  </span>
                                </p>
                                <InfoCircleIcon stroke="#5c636d" />
                              </div>
                            </BootstrapTooltip>
                          </>
                        ))
                      : ""}
                  </div>
                </div>
              )}
              <TableComponent
                isError={isError}
                isLoading={isLoading || isFetching}
                page={orderFilters?.page}
                setPage={(val) => {
                  dispatch(
                    addOrderFilter({
                      page: val,
                    })
                  );
                }}
                headCells={headCell}
                selectMultiple={true}
                selected={selected}
                showPagination={true}
                dataCount={dataCount}
                setDataCount={setDataCount}
                setSelected={setSelected}
                selectBulk={selectBulk}
                setSelectBulk={setSelectBulk}
                handleClick={(row: any) => {
                  navigate(`${row.id}`);
                }}
                meta={{
                  current: data?.orders?.current_page,
                  perPage: 10,
                  totalPage: data?.orders?.last_page,
                }}
                tableData={data?.orders?.data.map((row, i) => ({
                  ...row,
                  image: (
                    <img
                      src={getOriginImage(row.origin).image}
                      alt={getOriginImage(row.origin).name}
                      width={28}
                      height={28}
                      className="image_table_item"
                    />
                  ),
                  order: (
                    <div className="order_name">
                      <h4>
                        #{row.order_number}
                        {row.customer ? ` • ${row.customer?.name}` : ""}
                      </h4>
                      <p>
                        {row.items && row.items.length
                          ? `${row.items[0]?.name} ${
                              row.items.length > 1
                                ? `+${row.items.length - 1} items`
                                : ""
                            }  `
                          : ""}
                      </p>
                    </div>
                  ),
                  total: formatTransactionPrice(
                    Number(row.total),
                    row.currency_code
                  ),
                  status: (
                    <Chip
                      color={translateOrderStatus(row.status)?.color}
                      label={translateOrderStatus(row.status)?.label}
                    />
                  ),
                  order_staus: row.status,
                  shipping_staus: row.shipping_status,
                  payment_staus: row.payment_status,
                  payment: (
                    <Chip
                      color={
                        translateOrderPaymentStatus(row.payment_status)?.color
                      }
                      label={
                        translateOrderPaymentStatus(row.payment_status)?.label
                      }
                    />
                  ),
                  shipping: (
                    <Chip
                      color={
                        translateOrderShippmentStatus(row.shipping_status)
                          ?.color
                      }
                      label={
                        translateOrderShippmentStatus(row.shipping_status)
                          ?.label
                      }
                    />
                  ),
                  date: `${moment(row.created_at).calendar()}`,
                  action: (
                    <div className="flex gap-[28px] justify-end">
                      {canManageOrder ? (
                        row.payment_status === "UNPAID" ||
                        row.payment_status === "PENDING" ? (
                          <IconButton
                            onClick={(e) => {
                              setIdTobeDeleted(`${row.id}`);
                              setOpenDeleteModal(true);
                              e.stopPropagation();
                            }}
                            type="button"
                            className="icon_button_container trash"
                          >
                            <TrashIcon />
                          </IconButton>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  ),
                  id: row.id,
                }))}
              />
            </div>
          </div>
        )}
      </div>
      <ViewNoteModal
        openModal={openNoteModal}
        closeModal={() => {
          setOpenNoteModal(false);
        }}
      />
      <PageUpdateModal
        updates={orderPageUpdates}
        imageUrl={ordernumberimg}
        openModal={openUpdateModal}
        isLoading={loadFlag}
        size={"large"}
        btnText="View Settings"
        btnAction={() => {
          navigate("/dashboard/store/inventory-settings");
        }}
        closeModal={() => {
          updateAppFlag();
        }}
      />
    </>
  );
};
