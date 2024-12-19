import { LoadingButton } from "@mui/lab";
import { useFormContext } from "react-hook-form";
import paystack from "assets/images/paystack.png";
import ValidatedInput from "components/forms/ValidatedInput";
import { LinkTerminalModalField } from ".";

type StepOneProps = {
  onSubmit: (data: LinkTerminalModalField) => void;
  onCancel: () => void;
  isLoading: boolean;
};

export const StepOne = ({ onSubmit, onCancel, isLoading }: StepOneProps) => {
  const {
    handleSubmit,
    formState: { isValid },
  } = useFormContext();

  return (
    <div className="main">
      <div className="main--header">
        <h2>Link Terminal Account Number</h2>
        <p>Enter your Terminal account number to continue</p>
      </div>
      <div className="main--dial">
        <p>
          Forgot your terminal account number?{" "}
          <a target="_blank" href="https://terminal.bumpa.com/dashboard">
            Click here
          </a>
        </p>
      </div>
      <ValidatedInput
        label="Terminal Account Number"
        name="account_number"
        placeholder="Enter terminal account number"
        type="text"
        rules={{
          required: "Terminal account number is required",
          validate: (value) =>
            value?.length === 10 || "Terminal account number must be 10 digits",
        }}
        maxLength={10}
      />
      <div className="button_container">
        <LoadingButton
          onClick={handleSubmit((data) => {
            if (data.account_number) {
              onSubmit(data as { account_number: string });
            }
          })}
          loading={isLoading}
          disabled={isLoading || !isValid}
          variant="contained"
        >
          Continue
        </LoadingButton>
        <p onClick={onCancel}>Cancel</p>
      </div>
      <div className="powered-by">
        <h4>Powered by</h4>
        <img src={paystack} alt="Paystack" />
      </div>
    </div>
  );
};
