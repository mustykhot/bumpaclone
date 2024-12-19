import "./style.scss";
import { AddProductForm } from "pages/Dashboard/Products/AddProduct";
import Modal from "components/Modal";

type AddProductModalProps = {
  openModal: boolean;
  closeModal?: () => void;
  extraFnc?: any;
};

export const AddProductModal = ({
  openModal,
  extraFnc,
  closeModal,
}: AddProductModalProps) => (
  <Modal
    closeOnOverlayClick={false}
    className="white_background"
    closeModal={() => {}}
    openModal={openModal}
  >
    <div className="product_form_modal">
      <AddProductForm
        extraFnc={(item: any) => {
          extraFnc && extraFnc(item);
        }}
        discardFnc={() => {
          closeModal && closeModal();
        }}
      />
    </div>
  </Modal>
);
