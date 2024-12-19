import moment from "moment";
import { useState, useEffect, useRef, MutableRefObject } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./style.scss";
import { useGetStoreInformationQuery } from "services";
import {
  selectPermissions,
  selectCurrentUser,
  selectCurrentStore,
  setISSubscriptionCancelled,
  setIsSubscriptionDets,
  setIsSubscriptionExpired,
  setIsSubscriptionExpiring,
  setIsSubscriptionType,
  setRemainingDays,
  setIsWithinNoticePeriod,
  setIsFreeTrial,
  setIsFreeTrialExpiring,
  setIsFreeTrialExpired,
  setRemainingFreeTrialDays,
} from "store/slice/AuthSlice";
import {
  useGetDomainListQuery,
  useGetLoggedInUserQuery,
  useSetAppFlagMutation,
} from "services";
import FeatureUpdateModal from "./FeatureUpdateModal/FeatureUpdateModal";
import { handleError } from "utils";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { PAGEUPDATEVERSIONS } from "utils/constants/general";

type DashboardLayoutProps = { test?: string };

export const DashboardLayout = ({ test }: DashboardLayoutProps) => {
  const ref = useRef() as MutableRefObject<HTMLDivElement>;
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
  const [isCollapseNavigation, setIsCollapseNavigation] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const userPermission = useAppSelector(selectPermissions);
  const user = useAppSelector(selectCurrentUser);
  const userStore = useAppSelector(selectCurrentStore);
  const canViewOrder = isStaff ? userPermission?.orders?.view : true;
  const canManageOrder = isStaff ? userPermission?.orders?.manage : true;
  const canViewProducts = isStaff ? userPermission?.products?.view : true;
  const canManageProducts = isStaff ? userPermission?.products?.manage : true;
  const canViewMessaging = isStaff ? userPermission?.messaging?.view : true;
  const canManageMessaging = isStaff ? userPermission?.messaging?.manage : true;
  const canViewAnalytics = isStaff ? userPermission?.analytics?.view : true;
  const { data: userData } = useGetLoggedInUserQuery();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [setAppFlag, { isLoading }] = useSetAppFlagMutation();

  const { data: storeData } = useGetStoreInformationQuery();
  console.log(storeData, "storeData");
  const { data } = useGetDomainListQuery({
    limit: 10,
    id: userStore?.id || "",
  });

  const updateAppFlag = async () => {
    let payload = {
      ...userData?.app_flags,
      webapp_updates: {
        ...userData?.app_flags?.webapp_updates,
        general_update: {
          version: PAGEUPDATEVERSIONS.GENERALUPDATE,
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
  };

  useEffect(() => {
    if (userData) {
      if (
        userData?.app_flags?.webapp_updates?.general_update?.version >=
        PAGEUPDATEVERSIONS.GENERALUPDATE
      ) {
        if (userData?.app_flags?.webapp_updates?.general_update?.status) {
          setOpenUpdateModal(false);
        } else {
          setOpenUpdateModal(true);
        }
      } else {
        setOpenUpdateModal(true);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (storeData) {
      let notAdddOnSubscription = storeData.store?.subscription?.filter(
        (item: any) => item.is_addon === 0
      );

      if (!notAdddOnSubscription || notAdddOnSubscription.length === 0) {
        dispatch(setIsSubscriptionType(""));
        dispatch(setIsSubscriptionDets(null));
        dispatch(setIsSubscriptionExpired(false));
        dispatch(setIsSubscriptionExpiring(false));
        dispatch(setISSubscriptionCancelled(false));
        dispatch(setIsWithinNoticePeriod(false));
        dispatch(setIsFreeTrial(false));
        dispatch(setIsFreeTrialExpiring(false));
        dispatch(setRemainingFreeTrialDays(null));
        dispatch(setIsFreeTrialExpired(false));
        return;
      }

      let subType = notAdddOnSubscription[0]?.plan;
      let subTypeAll = notAdddOnSubscription[0];

      const today = moment().toDate();
      const futureDate = notAdddOnSubscription
        ? moment(
            notAdddOnSubscription[0]?.ends_at,
            "YYYY-MM-DD HH:mm:ss"
          ).toDate()
        : moment().toDate();
      const timeDiff = futureDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      dispatch(setRemainingDays(daysDiff));
      dispatch(setIsSubscriptionType(subType ? subType.slug : ""));
      dispatch(setIsSubscriptionDets(subTypeAll));
      dispatch(setIsSubscriptionExpired(daysDiff > 0 ? false : true));
      dispatch(
        setIsSubscriptionExpiring(daysDiff <= 2 && daysDiff > 0 ? true : false)
      );
      dispatch(
        setISSubscriptionCancelled(
          notAdddOnSubscription && notAdddOnSubscription[0]?.cancelled_at
            ? true
            : false
        )
      );

      const gracePeriodEndDate = notAdddOnSubscription
        ? moment(
            notAdddOnSubscription[0]?.grace_period_ends_at,
            "YYYY-MM-DD HH:mm:ss"
          ).toDate()
        : moment().toDate();
      const noticePeriodDiff = gracePeriodEndDate.getTime() - today.getTime();
      const noticePeriodDaysDiff = Math.ceil(
        noticePeriodDiff / (1000 * 60 * 60 * 24)
      );
      dispatch(
        setIsWithinNoticePeriod(noticePeriodDaysDiff >= 0 ? true : false)
      );

      // Free trial state
      const isFreeTrial = subType?.slug === "trial";
      const freeTrialEndsAt = notAdddOnSubscription
        ? moment(
            notAdddOnSubscription[0]?.ends_at,
            "YYYY-MM-DD HH:mm:ss"
          ).toDate()
        : moment().toDate();
      const freeTrialTimeDiff = freeTrialEndsAt.getTime() - today.getTime();
      const freeTrialDaysDiff = Math.ceil(
        freeTrialTimeDiff / (1000 * 60 * 60 * 24)
      );
      const remainingFreeTrialDays =
        isFreeTrial && freeTrialDaysDiff <= 14 && freeTrialDaysDiff > 0
          ? freeTrialDaysDiff
          : null;

      dispatch(setIsFreeTrial(isFreeTrial));
      dispatch(
        setIsFreeTrialExpiring(
          isFreeTrial && freeTrialDaysDiff <= 14 && freeTrialDaysDiff > 0
        )
      );
      dispatch(setRemainingFreeTrialDays(remainingFreeTrialDays));
      dispatch(setIsFreeTrialExpired(isFreeTrial && freeTrialDaysDiff <= 0));
    }
  }, [storeData]);

  useEffect(() => {
    if (userPermission !== undefined) {
      setIsStaff(true);
    } else {
      setIsStaff(false);
    }
  }, [userPermission]);

  useEffect(() => {
    if (ref) {
      ref.current.scrollTo(0, 0);
    }
  }, [pathname]);

  useEffect(() => {
    if (screenWidth <= 1300) {
      setIsCollapseNavigation(true);
    } else {
      setIsCollapseNavigation(false);
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

  return (
    <div className="pd_dashboardlayout">
      {userData && (
        <FeatureUpdateModal
          openModal={
            openUpdateModal &&
            window.location.origin === "https://app.getbumpa.com"
          }
          loadCloseFnc={isLoading}
          closeModal={() => {
            updateAppFlag();
          }}
          closeTempModal={() => {
            setOpenUpdateModal(false);
          }}
        />
      )}
      <Navbar
        isCollapseNavigation={isCollapseNavigation}
        setIsCollapseNavigation={setIsCollapseNavigation}
        isMobileNavigationOpen={isMobileNavigationOpen}
        setIsMobileNavigationOpen={setIsMobileNavigationOpen}
      />
      <div className="outlet_container">
        <Sidebar
          isCollapseNavigation={isCollapseNavigation}
          setIsCollapseNavigation={setIsCollapseNavigation}
          isMobileNavigationOpen={isMobileNavigationOpen}
          setIsMobileNavigationOpen={setIsMobileNavigationOpen}
          canViewOrder={canViewOrder}
          canManageOrder={canManageOrder}
          canViewProducts={canViewProducts}
          canManageProducts={canManageProducts}
          canViewMessaging={canViewMessaging}
          canManageMessaging={canManageMessaging}
          canViewAnalytics={canViewAnalytics}
        />
        <main ref={ref}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
