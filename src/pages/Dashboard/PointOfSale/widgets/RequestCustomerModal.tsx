import Modal from "components/Modal";
import { Button, IconButton } from "@mui/material";
import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  btnAction1?: () => void;
  btnAction2?: () => void;
};

const RequestCustomerModal = ({
  closeModal,
  openModal,
  btnAction1,
  btnAction2,
}: propType) => {
  return (
    <Modal
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
      closeOnOverlayClick={false}
    >
      <div className="success_wrap">
        <div className="success_wrap_title">
          <h3>Add Customer</h3>
          <IconButton
            onClick={() => closeModal()}
            type="button"
            className="close_btn_wrap"
          >
            <CloseSqIcon />
          </IconButton>
        </div>

        <p>Add Customer Details to this order. You can skip this.</p>

        <div className="btns">
          <Button
            variant="contained"
            onClick={() => {
              btnAction1 && btnAction1();
              closeModal();
            }}
            className="view_order_btn"
          >
            Add Customer
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              btnAction2 && btnAction2();
              closeModal();
            }}
            className=" receipt_btn"
          >
            Skip and Proceed to Checkout
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RequestCustomerModal;
