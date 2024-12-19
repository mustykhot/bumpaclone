import { IconButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { CoinsHandIcon } from "assets/Icons/CoinsHandIcon";
import { HardDriveIcon } from "assets/Icons/HardDriveIcon";
import { LightBulbIcon } from "assets/Icons/LightBulbIcon";
import { LogoIcon } from "assets/Icons/LogoIcon";
import { LogOutIcon } from "assets/Icons/LogoutIcon";
import { MenuIcon } from "assets/Icons/MenuIcon";
import { NotificationIcon } from "assets/Icons/NotificationIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { Settings03Icon } from "assets/Icons/Settings03Icon";
import { UserSquareIcon } from "assets/Icons/USerSquareIcon";
import DropDownWrapper from "components/DropDownWrapper";
import { MaintenanceModeModal } from "pages/Dashboard/Home/Widgets/MaintenanceModeModal";
import { KYCFlow } from "pages/Dashboard/KYC/KYCFlow";
import { LimitModal } from "pages/Dashboard/KYC/LimitModal";
import {
  useGetMetaIntegrationQuery,
  useGetNotificationsQuery,
  useGetStoreInformationQuery,
} from "services";
import {
  selectCurrentStore,
  selectCurrentUser,
  selectIsLoggedIn,
} from "store/slice/AuthSlice";
import { setMetaData, setShowIgDm } from "store/slice/InstagramSlice";
import { selectIsMaintenanceModeEnabled } from "store/slice/MaintenanceSlice";
import {
  addToAppNotification,
  selectIsTour,
  selectShowIndicator,
  setIsTour,
  setShowIndicator,
} from "store/slice/NotificationSlice";
import {
  logOutHandler,
  useAppDispatch,
  useAppSelector,
} from "store/store.hooks";
import { selectIsSubscriptionDets } from "store/slice/AuthSlice";
import { ViewNotifications } from "Templates/DashboardLayout/Navbar/Notifications";
import SwitchLocation from "../widget/SwitchLocation";
import { MaintenanceModal } from "./MaintenanceModal/MaintenanceModal";
import { NotificationSettings } from "./Notifications/NotificationSettings";
import { handleVerificationNextStep } from "store/slice/KycSlice";

type NavbarProps = {
  isMobileNavigationOpen: boolean;
  isCollapseNavigation: boolean;
  setIsMobileNavigationOpen: (value: boolean) => void;
  setIsCollapseNavigation: (value: boolean) => void;
};

export const Navbar = ({
  isMobileNavigationOpen,
  isCollapseNavigation,
  setIsMobileNavigationOpen,
  setIsCollapseNavigation,
}: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isMaintenanceModeEnabled = useAppSelector(
    selectIsMaintenanceModeEnabled
  );
  const isLoggedInAsPro = useAppSelector(selectIsLoggedIn);
  const user = useAppSelector(selectCurrentUser);
  const userStore = useAppSelector(selectCurrentStore);
  const showIndicator = useAppSelector(selectShowIndicator);
  const isTour = useAppSelector(selectIsTour);
  const [openModal, setOpenModal] = useState(false);
  const [openNotificationSettingModal, setOpenNotificationSettingModal] =
    useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [openMaintenanceModal, setOpenMaintenanceModal] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const { data: meta, isLoading: metaLoad } = useGetMetaIntegrationQuery();
  const { data: storeData } = useGetStoreInformationQuery();
  const { data, isLoading, isError, refetch, isFetching } =
    useGetNotificationsQuery();

  // KYC
  const [openLimitModal, setOpenLimitModal] = useState(false);

  const isSubscriptionDets = useAppSelector(selectIsSubscriptionDets);
  const openInNewTab = () => {
    const currentUrl = window.location.href;
    window.open(currentUrl, "_blank");
  };

  const userTier =
    user?.bvn_verified_at && user?.nin_verified_at
      ? userStore?.cac !== null
        ? 2
        : 1
      : null;

  const startTour = () => {
    dispatch(setIsTour(false));
    setTimeout(() => {
      dispatch(setIsTour(true));
    }, 100);
  };

  useEffect(() => {
    if (data) {
      dispatch(addToAppNotification(data.notifications || []));
    }
  }, [data]);

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
    if (meta && meta?.integration) {
      dispatch(setShowIgDm(true));
      dispatch(setMetaData(meta));
    } else {
      dispatch(setShowIgDm(false));
    }
  }, [meta]);

  return (
    <>
      <ViewNotifications
        openModal={isViewOpen}
        data={data}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        isFetching={isFetching}
        closeModal={() => {
          setIsViewOpen(false);
        }}
      />
      <NotificationSettings
        openModal={openNotificationSettingModal}
        closeModal={() => {
          setOpenNotificationSettingModal(false);
        }}
      />
      <div className="pd_nav_wrapper">
        <nav id="navbar" className="pd_navbar">
          <div className="logo_container">
            <IconButton
              type="button"
              className="icon_button_container pad hamburger mobile"
              onClick={() => {
                setIsMobileNavigationOpen(true);
              }}
            >
              <MenuIcon />
            </IconButton>
            <LogoIcon className="logo" />

            <IconButton
              type="button"
              className="icon_button_container pad hamburger"
              onClick={() => {
                setIsCollapseNavigation(!isCollapseNavigation);
              }}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <div className="nav_flex">
            <div>
              <SwitchLocation />
            </div>
            <div className="store_section">
              {location.pathname.includes("dashboard/pos") ? (
                <Button
                  className={"store_button pos pos_active"}
                  startIcon={<PlusIcon stroke="#fff" />}
                  variant={"contained"}
                  onClick={() => {
                    openInNewTab();
                  }}
                >
                  Create New Order
                </Button>
              ) : (
                <Button
                  id="first_growth_tour_step"
                  className={
                    location.pathname.includes("dashboard/pos")
                      ? "store_button pos pos_active "
                      : "store_button pos"
                  }
                  startIcon={
                    <HardDriveIcon
                      stroke={
                        location.pathname.includes("dashboard/pos")
                          ? "#fff"
                          : ""
                      }
                    />
                  }
                  onClick={() => {
                    navigate("/dashboard/pos");
                  }}
                  variant={"contained"}
                >
                  Point of Sale
                </Button>
              )}
              {/* <Button
              className={
                "store_button pos"
              }
              startIcon={
                <SmallWalletIcon
                />
              }
              onClick={() => { navigate("/dashboard/wallet") }}
              variant={"contained"}
            >
              <span className="text-grey-01 font-medium">Wallet</span>
            </Button> */}
              <Button
                className={"store_button"}
                id="seventh_tour_step"
                onClick={() => {
                  if (!isMaintenanceModeEnabled) {
                    setOpenMaintenanceModal(true);
                  } else {
                    window.open(
                      storeData
                        ? storeData?.store?.url_link
                        : userStore?.url_link,
                      "_blank"
                    );
                  }
                }}
                variant={"outlined"}
              >
                View Store
              </Button>
              <div className={`notification_cover`}>
                {showIndicator && <div className="red_dot"></div>}
                <IconButton
                  type="button"
                  className="button_icon notification_icon_box second"
                  onClick={() => {
                    if (isLoggedInAsPro) {
                      setIsViewOpen(true);
                      dispatch(setShowIndicator(false));
                      refetch();
                    }
                  }}
                >
                  <NotificationIcon stroke="#848D99" />
                </IconButton>
              </div>

              <DropDownWrapper
                origin="right"
                className="navbar_dropdown"
                action={
                  <Button
                    sx={{
                      color: "primary.dark",
                      p: 0,
                      ".MuiButton-endIcon": {
                        m: 0,
                        "&>*:nth-of-type(1)": {
                          fontSize: "24px",
                        },
                      },
                    }}
                    endIcon={<ChevronDownIcon />}
                  >
                    <Avatar
                      sx={{
                        width: {
                          xs: "32px",
                          md: "40px",
                        },
                        height: { xs: "35px", md: "40px" },
                      }}
                      src={user?.avatar || userStore?.logo_url}
                      className="avatar"
                      alt={"avatar"}
                    />
                    <p className="store_name ">{user?.name || "Store Name"}</p>
                  </Button>
                }
              >
                <div className="cover_buttons">
                  <ul className="select_list btn_list">
                    <li>
                      <Button
                        onClick={() => {
                          if (isLoggedInAsPro) {
                            navigate("/dashboard/profile");
                          }
                        }}
                        startIcon={
                          <span className="span">
                            <UserSquareIcon />
                          </span>
                        }
                      >
                        Profile
                      </Button>
                    </li>
                    <li>
                      <Button
                        onClick={() => {
                          if (isLoggedInAsPro) {
                            setOpenModal(true);
                          }
                        }}
                        startIcon={
                          <span className="span">
                            <Settings03Icon />{" "}
                          </span>
                        }
                        disabled={!isMaintenanceModeEnabled}
                      >
                        Maintenance Mode
                      </Button>
                    </li>
                    {screenWidth > 1300 && (
                      <li>
                        <Button
                          onClick={() => {
                            if (isLoggedInAsPro) {
                              navigate("/dashboard");
                              startTour();
                            }
                          }}
                          startIcon={
                            <span className="span">
                              <LightBulbIcon strokeWidth={2} />{" "}
                            </span>
                          }
                        >
                          Dashboard Walkthrough
                        </Button>
                      </li>
                    )}
                    {user && Number(user.is_staff) === 0 && (
                      <li>
                        <Button
                          onClick={() => {
                            setOpenLimitModal(true);
                          }}
                          startIcon={
                            <span className="span settlement">
                              <CoinsHandIcon stroke="#5C636D" />{" "}
                            </span>
                          }
                        >
                          Settlement Limit
                          <span className="settlement_text">New</span>
                        </Button>
                      </li>
                    )}
                  </ul>
                  <ul className="select_list btn_list logout">
                    <li>
                      <Button
                        onClick={() => {
                          logOutHandler();
                        }}
                        startIcon={<LogOutIcon />}
                      >
                        Log Out
                      </Button>
                    </li>
                  </ul>
                </div>
              </DropDownWrapper>
            </div>
          </div>
        </nav>
      </div>

      <MaintenanceModal
        openModal={openModal}
        closeModal={() => {
          setOpenModal(false);
        }}
      />
      {/* KYC Modals*/}
      <KYCFlow />
      {openLimitModal && (
        <LimitModal
          openModal={openLimitModal}
          closeModal={() => {
            setOpenLimitModal(false);
          }}
          userTier={userTier}
          openCACModal={() => {
            setOpenLimitModal(false);
            dispatch(
              handleVerificationNextStep({
                currentStep: "updateBusinessName",
                nextModal: "updateBusinessName",
              })
            );
          }}
          fromNav={true}
          openVerifyIdentityModal={() => {
            setOpenLimitModal(false);
            dispatch(
              handleVerificationNextStep({
                currentStep: "verifyIdentity",
                nextModal: "verifyIdentity",
              })
            );
          }}
        />
      )}
      <MaintenanceModeModal
        openModal={openMaintenanceModal}
        closeModal={() => {
          setOpenMaintenanceModal(false);
        }}
      />
    </>
  );
};
