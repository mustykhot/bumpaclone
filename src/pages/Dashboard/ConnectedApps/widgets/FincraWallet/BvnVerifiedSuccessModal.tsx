import Modal from "components/Modal";
import { IconButton } from "@mui/material";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { CheckCircleLargeIcon } from "assets/Icons/CheckCircleLarge";
import { LoadingButton } from "@mui/lab";
import './style.scss'

type BvnSuccessModalProps = {
    openModal: boolean;
    closeModal: () => void;
    btnAction: () => void;
};

const BvnVerifiedSuccessModal = ({ closeModal, openModal, btnAction }: BvnSuccessModalProps) => {
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

                <div className="mt-28 w-[60%] mx-auto flex flex-col space-y-2 items-center">
                    <div>
                        <CheckCircleLargeIcon />
                    </div>
                    <h6 className="font-semibold text-2xl">BVN Verified</h6>
                    <p className="text-grey-01 text-center">We’ve successfully verified your Bank Verification Number (BVN)</p>
                </div>


                <div className="mt-10">
                    <LoadingButton onClick={() => {
                            btnAction();
                        }} variant="contained" type="submit" className="add w-[100%]" disabled={false}>
                        Continue
                    </LoadingButton>
                </div>

            </div>
        </Modal>
    )
}

export default BvnVerifiedSuccessModal;