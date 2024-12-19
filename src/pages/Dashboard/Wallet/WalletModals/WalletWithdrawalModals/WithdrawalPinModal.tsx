import Modal from "components/Modal";
import { IconButton } from "@mui/material";
import "./style.scss"
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import { CSSProperties, FormEvent, useEffect, useRef, useState } from "react";
import WithdrawalPinSuccessModal from "./WithdrawalPinSuccessModal";
import WithdrawalFailedModal from "./WithdrawalFailedModal";
import { handleError } from "utils";
import { useAppSelector } from "store/store.hooks";
import { selectWithdrawalDetails } from "store/slice/WalletSlice";
import { useInitiateWithdrawalMutation } from "services";
import { LoadingButton } from "@mui/lab";

export const generateId = () => Math.random().toString(36).substr(2, 9);
const oldPin = 1234;

type RecipientType = {
    bank_name: string
    account_number: string
}

export type WithdrawalDetailsType = {
    amount: number
    fees: number
    created_at: string
    updated_at: string
    status: string
    recipient: RecipientType
}

type propType = {
    openModal: boolean;
    closeModal: () => void;
    isCreatePinActive?: boolean;

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
    confirmedPin?: any;
    setConfirmedPin?: any;
    setLengthComplete: React.Dispatch<React.SetStateAction<boolean>>;
};



// current pin input
const OtpInput = ({
    length = 4,
    onChange = () => { },
    error,
    pinError,
    setPinError,
    containerStyle,
    inputStyle,
    isCreatePinActive,
    setIsCreatePinActive,
    lengthComplete,
    confirmedPin,
    setConfirmedPin,
    setLengthComplete
}: Props) => {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
    // const [currentPin, setCurrentPin] = useState<string>();


    const updateOtp = (index: number, value: string) => {
        setOtp(otp.map((n, i) => (i === index ? value : n)));
    };


    useEffect(() => {
        onChange(otp.join(""));
        const enteredPin = otp.join("");
        setIsCreatePinActive(enteredPin === oldPin.toString());
        if (enteredPin.length == otp.length) {
            setLengthComplete(true)
            setConfirmedPin(enteredPin)
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
                    />
                </div>
            ))}
        </div>
    );
};



const WithdrawalPinModal = ({
    closeModal,
    openModal,
}: propType) => {
    const [isCreatePinActive, setIsCreatePinActive] = useState(false);
    const [pinError, setPinError] = useState(false);
    const [lengthComplete, setLengthComplte] = useState(false);
    const [, setConfirmedPin] = useState<any>();
    const [showWithdralSuccessModal, setShowWithdralSuccessModal] = useState(false);
    const [showWithdrawalFalureModal, setShowWithdrawalFailureModal] = useState(false);
    const [withdrawalDetails, setWithdrawalDetails] = useState<WithdrawalDetailsType>({
        amount: 0,
        fees: 0,
        created_at: '',
        updated_at: '',
        status: '',
        recipient: {
            bank_name: '',
            account_number: ''
        }
    })
    const [failureMessage, setFailureMessage] = useState('')

    const [initiateWithdrawal, { isLoading }] = useInitiateWithdrawalMutation()

    const selectedWithdrawalDetails = useAppSelector(selectWithdrawalDetails)


    const submitPin = async () => {
        if (lengthComplete) {
            try {
                const payload = {
                    withdrawal_bank_account_id: selectedWithdrawalDetails.withdrawal_bank_account_id,
                    amount: selectedWithdrawalDetails.amount,
                    // pin: confirmedPin
                };
                let result = await initiateWithdrawal({ body: payload, provider: 'fincra' });
                if ("data" in result) {
                    setWithdrawalDetails(result?.data?.data)
                    setShowWithdralSuccessModal(true)
                } else {
                    const errorMessage = (result as any)?.error?.data?.message || 'Withdrawal Failed';
                    handleError(result);
                    setShowWithdrawalFailureModal(true);
                    setFailureMessage(errorMessage);
                }
            } catch (error) {
                handleError(error);
                setShowWithdrawalFailureModal(true)
                setFailureMessage('Withdrawal Failed')
            }
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

                    <div className="modal_body ">
                        <h3>Enter PIN</h3>
                        <p className="w-[80%] text-center">Enter your pin to complete withdrawal</p>
                        {/* otp component */}
                        <OtpInput
                            isCreatePinActive={isCreatePinActive}
                            setIsCreatePinActive={setIsCreatePinActive}
                            setPinError={setPinError}
                            pinError={pinError}
                            lengthComplete={lengthComplete}
                            setLengthComplete={setLengthComplte}
                            setConfirmedPin={setConfirmedPin}
                        />

                        <LoadingButton
                            variant="contained"
                            className="pin_btn"
                            onClick={() => submitPin()}
                            disabled={!lengthComplete}
                            loading={isLoading}
                        >
                            Submit
                        </LoadingButton>
                    </div>



                </div>
            </Modal>

            {showWithdralSuccessModal && (
                <WithdrawalPinSuccessModal
                    openModal={showWithdralSuccessModal}
                    closeModal={() => { setShowWithdralSuccessModal(false); closeModal(); }}
                    withdrawalDetails={withdrawalDetails}
                />
            )}


            {showWithdrawalFalureModal && (
                <WithdrawalFailedModal
                    openModal={showWithdrawalFalureModal}
                    closeModal={() => { setShowWithdrawalFailureModal(false); }}
                    failureMessage={failureMessage}
                />
            )}
        </>

    );
};

export default WithdrawalPinModal;
