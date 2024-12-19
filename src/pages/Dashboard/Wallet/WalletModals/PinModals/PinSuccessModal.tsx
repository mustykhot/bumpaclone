import Modal from "components/Modal";
import check_circle from "../../../../../assets/images/checkcircle.png";
import { Button, IconButton } from "@mui/material";
import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";

type propType = {
  openModal: boolean;
  closeModal: () => void;
};

const PinSuccessModal = ({
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
        {/* <div className="icon_wrapper"> */}
        <div className="modal_body sucess_body">
          <img
          src={check_circle}
          alt=""
          style={{ margin: "auto", marginTop: "24px", marginBottom: "24px" }}
        />
        {/* </div> */}
        <h3 className="success_pin">PIN Changed</h3>
        <p className="success_p">Your PIN has been changed successfully</p>
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

export default PinSuccessModal;
