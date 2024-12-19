import { Button, IconButton } from "@mui/material";
import { useState } from "react";
import { TooltipRenderProps } from "react-joyride";
import { useLocation } from "react-router-dom";
import { ClearIcon } from "assets/Icons/ClearIcon";
import MyBankDetailsModal from "pages/Dashboard/Wallet/WalletModals/BankModal/ViewDetailsModal";

interface AdditionalProps {
  onOkayButtonClick: () => void;
  from?: string;
}
export const ToolTipComponent = ({
  index,
  step,
  skipProps,
  isLastStep,
  primaryProps,
  tooltipProps,
  backProps,
  onOkayButtonClick,
  from,
}: TooltipRenderProps & AdditionalProps) => {
  const location = useLocation();
  const [showBankDetails, setshowBankDetails] = useState(false);

  const isWalletPage = location.pathname.includes("dashboard/wallet");

  const handleOkayButtonClick = () => {
    onOkayButtonClick();
  };

  // const showMyBankDetails = () => {
  //   if (isWalletPage) {
  //     if(btnTxt == "Okay"){
  //       setshowBankDetails(true)
  //     }
  //   }
  // }

  return (
    <>
      <div
        {...tooltipProps}
        className={`${
          from === "update" ? "pd_update_tooltip_card" : "pd_tooltip_card"
        }`}
      >
        {from === "update" && (
          <div className="header">
            <p>New on this page</p>
          </div>
        )}
        <div className="main">
          <p className="title">{step.title}</p>
          <p className="description">{step.content}</p>
          <div className="button_box">
            <div>
              {index !== 0 && (
                <Button {...backProps} className="back_btn" variant="outlined">
                  Back
                </Button>
              )}
            </div>
            {!isLastStep && (
              <Button
                {...primaryProps}
                className="primary_styled_button"
                variant="contained"
              >
                Next
              </Button>
            )}
            {isLastStep && !isWalletPage && from !== "update" && (
              <Button
                {...primaryProps}
                className="primary_styled_button"
                variant="contained"
              >
                Finish
              </Button>
            )}
            {isLastStep && (isWalletPage || from === "update") && (
              <Button
                {...primaryProps}
                className="primary_styled_button"
                variant="contained"
                onClick={handleOkayButtonClick}
              >
                Okay
              </Button>
            )}
          </div>
        </div>
        <IconButton
          sx={{
            backgroundColor: "#EFF2F6",
          }}
          {...skipProps}
          className="closebtn"
        >
          <ClearIcon />
        </IconButton>
      </div>
    </>
  );
};
