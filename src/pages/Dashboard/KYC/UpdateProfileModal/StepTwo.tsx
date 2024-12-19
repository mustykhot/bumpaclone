import { Button } from "@mui/material";
import { useFormContext } from "react-hook-form";
import ValidatedInput from "components/forms/ValidatedInput";

type StepTwoProps = {
  onSave: () => void;
};

export const StepTwo = ({ onSave }: StepTwoProps) => {
  const {
    formState: { isValid },
  } = useFormContext();

  return (
    <div className="main two">
      <div className="header">
        <h2>Update Profile</h2>
        <p className="description">
          Update your full name to match the name on your BVN and NIN record.
        </p>
      </div>
      <div className="form">
        <ValidatedInput
          name="first_name"
          placeholder="Enter your first name"
          type="text"
        />
        <ValidatedInput
          name="middle_name"
          placeholder="Enter your middle name"
          type="text"
          required={false}
        />
        <ValidatedInput
          name="last_name"
          placeholder="Enter your last name"
          type="text"
        />
        <ValidatedInput
          name="date_of_birth"
          placeholder="Enter your date of birth"
          type="date"
        />
      </div>
      <div className="button_container step-two">
        <Button onClick={onSave} disabled={!isValid} variant="contained">
          Save
        </Button>
      </div>
    </div>
  );
};
