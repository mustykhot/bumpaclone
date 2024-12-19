import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import { useLocation } from "react-router-dom";
import "./style.scss";
import Loader from "components/Loader";
import {
  useDisconnectMetaMutation,
  useGetMetaIntegrationQuery,
  useGetPixelCodeQuery,
  usePostMetaCallbackMutation,
  useSavePaymentSettingsMutation,
  useGetIntegrationScriptQuery,
} from "services";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
import { defaultOptions } from "utils/constants/general";
import { FincraWallet } from "./widgets/FincraWallet";
import { useGetWalletDetailsQuery } from "services";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import { Shipbubble } from "./widgets/Shipbubble";
import { GoogleAnalytics } from "./widgets/GoogleAnalytics";
import { InfoCircleXLIcon } from "assets/Icons/InfoCircleXLIcon";
import { Button } from "@mui/material";
import { Instagram } from "./widgets/Instagram";
import { InstagramWarningModal } from "./widgets/Instagram/InstagramWarningModal";
import { SuccessfulConnectionModal } from "./widgets/Modals/SuccessfulConnectionModal";
import { Pixel } from "./widgets/Pixel";

const tabList = [
  { label: "All", value: "all" },
  { label: "Socials", value: "socials" },
  { label: "Ads", value: "ads" },
  { label: "Shipping", value: "shipping" },
];
// const token = window.location.hash;
export const ConnectedApps = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = location.hash;
  const searchParams = new URLSearchParams(location.search);
  const error = searchParams.get("error");

  const [tab, setTab] = useState("all");
  const [play, setPlay] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openIgConnectionModal, setOpenIgConnectionModal] = useState(false);

  const { data: meta, isLoading: metaLoad } = useGetMetaIntegrationQuery();
  const { data: analyticsData, isLoading: scriptLoad } =
    useGetIntegrationScriptQuery({ integration_type: "google_analytics" });
  const { data: myPixel, isLoading: myPixelLoad } =
    useGetIntegrationScriptQuery({ integration_type: "facebook_pixel" });
  const [openSuccessShippingModal, setOpenSuccessShippingModal] =
    useState(false);
  // const { data: walletData } = useGetWalletDetailsQuery({ provider: "fincra" });

  const [metaCallback, { isLoading: loadCallback }] =
    usePostMetaCallbackMutation();
  const [disconnectMeta, { isLoading: loadDisconnectMeta }] =
    useDisconnectMetaMutation();
  const [savePayment, { isLoading: loadSave }] =
    useSavePaymentSettingsMutation();

  const metaCallbackFnc = async (body: {
    access_token: string;
    data_access_expiration_time: string;
    expires_in: string;
  }) => {
    try {
      let result = await metaCallback(body);
      if ("data" in result) {
        setOpenIgConnectionModal(false);
        setPlay(true);
        setTimeout(() => {
          setPlay(false);
        }, 2000);
        clearHash();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const disconnectMetaFnc = async (callback: () => void) => {
    try {
      let result = await disconnectMeta();
      if ("data" in result) {
        showToast("Disconnected successfully", "success");
        callback();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const clearHash = () => {
    window.location.hash = "";
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  useEffect(() => {
    if (token && error !== "access_denied") {
      handleMetaCallback();
    }
  }, [token]);

  // function to call meta call back
  const handleMetaCallback = () => {
    if (token) {
      let params: any = {};
      token
        .split("#")[1]
        .split("&")
        .map((item: any) => {
          let keyValue = item.split("=");
          return (params[keyValue[0]] = keyValue[1]);
        });
      metaCallbackFnc(params);
    }
  };

  if (myPixelLoad || metaLoad) {
    return <Loader />;
  }

  return (
    <>
      {(loadCallback || loadDisconnectMeta) && <Loader />}
      <div className="pd_connected_apps">
        {myPixel && !myPixel?.integration?.status && (
          <div className="warning-info">
            <p className="warning_text">
              <InfoCircleXLIcon className="info_icon" />
              There has been an update to Facebook pixels API, please reconnect
              your Facebook Pixels with the updated integration code.
            </p>
            <Button
              className="btn"
              onClick={() => navigate("/dashboard/apps?mypixel=true")}
            >
              Reconnect Facebook Pixels
            </Button>
          </div>
        )}
        <InstagramWarningModal
          openModal={openIgConnectionModal}
          title="Finish Connection Process"
          description="Click here to round up the connection process"
          type="green"
          closeModal={() => {
            handleMetaCallback();
          }}
          btnAction={() => {
            handleMetaCallback();
          }}
        />
        {play && (
          <div className="lottie_absolute_div">
            <Lottie
              isStopped={!play}
              options={defaultOptions}
              height={"100%"}
              width={"100%"}
            />
          </div>
        )}
        <SuccessfulConnectionModal
          openModal={openSuccessModal}
          btnAction={() => {
            setOpenSuccessModal(false);
          }}
          closeModal={() => {
            setOpenSuccessModal(false);
          }}
          isMeta={true}
          addDoneBtn
          btnText="Setup Shipbubble"
          title="Shipbubble Connected Successfully"
          description="You have successfully connected Shipbubble to your Bumpa account. You can now supercharge your delivery."
          designedText="Go to Shipping > Delivery Settings to setup to make use of Shipbubble shipping"
        />

        <div className="page_title_box">
          <h3>Connected Apps</h3>
          <p>Supercharge your business with the tools you use everyday</p>
        </div>

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

        <div className="connected_app_container">
          {tab === "all" && (
            <>
              <Pixel
                integration_code={myPixel ? myPixel.integration?.script : null}
                pixel_status={myPixel ? myPixel.integration?.status : false}
              />
              <Instagram
                metaData={meta}
                disconnectMetaFnc={disconnectMetaFnc}
              />
              <Shipbubble />
              {/* <FincraWallet 
                      data={walletData}
              /> */}
              <GoogleAnalytics
                integration_code={
                  analyticsData ? analyticsData?.integration?.script : null
                }
                script_status={
                  analyticsData ? analyticsData?.integration?.status : false
                }
              />
            </>
          )}
          {tab === "ads" && (
            <>
              <Pixel
                integration_code={myPixel ? myPixel.integration?.script : null}
                pixel_status={myPixel ? myPixel.integration?.status : false}
              />

              <GoogleAnalytics
                integration_code={
                  analyticsData ? analyticsData?.integration?.script : null
                }
                script_status={
                  analyticsData ? analyticsData?.integration?.status : false
                }
              />
            </>
          )}
          {tab === "socials" && (
            <Instagram metaData={meta} disconnectMetaFnc={disconnectMetaFnc} />
          )}
          {tab === "shipping" && <Shipbubble />}
        </div>
      </div>
    </>
  );
};
