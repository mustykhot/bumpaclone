import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import parse from "html-react-parser";
import { IconButton } from "@mui/material";
import { useMarkSingleAsReadMutation } from "services";
import { SettlementIcon } from "assets/Icons/SettlementIcon";
import { TransactionIcon } from "assets/Icons/TransactionIcon";
import { InventoryMoveIcon } from "assets/Icons/InventoryMoveIcon";
import { ReviewIcon } from "assets/Icons/ReviewIcon";
import speaker from "assets/images/speaker.png";
import { ShopingIcon } from "assets/Icons/Sidebar/ShopingIcon";
import { BuildingIcon } from "assets/Icons/BuildingIcon";
import { TagIcon } from "assets/Icons/TagIcon";
import EmptyResponse from "components/EmptyResponse";
import ErrorMsg from "components/ErrorMsg";
import { LoadingProductBox } from "pages/Dashboard/Orders/widgets/product/SelectProductModal";
import { useAppSelector } from "store/store.hooks";
import { selectAppNotification } from "store/slice/NotificationSlice";

export type AppNotificationProps = {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: NotificationDetails;
  read_at: null;
  created_at: string;
  updated_at: string;
  created: any;
};

type NotificationDetails = {
  title: string;
  body: string;
  action_url: string;
  created: string;
};

function groupNotificationsByDate(notifications: AppNotificationProps[]) {
  if (notifications?.length) {
    const sortedNotifications = notifications.slice().sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB.getTime() - dateA.getTime();
    });

    const groups: { [date: string]: AppNotificationProps[] } = {};
    sortedNotifications.forEach((notification) => {
      const localeDate = new Date(notification.created_at).toLocaleDateString();
      const date = new Date(notification.created_at);
      const title = getGroupTitle(localeDate, date);

      if (!groups[title]) {
        groups[title] = [];
      }
      groups[title].push(notification);
    });

    return groups;
  } else {
    return {};
  }
}

function getGroupTitle(localeDate: string, date: Date) {
  const today = new Date().toLocaleDateString();
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();
  if (localeDate === today) {
    return "Today";
  } else if (localeDate === yesterday) {
    return "Yesterday";
  } else {
    return moment(new Date(date)).format("ll");
  }
}

function formatTime(date: string) {
  const time = new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return time.replace(" ", "").toLowerCase();
}

export const AppNotification = ({
  closeModal,
  data,
  isLoading,
  isError,
  isFetching,
}: {
  closeModal: () => void;
  data: any;
  isLoading: any;
  isError: any;
  isFetching: any;
}) => {
  const appNotifications = useAppSelector(selectAppNotification);
  const [groups, setGroups] = useState<any>({});
  const navigate = useNavigate();
  const [markOneAsRead] = useMarkSingleAsReadMutation();

  const markAsReadFnc = async (id: string) => {
    try {
      let response = markOneAsRead(id);
    } catch (error) {}
  };

  useEffect(() => {
    if (appNotifications) {
      const groupsObj = groupNotificationsByDate(
        appNotifications?.length ? appNotifications : []
      );
      setGroups(groupsObj);
    }
  }, [appNotifications]);

  const getTag = (type: any) => {
    switch (true) {
      case type.includes("Order"):
        return (
          <IconButton type="button" className={`Order icon_button_container`}>
            <ShopingIcon isActive />
          </IconButton>
        );
      case type.includes("ProductReviewNotification"):
        return (
          <IconButton
            type="button"
            className={`ProductReviewNotification icon_button_container`}
          >
            <ReviewIcon />
          </IconButton>
        );
      case type.includes("Product"):
        return (
          <IconButton type="button" className={`Product icon_button_container`}>
            <TagIcon stroke="#0059DE" />
          </IconButton>
        );

      case type.includes("Store"):
        return (
          <IconButton type="button" className={`Store icon_button_container`}>
            <BuildingIcon stroke="#FFB60A" />
          </IconButton>
        );

      case type.includes("Settlement"):
        return (
          <IconButton
            type="button"
            className={`Settlement icon_button_container`}
          >
            <SettlementIcon stroke="#009444" />
          </IconButton>
        );
      case type.includes("Transaction"):
        return (
          <IconButton
            type="button"
            className={`Transaction icon_button_container`}
          >
            <TransactionIcon stroke="#009444" />
          </IconButton>
        );
      case type.includes("InventoryTransferCompletedNotification"):
        return (
          <IconButton
            type="button"
            className={`InventoryTransferCompletedNotification icon_button_container`}
          >
            <InventoryMoveIcon />
          </IconButton>
        );

      default:
        break;
    }
  };

  const getLink = (meta: any) => {
    let metaObject = JSON.parse(meta);
    switch (metaObject.type) {
      case "order":
        return navigate(`/dashboard/orders/${metaObject.id}`);
      case "product":
        return navigate(`/dashboard/product/${metaObject.id}`);
      case "location":
        return navigate(`/dashboard/location/${metaObject.destination_id}`);
      default:
        break;
    }
  };

  const getLinkUrl = (notificationObject: { type: string; id: string }) => {
    switch (notificationObject.type) {
      case "order":
        return navigate(`/dashboard/orders/${notificationObject.id}`);
      case "product":
        return navigate(`/dashboard/products/${notificationObject.id}`);
      default:
        break;
    }
  };

  return (
    <>
      {isError ? (
        <ErrorMsg error="Something went wrong" />
      ) : isLoading || isFetching ? (
        [1, 2, 3, 4].map((item) => <LoadingProductBox key={item} />)
      ) : data?.notifications?.length ? (
        <>
          {Object.entries(groups || {}).map(([date, group]: any) => (
            <div className="group_container" key={date}>
              <p className="period">{date}</p>
              <div className="list">
                {group.map((item: any) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      markAsReadFnc(item?.id);
                      if (item?.data?.metadata) {
                        getLink(item?.data?.metadata);
                        closeModal();
                      } else {
                        if (item?.data?.product_id) {
                          if (
                            item?.type?.includes("ProductReviewNotification")
                          ) {
                            window.open(item?.data?.action_url, "_blank");
                          } else {
                            getLinkUrl({
                              type: "product",
                              id: item.data.product_id,
                            });
                          }
                        } else if (item?.data?.order_id) {
                          getLinkUrl({
                            type: "order",
                            id: item.data.order_id,
                          });
                        } else if (
                          item?.data?.action_url &&
                          item?.data?.action_url.includes("orders")
                        ) {
                          const actionUrl = item?.data?.action_url || "";
                          const orderId = actionUrl?.substring(
                            actionUrl.lastIndexOf("/") + 1
                          );
                          navigate(`/dashboard/orders/${orderId}`);
                        }
                        closeModal();
                      }
                    }}
                    className="single_notification"
                  >
                    {item.read_at === null && (
                      <div className="red_dot">
                        <span></span>
                      </div>
                    )}

                    {getTag(item.type)}
                    <div className="text_box">
                      <div className="title_description">
                        <p className="box_title">{item?.data?.title}</p>
                        <p className={`message ${item.read_at ? "read" : ""}`}>
                          {parse(item.data?.body)}
                        </p>
                      </div>

                      <p className="time">{formatTime(item.created)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <EmptyResponse
          message="You have no pending notification"
          image={speaker}
        />
      )}
    </>
  );
};
