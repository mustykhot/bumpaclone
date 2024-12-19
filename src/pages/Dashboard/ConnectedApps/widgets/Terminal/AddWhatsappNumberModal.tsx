import { LoadingButton } from "@mui/lab";
import { IconButton } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { XIcon } from "assets/Icons/XIcon";
import ValidatedInput from "components/forms/ValidatedInput";
import Modal from "components/Modal";
import { useAddNotificationNumberMutation } from "services";
import { showToast } from "store/store.hooks";
import { formatPhoneNumber, handleError, validatePhoneNumber } from "utils";

type AddWhatsappNumberModalProps = {
  openModal: boolean;
  closeModal: () => void;
  terminalId: number;
};

type WhatsappFormData = {
  whatsapp_number: string;
};

export const AddWhatsappNumberModal = ({
  openModal,
  closeModal,
  terminalId,
}: AddWhatsappNumberModalProps) => {
  const [addNotificationNumber, { isLoading }] =
    useAddNotificationNumberMutation();

  const methods = useForm<WhatsappFormData>({
    mode: "all",
    defaultValues: {
      whatsapp_number: "",
    },
  });

  const onSubmit = async (data: WhatsappFormData) => {
    try {
      const formattedNumber = formatPhoneNumber(data.whatsapp_number);
      const result = await addNotificationNumber({
        terminal_id: terminalId,
        whatsapp_numbers: [formattedNumber],
      });

      if ("data" in result) {
        showToast("WhatsApp number added successfully", "success");
        closeModal();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Modal openModal={openModal} closeModal={closeModal}>
      <div className="add_whatsapp_modal">
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
        <div className="main">
          <div className="header_section">
            <h2>Add WhatsApp Number</h2>
            <p>Enter the whatsapp number below</p>
          </div>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <ValidatedInput
                name="whatsapp_number"
                type="tel"
                phoneWithDialCode
                rules={{
                  validate: (value) => validatePhoneNumber(value, false),
                }}
              />
              <LoadingButton
                type="submit"
                loading={isLoading}
                disabled={isLoading || !methods.formState.isValid}
                variant="contained"
                fullWidth
              >
                Save
              </LoadingButton>
            </form>
          </FormProvider>
        </div>
      </div>
    </Modal>
  );
};
