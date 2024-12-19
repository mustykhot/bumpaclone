import { Key, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import "./style.scss";
import { CheckIcon } from "assets/Icons/CheckIcon";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { XIcon } from "assets/Icons/XIcon";
import Modal from "components/Modal";
import ComparePlansModal from "pages/Auth/Signup/widget/ComparePlans";
import { useGetStoreInformationQuery, useGetPlansQuery } from "services";
import { useAppSelector } from "store/store.hooks";
import ExtraStaffModal from "pages/Dashboard/Store/StaffAccount/AddStaff/ExtraStaff/ExtraStaffModal";
import ExtraLocationModal from "pages/Dashboard/Location/CreateLocation/ExtraLocationModal";
import { formatPriceNotFixed } from "utils";
import Loader from "components/Loader";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  starter?: boolean;
  pro?: boolean;
  growth?: boolean;
  campaign?: boolean;
  title?: string;
  subtitle?: string;
  starterFeatures?: string[];
  proFeatures?: string[] | any;
  growthFeatures?: string[] | any;
  staff?: boolean;
  width?: string;
  location?: boolean;
  eventName?: string;
};

type singlePlan = {
  type: string;
  name: string;
  description: string;
  price: string;
  period: string;
  buttonText: string;
  slug?: string;
  amount?: string;
};

const campaignFeatures = [
  "Purchase more messaging credits",
  "Send more SMS/Emails to your customers.",
];
const staffAccountFeature = [
  "Add and manage multiple staff account.",
  "Oversee what your staff do in different staff locations.",
  "View products & inventory managed by different staff members.",
];
const locationFeature = [
  "Add and manage multiple locations",
  "Oversee what your staff do in different locations.",
  "View products & inventory in different locations",
];
const SingleUpgradeComponent = ({
  content,
  features,
  handleUpgradeClick,
  loading,
}: {
  content: any;
  features: string[];
  loading: any;
  handleUpgradeClick: (planType: string) => void;
}) => {
  const {
    data: storeData,
    isLoading: loadStore,
    isError: isErrorStore,
  } = useGetStoreInformationQuery();

  return (
    <>
      {content && (
        <div
          className={`single_upgrade ${
            content && content.name && content.name.includes("Growth")
              ? "growth"
              : ""
          }`}
        >
          <div className="single_upgrade_one">
            <h4>{`Bumpa ${content.slug}`}</h4>
            <p>{content.description}</p>
          </div>
          <div className="single_upgrade_two">
            <p>Starting at</p>
            <h2>{formatPriceNotFixed(content.amount)}</h2>
            <span>{`Billed ${content.interval}`}</span>
          </div>
          <div className="single_upgrade_three">
            <ul>
              {features.map((el: any, i: Key | null | undefined) => (
                <li key={i}>
                  <CheckIcon stroke="#5C636D" /> {el}
                </li>
              ))}
            </ul>
          </div>
          <div className="btn_container">
            <Button
              onClick={() => handleUpgradeClick(content.slug)}
              className="primary_styled_button"
              variant="contained"
            >
              Upgrade to {`Bumpa ${content.slug}`}
            </Button>
          </div>
        </div>
      )}
      {loading && <Loader />}
    </>
  );
};

export const UpgradeModal = ({
  closeModal,
  openModal,
  starter,
  pro,
  growth,
  campaign,
  title,
  subtitle,
  starterFeatures = [],
  proFeatures = [],
  growthFeatures = [],
  staff,
  width,
  location,
  eventName,
}: propType) => {
  const [openCompareModal, setOpenCompareModal] = useState(false);
  const [plansData, setPlansdata] = useState<any>();
  const { data, isLoading, isError } = useGetPlansQuery();
  const navigate = useNavigate();
  const [openStaffPurchaseModal, setOpenStaffPurchaseModal] = useState(false);
  const [openLocationPurchaseModal, setOpenLocationPurchaseModal] =
    useState(false);

  useEffect(() => {
    if (data) {
      setPlansdata(data);
    }
  }, [data]);

  const handleUpgradeClick = (planType: string) => {
    if (typeof _cio !== "undefined") {
      _cio.track(`web-paywall-${eventName}`);
    }
    if (typeof mixpanel !== "undefined") {
      mixpanel.track(`web-paywall-${eventName}`);
    }
    closeModal();
    navigate(
      `/dashboard/subscription/select-plan?fromUpgradeModal=true&planType=${planType}&paywallName=web-paywall-${eventName}`
    );
  };

  const handlePurchaseCredit = () => {
    closeModal();
    window.open("https://forms.gle/mLkfAJoVfSSX98GQ7", "_blank");
  };
  const handleStaff = () => {
    setOpenStaffPurchaseModal(true);
  };
  const handleLocation = () => {
    setOpenLocationPurchaseModal(true);
  };

  return (
    <Modal
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <div className="upgrade_modal_pop" style={{ width: width ?? "auto" }}>
        <div className={`modal_header `}>
          <div className="content"></div>
          <IconButton
            type="button"
            onClick={() => closeModal()}
            className="icon_button_container"
          >
            <XIcon stroke="#222D37" />
          </IconButton>
        </div>
        <div className="gain_access_container">
          <div className="text_section">
            <h3>{title ? title : "Upgrade your subscription plan"}</h3>
            <div className="sub">
              <p>
                {subtitle
                  ? subtitle
                  : "Upgrade your Bumpa subscription plan to get access to time-saving features on the web app."}
              </p>
              <span
                onClick={() => {
                  setOpenCompareModal(true);
                }}
              >
                Compare all plans
              </span>
            </div>
          </div>
          <div className="card_section">
            {campaign && (
              <div className="single_upgrade">
                <div className="single_upgrade_one">
                  <h4>Purchase Messaging Credits</h4>
                  <p>Get more credits to send campaigns to your customers.</p>
                </div>
                <div className="single_upgrade_two">
                  <p>Starting at</p>
                  <h2>
                    ₦2,500<span>/2000 credits</span>
                  </h2>
                </div>
                <div className="single_upgrade_three">
                  <ul>
                    {campaignFeatures.map(
                      (el: any, i: Key | null | undefined) => (
                        <li key={i}>
                          <CheckIcon stroke="#5C636D" /> {el}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="btn_container">
                  <Button
                    onClick={handlePurchaseCredit}
                    className="primary_styled_button"
                    variant="contained"
                  >
                    Purchase Credits
                  </Button>
                </div>
              </div>
            )}
            {staff && (
              <div className="single_upgrade">
                <div className="single_upgrade_one">
                  <h4>Purchase Staff Accounts slots</h4>
                  <p>Get more staff account slots to add more staff</p>
                </div>
                <div className="single_upgrade_two">
                  <p>Starting at</p>
                  <h2>
                    ₦20,000<span>/year for each new staff</span>
                  </h2>
                </div>
                <div className="single_upgrade_three">
                  <ul>
                    {staffAccountFeature.map(
                      (el: any, i: Key | null | undefined) => (
                        <li key={i}>
                          <CheckIcon stroke="#5C636D" /> {el}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="btn_container">
                  <Button
                    onClick={handleStaff}
                    className="primary_styled_button"
                    variant="contained"
                  >
                    Purchase Extra Staff Account
                  </Button>
                </div>
              </div>
            )}
            {location && (
              <div className="single_upgrade">
                <div className="single_upgrade_one">
                  <h4>Purchase location slots</h4>
                  <p>Get more locations to manage multiple stores</p>
                </div>
                <div className="single_upgrade_two">
                  <p>Starting at</p>
                  <h2>
                    ₦100,000<span>/year for each new location</span>
                  </h2>
                </div>
                <div className="single_upgrade_three">
                  <ul>
                    {locationFeature.map(
                      (el: any, i: Key | null | undefined) => (
                        <li key={i}>
                          <CheckIcon stroke="#5C636D" /> {el}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="btn_container">
                  <Button
                    onClick={handleLocation}
                    className="primary_styled_button"
                    variant="contained"
                  >
                    Purchase Extra Locations
                  </Button>
                </div>
              </div>
            )}

            {starter && (
              <>
                <SingleUpgradeComponent
                  loading={isLoading}
                  content={plansData?.data.starter[0]}
                  features={starterFeatures}
                  handleUpgradeClick={handleUpgradeClick}
                />
                <SingleUpgradeComponent
                  loading={isLoading}
                  content={plansData?.data.pro[0]}
                  features={proFeatures}
                  handleUpgradeClick={handleUpgradeClick}
                />
                <SingleUpgradeComponent
                  loading={isLoading}
                  content={plansData?.data.growth[1]}
                  features={growthFeatures}
                  handleUpgradeClick={handleUpgradeClick}
                />
              </>
            )}
            {pro && (
              <>
                <SingleUpgradeComponent
                  loading={isLoading}
                  content={plansData?.data.pro[0]}
                  features={proFeatures}
                  handleUpgradeClick={handleUpgradeClick}
                />
                <SingleUpgradeComponent
                  loading={isLoading}
                  content={plansData?.data.growth[1]}
                  features={growthFeatures}
                  handleUpgradeClick={handleUpgradeClick}
                />
              </>
            )}
            {growth && (
              <>
                <SingleUpgradeComponent
                  loading={isLoading}
                  content={plansData?.data.growth[1]}
                  features={growthFeatures}
                  handleUpgradeClick={handleUpgradeClick}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <ComparePlansModal
        openModal={openCompareModal}
        closeModal={() => setOpenCompareModal(false)}
      />

      {openStaffPurchaseModal && (
        <ExtraStaffModal
          openModal={openStaffPurchaseModal}
          closeModal={() => setOpenStaffPurchaseModal(false)}
        />
      )}
      {openLocationPurchaseModal && (
        <ExtraLocationModal
          openModal={openLocationPurchaseModal}
          closeModal={() => setOpenLocationPurchaseModal(false)}
        />
      )}
    </Modal>
  );
};
