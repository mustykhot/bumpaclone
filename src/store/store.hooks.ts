import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { generateId } from "utils";
import {
  hideToast,
  messageType,
  removeToast,
  toastMessage,
} from "./slice/ToasterSlice";
import store from "./store";
import type { RootState, AppDispatch } from "./store.types";
import { logOut } from "./slice/AuthSlice";
import {
  setVideoLink,
  setVideoTitle,
  setVideoToggle,
} from "./slice/VideoWidgetSlice";
import {
  hideNotificationToast,
  removeNotificationToast,
  toastNotificationMessage,
} from "./slice/NotificationToasterSlice";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// export const getToken = () => store.getState().auth.token;

// show toaster function
export const showToast = (
  text: string,
  messageType?: messageType,
  duration: number = 3000
) => {
  const id = generateId();
  store.dispatch(
    toastMessage({
      text,
      messageType: messageType || "success",
      id,
    })
  );
  setTimeout(() => {
    closeToast(id);
  }, duration);
};

export const showNotificationToast = (
  notificationText: string,
  duration: number = 8000
) => {
  const id = generateId();
  store.dispatch(
    toastNotificationMessage({
      notificationText,
      id,
    })
  );
  setTimeout(() => {
    closeNotificationToast(id);
  }, duration);
};

export const showVideoModal = (value: boolean, link: any, title?: string) => {
  store.dispatch(setVideoToggle(value));
  store.dispatch(setVideoLink(link));
  store.dispatch(setVideoTitle(title));
};

// close toaster
export const closeToast = (id: string) => {
  store.dispatch(removeToast(id));
  setTimeout(() => {
    store.dispatch(removeToast(id));
  }, 700);
};

export const closeNotificationToast = (id: string) => {
  store.dispatch(hideNotificationToast(id));
  setTimeout(() => {
    store.dispatch(removeNotificationToast(id));
  }, 700);
};

export const logOutHandler = () => {
  store.dispatch(logOut({ redirect: false }));
};
