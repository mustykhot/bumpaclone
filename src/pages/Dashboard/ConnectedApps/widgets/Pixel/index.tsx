import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { LinkBrokenIcon } from "assets/Icons/LinkBrokenIcon";
import { LinkIcon } from "assets/Icons/LinkIcon";
import { CheckedCircleIcon } from "assets/Icons/CheckedCircleIcon";
import pixel from "assets/images/pixel.png";
import { PixelModal } from "./pixelModal";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import {
  useDisconnectPixelMutation,
  useDisconnectIntegrationScriptMutation,
  useSaveIntegrationScriptMutation,
} from "services";
import Loader from "components/Loader";
import { SuccessfulConnectionModal } from "../Modals/SuccessfulConnectionModal";
import { PixelWarningModal } from "./PixelWarningModal";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import { UpgradeModal } from "components/UpgradeModal";
import { useLocation, useNavigate } from "react-router-dom";

export const Pixel = ({
  integration_code,
  pixel_status,
}: {
  integration_code: string | null;
  pixel_status: boolean;
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const [disconnectPixel, { isLoading: disconnectLoading }] =
    useDisconnectIntegrationScriptMutation();
  const [saveScript, { isLoading }] = useSaveIntegrationScriptMutation();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [isStarterUpgrade, setIsStarterUpgrade] = useState(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mypixel = queryParams.get("mypixel");

  const disconnectFnc = async () => {
    try {
      let result = await disconnectPixel({
        integration_type: "facebook_pixel",
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

  const submitPixelCode = async (
    body: { integration_type: string; integration_code: string },
    callback?: () => void
  ) => {
    const scriptBody = { ...body, integration_type: "facebook_pixel" };
    if (!isSubscriptionExpired && isSubscriptionType !== "free") {
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
      setIsStarterUpgrade(true);
      setOpenUpgradeModal(true);
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (mypixel) {
      setOpenModal(true);
    }
    const timeout = setTimeout(() => {
      if (mypixel) {
        queryParams.delete("mypixel");
        navigate(`${location.pathname}`, { replace: true });
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [mypixel, location.pathname, navigate]);

  if ((isLoading || disconnectLoading) && !openModal) {
    return <Loader />;
  }

  return (
    <>
      <div
        onClick={() => setOpenModal(true)}
        className={`general_conneccted_app_container paystack ${
          !pixel_status ? "not_active" : ""
        }`}
      >
        <div className="title_flex">
          <div className="title_container">
            <img src={pixel} alt="app" className="app_image" />
            <h4>Facebook Pixel</h4>
          </div>
          {pixel_status && (
            <div className="connected_box">
              <CheckedCircleIcon /> <p>Connected</p>
            </div>
          )}
        </div>

        <p className="description">Connect to Facebook Pixel</p>

        <Button
          startIcon={pixel_status ? <LinkBrokenIcon /> : <LinkIcon />}
          className={`connect_button ${pixel_status ? "connected" : ""}`}
          onClick={(e) => {
            if (pixel_status) {
              setOpenWarningModal(true);
            } else {
              setOpenModal(true);
            }
            e.stopPropagation();
          }}
        >
          {pixel_status ? "Disconnect" : "Connect"}
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
        description="Facebook Pixel Code added successfully"
      />
      <PixelModal
        integration_code={integration_code}
        openModal={openModal}
        submitPixelCode={submitPixelCode}
        isLoading={isLoading}
        closeModal={() => {
          setOpenModal(false);
        }}
      />
      <PixelWarningModal
        openModal={openWarningModal}
        closeModal={() => {
          setOpenWarningModal(false);
        }}
        btnAction={() => {
          disconnectFnc();
        }}
      />
      {openUpgradeModal && (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => setOpenUpgradeModal(false)}
          starter={isStarterUpgrade}
          title={`Connect Facebook Pixel to your website`}
          subtitle={`Get better conversions on your Facebook ads & track visitiors/events on your website with Facebook Pixel.`}
          starterFeatures={[
            "Connect Facebook Pixel",
            "Cannot connect Google Analytics",
            "Cannot connect shipping companies on the yearly plan",
            "Cannot connect Woo Commerce",
          ]}
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
          eventName="facebook_pixel"
        />
      )}
    </>
  );
};
