import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { LinkBrokenIcon } from "assets/Icons/LinkBrokenIcon";
import { LinkIcon } from "assets/Icons/LinkIcon";
import { CheckedCircleIcon } from "assets/Icons/CheckedCircleIcon";
import { ConnectGoogleModal } from "../Modals/ConnectGoogleModal";
import { getFbeV2Url } from "utils/constants/general";
import { useAppSelector, useAppDispatch } from "store/store.hooks";
import {
  selectCurrentStore,
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import meta from "assets/images/meta.png";
import { MetaIntegration } from "services/api.types";
import { setShowIgDm, setMetaData } from "store/slice/InstagramSlice";
import { InstagramWarningModal } from "./InstagramWarningModal";
import MetaChecks from "./MetaChecks";
import { UpgradeModal } from "components/UpgradeModal";

type MetaProps = {
  metaData?: MetaIntegration;
  disconnectMetaFnc: (callback: () => void) => void;
};

export const Instagram = ({ metaData, disconnectMetaFnc }: MetaProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(
    metaData?.integration ? true : false
  );
  const [openModal, setOpenModal] = useState(false);
  const [openWarningModal, setopenWarningModal] = useState(false);
  const [openCheckModal, setOpenCheckModal] = useState(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);

  const store = useAppSelector(selectCurrentStore);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const dispatch = useAppDispatch();

  const startMetaConnection = async () => {
    if (
      !isSubscriptionExpired &&
      (isSubscriptionType === "pro" ||
        isSubscriptionType === "trial" ||
        isSubscriptionType === "growth")
    ) {
      const prep = {
        name: store?.name || "",
        url_link: store?.url_link || "",
        id: store?.id || "",
      };
      const fbeV2Url = getFbeV2Url(prep);
      window.open(fbeV2Url, "_self");
    } else {
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
    }
  };

  useEffect(() => {
    if (metaData?.integration) {
      setIsConnected(true);
      dispatch(setShowIgDm(true));
      dispatch(setMetaData(metaData));
      if (typeof _cio !== "undefined") {
        _cio.track("web_connect_meta", metaData?.integration);
      }

      if (typeof mixpanel !== "undefined") {
        mixpanel.track("web_connect_meta", metaData?.integration);
      }
    } else {
      setIsConnected(false);
      dispatch(setShowIgDm(false));
    }
  }, [metaData?.integration]);

  return (
    <>
      <div className="general_conneccted_app_container google">
        <div className="title_flex">
          <div className="title_container">
            <img src={meta} alt="app" className="app_image" />
            <h4>Meta</h4>
          </div>
          {isConnected && (
            <div className="connected_box">
              <CheckedCircleIcon /> <p>Connected</p>
            </div>
          )}
        </div>

        <p className="description meta_p">Connect to Instagram</p>
        <p className="warning">
          This feature is currently under maintenance & you may experience some
          errors. These errors are currently being fixed.
        </p>

        <Button
          onClick={() => {
            if (isConnected) {
              setopenWarningModal(true);
            } else {
              setOpenCheckModal(true);
            }
          }}
          startIcon={isConnected ? <LinkBrokenIcon /> : <LinkIcon />}
          className={`connect_button ${isConnected ? "connected" : ""}`}
        >
          {isConnected ? "Disconnect" : "Connect"}
        </Button>
        <ConnectGoogleModal
          openModal={openModal}
          closeModal={() => {
            setOpenModal(false);
          }}
        />
        <InstagramWarningModal
          openModal={openWarningModal}
          closeModal={() => {
            setopenWarningModal(false);
          }}
          btnAction={() => {
            disconnectMetaFnc(() => {
              setopenWarningModal(false);
            });
          }}
        />
      </div>
      {openCheckModal && (
        <MetaChecks
          openModal={openCheckModal}
          closeModal={() => setOpenCheckModal(false)}
          startMetaConnection={startMetaConnection}
        />
      )}
      {openUpgradeModal && (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => setOpenUpgradeModal(false)}
          pro={isProUpgrade}
          title={`Sell faster on Instagram`}
          subtitle={`Connect your Instagram DMs to Bumpa & sell faster.`}
          proFeatures={[
            "Receive Instagram DMs on Bumpa & Sell faster",
            "Share up to 500 invoices/receipts on Instagram",
            "Add up to 500 products to your store",
          ]}
          growthFeatures={[
            "Receive Instagram DMs on Bumpa & Sell faster",
            "Share unlimited invoices/receipts on Instagram",
            "Add unlimited products to your store",
          ]}
          eventName="meta"
        />
      )}
    </>
  );
};
