import { IconButton } from "@mui/material";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import "./style.scss";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import Modal from "components/Modal";
import { useGetTerminalMutation } from "services";
import { handleError } from "utils";
import { TerminalFailModal } from "../ResponseModals/TerminalFailModal";
import { TerminalSuccessModal } from "../ResponseModals/TerminalSuccessModal";
import { StepThree } from "./StepThree";

type GetTerminalModalProps = {
  openModal: boolean;
  closeModal: () => void;
  handleGetTerminalSuccess: () => void;
  handleCloseStatusModal: () => void;
};

export type GetTerminalModalField = {
  whatsapp_numbers: string[];
};

export const GetTerminalModal = ({
  closeModal,
  openModal,
  handleGetTerminalSuccess,
  handleCloseStatusModal,
}: GetTerminalModalProps) => {
  const [openGetSuccessModal, setOpenGetSuccessModal] = useState(false);
  const [openGetFailModal, setOpenGetFailModal] = useState(false);
  const [getErrorMessage, setGetErrorMessage] = useState({});
  const [getTerminal, { isLoading: isGetTerminalLoading }] =
    useGetTerminalMutation();

  const methods = useForm<GetTerminalModalField>({
    mode: "all",
    defaultValues: {
      whatsapp_numbers: ["", "", "", "", ""],
    },
  });

  const { reset } = methods;

  const handleGetTerminal: SubmitHandler<GetTerminalModalField> = async (
    data
  ) => {
    try {
      const result = await getTerminal({
        whatsapp_numbers: data.whatsapp_numbers,
      });

      if ("data" in result) {
        if (typeof mixpanel !== "undefined") {
          mixpanel.track("web_get_terminal_complete");
        }
        handleGetTerminalSuccess();
        setOpenGetSuccessModal(true);
      } else {
        setGetErrorMessage(result.error);
        setOpenGetFailModal(true);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleCloseModal = () => {
    reset();
    closeModal();
  };

  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={handleCloseModal}
        closeOnOverlayClick={false}
      >
        <div className={`get_terminal_modal three`}>
          <div className="back_section">
            <IconButton
              type="button"
              className="back_btn_wrap"
              onClick={() => closeModal()}
            >
              <BackArrowIcon />
            </IconButton>
          </div>
          <div className="step_container">
            <FormProvider {...methods}>
              <StepThree
                onSubmit={handleGetTerminal}
                isLoading={isGetTerminalLoading}
              />
            </FormProvider>
          </div>
        </div>
      </Modal>
      {openGetSuccessModal && (
        <TerminalSuccessModal
          from="getTerminal"
          openModal={openGetSuccessModal}
          closeModal={() => {
            setOpenGetSuccessModal(false);
            handleCloseModal();
          }}
        />
      )}
      {openGetFailModal && (
        <TerminalFailModal
          from="getTerminal"
          openModal={openGetFailModal}
          closeModal={() => setOpenGetFailModal(false)}
          errorMessage={getErrorMessage}
          handleTryAgain={() => {
            openModal;
            setOpenGetFailModal(false);
          }}
          handleOpenCancelModal={() => {
            handleCloseStatusModal();
            handleCloseModal();
            setOpenGetFailModal(false);
          }}
        />
      )}
    </>
  );
};
