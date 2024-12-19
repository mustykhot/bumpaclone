import Modal from "components/Modal";
import { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Button, IconButton } from "@mui/material";
import ValidatedTextArea from "components/forms/ValidatedTextArea";
import { XIcon } from "assets/Icons/XIcon";
import { showToast } from "store/store.hooks";

type ScriptModalProps = {
  openModal: boolean;
  closeModal: () => void;
  integration_code: string | null;
  isLoading: boolean;
  submitScript: (
    value: { integration_code: string; integration_type: string },
    callback?: () => void
  ) => void;
};
type ScriptFormField = {
  integration_code: string;
  integration_type: string;
};
export const GoogleAnalyticsModal = ({
  closeModal,
  openModal,
  integration_code,
  isLoading,
  submitScript,
}: ScriptModalProps) => {
  const methods = useForm<ScriptFormField>({
    mode: "all",
  });

  const {
    formState: { isValid },
    setValue,
    handleSubmit,
  } = methods;

  const onSubmit: SubmitHandler<ScriptFormField> = (data) => {
    submitScript(data, () => {
      closeModal();
    });
  };

  useEffect(() => {
    if (integration_code) {
      setValue("integration_code", integration_code);
      setValue("integration_type", "google_analytics");
    }
  }, [integration_code]);

  return (
    <>
      <Modal openModal={openModal} closeModal={closeModal}>
        <div className="connect_modal pixel">
          <div className="top_box">
            <div className="left_section">
              <h2>Connect Google Analytics</h2>
              <p>Measure and optimise your ad campaigns</p>
            </div>
            <IconButton
              type="button"
              onClick={() => {
                closeModal();
              }}
              className="icon_button_container pad"
            >
              <XIcon />
            </IconButton>
          </div>
          <FormProvider {...methods}>
            <form className="mt-[30px]" onSubmit={handleSubmit(onSubmit)}>
              <ValidatedTextArea
                name="integration_code"
                label="Paste your google analytics code here"
                height="h-[120px]"
              />
              <div className="btn_flex">
                <Button
                  variant="outlined"
                  onClick={() => {
                    closeModal();
                  }}
                  className="add"
                  type="button"
                >
                  Cancel
                </Button>{" "}
                <Button
                  variant="contained"
                  className="add primary_styled_button"
                  type="submit"
                  disabled={!isValid}
                >
                  {isLoading ? (
                    <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
                  ) : (
                    "Connect Google Analytics"
                  )}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </Modal>
    </>
  );
};
