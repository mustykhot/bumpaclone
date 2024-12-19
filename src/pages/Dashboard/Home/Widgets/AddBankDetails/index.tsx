import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import "./style.scss";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import Loader from "components/Loader";
import Modal from "components/Modal";
import SelectField from "components/forms/SelectField";
import ValidatedInput from "components/forms/ValidatedInput";
import { ModalHeader } from "../ModalHeader";
import { IBank, IStoreInformation } from "Models/store";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import {
  useSetupStoreBankMutation,
  useSetupStorePaymentMethodMutation,
} from "services/auth.api";
import { useGetBankListsQuery } from "services";
import {
  selectCurrentStore,
  selectCurrentUser,
  setStoreDetails,
} from "store/slice/AuthSlice";
import {
  selectBankCode,
  setBankDetails,
  setBankName,
} from "store/slice/BankSlice";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import EnablePaymentMethod from "./EnablePaymentMethod";

type AddProductModalProps = {
  openModal: boolean;
  closeModal?: () => void;
};

export type BankFields = {
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  charge_customer?: boolean;
  understand_terms?: boolean;
  store: IStoreInformation;
};

const TOTALPAYMENTSTEPS = 2;

export const AddBankModal = ({
  openModal,
  closeModal,
}: AddProductModalProps) => {
  const [presentStep, setPresentStep] = useState<number>(1);
  const [setupStoreBank, { isLoading: updateLoading }] =
    useSetupStoreBankMutation();
  const [setupStorePaymentMethod, { isLoading: paymentMethodLoading }] =
    useSetupStorePaymentMethodMutation();
  const { data: bankList, isLoading: bankListLoading } = useGetBankListsQuery();
  const bankCode = useAppSelector(selectBankCode);
  const userStore = useAppSelector(selectCurrentStore);
  const user = useAppSelector(selectCurrentUser);

  const dispatch = useAppDispatch();

  const methodsStep1 = useForm<BankFields>({
    mode: "all",
  });

  const methodsStep2 = useForm<BankFields>({
    mode: "all",
  });

  const {
    formState: { isValid: isValidStep1 },
    handleSubmit: handleSubmitStep1,
    getValues: getValuesStep1,
  } = methodsStep1;

  const {
    handleSubmit: handleSubmitStep2,
    getValues: getValuesStep2,
    reset: resetStep2,
  } = methodsStep2;

  const handleBankChange = (val: string) => {
    dispatch(setBankName(val));
    dispatch(setBankDetails(bankList as IBank[]));
  };

  const handleCloseEnablePaymentMethod = () => {
    resetStep2();
    closeModal && closeModal();
  };

  const goNext = (num: number) => {
    setPresentStep((prev) =>
      prev + num <= TOTALPAYMENTSTEPS ? prev + num : prev
    );
  };

  const handleAddBankDetails = async () => {
    const data = getValuesStep1();
    const payload = {
      bank_name: data.bank_name,
      account_name: data.account_name,
      account_number: data.account_number,
      code: bankCode,
    };
    try {
      let result = await setupStoreBank(payload);
      if ("data" in result) {
        dispatch(setStoreDetails(result.data.store));
        showToast("Bank Details Updated Successfully", "success");
        if (typeof _cio !== "undefined") {
          _cio.track("payment_method_added");
        }
        if (typeof mixpanel !== "undefined") {
          mixpanel.track("payment_method_added");
        }
        goNext(1);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const onSubmitStep2: SubmitHandler<BankFields> = async () => {
    const data = getValuesStep2();
    const payload = {
      charge_customer: data.charge_customer,
    };
    try {
      let result = await setupStorePaymentMethod(payload);
      if ("data" in result) {
        dispatch(setStoreDetails(result.data.store));
        showToast("Payment method Updated Successfully", "success");
        closeModal && closeModal();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (userStore) {
      const { bank, payment_method } = userStore.meta?.onBoard || {};
      if (bank === false && payment_method === false) {
        setPresentStep(1);
      } else if (bank === true && payment_method === false) {
        setPresentStep(2);
      }
    }
  }, [userStore]);

  if (updateLoading || paymentMethodLoading) {
    return <Loader />;
  }

  return (
    <Modal
      className="white_background"
      closeModal={() => {}}
      openModal={openModal}
    >
      {presentStep === 1 && (
        <FormProvider {...methodsStep1}>
          <form
            className="bank_form_modal"
            onSubmit={handleSubmitStep1(handleAddBankDetails)}
          >
            <div className="bank_form_container">
              <ModalHeader text="Add Bank Details" closeModal={closeModal} />
              <div className="note">
                <InfoCircleIcon stroke="#5C636D" />
                <span>
                  Please ensure the bank details here is linked to a BVN we can
                  verify.
                </span>
              </div>
              <div className="step_container">
                <div className="block pd_formsection">
                  <div className="bank_details_container">
                    <FormSectionHeader title="Bank Information" />
                    <SelectField
                      name="bank_name"
                      placeholder="Select Bank"
                      isLoading={bankListLoading}
                      selectOption={
                        bankList && bankList.length
                          ? bankList.map((bank: { name: string }) => {
                              return { key: bank.name, value: bank.name };
                            })
                          : []
                      }
                      handleCustomChange={handleBankChange}
                      label="Bank name"
                      searchable
                    />
                    <div className="form-group-flex">
                      <ValidatedInput
                        name="account_name"
                        label="Account Name"
                        type={"text"}
                      />
                      <ValidatedInput
                        name="account_number"
                        label="Account Number"
                        type={"number"}
                        rules={{
                          validate: (value) =>
                            value?.length == 10 ||
                            "Your account number must be 10 characters",
                        }}
                      />
                    </div>
                    <div className="bank_button_container">
                      <Button
                        onClick={handleAddBankDetails}
                        variant="contained"
                        className="primary_styled_button"
                        disabled={!isValidStep1 || updateLoading}
                        type="button"
                      >
                        Save and Continue
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      )}
      {presentStep === 2 && (
        <FormProvider {...methodsStep2}>
          <form className="bank_form_modal">
            <div className="bank_form_container">
              <ModalHeader
                text="Enable Online Payment"
                closeModal={handleCloseEnablePaymentMethod}
              />
              <div className="step_container">
                <EnablePaymentMethod
                  display="block"
                  handleSubmitStep2={handleSubmitStep2(onSubmitStep2)}
                />
              </div>
            </div>
          </form>
        </FormProvider>
      )}
    </Modal>
  );
};
