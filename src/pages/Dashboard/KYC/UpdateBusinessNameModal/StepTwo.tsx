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
        <h2>Update Business Name</h2>
        <p className="description">
          Update your business name to match the name on your CAC Certificate.
        </p>
      </div>
      <div className="form">
        <ValidatedInput
          name="business_name"
          placeholder="Enter business name"
          type="text"
          required
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
