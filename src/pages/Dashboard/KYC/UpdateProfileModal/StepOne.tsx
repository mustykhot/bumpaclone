import { Button } from "@mui/material";
import { useFormContext } from "react-hook-form";

type StepOneProps = {
  onContinue: () => void;
  onUpdate: () => void;
};

export const StepOne = ({ onContinue, onUpdate }: StepOneProps) => {
  const { watch } = useFormContext();
  const firstName = watch("first_name");
  const middleName = watch("middle_name");
  const lastName = watch("last_name");
  const dateOfBirth = watch("date_of_birth");

  const isDetailsComplete = firstName && lastName && dateOfBirth;

  return (
    <div className="main one">
      <div className="header">
        <h2>Review Your Name & DoB</h2>
        <p className="description">
          Please note that in order to complete your verification, the name on
          your Bumpa account must match the name on your BVN & NIN records.
        </p>
      </div>
      <div className="info">
        <p className="description">
          Below is the Name and DoB on your Bumpa Account
        </p>
        <div className="box">
          <div className="box_text">
            <p>
              Name:{" "}
              <span>
                {firstName ? firstName : "N/A"}{" "}
                {middleName ? middleName : "N/A"} {lastName ? lastName : "N/A"}
              </span>
            </p>
            <p>
              DoB: <span>{dateOfBirth ? dateOfBirth : "N/A"}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="button_container">
        {isDetailsComplete && (
          <Button
            onClick={onContinue}
            variant="contained"
            className="primary primary_styled_button"
          >
            Continue
          </Button>
        )}
        <Button variant="outlined" onClick={onUpdate}>
          Update Profile
        </Button>
      </div>
    </div>
  );
};
