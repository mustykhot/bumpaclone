import { useEffect, useState } from "react";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "./style.scss";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Articles } from "./articles";
import { AppNotification } from "./appnotification";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { useGetNotificationsQuery, useMarkAllAsReadMutation } from "services";
import {
  addToAppNotification,
  setShowIndicator,
} from "store/slice/NotificationSlice";
import { showToast, useAppDispatch } from "store/store.hooks";
import { handleError } from "utils";

type ViewNotificationsProps = {
  openModal: boolean;
  closeModal: () => void;
  data: any;
  isLoading: any;
  isError: any;
  isFetching: any;
  refetch: any;
};

const tabList = [
  { label: "Store Notifications", value: "store" },
  { label: "Latest Updates", value: "articles" },
];

type MessageEventData = {
  msg: string;
  url: string;
};
type MessageEvent = {
  data: MessageEventData;
};

export const ViewNotifications = ({
  openModal,
  closeModal,
  data,
  isLoading,
  isError,
  isFetching,
  refetch,
}: ViewNotificationsProps) => {
  const [tab, setTab] = useState("store");
  const dispatch = useAppDispatch();
  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };
  const [markAllAsRead, { isLoading: loadAllAsRead }] =
    useMarkAllAsReadMutation();

  const markAllAsReadFnc = async () => {
    try {
      let result = await markAllAsRead();
      if ("data" in result) {
        showToast("Marked Successfully", "success");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    navigator.serviceWorker.addEventListener(
      "message",
      (event: MessageEvent) => {
        if (event && event.data) {
          // const notification = JSON.parse(event.data.msg);
          dispatch(setShowIndicator(true));
        }
      }
    );
  }, []);

  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children pd_view_notification">
          <div className="top_section">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
            >
              <div className="not_header">
                <div className="title">
                  <p className="header">Notifications</p>

                  {/* {notifications.length > 0 && 
                  <p className="not_number">{notifications.length}</p>
                  } */}
                </div>
                <IconButton
                  onClick={() => {
                    refetch();
                  }}
                  className="refresh"
                >
                  <RefreshIcon />
                </IconButton>
              </div>
            </ModalRightTitle>

            <div className="tab_container">
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tab}
                  onChange={handleChangeTab}
                  variant="scrollable"
                  scrollButtons={false}
                >
                  {tabList.map((item, i) => (
                    <Tab key={i} value={item.value} label={item.label} />
                  ))}
                </Tabs>
              </Box>
            </div>

            <div className="notification_details">
              {tab === "store" && (
                <AppNotification
                  closeModal={closeModal}
                  data={data}
                  isLoading={isLoading}
                  isFetching={isFetching}
                  isError={isError}
                />
              )}
              {tab === "articles" && <Articles />}
            </div>
          </div>
          {tab === "store" && (
            <Button
              onClick={() => {
                markAllAsReadFnc();
              }}
              className="markAll"
            >
              {loadAllAsRead ? (
                <CircularProgress size="1.5rem" sx={{ color: "#5C636D" }} />
              ) : (
                "Mark All As Read"
              )}
            </Button>
          )}
        </div>
      </ModalRight>
    </>
  );
};
