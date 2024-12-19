import { LoadingButton } from "@mui/lab";
import { InfoIconYellow } from "assets/Icons/InfoIconYellow";
import { InfoType } from ".";
import { Button } from "@mui/material";

type StepTwoProps = {
  backAction: () => void;
  nextAction: () => void;
  onCancel: () => void;
  info: InfoType | null;
  isLoading: boolean;
};

export const StepTwo = ({
  backAction,
  nextAction,
  onCancel,
  info,
  isLoading,
}: StepTwoProps) => {
  return (
    <div className="main two">
      <div className="main--icon">
        <InfoIconYellow />
      </div>
      <div className="main--header two">
        <h2>Confirm Terminal Account</h2>
        <p>
          Kindly confirm that the terminal account details displayed belongs to
          you.
        </p>
      </div>
      <div className="main--info">
        <div className="main--info__each">
          <p>Account number:</p>
          <span>{info?.account_number}</span>
        </div>
        <div className="main--info__each">
          <p>Account name:</p>
          <span>{info?.account_name}</span>
        </div>
      </div>
      <div className="button_container two">
        <Button onClick={backAction} variant="contained" className="try">
          Try Again
        </Button>
        <LoadingButton
          onClick={nextAction}
          variant="outlined"
          className="cancel"
          loading={isLoading}
          disabled={isLoading}
        >
          Terminal Account is Correct. Proceed
        </LoadingButton>
        <p onClick={onCancel}>Cancel</p>
      </div>
    </div>
  );
};
