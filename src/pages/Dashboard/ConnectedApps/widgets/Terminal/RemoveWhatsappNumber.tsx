import { LoadingButton } from "@mui/lab";
import { Button, IconButton } from "@mui/material";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { XIcon } from "assets/Icons/XIcon";
import Modal from "components/Modal";
import { useRemoveNotificationNumberMutation } from "services";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";

type RemoveWhatsappNumberModalProps = {
  openModal: boolean;
  closeModal: () => void;
  onSuccess: () => void;
  terminalId: number;
  phoneNumber: string;
};

export const RemoveWhatsappNumberModal = ({
  openModal,
  closeModal,
  onSuccess,
  terminalId,
  phoneNumber,
}: RemoveWhatsappNumberModalProps) => {
  const [removeNotificationNumber, { isLoading }] =
    useRemoveNotificationNumberMutation();

  const handleRemove = async () => {
    try {
      const result = await removeNotificationNumber({
        terminal_id: terminalId,
        whatsapp_numbers: [phoneNumber],
      });

      if ("data" in result) {
        showToast("WhatsApp number removed successfully", "success");
        onSuccess();
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
      <div className="remove_whatsapp_modal">
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
          <div className="icon_section">
            <TrashIcon stroke="#5C636D" />
          </div>
          <div className="header_section">
            <h2>Confirm to remove number</h2>
            <p>Are you sure you want to remove {phoneNumber}</p>
          </div>
          <div className="button_section">
            <LoadingButton
              onClick={handleRemove}
              loading={isLoading}
              disabled={isLoading}
              variant="contained"
              color="error"
              fullWidth
            >
              Remove
            </LoadingButton>
            <Button onClick={closeModal} variant="text">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
