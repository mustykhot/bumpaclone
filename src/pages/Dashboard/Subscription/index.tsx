import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import Button from "@mui/material/Button";
import moment from "moment";
import "./style.scss";
import { CheckVerifiedIcon } from "assets/Icons/CheckVerifiedIcon";
import { CheckIcon } from "assets/Icons/CheckIcon";
import { ClearIcon } from "assets/Icons/ClearIcon";
import { InfoCircleXLIcon } from "assets/Icons/InfoCircleXLIcon";
import { LayersThreeIcon } from "assets/Icons/LayersThreeIcon";
import { RefreshTwoIcon } from "assets/Icons/RefreshTwoIcon";
import { SubscriptionExpiredCardIcon } from "assets/Icons/SubscriptionExpiredCard";
import { SubscripptionGoldCardIcon } from "assets/Icons/SubscribtionGoldCard";
import { SubscriptionGreenCardIcon } from "assets/Icons/SubscriptionGreenCard";
import { SubscriptionSilverCardIcon } from "assets/Icons/SubscriptionSilverCard";
import { XCircleIcon } from "assets/Icons/XCircleIcon";
import subscription from "assets/images/subscription.png";
import EmptyResponse from "components/EmptyResponse";
import Loader from "components/Loader";
import ErrorMsg from "components/ErrorMsg";
import {
  useGetSubscriptionHistoryQuery,
  useGetStoreInformationQuery,
} from "services";
import { useAppSelector } from "store/store.hooks";
import {
  selectIsSubscriptionCancelled,
  selectIsSubscriptionDets,
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
  selectIsWithinNoticePeriod,
  selectStoreId,
} from "store/slice/AuthSlice";
import { formatPrice, formatPriceNoCurrency, handleError } from "utils";
import { defaultOptions } from "utils/constants/general";
import { CancelSubscriptionModal } from "./CancelSubscription/CancelSubscriptionModal";
import { getAmountOfYears } from "./selectPlan";
import { getObjWithValidValues, REDIRECT_URL } from "utils/constants/general";
import RenewButton from "./RenewButton";
import DropDownWrapper from "components/DropDownWrapper";
import { CopyIcon } from "assets/Icons/CopyIcon";
import { PrimaryFillIcon } from "assets/Icons/PrimaryFillIcon";

export const Subscription = () => {
  const isSubscriptionCancelled = useAppSelector(selectIsSubscriptionCancelled);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionDets = useAppSelector(selectIsSubscriptionDets);
  const isWithinNoticePeriod = useAppSelector(selectIsWithinNoticePeriod);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const store_id = useAppSelector(selectStoreId);
  const { data, isLoading, isError } = useGetSubscriptionHistoryQuery(
    `${store_id}`
  );
  const {
    data: storeData,
    isLoading: loadStore,
    isError: isErrorStore,
    refetch,
  } = useGetStoreInformationQuery();

  const [play, setPlay] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isSuccess = searchParams.get("isSuccess");

  const shouldShowButton =
    (isSubscriptionType === "pro" ||
      isSubscriptionType === "starter" ||
      isSubscriptionType === "growth" ||
      isSubscriptionType === "trial") &&
    // @ts-ignore
    isSubscriptionType !== "basic" &&
    !isSubscriptionCancelled &&
    !isSubscriptionExpired &&
    ![12, 10, 6].includes(isSubscriptionDets?.plan?.id);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setPlay(true);
      setTimeout(() => {
        setPlay(false);
        searchParams.delete("isSuccess"); // Remove param2 from the URL
        const newUrl = `${window.location.origin}${
          window.location.pathname
        }?${searchParams.toString()}`;
        window.history.replaceState(null, "", newUrl);
      }, 2000);
    }
    // eslint-disable-next-line
  }, [isSuccess]);

  if (isLoading || loadStore) {
    return <Loader />;
  }
  if (isErrorStore) {
    return <ErrorMsg error={"Something went wrong"} />;
  }

  const showSubscribeButton =
    isSubscriptionType === "trial" &&
    !isSubscriptionCancelled &&
    !isSubscriptionExpired;

  const showChangeBillingCycleButton = shouldShowButton;

  const showUpgradeButton =
    isSubscriptionType !== "growth" &&
    !isSubscriptionCancelled &&
    (!isSubscriptionExpired ||
      (isSubscriptionExpired && !isWithinNoticePeriod));

  const showCancelButton =
    isSubscriptionType !== "trial" &&
    isSubscriptionType !== "free" &&
    !isSubscriptionCancelled;

  const hasDropdownContent =
    showSubscribeButton ||
    showChangeBillingCycleButton ||
    showUpgradeButton ||
    showCancelButton;

  return (
    <div className="pd_subscription">
      {play && (
        <div className="lottie_absolute_div">
          <Lottie
            isStopped={!play}
            options={defaultOptions}
            height={"100%"}
            width={"100%"}
          />
        </div>
      )}
      <div className="dashboard_title_section">
        <h3 className="name_of_section">Subscription Details</h3>
        <div className="btn_flex">
          {(isSubscriptionType === "pro" ||
            isSubscriptionType === "starter" ||
            isSubscriptionType === "growth" ||
            isSubscriptionCancelled ||
            (isSubscriptionExpired && isWithinNoticePeriod)) && (
            <RenewButton
              startIcon={<LayersThreeIcon stroke="#ffffff" />}
              variant="contained"
            />
          )}

          {hasDropdownContent && (
            <DropDownWrapper
              origin={screenWidth <= 600 ? "left" : "right"}
              className="navbar_dropdown"
              action={
                <Button className="disabled" endIcon={<PrimaryFillIcon />}>
                  Subscription Actions
                </Button>
              }
            >
              <div className="cover_buttons">
                <ul className="select_list btn_list">
                  <li className="scan_btns">
                    {showSubscribeButton && (
                      <Button
                        startIcon={<LayersThreeIcon />}
                        onClick={() => {
                          navigate("select-plan?type=subscribe");
                        }}
                      >
                        Subscribe
                      </Button>
                    )}
                  </li>
                  <li className="scan_btns">
                    {showChangeBillingCycleButton && (
                      <Button
                        startIcon={<RefreshTwoIcon />}
                        onClick={() => {
                          navigate(
                            `select-plan?type=cycle&slug=${isSubscriptionType}`
                          );
                        }}
                      >
                        Change Billing Cycle
                      </Button>
                    )}
                  </li>
                  <li className="scan_btns">
                    {showUpgradeButton && (
                      <Button
                        startIcon={<LayersThreeIcon />}
                        onClick={() => {
                          navigate(
                            `select-plan?type=upgrade&slug=${
                              isSubscriptionDets?.plan.id === 10
                                ? "growth"
                                : isSubscriptionType
                            }`
                          );
                        }}
                      >
                        Upgrade Subscription
                      </Button>
                    )}
                  </li>
                  <li className="scan_btns">
                    {showCancelButton && (
                      <Button
                        onClick={() => {
                          setOpenCancelModal(true);
                        }}
                        startIcon={<XCircleIcon />}
                      >
                        Cancel Subscription
                      </Button>
                    )}
                  </li>
                </ul>
              </div>
            </DropDownWrapper>
          )}
        </div>
      </div>
      <div className="subscription_container">
        <div className="left_part">
          <div className="top_card">
            <div className="type_container">
              <div
                className={`subscription_type_container ${
                  isSubscriptionCancelled && isSubscriptionType !== "trial"
                    ? "cancelled"
                    : ""
                } ${
                  isSubscriptionType === "growth"
                    ? "growth"
                    : isSubscriptionType === "pro"
                    ? "pro"
                    : isSubscriptionType === "starter"
                    ? "starter"
                    : "basic"
                } ${
                  isSubscriptionExpired && isSubscriptionType !== "trial"
                    ? "expired"
                    : ""
                } ${isSubscriptionType === "trial" ? "trial" : ""} `}
              >
                <div className="card">
                  {(isSubscriptionCancelled || isSubscriptionExpired) &&
                    isSubscriptionType !== "trial" && (
                      <SubscriptionExpiredCardIcon />
                    )}
                  {isSubscriptionType === "growth" &&
                    !isSubscriptionExpired &&
                    !isSubscriptionCancelled && <SubscripptionGoldCardIcon />}
                  {isSubscriptionType === "pro" &&
                    !isSubscriptionExpired &&
                    !isSubscriptionCancelled && <SubscriptionSilverCardIcon />}
                  {isSubscriptionType === "starter" &&
                    !isSubscriptionExpired &&
                    !isSubscriptionCancelled && <SubscriptionGreenCardIcon />}
                  <div className="subscription_text">
                    <div className="top_side">
                      <h4> {isSubscriptionDets?.plan.name} </h4>
                      {isSubscriptionCancelled ||
                      isSubscriptionExpired ||
                      isError ? (
                        ""
                      ) : isSubscriptionType === "growth" ? (
                        <CheckVerifiedIcon stroke="#ffffff" />
                      ) : isSubscriptionType === "pro" ? (
                        <CheckVerifiedIcon stroke="#222D37" />
                      ) : isSubscriptionType === "starter" ? (
                        <CheckVerifiedIcon stroke="#009444" />
                      ) : (
                        ""
                      )}
                    </div>
                    {isSubscriptionCancelled || isError ? (
                      <div className="expired_box">
                        <InfoCircleXLIcon stroke="#D90429" />
                        <p>
                          {isSubscriptionCancelled
                            ? "Subscription cancelled"
                            : isSubscriptionExpired
                            ? "Subscription expired"
                            : ""}
                        </p>
                      </div>
                    ) : isSubscriptionType === "pro" ||
                      isSubscriptionType === "growth" ||
                      isSubscriptionType === "starter" ? (
                      <p className="date">
                        Active : Valid till{" "}
                        {moment(isSubscriptionDets?.ends_at).format("ll")}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                {isSubscriptionType === "pro" ||
                isSubscriptionType === "growth" ||
                isSubscriptionType === "starter" ? (
                  <p className="amount">
                    {formatPriceNoCurrency(isSubscriptionDets?.amount)}
                  </p>
                ) : (
                  // <p className="amount"></p>
                  <Button
                    onClick={() => {
                      navigate(
                        `/dashboard/subscription/select-plan?type=upgrade&slug=${isSubscriptionType}`
                      );
                    }}
                  >
                    Upgrade Subscription Plan
                  </Button>
                )}
              </div>
            </div>

            {!isSubscriptionExpired && isSubscriptionType !== "free" ? (
              <div className="about_subscription">
                <div className="detail">
                  <p>Subscription Date</p>
                  <h3>
                    {" "}
                    {/* {moment(isSubscriptionDets?.created_at).format("ll")} */}
                    {moment(isSubscriptionDets?.start_date).format("ll")}
                  </h3>
                </div>
                <div className="detail">
                  <p>Expiry Date</p>
                  <h3> {moment(isSubscriptionDets?.ends_at).format("ll")}</h3>
                </div>
                <div className="detail">
                  <p>Duration</p>
                  <h3>{getAmountOfYears(isSubscriptionDets?.interval)}</h3>
                </div>
                {(isSubscriptionType === "pro" ||
                  isSubscriptionType === "growth" ||
                  isSubscriptionType === "starter") && (
                  <div className="detail">
                    <p>Next Billing Period</p>
                    <h3> {moment(isSubscriptionDets?.ends_at).format("ll")}</h3>
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="summary_container">
            <h3 className="title_text">Subscription History</h3>
            <div className="history_list">
              {isError ? (
                <ErrorMsg error="Something went wrong" />
              ) : data && data.data?.length ? (
                data.data?.map((item: any, i: number) => {
                  return (
                    <div key={i} className="single_history">
                      <div
                        className={`check ${
                          item.status === "success" ? "success" : "failed"
                        }`}
                      >
                        {item.status === "success" ? (
                          <CheckIcon stroke="#009444" />
                        ) : (
                          <ClearIcon stroke="#D90429" />
                        )}
                      </div>
                      <div className="text_box">
                        <div className="title_box">
                          <h4>{item.plan.name}</h4>
                          <p>{moment(item.created_at).format("ll")}</p>
                        </div>
                        <p className="price">
                          {formatPrice(Number(item.amount))}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyResponse
                  image={subscription}
                  message="No subscription history"
                />
              )}
            </div>
          </div>
        </div>
        <div className="right_part">
          <div className="benefits">
            <h3 className="title_text">Plan Benefits</h3>
            <div className="benefit_list">
              {storeData &&
                storeData?.store?.subscription &&
                storeData.store?.subscription?.length &&
                storeData?.store?.subscription[0]?.plan.features.map(
                  (item: any, i: number) => (
                    <div key={i} className="single_benefit">
                      <div className="text_box">
                        <h3>{item}</h3>
                      </div>
                      <CheckIcon stroke="#009444" />
                    </div>
                  )
                )}
            </div>
          </div>
        </div>
      </div>

      <CancelSubscriptionModal
        openModal={openCancelModal}
        refetch={refetch}
        subscriptionType={isSubscriptionType}
        closeModal={() => {
          setOpenCancelModal(false);
        }}
      />
    </div>
  );
};
