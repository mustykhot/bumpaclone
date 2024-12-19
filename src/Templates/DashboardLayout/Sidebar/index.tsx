import { AnimatePresence, motion } from "framer-motion";
import { Tooltip } from "@mui/material";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./style.scss";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { PaymentMethodsJoyRideComponent } from "components/JoyRideComponent/PaymentMethodsJoyRideComponent";
import { useGetLoggedInUserQuery, useSetAppFlagMutation } from "services";
import { selectCurrentUser } from "store/slice/AuthSlice";
import { selectShowIgDm } from "store/slice/InstagramSlice";
import {
  selectIsGrowthTour,
  selectIsPaymentMethodsTour,
  setIsPaymentMethodsTour,
} from "store/slice/NotificationSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import { OPACITYVARIANT, PAGEUPDATEVERSIONS } from "utils/constants/general";
import CustomLink from "./CustomRouteLink";
import DashboardMenuLinks, { StoreMenuLinks } from "./menuLinks";
import MobileSidebar from "./MobileSideBar";
import { useGetIntegrationScriptQuery } from "services";

type SidebarProps = {
  isMobileNavigationOpen: boolean;
  isCollapseNavigation: boolean;
  setIsMobileNavigationOpen: (value: boolean) => void;
  setIsCollapseNavigation: (value: boolean) => void;
  canViewOrder: boolean;
  canManageOrder: boolean;
  canViewAnalytics: boolean;
  canViewMessaging: boolean;
  canManageMessaging: boolean;
  canViewProducts: boolean;
  canManageProducts: boolean;
};

const itemIdMap: Record<string, string> = {
  Orders: "first_tour_step",
  Products: "second_tour_step",
  Campaigns: "third_tour_step",
  Customers: "fourth_tour_step",
  "Payment Methods": "payment_methods_tour_step",
};

const storeItemIdMap: Record<string, string> = {
  Location: "second_growth_tour_step",
};

export const Sidebar = ({
  isMobileNavigationOpen,
  isCollapseNavigation,
  setIsMobileNavigationOpen,
  setIsCollapseNavigation,
  canViewOrder,
  canManageOrder,
  canViewAnalytics,
  canViewMessaging,
  canManageMessaging,
  canViewProducts,
  canManageProducts,
}: SidebarProps) => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const ref = useRef() as MutableRefObject<HTMLDivElement>;
  const asideRef = useRef() as any;
  const paymentMethodsRef = useRef<HTMLLIElement>(null);

  const [openStore, setOpenStore] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isStartPaymentMethodsTour, setIsStartPaymentMethodsTour] =
    useState(false);
  const [paymentMethodsTourStep, setPaymentMethodsTourStep] = useState(0);
  const [isSidebarReady, setIsSidebarReady] = useState(false);

  const user = useAppSelector(selectCurrentUser);
  const isGrowthTour = useAppSelector(selectIsGrowthTour);
  const selectedIgDmState = useAppSelector(selectShowIgDm);
  const isPaymentMethodsTour = useAppSelector(selectIsPaymentMethodsTour);

  const { data: userData } = useGetLoggedInUserQuery();
  const { data: myPixel, isLoading: myPixelLoad } =
    useGetIntegrationScriptQuery({ integration_type: "facebook_pixel" });
  const [setAppFlag] = useSetAppFlagMutation();

  const updateAppFlag = async () => {
    let payload = {
      ...userData?.app_flags,
      webapp_updates: {
        ...userData?.app_flags?.webapp_updates,
        sidebar_update: {
          version: 1,
          status: true,
        },
      },
    };
    try {
      let result = await setAppFlag(payload);
      if ("data" in result) {
        dispatch(setIsPaymentMethodsTour(false));
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
    dispatch(setIsPaymentMethodsTour(false));
  };

  useEffect(() => {
    if (userData) {
      if (
        userData?.app_flags?.webapp_updates?.sidebar_update?.version >=
        PAGEUPDATEVERSIONS.SIDEBARUPDATE
      ) {
        if (userData?.app_flags?.webapp_updates?.sidebar_update?.status) {
          dispatch(setIsPaymentMethodsTour(false));
        } else {
          dispatch(setIsPaymentMethodsTour(true));
        }
      } else {
        dispatch(setIsPaymentMethodsTour(true));
      }
    }
  }, [userData]);

  useEffect(() => {
    if (isGrowthTour) {
      setOpenStore(true);
    }
  }, [isGrowthTour]);

  useEffect(() => {
    if (
      myPixel &&
      myPixel?.integration?.script &&
      !myPixel?.integration?.status
    ) {
      setShowDot(true);
    } else {
      setShowDot(false);
    }
  }, [myPixel]);

  useEffect(() => {
    if (isPaymentMethodsTour && screenWidth > 1300) {
      const timer = setTimeout(() => {
        if (paymentMethodsRef.current) {
          paymentMethodsRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          setTimeout(() => {
            setIsSidebarReady(true);
            setIsStartPaymentMethodsTour(true);
          }, 500);
        }
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setIsStartPaymentMethodsTour(false);
      setIsSidebarReady(false);
    }
  }, [isPaymentMethodsTour, screenWidth]);

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
    <>
      <aside
        onScroll={() => {
          setScroll(true);
        }}
        ref={asideRef}
        className={`pd_sidebar ${scroll ? "showScroll" : ""} ${
          isCollapseNavigation ? "collapsed" : ""
        }`}
      >
        <div className="flex_container">
          <div className="link_container">
            {!isCollapseNavigation && (
              <motion.p
                className="quick_acess"
                variants={OPACITYVARIANT}
                initial="init"
                animate="visible"
                exit="init"
              >
                Quick Access
              </motion.p>
            )}
            <ul className="side_list">
              {DashboardMenuLinks.map(
                ({ submenu, name, active, link, icon, isSubmenu }) => {
                  const itemId = itemIdMap[name] || "";
                  return (name === "Orders" && !canViewOrder) ||
                    (name === "Products" && !canViewProducts) ||
                    (name === "Messages" && !canViewMessaging) ||
                    (name === "Campaigns" && !canViewMessaging) ||
                    (name === "Discounts & Coupons" &&
                      Number(user?.is_staff) !== 0) ||
                    (name === "Connected Apps" &&
                      Number(user?.is_staff) !== 0) ||
                    (name === "Payment Methods" &&
                      Number(user?.is_staff) !== 0) ||
                    (name === "Messages" && !selectedIgDmState) ||
                    (name === "Analytics" && !canViewAnalytics) ? null : (
                    <Tooltip
                      title={isCollapseNavigation ? name : ""}
                      placement="right"
                      key={name}
                    >
                      <li
                        key={name}
                        className="side_list_item"
                        id={itemId}
                        ref={
                          name === "Payment Methods" ? paymentMethodsRef : null
                        }
                      >
                        <CustomLink
                          active={location.pathname?.includes(active || "")}
                          submenu={submenu}
                          asideRef={asideRef}
                          isCollapseNavigation={isCollapseNavigation}
                          setIsCollapseNavigation={setIsCollapseNavigation}
                          isSubmenu={isSubmenu}
                          activeMenu={active}
                          // baseUrl={`/`}
                          to={link || undefined}
                        >
                          <div className="link_item_container">
                            <div className="title_box">
                              {icon}
                              {!isCollapseNavigation && (
                                <motion.p
                                  className="link_name"
                                  variants={OPACITYVARIANT}
                                  initial="init"
                                  animate="visible"
                                  exit="init"
                                >
                                  {name}
                                  {name === "Connected Apps" && showDot && (
                                    <span className="notification_box"></span>
                                  )}
                                </motion.p>
                              )}
                            </div>
                            {isSubmenu && !isCollapseNavigation && (
                              <ChevronDownIcon className="chevrolet" />
                            )}
                          </div>
                        </CustomLink>
                      </li>
                    </Tooltip>
                  );
                }
              )}
            </ul>

            {Number(user?.is_staff) === 0 ? (
              <>
                <div className="line"></div>
                <div
                  ref={ref}
                  className={`store_box ${openStore ? "active" : ""}`}
                >
                  <div
                    onClick={() => {
                      setOpenStore(!openStore);
                    }}
                    className="title"
                  >
                    {!isCollapseNavigation && (
                      <motion.p
                        variants={OPACITYVARIANT}
                        initial="init"
                        animate="visible"
                        exit="init"
                        id="fifth_tour_step"
                      >
                        Store
                      </motion.p>
                    )}
                    <ChevronDownIcon className="chevrolet_store" />
                  </div>
                  <AnimatePresence>
                    {openStore && (
                      <motion.ul
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ type: "just" }}
                        className="side_list"
                      >
                        {StoreMenuLinks.map(
                          ({
                            submenu,
                            name,
                            active,
                            link,
                            icon,
                            isSubmenu,
                          }) => {
                            const storeItemId = storeItemIdMap[name] || "";
                            const linkString = String(link || "");

                            return (
                              <Tooltip
                                title={isCollapseNavigation ? name : ""}
                                key={name}
                                placement="right"
                              >
                                <li
                                  key={name}
                                  className="side_list_item"
                                  id={storeItemId}
                                >
                                  <CustomLink
                                    active={location.pathname?.includes(
                                      linkString
                                    )}
                                    asideRef={ref}
                                    isCollapseNavigation={isCollapseNavigation}
                                    isSubmenu={isSubmenu}
                                    to={link || undefined}
                                  >
                                    <div className="link_item_container">
                                      <div className="title_box">
                                        {icon}
                                        {!isCollapseNavigation && (
                                          <motion.p
                                            className="link_name"
                                            variants={OPACITYVARIANT}
                                            initial="init"
                                            animate="visible"
                                            exit="init"
                                          >
                                            {name}
                                          </motion.p>
                                        )}
                                      </div>
                                      {isSubmenu && !isCollapseNavigation && (
                                        <ChevronDownIcon className="chevrolet" />
                                      )}
                                    </div>
                                  </CustomLink>
                                </li>
                              </Tooltip>
                            );
                          }
                        )}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
                <div className="line"></div>
              </>
            ) : null}
          </div>
        </div>
      </aside>
      <AnimatePresence>
        {isMobileNavigationOpen && (
          <MobileSidebar
            canViewOrder={canViewOrder}
            canManageOrder={canManageOrder}
            canViewProducts={canViewProducts}
            canManageProducts={canManageProducts}
            canViewMessaging={canViewMessaging}
            canManageMessaging={canManageMessaging}
            canViewAnalytics={canViewAnalytics}
            setIsMobileNavigationOpen={setIsMobileNavigationOpen}
          />
        )}
      </AnimatePresence>
      <PaymentMethodsJoyRideComponent
        step={paymentMethodsTourStep}
        isStart={isStartPaymentMethodsTour && isSidebarReady}
        setIsStart={setIsStartPaymentMethodsTour}
        setStep={setPaymentMethodsTourStep}
        from="update"
        updateAppFlag={updateAppFlag}
      />
    </>
  );
};
