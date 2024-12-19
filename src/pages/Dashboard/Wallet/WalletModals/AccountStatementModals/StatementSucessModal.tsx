import Modal from "components/Modal";
import check_circle from "../../../../../assets/images/checkcircle.png";
import { Button, IconButton } from "@mui/material";
import CloseSqIcon from "assets/Icons/CloseSqIcon";

type propType = {
  openModal: boolean;
  closeModal: () => void;
};

const StatementSuccessModal = ({
  closeModal,
  openModal,
}: propType) => {

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
        <div className="modal_body sucess_body">
          <img
          src={check_circle}
          alt=""
          style={{ margin: "auto", marginTop: "24px", marginBottom: "24px" }}
        />
        <h3 className="success_pin">Statement of Account Sent</h3>
        <p className="success_p text-center">Your statement of account has been sent to<br />  your email address.</p>
          <Button
            variant="contained"
            className="pin_btn pin_suucess_btn"
            onClick={() => closeModal()}
          >
            Done
          </Button>
        </div>
        
      </div>
    </Modal>
  );
};

export default StatementSuccessModal;
