import { useState, useEffect } from "react";
import Modal from "components/Modal";
import { Button, IconButton } from "@mui/material";
import "./style.scss";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import { formatPriceNotFixed, getCurrencyFnc } from "utils";
import ValidatedInput from "components/forms/ValidatedInput";
import InputField from "components/forms/InputField";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "components/forms/SubmitButton";
import SuccessLimitModal from "./SuccessLimitModal";
import FailureLimitModal from "./FalureLimitModal";
import { useSetTransactionLimitMutation } from "services";
import { handleError } from "utils";
import { showToast } from "store/store.hooks";
import { LoadingButton } from "@mui/lab";
import { useAppSelector } from "store/store.hooks";
import { selectWalletDetails } from "store/slice/WalletSlice";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  isModified: boolean;
  setIsModified: React.Dispatch<React.SetStateAction<boolean>>;
  newLimit: any;
  setNewLimit: any;
};

export type limitFields = {
  limit: number;
  pin: string;
};

const ModifyLimitModal = ({
  closeModal,
  openModal,
  isModified,
  setIsModified,
  newLimit,
  setNewLimit,
}: propType) => {
  const [showLimitFailure, setShowLimitFailure] = useState(false);
  const [isGreaterthan, setIsGreaterthan] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const details = useAppSelector(selectWalletDetails);

  const maximumLimit = details.max_transaction_limit;
  const methods = useForm<limitFields>({
    mode: "all",
  });

  const {
    formState: { isValid },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = methods;
  const amount = watch("limit");

  useEffect(() => {
    if (amount) {
      // @ts-ignore-next-line
      if (amount > maximumLimit) {
        setIsGreaterthan(true);
      } else setIsGreaterthan(false);
    }
  }, [amount]);

  const [setTransactionLimit, { isLoading }] = useSetTransactionLimitMutation();

  const onSubmit: SubmitHandler<limitFields> = async (data) => {
    try {
      let result = await setTransactionLimit({
        limit: data.limit,
        pin: data.pin,
      });
      if ("data" in result) {
        setIsModified(true);
        setNewLimit(data.limit);
      } else {
        // @ts-ignore
        if (result?.error?.status === "FETCH_ERROR") {
          // @ts-ignore
          showToast("Something went wrong", "failure");
        } else {
          // @ts-ignore
          setErrorMsg(result?.error?.data?.message);
          setShowLimitFailure(true);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Modal
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="pin_wrap">
              <div className="" onClick={() => closeModal()}>
                <IconButton type="button" className="back_btn_wrap">
                  <BackArrowIcon />
                </IconButton>
              </div>
              <div className="modal_body limit_body">
                <h3>Modify Limit</h3>
                {/* @ts-ignore-next-line */}
                <p>Maximum limit is {formatPriceNotFixed(maximumLimit)}</p>

                <div className="input_wrapper">
                  <ValidatedInput
                    errMsg="Amount entered cannot exceed maximum limit"
                    className="limit_input"
                    name="limit"
                    required={true}
                    type="number"
                    placeholder="Enter new transaction limit"
                    prefix={
                      <span className="text-[#9BA2AC]">{getCurrencyFnc()}</span>
                    }
                  />
                  {isGreaterthan && (
                    <h5 className="text-[#D90429] text-left text-sm amount_error">
                      Amount entered cannot exceed maximum limit
                    </h5>
                  )}
                  <ValidatedInput
                    className="limit_input"
                    name="pin"
                    required={true}
                    type="password"
                    placeholder="Enter PIN"
                  />
                </div>
                <LoadingButton
                  variant="contained"
                  className="pin_btn"
                  // onClick={handleSubmit}
                  disabled={!isValid || isGreaterthan}
                  loading={isLoading}
                  type="submit"
                >
                  Change Limit
                </LoadingButton>
              </div>
            </div>
          </form>
        </FormProvider>
      </Modal>

      {showLimitFailure && (
        <FailureLimitModal
          openModal={showLimitFailure}
          closeModal={() => setShowLimitFailure(false)}
          errorMsg={errorMsg}
        />
      )}
    </>
  );
};

export default ModifyLimitModal;
