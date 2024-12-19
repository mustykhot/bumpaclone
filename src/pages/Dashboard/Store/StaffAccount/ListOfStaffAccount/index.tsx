import { useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { PlusIcon } from "assets/Icons/PlusIcon";
import "./style.scss";
import {
  useGetLoggedInUserQuery,
  useGetStaffAccountsQuery,
  useSetAppFlagMutation,
} from "services";
import {
  selectIsSubscriptionExpired,
  selectUserLocation,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";

import { useAppSelector } from "store/store.hooks";
import StaffTable from "./StaffTable";
import ExtraStaffModal from "../AddStaff/ExtraStaff/ExtraStaffModal";
import { GrowthModal } from "components/GrowthModal";
import { UpgradeModal } from "components/UpgradeModal";
import ReactivateStaffModal from "./StaffTable/ReactivateStaffModal";
import { StaffIcon } from "assets/Icons/StaffIcon";
import { XIcon } from "assets/Icons/XIcon";
import { InfoCircleXLIcon } from "assets/Icons/InfoCircleXLIcon";
import { selectCurrentStore } from "store/slice/AuthSlice";
import ExtraSuccessModal from "../AddStaff/ExtraStaff/ExtraSuccessModal";
import TopBanner from "components/Banner/TopBanner";
import { PAGEUPDATEVERSIONS } from "utils/constants/general";
import { handleError } from "utils";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";

const ListOfStaffAccount = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [openExtraStaffModal, setOpenExtraStaffModal] = useState(false);
  const userLocation = useAppSelector(selectUserLocation);
  const [openGrowthModal, setOpenGrowthModal] = useState(false);
  const [isMoreStaffUpgrade, setIsMoreStaffUpgrade] = useState(false);
  const [openReactivateModal, setOpenReactivateModal] = useState(false);
  const [reactivateAll, setReactivateAll] = useState(false);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [isGrowthUpgrade, setIsGrowthUpgrade] = useState(false);
  const [openBuySlots, setOpenBuySlots] = useState(false);
  const [maxPlan, setMaxPlan] = useState(false);
  const [notGrowth, setNotGrowth] = useState(false);
  const [noActiveSub, setNoActiveSub] = useState(false);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const [extraSlots, setExtraSlots] = useState(false);
  const [showMaxModal, setShowMaxModal] = useState(false);
  const selectedCurrentStore = useAppSelector(selectCurrentStore);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { data, isLoading, isError } = useGetStaffAccountsQuery({
    search: search,
    location_id: userLocation?.id,
  });

  const { data: staffData } = useGetStaffAccountsQuery({
    search: "",
    location_id: userLocation?.id,
  });
  const [openWarningBanner, setOpenWarningBanner] = useState(false);
  const [setAppFlag, { isLoading: loadFlag }] = useSetAppFlagMutation();

  const { data: userData } = useGetLoggedInUserQuery();
  const staffCount = staffData?.staff?.length || 0;
  const freeSlots = staffData?.slots?.available_staff_slots ?? 0;
  const disabledStaff = staffData?.slots?.disabled_slots ?? 0;
  const no_extra_staff = staffData?.slots?.extra_staff_slots ?? 0;

  const location = useLocation();
  const decodedURL = location.search.replace(/&amp;/g, "&");
  const queryParams = new URLSearchParams(decodedURL);
  const successPayment = queryParams.get("success");
  const slotsPurchased = queryParams.get("slot");

  const handleMoreClick = () => {
    if (isSubscriptionType === "pro") {
      setIsGrowthUpgrade(true);
      setOpenUpgradeModal(true);
      setOpenBuySlots(true);
      setNotGrowth(true);
    } else if (isSubscriptionType === "growth") {
      setOpenUpgradeModal(true);
      setOpenBuySlots(true);
      setMaxPlan(true);
    } else if (
      isSubscriptionExpired ||
      isSubscriptionType === "free" ||
      isSubscriptionType === "trial" ||
      isSubscriptionType === "starter"
    ) {
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
      setNoActiveSub(true);
    }
  };

  const handleReactivateAll = () => {
    setOpenReactivateModal(true);
    setReactivateAll(true);
  };
  const closeReactivateModal = () => {
    setOpenReactivateModal(false);
    setReactivateAll(false);
  };

  useEffect(() => {
    if (successPayment) {
      setShowSuccessModal(true);
      setExtraSlots(true);
    }

    setTimeout(() => {
      queryParams.delete("success");
      queryParams.delete("slot");
    }, 2000);

    const newUrl = `${location.pathname}`;
    window.history.pushState({}, "", newUrl);
    const handlePageExit = () => {
      setExtraSlots(false); // Close the banner
    };
    window.addEventListener("beforeunload", handlePageExit);
    window.addEventListener("popstate", handlePageExit);

    return () => {
      window.removeEventListener("beforeunload", handlePageExit);
      window.removeEventListener("popstate", handlePageExit);
    };
  }, [successPayment]);

  // Function to determine if the modal should be displayed based on conditions
  const shouldShowMaxModal = () => {
    return (
      (isSubscriptionType === "pro" || isSubscriptionType === "growth") &&
      no_extra_staff < 1 &&
      freeSlots === 0 &&
      openWarningBanner
    );
  };

  const updateAppFlag = async () => {
    let payload = {
      ...userData?.app_flags,
      webapp_updates: {
        ...userData?.app_flags?.webapp_updates,
        staff_warning_banner: {
          version: PAGEUPDATEVERSIONS.STAFF_WARNING_BANNER,
          status: true,
        },
      },
    };
    try {
      let result = await setAppFlag(payload);
      if ("data" in result) {
        setOpenWarningBanner(false);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
    setOpenWarningBanner(false);
  };
  useEffect(() => {
    if (userData) {
      if (
        userData?.app_flags?.webapp_updates?.staff_warning_banner?.version >=
        PAGEUPDATEVERSIONS.STAFF_WARNING_BANNER
      ) {
        if (userData?.app_flags?.webapp_updates?.staff_warning_banner?.status) {
          setOpenWarningBanner(false);
        } else {
          setOpenWarningBanner(true);
        }
      } else {
        setOpenWarningBanner(true);
      }
    }
  }, [userData]);

  return (
    <>
      <div className="staff_container">
        <TopBanner
          openModal={extraSlots}
          closeModal={() => setExtraSlots(false)}
          text={
            "You have successfully purchased another slot for you to add another staff account. Please note that this is only valid for the duration of your subscription."
          }
        />
        {shouldShowMaxModal() && (
          <div className="warning">
            <div className="right_flex">
              <div className="helper_icone">
                <InfoCircleXLIcon />
              </div>
              <p className="warning_text">
                You’ve reached the maximum number of staff accounts. Click the
                get more slots button below to add more staff accounts.
              </p>
            </div>
            <div className="close-icon" onClick={updateAppFlag}>
              <XIcon stroke="black" />
            </div>
          </div>
        )}
        <div className="container__title-section">
          <div>
            <h3 className="name_of_section">Staff Acounts</h3>
            <div className="staff_count">
              <StaffIcon />
              <span>Available Staff Slots: {freeSlots}</span>
              <Button
                className={"store_button fixed_btn"}
                onClick={() => {
                  handleMoreClick();
                }}
                variant={"outlined"}
              >
                Get more slots
              </Button>

              {disabledStaff > 0 && freeSlots >= disabledStaff && (
                <Button
                  className={"store_button reactivate"}
                  onClick={() => {
                    handleReactivateAll();
                  }}
                  variant={"contained"}
                >
                  Reactivate all staff
                </Button>
              )}
            </div>
          </div>

          <div className="btn_flex">
            <Button
              startIcon={<PlusIcon />}
              className="btn_pry"
              variant={"contained"}
              onClick={() => navigate("add")}
            >
              Add new staff
            </Button>
          </div>
        </div>
        <div className="info_disable">
          <InfoCircleIcon className="icon" />
          <p>
            Deactivated staff are staff deativated when subscription expires
          </p>
        </div>
        <div className="table_section tabbed">
          <StaffTable
            isError={isError}
            data={data}
            search={search}
            setSearch={setSearch}
            isLoading={isLoading}
          />
        </div>
      </div>

      {openReactivateModal && (
        <ReactivateStaffModal
          openModal={openReactivateModal}
          closeModal={closeReactivateModal}
          type="staff"
          reactivate_all={reactivateAll}
        />
      )}
      {openExtraStaffModal && (
        <ExtraStaffModal
          openModal={openExtraStaffModal}
          closeModal={() => setOpenExtraStaffModal(false)}
        />
      )}
      {showSuccessModal && (
        <ExtraSuccessModal
          openModal={showSuccessModal}
          closeModal={() => setShowSuccessModal(false)}
          // @ts-ignore
          numOfStaff={parseInt(slotsPurchased)}
        />
      )}

      {openUpgradeModal && (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => setOpenUpgradeModal(false)}
          pro={isProUpgrade}
          growth={isGrowthUpgrade}
          staff={openBuySlots}
          width={openBuySlots && maxPlan ? "600px" : ""}
          title={
            notGrowth
              ? `Add staff to manage your business on Bumpa`
              : noActiveSub
              ? `You need an active subscription to buy Staff Account Slots`
              : `Purchase Extra Staff Slots`
          }
          subtitle={
            notGrowth
              ? `Add up to 5 staff and oversee what they do with your business`
              : noActiveSub
              ? `Upgrade to the next plan to access this feature`
              : `Purchase and manage extra staff accounts `
          }
          proFeatures={[
            "Add & manage up to 3 staff members",
            "Oversee what your staff do in different staff locations.",
            "View products & inventory managed by different staff members.",
          ]}
          growthFeatures={[
            "Add & manage up to 5 staff members",
            "Add multiple store locations & manage staff actions across each",
            "Get point-of-sale software to process physical sales faster & automatically record them",
          ]}
          eventName="staff-account"
        />
      )}
      {openGrowthModal && (
        <GrowthModal
          openModal={openGrowthModal}
          closeModal={() => {
            setOpenGrowthModal(false);
          }}
          moreStaff={isMoreStaffUpgrade}
          title={`Need to Add More Than ${
            isSubscriptionType === "pro" ? 3 : staffCount
          } Staff ?`}
          subtitle={`Add more staff from any locations with custom purchasing.`}
          growthFeatures={[
            "Add and manage unlimited number of staff",
            "Oversee what your staff do in different staff locations.",
            "View products & inventory managed by different staff members.",
          ]}
          buttonText={
            isMoreStaffUpgrade
              ? "Purchase Extra Staff Accounts"
              : "Upgrade to Growth"
          }
          setShowModal={() => setOpenExtraStaffModal(true)}
          eventName="staff-account"
        />
      )}
    </>
  );
};

export default ListOfStaffAccount;
