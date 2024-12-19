import { Button, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import confetti from "assets/images/confetti.gif";
import EmptyResponse from "components/EmptyResponse";
import { SubmitButton } from "components/forms/SubmitButton";
import { IStoreInformation } from "Models/store";
import {
  useGetPlanRecommendationMutation,
  useSetupStoreBasicMutation,
} from "services/auth.api";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  selectCurrentStore,
  selectCurrentUser,
  setStoreDetails,
} from "store/slice/AuthSlice";
import { handleError } from "utils";
import { ImportantInfo } from "./ImportantInfo";
import { StoreInfo } from "./StoreInfo";
import { PlanInfo } from "./PlanInfo";

export type StoreFields = {
  selectedItems?: string[];
  store_name?: string;
  domain?: string;
  ordersCount?: number;
  staffCount?: number;
  physicalStoreCount?: number;
  planId?: string;
  plan?: string;
  message?: string;
  store: IStoreInformation;
};

export type PlanRecommendationFields = {
  ordersCount?: number;
  staffCount?: number;
  physicalStoreCount?: number;
  plan_slug: string;
};

const TOTALSIGNUPSTEPS = 3;

export const SetupStore = () => {
  const [presentStep, setPresentStep] = useState<number>(1);
  const [setupSuccess, setSetupSuccess] = useState(false);
  const [recommendedPlan, setRecommendedPlan] = useState("");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [setupStoreBasic, { isLoading }] = useSetupStoreBasicMutation();
  const [getPlanRecommendation, { isLoading: isRecommendationLoading }] =
    useGetPlanRecommendationMutation();
  const userStore = useAppSelector(selectCurrentStore);
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const methods = useForm<StoreFields>({
    mode: "all",
    defaultValues: {
      selectedItems: [],
    },
  });

  const {
    trigger,
    formState: { isValid },
    handleSubmit,
    watch,
    setValue,
  } = methods;

  const storeName = watch("store_name");
  const domainUrl = watch("domain");
  const ordersCount = watch("ordersCount");
  const staffCount = watch("staffCount");
  const physicalStoreCount = watch("physicalStoreCount");
  const selectedItems = watch("selectedItems") || [];

  const goNext = async (num: number) => {
    const nextStep = presentStep + num;
    if (presentStep === 1) {
      const selectedAttributes = selectedItems.reduce(
        (acc: any, item: string) => {
          acc[item] = true;
          return acc;
        },
        {}
      );

      if (typeof _cio !== "undefined") {
        _cio.identify({
          id: user?.email,
          ...selectedAttributes,
        });
      }

      if (typeof mixpanel !== "undefined") {
        for (const [property, value] of Object.entries(selectedAttributes)) {
          mixpanel.people.set(property, value);
        }
      }
      if (nextStep <= TOTALSIGNUPSTEPS && nextStep >= 1) {
        setPresentStep(nextStep);
      }
    } else if (presentStep === 2 && num > 0) {
      const payload = {
        store_name: storeName,
        subdomain: domainUrl,
        orders_per_week: ordersCount,
        staff_number: staffCount,
        physical_store: physicalStoreCount,
      };

      try {
        let result = await getPlanRecommendation(payload);
        if ("data" in result) {
          showToast(`Store details updated successfully`, "success");
          setRecommendedPlan(result.data.plan_slug);

          const additionalAttributes = {
            weekly_order: ordersCount,
            staff_no: staffCount,
            physical_store: physicalStoreCount,
          };

          if (typeof _cio !== "undefined") {
            _cio.identify({
              id: user?.email,
              ...additionalAttributes,
            });
          }

          if (typeof mixpanel !== "undefined") {
            for (const [property, value] of Object.entries(
              additionalAttributes
            )) {
              mixpanel.people.set(property, value);
            }
          }
          if (nextStep <= TOTALSIGNUPSTEPS && nextStep >= 1) {
            setPresentStep(nextStep);
          }
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    } else {
      if (nextStep <= TOTALSIGNUPSTEPS && nextStep >= 1) {
        setPresentStep(nextStep);
      }
    }
  };

  const onSubmit: SubmitHandler<StoreFields> = async (data) => {
    storeSetupFnc(data);
  };

  const storeSetupFnc = async (data: any) => {
    const payload = {
      reason_for_starting_array: data.selectedItems,
      store_name: data.store_name,
      subdomain: data.domain,
      orders_per_week: data.ordersCount,
      staff_number: data.staffCount,
      number_of_stores: data.physicalStoreCount,
      physical_store: data.physicalStoreCount !== "0" ? "Yes" : "No",
      plan_id: data.planId,
    };

    try {
      let result = await setupStoreBasic(payload);
      if ("data" in result) {
        dispatch(setStoreDetails(result.data.store));
        showToast(`Store details updated successfully`, "success");
        setSetupSuccess(true);

        if (typeof _cio !== "undefined") {
          _cio.identify({
            id: user?.email,
            subscription_intent: recommendedPlan,
          });
          _cio.track("web_signup_complete", payload);
        }
        if (typeof mixpanel !== "undefined") {
          mixpanel.identify(`${user?.email as string}`);
          mixpanel.people.set("subscription_intent", recommendedPlan);
          mixpanel.track("web_signup_complete", payload);
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleBackNavigation = async () => {
    goNext(-1);
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    const selectedItems = watch("selectedItems") || [];
    if (checked) {
      if (selectedItems.length < 3) {
        setValue("selectedItems", [...selectedItems, value], {
          shouldValidate: true,
        });
      }
    } else {
      setValue(
        "selectedItems",
        selectedItems.filter((item) => item !== value),
        {
          shouldValidate: true,
        }
      );
    }
  };

  const isStepOneValid = selectedItems.length === 3;

  const isStepTwoValid =
    storeName && domainUrl && ordersCount && staffCount && physicalStoreCount;

  const launchWebsite = () => {
    if (typeof _cio !== "undefined") {
      _cio.track("web_website_launch");
    }
    if (typeof mixpanel !== "undefined") {
      mixpanel.track("web_website_launch");
    }
    navigate("/dashboard?launchWebsite=true");
  };

  const exploreWebApp = () => {
    if (typeof _cio !== "undefined") {
      _cio.track("web_explore_app");
    }
    if (typeof mixpanel !== "undefined") {
      mixpanel.track("web_explore_app");
    }
    navigate("/dashboard?exploreWebApp=true");
  };

  useEffect(() => {
    if (userStore) {
      if (
        userStore.meta &&
        userStore.meta.onBoard &&
        userStore.meta.onBoard.basic_setup
      ) {
        navigate("/dashboard");
      }
    }
  }, []);

  useEffect(() => {
    if (presentStep === 1) {
      trigger("selectedItems");
    }
  }, [presentStep, selectedItems, trigger]);

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
    <div className={`pd_setupStore ${setupSuccess && "success"}`}>
      {setupSuccess ? (
        <div className="pd_setupStore_success">
          <EmptyResponse
            message="Congratulations"
            image={confetti}
            extraText="Your store is ready and a website has been created for you."
            btn={
              <Button
                variant="contained"
                onClick={launchWebsite}
                className="primary_styled_button"
              >
                Launch your website
              </Button>
            }
            extraBtn={
              screenWidth > 1300 && (
                <Button variant="outlined" onClick={exploreWebApp}>
                  Explore the web app
                </Button>
              )
            }
          />
        </div>
      ) : (
        <div className="form_container">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="store_container">
                <div
                  className={`back_container my-[32px] ${
                    presentStep !== 1 ? "block" : "hidden"
                  } `}
                >
                  <IconButton
                    type="button"
                    onClick={handleBackNavigation}
                    className="back_icon"
                  >
                    <BackArrowIcon />
                  </IconButton>
                </div>
                <div className="step_container">
                  {presentStep >= 1 && (
                    <ImportantInfo
                      display={`${presentStep === 1 ? "block" : "hidden"}`}
                      onCheckboxChange={handleCheckboxChange}
                      selectedItems={watch("selectedItems") || []}
                    />
                  )}
                  {presentStep >= 2 && (
                    <StoreInfo
                      display={`${presentStep === 2 ? "block" : "hidden"}`}
                    />
                  )}
                  {presentStep >= 3 && (
                    <PlanInfo
                      display={`${presentStep === 3 ? "block" : "hidden"}`}
                      handleSubmit={handleSubmit(onSubmit)}
                      isSubmitLoading={isLoading}
                      recommendedPlan={recommendedPlan}
                    />
                  )}
                  <div className="button_section">
                    {presentStep < TOTALSIGNUPSTEPS && (
                      <SubmitButton
                        text={"Continue"}
                        disabled={
                          !isValid ||
                          (presentStep === 1 && !isStepOneValid) ||
                          (presentStep === 2 && !isStepTwoValid)
                        }
                        isLoading={isRecommendationLoading}
                        handleClick={() => {
                          goNext(1);
                        }}
                        type={"button"}
                      />
                    )}
                  </div>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      )}
    </div>
  );
};
