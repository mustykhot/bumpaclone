import Modal from "components/Modal";
import ModalRight from "components/ModalRight";
import error_circle from "assets/images/error-circle.png";
import { Button, IconButton } from "@mui/material";
import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import ErrorMsg from "components/ErrorMsg";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  errorMsg?: string
//   btnAction: () => void;
};

const FailureLimitModal = ({ closeModal, openModal, errorMsg }: propType) => {
  return (
    <Modal
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <div className="pin_wrap success_pin_wrap">
        <div className="close_btn" onClick={() => closeModal()}>
          <IconButton type="button" className="back_btn_wrap">
            <CloseSqIcon />
          </IconButton>
        </div>
        <div className="modal_body sucess_body sucess_limit">
          <img
          src={error_circle}
          alt=""
          style={{ margin: "auto", marginTop: "24px", marginBottom: "24px" }}
        />
        <h3 className="success_pin">Couldn’t change limit</h3>
        {/* <p className="my-4">
          Couldn’t complete change limit due to network error
        </p> */}
        {errorMsg  && (
        <p className="my-4">{errorMsg}</p>
        )}
          <Button
            variant="contained"
            className="pin_btn pin_suucess_btn"
            onClick={() => closeModal()}
          >
            Try Again
          </Button>
        </div>
        
      </div>
    </Modal>
  );
};

export default FailureLimitModal;
