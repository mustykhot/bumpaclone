import { Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageTerminalModal.scss";
import { BumpaIcon } from "assets/Icons/BumpaIcon";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { ChevronRight } from "assets/Icons/ChevronRight";
import { CopyIcon } from "assets/Icons/CopyIcon";
import paystack from "assets/images/paystack.png";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { useCopyToClipboardHook } from "hooks/useCopyToClipboardHook";
import { handleError } from "utils";

type ModalProps = {
  openModal: boolean;
  closeModal: () => void;
  terminalInfo: any;
  setOpenManageWhatsappModal: (state: boolean) => void;
};

export const ManageTerminalModal = ({
  openModal,
  closeModal,
  terminalInfo,
  setOpenManageWhatsappModal,
}: ModalProps) => {
  const navigate = useNavigate();
  const { handleCopyClick } = useCopyToClipboardHook(
    terminalInfo?.data?.account_number
  );

  const [showChargesSection, setShowChargesSection] = useState(false);

  const handleDownloadTerminalBanner = async (imageSrc: string) => {
    if (imageSrc) {
      try {
        const imgBlob = await fetch(imageSrc).then((response) =>
          response.blob()
        );
        const link = document.createElement("a");
        link.href = URL.createObjectURL(imgBlob);
        link.download = "Terminal Banner.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } catch (error) {
        handleError(error);
      }
    }
  };

  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children manage_terminal_modal">
          <div className="top_section">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              title="Bumpa Terminal"
              className="terminal_top"
            />
            <div className="terminal_modal_body">
              <div className="details_section">
                <div className="details_section--header">
                  <BumpaIcon />
                  <h3>Terminal Account Details</h3>
                </div>
                <div className="details_section--box">
                  <div className="details_section--info">
                    <div className="details_section--info__each">
                      <p>Bank Name</p>
                      <span>{terminalInfo?.data?.bank_name}</span>
                    </div>
                    <div className="details_section--info__each">
                      <p>Account Name</p>
                      <span>{terminalInfo?.data?.account_name}</span>
                    </div>
                    <div className="details_section--info__each">
                      <p>Account Number</p>
                      <span>{terminalInfo?.data?.account_number}</span>
                    </div>
                    <Button
                      className="copy_wrapper"
                      onClick={() => {
                        handleCopyClick();
                      }}
                    >
                      <CopyIcon className="copy_icon" />
                      <span>Click to copy your account number</span>
                    </Button>
                  </div>
                </div>
                <p className="about">
                  Use this account number to receive payments from your
                  customers in-store.
                </p>
                <Button
                  className="charges"
                  onClick={() => setShowChargesSection(!showChargesSection)}
                >
                  View transaction charges{" "}
                  {showChargesSection ? (
                    <ChevronDownIcon stroke="#009444" />
                  ) : (
                    <ChevronDownIcon stroke="#009444" />
                  )}
                </Button>
                {showChargesSection && (
                  <div className="charges_section">
                    <div className="charges_section--main">
                      <h4>Transaction Charges</h4>
                      <div className="charges_section--pricing">
                        <div className="charges_section--pricing_each">
                          <p>For transactions below ₦1000</p>
                          <h5>₦50</h5>
                        </div>
                        <div className="charges_section--pricing_each">
                          <p>For transactions below ₦5000</p>
                          <h5>₦75</h5>
                        </div>
                        <div className="charges_section--pricing_each">
                          <p>For transactions ₦5000 & above</p>
                          <h5>₦100</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="whatsapp_section">
                <Button
                  onClick={() => {
                    setOpenManageWhatsappModal(true);
                  }}
                >
                  <h4>Manage WhatsApp Numbers</h4>
                  <ChevronRight />
                </Button>
              </div>
              <div className="transactions_section">
                <Button
                  onClick={() => {
                    navigate("/dashboard/transactions?fromTerminal=true");
                  }}
                >
                  <h4>View Transactions</h4>
                </Button>
              </div>
              <div className="download_section">
                <Button
                  onClick={() => {
                    handleDownloadTerminalBanner(terminalInfo?.data?.banner);
                  }}
                >
                  <h4>Download Terminal Poster</h4>
                </Button>
              </div>
            </div>
          </div>
          <div className="bottom_section">
            <p>
              Want to learn more about Bumpa Terminal?{" "}
              <a target="_blank" href="https://terminal.getbumpa.com/">
                Click here
              </a>
            </p>
            <div className="powered-by">
              <h4>Powered by</h4>
              <img src={paystack} alt="Paystack" />
            </div>
          </div>
        </div>
      </ModalRight>
    </>
  );
};
