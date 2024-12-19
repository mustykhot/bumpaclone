import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import Modal from "components/Modal";
import { SuccessCheckLarge } from "assets/Icons/SuccessCheckLarge";
import { InfoType } from "../LinkTerminalModal";
import { handleTerminalSuccess } from "store/slice/TerminalSlice";
import { useAppDispatch } from "store/store.hooks";

type TerminalSuccessModalProps = {
  openModal: boolean;
  closeModal: () => void;
  info?: InfoType;
  from?: string;
};

export const TerminalSuccessModal = ({
  closeModal,
  openModal,
  info,
  from,
}: TerminalSuccessModalProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleContinue = () => {
    dispatch(handleTerminalSuccess());
    closeModal();

    if (!location.pathname.includes("/dashboard/payment-methods")) {
      navigate("/dashboard/payment-methods");
    }
  };

  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={closeModal}
        closeOnOverlayClick={false}
      >
        <div className="response_modal">
          <div className={`main ${from === "getTerminal" ? "" : "success"}`}>
            <SuccessCheckLarge />
            <div className="text">
              <h2>
                {from === "getTerminal"
                  ? "Terminal Account Created!"
                  : "Terminal Account Linked!"}
              </h2>
            </div>
            {from !== "getTerminal" && (
              <div className="info">
                <div className="info__each">
                  <p>Account number:</p>
                  <span>{info?.account_number ?? "12345678"}</span>
                </div>
                <div className="info__each">
                  <p>Account name:</p>
                  <span>{info?.account_name ?? "12345678"}</span>
                </div>
              </div>
            )}
            <div className="button_container">
              <Button
                onClick={handleContinue}
                variant="contained"
                className="primary primary_styled_button"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
