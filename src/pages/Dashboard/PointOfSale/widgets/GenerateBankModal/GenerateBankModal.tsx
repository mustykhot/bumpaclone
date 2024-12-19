import Modal from "components/Modal";
import { Button, Checkbox, CircularProgress, IconButton } from "@mui/material";
import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { useState } from "react";
import QRCode from "react-qr-code";
import check_circle from "assets/images/checkcircle.png";
import { useAppDispatch } from "store/store.hooks";
import { setBankPaymentRecieved } from "store/slice/PosSlice";
import { ArrowRightIcon } from "assets/Icons/ArrowRightIcon";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  dispatchAction: () => void;
};
const GenerateBankModal = ({
  closeModal,
  openModal,
  dispatchAction,
}: propType) => {
  const [step, setStep] = useState(2);
  const [checked, setChecked] = useState(false);
  return (
    <>
      <Modal
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
        closeOnOverlayClick={false}
      >
        <div className="generate_bank_account_modal_wrap">
          {step === 1 && (
            <div className="loading_generating container_with_padding">
              <div className="close_btn">
                <p className="modal_title"></p>
                <IconButton
                  onClick={() => {
                    setStep(1);
                    closeModal();
                  }}
                  type="button"
                  className="close_btn_wrap"
                >
                  <CloseSqIcon />
                </IconButton>
              </div>

              <div className="loader_side">
                <CircularProgress size="6rem" />
                <p>
                  Generating bank account number. This should only take a few
                  seconds.
                </p>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="show_bank_details_box">
              <div className="title_details">
                <IconButton
                  onClick={() => {
                    setStep(2);
                    closeModal();
                  }}
                  type="button"
                  className="close_btn_wrap"
                >
                  <ArrowRightIcon stroke="#ffffff" />
                </IconButton>
                <p className="pay">Pay with Bank Transfer</p>
              </div>
              <div className="display_bank">
                <p className="feint">Bank Name</p>
                <p className="large">ACCESS BANK</p>
                <p className="feint">Account Name</p>
                <p className="large">REMISTER FASHION</p>
                <div className="account_number">
                  <p className="feint">Account Number</p>
                  <p className="large xl">1234930249</p>
                </div>
              </div>
              <div className="qr_section">
                <div className="qr_box">
                  <QRCode
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={`https://${
                      window.location.host
                    }/bank?accountNumber=${1232}&accountName=${"raji"}&bankName=${"Zenith"}`}
                  />
                </div>
                <div className="text_area">
                  <p className="customer">Customer can’t transfer?</p>
                  <p className="ask">
                    Ask them to scan the QR code below to pay with Card, USSD,
                    or Apple Pay.
                  </p>
                </div>
              </div>

              <div className="waiting_box">
                <Checkbox
                  checked={checked}
                  onChange={(e: any) => {
                    setChecked(e.target.checked);
                  }}
                />
                <p> I’ve received payment.</p>
              </div>
              {/* <div className="single_loader">
                <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
              </div> */}
              {checked ? (
                <Button className="white_button">Continue</Button>
              ) : (
                <Button
                  className="skip_btn"
                  onClick={() => {
                    // dispatch(setBankPaymentRecieved("yes"));
                    dispatchAction();
                    setStep(2);
                    closeModal();
                  }}
                >
                  Skip, I’ve received payment
                </Button>
              )}
            </div>
          )}
          {step === 3 && (
            <div className="success_side container_with_padding">
              <img
                src={check_circle}
                alt=""
                style={{
                  margin: "auto",
                  marginTop: "24px",
                  marginBottom: "24px",
                }}
              />
              <h3>Payment Received</h3>
              <p>You have received a payment of N100,000 from Solomon Elijah</p>
              <div className="btns">
                <Button
                  onClick={() => {
                    dispatchAction();
                    setStep(2);
                    closeModal();
                  }}
                  variant="contained"
                  className="view_order_btn primary_styled_button"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default GenerateBankModal;
