import Modal from "components/Modal";
import { Button, IconButton } from "@mui/material";
import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import image from "../../../../../assets/images/paystack_wallet.png";
import { CopyIcon } from "assets/Icons/CopyIcon";
import { MarkIcon } from "assets/Icons/MarkIcon";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { ChevronRight } from "assets/Icons/ChevronRight";
import { useAppSelector } from "store/store.hooks";
import { selectWalletDetails } from "store/slice/WalletSlice";
import { useCopyToClipboardHook } from "hooks/useCopyToClipboardHook";


type propType = {
    openModal: boolean;
    closeModal: () => void;
};

const bankActions = [
    {
        name: "Request Payment",
        desc: "Send a payment request to your customers",
    },
   
]

const BankModalDetails = ({
    closeModal,
    openModal,
}: propType) => {
    const details = useAppSelector(selectWalletDetails)
    const { isCopied, handleCopyClick } = useCopyToClipboardHook(
        details?.account_number
    )

    return (
        <Modal
            closeModal={() => {
                closeModal();
            }}
            openModal={openModal}
        >
            <div className="trans_modal pin_wrap bank_wrap">
                <div className="close_btn" onClick={() => closeModal()}>
                    <IconButton type="button" className="back_btn_wrap">
                        <CloseSqIcon />
                    </IconButton>
                </div>
                {/* <div className="icon_wrapper"> */}
                <div className="modal_body wallet_bank_body trans_moadal_body">
                    <img src={image} alt="wallet" />
                    <h4 className="bk_main_header">Bank Account Details</h4>
                    <p>Below is your bank account details</p>

                    <div className="details_wrapper">
                        <div className="single_wrapper ">
                            <span className="text_start">Bank Name</span>
                            <span className="text_end">{details.bank_name}</span>
                        </div>
                        <div className="single_wrapper ">
                            <span className="text_start">Account Name</span>
                            <span className="text_end">{details.account_name}</span>
                        </div>
                        <div className="single_wrapper ">
                            <span className="text_start">Account Number</span>
                            <div className="copy_number flex">
                                <span className="text_end">{details.account_number}</span>
                                <div className="copy_wrapper"
                                    onClick={() => { 
                                        handleCopyClick()
                                    }}
                                >
                                    {isCopied ? <MarkIcon /> : <CopyIcon className="copy_icon" stroke="#009444" />}
                                    
                                </div>
                                {/* <IconButton
                                    onClick={() => {
                                        handleCopyClick();
                                    }}
                                    type="button"
                                    className="copy_wrapper"
                                >
                                    {isCopied ? <MarkIcon /> : <CopyIcon className="copy_icon"/>}
                                </IconButton> */}

                            </div>
                        </div>
                    </div>
                    <div className="disclaimer flex gap-x-2">
                        <InfoCircleIcon />
                        <span style={{ marginTop: "-5px" }}>This is the account you will use to receive bank transfers from your buyers. </span>
                    </div>
                    <h1 className="bank_header ">Do more with your bank account</h1>

                    <div className="action_wrap">
                        {bankActions.map((item, i) => (
                            <div className="single_action" key={i}>
                                <div className="text_wrpper">
                                    <p>{item.name}</p>
                                    <span>{item.desc}</span>
                                </div>
                                <div className="icon">
                                    <IconButton>
                                        <ChevronRight />
                                    </IconButton>
                                </div>
                            </div>
                        ))}

                    </div>
                    <Button
                        variant="contained"
                        className="pin_btn"
                        onClick={() => closeModal()}
                    >
                        Ok
                    </Button>
                </div>

            </div>
        </Modal>
    );
};

export default BankModalDetails;
