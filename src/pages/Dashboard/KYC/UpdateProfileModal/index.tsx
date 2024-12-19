import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import "./style.scss";
import { XIcon } from "assets/Icons/XIcon";
import Modal from "components/Modal";
import { useUpdateStoreProfileMutation } from "services";
import { selectCurrentUser, setUserDetails } from "store/slice/AuthSlice";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";
import { StepFour } from "./StepFour";

type UpdateProfileModalProps = {
  openModal: boolean;
  closeModal: () => void;
  handleNextStep: Function;
};

type UpdateProfileFields = {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  date_of_birth?: string;
  desired_kyc_tier?: number | null;
};

export const UpdateProfileModal = ({
  closeModal,
  openModal,
  handleNextStep,
}: UpdateProfileModalProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [step, setStep] = useState<number>(1);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [updateProfile, { isLoading: isUpdateLoading }] =
    useUpdateStoreProfileMutation();

  const methods = useForm<UpdateProfileFields>({
    mode: "all",
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      date_of_birth: "",
      desired_kyc_tier: null,
    },
  });

  const { setValue, reset } = methods;

  const onSubmit = async (data: UpdateProfileFields): Promise<void> => {
    try {
      const result = await updateProfile(data);
      if ("data" in result) {
        showToast("Profile Updated Successfully", "success");
        dispatch(setUserDetails(result.data.user));
        handleNextStep();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleContinue = () => {
    setStep(4);
  };

  useEffect(() => {
    if (openModal) {
      setStep(1);
    }
  }, [openModal]);

  useEffect(() => {
    if (user) {
      setValue("first_name", user.first_name, { shouldValidate: true });
      setValue("middle_name", user.middle_name);
      setValue("last_name", user.last_name, { shouldValidate: true });
      setValue("date_of_birth", user.date_of_birth, { shouldValidate: true });
    }
  }, [user, setValue]);

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
            onContinue={() => setStep(4)}
          />
        );
      case 4:
        return (
          <StepFour
            selectedTier={selectedTier}
            setSelectedTier={setSelectedTier}
            onSubmit={onSubmit}
            isLoading={isUpdateLoading}
          />
        );
      default:
        return null;
    }
  };

  const handleCloseModal = () => {
    reset();
    closeModal();
  };

  return (
    <Modal
      openModal={openModal}
      closeModal={handleCloseModal}
      closeOnOverlayClick={false}
    >
      <div className={`update_profile_modal ${step === 3 ? "three" : ""}`}>
        {step !== 3 && (
          <div className="cancel_section">
            <IconButton
              onClick={() => {
                closeModal();
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
  );
};
