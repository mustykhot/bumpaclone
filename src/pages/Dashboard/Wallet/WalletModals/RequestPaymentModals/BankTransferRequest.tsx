import { useEffect, useState } from "react";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import Button from "@mui/material/Button";
import { LoadingButton } from "@mui/lab";
import moment from "moment";
import parse from "html-react-parser";
import { CopyIcon2 } from 'assets/Icons/CopyIcon2';
import { useCopyToClipboardHook } from 'hooks/useCopyToClipboardHook';
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { useAppSelector } from "store/store.hooks";
import { selectBankRequestPaymentDetails } from "store/slice/WalletSlice";
import PaymentSuccessModal from "./PaymentSuccessModal";
import { useInitiateBankPaymentRequestMutation } from "services";
import { handleError } from "utils";


type PropsType = {
    openModal: boolean;
    closeModal: () => void;
    orderDetails: any
};

const BankTransferRequest = ({ openModal, closeModal, orderDetails }: PropsType) => {
    const [timeLeft, setTimeLeft] = useState('')
    const [isExpired, setIsExpired] = useState(false)
    const [expiredTime, setExpiredTime] = useState(false)
    const [showSuccessPayment, setShowSuccessPayment] = useState(false)
    const [initiateBankPaymentRequest, { data, isLoading }] = useInitiateBankPaymentRequestMutation()
    const selectedBankRequestPaymentDetails = useAppSelector(selectBankRequestPaymentDetails)

    const { handleCopyClick } = useCopyToClipboardHook(
        selectedBankRequestPaymentDetails?.account_number
            ? selectedBankRequestPaymentDetails?.account_number
            :
            ""
    );

    const makePayment = async() => {
        try {
            const payload = {
                payment_method: "bank_transfer"
            };
            let result = await initiateBankPaymentRequest({ body: payload, orderId: orderDetails[0].id, preview: 0 });
            if ("data" in result) {
                setShowSuccessPayment(true)
            } else {
                handleError(result);
            }
        } catch (error) {
            handleError(error);
        }
    };


    useEffect(() => {
        let intervalId: any;
    
        const updateTimer = () => {
          if (selectedBankRequestPaymentDetails) {
            const givenDate = moment(selectedBankRequestPaymentDetails.expires_at);
            const now = moment();
            const notExpired = now.isBefore(givenDate);
    
            if (notExpired) {
              const duration = moment.duration(givenDate.diff(now));
              const hours = duration.hours();
              const minutes = duration.minutes();
              const seconds = duration.seconds();
    
              const formattedTimeLeft = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
              setTimeLeft(formattedTimeLeft);
    
              if (hours < 3) {
                setExpiredTime(true);
              } else {
                setExpiredTime(false);
              }
            } else {
              setIsExpired(true);
              setExpiredTime(true);
              clearInterval(intervalId);
            }
          }
        };
    
        intervalId = setInterval(updateTimer, 1000);
    
        return () => clearInterval(intervalId);
      }, [selectedBankRequestPaymentDetails]);

    return (
        <>
            <ModalRight
                closeModal={() => {
                    closeModal()
                }}
                openModal={openModal}
            >

                <div className="modal_right_children">
                    <div className="top_section">
                        <ModalRightTitle
                            closeModal={() => {
                                closeModal();
                            }}
                            title="Send Payment Request"
                        />

                        <div className="px-8">

                            <div className="bg-light-grey rounded-[16px] p-8 text-center">
                                <div>
                                    <div className="text-grey-01">Account Name</div>
                                    <div className="font-medium text-xl mt-2">{selectedBankRequestPaymentDetails?.account_name}</div>
                                </div>

                                <div className="bg-white mt-6 rounded-[16px] p-8">
                                    <div className="text-grey-01">Account Number</div>
                                    <div className="font-medium text-4xl mt-2">{selectedBankRequestPaymentDetails?.account_number}</div>
                                    <span
                                        className='flex space-x-2 cursor-pointer bg-grey-00 py-1 px-3 rounded-[8px] w-[7rem] flex justify-center mx-auto mt-2'
                                        onClick={() => {
                                            handleCopyClick();
                                        }}><span><CopyIcon2 /></span> <span className='text-grey-01 font-medium'>Copy</span></span>
                                </div>

                            </div>
                            <div className="flex items-center space-x-2 mt-3">
                                <InfoCircleIcon />
                                <div className="text-grey-03">This bank account is temporary. It will expire in 24 hours</div>
                            </div>

                            <div className="flex justify-between mt-6">
                                <div>
                                    <span className="text-text-grey">Payment status:</span> <span className="font-medium text-state-error">{orderDetails[0]?.payment_status}</span>
                                </div>
                                <div>
                                    <span className="text-text-grey">Time left:</span> <span className={`${expiredTime ? 'text-error' : 'text-primary'}`}>{isExpired ? 'Expired' : timeLeft}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="text-grey-01 text-xl">Message</div>
                                <div className="p-4 border-2 rounded-[8px] border-grey-03 text-black-02 text-base mt-2">
                                    <div className="font-medium">{parse(selectedBankRequestPaymentDetails?.message?.replace(/\n/g, '<br>') as string)}</div>
                                    <div className="mt-9 font-medium">This account number will expire in 24 hours.</div></div>
                            </div>
                            <div className="flex items-center space-x-2 mt-3">
                                <InfoCircleIcon />
                                <div className="text-grey-03">This message will be sent via sms</div>
                            </div>

                        </div>

                    </div>

                    <div className="bottom_section">
                        <Button type="button" className="cancel" onClick={closeModal}>
                            Cancel
                        </Button>
                        <LoadingButton type="button" onClick={() => makePayment()} loading={isLoading} className="save">
                            Send
                        </LoadingButton>
                    </div>
                </div>
            </ModalRight>

            {showSuccessPayment && <PaymentSuccessModal 
            openModal={showSuccessPayment} 
            closeModal={() => { setShowSuccessPayment(false) }}
            orderDetails={orderDetails}
            btnAction={() => {closeModal(); setShowSuccessPayment(false) }}
            type='bank' />}

        </>
    )
}

export default BankTransferRequest;