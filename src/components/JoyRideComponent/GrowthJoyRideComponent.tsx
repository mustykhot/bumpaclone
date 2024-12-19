import Joyride, { TooltipRenderProps, CallBackProps } from "react-joyride";
import { ElementType } from "react";
import { ToolTipComponent } from "./tooltip";
import "./style.scss";
import { useAppDispatch } from "store/store.hooks";
import { setIsGrowthTour } from "store/slice/NotificationSlice";

type JoyRideProps = {
  step: number;
  isStart: boolean;
  setIsStart: (value: boolean) => void;
  setStep: (value: number) => void;
};

export const GrowthJoyRideComponent = ({
  step,
  isStart,
  setIsStart,
  setStep,
}: JoyRideProps) => {
  const dispatch = useAppDispatch();
  const handleCallback = (data: CallBackProps) => {
    const { action } = data;
    if (action === "skip" || action === "reset") {
      dispatch(setIsGrowthTour(false));
    }
  };

  return (
    <Joyride
      run={isStart}
      styles={{
        options: {
          overlayColor: "rgba(0, 0, 0, 0.2)",
        },
        spotlight: {
          top: -20,
        },
      }}
      continuous={true}
      callback={handleCallback}
      showProgress={true}
      disableScrolling={false}
      tooltipComponent={ToolTipComponent as ElementType<TooltipRenderProps>}
      steps={[
        {
          target: "#first_growth_tour_step",
          title: "Point of Sale",
          content:
            "Use the Point of Sale feature for fast order processing in your physical store here.",
          disableBeacon: true,
          placement: "bottom",
        },
        {
          target: "#second_growth_tour_step",
          title: "Store Locations",
          content:
            "Add & Manage inventory & orders across multiple locations here.",
          disableBeacon: true,
          placement: "left",
        },
      ]}
    />
  );
};
