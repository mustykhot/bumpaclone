import { useState, useEffect } from "react";
import AuthLayout from "Templates/AuthLayout";
import ValidatedInput from "components/forms/ValidatedInput";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { SectionTitle } from "../Signup/widget/SectionTitle";
import { Checkbox } from "@mui/material";
import { SubmitButton } from "components/forms/SubmitButton";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { showToast, useAppDispatch } from "store/store.hooks";
import { handleError } from "utils";
import { useLocation } from "react-router-dom";
import { useActivateStaffMutation } from "services/auth.api";
import {
  setUserDetails,
  setUserStoreId,
  setUserToken,
  setPermissions,
  setIsLoggedIn,
  setStoreDetails,
  setUserLocation,
  setUserAssignedLocation,
} from "store/slice/AuthSlice";
import { useGetUserRequest } from "hooks/useGetUseRequest";

export type StaffActivationFeilds = {
  email: string;
  password: string;
  confrimPassword: string;
};

const ActivateStaffAccount = () => {
  const [checked, setChecked] = useState(true);
  const [fetchUser, setFetchUser] = useState(false);
  const { data, isLoading: isUserLoading } = useGetUserRequest(!fetchUser);
  const [activateStaff, { isLoading }] = useActivateStaffMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const regex = /token=([^&]+)/;
  const emailregex = /email=([^&]+)/;
  const match = location?.search?.match(regex);
  const emailMatch = location?.search?.match(emailregex);
  const token = match ? match[1] : null;
  const email = emailMatch ? emailMatch[1] : null;
  const [plan, setPlan] = useState("");
  const methods = useForm<StaffActivationFeilds>({
    mode: "all",
  });

  const {
    formState: { isValid },
    handleSubmit,
    setValue,
    watch,
  } = methods;

  const password = watch("password");

  const onSubmit: SubmitHandler<StaffActivationFeilds> = async (data) => {
    const payload = {
      email: data.email,
      token: token as string,
      password: data.password,
      password_confirmation: data.confrimPassword,
    };
    try {
      let result = await activateStaff(payload);
      if ("data" in result) {
        dispatch(setUserToken(result.data.access_token));
        dispatch(setUserStoreId(result.data.store_id));
        dispatch(setStoreDetails(result.data.store));
        dispatch(setPermissions(result.data.permissions));
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
        if (
          result.data.store &&
          result.data.store.subscription &&
          result.data.store.subscription[0] &&
          result.data.store.subscription[0]?.plan &&
          (result.data.store.subscription[0]?.plan.slug === "pro" ||
            result.data.store.subscription[0]?.plan.slug === "trial" ||
            result.data.store.subscription[0]?.plan.slug === "growth")
        ) {
          setPlan(result?.data?.store?.subscription[0]?.plan.slug);
        } else {
          setPlan("");
        }
        setFetchUser(true);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (data) {
      dispatch(setUserDetails(data));
      showToast("Staff verified successfully", "success");

      if (plan === "pro" || plan === "trial" || plan === "growth") {
        showToast("Login Successful", "success");
        dispatch(setIsLoggedIn(true));
        navigate("/dashboard");
      } else {
        navigate("/dashboard/account-status");
      }
    }
    // eslint-disable-next-line
  }, [data, isUserLoading]);

  useEffect(() => {
    if (email) {
      setValue("email", email);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="pd_activate_staff">
      <AuthLayout>
        <div className="form_container">
          <FormProvider {...methods}>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
              <SectionTitle
                title="Get Started"
                description="Create your password to activate your account "
              />
              <ValidatedInput
                label="Email Address"
                name="email"
                type={"email"}
                placeholder="you@email.com"
              />
              <ValidatedInput
                label="Create Password"
                type={"password"}
                name="password"
              />

              <ValidatedInput
                label="Confirm Password"
                type={"password"}
                name="confrimPassword"
                rules={{
                  validate: (value) =>
                    value === password || "The passwords do not match",
                }}
              />

              <div className="forgot_password_section">
                <div className="checkbox_section">
                  <Checkbox
                    checked={checked}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setChecked(e.target.checked);
                    }}
                  />
                  <p>Remember Password</p>
                </div>
              </div>

              <div className="button_section">
                <SubmitButton
                  text="Login"
                  disabled={!isValid || !checked}
                  type={"submit"}
                  isLoading={isLoading || isUserLoading}
                />
              </div>
            </form>
          </FormProvider>{" "}
        </div>
      </AuthLayout>
    </div>
  );
};

export default ActivateStaffAccount;
