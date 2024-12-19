import Modal from "components/Modal";
import check_circle from "assets/images/checkcircle.png";
import { Button, IconButton } from "@mui/material";
import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { formatPriceNotFixed } from "utils";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  newLimit?: number
};

const SuccessLimitModal = ({
  closeModal,
  openModal,
  newLimit
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
        <div className="modal_body sucess_body sucess_limit">
          <img
          src={check_circle}
          alt=""
          style={{ margin: "auto", marginTop: "24px", marginBottom: "24px" }}
        />
        {/* </div> */}
        <h3 className="success_pin">Limit Changed Successfully</h3>
        <div className="new_limit_wrap">
            <span>Your new limit is</span>
            {newLimit && <h4>{formatPriceNotFixed(newLimit)}</h4>}
            
        </div>
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

export default SuccessLimitModal;
