import { Button } from "@mui/material";
import { useFormContext } from "react-hook-form";

type StepOneProps = {
  onContinue: () => void;
  onUpdate: () => void;
};

export const StepOne = ({ onContinue, onUpdate }: StepOneProps) => {
  const { watch } = useFormContext();
  const businessName = watch("business_name");

  return (
    <div className="main one">
      <div className="header">
        <h2>Review Your Business Name</h2>
        <p className="description">
          Please note that in order to successfully verify your CAC, the
          business name on your Bumpa account must match the name on your CAC
          certificate.
        </p>
      </div>
      <div className="info">
        <p className="description">
          Below is the business name of your Bumpa account
        </p>
        <div className="box">
          <div className="box_text">
            <p>
              Business Name: <br />
              <span>{businessName ? businessName : "N/A"}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="button_container">
        {businessName && (
          <Button
            onClick={onContinue}
            variant="contained"
            className="primary primary_styled_button"
          >
            Continue
          </Button>
        )}
        <Button variant="outlined" onClick={onUpdate}>
          Update Business Name
        </Button>
      </div>
    </div>
  );
};
