import { useState } from "react";
import { Button } from "@mui/material";
import google from "assets/images/google-analytics.png";
import { LinkBrokenIcon } from "assets/Icons/LinkBrokenIcon";
import { LinkIcon } from "assets/Icons/LinkIcon";
import { CheckedCircleIcon } from "assets/Icons/CheckedCircleIcon";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import {
  useDisconnectIntegrationScriptMutation,
  useSaveIntegrationScriptMutation,
} from "services";
import Loader from "components/Loader";
import { SuccessfulConnectionModal } from "../Modals/SuccessfulConnectionModal";
import { PixelWarningModal } from "../Pixel/PixelWarningModal";
import { GoogleAnalyticsModal } from "./GoogleAnalyticsModal";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import { UpgradeModal } from "components/UpgradeModal";
import { AnalyticsWarningModal } from "./AnalyticsWarningModal";

export const GoogleAnalytics = ({
  integration_code,
  script_status,
}: {
  integration_code: string | null;
  script_status: boolean;
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const [saveScript, { isLoading }] = useSaveIntegrationScriptMutation();
  const [disconnectAnalytics, { isLoading: disconnectLoading }] =
    useDisconnectIntegrationScriptMutation();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);

  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);

  const disconnectFnc = async () => {
    try {
      let result = await disconnectAnalytics({
        integration_type: "google_analytics",
      });
      if ("data" in result) {
        showToast("Disconnected successfully", "success");
        setOpenWarningModal(false);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };
  const submitScript = async (
    body: { integration_type: string; integration_code: string },

    callback?: () => void
  ) => {
    const scriptBody = { ...body, integration_type: "google_analytics" };
    if (
      !isSubscriptionExpired &&
      isSubscriptionType !== "free" &&
      isSubscriptionType !== "starter"
    ) {
      try {
        let result = await saveScript(scriptBody);
        if ("data" in result) {
          showToast("Integrated successfully", "success");
          setOpenSuccessModal(true);
          callback && callback();
          if (typeof _cio !== "undefined") {
            _cio.track("web_Facebook_pixel", scriptBody);
          }
          if (typeof mixpanel !== "undefined") {
            mixpanel.track("web_Facebook_pixel", scriptBody);
          }
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    } else {
      setOpenUpgradeModal(true);
    }
  };

  if ((isLoading || disconnectLoading) && !openModal) {
    return <Loader />;
  }

  return (
    <>
      <div
        onClick={() => setOpenModal(true)}
        className="general_conneccted_app_container paystack"
      >
        <div className="title_flex">
          <div className="title_container">
            <img src={google} alt="app" className="app_image" />
            <h4>Google Analytics</h4>
          </div>
          {script_status && (
            <div className="connected_box">
              <CheckedCircleIcon /> <p>Connected</p>
            </div>
          )}
        </div>

        <p className="description">Connect Google Analytics</p>

        <Button
          startIcon={script_status ? <LinkBrokenIcon /> : <LinkIcon />}
          className={`connect_button ${script_status ? "connected" : ""}`}
          onClick={(e) => {
            if (script_status) {
              setOpenWarningModal(true);
            } else {
              setOpenModal(true);
            }
            e.stopPropagation();
          }}
        >
          {script_status ? "Disconnect" : "Connect"}
        </Button>
      </div>
      <SuccessfulConnectionModal
        openModal={openSuccessModal}
        closeModal={() => {
          setOpenSuccessModal(false);
        }}
        btnAction={() => {
          setOpenSuccessModal(false);
        }}
        isMeta={true}
        btnText="Continue"
        title="Success"
        description="Google Analytics Code added successfully"
      />
      <AnalyticsWarningModal
        openModal={openWarningModal}
        closeModal={() => {
          setOpenWarningModal(false);
        }}
        btnAction={() => {
          disconnectFnc();
        }}
      />
      <GoogleAnalyticsModal
        integration_code={integration_code}
        openModal={openModal}
        submitScript={submitScript}
        isLoading={isLoading}
        closeModal={() => {
          setOpenModal(false);
        }}
      />
      {openUpgradeModal && (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => setOpenUpgradeModal(false)}
          pro={true}
          proFeatures={[
            "Connect Facebook Pixel",
            "Cannot connect Google Analytics",
            "Can connect shipping companies",
            "Cannot connect Woo Commerce",
          ]}
          growthFeatures={[
            "Connect Facebook Pixel",
            "Connect Google Analytics",
            "Can connect shipping companies",
            "Can connect Woo Commerce",
          ]}
        />
      )}
    </>
  );
};
