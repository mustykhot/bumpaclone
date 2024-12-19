import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import "./style.scss";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import Loader from "components/Loader";
import SelectField from "components/forms/SelectField";
import ValidatedInput from "components/forms/ValidatedInput";
import { IBank } from "Models/store";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import {
  useGetBankSettingsQuery,
  useGetBankListsQuery,
  useUpdateBankSettingsMutation,
} from "services";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  selectBankCode,
  selectBankSlug,
  setBankName,
  setBankDetails,
} from "store/slice/BankSlice";
import { handleError } from "utils";

export type BankDetailsFeilds = {
  bank_name: string;
  account_name: string;
  account_number: string;
};

export const BankDetails = () => {
  const [isEdit, setIsEdit] = useState(false);
  const { data, isLoading } = useGetBankSettingsQuery();
  const { data: bankList, isLoading: bankListLoading } = useGetBankListsQuery();
  const [updateBankSettings, { isLoading: updateLoading }] =
    useUpdateBankSettingsMutation();

  const dispatch = useAppDispatch();
  const bankCode = useAppSelector(selectBankCode);
  const bankSlug = useAppSelector(selectBankSlug);

  const methods = useForm<BankDetailsFeilds>({
    mode: "all",
  });
  const {
    formState: { isValid },
    handleSubmit,
    setValue,
    reset,
  } = methods;

  const onSubmit: SubmitHandler<BankDetailsFeilds> = async (data) => {
    const payload = {
      bank_name: data.bank_name,
      account_name: data.account_name,
      account_number: data.account_number,
      code: bankCode,
      slug: bankSlug,
    };

    try {
      let result = await updateBankSettings(payload);
      if ("data" in result) {
        showToast("Bank Details Updated Successfully", "success");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleBankChange = (val: string) => {
    dispatch(setBankName(val));
    dispatch(setBankDetails(bankList as IBank[]));
  };

  useEffect(() => {
    if (data) {
      const bankExists = Boolean(
        data?.account?.bank_name &&
          data?.account?.account_name &&
          data?.account?.account_number
      );

      setIsEdit(!bankExists);

      if (bankExists) {
        setValue("bank_name", data?.account?.bank_name as string, {
          shouldValidate: true,
        });
        setValue("account_number", data?.account?.account_number as string, {
          shouldValidate: true,
        });
        setValue("account_name", data?.account?.account_name as string, {
          shouldValidate: true,
        });
      }
    }
  }, [data, setValue]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="pd_create_store_information pd_bank_details">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form_section">
              <ModalHeader text="Bank Details" />
              <div className="note">
                <InfoCircleIcon stroke="#5C636D" />
                {!isEdit ? (
                  <span>
                    To edit your bank details, please contact support at{" "}
                    <a href="mailto:support@getbumpa.com">
                      support@getbumpa.com
                    </a>
                  </span>
                ) : (
                  <span>
                    Please ensure the bank details here is linked to a BVN we
                    can verify.
                  </span>
                )}
              </div>
              <div className="form_field_container">
                <div className="order_details_container">
                  <FormSectionHeader title="Bank Information" />
                  <div className="px-[16px]">
                    <SelectField
                      isDisabled={!isEdit}
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
                        disabled={!isEdit}
                      />
                      <ValidatedInput
                        name="account_number"
                        label="Account Number"
                        type={"number"}
                        disabled={!isEdit}
                        rules={{
                          validate: (value) =>
                            value?.length == 10 ||
                            "Your account number must be 10 characters",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {isEdit && (
              <div className="submit_form_section">
                <div></div>
                <div className="button_container">
                  <LoadingButton
                    loading={updateLoading}
                    variant="contained"
                    className="add"
                    type="submit"
                    disabled={!isValid}
                  >
                    Save
                  </LoadingButton>
                </div>
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </>
  );
};
