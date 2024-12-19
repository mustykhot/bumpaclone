import { IconButton } from "@mui/material";
import { LargeMaintenanceIcon } from "assets/Icons/LargeMaintenanceIcon";
import { XIcon } from "assets/Icons/XIcon";
import Modal from "components/Modal";

type MaintainanceModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const MaintenanceModeModal = ({
  closeModal,
  openModal,
}: MaintainanceModalProps) => {
  return (
    <>
      <Modal openModal={openModal} closeModal={closeModal}>
        <div className={`cancel_subscription_modal success`}>
          <div className="cancel_section">
            <div className="text_box"></div>
            <IconButton
              onClick={() => {
                closeModal();
              }}
              className="icon_button_container"
            >
              <XIcon />
            </IconButton>
          </div>
          <div className="cancel_successful_container">
            <LargeMaintenanceIcon />
            <h3>Maintenance Mode</h3>
            <p>Complete the onboarding steps to launch your website.</p>
          </div>
        </div>
      </Modal>
    </>
  );
};
