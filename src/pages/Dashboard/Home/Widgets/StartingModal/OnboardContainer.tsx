import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import { useState } from "react";
import { BankIcon } from "assets/Icons/BankIcon";
import { BankShippingIcon } from "assets/Icons/Sidebar/BankShipping";
import { BuildingIcon } from "assets/Icons/BuildingIcon";
import { CheckCircleIcon } from "assets/Icons/CheckCircleIcon";
import { ChevronRight } from "assets/Icons/ChevronRight";
import { Tag03Icon } from "assets/Icons/Tag03Icon";
import FreeTrialImage from "assets/images/FreeTrialImage.png";
import { AddBankModal } from "../AddBankDetails";
import { AddShippingMethodModal } from "../AddShippingMethod";
import { CompleteStoreInfoModal } from "../CompleteStoreInfoModal";
import ActivateFreeTrialModal from "../ActivateFreeTrialModal";
import { AddProductModal } from "../AddProductModal";

export type onBaordAccordionType = {
  isCompleted: boolean;
  type: string;
};

type OnBaordAccordionProps = {
  item: onBaordAccordionType;
  isPaymentMethodCompleted?: boolean;
  isStoreInfoCompleted?: boolean;
  isShippingCompleted?: boolean;
  isFirstProductCreated?: boolean;
  isFreeTrialActivated?: boolean;
};

export const OnBaordAccordion = ({
  item,
  isPaymentMethodCompleted = false,
  isStoreInfoCompleted = false,
  isShippingCompleted = false,
  isFirstProductCreated = false,
  isFreeTrialActivated = false,
}: OnBaordAccordionProps) => {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openStoreDetailsModal, setOpenStoreDetailsModal] = useState(false);
  const [openShippingModal, setOpenShippingModal] = useState(false);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openActivateFreeTrialModal, setOpenActivateFreeTrialModal] =
    useState(false);
  const { type } = item;

  const getProperties = (type: string) => {
    let properties;
    switch (type) {
      case "payment":
        properties = {
          icon: <BankIcon stroke="#009444" />,
          title: "Add bank details to receive payments",
          description: isPaymentMethodCompleted
            ? "You can update your payment method anytime from the Connected apps page in the side menu"
            : "This will allow you to start collecting payments on your website.",
          buttonText: "Add payment method",
          isVideo: false,
          isCompleted: isPaymentMethodCompleted,
        };
        break;
      case "store_info":
        properties = {
          icon: <BuildingIcon stroke="#009444" />,
          title: "Complete store information",
          description: isStoreInfoCompleted
            ? "You can update your store information anytime from the Store information in the side menu"
            : "Add your store currency, logo and other relevant things to your website",
          buttonText: "Complete store information",
          isVideo: false,
          isCompleted: isStoreInfoCompleted,
        };
        break;
      case "shipping":
        properties = {
          icon: <BankShippingIcon isActive={true} />,
          title: "Add shipping prices on your website",
          description: isShippingCompleted
            ? "You can add more shipping prices from the Store menu > Shipping"
            : "Add shipping prices on your website for your customers to checkout",
          buttonText: "Add shipping prices on your website",
          isVideo: false,
          isCompleted: isShippingCompleted,
        };
        break;
      case "completed_first_product":
        properties = {
          icon: <Tag03Icon stroke="#009444" />,
          title: "Add products to your store",
          description: isFirstProductCreated
            ? "Add one or more products to fill up your website"
            : "You can always add more products later from the Products page in the side menu",
          buttonText: "Add products to your store",
          isVideo: false,
          isCompleted: isFirstProductCreated,
        };
        break;
      case "free_trial":
        const isDisabled =
          !isPaymentMethodCompleted ||
          !isStoreInfoCompleted ||
          !isShippingCompleted ||
          !isFirstProductCreated;
        properties = {
          icon: "image",
          title: "Activate free trial (optional)",
          description: isDisabled
            ? "Complete all previous steps to activate free trial"
            : "You can now activate free trial",
          buttonText: "Activate free trial",
          isVideo: false,
          isCompleted: isFreeTrialActivated,
          isDisabled: isDisabled,
        };
        break;
      default:
        break;
    }

    return properties;
  };

  const launchModalAction = (type: string) => {
    if (type === "payment") {
      setOpenPaymentModal(true);
    }
    if (type === "store_info") {
      setOpenStoreDetailsModal(true);
    }
    if (type === "shipping") {
      setOpenShippingModal(true);
    }
    if (type === "completed_first_product") {
      setOpenProductModal(true);
    }
    if (type === "free_trial") {
      setOpenActivateFreeTrialModal(true);
    }
  };

  return (
    <>
      <Accordion
        className={`onboard_accordion ${
          getProperties(type)?.isCompleted ? "completed" : ""
        }`}
        disabled={getProperties(type)?.isDisabled}
      >
        <AccordionSummary
          sx={{
            rotate: "0deg",
          }}
          expandIcon={
            getProperties(type)?.isCompleted ? (
              <Button
                variant="contained"
                className="completed"
                startIcon={<CheckCircleIcon />}
              >
                <span className="text">Completed</span>
              </Button>
            ) : (
              <ChevronRight className="chevron right" />
            )
          }
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          onClick={() => {
            if (!getProperties(type)?.isCompleted) {
              launchModalAction(type);
            }
          }}
        >
          <div className="title_container">
            {getProperties(type)?.icon === "image" ? (
              <div className="icon_box">
                <img src={FreeTrialImage} alt="Free Trial" />
              </div>
            ) : (
              <div className="icon_box">{getProperties(type)?.icon}</div>
            )}
            <div className="text_box">
              <h4
                className={`title ${
                  getProperties(type)?.isCompleted ? "text_completed" : ""
                }`}
              >
                {getProperties(type)?.title}
              </h4>
              <p className="description">{getProperties(type)?.description}</p>
            </div>
          </div>
        </AccordionSummary>
      </Accordion>
      <AddBankModal
        openModal={openPaymentModal}
        closeModal={() => {
          setOpenPaymentModal(false);
        }}
      />
      <CompleteStoreInfoModal
        openModal={openStoreDetailsModal}
        closeModal={() => {
          setOpenStoreDetailsModal(false);
        }}
      />
      <AddShippingMethodModal
        openModal={openShippingModal}
        closeModal={() => {
          setOpenShippingModal(false);
        }}
      />
      <ActivateFreeTrialModal
        openModal={openActivateFreeTrialModal}
        closeModal={() => {
          setOpenActivateFreeTrialModal(false);
        }}
      />
      <AddProductModal
        openModal={openProductModal}
        closeModal={() => {
          setOpenProductModal(false);
        }}
      />
    </>
  );
};
