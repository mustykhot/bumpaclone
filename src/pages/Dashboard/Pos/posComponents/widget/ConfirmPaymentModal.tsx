import Modal from "components/Modal";
import ModalRight from "components/ModalRight";
import info_circle from "../../../../../assets/images/info-circle.png";
import { Button, CircularProgress, IconButton } from "@mui/material";
import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  btnAction?: () => void;
  isLoading?: boolean;
  total: string;
};

const ConfirmPaymentModal = ({
  closeModal,
  openModal,
  btnAction,
  isLoading,
  total,
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
        <div className="close_btn" onClick={() => closeModal()}>
          <IconButton type="button" className="close_btn_wrap">
            <CloseSqIcon />
          </IconButton>
        </div>
        {/* <div className="icon_wrapper"> */}
        <img
          src={info_circle}
          alt=""
          style={{ margin: "auto", marginTop: "24px", marginBottom: "24px" }}
        />
        {/* </div> */}
        <h3>Confirm payment</h3>
        <p>Have you received the payment for this order?</p>
        <div className="pos_amount">
          <span className="amount">Amount: </span>{" "}
          <span className="price">{total}</span>
        </div>
        <div className="btns">
          <Button
            variant="contained"
            onClick={() => {
              btnAction && btnAction();
            }}
            className="receipt_btn"
          >
            {isLoading ? (
              <CircularProgress size="1.5rem" sx={{ color: "#009444" }} />
            ) : (
              "Payment Received"
            )}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              closeModal();
            }}
            className="view_order_btn decline"
          >
            Payment declined
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmPaymentModal;
