import Modal from "components/Modal";
import { IconButton } from "@mui/material";
import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { CheckCircleLargeIcon } from "assets/Icons/CheckCircleLarge";
import { LoadingButton } from "@mui/lab";
import { WithdrawalDetailsType } from "./WithdrawalPinModal";
import { formatPrice, capitalizeText } from "utils";

type WithdrawalPinSuccessModalProps = {
    openModal: boolean;
    closeModal: () => void;
    withdrawalDetails: WithdrawalDetailsType
};

const WithdrawalPinSuccessModal = ({ closeModal, openModal, withdrawalDetails }: WithdrawalPinSuccessModalProps) => {
    return (
        <Modal
            closeModal={() => {
                closeModal();
            }}
            openModal={openModal}
        >
            <div className="pin_wrap success_pin_wrap">
                <div className="close_btn" onClick={() => closeModal()}>
                    <IconButton type="button" className="back_btn_wrap">
                        <CloseSqIcon />
                    </IconButton>
                </div>

                <div className="mt-8 w-[60%] mx-auto flex flex-col space-y-2 items-center">
                    <div>
                        <CheckCircleLargeIcon />
                    </div>
                    <div className="font-semibold text-2xl">Withdrawal Complete</div>
                    <div className=" w-[100%] flex flex-col justify-center items-center space-y-2 bg-grey-05 rounded-[8px] py-4 px-2 mb-6">
                        <div className="text-grey-01">Amount</div>
                        <div className="font-medium text-2xl">{withdrawalDetails?.amount ? formatPrice(withdrawalDetails?.amount) : withdrawalDetails?.amount}</div>
                    </div>
                </div>

                <div className="mt-8 px-6">
                    <div className="flex justify-between py-4 border-b">
                        <div className="text-grey-01">Bank</div>
                        <div className="font-medium text-black-02">{withdrawalDetails?.recipient?.bank_name ? capitalizeText(withdrawalDetails?.recipient?.bank_name) : withdrawalDetails?.recipient?.bank_name}</div>
                    </div>

                    {/* <div className="flex justify-between py-4 border-b">
                        <div className="text-grey-01">Account Name</div>
                        <div className="font-medium text-black-02">Nonso Amadi Kelechukwu2</div>
                    </div> */}

                    <div className="flex justify-between py-4 border-b">
                        <div className="text-grey-01">Account Number</div>
                        <div className="font-medium text-black-02">{withdrawalDetails?.recipient?.account_number}</div>
                    </div>


                    <div className="flex justify-between py-4 border-b">
                        <div className="text-grey-01">Transaction Status</div>
                        <div><span className="text-primary p-3 rounded-[8px] bg-pastel-green">{withdrawalDetails?.status ? capitalizeText(withdrawalDetails?.status) : withdrawalDetails?.status}</span></div>
                    </div>

                </div>

                {withdrawalDetails?.status == 'SUCCESSFUL' && <div className="mt-6">
                    <LoadingButton variant="contained" type="submit" className="add w-[100%]" disabled={false}>
                        Download Receipt
                    </LoadingButton>
                </div>
                }

            </div>
        </Modal>
    )
}

export default WithdrawalPinSuccessModal