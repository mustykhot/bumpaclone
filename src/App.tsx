import { createTheme } from "@mui/material";
import React from "react";
import { ThemeProvider } from "@mui/material";
import ToastWidget from "components/ToastWidget";
import { forwardRef, useState } from "react";
import { AllRoutes } from "./AllRoutes";
import "swiper/scss";
import "swiper/css/effect-fade";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import "./index.scss";
import { usePusherHook } from "hooks/usePusherHook";
import { VideoWidget } from "components/VideoWidget";
import { useEffect } from "react";
import { getTokenFnc, onMessageListener } from "firebase";
import { useGetUser } from "hooks/getUserHook";
import {
  showNotificationToast,
  showToast,
  useAppDispatch,
  useAppSelector,
} from "store/store.hooks";
import NotificationToastWidget from "components/NotificationToastWidget";
import { useGetNotificationsQuery, useSetDeviceTokenMutation } from "services";
import { handleError } from "utils";
import {
  addToAppNotification,
  setShowIndicator,
} from "store/slice/NotificationSlice";
import * as Sentry from "@sentry/react";
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#009444",
      light: "#F5FAFF",
      dark: "#00233F",
    },
    secondary: {
      main: "#FF9700",
      contrastText: "#fff",
      light: "#FF97000D",
    },
  },
  typography: {
    fontFamily: "AvenirNext, Arial",
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:disabled": {
            opacity: 0.5,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "capitalize",
          fontWeight: 500,
          boxShadow: "none",
          fontSize: "14px !important",
          height: "46px",
          "&:hover": {
            boxShadow: "none",
            bgcolor: "transparent",
          },
          "&:disabled": {
            cursor: "not-allowed",
          },
          "&.MuiButton-sizeMedium": {
            fontSize: "0.9rem",
          },
          "&.MuiButton-sizeLarge": {
            minHeight: 42,
          },
          "&.MuiButton-sizeSmall": {
            padding: "6px 16px",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          color: "#00233F",
          height: 28,
          borderRadius: "8px",

          "&.MuiChip-colorSuccess": {
            backgroundColor: "#EBF6F0",
            color: "#009444",
          },
          "&.MuiChip-colorError": {
            backgroundColor: "#FBE6EA",
            color: "#D90429",
          },
          "&.MuiChip-colorWarning": {
            backgroundColor: "#FFF8E7",
            color: "#FFB60A",
          },
          "&.MuiChip-colorDefault": {
            backgroundColor: "#EFF2F6",
            color: "#5C636D",
          },
          "&.MuiChip-colorInfo": {
            backgroundColor: "#EDF5FE",
            color: "#0059DE",
          },

          span: {
            fontWeight: 400,
            fontSize: "12px",
          },
        },
      },
    },
  },
});

Sentry.init({
  dsn: "https://57d4c0d3202520e7d6c751d094b1e44c@o364176.ingest.sentry.io/4506139457224704",
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
  ],
  tracesSampleRate: 1.0,
});

window.onerror = (message, source, lineno, colno, error) => {
  Sentry.captureException(error);
};

window.addEventListener("unhandledrejection", (event) => {
  Sentry.captureException(event.reason);
});

function App() {
  const [themecolor] = useState("neutral");
  const [openModal, setOpenModal] = useState(true);
  const [setDeviceToken, { isLoading }] = useSetDeviceTokenMutation();
  const dispatch = useAppDispatch();
  const { user } = useGetUser();
  const { data, refetch } = useGetNotificationsQuery("" as any, {
    skip: user ? false : true,
  });
  usePusherHook();

  onMessageListener()
    .then((payload: any) => {
      dispatch(setShowIndicator(true));
      showNotificationToast(payload?.notification?.title || "");
    })
    .catch((err) => console.log("failed"));

  useEffect(() => {
    if (user) {
      getTokenFnc().then((token) => {
        if (token) {
          const submitToken = async () => {
            let body = {
              push_token: token,
            };
            try {
              let result = await setDeviceToken(body);
            } catch (error) {
              handleError(error);
            }
          };
          submitToken();
        }
      });
    }
  }, [user]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastWidget />
        <NotificationToastWidget />
        {/* tutorial videos */}
        <VideoWidget />
        <div className={`theme-${themecolor} w-full`}>
          <AllRoutes />
        </div>
      </ThemeProvider>
    </>
  );
}

export default Sentry.withProfiler(App, { name: "BumpaWebApp" });
