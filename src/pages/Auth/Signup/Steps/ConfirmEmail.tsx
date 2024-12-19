import { useFormContext } from "react-hook-form";
import ValidatedInput from "components/forms/ValidatedInput";
import { SectionTitle } from "../widget/SectionTitle";

type ConfirmEmailProps = {
  display: string;
};

export const ConfirmEmail = ({
  display,
}: ConfirmEmailProps) => {
  const { getValues } = useFormContext();
  const email = getValues("email");

  return (
    <div className={`${display} pd_formsection pd_confirmEmail`}>
      <SectionTitle
        title="Confirm email address"
        description={
          <>
            We've sent a six digit code to <span>{email}</span>
          </>
        }
      />
      <ValidatedInput
        id="otp-input"
        name="otp"
        placeholder="000000"
        label="Enter Code"
        type={"number"}
        rules={{
          validate: (value) =>
            value?.length == 6 || "Code must be 6 characters.",
        }}
      />
    </div>
  );
};
