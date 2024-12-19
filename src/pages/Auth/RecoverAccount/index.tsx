import { Checkbox } from "@mui/material";
import { SubmitButton } from "components/forms/SubmitButton";
import ValidatedInput from "components/forms/ValidatedInput";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "Templates/AuthLayout";
import { SectionTitle } from "pages/Auth/Signup/widget/SectionTitle";
import { useRestoreStoreProfileMutation } from "services";
import { showToast } from "store/store.hooks";
import "./style.scss";
import { handleError } from "utils";

export type RecoverAccountField = {
  email: string;
  password: string;
};

export const RecoverAccount = () => {
  const [checked, setChecked] = useState(true);
  const [restoreStoreProfile, { isLoading }] = useRestoreStoreProfileMutation();
  const navigate = useNavigate();

  const methods = useForm<RecoverAccountField>({
    mode: "all",
  });

  const {
    formState: { isValid },
    handleSubmit,
  } = methods;

  const onSubmit: SubmitHandler<RecoverAccountField> = async (data) => {
    try {
      const result = await restoreStoreProfile();
      if ("data" in result) {
        showToast("Account Recovered Successfully", "success");
        navigate("/dashboard/profile");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="pd_recover_account">
      <AuthLayout>
        <div className="form_container">
          <FormProvider {...methods}>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
              <SectionTitle
                title="Recover your account"
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
                  isLoading={isLoading}
                  type={"submit"}
                />
                {/* <p>
                  Don’t have a Bumpa account?{" "}
                  <Link to={"/signup"}>Create one </Link>
                </p> */}
              </div>
            </form>
          </FormProvider>{" "}
        </div>
      </AuthLayout>
    </div>
  );
};
