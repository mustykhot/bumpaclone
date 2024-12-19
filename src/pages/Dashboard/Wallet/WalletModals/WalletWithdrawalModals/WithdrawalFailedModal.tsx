import Modal from "components/Modal";
import {  IconButton } from "@mui/material";
import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { LoadingButton } from "@mui/lab";
import { FailedIcon } from "assets/Icons/FailedIcon";

type WithdrawalFailedModalProps = {
    openModal: boolean;
    closeModal: () => void;
    failureMessage: string;
};

const WithdrawalFailedModal = ({closeModal, openModal, failureMessage}: WithdrawalFailedModalProps) => {
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

                <div className="mt-28 mx-auto flex flex-col space-y-4 items-center">
                    <div>
                        <FailedIcon />
                    </div>
                    <div className="font-semibold text-2xl">Transaction Failed</div>
                    <div className="text-grey-01">{failureMessage}</div>
        
                </div>



                <div className="mt-28 px-4">
                    <LoadingButton onClick={() => closeModal()} variant="contained" type="submit" className="add w-[100%]" disabled={false}>
                        Try Again
                    </LoadingButton>
                </div>

            </div>
        </Modal>
    )
}

export default WithdrawalFailedModal;