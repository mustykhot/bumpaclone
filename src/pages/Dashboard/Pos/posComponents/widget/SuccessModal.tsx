import Modal from "components/Modal";
import ModalRight from "components/ModalRight";
import check_circle from "../../../../../assets/images/checkcircle.png";
import { Button, IconButton } from "@mui/material";
import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { OrderType } from "Models/order";
import { useNavigate } from "react-router-dom";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  setShowDetails: (val: boolean) => void;
  createdOrder: OrderType | null;
};

const SuccessModal = ({
  closeModal,
  setShowDetails,
  openModal,
  createdOrder,
}: propType) => {
  const handleDownloadInvoice = () => {
    if (createdOrder) {
      window.open(createdOrder.invoice_pdf, "_blank");
    }
  };
  const navigate = useNavigate();
  return (
    <Modal
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <div className="success_wrap">
        <div className="close_btn" onClick={() => closeModal()}>
          <IconButton type="button" className="close_btn_wrap">
            <CloseSqIcon />
          </IconButton>
        </div>
        {/* <div className="icon_wrapper"> */}
        <img
          src={check_circle}
          alt=""
          style={{ margin: "auto", marginTop: "24px", marginBottom: "24px" }}
        />
        {/* </div> */}
        <h3>Checkout Succesful</h3>
        <p>You've Succesfully recorded an order</p>
        <div className="btns">
          <Button
            onClick={() => {
              handleDownloadInvoice();
              setShowDetails(false);
            }}
            variant="contained"
            className="receipt_btn"
          >
            Print Receipt
          </Button>
          <Button
            onClick={() => {
              setShowDetails(false);
              navigate(`/dashboard/orders/${createdOrder?.id}?isFirst=${true}`);
            }}
            variant="contained"
            className="view_order_btn primary_styled_button"
          >
            View Order
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;
