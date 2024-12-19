import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import image from "../../../../../assets/images/paystack_wallet.png";
import { CopyIcon } from "assets/Icons/CopyIcon";
import { useCopyToClipboardHook } from "hooks/useCopyToClipboardHook";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { useAppSelector } from "store/store.hooks";
import { selectWalletDetails } from "store/slice/WalletSlice";
import { MarkIcon } from "assets/Icons/MarkIcon";
// import "./style.scss"

type ModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const WalletBankDetails = ({ openModal, closeModal }: ModalProps) => {
 
  const bankDetails = useAppSelector(selectWalletDetails)
  const { isCopied, handleCopyClick } = useCopyToClipboardHook(
    bankDetails?.account_number
)
  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children trans_modal">
          <div className="top_section">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              title="Bank Details"
            />
            <div className="wallet_bank_body trans_moadal_body">
                <img src={image} alt="wallet"/>
                <h5>Bank Account Details</h5>
                <p>Below is your bank account details</p>

                <div className="details_wrapper">
                    <div className="single_wrapper ">
                        <span className="text_start">Bank Name</span>
                        <span className="text_end">P{bankDetails.bank_name}</span>
                    </div>
                    <div className="single_wrapper ">
                        <span className="text_start">Account Name</span>
                        <span className="text_end">{bankDetails.account_name}</span>
                    </div>
                    <div className="single_wrapper ">
                        <span className="text_start">Account Number</span>
                        <div className="copy_number flex">
                        <span className="text_end">{bankDetails.account_number}</span>
                        <div className="copy_wrapper"
                            onClick={() => {handleCopyClick()}}
                        >
                            
                            {isCopied ? <MarkIcon /> : <CopyIcon className="copy_icon" stroke="#009444" />} 
                        </div>
                       
                        </div>
                    </div>
                </div>
                <div className="disclaimer flex gap-x-2">
                    <InfoCircleIcon />
                   <p>This is the account you will use to receive bank transfers from your buyers. </p> 
                </div>
                
            </div>
          
          </div>

          
        </div>
      </ModalRight>

    </>
  );
};
