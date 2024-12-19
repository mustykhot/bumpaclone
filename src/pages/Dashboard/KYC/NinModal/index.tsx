import { LoadingButton } from "@mui/lab";
import { Stepper, Step, StepLabel, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import prembly from "assets/images/prembly.png";
import { XIcon } from "assets/Icons/XIcon";
import Modal from "components/Modal";
import ValidatedInput from "components/forms/ValidatedInput";
import { useLinkNinMutation } from "services";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  selectCurrentStore,
  selectCurrentUser,
  setUserDetails,
} from "store/slice/AuthSlice";
import { handleError } from "utils";
import { CancelVerificationModal } from "../KycComponents/CancelVerification/CancelVerification";
import { NinFailModal } from "./NinFailModal";

type NinModalProps = {
  openModal: boolean;
  closeModal: () => void;
  handleSuccess: Function;
  handleCancel: Function;
};

type NinField = {
  nin: string;
};

export const NinModal = ({
  closeModal,
  openModal,
  handleSuccess,
  handleCancel,
}: NinModalProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const userStore = useAppSelector(selectCurrentStore);
  const [linkNin, { isLoading: isLinkNinLoading }] = useLinkNinMutation();
  const [openNinFailModal, setOpenNinFailModal] = useState(false);
  const [ninErrorMessage, setNinErrorMessage] = useState({});
  const [openCancelVerificationModal, setOpenCancelVerificationModal] =
    useState(false);

  const steps =
    user?.desired_kyc_tier === 2
      ? ["BVN Verification", "NIN Verification", "CAC Verification"]
      : ["BVN Verification", "NIN Verification"];
  const activeStep = user?.bvn_verified_at !== null ? 1 : 0;

  const methods = useForm<NinField>({
    mode: "all",
  });

  const {
    formState: { isValid },
    handleSubmit,
    reset,
  } = methods;

  const onSubmit: SubmitHandler<NinField> = async (data) => {
    try {
      const result = await linkNin(data);
      if ("data" in result) {
        if (typeof _cio !== "undefined") {
          _cio.track("web_nin_successful");
        }
        if (typeof mixpanel !== "undefined") {
          mixpanel.track("web_nin_successful");
        }
        dispatch(setUserDetails(result.data.user));
        handleSuccess();
      } else {
        if (typeof _cio !== "undefined") {
          _cio.track("web_nin_fail");
        }
        if (typeof mixpanel !== "undefined") {
          mixpanel.track("web_nin_fail");
        }
        setNinErrorMessage(result.error);
        setOpenNinFailModal(true);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getStatusTextAndClass = (label: string) => {
    if (label === "BVN Verification" && user?.bvn_verified_at !== null) {
      return { text: "Completed", className: "completed" };
    }
    if (label === "NIN Verification" && user?.nin_verified_at !== null) {
      return { text: "Completed", className: "completed" };
    }
    if (label === "CAC Verification" && userStore?.cac !== null) {
      return { text: "Completed", className: "completed" };
    }
    if (activeStep === 0 && label === "BVN Verification") {
      return { text: "In Progress", className: "in-progress" };
    }
    if (activeStep === 1 && label === "NIN Verification") {
      return { text: "In Progress", className: "in-progress" };
    }
    return { text: "Pending", className: "pending" };
  };

  const handleCloseModal = () => {
    reset();
    closeModal();
  };

  const handleCancelVerification = () => {
    reset();
    setOpenCancelVerificationModal(false);
    handleCancel();
  };

  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={handleCloseModal}
        closeOnOverlayClick={false}
      >
        <div className="bvn_modal">
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
          <div className="main">
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => {
                const { text: statusText, className: statusClass } =
                  getStatusTextAndClass(label);

                return (
                  <Step
                    key={label}
                    completed={
                      (label === "BVN Verification" &&
                        user?.bvn_verified_at !== null) ||
                      (label === "NIN Verification" &&
                        user?.nin_verified_at !== null) ||
                      (label === "CAC Verification" && userStore?.cac !== null)
                    }
                  >
                    <StepLabel>
                      <span className="step">STEP {index + 1}</span>
                      <h4>{label}</h4>
                      <span className={`status ${statusClass}`}>
                        {statusText}
                      </span>
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="box">
                  <div className="box--header">
                    <h2>NIN Verification</h2>
                    <p>Enter your NIN to continue</p>
                  </div>
                  <div className="box--dial">
                    <p>
                      Dial <span>*346*0#</span> to get your NIN from your
                      registered line
                    </p>
                  </div>
                  <ValidatedInput
                    name="nin"
                    placeholder="Enter your NIN"
                    type="text"
                    rules={{
                      validate: (value) =>
                        value?.length == 11 || "Your NIN must be 11 characters",
                    }}
                    maxLength={11}
                    required
                  />
                  <div className="button_container">
                    <LoadingButton
                      onClick={handleSubmit(onSubmit)}
                      loading={isLinkNinLoading}
                      disabled={isLinkNinLoading || !isValid}
                      variant="contained"
                    >
                      Verify
                    </LoadingButton>
                    <p
                      onClick={() => {
                        setOpenCancelVerificationModal(true);
                      }}
                    >
                      Cancel
                    </p>
                  </div>
                </div>
              </form>
            </FormProvider>
            <div className="powered-by">
              <h4>Powered by</h4>
              <img src={prembly} alt="Prembly" />
            </div>
          </div>
        </div>
      </Modal>
      {openNinFailModal && (
        <NinFailModal
          openModal={openNinFailModal}
          closeModal={() => setOpenNinFailModal(false)}
          errorMessage={ninErrorMessage}
          handleOpenCancelModal={() => {
            reset();
            setOpenNinFailModal(false);
            setOpenCancelVerificationModal(true);
          }}
        />
      )}
      {openCancelVerificationModal && (
        <CancelVerificationModal
          openModal={openCancelVerificationModal}
          closeModal={() => setOpenCancelVerificationModal(false)}
          handleCancelVerification={handleCancelVerification}
          handleDismissVerification={() => {
            setOpenCancelVerificationModal(false);
          }}
        />
      )}
    </>
  );
};
