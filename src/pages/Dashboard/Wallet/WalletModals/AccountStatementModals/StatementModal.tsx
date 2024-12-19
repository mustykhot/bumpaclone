import { useState } from "react";

import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { Button } from "@mui/material";
import ValidatedInput from "components/forms/ValidatedInput";
import { CalendarPicker, LoadingButton } from "@mui/lab";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "components/forms/SubmitButton";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import StatementSuccessModal from "./StatementSucessModal";
import { useGetAccounStatementMutation } from "services";
import { handleError } from "utils";
import { showToast } from "store/store.hooks";
import "./styles.scss"

export type dateFields = {
    from: Date;
    to: Date;
};
type ModalProps = {
    openModal: boolean;
    closeModal: () => void;
    isStatementSuccess: boolean;
    setIsStatementSucess: React.Dispatch<React.SetStateAction<boolean>>;
};



export const StatementModal = ({ openModal, closeModal, isStatementSuccess, setIsStatementSucess }: ModalProps) => {
    const [statementSuccess, setStatementSuccess] = useState(false)
    const [getAccountStatement, {data, isLoading, isError, isSuccess } ] = useGetAccounStatementMutation()
     

    const methods = useForm<dateFields>({
        mode: "all",
    });
    const {
        formState: { isValid },
        handleSubmit,
        reset,
        watch,
        setValue
    } = methods;

    const onSubmit: SubmitHandler<dateFields> = async (data) => {
        try {
            let result = await getAccountStatement({ 
                provider: "fincra", 
                from: data.from, 
                to: data.to
            });
            if ("data" in result){
                setIsStatementSucess(true)
            } else {
                // @ts-ignore
                showToast(result?.error?.data?.message, "failure")
             }
          
        } 
        catch (error) {
            handleError(error)
        }
    }
    return (
        <>
            <ModalRight
                closeModal={() => {
                    closeModal();
                }}
                openModal={openModal}
            >
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="h-full">
                        <div className="modal_right_children trans_modal statement_modal">

                            <div className="top_section">
                                <ModalRightTitle
                                    closeModal={() => {
                                        closeModal();
                                    }}
                                    title="Statement of Account"
                                    extraChild="Select a timeframe to generate your statement of account"
                                />
                                <div className="wallet_bank_body trans_moadal_body">
                                    <ValidatedInput
                                        type="date"
                                        name='from'
                                        suffix={(<p>
                                            <CalendarPicker />
                                        </p>)}
                                    />
                                    <ValidatedInput
                                        type="date"
                                        name='to'
                                        suffix={(<p>
                                            <CalendarPicker />
                                        </p>)}
                                    />
                                    <div className="disclaimer flex gap-x-2">
                                        <InfoCircleIcon />
                                        <p>Statement will be sent to your registered email address</p>
                                    </div>
                                </div>
                            </div>

                            <div className=" bottom_section">
                            <LoadingButton   
                                variant="contained"
                                className={!isValid ? 'btn_disabled' : ""}
                                disabled={!isValid}
                                loading={isLoading}
                                type="submit"
                            >
                                Send Statement{" "}
                            </LoadingButton>
                              
                            </div>
                        </div>
                    </form>
                </FormProvider>


            </ModalRight>

            {/* {statementSuccess && (
                <StatementSuccessModal
                    openModal={statementSuccess}
                    closeModal={() => setStatementSuccess(false)}
                />
            )} */}
        </>
    );
};
