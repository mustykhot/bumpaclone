import Modal from "components/Modal";
import { IconButton } from "@mui/material";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { CheckCircleLargeIcon } from "assets/Icons/CheckCircleLarge";
import { LoadingButton } from "@mui/lab";
import { formatPrice } from "utils";
import { CopyIcon2 } from 'assets/Icons/CopyIcon2';
import { useCopyToClipboardHook } from 'hooks/useCopyToClipboardHook';

type WithdrawalPinSuccessModalProps = {
    openModal: boolean;
    closeModal: () => void;
    orderDetails: any
    btnAction: () => void;
    type: string
};


const PaymentSuccessModal = ({ openModal, closeModal, orderDetails, btnAction, type }: WithdrawalPinSuccessModalProps) => {
    // const { handleCopyClick } = useCopyToClipboardHook(
    //     // data
    //     //   ? data?.data?.account_number
    //     "jklkj"
    // );


    return (
        <Modal
            closeModal={() => {
                closeModal();
            }}
            openModal={openModal}
        >
            <div className="bg-white p-4 rounded-[8px] h-[80%] w-[30%] sm:w-[90%] md:w-[90%]">
                <div className="flex justify-end" onClick={() => closeModal()}>
                    <span className="rounded-[8px] bg-grey-00 p-1">
                        <IconButton type="button" className="back_btn_wrap">
                            <CloseSqIcon />
                        </IconButton>
                    </span>
                </div>

                <div className="mt-8 w-[80%] sm:w-[100%] md:w-[100%] mx-auto flex flex-col space-y-2 items-center">
                    <div>
                        <CheckCircleLargeIcon />
                    </div>
                    <div className="font-semibold text-2xl">Payment Request Sent</div>
                    <div className=" w-[100%] text-center mb-6">
                        You’ve successfully sent a payment request of <span className="text-primary font-medium">{formatPrice(Number(orderDetails[0]?.amount_due
                        ))}</span> to <span>{orderDetails[0]?.customer?.name
                        }</span>

                    </div>

                    {/* <div><div>www.storefront.com/329921329jd/pay</div>
                    <span
                                        className='flex space-x-2 cursor-pointer bg-grey-00 py-1 px-3 rounded-[8px] w-[7rem] flex justify-center mx-auto mt-2'
                                        onClick={() => {
                                            handleCopyClick();
                                        }}><span><CopyIcon2 /></span> <span className='text-grey-01 font-medium'>Copy</span></span></div> */}
                </div>

                <div className="mt-8">
                    <LoadingButton variant="contained" type="submit" className="add w-[100%]" onClick={btnAction}>
                        Done
                    </LoadingButton>
                </div>

            </div>
        </Modal>
    )
}

export default PaymentSuccessModal