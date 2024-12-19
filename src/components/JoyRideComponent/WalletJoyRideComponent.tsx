import { useState, useRef } from "react";
import Joyride, { TooltipRenderProps, CallBackProps } from "react-joyride";
import { ElementType } from "react";
import { ToolTipComponent } from "./tooltip";
import "./style.scss";
import { useAppDispatch } from "store/store.hooks";
import {  setIsWalletTour,  } from "store/slice/NotificationSlice";
import MyBankDetailsModal from "pages/Dashboard/Wallet/WalletModals/BankModal/ViewDetailsModal";
type JoyRideProps = {
  step: number;
  isStart: boolean;
  setIsStart: (value: boolean) => void;
  setStep: (value: number) => void;
};

export const WalletJoyRideComponent = ({
  step,
  isStart,
  setIsStart,
  setStep,
}: JoyRideProps) => {
  const dispatch = useAppDispatch();
  const handleCallback = (data: CallBackProps) => {
    const { action } = data;
    if (action === "skip" || action === "reset") {
      dispatch(setIsWalletTour(false));
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleOkayButtonClick = () => {
    setShowModal(true);
    dispatch(setIsWalletTour(false))
  };
  return (
    <>
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
      // tooltipComponent={ToolTipComponent as ElementType<TooltipRenderProps>}
      tooltipComponent={(props) => (
        <ToolTipComponent
          {...props}
          onOkayButtonClick={handleOkayButtonClick}
        />
      )}
      steps={[
        {
          target: "#first_wallet_tour_step",
          title: "Wallet settings",
          content:
            "Here you can change your PIN, set transaction limit and more",
          disableBeacon: true,
          placement: "auto",
        },
        {
          target: "#second_wallet_tour_step",
          title: "Request Payment",
          content:
            "Send payment requests right from inside your wallet to make collecting payment a smooth experience",
          disableBeacon: true,
          placement: "auto",
        },
        {
          target: "#third_wallet_tour_step",
          title: "Withdraw to bank account",
          content: "Withdraw money from your wallet to personal bank account.",
          disableBeacon: true,
          placement: "auto",
        },
       
      ]}
    />
    <MyBankDetailsModal 
      openModal={showModal}
      closeModal={() => setShowModal(false)}
    />
    </>
    
  );
};
