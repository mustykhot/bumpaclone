import Modal from "components/Modal";
import { Button, IconButton } from "@mui/material";
import "./style.scss"
import "./otpstyle.scss"
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import PinSuccessModal from "./PinSuccessModal";
import { CSSProperties, FormEvent, useEffect, useRef, useState } from "react";
import { useChangeTransactionPinMutation } from "services";
import { getCurrencyFnc, handleError } from "utils";
import { LoadingButton } from "@mui/lab";


export const generateId = () => Math.random().toString(36).substr(2, 9);

export type ChangePinFields = {
  old_pin: string;
  new_pin: string;
};

type propType = {
  openModal: boolean;
  closeModal: () => void;
  isSuccess: boolean;
  setIsSucess: React.Dispatch<React.SetStateAction<boolean>>;

};
type Props = {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  containerStyle?: CSSProperties;
  inputStyle?: CSSProperties;
  error?: boolean;
  pinError: boolean;
  setPinError: React.Dispatch<React.SetStateAction<boolean>>;
  lengthComplete: boolean;
  setLengthComplete: React.Dispatch<React.SetStateAction<boolean>>;
  oldPin: string,
  setOldPin: any;
};

type NewPinProps = {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  containerStyle?: CSSProperties;
  inputStyle?: CSSProperties;
  error?: boolean;
  isNewPinActive?: boolean;
  setIsNewPinActive?: React.Dispatch<React.SetStateAction<boolean>>;
  pinComplete: boolean;
  setPinComplete: React.Dispatch<React.SetStateAction<boolean>>;
  newWalletPin?: any;
  setNewWalletPin: any;

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
  onPinSubmit?: any,

};
// old pin input
const OtpInput = ({
  length = 4,
  onChange = () => { },
  error,
  pinError,
  setPinError,
  containerStyle,
  inputStyle,
  lengthComplete,
  setLengthComplete,
  oldPin,
  setOldPin
}: Props) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  // const [currentPin, setCurrentPin] = useState<string>();


  const updateOtp = (index: number, value: string) => {
    setOtp(otp.map((n, i) => (i === index ? value : n)));
  };

  useEffect(() => {
    onChange(otp.join(""));
    const enteredPin = otp.join("");
    if (enteredPin.length == otp.length) {
      setLengthComplete(true)
      setOldPin(enteredPin)
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
        updateOtp(index, "");
        // if current input is empty, focus the previous input and delete it
        if (otp[index] === "" && index > 0) {
          updateOtp(index - 1, "");
          inputFocus(index - 1);
        }
      }
      return;
    }

    updateOtp(index, value);

    if (index !== otp.length - 1) {
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
          // className={`input-container  ${pinError ? "invalid" : ""}`}
          className={`input-container `}
          key={`otp-input-${id}`}
          onClick={() => inputFocus(index)}
        >
          <input
            maxLength={1}
            id={id}
            ref={otpInputs[index]}
            value={otp[index]}
            onKeyDown={(e) => handleInput(e.key, index, e)}
            type="password"
          />
        </div>
      ))}
    </div>
  );
};

// new pin inout
const NewPinInput = ({
  length = 4,
  onChange = () => { },
  error,
  pinComplete,
  setPinComplete,
  containerStyle,
  inputStyle,
  isNewPinActive,
  setIsNewPinActive,
  newWalletPin,
  setNewWalletPin,
  // onPinSubmit
}: NewPinProps) => {
  const [newPin, setNewPin] = useState<string[]>(Array(length).fill(""));

  const updateNewPin = (index: number, value: string) => {
    setNewPin(newPin.map((n, i) => (i === index ? value : n)));
  };

  useEffect(() => {
    onChange(newPin.join(""));
    const enteredNewPin = newPin.join("");
    if (enteredNewPin.length == newPin.length) {
      setPinComplete(true)
      setNewWalletPin(enteredNewPin)
    }
  }, [newPin]);
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
        updateNewPin(index, "");
        // if current input is empty, focus the previous input and delete it
        if (newPin[index] === "" && index > 0) {
          updateNewPin(index - 1, "");
          inputFocus(index - 1);
        }
      }
      return;
    }

    updateNewPin(index, value);

    if (index !== newPin.length - 1) {
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
          className={`input-container  ${error ? "invalid" : ""}`}
          key={`otp-input-${id}`}
          onClick={() => inputFocus(index)}
        >
          <input
            maxLength={1}
            id={id}
            ref={otpInputs[index]}
            value={newPin[index]}
            onKeyDown={(e) => handleInput(e.key, index, e)}
            type="password"
          />
        </div>
      ))}
    </div>
  );
};

// confirm pin input
const ConfirmInput = ({
  length = 4,
  onChange = () => { },
  error,
  containerStyle,
  inputStyle,
  confirmComplete,
  setConfirmedComplete,
  confirmedPin,
  setConfirmedPin,
  confirmError,
  setConfirmError,
  onPinSubmit,
}: ConfirmPinProps) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  // const [currentPin, setCurrentPin] = useState<string>();


  const updateConfirmedPin = (index: number, value: string) => {
    setOtp(otp.map((n, i) => (i === index ? value : n)));
  };

  useEffect(() => {
    onChange(otp.join(""));
    const enteredConfirmedPin = otp.join("");
    if (enteredConfirmedPin.length == otp.length) {
      setConfirmedComplete(true)
      setConfirmedPin(enteredConfirmedPin)
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

    if (index !== otp.length - 1) {
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
            type="password"
          />
        </div>
      ))}
    </div>
  );
};
const UpdatePinModal = ({
  closeModal,
  openModal,
  isSuccess,
  setIsSucess
}: propType) => {

  const [showPinSuccess, setShowPinSuccess] = useState(false)
  const [pinError, setPinError] = useState(false);
  const [showNewPinInput, setshowNewPinInput] = useState(false);
  const [showCurrentInput, setShowCurrentInput] = useState(true);
  const [lengthComplete, setLengthComplte] = useState(false);
  const [pinComplete, setPinComplete] = useState(false);
  const [newWalletPin, setNewWalletPin] = useState<any>();
  const [oldPin, setOldPin] = useState<string>("");
  const [confirmComplete, setConfirmedComplete] = useState(false);
  const [confirmedPin, setConfirmedPin] = useState<string>("");
  const [showConfirmedInput, setShowConfirmedInput] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  
  const [changePin, { isLoading }] = useChangeTransactionPinMutation();

  const handlePinSubmit = async () => {
    if (newWalletPin !== confirmedPin) {
      setConfirmError(true);
    } else {
      try {
        const result = await changePin({
          old_pin: oldPin, 
          new_pin: confirmedPin,
        });
  
        if ("data" in result) {
          setConfirmedComplete(true);
          setIsSucess(true)

        } else {
        handleError(result);

        }
      } catch (error) {
        handleError(error);

      }
    }
    
  };
  // SHOW NEW PIN INPUT
  const submitCurrentPin = () => {
    if (lengthComplete) {
      setshowNewPinInput(true)
      setShowCurrentInput(false)
    }
  }
  // show confirm input
  const handleNewPin = () => {
    if (pinComplete) {
      setShowConfirmedInput(true)
      setshowNewPinInput(false)
    }
  }


 
 
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
            <IconButton type="button" className="back_btn_wrap"
            >
              <BackArrowIcon />
            </IconButton>
          </div>
          {/* current PIN input */}
          {showCurrentInput && (
            <div className="modal_body ">
              <h3>Change PIN</h3>
              <p>Enter your current PIN</p>
              {/* otp component */}
              <OtpInput
                setPinError={setPinError}
                pinError={pinError}
                lengthComplete={lengthComplete}
                setLengthComplete={setLengthComplte}
                oldPin={oldPin}
                setOldPin={setOldPin}

              />

              <Button
                variant="contained"
                className="pin_btn"
                onClick={() => submitCurrentPin()}
                disabled={!lengthComplete}

              >
                Create PIN
              </Button>
            </div>
          )}


          {/* new pin input */}
          {showNewPinInput && (
            <div className="modal_body ">
              <h3>Change PIN</h3>
              <p>Enter New PIN</p>
              {/* otp component */}
              <NewPinInput
                newWalletPin={newWalletPin}
                setNewWalletPin={setNewWalletPin}
                pinComplete={pinComplete}
                setPinComplete={setPinComplete}
              />

              <Button
                variant="contained"
                className="pin_btn"
                onClick={handleNewPin}
                disabled={!pinComplete}
              >
                Create PIN
              </Button>
            </div>
          )}

          {/* confirm newpin input */}
          {showConfirmedInput && (
            <div className="modal_body ">
              <h3>Change PIN</h3>
              <p>Confirm your new PIN</p>
              {/* confirm component */}
              <ConfirmInput
                confirmComplete={confirmComplete}
                setConfirmedComplete={setConfirmedComplete}
                confirmedPin={confirmedPin}
                setConfirmedPin={setConfirmedPin}
                confirmError={confirmError}
                setConfirmError={setConfirmError}
                onPinSubmit={handlePinSubmit} // Pass the callback function

              />
              {confirmError && (
                <p className="modal_error">PIN doesn’t match. Try again.</p>
              )}
              <LoadingButton
                variant="contained"
                className="pin_btn"
                onClick={handlePinSubmit}
                disabled={!confirmComplete && confirmError}
                loading={isLoading}

              >
                Create PIN
              </LoadingButton>
            </div>
          )}
        </div>
      </Modal>
      {/* {showPinSuccess && (
        <PinSuccessModal
          openModal={showPinSuccess}
          closeModal={() => setShowPinSuccess(false)}
        />
      )} */}
    </>

  );
};

export default UpdatePinModal;
