import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import Button from "@mui/material/Button";
import { LoadingButton } from "@mui/lab";
import { useCopyToClipboardHook } from 'hooks/useCopyToClipboardHook';
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import PaymentSuccessModal from "./PaymentSuccessModal";
import { useInitiateBankPaymentRequestMutation } from "services";
import { handleError } from "utils";
import { useAppSelector } from "store/store.hooks";
import { selectOnlineTransferMessage } from "store/slice/WalletSlice";
import moment from "moment";
import { useEffect, useState } from "react";
import parse from "html-react-parser";



type PropsType = {
    openModal: boolean;
    closeModal: () => void;
    orderDetails: any
};

const OnlineTransferRequestPayment = ({ openModal, closeModal, orderDetails }: PropsType) => {
    const { handleCopyClick } = useCopyToClipboardHook(
        // data
        //   ? data?.data?.account_number
        "jklkj"
    );
    const [timeLeft, setTimeLeft] = useState('')
    const [isExpired, setIsExpired] = useState(false)
    const [showSuccessPayment, setShowSuccessPayment] = useState(false)
    const [initiateBankPaymentRequest, { data, isLoading }] = useInitiateBankPaymentRequestMutation()
    const selectedOnlineTransferMessage = useAppSelector(selectOnlineTransferMessage)


    const makePayment = async () => {
        try {
            const payload = {
                payment_method: "online_transfer"
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

    const getLink = (str: string) => {
        const urlRegex = /https?:\/\/[^\s]+/;

        const urlMatch = str.match(urlRegex);

        if (urlMatch) {
            const url = urlMatch[0];
            let text = str.replace(url, '').trim();
            text = text.replace(/\n/g, '<br>');

            const strObj = {
                url,
                text
            }
            return strObj
        }
    }

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

                            <div className="text-grey-01">You’re about to send a payment request for <span className="font-medium text-black-02">{orderDetails[0].customer?.name}</span></div>

                            <div className="mt-6">
                                <div className="text-grey-01 text-base">Message</div>
                                <div className="p-4 border-2 rounded-[8px] border-grey-03 text-black-02 text-base mt-2">
                                    <div className="font-medium">{parse(getLink(selectedOnlineTransferMessage)?.text as string)}</div>


                                    <div className='bg-grey-05 p-1 rounded-[8px] mt-2'><a target="_blank" href={`${parse(getLink(selectedOnlineTransferMessage)?.url as string)}`} className="mt-3 text-grey-01 cursor-pointer">{parse(getLink(selectedOnlineTransferMessage)?.url as string)}</a></div>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="bottom_section">
                        <Button type="button" className="cancel" onClick={closeModal}>
                            Cancel
                        </Button>
                        <LoadingButton type="submit" className="save" onClick={() => makePayment()} loading={isLoading}>
                            Send
                        </LoadingButton>
                    </div>
                </div>
            </ModalRight>

            {showSuccessPayment && <PaymentSuccessModal
                openModal={showSuccessPayment}
                closeModal={() => { setShowSuccessPayment(false) }}
                orderDetails={orderDetails}
                btnAction={() => { closeModal(); setShowSuccessPayment(false) }}
                type='online' />}
        </>
    )
}

export default OnlineTransferRequestPayment;