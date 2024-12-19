import {
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  Skeleton,
} from "@mui/material";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { ApexOptions } from "apexcharts";
import { ReactNode, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckVerifiedIcon } from "assets/Icons/CheckVerifiedIcon";
import { CopyIcon } from "assets/Icons/CopyIcon";
import { ChevronRight } from "assets/Icons/ChevronRight";
import { ClearIcon } from "assets/Icons/ClearIcon";
import { CoinsHandIcon } from "assets/Icons/CoinsHandIcon";
import { FillArrowIcon } from "assets/Icons/FillArrowIcon";
import { GlobeIcon } from "assets/Icons/GlobeIcon";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { InfoCircleXLIcon } from "assets/Icons/InfoCircleXLIcon";
import { HelpCircleIcon } from "assets/Icons/Sidebar/HelpCircleIcon";
import { SaleIcon } from "assets/Icons/Sidebar/SaleIcon";
import { ShopingIcon } from "assets/Icons/Sidebar/ShopingIcon";
import { TagIcon } from "assets/Icons/Sidebar/TagIcon";
import { UserIcon } from "assets/Icons/Sidebar/UserIcon";
import { TrendUpIcon } from "assets/Icons/TrendUpIcon";
import instagram from "assets/images/instagram.png";
import { PackageIcon } from "assets/Icons/PackageIcon";
import { BuildingIcon } from "assets/Icons/BuildingIcon";

import ReferralCoin from "assets/images/ReferralCoin.svg";
import ReferralUpdateHome from "assets/images/ReferralUpdateHome.svg";
import TerminalBannerImage from "assets/images/terminal-banner-image.svg";
import DateRangeDropDown from "components/DateRangeDropDown";
import EmptyResponse from "components/EmptyResponse";
import ErrorMsg from "components/ErrorMsg";
import { GrowthModal } from "components/GrowthModal";
import { JoyRideComponent } from "components/JoyRideComponent";
import PageUpdateModal from "components/PageUpdateModal";
import { GrowthJoyRideComponent } from "components/JoyRideComponent/GrowthJoyRideComponent";
import { SummaryCard } from "components/SummaryCard";
import TableComponent from "components/table";
import { UpgradeModal } from "components/UpgradeModal";
import { AllTodosModal } from "./Widgets/AllTodos";
import RenewButton from "../Subscription/RenewButton";
import ActivateFreeTrialModal from "./Widgets/ActivateFreeTrialModal";
import FreeTrialExpiryModal from "./Widgets/FreeTrialExpiryModal";
import WebsiteReadyModal from "./Widgets/WebsiteReadyModal";
import InstagramList from "./InstagramList";
import { getOriginImage } from "../Orders";
import SetupModal from "./Widgets/StartingModal";
import { StartTourModal } from "./Widgets/StartTourModal/StartTourModal";

import { useCopyToClipboardHook } from "hooks/useCopyToClipboardHook";
import { OrderType } from "Models/order";
import moment from "moment";
import { KYCFlow } from "pages/Dashboard/KYC/KYCFlow";
import { TerminalActivationFlow } from "pages/Dashboard/Terminal/TerminalActivationFlow";
import {
  useDisconnectMetaMutation,
  useGetCheckoutTerminalQuery,
  useGetMetaIntegrationQuery,
  useGetTodosQuery,
  useSetAppFlagMutation,
  useGetLoggedInUserQuery,
  useGetIntegrationScriptQuery,
  useGetOrdersQuery,
  useSalesAnalyticsQuery,
  useSetMaintenanceModeMutation,
  useStatshomeQuery,
} from "services";
import { homeStatsKeys, TodosType } from "services/api.types";
import {
  useGetInstagramConversationQuery,
  useGetInstagramMessageInformationQuery,
} from "services/messenger.api";
import {
  selectCurrentStore,
  selectCurrentUser,
  selectIsFreeTrial,
  selectIsFreeTrialExpired,
  selectIsFreeTrialExpiring,
  selectIsSubscriptionCancelled,
  selectIsSubscriptionExpired,
  selectIsSubscriptionExpiring,
  selectIsSubscriptionType,
  selectIsWithinNoticePeriod,
  selectPermissions,
  selectRemainingDays,
  selectRemainingFreeTrialDays,
  selectUserLocation,
  setStoreDetails,
} from "store/slice/AuthSlice";
import {
  selectConversationList,
  selectMetaData,
  selectShowIgDm,
  selectWebhookMessage,
  setConversationList,
  setMetaData,
  setShowIgDm,
} from "store/slice/InstagramSlice";
import {
  selectKycDisplayServiceRestoredBanner,
  selectKycUptime,
} from "store/slice/KycServiceStatusSlice";
import {
  handleVerificationNextStep,
  selectKYCStatus,
  setKYCStatus,
} from "store/slice/KycSlice";
import { setIsMaintenanceModeEnabled } from "store/slice/MaintenanceSlice";
import {
  selectIsFirstLogin,
  selectIsGrowthTour,
  selectIsTour,
  setIsFirstLogin,
  setIsGrowthTour,
} from "store/slice/NotificationSlice";
import { setMaintenanceModeStatus } from "store/slice/ProfileSlice";
import { startTerminalFlow } from "store/slice/TerminalSlice";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  formatNumber,
  formatPrice,
  getCurrencyFnc,
  handleError,
  translateOrderPaymentStatus,
  translateOrderShippmentStatus,
  translateOrderStatus,
} from "utils";
import {
  dashboardBarChartOption,
  homePieOptions,
} from "utils/analyticsOptions";
import {
  getFbeV2Url,
  thisYearEnd,
  thisYearStart,
} from "utils/constants/general";

import { addOrderFilter, addProductFilter } from "store/slice/FilterSlice";
import "./style.scss";

export const BusinessInfo = ({
  title,
  icon,
  amount,
  loading = false,
}: {
  amount: string;
  title: string;
  icon?: ReactNode;
  loading?: boolean;
}) => {
  return (
    <div className="pd_single_business_info">
      {loading ? (
        <>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </>
      ) : (
        <>
          {icon && <div className="icon_box">{icon}</div>}
          <p className="title">{title}</p>
          <p className="amount">{amount}</p>{" "}
        </>
      )}
    </div>
  );
};

const headCell = [
  {
    key: "image",
    name: "",
  },
  {
    key: "order",
    name: "Order Number & Name",
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
];

export const Home = () => {
  const selectedMetaData = useAppSelector(selectMetaData);
  const selectedIgState = useAppSelector(selectShowIgDm);
  const selectedConversationList = useAppSelector(selectConversationList);
  const selectedWebhookMessage = useAppSelector(selectWebhookMessage);
  const pageAccessToken = selectedMetaData?.integration
    ?.page_access_token as string;
  const pageId = selectedMetaData?.integration?.page_id as string;
  const isSubscriptionCancelled = useAppSelector(selectIsSubscriptionCancelled);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpiring = useAppSelector(selectIsSubscriptionExpiring);
  const isWithinNoticePeriod = useAppSelector(selectIsWithinNoticePeriod);
  const remainingDays = useAppSelector(selectRemainingDays);
  const daysText = remainingDays === 1 ? "day" : "days";
  const isFreeTrial = useAppSelector(selectIsFreeTrial);
  const isFreeTrialExpired = useAppSelector(selectIsFreeTrialExpired);
  const isFreeTrialExpiring = useAppSelector(selectIsFreeTrialExpiring);
  const remainingFreeTrialDays = useAppSelector(selectRemainingFreeTrialDays);
  const freeTrialdaysText = remainingFreeTrialDays === 1 ? "day" : "days";
  const [openRenewBox, setOpenRenewBox] = useState(true);
  const [completeOnboardingBanner, setCompleteOnboardingBanner] =
    useState(false);
  const [openSetupModal, setOpenSetupModal] = useState(false);
  const [openGrowthModal, setOpenGrowthModal] = useState(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [openFreeTrialExpiryModal, setOpenFreeTrialExpiryModal] =
    useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const [overviewFilter, setOverviewFilter] = useState("month");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [barWidth, setBarWidth] = useState<any>(undefined);
  const [messageInformationSkip, setMessageInformationSkip] = useState(true);
  const [messageId, setMessageId] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [dateRange, setDateRange] = useState<any>([
    {
      startDate: thisYearStart,
      endDate: thisYearEnd,
      key: "selection",
    },
  ]);
  const { data: myPixel, isLoading: myPixelLoad } =
    useGetIntegrationScriptQuery({ integration_type: "facebook_pixel" });
  const [isSetupMode, setIsSetupMode] = useState(false);
  const userStore = useAppSelector(selectCurrentStore);
  const user = useAppSelector(selectCurrentUser);
  const store = useAppSelector(selectCurrentStore);

  const { handleCopyClick } = useCopyToClipboardHook(
    `${userStore?.referral_code}`
  );

  // Dashboard tour
  const isTour = useAppSelector(selectIsTour);
  const isFirstLogin = useAppSelector(selectIsFirstLogin);
  const [startTour, setStartTour] = useState(false);
  const [step, setStep] = useState(0);
  const [openTourModal, setOpenTourModal] = useState(false);

  // Growth Tour
  const isGrowthTour = useAppSelector(selectIsGrowthTour);
  const [startGrowthTour, setStartGrowthTour] = useState(false);
  const [growthStep, setGrowthStep] = useState(0);

  // KYC
  const kycUptime = useAppSelector(selectKycUptime);
  const kycDisplayServiceRestoredBanner = useAppSelector(
    selectKycDisplayServiceRestoredBanner
  );
  const kycStatus = useAppSelector(selectKYCStatus);
  const [openDowntimeBanner, setOpenDowntimeBanner] = useState(true);
  const [openRestoredBanner, setOpenRestoredBanner] = useState(true);
  const hasCompletedKyc = userStore?.cac !== null;

  // Onboarding Progress
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(1);
  const [isPaymentMethodCompleted, setIsPaymentMethodCompleted] =
    useState(false);
  const [isStoreInfoCompleted, setIsStoreInfoCompleted] = useState(false);
  const [isShippingCompleted, setIsShippingCompleted] = useState(false);
  const [isFirstProductCompleted, setIsFirstProductCompleted] = useState(false);
  const [isFreeTrialActivated, setIsFreeTrialActivated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(
    userStore?.meta?.onBoard?.completed
  );
  const [isOldUser, setIsOldUser] = useState(false);
  const [isFreeTrialActivatedExists, setIsFreeTrialActivatedExists] =
    useState(false);
  const [openActivateFreeTrialModal, setOpenActivateFreeTrialModal] =
    useState(false);
  const [websiteReadyModal, setWebsiteReadyModal] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteUrlLink, setWebsiteUrlLink] = useState("");
  const [hasSubscriptionIntent, setHasSubscriptionIntent] = useState(false);
  const totalOnboardingSteps = 4;

  // Referrals
  const hasActivatedReferral = userStore?.has_activated_referral !== 0;

  // App Flag
  const [setAppFlag, { isLoading: loadFlag }] = useSetAppFlagMutation();
  const { data: userData } = useGetLoggedInUserQuery();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [pieOptionsStyle, setPieOptionStyle] = useState<ApexOptions>({
    ...homePieOptions,
    chart: {
      id: "Sales-Channel",
    },
  });
  const [pieSeries, setPieSeries] = useState<any[]>([]);

  const {
    data: todosData,
    isLoading: loadTodo,
    isFetching: fetchTodo,
    refetch: refetchTodo,
  } = useGetTodosQuery();

  const userLocation = useAppSelector(selectUserLocation);

  const { data: meta, isLoading: metaLoad } = useGetMetaIntegrationQuery();
  const [disconnectMeta] = useDisconnectMetaMutation();
  const [series, setSeries] = useState<any>([]);
  const [showIgError, setShowIgError] = useState(false);
  const [showIgServerError, setShowIgServerError] = useState(false);
  const [conversationSkip, setConversationSkip] = useState(true);
  const isAdminUser = Number(user?.is_staff) === 0;
  const userPermission = useAppSelector(selectPermissions);
  const [isStaff, setIsStaff] = useState(false);
  const [showPixel, setShowPixel] = useState(false);
  const canViewAnalytics = isStaff ? userPermission?.analytics?.view : true;
  const canViewOrder = isStaff ? userPermission?.orders?.view : true;
  const canManageOrder = isStaff ? userPermission?.orders?.manage : true;
  const canManageProducts = isStaff ? userPermission?.products?.manage : true;
  const canManageMessaging = isStaff ? userPermission?.messaging?.manage : true;
  const [openViewAllTodosModal, setOpenViewAllTodosModal] = useState(false);
  const { data: statsHome, isLoading: homeStatsLoading } = useStatshomeQuery(
    userLocation?.id
  );

  const {
    data: IgData,
    isError: instagramError,
    error,
    isLoading: igLoading,
  } = useGetInstagramConversationQuery(
    {
      limit: 5,
      pageId,
      pageAccessToken,
    },
    { skip: conversationSkip, refetchOnMountOrArgChange: true }
  );

  const { data: singleMessageData } = useGetInstagramMessageInformationQuery(
    { pageAccessToken, messageId },
    { skip: messageInformationSkip }
  );

  const {
    data: transactionAnalytics,
    isLoading: transactionAnalyticsLoading,
    isFetching: transactionAnalyticsFetching,
  } = useSalesAnalyticsQuery({
    type: "transactions",
    from: dateRange
      ? moment(new Date(dateRange[0]?.startDate)).format("Y-MM-DD")
      : "",
    to: dateRange
      ? moment(new Date(dateRange[0]?.endDate)).format("Y-MM-DD")
      : "",
    location_id: userLocation?.id,
  });

  const {
    data: analyticsSales,
    isLoading: analyticsSalesLoading,
    isFetching: analyticsSalesFetching,
  } = useSalesAnalyticsQuery({
    type: "sales",
    dataset: "sales_channels",
    from: dateRange
      ? moment(new Date(dateRange[0]?.startDate)).format("Y-MM-DD")
      : "",
    to: dateRange
      ? moment(new Date(dateRange[0]?.endDate)).format("Y-MM-DD")
      : "",
    location_id: userLocation?.id,
  });

  const {
    data: analyticsOverview,
    isLoading: analyticsOverviewLoading,
    isFetching: analyticsOverviewFetching,
  } = useSalesAnalyticsQuery({
    type: "sales",
    dataset: "overview",
    from: dateRange
      ? moment(new Date(dateRange[0]?.startDate)).format("Y-MM-DD")
      : "",
    to: dateRange
      ? moment(new Date(dateRange[0]?.endDate)).format("Y-MM-DD")
      : "",
    location_id: userLocation?.id,
  });

  const [barStyleOptions, setBarStyleOptions] = useState<ApexOptions>({
    ...dashboardBarChartOption,
    chart: {
      id: "Sales",
    },
  });

  const { data, isLoading, isFetching, isError } = useGetOrdersQuery({
    limit: 10,
    page: 1,
    location_id: userLocation?.id,
    paid_status: "PAID",
  });
  const dispatch = useAppDispatch();

  const [setMaintenanceMode, { isLoading: isMaintenanceLoading }] =
    useSetMaintenanceModeMutation();

  const handleMaintenaceMode = async () => {
    let payload = {
      status: false,
    };
    try {
      let result = await setMaintenanceMode(payload);
      if ("data" in result) {
        showToast("Maintenance mode updated", "success");
        dispatch(
          setMaintenanceModeStatus(result?.data?.store?.online as boolean)
        );
        dispatch(setStoreDetails(result?.data?.store));
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const setBarSeriesOption = (transactionAnalytics: any) => {
    if (transactionAnalytics) {
      setSeries([
        {
          name: "Online Sales",
          data: transactionAnalytics?.data?.online_transactions?.current_period?.data?.map(
            (item: any) => Number(item.value)
          ),
        },
        {
          name: "Offline Sales",
          data: transactionAnalytics?.data?.offline_transactions?.current_period?.data?.map(
            (item: any) => Number(item.value)
          ),
        },
      ]);
      setBarStyleOptions({
        ...barStyleOptions,
        xaxis: {
          ...barStyleOptions.xaxis,
          categories:
            transactionAnalytics?.data.offline_transactions?.current_period?.data?.map(
              (item: any) => item.dateLabel
            ),
        },
      });
    }
  };

  const getTodoIconAndLink = (todoItem: TodosType, action: "icon" | "link") => {
    if (action === "link") {
      switch (todoItem.action.domain) {
        case "orders":
          if (todoItem.action.filter_field === "shipping_status") {
            dispatch(
              addOrderFilter({
                date: null,
                order_status: "",
                payment_status: "",
                channel: "",
                search: "",
                should_resolve: "",
                shipping_status: todoItem.action.filter_value,
                page: 1,
              })
            );
          } else if (todoItem.action.filter_field === "payment_status") {
            dispatch(
              addOrderFilter({
                date: null,
                order_status: "",
                channel: "",
                search: "",
                should_resolve: "",
                shipping_status: "",
                payment_status: todoItem.action.filter_value,
                page: 1,
              })
            );
          }
          return "/dashboard/orders";
        case "products":
          dispatch(
            addProductFilter({
              search: "",
              status: "",
              min_stock: "",
              collection: "",
              max_stock: todoItem.action.filter_value,
              page: 1,
            })
          );
          return "/dashboard/products";
        case "store":
          return "/dashboard/store/store-information/edit";
        case "bank":
          return "/dashboard/store/bankdetails";
        case "orderShipping":
          dispatch(
            addOrderFilter({
              shipping_status: todoItem.action.filter_value,
              page: 1,
            })
          );
          return "/dashboard/orders";
        case "account":
          return "/dashboard/profile";
        default:
          return "";
      }
    } else {
      switch (todoItem.action.domain) {
        case "orders":
          return <ShopingIcon className="todo_icon" />;
        case "products":
          return <PackageIcon className="todo_icon" />;
        case "store":
          return <BuildingIcon className="todo_icon" />;
        case "account":
          return <UserIcon className="todo_icon" />;
        case "orderShipping":
          return <PackageIcon className="todo_icon" />;
        case "firstAction":
          return <PackageIcon className="todo_icon" />;
        case "bank":
          return <BuildingIcon className="todo_icon" />;
        default:
          return <CoinsHandIcon className="todo_icon" />;
      }
    }
  };

  const handleOnboardingProgressStep = () => {
    setOpenSetupModal(true);
  };

  const getOnboardingProgressContent = (step: number) => {
    switch (step) {
      case 1:
        return "Next Step: Add payment method";
      case 2:
        return "Next Step: Complete store information";
      case 3:
        return "Next Step: Add shipping prices on your website";
      case 4:
        return "Final Step: Add products to your store";
      default:
        return "";
    }
  };

  const onboardingProgressValue =
    (currentOnboardingStep / totalOnboardingSteps) * 100;

  const queryParams = new URLSearchParams(location.search);
  const fromGrowth = queryParams.get("fromGrowth");
  const proUpgrade = queryParams.get("proUpgrade");
  const exploreWebApp = queryParams.get("exploreWebApp");
  const launchWebsite = queryParams.get("launchWebsite");
  const fromTerminalModal = queryParams.get("fromTerminalModal");

  useEffect(() => {
    if (meta?.integration) {
      dispatch(setShowIgDm(true));
      dispatch(setMetaData(meta));
      if (typeof mixpanel !== "undefined") {
        mixpanel.track("web_connect_meta", meta?.integration);
      }
      if (typeof _cio !== "undefined") {
        _cio.track("web_connect_meta", meta?.integration);
      }
    } else {
      dispatch(setShowIgDm(false));
    }

    // eslint-disable-next-line
  }, [meta?.integration]);

  useEffect(() => {
    if (userPermission !== undefined) {
      setIsStaff(true);
    } else {
      setIsStaff(false);
    }
  }, [userPermission]);

  useEffect(() => {
    if (pageId && pageAccessToken) {
      setConversationSkip(false);
    }
  }, [pageAccessToken, pageId]);

  useEffect(() => {
    if (
      analyticsSales &&
      analyticsSales.data &&
      analyticsSales.data?.chart &&
      analyticsSales.data.chart?.data?.length
    ) {
      let top5Channel = [...analyticsSales.data.chart.data].sort(
        (a: any, b: any) => b.value - a.value
      );
      setPieOptionStyle({
        ...pieOptionsStyle,
        // colors: top5Channel.map((item: any) => item.color).slice(0, 5),
        labels: top5Channel.map((item: any) => item.channel_label).slice(0, 5),
      });
      let series = top5Channel.map((item: any) =>
        Number(Number(item.value).toFixed(2))
      );
      setPieSeries(series.slice(0, 5));
    } else {
      setPieSeries([]);
    }
    // eslint-disable-next-line
  }, [analyticsSales]);

  useEffect(() => {
    if (exploreWebApp) {
      setOpenSetupModal(false);
      if (screenWidth > 1300) {
        dispatch(setIsFirstLogin(true));
      }
    }
  }, [exploreWebApp]);

  useEffect(() => {
    if (launchWebsite) {
      setOpenSetupModal(true);
      if (screenWidth > 1300) {
        dispatch(setIsFirstLogin(true));
      }
    }
  }, [launchWebsite]);

  useEffect(() => {
    if (
      (isFreeTrialExpired ||
        (isFreeTrialExpiring &&
          remainingFreeTrialDays !== null &&
          remainingFreeTrialDays <= 7)) &&
      hasCompletedOnboarding
    ) {
      setOpenFreeTrialExpiryModal(true);
    }
  }, [
    isFreeTrialExpired,
    isFreeTrialExpiring,
    remainingFreeTrialDays,
    hasCompletedOnboarding,
  ]);

  useEffect(() => {
    if (isTour) {
      if (screenWidth > 1300) {
        setStartTour(true);
      }
    }
    // eslint-disable-next-line
  }, [isTour]);

  useEffect(() => {
    if (fromGrowth) {
      dispatch(setIsGrowthTour(true));
    }
  }, [fromGrowth]);

  useEffect(() => {
    if (fromTerminalModal) {
      dispatch(startTerminalFlow());
    }
  }, [fromTerminalModal]);

  useEffect(() => {
    setTimeout(() => {
      if (fromGrowth) {
        queryParams.delete("fromGrowth");
      } else if (proUpgrade) {
        queryParams.delete("proUpgrade");
      } else if (exploreWebApp) {
        queryParams.delete("exploreWebApp");
      } else if (launchWebsite) {
        queryParams.delete("launchWebsite");
      } else if (fromTerminalModal) {
        queryParams.delete("fromTerminalModal");
      }
      const newUrl = `${window.location.origin}${window.location.pathname}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      window.history.replaceState(null, "", newUrl);
    }, 1000);
    // eslint-disable-next-line
  }, [fromGrowth, proUpgrade, exploreWebApp, launchWebsite, fromTerminalModal]);

  useEffect(() => {
    if (isGrowthTour) {
      if (screenWidth > 1300) {
        setStartGrowthTour(true);
      }
    } else {
      setStartGrowthTour(false);
    }

    // eslint-disable-next-line
  }, [isGrowthTour]);

  useEffect(() => {
    if (screenWidth <= 700) {
      setBarWidth(750);
    }
  }, [screenWidth]);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isFirstLogin) {
      setOpenTourModal(true);
    }
  }, [isFirstLogin]);

  useEffect(() => {
    if (userStore?.meta?.onBoard) {
      const {
        bank = false,
        payment_method = false,
        completed_store_info = false,
        hasShipping = false,
        created_first_product = false,
        completed = false,
        subscription_intent = null,
      } = userStore.meta.onBoard;

      const isPaymentMethodCompleted = bank && payment_method;
      const isStoreInfoCompleted = completed_store_info;
      const isShippingCompleted = hasShipping;
      const isFirstProductCompleted = created_first_product;
      const completedOnboarding = completed;
      const subscriptionIntent = subscription_intent !== null;

      setIsPaymentMethodCompleted(isPaymentMethodCompleted);
      setIsStoreInfoCompleted(isStoreInfoCompleted);
      setIsShippingCompleted(isShippingCompleted);
      setIsFirstProductCompleted(isFirstProductCompleted);
      setHasCompletedOnboarding(completedOnboarding);
      setHasSubscriptionIntent(subscriptionIntent);

      if (!completedOnboarding) {
        setCompleteOnboardingBanner(true);
        if (!isPaymentMethodCompleted) {
          setCurrentOnboardingStep(1);
        } else if (!isStoreInfoCompleted) {
          setCurrentOnboardingStep(2);
        } else if (!isShippingCompleted) {
          setCurrentOnboardingStep(3);
        } else if (!isFirstProductCompleted) {
          setCurrentOnboardingStep(4);
        }
      } else {
        setCompleteOnboardingBanner(false);
        updateOnboardingAttributes();
      }
    } else {
      setCompleteOnboardingBanner(false);
      setIsPaymentMethodCompleted(false);
      setIsStoreInfoCompleted(false);
      setIsShippingCompleted(false);
      setIsFirstProductCompleted(false);
      setHasCompletedOnboarding(false);
      setHasSubscriptionIntent(false);
    }
  }, [userStore, completeOnboardingBanner]);

  const updateOnboardingAttributes = () => {
    if (typeof _cio !== "undefined") {
      _cio.identify({
        id: user?.email,
        web_onboarding_complete: true,
      });
    }

    if (typeof mixpanel !== "undefined") {
      mixpanel.people.set("web_onboarding_complete", true);
    }
  };

  useEffect(() => {
    if (userStore?.subscription?.[0]) {
      const { has_activated_trial } = userStore.subscription[0];
      setIsFreeTrialActivated(has_activated_trial ?? false);
      setIsFreeTrialActivatedExists(has_activated_trial !== undefined);
    } else {
      setIsFreeTrialActivated(false);
      setIsFreeTrialActivatedExists(false);
    }
  }, [userStore]);

  useEffect(() => {
    const oldUser = userStore?.meta?.onBoard?.subscription_intent === undefined;
    const shouldEnableMaintenanceButton = hasCompletedOnboarding || oldUser;
    setIsOldUser(oldUser);
    dispatch(setIsMaintenanceModeEnabled(shouldEnableMaintenanceButton));
  }, [userStore, hasCompletedOnboarding, dispatch]);

  useEffect(() => {
    if (userStore?.meta?.onBoard?.basic_setup === false) {
      navigate("/setup-store");
    }
  }, [userStore, navigate]);

  useEffect(() => {
    setBarSeriesOption(transactionAnalytics);
    // eslint-disable-next-line
  }, [transactionAnalytics]);

  const disconnectMetaFnc = async () => {
    await disconnectMeta();
  };

  useEffect(() => {
    if (instagramError && error) {
      if ("data" in error) {
        if (error?.data !== undefined) {
          const data = JSON.parse(JSON.stringify(error?.data));
          if (data?.error?.code === 190 || !pageAccessToken) {
            setShowIgError(true);
            dispatch(setShowIgDm(false));
            disconnectMetaFnc();
          } else if (data?.error?.code === 1) {
            setShowIgServerError(true);
          }
        }
      }
    }
  }, [instagramError, error]);

  useEffect(() => {
    if (IgData) {
      const newCopy = [...IgData?.data];
      dispatch(setConversationList(newCopy));
    }
  }, [IgData]);

  useEffect(() => {
    if (messageId && pageAccessToken) {
      setMessageInformationSkip(false);
    }
  }, [messageId, pageAccessToken]);

  useEffect(() => {
    if (selectedWebhookMessage) {
      setMessageId(selectedWebhookMessage?.message?.mid);
    }
  }, [selectedWebhookMessage]);

  useEffect(() => {
    if (singleMessageData && !isLoading && selectedConversationList) {
      if ("from" in singleMessageData) {
        const dataFrom = JSON.parse(
          JSON.stringify((singleMessageData as { from: any })?.from)
        );

        if (
          selectedConversationList?.participants?.data[0]?.id !== dataFrom?.id
        ) {
          const newSelectedConversationList = JSON.parse(
            JSON.stringify(selectedConversationList)
          );
          const newConversation = newSelectedConversationList?.find(
            (item: any) => item?.participants?.data[1]?.id === dataFrom?.id
          );

          if (newConversation !== undefined) {
            const newMessagesCopyList = JSON.parse(
              JSON.stringify(newConversation)
            );
            newMessagesCopyList?.messages?.data?.unshift(singleMessageData);

            newSelectedConversationList.unshift(newMessagesCopyList);
            const newArray = newSelectedConversationList
              ?.map((item: any, index: number) => {
                if (
                  item?.participants?.data[1]?.id === dataFrom?.id &&
                  index !== 0
                ) {
                  return undefined;
                }
                return item;
              })
              .filter((item: any) => item !== undefined);

            dispatch(setConversationList(newArray));
          }
        }
      }
    }
  }, [singleMessageData]);

  useEffect(() => {
    if (
      user &&
      user.bvn_verified_at === null &&
      isAdminUser &&
      (hasCompletedOnboarding || isOldUser)
    ) {
      handleNextStep();
    }
  }, []);

  const handleStartMetaConnection = () => {
    if (
      isSubscriptionType === "growth" ||
      isSubscriptionType === "pro" ||
      isSubscriptionType === "trial"
    ) {
      startMetaConnection();
    } else {
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
    }
  };

  const startMetaConnection = async () => {
    const prep = {
      name: store?.name || "",
      url_link: store?.url_link || "",
      id: store?.id || "",
    };
    const fbeV2Url = getFbeV2Url(prep);
    window.open(fbeV2Url, "_self");
  };

  useEffect(() => {
    if (
      myPixel &&
      myPixel?.integration?.script &&
      !myPixel?.integration?.status
    ) {
      setShowPixel(true);
    }
  }, [myPixel]);

  const handleNextStep = () => {
    if (!user?.bvn_verified_at) {
      dispatch(
        handleVerificationNextStep({
          currentStep: "verifyIdentity",
          nextModal: "verifyIdentity",
        })
      );
    } else if (!user?.nin_verified_at) {
      dispatch(
        handleVerificationNextStep({
          currentStep: "bvn",
          nextModal: "nin",
        })
      );
    } else if (user?.desired_kyc_tier === 2 && !userStore?.cac) {
      dispatch(
        handleVerificationNextStep({
          currentStep: "nin",
          nextModal: "updateBusinessName",
        })
      );
    }
  };

  const updateAppFlag = async () => {
    let payload = {
      ...userData?.app_flags,
      webapp_updates: {
        ...userData?.app_flags?.webapp_updates,
        home_page: {
          version: 1,
          status: true,
        },
      },
    };
    try {
      let result = await setAppFlag(payload);
      if ("data" in result) {
        setOpenUpdateModal(false);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
    setOpenUpdateModal(false);
  };

  useEffect(() => {
    if (userData && userStore?.has_activated_referral === 0) {
      if (userData?.app_flags?.webapp_updates?.home_page?.version === 1) {
        if (userData?.app_flags?.webapp_updates?.home_page?.status) {
          setOpenUpdateModal(false);
        } else {
          setOpenUpdateModal(true);
        }
      } else {
        setOpenUpdateModal(true);
      }
    }
  }, [userData, userStore]);

  const { data: checkoutTerminal, isLoading: checkoutTerminalLoading } =
    useGetCheckoutTerminalQuery();

  const hasTerminal = checkoutTerminal?.success;

  return (
    <>
      <div className="pd_home">
        {/* Page Update Modal */}
        <PageUpdateModal
          openModal={openUpdateModal}
          isLoading={loadFlag}
          imageUrl={ReferralUpdateHome}
          title={"Bumpa Referral is now live"}
          description={
            "You can now refer other fellow business owners and earn amazing rewards."
          }
          size={"small"}
          closeModal={() => {
            updateAppFlag();
          }}
          btnText="View Referrals"
          btnAction={() => {
            navigate("/dashboard/referrals?fromHomeReferral=true");
            updateAppFlag();
          }}
        />
        {/* tour */}
        <JoyRideComponent
          setIsStart={setStartTour}
          setStep={setStep}
          isStart={startTour}
          step={step}
        />
        {/* growth tour */}
        <GrowthJoyRideComponent
          setIsStart={setStartGrowthTour}
          setStep={setGrowthStep}
          isStart={startGrowthTour}
          step={growthStep}
        />
        {/* start tour modal */}
        <StartTourModal
          btnAction={() => {
            if (screenWidth > 1300) {
              setStartTour(true);
            }
          }}
          closeModal={() => {
            setOpenTourModal(false);
            dispatch(setIsFirstLogin(false));
          }}
          openModal={openTourModal}
        />
        {/* Onboarding modal */}
        <SetupModal
          openModal={openSetupModal}
          isPaymentMethodCompleted={isPaymentMethodCompleted}
          isStoreInfoCompleted={isStoreInfoCompleted}
          isShippingCompleted={isShippingCompleted}
          isFirstProductCreated={isFirstProductCompleted}
          isFreeTrialActivated={isFreeTrialActivated}
          closeModal={() => {
            setOpenSetupModal(false);
          }}
          onboardingComplete={() => {
            setWebsiteUrl(userStore && userStore.url ? userStore.url : "");
            setWebsiteUrlLink(
              userStore && userStore.url_link ? userStore.url_link : ""
            );
            setWebsiteReadyModal(true);
          }}
        />

        {/* Upgrade modals */}
        <GrowthModal
          openModal={openGrowthModal}
          closeModal={() => {
            setOpenGrowthModal(false);
          }}
        />
        {openUpgradeModal && (
          <UpgradeModal
            openModal={openUpgradeModal}
            closeModal={() => setOpenUpgradeModal(false)}
            pro={isProUpgrade}
            title={`Sell faster on Instagram`}
            subtitle={`Connect your Instagram DMs to Bumpa & sell faster.`}
            proFeatures={[
              "Receive Instagram DMs on Bumpa & Sell faster",
              "Share up to 500 invoices/receipts on Instagram",
              "Add up to 500 products to your store",
            ]}
            growthFeatures={[
              "Receive Instagram DMs on Bumpa & Sell faster",
              "Share unlimited invoices/receipts on Instagram",
              "Add unlimited products to your store",
            ]}
            eventName="meta"
          />
        )}

        {showPixel && (
          <div className="warning info">
            <p className="warning_text">
              <InfoCircleXLIcon className="info_icon" />
              There has been an update to Facebook pixels API, please reconnect
              your Facebook Pixels with the updated integration code.
            </p>
            <Button
              className="btn"
              onClick={() => navigate("/dashboard/apps?mypixel=true")}
            >
              Reconnect Facebook Pixels
            </Button>
          </div>
        )}
        {/* KYC Modals*/}
        <KYCFlow />

        {/*Onboarding Modals*/}
        <ActivateFreeTrialModal
          openModal={openActivateFreeTrialModal}
          closeModal={() => {
            setOpenActivateFreeTrialModal(false);
          }}
        />
        <WebsiteReadyModal
          openModal={websiteReadyModal}
          closeModal={() => {
            setWebsiteReadyModal(false);
          }}
          url={websiteUrl}
          urlLink={websiteUrlLink}
        />
        <FreeTrialExpiryModal
          openModal={openFreeTrialExpiryModal}
          closeModal={() => {
            setOpenFreeTrialExpiryModal(false);
          }}
          expired={isFreeTrialExpired}
          expiring={isFreeTrialExpiring}
          remainingDays={remainingFreeTrialDays}
          daysText={freeTrialdaysText}
          slug={isSubscriptionType}
        />

        {/*Terminal Modals*/}
        <TerminalActivationFlow />

        {/*Subscription Banner*/}
        {(isSubscriptionCancelled ||
          isSubscriptionExpiring ||
          isSubscriptionExpired) &&
          openRenewBox &&
          isSubscriptionType !== "" && (
            <div className="canceled_subscription_state">
              <div className="text_side">
                <InfoCircleXLIcon stroke="#D90429" />
                <p>
                  {isSubscriptionCancelled
                    ? "Your subscription has been cancelled."
                    : isSubscriptionExpiring
                    ? `Your subscription will expire in ${remainingDays} ${daysText}.`
                    : isSubscriptionExpired
                    ? " Your subscription has expired and your account has been downgraded to Bumpa Basic."
                    : ""}
                </p>
              </div>
              <div className="button_side">
                {isWithinNoticePeriod && <RenewButton className="renew" />}
                <IconButton
                  onClick={() => {
                    setOpenRenewBox(false);
                  }}
                >
                  <ClearIcon stroke="#222D37" />
                </IconButton>
              </div>
            </div>
          )}

        {/*Maintenance Mode Banner*/}
        {userStore?.online !== 1 && (hasCompletedOnboarding || isOldUser) && (
          <div className="maintenance_container">
            <div className="left_box">
              <InfoCircleIcon stroke="#ffffff" />
              <p>Your website is currently offline</p>
            </div>
            <Button
              variant="contained"
              className=" primary_styled_button"
              onClick={handleMaintenaceMode}
            >
              {isMaintenanceLoading ? (
                <CircularProgress
                  size="1.5rem"
                  sx={{ zIndex: 10, color: "#ffffff" }}
                />
              ) : (
                "Turn off Maintenance Mode"
              )}
            </Button>
          </div>
        )}

        {/*Free Trial Banner*/}
        {isAdminUser &&
          !completeOnboardingBanner &&
          isFreeTrialActivatedExists &&
          !isFreeTrialActivated && (
            <div className="maintenance_container activate">
              <div className="left_box">
                <CheckVerifiedIcon stroke="#ffffff" />
                <p>Ready to explore premium features for free?</p>
              </div>
              <Button
                variant="contained"
                className="activate_freetrial_button"
                onClick={() => {
                  setOpenActivateFreeTrialModal(true);
                }}
              >
                Activate Free Trial Mode
              </Button>
            </div>
          )}

        {/* KYC service status banner */}
        {isAdminUser && !hasCompletedKyc && kycUptime !== null && (
          <>
            {!kycUptime && openDowntimeBanner && (
              <div className="canceled_subscription_state downtime">
                <div className="text_side">
                  <InfoCircleXLIcon stroke="#F4A408" />
                  <p>
                    We are currently experiencing downtime on KYC from our
                    service providers. We apologize for the inconvenience.
                    Please try again in a few hours.
                  </p>
                </div>
                <div className="button_side">
                  <IconButton onClick={() => setOpenDowntimeBanner(false)}>
                    <ClearIcon stroke="#222D37" />
                  </IconButton>
                </div>
              </div>
            )}

            {kycUptime &&
              kycDisplayServiceRestoredBanner &&
              openRestoredBanner && (
                <div className="canceled_subscription_state restored">
                  <div className="text_side">
                    <InfoCircleXLIcon stroke="#009444" />
                    <p>
                      The KYC verification service has been restored. You can
                      proceed to upgrade your account.
                    </p>
                  </div>
                  <div className="button_side">
                    <IconButton onClick={() => setOpenRestoredBanner(false)}>
                      <ClearIcon stroke="#222D37" />
                    </IconButton>
                  </div>
                </div>
              )}
          </>
        )}

        {/* KYC */}
        {user &&
          isAdminUser &&
          (hasCompletedOnboarding || isOldUser) &&
          (user.bvn_verified_at === null ||
            user.nin_verified_at === null ||
            (user?.desired_kyc_tier === 2 && userStore?.cac === null)) && (
            <div className="verify_container">
              <div className="left_box">
                <InfoCircleXLIcon stroke="#F4A408" />
                <div className="left_box--text">
                  {user.bvn_verified_at === null ? (
                    <>
                      <p>Verify your identity to get paid</p>
                      <span>
                        Complete your KYC verification before 30th January to
                        continue receiving settlements.
                      </span>
                    </>
                  ) : user.nin_verified_at === null ? (
                    <>
                      <p>Complete your tier 1 NIN verification</p>
                      <span>
                        Complete your NIN verification before 30th January to
                        continue receiving settlements.
                      </span>
                    </>
                  ) : user?.desired_kyc_tier === 2 &&
                    userStore?.cac === null ? (
                    <>
                      <p>Complete your tier 2 CAC verification</p>
                      <span>
                        You're yet to complete your tier 2 verification.
                      </span>
                    </>
                  ) : (
                    <>
                      <p>Verify your identity to get paid</p>
                      <span>
                        Complete your KYC verification before 30th January to
                        continue receiving settlements.
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Button
                variant="contained"
                className="primary_styled_button"
                onClick={handleNextStep}
              >
                Start Verification
              </Button>
            </div>
          )}

        {kycStatus.verificationComplete && (
          <div className="verification_complete">
            <div className="text_side">
              <CheckVerifiedIcon stroke="#009444" />
              <p>
                Verification Complete. We’ve successfully verified your account.
              </p>
            </div>
            <div className="button_side">
              <IconButton
                onClick={() => {
                  dispatch(setKYCStatus({ verificationComplete: false }));
                }}
              >
                <ClearIcon stroke="#0D1821" />
              </IconButton>
            </div>
          </div>
        )}

        {/* Terminal Banner */}
        {isAdminUser &&
          (hasCompletedOnboarding || isOldUser) &&
          !checkoutTerminalLoading &&
          !hasTerminal && (
            <div className="terminal_container">
              <div className="left_box">
                <img src={TerminalBannerImage} alt="Terminal" />
                <div className="left_box--text">
                  <p>Bumpa Terminal</p>
                  <span>
                    Activate your Terminal for instant payment alerts on
                    WhatsApp for you and your team
                  </span>
                </div>
              </div>
              <Button
                variant="contained"
                onClick={() => {
                  dispatch(startTerminalFlow());
                  if (typeof mixpanel !== "undefined") {
                    mixpanel.track("web_terminal_banner");
                  }
                }}
              >
                Get Started
              </Button>
            </div>
          )}

        {/*Complete Onboarding */}
        {isAdminUser && completeOnboardingBanner && hasSubscriptionIntent && (
          <div className="setup_mode_container">
            <h5>Complete your onboarding</h5>
            <p>Complete the next steps to launch your website</p>
            <LinearProgress
              variant="determinate"
              className="progress_bar"
              color="primary"
              value={onboardingProgressValue}
            />
            <Button
              onClick={handleOnboardingProgressStep}
              className="primary_styled_button"
              variant="contained"
            >
              {getOnboardingProgressContent(currentOnboardingStep)}
            </Button>
          </div>
        )}

        <div className="name_container">
          <h3 className="name_of_section">Hello {user?.first_name}</h3>
          {isSubscriptionType === "free" && (
            <div className="free_section">
              <p>You're on a free plan</p>
              <Button
                onClick={() => {
                  navigate(
                    `/dashboard/subscription/select-plan?type=upgrade&slug=${isSubscriptionType}`
                  );
                }}
                startIcon={<CheckVerifiedIcon stroke={"#ffffff"} />}
              >
                Upgrade
              </Button>
            </div>
          )}
          {isFreeTrialExpiring && (
            <div className="free_trial_section">
              <p>
                Growth Free Trial period:{" "}
                <span>
                  Expires in {remainingFreeTrialDays} {freeTrialdaysText}
                </span>
              </p>
              <Button
                onClick={() => {
                  navigate(
                    `/dashboard/subscription/select-plan?type=subscribe&slug=${isSubscriptionType}`
                  );
                }}
                startIcon={<CheckVerifiedIcon stroke={"#ffffff"} />}
              >
                Upgrade plan
              </Button>
            </div>
          )}
          {isSubscriptionType !== "free" && !isFreeTrialExpiring && (
            <Button
              className={`badge ${
                isSubscriptionType === "pro" ||
                isSubscriptionType === "growth" ||
                isFreeTrial
                  ? isSubscriptionType
                  : "starter"
              }`}
              onClick={() => {
                navigate("/dashboard/subscription");
              }}
              startIcon={
                <CheckVerifiedIcon
                  stroke={
                    isSubscriptionType === "growth" || isFreeTrial
                      ? "#ffffff"
                      : isSubscriptionType === "pro"
                      ? "#222D37"
                      : "#009444"
                  }
                />
              }
            >
              {isSubscriptionType === "pro" || isSubscriptionType === "growth"
                ? isSubscriptionType === "pro"
                  ? "Bumpa Pro"
                  : isSubscriptionType === "growth"
                  ? "Bumpa Growth"
                  : ""
                : `Bumpa ${isSubscriptionType}`}
            </Button>
          )}
        </div>
        <div className="dashboard_area">
          <div
            className={`left_section ${
              !canViewAnalytics && !canViewOrder ? "empty_left" : ""
            }`}
          >
            {canViewAnalytics && (
              <div className="overview_card">
                <div className="title_area">
                  <div className="text_box">
                    <h3>Business Overview</h3>
                    <p>Here is how your business is doing today</p>
                  </div>
                  <Select
                    value={overviewFilter}
                    onChange={(e) => {
                      setOverviewFilter(e.target.value);
                    }}
                    className="my-select "
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="month">This Month</MenuItem>
                    <MenuItem value="week">This Week</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                  </Select>
                </div>
                <div className="summary_section">
                  {homeStatsLoading ? (
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
                        count={formatNumber(
                          Number(
                            statsHome
                              ? statsHome.stats.orders[
                                  overviewFilter as keyof homeStatsKeys
                                ]
                              : 0
                          )
                        )}
                        handleClick={() => {
                          navigate("/dashboard/orders");
                        }}
                        title="Orders"
                        icon={<ShopingIcon isActive={true} />}
                        color={"green"}
                      />
                      <SummaryCard
                        count={formatNumber(
                          Number(
                            statsHome
                              ? statsHome.stats.product_sold[
                                  overviewFilter as keyof homeStatsKeys
                                ]
                              : 0
                          )
                        )}
                        handleClick={() => {
                          navigate("/dashboard/products");
                        }}
                        title="Products sold"
                        icon={<TagIcon isActive={true} stroke="#0059DE" />}
                        color={"blue"}
                      />
                      <SummaryCard
                        count={formatNumber(
                          Number(
                            statsHome
                              ? statsHome.stats.new_customers[
                                  overviewFilter as keyof homeStatsKeys
                                ]
                              : 0
                          )
                        )}
                        handleClick={() => {
                          navigate("/dashboard/customers");
                        }}
                        title="New Customers"
                        icon={<UserIcon isActive={true} stroke="#FFB60A" />}
                        color={"yellow"}
                      />
                      <SummaryCard
                        count={formatNumber(
                          Number(
                            statsHome
                              ? statsHome.stats.website_visit[
                                  overviewFilter as keyof homeStatsKeys
                                ]
                              : 0
                          )
                        )}
                        title="Website Visits"
                        icon={<GlobeIcon />}
                        color={"red"}
                      />
                    </>
                  )}
                </div>
                <>
                  <Divider className="overview_divider">
                    OVERVIEW OF YOUR BUSINESS
                  </Divider>
                  <div className="chart_section">
                    <div className="business_info_section">
                      <div className="business_info_container">
                        <>
                          <BusinessInfo
                            amount={
                              analyticsOverview && analyticsOverview?.data
                                ? analyticsOverview?.data[0]?.value
                                : 0
                            }
                            title={
                              analyticsOverview && analyticsOverview?.data
                                ? analyticsOverview?.data[0]?.title
                                : "TOTAL SALES"
                            }
                            icon={
                              <p className="text-[#222D37] font-semibold text-[20px]">
                                {getCurrencyFnc()}
                              </p>
                            }
                            loading={
                              analyticsOverviewLoading ||
                              analyticsOverviewFetching
                            }
                          />
                          <BusinessInfo
                            amount={
                              analyticsOverview && analyticsOverview?.data
                                ? analyticsOverview?.data[2]?.value
                                : 0
                            }
                            title={
                              analyticsOverview && analyticsOverview?.data
                                ? analyticsOverview?.data[2]?.title
                                : "TOTAL SETTLED"
                            }
                            icon={<TrendUpIcon />}
                            loading={
                              analyticsOverviewLoading ||
                              analyticsOverviewFetching
                            }
                          />{" "}
                          <BusinessInfo
                            amount={
                              analyticsOverview && analyticsOverview?.data
                                ? analyticsOverview?.data[3]?.value
                                : 0
                            }
                            title={
                              analyticsOverview && analyticsOverview?.data
                                ? analyticsOverview?.data[3]?.title
                                : "TOTAL OWED"
                            }
                            icon={<CoinsHandIcon />}
                            loading={
                              analyticsOverviewLoading ||
                              analyticsOverviewFetching
                            }
                          />
                          <BusinessInfo
                            amount={
                              analyticsOverview && analyticsOverview?.data
                                ? analyticsOverview?.data[1]?.value
                                : 0
                            }
                            title={
                              analyticsOverview && analyticsOverview?.data
                                ? analyticsOverview?.data[1]?.title
                                : "OFFLINE SALES"
                            }
                            icon={<CoinsHandIcon />}
                            loading={
                              analyticsOverviewLoading ||
                              analyticsOverviewFetching
                            }
                          />
                          <DateRangeDropDown
                            origin={"left"}
                            setCustomState={setDateRange}
                            action={
                              <Button
                                variant="outlined"
                                endIcon={<FillArrowIcon stroke="#5C636D" />}
                                className="date"
                              >
                                {dateRange
                                  ? `${moment(dateRange[0]?.startDate).format(
                                      "D/MM/YYYY"
                                    )} - ${moment(dateRange[0]?.endDate).format(
                                      "D/MM/YYYY"
                                    )}`
                                  : "Select date range"}
                              </Button>
                            }
                          />
                        </>
                      </div>
                    </div>

                    <div className="chart_container">
                      {transactionAnalyticsLoading ||
                      transactionAnalyticsFetching ? (
                        <div className="chart_sekeleton_container">
                          {[1, 2, 3, 4].map((item) => (
                            <Skeleton
                              animation="wave"
                              key={item}
                              width={"100%"}
                              height={40}
                            />
                          ))}
                        </div>
                      ) : (
                        <>
                          <Chart
                            options={barStyleOptions}
                            series={series}
                            height={300}
                            width={barWidth}
                            type="bar"
                          />
                          {data &&
                            data?.orders?.data &&
                            data?.orders?.data?.length === 0 && (
                              <div className="empty_chart_modal">
                                <div className="empty_chart_box">
                                  <h4>No sales data available</h4>
                                  <p>
                                    Record order to start seeing your number
                                    grow
                                  </p>
                                  <Button
                                    onClick={() => {
                                      navigate("/dashboard/orders/create");
                                    }}
                                    variant="outlined"
                                  >
                                    Record Order
                                  </Button>
                                </div>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              </div>
            )}
            {canViewOrder && (
              <div className="recent_order_section">
                <div id="seventh_tour_step" className="table_container">
                  <div className="top_section">
                    <h3>Recent Orders</h3>
                  </div>
                  <TableComponent
                    isError={isError}
                    isLoading={isLoading || isFetching}
                    headCells={headCell}
                    showPagination={false}
                    handleClick={(row: any) => {
                      navigate(`/dashboard/orders/${row.id}`);
                    }}
                    tableData={data?.orders?.data.map((row: OrderType) => ({
                      ...row,
                      image: (
                        <img
                          src={getOriginImage(row.origin).image}
                          alt={getOriginImage(row.origin).name}
                          width={28}
                          height={28}
                        />
                      ),
                      order: (
                        <div className="order_name">
                          <h4>
                            #{row.order_number}
                            {row.customer ? ` • ${row.customer?.name}` : ""}
                          </h4>
                          <p>
                            {row.items && row.items?.length
                              ? `${row.items[0]?.name} ${
                                  row.items?.length > 1
                                    ? `+${row.items?.length} items`
                                    : ""
                                }  `
                              : ""}
                          </p>
                        </div>
                      ),
                      total: `${formatPrice(Number(row.total))}`,
                      status: (
                        <Chip
                          color={translateOrderStatus(row.status)?.color}
                          label={translateOrderStatus(row.status)?.label}
                        />
                      ),
                      payment: (
                        <Chip
                          color={
                            translateOrderPaymentStatus(row.payment_status)
                              ?.color
                          }
                          label={
                            translateOrderPaymentStatus(row.payment_status)
                              ?.label
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
                      date: `${moment(row.created_at).calendar()} `,
                      id: row.id,
                    }))}
                  />
                </div>
              </div>
            )}
          </div>
          <div
            className={`right_section ${
              !canViewAnalytics && !canViewOrder ? "increase_width" : ""
            }`}
          >
            {todosData && todosData?.length ? (
              <div className="todo_section">
                <div className="title">
                  <h3>To-do List</h3>
                  <Button
                    onClick={() => {
                      setOpenViewAllTodosModal(true);
                    }}
                  >
                    View All
                  </Button>
                </div>

                <div className="todo_list">
                  {todosData.map((item, i: number) => {
                    if (i < 4) {
                      return (
                        <div
                          className="todo_element"
                          onClick={() => {
                            navigate(`${getTodoIconAndLink(item, "link")}`);
                          }}
                        >
                          <div className="text_section">
                            {getTodoIconAndLink(item, "icon")}

                            <p className="bold"> {item.label}</p>
                          </div>
                          <ChevronRight stroke="#65707b" />
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            ) : (
              ""
            )}

            {canViewAnalytics && (
              <div className="sales_channel_section">
                <div className="top_section">
                  <h3>Top 5 Sales Channel</h3>
                </div>
                <div className="donut_section">
                  {analyticsSalesLoading || analyticsSalesFetching ? (
                    <div className="cover_donut_skeleton">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <Skeleton
                          animation="wave"
                          key={item}
                          width={"100%"}
                          height={40}
                        />
                      ))}
                    </div>
                  ) : pieSeries && pieSeries?.length ? (
                    <div className="cover_donut_with_label">
                      <Chart
                        options={pieOptionsStyle}
                        series={pieSeries}
                        type="donut"
                        height={280}
                        width={353}
                      />
                    </div>
                  ) : (
                    <div className="empty_chart_box">
                      <h4>No sales data available</h4>

                      <p>Record sales to show data</p>
                      <Button
                        onClick={() => {
                          navigate("/dashboard/orders/create");
                        }}
                        variant="outlined"
                      >
                        Create Order
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div
              id="sixth_tour_step"
              className={`action_section ${!isAdminUser ? "staff" : ""}`}
            >
              <div className="quick_action_section">
                <h3>Quick Actions</h3>

                {canManageOrder && (
                  <Button
                    className="quick_action_box"
                    startIcon={<ShopingIcon isActive={true} />}
                    onClick={() => {
                      navigate("orders/create");
                    }}
                  >
                    Create New Order
                  </Button>
                )}
                {canManageProducts && (
                  <Button
                    className="quick_action_box"
                    startIcon={<TagIcon isActive={true} />}
                    onClick={() => {
                      navigate("products/create");
                    }}
                  >
                    Add a new product
                  </Button>
                )}
                <Button
                  className="quick_action_box"
                  startIcon={<SaleIcon isActive={true} />}
                  onClick={() => {
                    navigate("discounts/create-discount");
                  }}
                >
                  Run Sales
                </Button>
                <Button
                  className="quick_action_box"
                  startIcon={<HelpCircleIcon isActive={true} />}
                  onClick={() => {
                    if (window.FreshworksWidget) {
                      window.FreshworksWidget("open");
                    }
                  }}
                >
                  Ask Bumpa
                </Button>
              </div>
            </div>
            <div className="referral_section">
              <div
                className={`${
                  hasActivatedReferral ? "activated" : "not-activated"
                } referral_section__main`}
              >
                <div className="referral_section__main-text">
                  <h2>
                    {hasActivatedReferral
                      ? "Bumpa Referrals Is Now Live!"
                      : "Refer & Earn"}
                  </h2>
                  <p>
                    {" "}
                    {hasActivatedReferral
                      ? "Refer other business owners and earn amazing rewards."
                      : "Help other business owners discover Bumpa & earn rewards!"}
                  </p>
                </div>
                <div className="referral_section__main-image">
                  <img src={ReferralCoin} alt="Referral" />
                </div>
              </div>
              {hasActivatedReferral ? (
                <div className="referral_section__info">
                  <div className="referralCode">
                    <p>
                      Referral Code: <span>{userStore?.referral_code}</span>{" "}
                    </p>
                    <Button
                      onClick={() => {
                        handleCopyClick();
                      }}
                      className="copy"
                    >
                      <div className="copyWrap">
                        <CopyIcon stroke="#009444" />
                      </div>
                    </Button>
                  </div>
                  <Button
                    onClick={() => {
                      navigate("/dashboard/referrals");
                    }}
                    variant="contained"
                    className="earnings"
                  >
                    <div className="earnings-content">
                      <p>View Earnings</p>
                      <ChevronRight stroke="#009444" />
                    </div>
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="referral_section__card">
                    <div className="referral_section__card--header">
                      <h3>Join the Super Referrers Community</h3>
                    </div>
                    <div className="referral_section__card--main">
                      <h4>Need support for referrals?</h4>
                      <p>
                        Join our community of super referrers and get resources
                        to increase your earnings.
                      </p>
                      <Button
                        onClick={() => {
                          navigate(
                            "/dashboard/referrals?fromHomeReferral=true"
                          );
                        }}
                        variant="contained"
                        className="started"
                      >
                        <div className="started-content">
                          <p>Get started</p>
                        </div>
                      </Button>
                    </div>
                  </div>
                  <div className="referral_section__refer">
                    <div className="referral_section__refer--code">
                      <p>Referral Code:</p>
                      <Button
                        onClick={() => {
                          handleCopyClick();
                        }}
                        className="copy"
                      >
                        <div className="copyWrap">
                          <span>{userStore?.referral_code}</span>
                          <CopyIcon stroke="#009444" />
                        </div>
                      </Button>
                    </div>
                    <Button
                      onClick={() => {
                        navigate("/dashboard/referrals");
                      }}
                      variant="contained"
                      className="earnings"
                    >
                      <div className="earnings-content">
                        <p>View Earnings</p>
                        <ChevronRight stroke="#009444" />
                      </div>
                    </Button>
                  </div>
                </div>
              )}
            </div>
            {!canManageMessaging ? (
              ""
            ) : !meta?.integration || !selectedIgState ? (
              <div className="empty_msg_box quick_dm_section">
                <h4>Connect to Instagram</h4>
                <p>Close sales from your instagram dm</p>
                <Button
                  onClick={handleStartMetaConnection}
                  className="primary_styled_button"
                  variant="contained"
                >
                  Connect Instagram
                </Button>
              </div>
            ) : canManageMessaging && showIgError && !igLoading ? (
              <div className="quick_dm_section">
                <ErrorMsg
                  error={
                    "Sorry, Instagram session has expired please reconnect to meta"
                  }
                  button={
                    <Button
                      onClick={handleStartMetaConnection}
                      className="primary_styled_button"
                      variant="contained"
                    >
                      Connect Instagram
                    </Button>
                  }
                />
              </div>
            ) : canManageMessaging && (igLoading || metaLoad) ? (
              <div className="quick_dm_section">
                <div className="top_section">
                  <img src={instagram} width={21} height={22} alt="" />
                  <h3>Instagram Messages</h3>
                </div>

                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="dm_content_skeleton dm_skeleton_padding"
                  >
                    <div className="left">
                      <Skeleton
                        animation="wave"
                        variant="circular"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="right">
                      <Skeleton
                        animation="wave"
                        height={20}
                        width="100%"
                        style={{ marginBottom: 6 }}
                      />
                      <Skeleton animation="wave" height={20} width="50%" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="quick_dm_section">
                <div className="top_section">
                  <img src={instagram} width={21} height={22} alt="" />
                  <h3>Instagram Messages</h3>
                </div>
                <div className="dm_content_container">
                  {selectedIgState ? (
                    <>
                      {selectedConversationList?.length > 0 ? (
                        <>
                          {selectedConversationList?.map(
                            (item: any, i: number) => (
                              <InstagramList
                                key={i}
                                conversation={item}
                                index={i}
                              />
                            )
                          )}

                          <Button
                            variant="outlined"
                            onClick={() => {
                              navigate("/dashboard/messages");
                            }}
                          >
                            View All
                          </Button>
                        </>
                      ) : (
                        <EmptyResponse message="No Available Chat History" />
                      )}
                    </>
                  ) : (
                    <div className="empty_msg_box">
                      <h4>Connect to Instagram</h4>
                      <p>Close sales from your instagram dm</p>
                      <Button
                        onClick={() => {
                          navigate("/dashboard/apps");
                        }}
                        className="primary_styled_button"
                        variant="contained"
                      >
                        Connect Instagram
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AllTodosModal
        openModal={openViewAllTodosModal}
        todos={todosData}
        closeModal={() => {
          setOpenViewAllTodosModal(false);
        }}
        isLoading={loadTodo || fetchTodo}
        refreshFnc={refetchTodo}
        getTodoIconAndLink={getTodoIconAndLink}
      />
    </>
  );
};
