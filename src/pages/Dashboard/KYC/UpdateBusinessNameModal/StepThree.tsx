import { Button } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { HelpCircleIcon } from "assets/Icons/HelpCircleIcon";
import { LoadingButton } from "@mui/lab";

type StepThreeProps = {
  onCancel: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
};

export const StepThree = ({
  onCancel,
  onSubmit,
  isLoading,
}: StepThreeProps) => {
  const { getValues, handleSubmit } = useFormContext();

  return (
    <div className="main three">
      <div className="icon">
        <HelpCircleIcon />
      </div>
      <div className="change">
        <h2>Update Business Name</h2>
        <p className="description">
          Are you sure you want to update your business name to{" "}
          <span>{getValues("business_name")}</span>?
        </p>
      </div>
      <div className="button_container step-three">
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <LoadingButton
          onClick={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
          variant="contained"
        >
          Save and Continue
        </LoadingButton>
      </div>
    </div>
  );
};
