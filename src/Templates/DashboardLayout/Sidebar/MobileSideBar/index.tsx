import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IconButton } from "@mui/material";
import Button from "@mui/material/Button/Button";
import "./style.scss";
import CustomLink from "../CustomRouteLink";
import DashboardMenuLinks, { StoreMenuLinks } from "../menuLinks";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { HardDriveIcon } from "assets/Icons/HardDriveIcon";
import { XIcon } from "assets/Icons/XIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { UseOutsideClick } from "components/useOutsideClick";
import { useGetStoreInformationQuery } from "services";
import { selectCurrentStore, selectCurrentUser } from "store/slice/AuthSlice";
import { selectShowIgDm } from "store/slice/InstagramSlice";
import { selectIsMaintenanceModeEnabled } from "store/slice/MaintenanceSlice";
import { selectIsGrowthTour } from "store/slice/NotificationSlice";
import { useAppSelector } from "store/store.hooks";
import SwitchLocation from "Templates/DashboardLayout/widget/SwitchLocation";
import { MaintenanceModeModal } from "pages/Dashboard/Home/Widgets/MaintenanceModeModal";

type SidebarProps = {
  setIsMobileNavigationOpen: (value: boolean) => void;
  canViewOrder: boolean;
  canManageOrder: boolean;
  canViewAnalytics: boolean;
  canViewMessaging: boolean;
  canManageMessaging: boolean;
  canViewProducts: boolean;
  canManageProducts: boolean;
};
const MobileSidebar = ({
  setIsMobileNavigationOpen,
  canViewOrder,
  canViewAnalytics,
  canViewMessaging,
  canViewProducts,
}: SidebarProps) => {
  const [openStore, setOpenStore] = useState(false);
  const [openMaintenanceModal, setOpenMaintenanceModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedIgDmState = useAppSelector(selectShowIgDm);
  const userStore = useAppSelector(selectCurrentStore);
  const user = useAppSelector(selectCurrentUser);
  const isGrowthTour = useAppSelector(selectIsGrowthTour);
  const isMaintenanceModeEnabled = useAppSelector(
    selectIsMaintenanceModeEnabled
  );
  const { data: storeData } = useGetStoreInformationQuery();
  const ref = useRef() as MutableRefObject<HTMLDivElement>;
  UseOutsideClick({ ref, isOpen: openStore, setIsOpen: setOpenStore });

  const openInNewTab = () => {
    const currentUrl = window.location.href;
    window.open(currentUrl, "_blank");
  };

  useEffect(() => {
    if (isGrowthTour) {
      setOpenStore(true);
    }
  }, [isGrowthTour]);

  return (
    <>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "just" }}
        className="pd_sidebar pd_mobile_sidebar"
      >
        <div className="top_section">
          <IconButton
            type="button"
            onClick={() => {
              setIsMobileNavigationOpen(false);
            }}
            className="icon_button_container"
          >
            <XIcon />
          </IconButton>
          <div className="button_section">
            <Button
              className={"store_button"}
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

            <SwitchLocation />
            {location.pathname.includes("dashboard/pos") ? (
              <Button
                className={"store_button pos pos_active mt"}
                startIcon={<PlusIcon stroke="#fff" />}
                onClick={() => {
                  openInNewTab();
                  setIsMobileNavigationOpen(false);
                }}
                variant={"contained"}
              >
                Create New Order
              </Button>
            ) : (
              <Button
                className={
                  location.pathname.includes("dashboard/pos")
                    ? "store_button pos pos_active mt"
                    : "store_button pos mt"
                }
                startIcon={
                  <HardDriveIcon
                    stroke={
                      location.pathname.includes("dashboard/pos") ? "#fff" : ""
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
          </div>
        </div>
        <div className="flex_container">
          <div className="link_container">
            <p className="quick_acess">Quick Access</p>
            <ul className="side_list">
              {DashboardMenuLinks.map(
                ({ submenu, name, active, link, icon, isSubmenu }) => {
                  return (name === "Orders" && !canViewOrder) ||
                    (name === "Products" && !canViewProducts) ||
                    (name === "Messages" && !canViewMessaging) ||
                    (name === "Campaigns" && !canViewMessaging) ||
                    (name === "Discounts & Coupons" &&
                      Number(user?.is_staff) !== 0) ||
                    (name === "Connected Apps" &&
                      Number(user?.is_staff) !== 0) ||
                    (name === "Messages" && !selectedIgDmState) ||
                    (name === "Analytics" && !canViewAnalytics) ||
                    (name === "Payment Methods" &&
                      Number(user?.is_staff) !== 0) ? null : (
                    <li key={name} className="side_list_item">
                      <CustomLink
                        active={location.pathname?.includes(active || "")}
                        submenu={submenu}
                        isSubmenu={isSubmenu}
                        activeMenu={active}
                        setIsMobileNavigationOpen={setIsMobileNavigationOpen}
                        // baseUrl={`/`}
                        to={link || undefined}
                      >
                        <div className="link_item_container">
                          <div className="title_box">
                            {icon} <p className="link_name">{name}</p>
                          </div>
                          {isSubmenu && (
                            <ChevronDownIcon className="chevrolet" />
                          )}
                        </div>
                      </CustomLink>
                    </li>
                  );
                }
              )}
            </ul>
            {Number(user?.is_staff) === 0 ? (
              <>
                <div className="line"></div>
                <div ref={ref} className="store_box">
                  <div
                    onClick={() => {
                      setOpenStore(!openStore);
                    }}
                    className="title"
                  >
                    <p>Store</p>
                    <ChevronDownIcon />
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
                            return (
                              <li key={name} className="side_list_item">
                                <CustomLink
                                  active={location.pathname?.includes(
                                    active || ""
                                  )}
                                  submenu={submenu}
                                  activeMenu={active}
                                  setIsMobileNavigationOpen={
                                    setIsMobileNavigationOpen
                                  }
                                  isSubmenu={isSubmenu}
                                  // baseUrl={`/`}
                                  to={link || undefined}
                                >
                                  <div className="link_item_container">
                                    <div className="title_box">
                                      {icon} <p className="link_name">{name}</p>
                                    </div>
                                    {isSubmenu && (
                                      <ChevronDownIcon className="chevrolet" />
                                    )}
                                  </div>
                                </CustomLink>
                              </li>
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
      </motion.div>
      <MaintenanceModeModal
        openModal={openMaintenanceModal}
        closeModal={() => {
          setOpenMaintenanceModal(false);
        }}
      />
    </>
  );
};

export default MobileSidebar;
