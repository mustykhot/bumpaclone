import { useEffect } from "react";
import { SubmitButton } from "components/forms/SubmitButton";
import ValidatedInput from "components/forms/ValidatedInput";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import AuthLayout from "Templates/AuthLayout";
import { SectionTitle } from "../Signup/widget/SectionTitle";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
import { useResetPasswordMutation } from "services/auth.api";

export type CreateNewPassowrdFeilds = {
  email: string;
  password: string;
  password_confirmation: string;
};

export const CreateNewPassowrd = () => {
  const methods = useForm<CreateNewPassowrdFeilds>({
    mode: "all",
  });
  const {
    formState: { isValid },
    watch,
    handleSubmit,
    setValue,
  } = methods;
  const password = watch("password");
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const [resetpassword, { isLoading }] = useResetPasswordMutation();

  const onSubmit: SubmitHandler<CreateNewPassowrdFeilds> = async (data) => {
    let payload = {
      ...data,
      token,
    };
    try {
      let result = await resetpassword(payload);
      if ("data" in result) {
        showToast("Password reset Successful", "success");
        navigate("/login");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (email) {
      setValue("email", email);
    }

    // eslint-disable-next-line
  }, [email]);

  return (
    <div className="pd_login">
      <AuthLayout>
        <div className="form_container">
          <FormProvider {...methods}>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
              <SectionTitle
                title="Create new password"
                description="Create a new password for your Bumpa account."
              />
              <ValidatedInput label="Email" type={"text"} name="email" />
              <ValidatedInput
                label="Password"
                type={"password"}
                name="password"
              />

              <ValidatedInput
                label="Confirm Password"
                name="password_confirmation"
                type={"password"}
                rules={{
                  validate: (value) =>
                    value === password || "The passwords do not match",
                }}
              />

              <div className="button_section">
                <SubmitButton
                  text="Reset Password"
                  disabled={!isValid}
                  isLoading={isLoading}
                  type={"submit"}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </AuthLayout>
    </div>
  );
};
