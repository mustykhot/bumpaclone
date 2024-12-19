import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";

import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { CoinIcon } from "assets/Icons/CoinIcon";

import { UpgradeModal } from "components/UpgradeModal";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { FormFields } from ".";
import { IStoreInformation } from "Models/store";
import { PurchaseCreditModal } from "../PurchaseCredit";

import { useCreateCampaignsMutation } from "services";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
import {
  setCustomerRecipient,
  setGroupRecipient,
  setCampaigns,
  setSelectedAll,
  selectSelectedAll,
} from "store/slice/CampaignSlice";
import { useAppDispatch } from "store/store.hooks";
import { useAppSelector } from "store/store.hooks";
import {
  selectCurrentStore,
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import { IMAGEURL, REDIRECT_URL } from "utils/constants/general";
import { selectProfile } from "store/slice/ProfileSlice";
import { formatNumber } from "utils";

type CampaignPreviewModalProps = {
  openModal: boolean;
  closeModal: () => void;
  fields: FormFields | null;
  setFields: (val: FormFields | any) => void;
  setValue: (va1: any, val2: any) => void;
  setCampaignImage: (val: FormFields | any) => void;
  setCampaignType: (val: FormFields | any) => void;
  ArrayIds: any[];
  credit?: string;
  setCredit?: (val: string) => void;
  userStore?: IStoreInformation;
};

export const CampaignPreviewModal = ({
  openModal,
  closeModal,
  fields,
  setFields,
  setValue,
  setCampaignImage,
  setCampaignType,
  ArrayIds,
  userStore,
  credit,
  setCredit,
}: CampaignPreviewModalProps) => {
  const [createCampaigns, { isLoading }] = useCreateCampaignsMutation();

  let campaignObj = localStorage.getItem("campaignObj");

  const dispatch = useAppDispatch();
  const storeProfile = useAppSelector(selectProfile);
  const navigate = useNavigate();

  const [creditToDisplay, setCreditToDisplay] = useState("");
  const [fieldsToSubmit, setFieldsToSubmit] = useState<any>(null);
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [isStarterUpgrade, setIsStarterUpgrade] = useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const [isGrowthUpgrade, setIsGrowthUpgrade] = useState(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const selectedAll = useAppSelector(selectSelectedAll);
  const handleSave = async () => {
    const credits =
      Number(userStore?.message_credits) +
      Number(userStore?.purchased_messaging_credits);

    if (isSubscriptionExpired && credits < 1) {
      setIsStarterUpgrade(true);
      setOpenUpgradeModal(true);
    } else if (isSubscriptionType === "free" && credits < 1) {
      setIsStarterUpgrade(true);
      setOpenUpgradeModal(true);
    } else if (isSubscriptionType === "starter" && credits < 1) {
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
    } else if (isSubscriptionType === "pro" && credits < 1) {
      setIsGrowthUpgrade(true);
      setOpenUpgradeModal(true);
    } else if (isSubscriptionType === "trial" && credits < 1) {
      setOpenUpgradeModal(true);
    } else if (isSubscriptionType === "growth" && credits < 1) {
      setOpenUpgradeModal(true);
    } else {
      if (credits > Number(creditToDisplay)) {
        try {
          const payload = {
            name: fieldsToSubmit?.name as string,
            subject: fieldsToSubmit?.title as string,
            type: fieldsToSubmit?.type as string,
            content: fieldsToSubmit?.body,
            recipients: selectedAll ? [] : fieldsToSubmit?.recipients || [],
            banner: IMAGEURL + fieldsToSubmit?.campaignImage,
            from_name: userStore?.name,
            from_email: storeProfile?.email,
            status: "active",
            send_all: selectedAll,
            groups: ArrayIds,
            sms_header: fieldsToSubmit?.sms_header,
          };

          let result = await createCampaigns(payload);
          if ("data" in result) {
            showToast("Campaign Created Successfully", "success");
            closeModal();
            setValue("title", "");
            setValue("name", "");
            setValue("body", "");
            setCampaignType("email");
            setCampaignImage("");
            setFields({});
            setFieldsToSubmit(null);
            dispatch(setCustomerRecipient([]));
            dispatch(setGroupRecipient([]));
            dispatch(setSelectedAll(false));
            localStorage.removeItem("campaignObj");
            dispatch(
              setCampaigns({
                name: "",
                type: "",
                status: "",
                recipients: [],
                subject: "",
                content: "",
                banner: "",
                created_at: "",
              })
            );
            setCredit && setCredit("");
            if (typeof _cio !== "undefined") {
              if (payload.type === "email") {
                _cio.track("web_email_send", payload);
              } else if (payload.type === "sms") {
                _cio.track("web_bulk_sms", payload);
              }
            }

            if (typeof mixpanel !== "undefined") {
              if (payload.type === "email") {
                mixpanel.track("web_send_email", payload);
              } else if (payload.type === "sms") {
                mixpanel.track("web_send_sms", payload);
              }
            }
            navigate("/dashboard/campaigns");
          } else {
            handleError(result);
          }
        } catch (error) {
          handleError(error);
        }
      } else {
        showToast(
          "You do not have sufficient credits for this campaign, kindly purchase more credits",
          "warning",
          8000
        );
      }
    }
  };

  useEffect(() => {
    if (fields) {
      setFieldsToSubmit(fields);
    } else if (campaignObj) {
      setFieldsToSubmit(JSON.parse(campaignObj));
    }

    if (credit) {
      setCreditToDisplay(credit);
    } else if (campaignObj) {
      setCreditToDisplay(`${JSON.parse(campaignObj)?.credit}`);
    }
  }, [fields, campaignObj]);

  return (
    <ModalRight
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <div className="modal_right_children">
        <div className="top_section">
          <ModalRightTitle
            closeModal={() => {
              closeModal();
            }}
            title={fieldsToSubmit?.name}
          >
            {creditToDisplay && (
              <>
                <p className="mb-2 text-[14px]  font-[##5C636D]">
                  This campaign message would cost{" "}
                  <span>{creditToDisplay}</span>
                  messaging {Number(creditToDisplay) > 1 ? "credits" : "credit"}
                </p>

                <div className="credit-amount">
                  <InfoCircleIcon stroke="#5C636D" />
                  <p>Allocated credits are deducted first</p>
                </div>

                <div className="preview-modal-credit-container ">
                  <div className="allocated">
                    <CoinIcon />
                    <p>
                      Allocated Credits:{" "}
                      <span>
                        {formatNumber(Number(userStore?.message_credits || 0))}
                      </span>
                    </p>
                  </div>
                  <div className="purchased">
                    <p>
                      Purchased Credit:{" "}
                      <span>
                        {formatNumber(
                          Number(userStore?.purchased_messaging_credits || 0)
                        )}
                      </span>
                    </p>
                    <Button
                      variant="outlined"
                      onClick={() => setOpenPurchaseModal(true)}
                    >
                      Get Credits
                    </Button>
                  </div>
                </div>
              </>
            )}
          </ModalRightTitle>
          <div className="pl-[32px] pr-[32px]  preview_campaign_containerr">
            <div className="campaign_name">{fieldsToSubmit?.title}</div>
            {fieldsToSubmit?.campaignImage && (
              <img
                src={`${IMAGEURL}${fieldsToSubmit?.campaignImage}`}
                alt="campaign"
              />
            )}

            <div className="body">{parse(fieldsToSubmit?.body || "")}</div>
          </div>
        </div>

        <div className="productOptionSubmit bottom_section">
          <LoadingButton
            type="button"
            className="save"
            loading={isLoading}
            onClick={handleSave}
          >
            Send
          </LoadingButton>
        </div>
      </div>

      <PurchaseCreditModal
        openModal={openPurchaseModal}
        redirectUrl={`${REDIRECT_URL}dashboard/campaigns/create?isPurchased=true`}
        closeModal={() => {
          setOpenPurchaseModal(false);
        }}
      />

      {openUpgradeModal && (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => setOpenUpgradeModal(false)}
          starter={isStarterUpgrade}
          pro={isProUpgrade}
          growth={isGrowthUpgrade}
          campaign={openUpgradeModal}
          title={`Get more Messaging credits on a bigger subscription plan`}
          subtitle={`Unlock more messaging credits on a bigger Plan.`}
          starterFeatures={[
            "Get 100 messaging credits monthly",
            "Create up to 5 customer groups",
            "No campaign Analytics",
          ]}
          proFeatures={[
            "Get 200 messaging credits monthly",
            "Create up to 20 customer groups",
            "Get analytics on Campaigns & Compare Data",
          ]}
          growthFeatures={[
            "Get 1000 messaging credits monthly",
            "Create up to 100 customer groups for targeted marketing",
            "Get analytics on Campaigns & Compare Data",
          ]}
          eventName="messaging-credits"
        />
      )}
    </ModalRight>
  );
};
