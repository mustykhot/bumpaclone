import { useState } from "react";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import ValidatedInput from "components/forms/ValidatedInput";
import Button from "@mui/material/Button";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import './style.scss'
import { NairaIcon } from "assets/Icons/NairaIcon";
import AccesssLogo from 'assets/images/Access-logo.svg'
import ZenithBankLogo from "assets/images/ZenithLogo.svg"
import { selectWalletDetails } from "store/slice/WalletSlice";
import { useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import { toCurrency } from "utils";
import { setWithdrawalDetails } from "store/slice/WalletSlice";
import { useAppDispatch } from "store/store.hooks";

type BeneficiaryFeilds = {
    amount: string;
};
type BeneficiaryModalProps = {
    openModal: boolean;
    openPinModal: () => void;
    closeModal: () => void;
    details: any
};


const BenefeciaryDetailsModal = ({
    openModal,
    closeModal,
    openPinModal,
    details
}: BeneficiaryModalProps) => {

    const selectedWalletDetails = useAppSelector(selectWalletDetails)
    const [transactionFee, setTransactionFee] = useState(25)

    const dispatch = useAppDispatch()

    const methods = useForm<BeneficiaryFeilds>({
        mode: "all",
    });

    const {
        formState: { isValid },
        handleSubmit,
        watch
    } = methods;

    const watchedAmount = watch('amount');


    const onSubmit: SubmitHandler<BeneficiaryFeilds> = async (data) => {

        const payload = {
            withdrawal_bank_account_id: details?.id,
            amount: parseInt(data.amount)
        };
        dispatch(setWithdrawalDetails(payload))
        openPinModal()
    };


    return (
        <>
            <ModalRight
                closeModal={() => {
                    closeModal()
                }}
                openModal={openModal}
            >
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="h-full">
                        <div className="modal_right_children">
                            <div className="top_section">
                                <ModalRightTitle
                                    closeModal={() => {
                                        closeModal();
                                    }}
                                    title="Withdraw Money"
                                />

                                <div className="brief_form">
                                    <div className="flex flex-col justify-center items-center space-y-2 bg-grey-05 rounded-[8px] py-4 px-2 mb-6">
                                        <div>
                                            <img src={ZenithBankLogo} alt='logo' />
                                        </div>
                                        <div className="font-medium text-base">{details?.account_name}</div>
                                        <div>{details?.account_number}</div>
                                    </div>

                                    <ValidatedInput name="amount" label="Withdrawal Amount" type={"text"} extraError={((transactionFee + parseInt(watchedAmount)) > selectedWalletDetails?.balance) ? 'Withdrawal amount can’t be higher than the available balance' : ''} prefix={<NairaIcon />} />

                                    {watchedAmount && <div className={`flex justify-between px-5 py-4 rounded-[16px] font-light bg-grey-table-hover `}>
                                        <div className="text-grey-01 text-sm">{`Avail bal: ${toCurrency("en-NG", selectedWalletDetails?.balance)}`}</div>
                                        <div className="text-primary text-sm">{`Transaction Fee: ${toCurrency("en-NG", transactionFee)}`}</div>
                                    </div>}

                                    {watchedAmount && <div className={`flex justify-between px-5 py-4 rounded-[8px] mt-2 font-light bg-grey-table-hover `}>
                                        <div className="text-grey-01 text-sm">Total Amount</div>
                                        <div className="text-black-02 text-sm font-medium">{toCurrency("en-NG", parseInt(watchedAmount) + transactionFee)}</div>
                                    </div>}
                                </div>
                            </div>

                            <div className="bottom_section">
                                <Button type="button" className="cancel" onClick={closeModal}>
                                    Cancel
                                </Button>
                                <LoadingButton type="submit" className="save" disabled={!isValid || ((transactionFee + parseInt(watchedAmount)) > selectedWalletDetails?.balance)}>
                                    Withdraw
                                </LoadingButton>
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </ModalRight>
        </>
    )
}

export default BenefeciaryDetailsModal;