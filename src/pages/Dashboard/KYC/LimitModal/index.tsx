import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import "./style.scss";
import TierOne from "assets/images/TierOne.png";
import TierTwo from "assets/images/TierTwo.png";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { formatPriceNotFixed } from "utils";

type ModalProps = {
  openModal: boolean;
  closeModal: () => void;
  userTier: number | null;
  openCACModal: () => void;
  fromNav?: boolean;
  openVerifyIdentityModal?: () => void;
};

type Tier = {
  name: string;
  receivingLimit: number | string;
  withdrawalLimit: number | string;
  text?: string;
};

export const LimitModal = ({
  openModal,
  closeModal,
  userTier,
  openCACModal,
  fromNav,
  openVerifyIdentityModal,
}: ModalProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const tiersArray = [
    {
      name: "Tier 1",
      receivingLimit: "Unlimited",
      withdrawalLimit: "₦300,000/day",
      navText: "Verify your BVN and NIN.",
    },
    {
      name: "Tier 2",
      receivingLimit: "Unlimited",
      withdrawalLimit: "Unlimited",
      navText: "Verify your BVN, NIN and CAC document.",
      text: "Verify your CAC document to upgrade to tier 2",
    },
  ];

  useEffect(() => {
    if (userTier === 1) {
      setActiveIndex(0);
    } else if (userTier === 2) {
      setActiveIndex(1);
    } else {
      setActiveIndex(null);
    }
  }, [userTier]);

  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children limit_modal">
          <div className="top_section">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              title="Settlement Limit"
              className="kyc_top"
            />
            <div className="limit_modal_body">
              <h4>
                {fromNav
                  ? "Due to recent regulatory requirements from the Central Bank of Nigeria, all Bumpa users are required to verify their identity before receiving settlement."
                  : userTier === 2
                  ? "These are your settlement limits per day."
                  : "You can upgrade to tier 2 to increase your daily settlement limit."}
              </h4>
              {tiersArray.map((tier, index) => (
                <div
                  key={index}
                  className={`card_wrapper ${
                    index === activeIndex ? "active" : ""
                  }`}
                >
                  {index === activeIndex && (
                    <div className="current_limit">
                      <div className="current_limit-tag">
                        <span>Current Limit</span>
                      </div>
                    </div>
                  )}
                  <div className="wrap">
                    <img src={index === 0 ? TierOne : TierTwo} alt="KYC Tier" />
                    <div className="single_wrap">
                      <p className="text_start">Receiving Limit</p>
                      {typeof tier.receivingLimit === "number" ? (
                        <p className="text_left">
                          {formatPriceNotFixed(tier.receivingLimit)}/day
                        </p>
                      ) : (
                        <p className="text_left">{tier.receivingLimit}</p>
                      )}
                    </div>
                    <div className="single_wrap">
                      <p className="text_start">Settlement Limit</p>
                      {typeof tier.withdrawalLimit === "number" ? (
                        <p className="text_left">
                          {formatPriceNotFixed(tier.withdrawalLimit)}/day
                        </p>
                      ) : (
                        <p className="text_left">{tier.withdrawalLimit}</p>
                      )}
                    </div>
                    {(fromNav
                      ? tier.navText
                      : userTier === 1 && index === 1 && tier.text) && (
                      <p className="requirement">
                        {fromNav ? tier.navText : tier.text}
                      </p>
                    )}

                    {userTier === 1 && index === 1 && (
                      <Button
                        variant="contained"
                        className="tier_btn upgrade_btn"
                        onClick={openCACModal}
                      >
                        <span>{`Upgrade To ${tier.name}`}</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {fromNav && userTier == null && (
                <Button
                  variant="contained"
                  className="start_btn"
                  onClick={openVerifyIdentityModal}
                >
                  <span>Start Verification</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </ModalRight>
    </>
  );
};
