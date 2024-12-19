import Modal from "components/Modal";
import { IconButton } from "@mui/material";
import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { LoadingButton } from "@mui/lab";
import { FailedIcon } from "assets/Icons/FailedIcon";
import GreyLargeWarningIcon from "assets/Icons/greyLargeWarningIcon";

type RemoveModalProps = {
    openModal: boolean;
    closeModal: () => void;
    btnAction: () => void;
    isLoading: boolean
};


const RemoveAccountModal = ({ closeModal, openModal, btnAction, isLoading }: RemoveModalProps) => {
    return (
        <Modal
            closeModal={() => {
                closeModal();
            }}
            openModal={openModal}
        >
            <div className="bg-white rounded-[8px] p-2">
                <div className="flex justify-end" onClick={() => closeModal()}>
                   <span className="bg-grey-00 rounded-[8px]">
                   <IconButton type="button" className="back_btn_wrap">
                        <CloseSqIcon />
                    </IconButton>
                   </span>
                </div>

                <div className="mt-6 mx-auto flex flex-col space-y-4 items-center">
                    <div>
                        <GreyLargeWarningIcon />
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-2xl">Remove Bank Account</div>
                        <div className="text-grey-01 w-[70%] mx-auto mt-2">Are you sure you want to this saved bank account?</div>
                    </div>

                </div>



                <div className="mt-8 px-4 flex flex-col space-y-8">
                    <LoadingButton variant="contained" type="submit" className="w-[100%] remove-account" loading={isLoading} onClick={btnAction} disabled={false}>
                        Remove
                    </LoadingButton>

                    <button onClick={closeModal}>Cancel</button>
                </div>

            </div>
        </Modal>
    )
}

export default RemoveAccountModal;