import { useState, useEffect } from "react";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import ValidatedInput from "components/forms/ValidatedInput";
import Button from "@mui/material/Button";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import NormalSelectField from "components/forms/NormalSelectField";
import SelectField from "components/forms/SelectField";
import { WalletWithdrawalIcon } from "assets/Icons/WalletWithdrawalIcon";
import { LoadingIcon } from "assets/Icons/loadingIcon";
import "./style.scss";
import { FailedCheckIcon } from "assets/Icons/FailedCheckIcon";
import { FullCheckedCircleIcon } from "assets/Icons/FullCheckedCircleIcon";
import BenefeciaryDetailsModal from "./BeneficiaryDetailsModal";
import WithdrawalPinModal from "./WithdrawalPinModal";
import {
  useGetListOfFincraBankQuery,
  useLookUpWithdrawalAccountMutation,
  useAddWithdrawalAccountMutation,
  useGetListOfAddedAccountQuery,
  useDeleteWithdrawalAccountMutation,
} from "services";
import {
  selectFincraBankList,
  setFincraBankList,
  setFormatedBankList,
  selectFormatedBankList,
} from "store/slice/WalletSlice";
import { useAppSelector, useAppDispatch } from "store/store.hooks";
import { handleError } from "utils";
import { showToast } from "store/store.hooks";
import { BankDetails } from "Models/wallet";
import { ChevronRight } from "assets/Icons/ChevronRight";
import { BankIcon } from "assets/Icons/BankIcon";
import { PlusCircleIcon } from "assets/Icons/PlusCircleIcon";
import { TrashIcon } from "assets/Icons/TrashIcon";
import RemoveAccountModal from "./RemoveAccountModal";
import { MenuItem, Select, Skeleton } from "@mui/material";

type WithdrawalModalProps = {
  openModal: boolean;
  closeModal: () => void;
  openPinModal: () => void;
};

type WithdrawalFeilds = {
  bankCode: string;
  accountNumber: string;
};

type AccountNumberType = {
  id: number;
  store_id?: number;
  bank_code: string;
  bank_name: string;
  account_number: string;
  is_primary?: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: null;
  account_name: string;
};

const WalletWithdrawalModals = ({
  openModal,
  closeModal,
  openPinModal,
}: WithdrawalModalProps) => {
  const [openBeneficiaryModal, setOpenBeneficiaryModal] = useState(false);
  const { data: bankList, isLoading: loadingList } =
    useGetListOfFincraBankQuery();
  const [isVerificationFlowCompleted, setIsVerificationFlowCompleted] =
    useState(false);
  const [
    lookUpWithdrawalAccount,
    {
      data: accountDetails,
      isLoading: loadingAccountDetails,
      isError: lookupError,
      isSuccess: lookupSuccess,
    },
  ] = useLookUpWithdrawalAccountMutation();
  const [
    addWithdrawalAccount,
    { data: completeAccountDetails, isLoading: loadingCompleteAccountDetails },
  ] = useAddWithdrawalAccountMutation();
  const [deleteWithdrawalAccount, { isLoading: loadingCompleteDeleteAccount }] =
    useDeleteWithdrawalAccountMutation();
  const { data: addedAccountList, isLoading: isLoadingAddedAccount } =
    useGetListOfAddedAccountQuery();
  const [isManageAccount, setIsManageAccount] = useState(false);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [beneficiaryList, setBeneficiaryList] = useState([]);
  const [details, setDetails] = useState<any>({});
  const [activeId, setActiveId] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const dispatch = useAppDispatch();
  const selectedBankList = useAppSelector(selectFincraBankList);
  const selectedFormatedBankList = useAppSelector(selectFormatedBankList);

  const methods = useForm<WithdrawalFeilds>({
    mode: "all",
  });

  const {
    formState: { isValid },
    handleSubmit,
    watch,
  } = methods;

  const watchedBankCode = watch("bankCode");
  const watchedAccountNumber = watch("accountNumber");

  const LookUpBankUser = async (bankCode: string, accountNumber: string) => {
    try {
      const payload = {
        bankCode,
        accountNumber,
      };

      let result = await lookUpWithdrawalAccount({ body: payload, lookup: 1 });
      if ("data" in result) {
        setAccountName(result?.data?.data?.account_name);
        setIsVerificationFlowCompleted(true);
      } else {
        handleError(result);
        setIsVerificationFlowCompleted(false);
      }
    } catch (error) {
      handleError(error);
      setIsVerificationFlowCompleted(false);
    }
  };

  useEffect(() => {
    if (
      watchedBankCode &&
      watchedAccountNumber &&
      watchedAccountNumber.length === 10
    ) {
      LookUpBankUser(watchedBankCode, watchedAccountNumber);
    }
  }, [watchedBankCode, watchedAccountNumber]);

  const onSubmit: SubmitHandler<WithdrawalFeilds> = async (data) => {
    try {
      const payload = {
        bankCode: data.bankCode,
        accountNumber: data.accountNumber,
      };

      let result = await addWithdrawalAccount({ body: payload });
      if ("data" in result) {
        setOpenBeneficiaryModal(true);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const removeAccount = async (id: number) => {
    try {
      let result = await deleteWithdrawalAccount({ walletId: id });
      if ("data" in result) {
        setOpenRemoveModal(false);
        setIsManageAccount(false);
        showToast("Account Deleted Successfully", "success");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const manageAccount = (item: any) => {
    setOpenRemoveModal(true);
    setActiveId(item?.id);
  };

  const manageBenefeciaryModal = (item: any) => {
    setOpenBeneficiaryModal(true);
    setDetails(item);
  };

  useEffect(() => {
    if (bankList) {
      const list: any = {};
      bankList?.data?.map((item: BankDetails) => {
        const newId = item.id;
        const newCode = item.code;
        list[newCode] = newId;
      });
      dispatch(setFincraBankList(bankList?.data));
      dispatch(setFormatedBankList(list));
    }
  }, [bankList]);

  useEffect(() => {
    if (accountDetails) {
      setDetails(completeAccountDetails?.data);
    }
  }, [completeAccountDetails]);

  useEffect(() => {
    if (addedAccountList) {
      setBeneficiaryList(addedAccountList?.data);
    }
  }, [addedAccountList]);

  return (
    <div className="pd_withdrawal-modal">
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="h-full ">
            <div className="modal_right_children">
              <div className="top_section">
                <ModalRightTitle
                  closeModal={() => {
                    closeModal();
                  }}
                  title="Withdraw Money"
                  extraChild={
                    beneficiaryList.length ? (
                      <button
                        onClick={() => {
                          setIsManageAccount(true);
                        }}
                        type="button"
                        className="manage-withdrawal"
                        disabled={isLoadingAddedAccount}
                      >
                        Manage
                      </button>
                    ) : (
                      <div className="text-grey-01 text-sm">
                        Enter bank details below to withdraw money
                      </div>
                    )
                  }
                />

                {isLoadingAddedAccount ? (
                  <div className="flex flex-col space-y-1 mx-6">
                    <Skeleton
                      animation="wave"
                      height={"8rem"}
                      className="rounded-[16px]"
                    />
                    <Skeleton
                      animation="wave"
                      height={"8rem"}
                      className="rounded-[16px]"
                    />
                    <Skeleton
                      animation="wave"
                      height={"8rem"}
                      className="rounded-[16px]"
                    />
                  </div>
                ) : (
                  <>
                    {/* when there are no beneficiary and form to add beneficiary */}
                    {(!beneficiaryList.length || showForm) && (
                      <div className="brief_form">
                        <SelectField
                          name="bankCode"
                          required={true}
                          isLoading={loadingList}
                          label="Bank"
                          selectOption={
                            bankList?.data
                              ? bankList?.data?.map((item: any) => {
                                  return { key: item.name, value: item.code };
                                })
                              : []
                          }
                        />

                        <ValidatedInput
                          name="accountNumber"
                          label="Account Number"
                          type={"text"}
                          suffix={
                            loadingAccountDetails &&
                            !isVerificationFlowCompleted && (
                              <div className="animate-[spin_1s_linear_infinite] w-6 h-6 border-4 border-primary rounded-full border-t-transparent"></div>
                            )
                          }
                        />

                        {lookupError && (
                          <div
                            className={`flex items-center space-x-2 px-5 py-4 rounded-[8px] font-light bg-pastel-red `}
                          >
                            <span>
                              {" "}
                              <FailedCheckIcon />
                            </span>{" "}
                            <span>Error: </span>{" "}
                            <span>There is no name match</span>
                          </div>
                        )}

                        {lookupSuccess && (
                          <div
                            className={`flex items-center space-x-2 px-5 py-4 rounded-[8px] font-light bg-pastel-green }`}
                          >
                            <span>
                              <FullCheckedCircleIcon />
                            </span>{" "}
                            <span>{accountName}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* when there are existing beneficiaries */}
                    {beneficiaryList.length && !showForm && (
                      <div className="brief_form">
                        <p className="text-grey-01">
                          Select a back account below.
                        </p>

                        <div>
                          {beneficiaryList?.map((item: AccountNumberType) => (
                            <div
                              onClick={() => {
                                isManageAccount
                                  ? manageAccount(item)
                                  : manageBenefeciaryModal(item);
                              }}
                              className="flex justify-between space-x-6 mt-3 bg-light-grey py-5 px-8 rounded-[16px] items-center cursor-pointer"
                            >
                              <div className="flex space-x-3 items-center">
                                <span>
                                  <BankIcon stroke="#009444" />
                                </span>
                                <div>
                                  <div className="text-sm text-grey-01">
                                    {item?.account_name}
                                  </div>
                                  <div className="text-base font-medium text-black-02">
                                    {item?.account_number} - {item?.bank_name}
                                  </div>
                                </div>
                              </div>
                              <div className="cursor-pointer">
                                {isManageAccount ? (
                                  <span
                                    onClick={() => {
                                      manageAccount(item);
                                    }}
                                  >
                                    <TrashIcon stroke="#D90429" />
                                  </span>
                                ) : (
                                  <span
                                    onClick={() => manageBenefeciaryModal(item)}
                                  >
                                    <ChevronRight />
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div
                          className="flex space-x-2 mt-3 items-center cursor-pointer"
                          onClick={() => {
                            setShowForm(true);
                          }}
                        >
                          <span>
                            <PlusCircleIcon />
                          </span>
                          <span className="text-primary">
                            Add a new bank account
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {(!beneficiaryList.length || showForm) && (
                <div className="bottom_section">
                  <Button type="button" className="cancel" onClick={closeModal}>
                    Cancel
                  </Button>
                  <LoadingButton
                    type="submit"
                    className="save"
                    disabled={!isVerificationFlowCompleted || !isValid}
                    loading={loadingCompleteAccountDetails}
                  >
                    Continue
                  </LoadingButton>
                </div>
              )}
            </div>
          </form>
        </FormProvider>
      </ModalRight>

      {openBeneficiaryModal && (
        <BenefeciaryDetailsModal
          details={details}
          openModal={openBeneficiaryModal}
          closeModal={() => setOpenBeneficiaryModal(false)}
          openPinModal={() => {
            openPinModal();
            setOpenBeneficiaryModal(false);
          }}
        />
      )}
      {openRemoveModal && (
        <RemoveAccountModal
          openModal={openRemoveModal}
          closeModal={() => setOpenRemoveModal(false)}
          btnAction={() => {
            removeAccount(activeId);
          }}
          isLoading={loadingCompleteDeleteAccount}
        />
      )}
    </div>
  );
};

export default WalletWithdrawalModals;
