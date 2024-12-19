import "./style.scss";
import Modal from "components/Modal";
import CreateShipping from "pages/Dashboard/Store/ShippingFee/CreateShipping";

type AddShippingMethodModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const AddShippingMethodModal = ({
  openModal,
  closeModal,
}: AddShippingMethodModalProps) => {
  return (
    <Modal
      className="white_background"
      closeOnOverlayClick={false}
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <div className="shipping_method_modal">
        <CreateShipping
          fromCompleteStore={true}
          closeShippingMethodModal={closeModal}
        />
      </div>
    </Modal>
  );
};
