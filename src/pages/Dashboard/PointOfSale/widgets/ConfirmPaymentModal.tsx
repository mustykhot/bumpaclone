import Modal from "components/Modal";
import info_circle from "assets/images/info-circle.png";
import { Button, CircularProgress, IconButton } from "@mui/material";
import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { useState } from "react";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  btnAction?: (cb?: () => void) => void;
  isLoading?: boolean;
  total?: string;
};

const ConfirmPaymentModal = ({
  closeModal,
  openModal,
  btnAction,
  isLoading,
  total,
}: propType) => {
  const [disable, setDisable] = useState(false);
  return (
    <>
      <Modal
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
        closeOnOverlayClick={false}
      >
        <div className="success_wrap">
          <div
            className="close_btn"
            onClick={() => {
              if (!disable) {
                closeModal();
              }
            }}
          >
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
                setDisable(true);
                btnAction &&
                  btnAction(() => {
                    setDisable(false);
                  });
              }}
              className="receipt_btn"
              disabled={disable}
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
                if (!disable) {
                  closeModal();
                }
              }}
              className="view_order_btn decline"
            >
              Payment not recieved
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmPaymentModal;
