import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { XIcon } from "assets/Icons/XIcon";
import Modal from "components/Modal";
import { IStoreInformation } from "Models/store";
import { useUpdateStoreInformationMutation } from "services";
import { selectCurrentStore, setStoreDetails } from "store/slice/AuthSlice";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";
import { CancelVerificationModal } from "../KycComponents/CancelVerification/CancelVerification";

type UpdateBusinessNameModalProps = {
  openModal: boolean;
  closeModal: () => void;
  handleNextStep: Function;
  handleCancel: Function;
};

type UpdateBusinessNameFields = {
  business_name?: string;
};

export const UpdateBusinessNameModal = ({
  closeModal,
  openModal,
  handleNextStep,
  handleCancel,
}: UpdateBusinessNameModalProps) => {
  const dispatch = useAppDispatch();
  const userStore = useAppSelector(selectCurrentStore);
  const [step, setStep] = useState<number>(1);
  const [openCancelVerificationModal, setOpenCancelVerificationModal] =
    useState(false);
  const [updateStoreInformation, { isLoading: updateLoading }] =
    useUpdateStoreInformationMutation();

  const methods = useForm<UpdateBusinessNameFields>({
    mode: "all",
  });

  const { setValue } = methods;

  const onSubmit = async (data: IStoreInformation): Promise<void> => {
    try {
      const result = await updateStoreInformation(data);
      if ("data" in result) {
        showToast("Business Name Updated Successfully", "success");
        dispatch(setStoreDetails(result.data.store));
        handleNextStep();
        setStep(1);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleContinue = () => {
    handleNextStep();
  };

  useEffect(() => {
    if (userStore) {
      setValue("business_name", userStore.business_name, {
        shouldValidate: true,
      });
    }
  }, [userStore, setValue]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepOne onContinue={handleContinue} onUpdate={() => setStep(2)} />
        );
      case 2:
        return <StepTwo onSave={() => setStep(3)} />;
      case 3:
        return (
          <StepThree
            onCancel={() => setStep(2)}
            onSubmit={onSubmit}
            isLoading={updateLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={closeModal}
        closeOnOverlayClick={false}
      >
        <div className={`update_profile_modal ${step === 3 ? "three" : ""}`}>
          {step !== 3 && (
            <div className="cancel_section">
              <IconButton
                onClick={() => {
                  setOpenCancelVerificationModal(true);
                }}
                className="icon_button_container"
              >
                <XIcon />
              </IconButton>
            </div>
          )}
          <div className="step_container">
            <FormProvider {...methods}>{renderStep()}</FormProvider>
          </div>
        </div>
      </Modal>
      {openCancelVerificationModal && (
        <CancelVerificationModal
          openModal={openCancelVerificationModal}
          closeModal={() => setOpenCancelVerificationModal(false)}
          handleCancelVerification={() => {
            handleCancel();
            setOpenCancelVerificationModal(false);
          }}
          handleDismissVerification={() => {
            setOpenCancelVerificationModal(false);
          }}
        />
      )}
    </>
  );
};
