import {
  useAppSelector,
  closeToast,
  closeNotificationToast,
} from "../../store/store.hooks";
import { XIcon } from "assets/Icons/XIcon";
import "./style.scss";
import { CheckCircleBrokenIcon } from "assets/Icons/CheckCircleBrokenIcon";
import { XCircleIcon } from "assets/Icons/XCircleIcon";
import { selectNotificationToasts } from "store/slice/NotificationToasterSlice";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";

const NotificationToastWidget = () => {
  const toasts = useAppSelector(selectNotificationToasts);

  return (
    <>
      {toasts?.length ? (
        <div
          className={`fixed right-4 top-4 grid gap-y-4 pr-5 pt-5 z-[2000] pd_notification_toast_container ${
            !toasts?.length ? "hidden" : ""
          }`}
        >
          {toasts?.map((toast: any) => (
            <div
              className={`toast_box  ${
                toast.isNotificationOpen
                  ? "animate-slide"
                  : "translate-x-[150vw]"
              } transition-transform duration-700`}
              key={`toast-${toast.id}`}
            >
              <div className="not_flex flex-grow flex gap-3 items-center">
                <InfoCircleIcon />
                <p className="text-[#9BA2AC] text-[14px] font-medium">
                  {toast.notificationText}
                </p>
              </div>
              <div
                onClick={() => closeNotificationToast(toast.id)}
                className="cursor-pointer"
              >
                <XIcon stroke="#ffffff" className="cancel" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default NotificationToastWidget;
