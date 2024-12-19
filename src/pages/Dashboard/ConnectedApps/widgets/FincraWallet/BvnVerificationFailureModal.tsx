import Modal from "components/Modal";
import { IconButton } from "@mui/material";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { LoadingButton } from "@mui/lab";
import { FailedIcon } from "assets/Icons/FailedIcon";
import './style.scss'

type BvnFailureModalProps = {
    openModal: boolean;
    closeModal: () => void;
    btnAction: () => void;
};

const BvnVerificationFailureModal = ({ closeModal, openModal, btnAction }: BvnFailureModalProps) => {
    return (
        <Modal
            closeModal={() => {
                closeModal();
            }}
            openModal={openModal}
        >
            <div className="pocket_wrap">
                <div className="close_btn" onClick={() => closeModal()}>
                    <IconButton type="button" className="back_btn_wrap">
                        <CloseSqIcon />
                    </IconButton>
                </div>

                <div className="mt-28 w-[80%] mx-auto flex flex-col space-y-2 items-center">
                    <div>
                    <FailedIcon />
                    </div>
                    <h6 className="font-semibold text-2xl">Verification Failed</h6>
                    <p className="text-grey-01 text-center">We couldn’t verify your Bank Verification Number (BVN)</p>
                </div>


                <div className="mt-10">
                    <LoadingButton  onClick={() => {
                            btnAction();
                        }} variant="contained" type="submit" className="add w-[100%]" disabled={false}>
                        Try Again
                    </LoadingButton>
                </div>

            </div>
        </Modal>
    )
}

export default BvnVerificationFailureModal;