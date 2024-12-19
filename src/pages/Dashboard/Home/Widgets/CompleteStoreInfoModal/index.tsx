import "./style.scss";
import Modal from "components/Modal";
import EditInformation from "pages/Dashboard/Store/StoreInformation/editInformation";

type CompleteStoreInfoModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const CompleteStoreInfoModal = ({
  openModal,
  closeModal,
}: CompleteStoreInfoModalProps) => {
  return (
    <Modal
      className="white_background"
      closeOnOverlayClick={false}
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <div className="complete_store_modal">
        <EditInformation
          fromCompleteStore={true}
          closeStoreInfoModal={closeModal}
        />
      </div>
    </Modal>
  );
};
