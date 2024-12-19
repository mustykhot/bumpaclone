import { useAppSelector, closeToast } from "../../store/store.hooks";
import { selectToasts } from "../../store/slice/ToasterSlice";
import { XIcon } from "assets/Icons/XIcon";
import "./style.scss";
import { CheckCircleBrokenIcon } from "assets/Icons/CheckCircleBrokenIcon";
import { XCircleIcon } from "assets/Icons/XCircleIcon";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";

const ToastWidget = () => {
  const toasts = useAppSelector(selectToasts);

  return (
    <>
      {toasts?.length && toasts[0] && toasts[0]?.messageType ? (
        <div
          className={`fixed right-4 bottom-4 grid gap-y-4 pr-5 pt-5 z-[3000] pd_toast_container ${
            !toasts?.length ? "hidden" : ""
          }`}
        >
          {toasts?.map((toast: any) => (
            <div
              className={`toast_box  ${
                toast.isOpen ? "animate-slide" : "translate-x-[150vw]"
              } transition-transform duration-700`}
              key={`toast-${toast.id}`}
            >
              <div className="toast_p_box flex-grow flex flex-col">
                {toast.messageType === "success" ? (
                  <CheckCircleBrokenIcon className="icon" />
                ) : toast.messageType === "warning" ? (
                  <InfoCircleIcon stroke="#f4a408" className="icon" />
                ) : (
                  <XCircleIcon stroke="#D90429" className="icon" />
                )}

                <span className="text-[16px] font-medium mt-[8px] text-[#ffffff]  ">
                  {toast.messageType === "success"
                    ? "Success"
                    : toast.messageType === "warning"
                    ? "Note"
                    : "Unsuccessful"}
                </span>
                <p className="exact_toast_p text-[#9BA2AC] text-[14px] font-medium">
                  {toast.text}
                </p>
              </div>
              <div
                onClick={() => closeToast(toast.id)}
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

export default ToastWidget;
