import { Button, CircularProgress, IconButton } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { useState, useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import confetti from "assets/images/confetti.gif";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import EmptyResponse from "components/EmptyResponse";
import { SubmitButton } from "components/forms/SubmitButton";
import { useGetUserRequest } from "hooks/useGetUseRequest";
import {
  usePrevalidateSignupMutation,
  useRequestOtpMutation,
  useSignupMutation,
  useVerifyOtpMutation,
} from "services/auth.api";
import {
  setIsLoggedIn,
  setPermissions,
  setStoreDetails,
  setUserAssignedLocation,
  setUserDetails,
  setUserLocation,
  setUserStoreId,
  setUserToken,
} from "store/slice/AuthSlice";
import { showToast, useAppDispatch } from "store/store.hooks";
import AuthLayout from "Templates/AuthLayout";
import { formatPhoneNumber, handleError } from "utils";
import { LoginInfo } from "./Steps/LoginInfo";
import { ConfirmEmail } from "./Steps/ConfirmEmail";
import { ConfirmPassword } from "./Steps/ConfirmPassword";

export type SignupFields = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  referral?: string;
  referral_code?: string;
  howto?: string;
  explain_how?: string;
  otp?: string;
  password?: string;
  confirmPassword?: string;
};

export type RequestOtpFields = {
  "submit-otp"?: string;
  message?: string;
};

export type VerifyOtpFields = {
  otp?: string;
};

const TOTALSIGNUPSTEPS = 3;

const SignUp = () => {
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [presentStep, setPresentStep] = useState<number>(1);
  const [isChecked, setIsChecked] = useState(false);
  const [isMarketingChecked, setIsMarketingChecked] = useState(true);
  const [fetchUser, setFetchUser] = useState(false);
  const [verifyOtpLink, setVerifyOtpLink] = useState<string>("");
  const [registerLink, setRegisterLink] = useState<string>("");
  const [timerActive, setTimerActive] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const [remainingTime, setRemainingTime] = useState(120);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { data, isLoading: isUserLoading } = useGetUserRequest(!fetchUser);
  const [signup, { isLoading }] = useSignupMutation();
  const [prevalidateSignup, { isLoading: isPrevalidateSignupLoading }] =
    usePrevalidateSignupMutation();
  const [requestOtp, { isLoading: isRequestOtpLoading }] =
    useRequestOtpMutation();
  const [verifyOtp, { isLoading: isVerifyOtpLoading }] = useVerifyOtpMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const methods = useForm<SignupFields>({
    mode: "all",
  });

  const {
    trigger,
    formState: { isValid },
    handleSubmit,
    getValues,
    setValue,
  } = methods;

  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get("utm_source");
  const medium = queryParams.get("utm_medium");

  useEffect(() => {
    if (source) {
      if (source === "referral") {
        setValue("howto", source);
        if (medium) {
          setValue("referral_code", medium);
        }
      }
      queryParams.delete("utm_source");
    }

    if (medium && !source) {
      queryParams.delete("utm_medium");
    }

    const newUrl = `${window.location.origin}${window.location.pathname}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    window.history.replaceState(null, "", newUrl);
  }, [location.search, setValue]);

  const goNext = (num: number) => {
    setPresentStep(
      presentStep + num <= TOTALSIGNUPSTEPS ? presentStep + num : presentStep
    );
    if (presentStep === 2) {
      resetTimer();
    }
    trigger();
  };

  const handleCreateAccount = async () => {
    const { email, firstName, lastName, phone, referral, referral_code } =
      getValues();

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      referral: referral,
      referral_code: referral_code,
    };

    if (typeof mixpanel !== "undefined") {
      mixpanel.identify(`${payload.email as string}`);

      mixpanel.people.set("$email", payload.email);
      mixpanel.people.set("$first_name", payload.first_name);
      mixpanel.people.set("$last_name", payload.last_name);
      mixpanel.people.set("Phone", formatPhoneNumber(payload.phone));
      mixpanel.people.set("Referral", payload.referral);
      mixpanel.people.set("Referral Code", payload.referral_code);

      mixpanel.track("web_create_account", payload);
    }
  };

  const handleRequestCode = async () => {
    const { email, firstName, lastName, phone, referral, referral_code } =
      getValues();

    const prevalidatePayload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: formatPhoneNumber(phone),
      referral: referral,
      referral_code: referral_code,
    };

    try {
      const prevalidateResult = await prevalidateSignup(prevalidatePayload);

      if ("error" in prevalidateResult) {
        handleError(prevalidateResult);
        return;
      }

      const requestOtpPayload = {
        first_name: firstName,
        email: email,
      };

      const result = await requestOtp(requestOtpPayload);
      if ("data" in result && result.data["submit-otp"]) {
        showToast(`${result.data.message}`, "success");
        setVerifyOtpLink(result.data["submit-otp"]);
        resetTimer();
        startTimer();
        handleCreateAccount();
        goNext(1);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleResendCode = async () => {
    const { email, firstName } = getValues();

    const requestOtpPayload = {
      first_name: firstName,
      email: email,
    };

    try {
      const result = await requestOtp(requestOtpPayload);
      if ("data" in result && result.data["submit-otp"]) {
        showToast(`${result.data.message}`, "success");
        setVerifyOtpLink(result.data["submit-otp"]);
        resetTimer();
        startTimer();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleConfirmEmailCode = async (otp: string) => {
    const payload = {
      otp: otp,
    };

    try {
      const result = await verifyOtp({ payload, verifyOtpLink });
      if ("data" in result) {
        showToast(`${result.data.message}`, "success");
        setRegisterLink(result.data["register-link"] || "");

        if (typeof mixpanel !== "undefined") {
          mixpanel.people.set("email_verified", true);
        }

        goNext(1);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const onSubmit: SubmitHandler<SignupFields> = async (data) => {
    const payload = {
      name: `${data.firstName} ${data.lastName}`,
      first_name: data.firstName,
      surname: data.lastName,
      email: data.email,
      phone: formatPhoneNumber(data?.phone),
      referral:
        data.howto === "referral"
          ? data.referral_code
          : data.howto === "others"
          ? data.explain_how
          : data.howto,
      password: data.password,
      source: source,
      medium: medium,
    };

    const cioSubscriptionPreferences = {
      topics: {
        topic_3: isMarketingChecked,
      },
    };

    try {
      let result = await signup({ payload, registerLink });
      if ("data" in result) {
        dispatch(setUserToken(result.data.access_token));
        dispatch(setUserStoreId(result.data.store_id));
        dispatch(setStoreDetails(result.data.store));
        setSignupSuccess(true);
        setFetchUser(true);

        if (result?.data?.logged_in_location) {
          dispatch(
            setUserLocation({
              ...result?.data?.logged_in_location,
              name: result.data.logged_in_location.name,
              id: result.data.logged_in_location.id,
            })
          );
        }

        dispatch(setUserAssignedLocation(result.data.assigned_locations));

        if (result?.data?.permissions !== undefined) {
          dispatch(setPermissions(result?.data?.permissions));
        }

        if (typeof _cio !== "undefined") {
          _cio.identify({
            id: payload.email as string,
            first_name: payload.first_name as string,
            last_name: payload.surname as string,
            referral: payload.referral as string,
            cio_subscription_preferences: JSON.stringify(
              cioSubscriptionPreferences
            ),
            source: payload.source as string,
            medium: payload.medium as string,
          });
          _cio.track("web_signup", payload);
        }

        if (typeof mixpanel !== "undefined") {
          mixpanel.track("web_signup", payload);
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const confirmEmailClick = () => {
    const { otp } = getValues();

    handleConfirmEmailCode(otp ?? "");
  };

  const startTimer = () => {
    setTimerActive(true);
    setRemainingTime(120);

    timerRef.current = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current!);
          setTimerActive(false);
          setTimerExpired(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimerActive(false);
    setRemainingTime(120);
    setTimerExpired(false);
  };

  const handleBackNavigation = async () => {
    if (presentStep === 2) {
      goNext(-1);
      await trigger("email");
    } else if (presentStep === 3) {
      goNext(-1);
      methods.setValue("otp", "");
      await trigger("email");
    } else {
      goNext(-1);
    }
  };

  const startSetupStore = () => {
    if (data) {
      dispatch(setUserDetails(data));
      dispatch(setIsLoggedIn(true));
      navigate("/setup-store");
    }
  };

  useEffect(() => {
    if (presentStep === 2 && !timerActive) {
      startTimer();
    }
  }, [presentStep, timerActive]);

  return (
    <div className="pd_signup">
      {signupSuccess ? (
        <div className="pd_signup_success">
          <EmptyResponse
            message="Congratulations"
            image={confetti}
            extraText="You’ve successfully created your Bumpa account"
            btn={
              <Button variant="contained" onClick={startSetupStore}>
                Continue
              </Button>
            }
          />
        </div>
      ) : (
        <div className="form_container">
          <FormProvider {...methods}>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
              <AuthLayout>
                <div className="user_details_section">
                  <div className="progress_bar_container">
                    <LinearProgress
                      variant="determinate"
                      className={"progress_bar"}
                      color={"primary"}
                      value={(presentStep / TOTALSIGNUPSTEPS) * 100}
                    />
                  </div>
                  <div
                    className={`back_container my-[32px] ${
                      presentStep > 1 ? "block" : "hidden"
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
                      <LoginInfo
                        isChecked={isChecked}
                        setChecked={setIsChecked}
                        isMarketingChecked={isMarketingChecked}
                        setMarketingChecked={setIsMarketingChecked}
                        display={`${presentStep === 1 ? "block" : "hidden"}`}
                      />
                    )}
                    {presentStep >= 2 && (
                      <ConfirmEmail
                        display={`${presentStep === 2 ? "block" : "hidden"}`}
                      />
                    )}
                    {presentStep >= 3 && (
                      <ConfirmPassword
                        display={`${presentStep === 3 ? "block" : "hidden"}`}
                      />
                    )}
                    <div className="button_section">
                      {presentStep === 1 && (
                        <SubmitButton
                          text={"Continue"}
                          disabled={
                            !isValid ||
                            !isChecked ||
                            isRequestOtpLoading ||
                            isPrevalidateSignupLoading
                          }
                          isLoading={
                            isRequestOtpLoading || isPrevalidateSignupLoading
                          }
                          handleClick={handleRequestCode}
                          type={"button"}
                        />
                      )}
                      {presentStep === 2 && (
                        <SubmitButton
                          text="Continue"
                          disabled={!isValid || isRequestOtpLoading}
                          isLoading={isVerifyOtpLoading}
                          handleClick={confirmEmailClick}
                          type={"button"}
                        />
                      )}
                      {presentStep === 2 && (
                        <p>
                          Didn't get the code?{" "}
                          {timerExpired ? (
                            isRequestOtpLoading ? (
                              <CircularProgress size={20} />
                            ) : (
                              <span
                                className="resend"
                                onClick={handleResendCode}
                              >
                                Resend code
                              </span>
                            )
                          ) : (
                            <>
                              Resend code in{" "}
                              <span>
                                {`${Math.floor(remainingTime / 60)}:${String(
                                  remainingTime % 60
                                ).padStart(2, "0")}`}
                              </span>
                            </>
                          )}
                        </p>
                      )}
                      {presentStep === TOTALSIGNUPSTEPS && (
                        <SubmitButton
                          text={"Submit"}
                          disabled={!isValid}
                          isLoading={isLoading || isUserLoading}
                          type={"submit"}
                        />
                      )}
                      {presentStep === 1 && (
                        <p>
                          Already have a Bumpa account?
                          <Link to={"/"}> Sign in</Link>
                        </p>
                      )}
                    </div>{" "}
                  </div>
                </div>
              </AuthLayout>
            </form>
          </FormProvider>
        </div>
      )}
    </div>
  );
};

export default SignUp;
