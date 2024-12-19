import { IconButton } from "@mui/material";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import "./style.scss";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import Modal from "components/Modal";
import {
  useLazyCheckLinkTerminalQuery,
  useLinkTerminalMutation,
} from "services";
import { handleError } from "utils";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { TerminalSuccessModal } from "../ResponseModals/TerminalSuccessModal";
import { TerminalFailModal } from "../ResponseModals/TerminalFailModal";

type LinkTerminalModalProps = {
  openModal: boolean;
  closeModal: () => void;
  handleLinkTerminalSuccess: () => void;
  handleCloseStatusModal: () => void;
};

export type LinkTerminalModalField = {
  account_number: string;
};

export type InfoType = {
  account_number: string;
  account_name: string;
};

export const LinkTerminalModal = ({
  closeModal,
  openModal,
  handleLinkTerminalSuccess,
  handleCloseStatusModal,
}: LinkTerminalModalProps) => {
  const [step, setStep] = useState<number>(1);
  const [terminalAccountInfo, setTerminalAccountInfo] =
    useState<InfoType | null>(null);
  const [openLinkSuccessModal, setOpenLinkSuccessModal] = useState(false);
  const [linkTerminalAccountInfo, setLinkTerminalAccountInfo] = useState();
  const [openLinkFailModal, setOpenLinkFailModal] = useState(false);
  const [linkErrorMessage, setLinkErrorMessage] = useState({});

  const [triggerCheckLinkTerminal, { isLoading: isCheckLinkLoading }] =
    useLazyCheckLinkTerminalQuery();
  const [linkTerminal, { isLoading: isLinkTerminalLoading }] =
    useLinkTerminalMutation();

  const methods = useForm<LinkTerminalModalField>({
    mode: "all",
  });

  const { reset } = methods;

  const handleCheckLink: SubmitHandler<LinkTerminalModalField> = async (
    data
  ) => {
    try {
      const result = await triggerCheckLinkTerminal(data);
      if ("data" in result) {
        setTerminalAccountInfo(result.data.data);
        setStep(2);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleLinkTerminal: SubmitHandler<LinkTerminalModalField> = async (
    data
  ) => {
    try {
      const result = await linkTerminal(data);
      if ("data" in result) {
        if (typeof mixpanel !== "undefined") {
          mixpanel.track("web_link_terminal_complete");
        }
        handleLinkTerminalSuccess();
        setLinkTerminalAccountInfo(result.data.data);
        setOpenLinkSuccessModal(true);
      } else {
        setLinkErrorMessage(result.error);
        setOpenLinkFailModal(true);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleLinkTerminalFromStepTwo = () => {
    const formData = methods.getValues();
    if (formData.account_number) {
      handleLinkTerminal(formData);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepOne
            onSubmit={handleCheckLink}
            onCancel={() => {
              handleCloseStatusModal();
              handleCloseModal();
            }}
            isLoading={isCheckLinkLoading}
          />
        );
      case 2:
        return (
          <StepTwo
            backAction={handleBack}
            nextAction={handleLinkTerminalFromStepTwo}
            onCancel={() => {
              handleCloseStatusModal();
              handleCloseModal();
            }}
            info={terminalAccountInfo}
            isLoading={isLinkTerminalLoading}
          />
        );
      default:
        return null;
    }
  };

  const handleCloseModal = () => {
    reset();
    setStep(1);
    setTerminalAccountInfo(null);
    closeModal();
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      if (step === 2) {
        setTerminalAccountInfo(null);
      }
    } else {
      handleCloseModal();
    }
  };

  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={handleCloseModal}
        closeOnOverlayClick={false}
      >
        <div className={`link_terminal_modal`}>
          {step !== 2 && (
            <div className="back_section">
              <IconButton
                type="button"
                className="back_btn_wrap"
                onClick={handleBack}
              >
                <BackArrowIcon />
              </IconButton>
            </div>
          )}
          <div className="step_container">
            <FormProvider {...methods}>{renderStep()}</FormProvider>
          </div>
        </div>
      </Modal>
      {openLinkSuccessModal && (
        <TerminalSuccessModal
          openModal={openLinkSuccessModal}
          closeModal={() => {
            setOpenLinkSuccessModal(false);
            handleCloseModal();
          }}
          info={linkTerminalAccountInfo}
        />
      )}
      {openLinkFailModal && (
        <TerminalFailModal
          openModal={openLinkFailModal}
          closeModal={() => setOpenLinkFailModal(false)}
          errorMessage={linkErrorMessage}
          handleTryAgain={() => {
            openModal;
            setStep(1);
            setOpenLinkFailModal(false);
          }}
          handleOpenCancelModal={() => {
            handleCloseStatusModal();
            handleCloseModal();
            setOpenLinkFailModal(false);
          }}
        />
      )}
    </>
  );
};
