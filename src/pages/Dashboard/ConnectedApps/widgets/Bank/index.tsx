import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { CheckedCircleIcon } from "assets/Icons/CheckedCircleIcon";
import { LinkBrokenIcon } from "assets/Icons/LinkBrokenIcon";
import { LinkIcon } from "assets/Icons/LinkIcon";
import bank from "assets/images/bank.png";
import { PaymentMethodsResponse } from "services/api.types";
import { BankWarningModal } from "./BankWarningModal";

type BankProps = {
  savePaymentFnc: (body: {
    paystack: boolean;
    bank_transfer: boolean;
    terminal: boolean;
    callback?: () => void;
  }) => void;
  loadSave: boolean;
  data?: PaymentMethodsResponse;
};

export const Bank = ({ data, savePaymentFnc }: BankProps) => {
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean>(
    data?.data.offline.bank_transfer.enabled || false
  );

  const handleConnectDisconnect = () => {
    if (isConnected) {
      savePaymentFnc({
        paystack: data?.data.online.paystack.enabled || false,
        terminal: data?.data.offline.terminal.enabled || false,
        bank_transfer: false,
        callback: () => setIsConnected(false),
      });
    } else {
      setOpenWarningModal(true);
    }
  };

  const handleConfirmConnect = () => {
    savePaymentFnc({
      paystack: data?.data.online.paystack.enabled || false,
      terminal: data?.data.offline.terminal.enabled || false,
      bank_transfer: true,
      callback: () => {
        setIsConnected(true);
        setOpenWarningModal(false);
      },
    });
  };

  return (
    <>
      <div className="payment_method_container bank">
        <div className="title_flex">
          <div className="title_container">
            <img src={bank} alt="app" className="app_image" />
            <h4>Bank Transfer</h4>
          </div>
          {isConnected && (
            <div className="connected_box">
              <CheckedCircleIcon /> <p>Connected</p>
            </div>
          )}
        </div>
        <div className="main">
          <p className="description">Collect payments via bank transfer</p>
          <Button
            startIcon={isConnected ? <LinkBrokenIcon /> : <LinkIcon />}
            className={`connect_button ${isConnected ? "connected" : ""} bank`}
            onClick={handleConnectDisconnect}
          >
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
        </div>
      </div>
      <BankWarningModal
        openModal={openWarningModal}
        closeModal={() => setOpenWarningModal(false)}
        btnAction={handleConfirmConnect}
      />
    </>
  );
};
