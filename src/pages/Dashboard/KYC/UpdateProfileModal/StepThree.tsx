import { Button } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { HelpCircleIcon } from "assets/Icons/HelpCircleIcon";

type StepThreeProps = {
  onCancel: () => void;
  onContinue: () => void;
};

export const StepThree = ({ onCancel, onContinue }: StepThreeProps) => {
  const { getValues } = useFormContext();

  return (
    <div className="main three">
      <div className="icon">
        <HelpCircleIcon />
      </div>
      <div className="change">
        <h2>Change Name and Date of Birth</h2>
        <p className="description">
          Are you sure you want to change your name to{" "}
          <span>
            {getValues("first_name")} {getValues("middle_name")}{" "}
            {getValues("last_name")}
          </span>{" "}
          and date of birth to <span>{getValues("date_of_birth")}</span>?
        </p>
      </div>
      <div className="button_container step-three">
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onContinue} variant="contained">
          Continue
        </Button>
      </div>
    </div>
  );
};
