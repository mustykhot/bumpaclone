import Modal from "components/Modal";
import { Button, IconButton } from "@mui/material";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import { CSSProperties, FormEvent, useEffect, useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useSendBVNOtpPinMutation } from "services";

export const generateId = () => Math.random().toString(36).substr(2, 9);

type propType = {
  openModal: boolean;
  closeModal: () => void;
  btnSuccessAction: () => void;
  btnFailureAction: () => void;
};

type ConfirmPinProps = {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  containerStyle?: CSSProperties;
  inputStyle?: CSSProperties;
  error?: boolean;
  confirmComplete: boolean;
  setConfirmedComplete: React.Dispatch<React.SetStateAction<boolean>>;
  confirmedPin?: any;
  setConfirmedPin: any;
  confirmError: boolean;
  setConfirmError: React.Dispatch<React.SetStateAction<boolean>>;
};

// confirm pin input
const ConfirmInput = ({
  length = 6,
  onChange = () => {},
  containerStyle,
  inputStyle,
  setConfirmedComplete,
  setConfirmedPin,
  confirmError,
}: ConfirmPinProps) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  // const [currentPin, setCurrentPin] = useState<string>();

  const updateConfirmedPin = (index: number, value: string) => {
    setOtp(otp.map((n, i) => (i === index ? value : n)));
  };

  useEffect(() => {
    onChange(otp.join(""));
    const enteredConfirmedPin = otp.join("");
    if (enteredConfirmedPin?.length == otp?.length) {
      setConfirmedComplete(true);
      setConfirmedPin(enteredConfirmedPin);
    }
  }, [otp]);
  const [inputIds] = useState(
    Array(length)
      .fill("")
      .map((_field) => generateId())
  );

  const otpInputs = Array(length)
    .fill("")
    .map(() => useRef(null));

  useEffect(() => {
    inputFocus(0);
  }, []);

  const handleInput = (
    value: string,
    index: number,
    e: FormEvent<HTMLInputElement>
  ) => {
    if (/\D/.test(value)) {
      if (value === "Backspace") {
        // delete the current input
        updateConfirmedPin(index, "");
        // if current input is empty, focus the previous input and delete it
        if (otp[index] === "" && index > 0) {
          updateConfirmedPin(index - 1, "");
          inputFocus(index - 1);
        }
      }
      return;
    }

    updateConfirmedPin(index, value);

    if (index !== otp?.length - 1) {
      inputFocus(index + 1);
    }
  };

  // @ts-ignore-next-line
  const inputFocus = (index: number) => otpInputs[index].current?.focus();

  return (
    <div style={{ ...containerStyle }} className="otp-input-wrap">
      {inputIds.map((id, index) => (
        <div
          style={{ ...inputStyle }}
          className={`input-container  ${confirmError ? "invalid" : ""}`}
          // className={`input-container `}
          key={`otp-input-${id}`}
          onClick={() => inputFocus(index)}
        >
          <input
            maxLength={1}
            id={id}
            ref={otpInputs[index]}
            value={otp[index]}
            onKeyDown={(e) => handleInput(e.key, index, e)}
          />
        </div>
      ))}
    </div>
  );
};

const BvnOtpVerification = ({
  closeModal,
  openModal,
  btnFailureAction,
  btnSuccessAction,
}: propType) => {
  const [confirmComplete, setConfirmedComplete] = useState(false);
  const [confirmedPin, setConfirmedPin] = useState<any>();
  const [confirmError, setConfirmError] = useState(false);
  const [sendBVNOtpPin, { isLoading }] = useSendBVNOtpPinMutation();

  // check if pins match
  const handlePin = async () => {
    try {
      const payload = {
        code: confirmedPin,
      };
      const result = await sendBVNOtpPin(payload);
      if ("data" in result) {
        btnSuccessAction();
      } else {
        btnFailureAction();
      }
    } catch (err) {
      btnFailureAction();
    }
  };

  return (
    <>
      <Modal
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="pin_wrap">
          <div className="" onClick={() => closeModal()}>
            <IconButton type="button" className="back_btn_wrap">
              <BackArrowIcon />
            </IconButton>
          </div>

          <div className="modal_body ">
            <h3>Verify Otp</h3>
            <p>Type the OTP code sent to you</p>
            {/* con component */}
            <ConfirmInput
              confirmComplete={confirmComplete}
              setConfirmedComplete={setConfirmedComplete}
              confirmedPin={confirmedPin}
              setConfirmedPin={setConfirmedPin}
              confirmError={confirmError}
              setConfirmError={setConfirmError}
            />

            <LoadingButton
              variant="contained"
              className="pin_btn"
              onClick={handlePin}
              disabled={!confirmComplete && confirmError}
              loading={isLoading}
            >
              Verify OTP
            </LoadingButton>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BvnOtpVerification;
