import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import moment from "moment";
import { ChevronRight } from "assets/Icons/ChevronRight";
import { BankIcon } from "assets/Icons/BankIcon";
import { CreditCardIcon } from "assets/Icons/CreditCardIcon";
import { getOriginImage } from "./UnpaidOrders";
import {
    capitalizeText,
    formatPrice,
    handleError,
} from "utils";
import BankTransferRequest from "./BankTransferRequest";
import { useState } from "react";
import OnlineTransferRequestPayment from "./OnlineTransferRequestPayment";
import { useInitiateBankPaymentRequestMutation } from "services";
import { useAppDispatch } from "store/store.hooks";
import { setBankRequestPaymentDetails, setOnlineTransferMessage } from "store/slice/WalletSlice";

type PropsType = {
    openModal: boolean;
    closeModal: () => void;
    orderDetails: any
};

const SendPaymentRequestModal = ({ openModal, closeModal, orderDetails }: PropsType) => {
    const [showBankTransfer, setShowBankTransfer] = useState(false)
    const [showOnlineTransfer, setShowOnlineTransfer] = useState(false)
    const [initiateBankPaymentRequest] = useInitiateBankPaymentRequestMutation()

    const dispatch = useAppDispatch()

    const bankTransferPayment = async (type: string) => {
        try {
            
            const payload = {
                payment_method: type === 'online' ? 'online_transfer' : "bank_transfer"
            };
            let result = await initiateBankPaymentRequest({ body: payload, orderId: orderDetails[0].id, preview: 1 });

            if ("data" in result) {
                if (type === 'online') {
                    setShowOnlineTransfer(true)
                    dispatch(setOnlineTransferMessage(result?.data?.data?.message))
                }
                else {
                    setShowBankTransfer(true)
                    dispatch(setBankRequestPaymentDetails({ ...result?.data?.data?.bank_details, message: result?.data?.data?.message }))
                }

            } else {
                handleError(result);
            }
        } catch (error) {
            handleError(error);
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
                            <div className="text-grey-01 text-sm">You’re about to send a payment request for <span className="text-black-02 font-medium">Order #241312</span></div>

                            <div className="flex justify-between rounded-[8px] p-4 bg-grey-05 mt-4">
                                <div className="flex space-x-4 items-center">
                                    <img
                                        src={getOriginImage(orderDetails[0]?.origin).image}
                                        alt={getOriginImage(orderDetails[0]?.origin).name}
                                        width={28}
                                        height={28}
                                        className="image_table_item"
                                    />
                                    <div>
                                        <div className="font-medium">{orderDetails[0]?.customer?.name}</div>
                                        <div className="flex items-center space-x-4 text-state-error mt-1 font-semibold">
                                            <span className="text-xs">{!orderDetails[0]?.payment_status ? orderDetails[0]?.payment_status : capitalizeText(orderDetails[0]?.payment_status)}</span>
                                            <span className="text-xs">{!orderDetails[0]?.shipping_status ? orderDetails[0]?.shipping_status : capitalizeText(orderDetails[0]?.shipping_status)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="font-medium">{formatPrice(Number(orderDetails[0]?.amount_due
                                    ))} </div>
                                    <div className="text-grey-01 text-xs mt-1">{`${moment(orderDetails[0]?.created_at).format("l")} `}</div>
                                </div>
                            </div>

                            <div className="mt-12">
                                <div className="text-black-02 font-medium">How would you like to request payment?</div>

                                <div className="mt-4">
                                    <div>
                                        <div onClick={() => { bankTransferPayment('online');}} className="flex justify-between items-center bg-light-grey p-6 rounded-[16px] cursor-pointer">
                                            <div className="flex justify-start space-x-4">
                                                <CreditCardIcon stroke="#009444" />

                                                <div>
                                                    <h2 className="font-medium">Online Payment </h2>
                                                    <p className="text-center mt-1 text-grey-01 text-sm">
                                                        Payment will be made through paystack
                                                    </p>
                                                </div>


                                            </div>
                                            <ChevronRight />
                                        </div>

                                        <div onClick={() => {  bankTransferPayment('bank') }} className="flex justify-between items-center bg-light-grey p-6 rounded-[16px] mt-6 cursor-pointer">
                                            <div className="flex justify-start space-x-4">
                                                <BankIcon stroke="#009444" />

                                                <div>
                                                    <h2 className="font-medium">Bank Transfer</h2>
                                                    <p className="text-center mt-1 text-grey-01 text-sm">
                                                        Payment will be made to your bank account
                                                    </p>
                                                </div>


                                            </div>
                                            <ChevronRight />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>

                    {/* <div className="bottom_section">
                                <Button type="button" className="cancel" onClick={closeModal}>
                                    Cancel
                                </Button>
                                <LoadingButton type="submit" className="save" disabled={!isValid || ((transactionFee + parseInt(watchedAmount)) > selectedWalletDetails?.balance)}>
                                    Withdraw
                                </LoadingButton>
                            </div> */}
                </div>
            </ModalRight>

            {showBankTransfer && <BankTransferRequest closeModal={() => setShowBankTransfer(false)} openModal={showBankTransfer} orderDetails={orderDetails} />}
            {showOnlineTransfer && <OnlineTransferRequestPayment closeModal={() => setShowOnlineTransfer(false)} openModal={showOnlineTransfer} orderDetails={orderDetails} />}
        </>
    )
}

export default SendPaymentRequestModal;