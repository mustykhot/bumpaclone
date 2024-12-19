import { useNavigate } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import "./style.scss";
import { CheckIcon } from "assets/Icons/CheckIcon";
import { XIcon } from "assets/Icons/XIcon";
import Modal from "components/Modal";
import { Key } from "react";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  moreStaff?: boolean;
  moreLocation?: boolean;
  moreCustomerGroups?: boolean;
  title?: string;
  subtitle?: string;
  growthFeatures?: string[] | any;
  buttonText?: string;
  setShowModal?: (value: boolean) => void;
  eventName?: string;
};

export const GrowthModal = ({
  closeModal,
  openModal,
  moreStaff,
  moreLocation,
  moreCustomerGroups,
  title,
  subtitle,
  growthFeatures = [],
  buttonText,
  setShowModal,
  eventName,
}: propType) => {
  const navigate = useNavigate();

  const growthPlanBenefits = [
    "Free .com.ng domain for 1 year",
    "Free domain hosting for 1 year",
    "Dedicated account manager + WhatApp",
    "Add up to 3 staff",
    "10,000 messaging credit per month",
    "Add up to 2 locations",
  ];

  const handleGrowthClick = () => {
    if (typeof _cio !== "undefined") {
      _cio.track(`web-paywall-${eventName}`);
    }
    if (typeof mixpanel !== "undefined") {
      mixpanel.track(`web-paywall-${eventName}`);
    }
    closeModal();
    if (moreCustomerGroups) {
      window.open("mailto:support@getbumpa.com", "_blank");
    } else if (moreStaff) {
      window.open("mailto:support@getbumpa.com", "_blank");
    } else if (moreLocation) {
      window.open("mailto:support@getbumpa.com", "_blank");
    } else {
      navigate(
        `/dashboard/subscription/select-plan?fromGrowthModal=true&paywallName=web-paywall-${eventName}`
      );
    }
  };

  return (
    <Modal
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <div className="growth_modal_pop">
        <div className={`modal_header `}>
          <div className="content"></div>
          <IconButton
            type="button"
            onClick={() => closeModal()}
            className="icon_button_container"
          >
            <XIcon stroke="#ffffff" />
          </IconButton>
        </div>
        <div className="upgrade_box">
          <p className="upgrade_text">
            {title ? title : "Upgrade to access this feature."}
          </p>
          <p className="upgrade_explain">
            {subtitle
              ? subtitle
              : "You need to upgrade to the Growth Plan to be able to use this feature"}
          </p>
          {moreStaff ? (
            <div className="white_growth_box">
              <div className="price_box">
                <p>Price:</p>
                <h4>
                  ₦20,000<span>/year for each new staff</span>
                </h4>
              </div>
            </div>
          ) : moreLocation ? (
            <div className="white_growth_box">
              <div className="price_box">
                <p>Price:</p>
                <h4>
                  ₦100,000<span>/location</span>{" "}
                </h4>
              </div>
            </div>
          ) : (
            <div className="white_growth_box">
              <p className="bumpa_grwoth">Bumpa Growth</p>
              <p className="large">
                For large scale businesses with multiple stores, staff and a
                large inventory.
              </p>
              <div className="price_box">
                <p>Price:</p>
                <h4>₦250,000</h4>
                <p className="billed">Billed annually. Cancel anytime</p>
              </div>
            </div>
          )}
          <div className="benefits">
            <p className="plan_benefit">Plan benefits</p>
            <div className="list_plan_benefits">
              {growthFeatures && growthFeatures.length > 0
                ? growthFeatures.map((item: any, i: Key | null | undefined) => (
                    <p key={i} className="single_plan_benefit">
                      <CheckIcon /> {item}
                    </p>
                  ))
                : growthPlanBenefits.map(
                    (item: any, i: Key | null | undefined) => (
                      <p key={i} className="single_plan_benefit">
                        <CheckIcon /> {item}
                      </p>
                    )
                  )}
            </div>
          </div>
          <Button className="subscribe_btn" onClick={handleGrowthClick}>
            {buttonText ? buttonText : "Upgrade to Growth"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
