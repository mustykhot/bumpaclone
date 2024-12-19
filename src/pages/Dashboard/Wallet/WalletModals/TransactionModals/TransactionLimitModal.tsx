import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "./style.scss";
import { Button } from "@mui/material";
import { AwardIcon } from "assets/Icons/AwardIcon";
import { useState, useEffect } from "react";
import ModifyLimitModal from "./ModifyLimitModal";
import { formatPriceNotFixed } from "utils";
import { useAppSelector } from "store/store.hooks";
import { selectWalletDetails } from "store/slice/WalletSlice";
import SuccessLimitModal from "./SuccessLimitModal";
import { UpgradeTierModal } from "./UpgradeTierModal";

type ModalProps = {
  openModal: boolean;
  closeModal: () => void;
};
type Tier = {
  name: string;
  receivingLimit: number | string;
  withdrawalLimit: number | string;
  text?: string;
};

export const TransactionLimitModal = ({
  openModal,
  closeModal,
}: ModalProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showModifyLimit, setShowModifyLimit] = useState(false);
  const [newLimit, setNewLimit] = useState();
  const [isModified, setIsModified] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const details = useAppSelector(selectWalletDetails);

  useEffect(() => {
    //  @ts-ignore
    if (details?.tier === 1) {
      setActiveIndex(0);
    } else setActiveIndex(1);
  }, [details]);

  const tiersArray = [
    {
      name: "Tier 1",
      receivingLimit: "unlimited",
      withdrawalLimit: details && details?.transaction_limit,
    },
    {
      name: "Tier 2",
      receivingLimit: "unlimited",
      withdrawalLimit: "unlimited",
      text: "You will need to complete an identity verification if you want to upgrade your wallet to tier 2",
    },
  ];

  useEffect(() => {
    if (isModified) {
      setShowModifyLimit(false);
    }
  }, [isModified]);
  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children trans_modal">
          <div className="top_section">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              title="Transaction Limit"
            />
            <div className="trans_moadal_body">
              <h4>
                You can increase or decrease your transaction limit. Click to
                modify your limit.
              </h4>
              {tiersArray.map((tier, index) => (
                <div
                  key={index}
                  className={`card_wrapper ${
                    index === activeIndex ? "active" : ""
                  }`}
                >
                  {index === activeIndex ? (
                    <div className="tier_name_wrapper flex">
                      <AwardIcon />
                      <span>{tier.name} (current)</span>
                    </div>
                  ) : (
                    <p className="inactive_name">{tier.name}</p>
                  )}

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
                    <p className="text_start">Withdrawal Limit</p>
                    {typeof tier.withdrawalLimit === "number" ? (
                      <p className="text_left">
                        {formatPriceNotFixed(tier.withdrawalLimit)}/day
                      </p>
                    ) : (
                      <p className="text_left">{tier.withdrawalLimit}</p>
                    )}
                  </div>
                  {index != 0 && <p className="requirement">{tier.text}</p>}
                  {index === 0 ? (
                    <Button
                      variant="contained"
                      className="tier_btn"
                      onClick={() => {
                        setShowModifyLimit(true);
                      }}
                    >
                      <span>{"Modify Limit"}</span>
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      className="tier_btn upgrade_btn"
                      onClick={() => setShowUpgradeModal(true)}
                    >
                      <span>{`Upgrade To ${tier.name}`}</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModalRight>

      {showModifyLimit && (
        <ModifyLimitModal
          openModal={showModifyLimit}
          closeModal={() => setShowModifyLimit(false)}
          isModified={isModified}
          setIsModified={setIsModified}
          newLimit={newLimit}
          setNewLimit={setNewLimit}
        />
      )}

      {isModified && (
        <SuccessLimitModal
          openModal={isModified}
          closeModal={() => setIsModified(false)}
          newLimit={newLimit}
        />
      )}

      {showUpgradeModal && (
        <UpgradeTierModal
          openModal={showUpgradeModal}
          closeModal={() => setShowUpgradeModal(false)}
        />
      )}
    </>
  );
};
