import Modal from "components/Modal";
import { IconButton } from "@mui/material";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { CheckCircleLargeIcon } from "assets/Icons/CheckCircleLarge";
import { LoadingButton } from "@mui/lab";
import './style.scss'
import { useNavigate } from "react-router-dom";
import Confetti from 'assets/images/confetti.png'

type BvnSuccessModalProps = {
    openModal: boolean;
    closeModal: () => void;
};

const CreatePinSuccessModal = ({ closeModal, openModal }: BvnSuccessModalProps) => {
    const navigate = useNavigate()
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

                <div className="mt-26 w-[60%] mx-auto flex flex-col space-y-2 items-center">
                    <div>
                        <img src={Confetti} alt="logo" />
                    </div>

                    <h6 className="font-semibold text-2xl">Bumpa Wallet Created!</h6>
                    <p className="text-grey-01 text-center">You’ve successfully created your Bumpa wallet and your Bumpa bank account has been issued.</p>
                </div>


                <div className="mt-10">
                    <LoadingButton onClick={() => {
                        navigate('/dashboard/wallet')
                    }} variant="contained" type="submit" className="add w-[100%]" disabled={false}>
                        Continue
                    </LoadingButton>
                </div>

            </div>
        </Modal>
    )
}

export default CreatePinSuccessModal;