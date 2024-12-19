import { useEffect, useState } from "react";
import ModalBottom from "components/ModalBottom"
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import "./style.scss";
import { Button } from "@mui/material";


type propType = {
    openModal: boolean;
    closeModal: () => void;
    closeShowPaymentModal: () => void;
    selected: any;
    handlePaymentSettlement: (arg: any) => void
};

const SendPaymentModal = ({ closeModal, closeShowPaymentModal,
    openModal, selected, handlePaymentSettlement }: propType) => {
    const [paymentOrder, setPaymentOrder] = useState<any>([])

    useEffect(() => {
        if (selected) {
            setPaymentOrder(selected)
        }
    }, [selected])

    return (

        <ModalBottom closeModal={closeShowPaymentModal} openModal={openModal}>
            <div className="pd_share_invoice_modal">
                <div className="order_container-ig">
                    <ModalHeader text="Send Payment Request" closeModal={closeShowPaymentModal} />

                    <div>
                        <div className="payment_preview_modal">
                            <div className="heading">You’re about to send a payment request to</div>
                            <div className="customer_name">{paymentOrder?.customer?.name}</div>

                            <div className="message_area">
                                <div className="mesage_header">Message</div>

                                <div className="message_box">
                                    <div className="message_info">Kindly use the link below to make payment for your order.  </div>
                                    <div className="payment_link"><a href={paymentOrder?.order_page}><span>{paymentOrder?.order_page}</span></a></div>
                                </div>
                            </div>

                            <div className="submit_payment">
                                <div className="button_container">
                                    <Button onClick={() => {
                                        handlePaymentSettlement(selected)
                                        closeModal()
                                        closeShowPaymentModal()
                                    }}>Send</Button>
                                </div>
                            </div>
                        </div>


                    </div>

                </div>
            </div>
        </ModalBottom>
    )
}

export default SendPaymentModal;