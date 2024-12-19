import Modal from "components/Modal";
import { Button, IconButton } from "@mui/material";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import { CSSProperties, FormEvent, useEffect, useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useCreateTransactionPinMutation } from "services";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";

export const generateId = () => Math.random().toString(36).substr(2, 9);

type propType = {
  openModal: boolean;
  closeModal: () => void;
  btnAction: () => void;
};
type Props = {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  containerStyle?: CSSProperties;
  inputStyle?: CSSProperties;
  error?: boolean;
  isCreatePinActive: boolean;
  setIsCreatePinActive: React.Dispatch<React.SetStateAction<boolean>>;
  pinError: boolean;
  setPinError: React.Dispatch<React.SetStateAction<boolean>>;
  lengthComplete: boolean;
  setLengthComplete: React.Dispatch<React.SetStateAction<boolean>>;
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
};

// new pin inout
const NewPinInput = ({
  length = 4,
  onChange = () => {},
  error,
  pinComplete,
  setPinComplete,
  containerStyle,
  inputStyle,
  isNewPinActive,
  setIsNewPinActive,
  newWalletPin,
  setNewWalletPin,
}: NewPinProps) => {
  const [newPin, setNewPin] = useState<string[]>(Array(length).fill(""));

  const updateNewPin = (index: number, value: string) => {
    setNewPin(newPin.map((n, i) => (i === index ? value : n)));
  };

  useEffect(() => {
    onChange(newPin.join(""));
    const enteredNewPin = newPin.join("");
    if (enteredNewPin?.length == newPin?.length) {
      setPinComplete(true);
      setNewWalletPin(enteredNewPin);
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

    if (index !== newPin?.length - 1) {
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
          />
        </div>
      ))}
    </div>
  );
};

// confirm pin input
const ConfirmInput = ({
  length = 4,
  onChange = () => {},
  error,
  containerStyle,
  inputStyle,
  confirmComplete,
  setConfirmedComplete,
  confirmedPin,
  setConfirmedPin,
  confirmError,
  setConfirmError,
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
const CreatePinModal = ({ closeModal, openModal, btnAction }: propType) => {
  const [showNewPinInput, setshowNewPinInput] = useState(true);
  const [pinComplete, setPinComplete] = useState(false);
  const [newWalletPin, setNewWalletPin] = useState<any>();
  const [confirmComplete, setConfirmedComplete] = useState(false);
  const [confirmedPin, setConfirmedPin] = useState<any>();
  const [showConfirmedInput, setShowConfirmedInput] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [createTransactionPin, { isLoading }] =
    useCreateTransactionPinMutation();

  // show confirm input
  const handleNewPin = () => {
    if (pinComplete) {
      setShowConfirmedInput(true);
      setshowNewPinInput(false);
    }
  };

  // check if pins match
  const handleConfirmPin = async () => {
    if (newWalletPin !== confirmedPin) {
      setConfirmError(true);
      showToast("ConfirmationPin does not match", "error");
    } else {
      try {
        const payload = {
          pin: confirmedPin,
        };
        const result = await createTransactionPin(payload);
        if ("data" in result) {
          btnAction();
        } else {
          handleError(result);
        }
      } catch (err) {
        handleError(err);
      }
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
          {/* current PIN input */}

          {/* new pin input */}
          {showNewPinInput && (
            <div className="modal_body ">
              <h3>Create PIN</h3>
              <p className="w-[70%] text-center">
                Set a PIN code to protect your Bumpa Wallet from unauthorised
                use
              </p>
              {/* otp component */}
              <NewPinInput
                newWalletPin={newWalletPin}
                setNewWalletPin={setNewWalletPin}
                pinComplete={pinComplete}
                setPinComplete={setPinComplete}
              />

              <LoadingButton
                variant="contained"
                className="pin_btn"
                onClick={handleNewPin}
                disabled={!pinComplete}
              >
                Confirm PIN
              </LoadingButton>
            </div>
          )}

          {/* confirm newpin input */}
          {showConfirmedInput && (
            <div className="modal_body ">
              <h3>Confirm PIN</h3>
              <p>Type your PIN code again to confirm</p>
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
                onClick={handleConfirmPin}
                disabled={!confirmComplete && confirmError}
                loading={isLoading}
              >
                Confirm PIN
              </LoadingButton>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default CreatePinModal;
