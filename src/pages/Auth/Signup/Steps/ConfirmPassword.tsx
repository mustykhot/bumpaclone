import { useFormContext } from "react-hook-form";
import "./style.scss";
import ValidatedInput from "components/forms/ValidatedInput";
import { SectionTitle } from "../widget/SectionTitle";

type ConfirmPasswordInfoProps = {
  display: string;
};

export const ConfirmPassword = ({ display }: ConfirmPasswordInfoProps) => {
  const { watch } = useFormContext();
  const password = watch("password");

  return (
    <div className={`${display} pd_formsection pd_loginInfo`}>
      <SectionTitle
        title="Choose a password"
        description="You’ll use this password to log in"
      />
      <ValidatedInput
        label="Create Password"
        type={"password"}
        name="password"
        rules={{
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters long",
          },
        }}
      />
      <ValidatedInput
        label="Confirm Password"
        type={"password"}
        name="confirm_password"
        rules={{
          validate: (value) =>
            value === password || "The passwords do not match",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters long",
          },
        }}
      />
    </div>
  );
};
