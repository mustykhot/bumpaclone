import Modal from "components/Modal";
import ModalRight from "components/ModalRight";
import error_circle from "../../../../../assets/images/error-circle.png";
import { Button, IconButton } from "@mui/material";
import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  btnAction: () => void;
};

const PaymentFailed = ({ closeModal, openModal, btnAction }: propType) => {
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
          src={error_circle}
          alt=""
          style={{ margin: "auto", marginTop: "24px", marginBottom: "24px" }}
        />
        {/* </div> */}
        <h3>Checkout unsuccessful</h3>
        <p>
          Couldn’t complete checkout due to network <br />
          error.{" "}
        </p>

        <div className="btns">
          <Button
            onClick={() => {
              btnAction();
            }}
            variant="contained"
            className="view_order_btn primary_styled_button"
          >
            Try Again
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentFailed;
