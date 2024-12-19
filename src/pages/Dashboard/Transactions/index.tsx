import { Button, IconButton, Skeleton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./style.scss";
import { CheckVerifiedIcon } from "assets/Icons/CheckVerifiedIcon";
import { ClearIcon } from "assets/Icons/ClearIcon";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { InfoCircleXLIcon } from "assets/Icons/InfoCircleXLIcon";
import TierOne from "assets/images/TierOne.png";
import TierTwo from "assets/images/TierTwo.png";
import { SummaryCard } from "components/SummaryCard";
import { useTransactionSummaryQuery } from "services";
import { selectCurrentStore, selectCurrentUser } from "store/slice/AuthSlice";
import {
  selectKycDisplayServiceRestoredBanner,
  selectKycUptime,
} from "store/slice/KycServiceStatusSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { formatPrice } from "utils";
import { LimitModal } from "../KYC/LimitModal";
import { SettlementTable } from "./SettlementTable";
import { TransactionHistoryTable } from "./TransactionHistoryTable";
import {
  handleVerificationNextStep,
  selectKYCStatus,
  setKYCStatus,
} from "store/slice/KycSlice";
import { KYCFlow } from "../KYC/KYCFlow";

const tableTab = [
  {
    name: "Transaction History",
    value: "transaction_history",
  },
  {
    name: "Settlement History",
    value: "settlement_history",
  },
];
export const TransactionsSection = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const [tab, setTab] = useState("transaction_history");

  const searchParams = new URLSearchParams(location.search);
  const urlTab = searchParams.get("tab");
  const fromTerminal = searchParams.get("fromTerminal");

  const userStore = useAppSelector(selectCurrentStore);
  const user = useAppSelector(selectCurrentUser);

  const { data: summary, isLoading: summaryLoading } =
    useTransactionSummaryQuery();

  // KYC
  const kycUptime = useAppSelector(selectKycUptime);
  const kycDisplayServiceRestoredBanner = useAppSelector(
    selectKycDisplayServiceRestoredBanner
  );
  const kycStatus = useAppSelector(selectKYCStatus);
  const [openLimitModal, setOpenLimitModal] = useState(false);
  const [openDowntimeBanner, setOpenDowntimeBanner] = useState(true);
  const [openRestoredBanner, setOpenRestoredBanner] = useState(true);
  const hasCompletedKyc = userStore?.cac !== null;

  const handleNextStep = () => {
    if (!user?.bvn_verified_at) {
      dispatch(
        handleVerificationNextStep({
          currentStep: "verifyIdentity",
          nextModal: "verifyIdentity",
        })
      );
    } else if (!user?.nin_verified_at) {
      dispatch(
        handleVerificationNextStep({
          currentStep: "bvn",
          nextModal: "nin",
        })
      );
    } else if (user?.desired_kyc_tier === 2 && !userStore?.cac) {
      dispatch(
        handleVerificationNextStep({
          currentStep: "nin",
          nextModal: "updateBusinessName",
        })
      );
    }
  };

  const userTier =
    user?.bvn_verified_at && user?.nin_verified_at
      ? userStore?.cac !== null
        ? 2
        : 1
      : null;

  useEffect(() => {
    setTimeout(() => {
      if (fromTerminal) {
        searchParams.delete("fromTerminal");
      }
      const newUrl = `${window.location.origin}${window.location.pathname}${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`;
      window.history.replaceState(null, "", newUrl);
    }, 1000);
    // eslint-disable-next-line
  }, [fromTerminal]);

  useEffect(() => {
    if (urlTab) {
      setTab(urlTab);
    } else {
      setTab("transaction_history");
    }
  }, [urlTab]);

  useEffect(() => {
    setOpenDowntimeBanner(true);
    setOpenRestoredBanner(true);
  }, [kycUptime, kycDisplayServiceRestoredBanner]);

  return (
    <>
      <div className="pd_transactions transaction_section">
        {/* KYC service status banner */}
        {user &&
          Number(user.is_staff) === 0 &&
          !hasCompletedKyc &&
          kycUptime !== null && (
            <>
              {!kycUptime && openDowntimeBanner && (
                <div className="canceled_subscription_state downtime">
                  <div className="text_side">
                    <InfoCircleXLIcon stroke="#F4A408" />
                    <p>
                      We are currently experiencing downtime on KYC from our
                      service providers. We apologize for the inconvenience.
                      Please try again in a few hours.
                    </p>
                  </div>
                  <div className="button_side">
                    <IconButton onClick={() => setOpenDowntimeBanner(false)}>
                      <ClearIcon stroke="#222D37" />
                    </IconButton>
                  </div>
                </div>
              )}

              {kycUptime &&
                kycDisplayServiceRestoredBanner &&
                openRestoredBanner && (
                  <div className="canceled_subscription_state restored">
                    <div className="text_side">
                      <InfoCircleXLIcon stroke="#009444" />
                      <p>
                        The KYC verification service has been restored. You can
                        proceed to upgrade your account.
                      </p>
                    </div>
                    <div className="button_side">
                      <IconButton onClick={() => setOpenRestoredBanner(false)}>
                        <ClearIcon stroke="#222D37" />
                      </IconButton>
                    </div>
                  </div>
                )}
            </>
          )}
        {/* KYC */}
        {user &&
          Number(user.is_staff) === 0 &&
          (user.bvn_verified_at === null ||
            user.nin_verified_at === null ||
            (user?.desired_kyc_tier === 2 && userStore?.cac === null)) && (
            <div className="verify_container">
              <div className="left_box">
                <InfoCircleXLIcon stroke="#F4A408" />
                <div className="left_box--text">
                  {user.bvn_verified_at === null ? (
                    <>
                      <p>Verify your identity to get paid</p>
                      <span>
                        Complete your KYC verification before 30th January to
                        continue receiving settlements.
                      </span>
                    </>
                  ) : user.nin_verified_at === null ? (
                    <>
                      <p>Complete your tier 1 NIN verification</p>
                      <span>
                        Complete your NIN verification before 30th January to
                        continue receiving settlements.
                      </span>
                    </>
                  ) : user?.desired_kyc_tier === 2 &&
                    userStore?.cac === null ? (
                    <>
                      <p>Complete your tier 2 CAC verification</p>
                      <span>
                        You're yet to complete your tier 2 verification.
                      </span>
                    </>
                  ) : (
                    <>
                      <p>Verify your identity to get paid</p>
                      <span>
                        Complete your KYC verification before 30th January to
                        continue receiving settlements.
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Button
                variant="contained"
                className="primary_styled_button"
                onClick={handleNextStep}
              >
                Start Verification
              </Button>
            </div>
          )}
        {kycStatus.verificationComplete && (
          <div className="verification_complete">
            <div className="text_side">
              <CheckVerifiedIcon stroke="#009444" />
              <p>
                Verification Complete. We’ve successfully verified your account.
              </p>
            </div>
            <div className="button_side">
              <IconButton
                onClick={() => {
                  dispatch(setKYCStatus({ verificationComplete: false }));
                }}
              >
                <ClearIcon stroke="#0D1821" />
              </IconButton>
            </div>
          </div>
        )}
        <div className="title_section">
          <div>
            <h3 className="name_of_section">Transactions</h3>
            <div className="summary_section">
              {summaryLoading ? (
                [1, 2, 3].map((item) => (
                  <div key={item} className="summary_skeleton">
                    <Skeleton animation="wave" width={"100%"} />
                    <Skeleton animation="wave" width={"100%"} />
                    <Skeleton animation="wave" width={"100%"} />
                  </div>
                ))
              ) : (
                <>
                  <SummaryCard
                    count={summary ? formatPrice(summary?.pending) : 0}
                    // title={
                    //   user?.bvn_verified_at === null ||
                    //   user?.nin_verified_at === null ? (
                    //     <div className="restricted">
                    //       <p>Settlement Restricted</p>
                    //       <Tooltip
                    //         placement="top"
                    //         title="Settlement has been restricted because you haven't verified your account."
                    //       >
                    //         <IconButton>
                    //           <InfoCircleIcon
                    //             stroke="#D90429"
                    //             strokeWidth={1}
                    //           />
                    //         </IconButton>
                    //       </Tooltip>
                    //     </div>
                    //   ) : (
                    //     "Pending Settlement"
                    //   )
                    // }
                    title={"Pending Settlement"}
                    color={`${
                      user?.bvn_verified_at === null ||
                      user?.nin_verified_at === null
                        ? "red"
                        : "green"
                    }`}
                  />
                  <SummaryCard
                    count={summary ? formatPrice(summary?.online) : 0}
                    title={"Total Online Transactions"}
                    color={"clear"}
                  />
                  <SummaryCard
                    count={summary ? formatPrice(summary?.offline) : 0}
                    title={"Total Offline Transactions"}
                    color={"clear"}
                  />
                </>
              )}
            </div>
            <div className="settlement_info">
              <InfoCircleIcon />{" "}
              <p>
                All pending settlements are paid to your account within 24
                hours.
              </p>
            </div>
          </div>
          {user?.bvn_verified_at && user?.nin_verified_at && (
            <div className="kyc_section">
              <div className="account_level">
                <p>Account Level:</p>
                <img
                  src={userStore?.cac === null ? TierOne : TierTwo}
                  alt="KYC Tier"
                />
              </div>
              <div className="limit">
                <p>
                  Daily Limit:{" "}
                  <span>
                    {userStore?.cac === null
                      ? formatPrice(300000)
                      : "Unlimited"}
                  </span>
                </p>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => {
                    setOpenLimitModal(true);
                  }}
                >
                  {userStore?.cac === null
                    ? "Upgrade to tier 2"
                    : "View Limits"}
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="table_section tabbed">
          <div className="table_tab_container">
            {tableTab.map((item, i) => {
              return (
                <Button
                  key={i}
                  onClick={() => {
                    setTab(item.value);
                    const newUrl = `${window.location.origin}${window.location.pathname}?tab=${item.value}`;
                    window.history.replaceState(null, "", newUrl);
                  }}
                  className={`${tab === item.value ? "active" : ""}`}
                >
                  {item.name}
                </Button>
              );
            })}
          </div>
          {tab === "transaction_history" && (
            <TransactionHistoryTable
              from={fromTerminal ? "fromTerminal" : undefined}
            />
          )}
          {tab === "settlement_history" && <SettlementTable />}
        </div>
      </div>
      {/* KYC Modals*/}
      <KYCFlow />
      {openLimitModal && (
        <LimitModal
          openModal={openLimitModal}
          closeModal={() => {
            setOpenLimitModal(false);
          }}
          userTier={userTier}
          openCACModal={() => {
            setOpenLimitModal(false);
            dispatch(
              handleVerificationNextStep({
                currentStep: "updateBusinessName",
                nextModal: "updateBusinessName",
              })
            );
          }}
        />
      )}
    </>
  );
};
