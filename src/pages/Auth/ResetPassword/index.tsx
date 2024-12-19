import { SubmitButton } from "components/forms/SubmitButton";
import ValidatedInput from "components/forms/ValidatedInput";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import AuthLayout from "Templates/AuthLayout";
import { SectionTitle } from "../Signup/widget/SectionTitle";
import { useForgotPasswordMutation } from "services/auth.api";
import { handleError } from "utils";
import { showToast } from "store/store.hooks";

export type ResetPasswordFeilds = {
  email: string;
};

export const ResetPassword = () => {
  const [forgetpassword, { isLoading }] = useForgotPasswordMutation();

  const methods = useForm<ResetPasswordFeilds>({
    mode: "all",
  });
  const {
    formState: { isValid },
    handleSubmit,
  } = methods;

  const onSubmit: SubmitHandler<ResetPasswordFeilds> = async (data) => {
    try {
      let result = await forgetpassword(data);
      // res.data.account_verified
      if ("data" in result) {
        showToast("Password reset email sent", "success");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="pd_login">
      <AuthLayout>
        <div className="form_container">
          <FormProvider {...methods}>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
              <SectionTitle
                title="Reset Password"
                description="We’ll send a reset email to your associated email address. "
              />
              <ValidatedInput
                label="Email Address"
                name="email"
                type={"email"}
                placeholder="you@email.com"
              />

              <div className="button_section">
                <SubmitButton
                  text="Reset Password"
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
