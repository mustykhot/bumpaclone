import Joyride, { CallBackProps } from "react-joyride";
import { ToolTipComponent } from "./tooltip";
import { useAppDispatch } from "store/store.hooks";
import { setIsPaymentMethodsTour } from "store/slice/NotificationSlice";

type PaymentMethodsJoyRideComponentProps = {
  step: number;
  isStart: boolean;
  setIsStart: (value: boolean) => void;
  setStep: (value: number) => void;
  from: string;
  updateAppFlag: () => void;
};

export const PaymentMethodsJoyRideComponent = ({
  step,
  isStart,
  setIsStart,
  setStep,
  from,
  updateAppFlag,
}: PaymentMethodsJoyRideComponentProps) => {
  const dispatch = useAppDispatch();

  const handleOkayButtonClick = () => {
    updateAppFlag();
    setIsStart(false);
    setStep(0);
    dispatch(setIsPaymentMethodsTour(false));
  };

  const handleCallback = (data: CallBackProps) => {
    const { action } = data;
    if (action === "skip" || action === "stop") {
      handleOkayButtonClick();
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
      tooltipComponent={(props) => (
        <ToolTipComponent
          {...props}
          from={from}
          onOkayButtonClick={handleOkayButtonClick}
        />
      )}
      steps={[
        {
          target: "#payment_methods_tour_step",
          title: "Payments Method",
          content:
            "We’ve separated payments methods from connected apps to give you more control of your payment.",
          disableBeacon: true,
          placement: "right",
        },
      ]}
    />
  );
};
