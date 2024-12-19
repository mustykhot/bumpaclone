import Joyride, { TooltipRenderProps, CallBackProps } from "react-joyride";
import { ElementType } from "react";
import { ToolTipComponent } from "./tooltip";
import "./style.scss";
import { useAppDispatch } from "store/store.hooks";
import { setIsTour } from "store/slice/NotificationSlice";

type JoyRideProps = {
  step: number;
  isStart: boolean;
  setIsStart: (value: boolean) => void;
  setStep: (value: number) => void;
};

export const JoyRideComponent = ({
  step,
  isStart,
  setIsStart,
  setStep,
}: JoyRideProps) => {
  const dispatch = useAppDispatch();
  const handleCallback = (data: CallBackProps) => {
    const { action } = data;
    if (action === "skip" || action === "reset" || action === "close") {
      setIsStart(false);
      setStep(0);
      dispatch(setIsTour(false));
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
          target: "#first_tour_step",
          title: "Record Sales & Create Invoices",
          content:
            "View Online Orders, Record Sales, Create Invoices/Receipts & Process Orders by Marking as Paid, Delivered etc here.",
          disableBeacon: true,
          placement: "right",
        },
        {
          target: "#second_tour_step",
          title: "Add Products To Your Website",
          content:
            "Add Products with different variations like Size, Color, Quantity & categorize them into Collections here.",
          disableBeacon: true,
          placement: "right",
        },
        {
          target: "#third_tour_step",
          title: "Message Customers",
          content: "Send marketing emails & bulk SMS to your customers here.",
          disableBeacon: true,
          placement: "right",
        },
        {
          target: "#fourth_tour_step",
          title: "Record Customer Details",
          content:
            "Save or find your customers contact details & preferences here.",
          disableBeacon: true,
          placement: "right",
        },
        {
          target: "#fifth_tour_step",
          title: "Do More With Bumpa",
          content:
            "Connect Shipping Companies, Get Custom Domain, Website Customisation, Add Staff, Multilocations etc here.",
          disableBeacon: true,
          placement: "right",
        },
        {
          target: "#sixth_tour_step",
          title: "Quick Actions",
          content: `Do tasks quickly or get help through support@getbumpa.com or Bumpa Chat from 9 am to 5 pm everyday.`,
          disableBeacon: true,
          placement: "bottom",
        },
        {
          target: "#seventh_tour_step",
          title: "Your website is almost ready!",
          content:
            "You have a website now! Add Products, customize your website & you’re ready to launch.",
          disableBeacon: true,
          placement: "bottom",
        },
      ]}
    />
  );
};
