import { Button } from "@mui/material";
import { useCopyToClipboardHook } from "hooks/useCopyToClipboardHook";
import { useLocation } from "react-router-dom";
import "./style.scss";
const BankPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const accountName = searchParams.get("accountName");
  const accountNumber = searchParams.get("accountNumber");
  const bankName = searchParams.get("bankName");
  const { isCopied, handleCopyClick } = useCopyToClipboardHook(
    `${accountNumber}`
  );
  return (
    <div className="pd_view_bank_details">
      <div className="cover_all">
        <p>Bank Name: {bankName}</p>
        <div className="number_side">
          <p>Account Number: {accountNumber}</p>
          <Button
            onClick={() => {
              handleCopyClick();
            }}
            variant="contained"
            className="primary_styled_button"
          >
            {isCopied ? "Copied" : "Click to Copy Account Number"}
          </Button>
        </div>
        <p> Account Name : {accountName}</p>
      </div>
    </div>
  );
};

export default BankPage;
