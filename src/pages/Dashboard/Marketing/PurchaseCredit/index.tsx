import { useState } from "react";

import { Button, CircularProgress, IconButton } from "@mui/material";

import { RightArrowIcon } from "assets/Icons/RightArrowIcon";
import { XIcon } from "assets/Icons/XIcon";
import preview from "assets/images/preview.png";

import NormalSelectField from "components/forms/NormalSelectField";
import Modal from "components/Modal";
import { formatNumber, handleError } from "utils";

import { useGetCreditPlanQuery, usePurchaseCreditMutation } from "services";
import { REDIRECT_URL } from "utils/constants/general";
import "./style.scss";

type ModalProps = {
  openModal: boolean;
  closeModal: () => void;
  redirectUrl?: string;
};

export const PurchaseCreditModal = ({
  closeModal,
  openModal,
  redirectUrl,
}: ModalProps) => {
  const [step, setStep] = useState(0);
  const [credit, setCredit] = useState(0);
  const [planId, setPlanId] = useState("");
  const [amount, setAmount] = useState(0);
  const { data, isLoading, isFetching, refetch } = useGetCreditPlanQuery();
  const [purchaseCredit, { isLoading: loadPurchase }] =
    usePurchaseCreditMutation();

  const onSubmit = async () => {
    try {
      const payload = {
        plan_id: Number(planId),
        redirect_url: redirectUrl || REDIRECT_URL,
      };
      let result = await purchaseCredit(payload);
      if ("data" in result) {
        window.open(result?.data.data.authorization_url, "_blank");
        setStep(0);
        closeModal();
        setAmount(0);
        setCredit(0);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Modal openModal={openModal} closeModal={closeModal}>
        <div className="purchase-credit-modal">
          <div className={`cancel_section ${step === 1 ? "left" : ""}`}>
            <IconButton
              onClick={() => {
                if (step === 1) {
                  setStep(0);
                } else {
                  closeModal();
                }
              }}
              className="icon_button_container"
            >
              {step === 1 ? <RightArrowIcon /> : <XIcon />}
            </IconButton>
          </div>

          <img src={preview} alt="preview" className="campaign-credit" />

          {step === 0 && (
            <div className="first-step">
              <h3>Purchase messaging credits</h3>

              <p className="description">
                See messaging credits and equivalent prices below.
              </p>

              <div className="purchase-form">
                <div className="price-container">
                  <div className="price-header">
                    <p>Messaging Credits</p>
                    <p>Price</p>
                  </div>
                  <>
                    {data && data?.plans?.length
                      ? data?.plans?.map((item) => (
                          <div className="price-item">
                            <p>{formatNumber(item.credits)}</p>
                            <p>{formatNumber(item.price)}</p>
                          </div>
                        ))
                      : ""}
                  </>
                </div>

                <div className="select-purchase">
                  <NormalSelectField
                    name="purchase"
                    isLoading={isLoading}
                    selectOption={
                      data && data?.plans?.length
                        ? data?.plans?.map((item) => {
                            return {
                              key: `${item.name}`,
                              value: `${item.id}`,
                            };
                          })
                        : []
                    }
                    onChange={(val: any) => {
                      setPlanId(val);
                    }}
                    label="How many credits do you want to purchase?"
                  />
                </div>

                <Button
                  onClick={() => {
                    let filteredPlan = data?.plans?.filter(
                      (item) => Number(item.id) === Number(planId)
                    )[0];
                    if (filteredPlan) {
                      let filteredAmount = filteredPlan.price;
                      let filteredCredit = filteredPlan.credits;
                      setAmount(filteredAmount);
                      setCredit(filteredCredit);
                      setStep(1);
                    }
                  }}
                  disabled={!planId}
                  variant="contained"
                  className="primary"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="second-step">
              <h3>
                Amount to pay for <span>{formatNumber(Number(credit))}</span>{" "}
                messaging credits
              </h3>
              <div className="amount-display">
                <p>Amount</p>
                <p className="amount">₦ {formatNumber(amount)}</p>
              </div>

              <Button
                onClick={() => onSubmit()}
                variant="contained"
                className="primary"
              >
                {loadPurchase ? (
                  <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
                ) : (
                  "Pay"
                )}
              </Button>

              <Button
                onClick={() => {
                  setStep(0);
                  closeModal();
                  setAmount(0);
                  setCredit(0);
                }}
                variant="outlined"
                className="primary"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
