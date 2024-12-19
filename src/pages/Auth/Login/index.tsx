import { Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import { SubmitButton } from "components/forms/SubmitButton";
import ValidatedInput from "components/forms/ValidatedInput";
import { useGetUserRequest } from "hooks/useGetUseRequest";
import { useLoginMutation } from "services/auth.api";
import {
  selectIsLoggedIn,
  setIsLoggedIn,
  setPermissions,
  setStoreDetails,
  setUserAssignedLocation,
  setUserDetails,
  setUserLocation,
  setUserStoreId,
  setUserToken,
} from "store/slice/AuthSlice";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import AuthLayout from "Templates/AuthLayout";
import { handleError } from "utils";
import { SectionTitle } from "../Signup/widget/SectionTitle";

export type LoginFeilds = {
  email: string;
  password: string;
};

export const Login = () => {
  const [checked, setChecked] = useState(true);
  const [login, { isLoading }] = useLoginMutation();
  const [fetchUser, setFetchUser] = useState(false);
  const { data, isLoading: isUserLoading } = useGetUserRequest(!fetchUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const search = params.get("redirectTo");
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const methods = useForm<LoginFeilds>({
    mode: "all",
  });

  const {
    formState: { isValid },
    handleSubmit,
  } = methods;

  const onSubmit: SubmitHandler<LoginFeilds> = async (data) => {
    try {
      let result = await login(data);
      if ("data" in result) {
        dispatch(setUserToken(result.data.access_token));
        dispatch(setUserStoreId(result.data.store_id));
        dispatch(setStoreDetails(result.data.store));
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

        if (result.data.meta && result.data.meta.first_login === true) {
          if (typeof mixpanel !== "undefined") {
            mixpanel.track("web_first_login");
          }
        }
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
      showToast("Login Successful", "success");
      dispatch(setIsLoggedIn(true));
      navigate(search ? search : "/dashboard");
    }
    // eslint-disable-next-line
  }, [data, isUserLoading]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate(search ? search : "/dashboard");
    }
    // eslint-disable-next-line
  }, [isLoggedIn]);

  return (
    <div className="pd_login">
      <AuthLayout>
        <div className="form_container">
          <FormProvider {...methods}>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
              <SectionTitle
                title="Welcome back"
                description="Get back to managing your business like a pro."
              />
              <ValidatedInput
                label="Email Address"
                name="username"
                type={"email"}
                placeholder="you@email.com"
              />
              <ValidatedInput
                label="Password"
                type={"password"}
                name="password"
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
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              <div className="button_section">
                <SubmitButton
                  text="Login"
                  disabled={!isValid}
                  isLoading={isLoading || isUserLoading}
                  type={"submit"}
                />
                <p>
                  Don’t have a Bumpa account?
                  <Link to={"/signup"}> Create one. </Link>
                </p>
                <Link
                  className="privacy_policy_view"
                  to={"https://www.getbumpa.com/legal"}
                >
                  <span>By continuing, you agree to the</span>
                  Bumpa User Agreement <span>and</span> Privacy Policy
                </Link>
              </div>
            </form>
          </FormProvider>
        </div>
      </AuthLayout>
    </div>
  );
};
