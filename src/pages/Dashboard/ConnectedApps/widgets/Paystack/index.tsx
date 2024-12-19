import { Button, Checkbox, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { CheckedCircleIcon } from "assets/Icons/CheckedCircleIcon";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { LinkBrokenIcon } from "assets/Icons/LinkBrokenIcon";
import { LinkIcon } from "assets/Icons/LinkIcon";
import paystack from "assets/images/paystack1.png";
import Loader from "components/Loader";
import { BootstrapTooltip } from "pages/Dashboard/Transactions/TransactionHistoryTable";
import { useTransactionChargeMutation } from "services";
import { PaymentMethodsResponse } from "services/api.types";
import { handleError } from "utils";
import { PaystackWarningModal } from "./PaystackWarningModal";

type PaystackProps = {
  savePaymentFnc: (body: {
    paystack: boolean;
    bank_transfer: boolean;
    terminal: boolean;
    callback?: () => void;
  }) => void;
  loadSave: boolean;
  data?: PaymentMethodsResponse;
};

export const Paystack = ({ data, savePaymentFnc }: PaystackProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(
    data?.data.online.paystack.enabled || false
  );
  const [showDisconnectButton, setShowDisconnectButton] = useState(false);
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const [chargeChecked, setChargeChecked] = useState(
    data?.data.online.paystack.charge_customer || false
  );
  const [transactionCharge, { isLoading }] = useTransactionChargeMutation();

  const handleTransactionCharge = async (check: boolean) => {
    try {
      const result = await transactionCharge({
        charge_customer: check,
        channel: "paystack",
        enabled: data?.data?.online?.paystack?.enabled || true,
      });
      if ("data" in result) {
        setChargeChecked(check);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleDisconnect = () => {
    setOpenWarningModal(true);
  };

  const handleConfirmDisconnect = () => {
    savePaymentFnc({
      paystack: false,
      bank_transfer: data?.data.offline.bank_transfer.enabled || false,
      terminal: data?.data.offline.terminal.enabled || false,
      callback: () => {
        setIsConnected(false);
        setOpenWarningModal(false);
      },
    });
  };

  const handleConnect = () => {
    savePaymentFnc({
      paystack: true,
      bank_transfer: data?.data.offline.bank_transfer.enabled || false,
      terminal: data?.data.offline.terminal.enabled || false,
      callback: () => setIsConnected(true),
    });
  };

  return (
    <>
      {isLoading && <Loader />}
      <div
        onMouseEnter={() => {
          setShowDisconnectButton(true);
        }}
        onMouseLeave={() => {
          setShowDisconnectButton(false);
        }}
        className="payment_method_container paystack"
      >
        <div className="title_flex">
          <div className="title_container">
            <img src={paystack} alt="app" className="app_image" />
            <h4>Paystack</h4>
          </div>
          {isConnected ? (
            showDisconnectButton ? (
              <Button
                startIcon={<LinkBrokenIcon />}
                className={`connect_button connected `}
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            ) : (
              <div className="connected_box">
                <CheckedCircleIcon /> <p>Connected</p>
              </div>
            )
          ) : (
            <Button
              startIcon={<LinkIcon />}
              className={`connect_button `}
              onClick={handleConnect}
            >
              Connect
            </Button>
          )}
        </div>
        <div className="main">
          <p className="description">
            Connect to recieve payments with paystack
          </p>
        </div>
        <p className="charge_container">
          <Checkbox
            checked={chargeChecked}
            onChange={(e) => {
              if (e.target.checked) {
                setChargeChecked(true);
                handleTransactionCharge(true);
              } else {
                setChargeChecked(false);
                handleTransactionCharge(false);
              }
            }}
          />
          <span className="pay">Customer pays 1.5% charges</span>
          <BootstrapTooltip
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -8],
                    },
                  },
                ],
              },
            }}
            title="This will transfer the 1.5% transaction charge to your customers on checkout."
            placement="top"
          >
            <IconButton>
              <InfoCircleIcon />
            </IconButton>
          </BootstrapTooltip>
        </p>
      </div>
      <PaystackWarningModal
        openModal={openWarningModal}
        closeModal={() => {
          setOpenWarningModal(false);
        }}
        btnAction={handleConfirmDisconnect}
      />
    </>
  );
};
