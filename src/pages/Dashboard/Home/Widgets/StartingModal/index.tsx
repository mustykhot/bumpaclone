import { Button } from "@mui/material";
import { IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import "./style.scss";
import { XIcon } from "assets/Icons/XIcon";
import Modal from "components/Modal";
import { OnBaordAccordion, onBaordAccordionType } from "./OnboardContainer";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  isPaymentMethodCompleted?: boolean;
  isStoreInfoCompleted?: boolean;
  isShippingCompleted?: boolean;
  isFirstProductCreated?: boolean;
  isFreeTrialActivated?: boolean;
  onboardingComplete: () => void;
};

const onBoardList: onBaordAccordionType[] = [
  {
    isCompleted: false,
    type: "payment",
  },
  {
    isCompleted: false,
    type: "store_info",
  },
  {
    isCompleted: false,
    type: "shipping",
  },
  {
    isCompleted: false,
    type: "completed_first_product",
  },
  {
    isCompleted: false,
    type: "free_trial",
  },
];

const SetupModal = ({
  closeModal,
  openModal,
  isPaymentMethodCompleted = false,
  isStoreInfoCompleted = false,
  isShippingCompleted = false,
  isFirstProductCreated = false,
  isFreeTrialActivated = false,
  onboardingComplete,
}: propType) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const handleOnboardingSuccess = () => {
    onboardingComplete();
    closeModal();
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Modal
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="setup_modal">
          <div className="title_section">
            <div className="text_section">
              <h3>Complete the next steps to launch your website</h3>
              <p>You can complete these any time</p>
            </div>
            <IconButton
              type="button"
              onClick={() => {
                closeModal();
              }}
              className="icon_button_container"
            >
              <XIcon />
            </IconButton>{" "}
          </div>
          {onBoardList.map((item: onBaordAccordionType) => {
            return (
              <OnBaordAccordion
                isPaymentMethodCompleted={isPaymentMethodCompleted}
                isStoreInfoCompleted={isStoreInfoCompleted}
                isShippingCompleted={isShippingCompleted}
                isFirstProductCreated={isFirstProductCreated}
                isFreeTrialActivated={isFreeTrialActivated}
                key={item.type}
                item={item}
              />
            );
          })}
          <div className="setup_complete">
            <Button
              onClick={handleOnboardingSuccess}
              variant="contained"
              className="primary_styled_button"
              disabled={
                !isPaymentMethodCompleted ||
                !isStoreInfoCompleted ||
                !isShippingCompleted ||
                !isFirstProductCreated
              }
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SetupModal;
