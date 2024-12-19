import { LoadingButton } from "@mui/lab";
import { useFormContext } from "react-hook-form";
import { MoodCheckIcon } from "assets/Icons/MoodCheckIcon";
import prembly from "assets/images/prembly.png";
import TierOne from "assets/images/TierOne.png";
import TierTwo from "assets/images/TierTwo.png";
import { SelectableCard } from "../KycComponents/SelectableCard/SelectableCard";

type StepFourProps = {
  selectedTier: number | null;
  setSelectedTier: (tier: number) => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
};

export const StepFour = ({
  selectedTier,
  setSelectedTier,
  onSubmit,
  isLoading,
}: StepFourProps) => {
  const { handleSubmit, setValue } = useFormContext();

  return (
    <div className="main four">
      <div className="mood-icon">
        <MoodCheckIcon />
      </div>
      <div className="header">
        <h2>Choose a tier to get started</h2>
        <p className="description">
          Due to recent regulatory requirements from the Central Bank of
          Nigeria, all Bumpa Users are required to verify their identity before
          receiving settlement.
        </p>
      </div>
      <div className="options">
        <SelectableCard
          option={{
            image: TierOne,
            limit: "₦300,000",
            requiredDocs: ["BVN", "NIN"],
            value: 1,
          }}
          isSelected={selectedTier === 1}
          onSelect={(value) => {
            setSelectedTier(value);
            setValue("desired_kyc_tier", value);
          }}
        />
        <SelectableCard
          option={{
            image: TierTwo,
            limit: "Unlimited",
            requiredDocs: ["BVN", "NIN", "CAC Verification"],
            value: 2,
          }}
          isSelected={selectedTier === 2}
          onSelect={(value) => {
            setSelectedTier(value);
            setValue("desired_kyc_tier", value);
          }}
        />
      </div>
      <div className="button_container step-two">
        <LoadingButton
          onClick={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading || selectedTier === null}
          variant="contained"
        >
          Save and Continue
        </LoadingButton>
      </div>
      <div className="powered-by">
        <h4>Powered by</h4>
        <img src={prembly} alt="Prembly" />
      </div>
    </div>
  );
};
