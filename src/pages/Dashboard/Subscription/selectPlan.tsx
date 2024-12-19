import { Checkbox, CircularProgress, IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import { CircleCancelIcon } from "assets/Icons/CircleCancelIcon";
import { CircleCorrectIcon } from "assets/Icons/CircleCorrectIcon";
import { ExportIcon } from "assets/Icons/ExportIcon";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { SaleIcon } from "assets/Icons/Sidebar/SaleIcon";
import paystack from "assets/images/paystack.png";
import ErrorMsg from "components/ErrorMsg";
import InputField from "components/forms/InputField";
import { SubmitButton } from "components/forms/SubmitButton";
import Loader from "components/Loader";
import { useGetUser } from "hooks/getUserHook";
import { SinglePlanComponent, ValidDiscountType } from "pages/Auth/Signup/plan";
import { FeatureModal } from "pages/Auth/Signup/plan/featureModal";
import ComparePlansModal from "pages/Auth/Signup/widget/ComparePlans";
import {
  useDiscountValidityMutation,
  useGetPlansQuery,
  useGetStoreInformationQuery,
  useInitiatePaymentMutation,
  useUpgradePlanMutation,
} from "services";
import { capitalizeText, formatPriceNoCurrency, handleError } from "utils";
import { getObjWithValidValues, REDIRECT_URL } from "utils/constants/general";
import { DowngradeWarningModal } from "./CancelSubscription/DowngradeWarningModal";

type SelectPlanProps = {};

export const getAmountOfYears = (interval: string) => {
  switch (interval) {
    case "annually":
      return "12 months";
    case "biannually":
      return "6 months";
    case "quarterly":
      return "3 months";
    case "monthly":
      return "1 month";

    default:
      break;
  }
};
export const SelectPlan = ({}: SelectPlanProps) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [selectedPlan, setSelectedPlan] = useState("");
  const [subscriptionAmount, setSubscriptionAmount] = useState(0);
  const [selectedTiime, setSelectedTime] = useState("");
  const [finalSelectedPlan, setFinalSelectedPlan] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openFeaturesModal, setOpenFeaturesModal] = useState(false);
  const [fromGrowth, setFromGrowth] = useState(false);
  const [growthChangePlan, setGrowthChangePlan] = useState(false);
  const [steps, setSteps] = useState(0);
  const [subscriptionPaywallName, setSubscriptionPaywallName] = useState("");
  const [subscriptionType, setSubscriptionType] = useState(
    searchParams.get("type")
  );
  const [subscriptionslug, setSubscriptionslug] = useState(
    searchParams.get("slug")
  );
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [validDiscount, setValidDiscount] = useState("");

  const [validDiscountData, setValidDiscountData] =
    useState<ValidDiscountType | null>(null);

  const { store_id } = useGetUser();

  const { data, isLoading, isError } = useGetPlansQuery();
  const { data: storeData } = useGetStoreInformationQuery();
  const navigate = useNavigate();
  const [initiate, { isLoading: isInitiateLoading }] =
    useInitiatePaymentMutation();
  const [upgrade, { isLoading: upgradeLoading }] = useUpgradePlanMutation();
  const [discoutValidity, { isLoading: loadValidity }] =
    useDiscountValidityMutation();

  //Referrals
  const [referralAmount, setReferralAmount] = useState(0);
  const [isUseReferralAmountChecked, setIsUseReferralAmountChecked] =
    useState(false);

  const checkDiscount = async () => {
    const payload = {
      discount_code: discountCode,
      plan_id: finalSelectedPlan.id,
      store_id: store_id,
    };
    try {
      let result = await discoutValidity(payload);
      if ("data" in result) {
        if (result.data.status === "error") {
          setValidDiscount("error");
          setValidDiscountData(null);
        } else {
          setValidDiscount("success");
          setValidDiscountData(result.data.data);
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const amountToPay = finalSelectedPlan
    ? (() => {
        let baseAmount =
          subscriptionType === "renew"
            ? validDiscountData
              ? validDiscountData.amount
              : finalSelectedPlan.amount
            : validDiscountData
            ? validDiscountData.prorated_amount > 0
              ? validDiscountData.prorated_amount
              : validDiscountData.amount - subscriptionAmount
            : finalSelectedPlan.amount - subscriptionAmount;

        const finalAmount = isUseReferralAmountChecked
          ? Math.max(baseAmount - referralAmount, 0)
          : baseAmount;

        return formatPriceNoCurrency(Math.max(finalAmount, 0));
      })()
    : "";

  const onUpgrade = async () => {
    const payload = {
      store_id: `${store_id}`,
      plan_id: finalSelectedPlan?.id,
      redirect_url: `${REDIRECT_URL}success?plan=${finalSelectedPlan.slug}`,
      apply_referral: isUseReferralAmountChecked,
      discount_code: validDiscountData?.discount_code,
      paywall_name: subscriptionPaywallName,
    };
    try {
      let result = await upgrade(payload);
      if ("data" in result) {
        window.open(result?.data.data.authorization_url, "_blank");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const onSubmit = async () => {
    const payload = {
      store_id: `${store_id}`,
      plan_id: finalSelectedPlan?.id,
      redirect_url: `${REDIRECT_URL}success?plan=${finalSelectedPlan.slug}`,
      discount_code: validDiscountData?.discount_code,
      apply_referral: isUseReferralAmountChecked,
      paywall_name: subscriptionPaywallName,
    };
    try {
      let result = await initiate(getObjWithValidValues(payload));
      if ("data" in result) {
        window.open(result?.data.data.authorization_url, "_blank");
        setValidDiscount("");
        setDiscountCode("");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (subscriptionType === "cycle" || subscriptionType === "change") {
      setSelectedPlan(subscriptionslug ?? "");
      setSteps(1);
    } else if (subscriptionType === "renew") {
      if (storeData && storeData.store && storeData.store.subscription) {
        const subscription = storeData.store.subscription[0];
        setSelectedPlan(subscription?.plan.slug);
        setFinalSelectedPlan(subscription?.plan);
      }
      setSteps(2);
    }
  }, [
    subscriptionType,
    subscriptionslug,
    setSelectedPlan,
    setFinalSelectedPlan,
    setSteps,
    setFromGrowth,
    setGrowthChangePlan,
    data,
    storeData,
  ]);

  useEffect(() => {
    if (storeData && storeData.store && storeData.store.subscription) {
      const subscription = storeData.store.subscription[0];
      const remainingAmount = subscription?.remaining_amount;
      const availableReferralAmount = subscription?.available_referral_amount;
      setSubscriptionAmount(remainingAmount ? remainingAmount : 0);
      setReferralAmount(availableReferralAmount ? availableReferralAmount : 0);
    }
  }, [storeData, finalSelectedPlan]);

  const queryParams = new URLSearchParams(location.search);
  const fromUpgradeModal = queryParams.get("fromUpgradeModal");
  const fromGrowthModal = queryParams.get("fromGrowthModal");
  const proUpgrade = queryParams.get("proUpgrade");
  const planType = queryParams.get("planType");
  const paywallName = queryParams.get("paywallName");

  useEffect(() => {
    if (fromGrowthModal) {
      setSelectedPlan("growth");
      setSteps(1);
      if (storeData && storeData.store && storeData.store.subscription) {
        const subscription = storeData.store.subscription[0];
        setSubscriptionslug(subscription?.plan.slug);
      }
      setFromGrowth(true);
    }
  }, [
    location.search,
    setSelectedPlan,
    setFinalSelectedPlan,
    setSteps,
    setFromGrowth,
    data,
    storeData,
  ]);

  useEffect(() => {
    if (fromUpgradeModal) {
      if (storeData && storeData.store && storeData.store.subscription) {
        const subscription = storeData.store.subscription[0];
        setSubscriptionslug(subscription?.plan.slug);
      }
      setSubscriptionType("upgrade");
      setSelectedPlan(planType ?? "");
      setSteps(1);
      if (planType === "growth") {
        setFromGrowth(true);
      }
      if (paywallName) {
        setSubscriptionPaywallName(paywallName);
      }
      setTimeout(() => {
        queryParams.delete("fromUpgradeModal");
        queryParams.delete("planType");
        queryParams.delete("paywallName");
        const newUrl = `${window.location.origin}${window.location.pathname}${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;
        window.history.replaceState(null, "", newUrl);
      }, 1000);
    } else if (fromGrowthModal) {
      if (paywallName) {
        setSubscriptionPaywallName(paywallName);
      }
      setTimeout(() => {
        queryParams.delete("fromGrowthModal");
        queryParams.delete("paywallName");
        const newUrl = `${window.location.origin}${window.location.pathname}${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;
        window.history.replaceState(null, "", newUrl);
      }, 1000);
    }
  }, [
    location.search,
    setSteps,
    storeData,
    subscriptionType,
    subscriptionslug,
    setSelectedPlan,
    setFinalSelectedPlan,
    setSteps,
    setFromGrowth,
    data,
  ]);

  return (
    <>
      {(isLoading || upgradeLoading) && <Loader />}
      <div className="pd_subscription">
        <div className="pd_plan_select">
          <ComparePlansModal
            openModal={openModal}
            closeModal={() => setOpenModal(false)}
          />
          <FeatureModal
            openModal={openFeaturesModal}
            features={
              data?.data[selectedPlan] && data?.data[selectedPlan][0]?.features
            }
            title={`Bumpa ${selectedPlan ? capitalizeText(selectedPlan) : ""}`}
            closeModal={() => setOpenFeaturesModal(false)}
          />
          {steps === 0 && (
            <div className="plan_section">
              <div className="title_container">
                <div className="title_box ">
                  <IconButton
                    type="button"
                    onClick={() => {
                      navigate(-1);
                    }}
                    className="icon_button_container"
                  >
                    <BackArrowIcon />
                  </IconButton>
                  <h2 className="title">Choose a plan</h2>
                </div>
                <p className="description description_pick">
                  You are only a few seconds away from managing your business
                  like a pro.
                </p>
                <Button
                  onClick={() => {
                    setOpenModal(true);
                  }}
                  variant="outlined"
                  type="button"
                  startIcon={<ExportIcon />}
                >
                  Compare Plans
                </Button>
              </div>
              <div className="select_plan">
                {!isError &&
                  data &&
                  (proUpgrade === "true" ? (
                    <>
                      <SinglePlanComponent
                        item={data?.data.pro[0]}
                        selectedPlan={selectedPlan}
                        setSelectedPlan={setSelectedPlan}
                        features={data?.data.pro[0]?.features}
                        step={steps}
                      />
                      <SinglePlanComponent
                        item={data?.data.growth[0]}
                        // otherCharacteristics={data?.data.growth[0]}
                        selectedPlan={selectedPlan}
                        setSelectedPlan={setSelectedPlan}
                        setFinalSelectedPlan={setFinalSelectedPlan}
                        features={data?.data.growth[0]?.features}
                        step={steps}
                      />
                    </>
                  ) : (
                    <>
                      {storeData &&
                        storeData.store.subscription &&
                        storeData.store.subscription[0]?.plan.slug ===
                          "free" && (
                          <>
                            <SinglePlanComponent
                              item={data?.data.starter[0]}
                              selectedPlan={selectedPlan}
                              setSelectedPlan={setSelectedPlan}
                              features={data?.data.starter[0]?.features}
                              step={steps}
                            />
                            <SinglePlanComponent
                              item={data?.data.pro[0]}
                              selectedPlan={selectedPlan}
                              setSelectedPlan={setSelectedPlan}
                              features={data?.data.pro[0]?.features}
                              step={steps}
                            />
                            <SinglePlanComponent
                              item={data?.data.growth[0]}
                              selectedPlan={selectedPlan}
                              setSelectedPlan={setSelectedPlan}
                              setFinalSelectedPlan={setFinalSelectedPlan}
                              features={data?.data.growth[0]?.features}
                              step={steps}
                            />
                          </>
                        )}
                      {((storeData &&
                        storeData.store.subscription &&
                        storeData.store.subscription[0]?.plan.slug ===
                          "trial") ||
                        growthChangePlan) && (
                        <>
                          <SinglePlanComponent
                            item={data?.data.starter[0]}
                            selectedPlan={selectedPlan}
                            setSelectedPlan={setSelectedPlan}
                            features={data?.data.starter[0]?.features}
                            step={steps}
                          />
                          <SinglePlanComponent
                            item={data?.data.pro[0]}
                            selectedPlan={selectedPlan}
                            setSelectedPlan={setSelectedPlan}
                            features={data?.data.pro[0]?.features}
                            step={steps}
                          />
                          <SinglePlanComponent
                            item={data?.data.growth[0]}
                            selectedPlan={selectedPlan}
                            setSelectedPlan={setSelectedPlan}
                            setFinalSelectedPlan={setFinalSelectedPlan}
                            features={data?.data.growth[0]?.features}
                            step={steps}
                          />
                        </>
                      )}
                      {storeData &&
                        storeData.store.subscription &&
                        storeData.store.subscription[0]?.plan.slug ===
                          "starter" && (
                          <>
                            <SinglePlanComponent
                              item={data?.data.pro[0]}
                              selectedPlan={selectedPlan}
                              setSelectedPlan={setSelectedPlan}
                              features={data?.data.pro[0]?.features}
                              step={steps}
                            />
                            <SinglePlanComponent
                              item={data?.data.growth[0]}
                              selectedPlan={selectedPlan}
                              setSelectedPlan={setSelectedPlan}
                              setFinalSelectedPlan={setFinalSelectedPlan}
                              features={data?.data.growth[0]?.features}
                              step={steps}
                            />
                          </>
                        )}
                      {storeData &&
                        storeData.store.subscription &&
                        storeData.store.subscription[0]?.plan.slug ===
                          "pro" && (
                          <>
                            <SinglePlanComponent
                              item={data?.data.growth[0]}
                              selectedPlan={selectedPlan}
                              setSelectedPlan={setSelectedPlan}
                              setFinalSelectedPlan={setFinalSelectedPlan}
                              features={data?.data.growth[0]?.features}
                              step={steps}
                            />
                          </>
                        )}
                    </>
                  ))}
              </div>
            </div>
          )}

          {steps === 1 && (
            <div className="plan_section time_frame_selection">
              <div className="title_container">
                <div className="title_box ">
                  <IconButton
                    type="button"
                    onClick={() => {
                      if (
                        subscriptionType === "cycle" ||
                        subscriptionType === "change" ||
                        subscriptionType === "renew" ||
                        fromUpgradeModal
                      ) {
                        navigate(-1);
                      } else {
                        setSteps(0);
                      }
                      setValidDiscount("");

                      setDiscountCode("");
                      setValidDiscountData(null);
                      setFinalSelectedPlan(null);
                      setSelectedTime("");
                    }}
                    className="icon_button_container"
                  >
                    <BackArrowIcon />
                  </IconButton>
                  <h2 className="title">
                    Bumpa {selectedPlan ? capitalizeText(selectedPlan) : ""}
                  </h2>
                </div>
                <p className="description">
                  Select your subscription billing cycle
                </p>
                <Button
                  onClick={() => {
                    setOpenFeaturesModal(true);
                  }}
                  variant="outlined"
                  type="button"
                >
                  View Features
                </Button>
              </div>
              <div className="select_plan">
                {!isError &&
                  data &&
                  selectedPlan &&
                  data?.data[selectedPlan] &&
                  [...data?.data[selectedPlan]]
                    .sort((a, b) => {
                      return (
                        Number(a.initial_amount) - Number(b.initial_amount)
                      );
                    })
                    .map((item: any) => {
                      const preparedItem = {
                        price: formatPriceNoCurrency(item.amount),
                        name: item.name,
                        description: item.description,
                        features: null,
                        id: item.id,
                      };

                      let checkIfDisabled: boolean = false;
                      let checkIfEqual: boolean = false;

                      if (
                        subscriptionType === "upgrade" ||
                        subscriptionType === "cycle"
                      ) {
                        if (
                          (storeData &&
                            storeData?.store?.subscription &&
                            storeData?.store?.subscription[0]?.plan &&
                            // Exception for 1-year plan with id 13
                            // @ts-ignore
                            storeData?.store?.subscription[0]?.plan.id !== 13 &&
                            storeData?.store?.subscription[0]?.plan.id >=
                              item.id) ||
                          subscriptionAmount >= item.amount
                        ) {
                          checkIfDisabled = true;
                        } else {
                          checkIfDisabled = false;
                        }
                      } else {
                        checkIfDisabled = false;
                      }

                      if (
                        subscriptionType === "upgrade" ||
                        subscriptionType === "cycle"
                      ) {
                        if (
                          storeData &&
                          storeData?.store?.subscription &&
                          storeData?.store?.subscription[0]?.plan &&
                          storeData?.store?.subscription[0]?.plan.id === item.id
                        ) {
                          checkIfEqual = true;
                        } else {
                          checkIfEqual = false;
                        }
                      } else {
                        checkIfEqual = false;
                      }

                      return (
                        <SinglePlanComponent
                          item={preparedItem}
                          otherCharacteristics={item}
                          key={preparedItem.id}
                          selectedPlan={selectedTiime}
                          setSelectedPlan={setSelectedTime}
                          setFinalSelectedPlan={setFinalSelectedPlan}
                          checkDisabled={checkIfDisabled}
                          checkIfEqual={checkIfEqual}
                          step={steps}
                        />
                      );
                    })}
              </div>
            </div>
          )}

          {steps === 2 && (
            <div className="plan_section payment_section">
              <div className="title_container">
                <div className="title_box ">
                  <IconButton
                    type="button"
                    onClick={() => {
                      if (fromGrowth || subscriptionType === "renew") {
                        navigate(-1);
                      } else {
                        setSteps(1);
                      }
                      setValidDiscount("");
                      setDiscountCode("");
                      setValidDiscountData(null);
                    }}
                    className="icon_button_container"
                  >
                    <BackArrowIcon />
                  </IconButton>
                  <h2 className="title">Subscription Summary</h2>
                </div>
                <p className="description">Review subscription </p>
                <Button
                  onClick={() => {
                    setOpenFeaturesModal(true);
                  }}
                  variant="outlined"
                  type="button"
                >
                  Plan Details
                </Button>
                {referralAmount > 0 ? (
                  <div className="referral_container">
                    <Checkbox
                      checked={isUseReferralAmountChecked}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setIsUseReferralAmountChecked(
                          !isUseReferralAmountChecked
                        );
                      }}
                    />
                    <p>
                      Pay with Referral amount:{" "}
                      {formatPriceNoCurrency(Math.max(referralAmount, 0))}
                    </p>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="plan_details">
                <div className="single_detail">
                  <p className="light">Subscription Plan</p>
                  <p className="bold">
                    {finalSelectedPlan ? finalSelectedPlan.name : ""}
                  </p>
                </div>
                <div className="amount_detail">
                  <div className="main">
                    <p className="light">Amount</p>
                    <p className="bold amount">{amountToPay}</p>
                  </div>
                  {subscriptionAmount > 0 && subscriptionType !== "renew" && (
                    <div className="note">
                      <InfoCircleIcon stroke="#F4A408" />
                      <span>
                        You are paying the price difference between your active
                        plan and{" "}
                        {finalSelectedPlan
                          ? finalSelectedPlan.name
                          : "selected"}{" "}
                        plan
                      </span>
                    </div>
                  )}
                </div>
                <div className="single_detail">
                  <p className="light">Duration</p>
                  <p className="bold">
                    {finalSelectedPlan
                      ? getAmountOfYears(finalSelectedPlan.interval as string)
                      : ""}
                  </p>
                </div>
                <div className="single_detail">
                  <p className="light">Billing Period</p>
                  <p className="bold">
                    {finalSelectedPlan
                      ? capitalizeText(finalSelectedPlan.interval)
                      : ""}
                  </p>
                </div>
                <div className="form_for_discount">
                  <InputField
                    prefix={<SaleIcon />}
                    suffix={
                      <Button
                        onClick={checkDiscount}
                        disabled={discountCode ? false : true}
                      >
                        {loadValidity ? (
                          <CircularProgress
                            size="1.2rem"
                            sx={{ color: "#009444" }}
                          />
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    }
                    label={"Discount Code"}
                    value={discountCode}
                    onChange={(e) => {
                      setDiscountCode(e.target.value);
                    }}
                  />
                  {discountCode.length > 0 && validDiscount && (
                    <div
                      className={`show_stats ${
                        validDiscount === "success" ? "success" : "error"
                      }`}
                    >
                      {validDiscount === "success" ? (
                        <CircleCorrectIcon />
                      ) : (
                        <CircleCancelIcon />
                      )}

                      <p>
                        {validDiscount === "success"
                          ? `Discount applied successfully (${Number(
                              validDiscountData?.percentage || 0
                            )}% off)`
                          : "Invalid Discount Code"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <>
            {steps === 2 ? (
              <div>
                <SubmitButton
                  disabled={!finalSelectedPlan}
                  handleClick={() => {
                    if (
                      subscriptionslug === "free" ||
                      subscriptionslug === "trial" ||
                      subscriptionType === "renew"
                    ) {
                      onSubmit();
                    } else {
                      onUpgrade();
                    }
                  }}
                  isLoading={
                    subscriptionslug === "free" || subscriptionslug === "trial"
                      ? isInitiateLoading
                      : upgradeLoading
                  }
                  text={`Pay ${amountToPay}`}
                />

                <div className="paysatck_flex">
                  <p>Payment Secured by</p>
                  <img src={paystack} alt="pasystack" />
                </div>
              </div>
            ) : (
              <SubmitButton
                disabled={
                  (steps === 0 && !selectedPlan) ||
                  (steps === 1 && !selectedTiime)
                }
                handleClick={() => {
                  if (
                    subscriptionType === "upgrade" ||
                    subscriptionType === "cycle"
                  ) {
                    if (steps === 0) {
                      setSteps(steps + 1);
                    } else {
                      if (
                        subscriptionslug === "free" ||
                        subscriptionslug === "trial"
                      ) {
                        setSteps(steps + 1);
                      } else {
                        setSteps(2);
                      }
                    }
                  } else if (
                    subscriptionType === "change" ||
                    subscriptionType === "cycle"
                  ) {
                    if (steps === 0) {
                      if (
                        subscriptionslug === "pro" &&
                        selectedPlan === "starter"
                      ) {
                        setOpenWarningModal(true);
                      } else {
                        setSteps(steps + 1);
                      }
                    } else {
                      setSteps(steps + 1);
                    }
                  } else {
                    setSteps(steps + 1);
                  }
                }}
                text="Continue"
              />
            )}
          </>
        </div>
      </div>

      <DowngradeWarningModal
        openModal={openWarningModal}
        closeModal={() => {
          setOpenWarningModal(false);
        }}
        btnAction={() => {
          setSteps(steps + 1);
        }}
      />
    </>
  );
};
