import Modal from "components/Modal";
import warning_img from "assets/images/warning.png";
import verified from "assets/images/identity.png";
import error_circle from "assets/images/error-circle.png";
import check_circle from "assets/images/checkcircle.png";


import { Button, IconButton } from "@mui/material";
// import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  isVerified: boolean;
  isFailed?: boolean;
  inProgress?: boolean;
};

const VerifyIdentityModal = ({
  closeModal,
  openModal,
  isVerified,
  inProgress,
  isFailed
}: propType) => {

  return (
    <>
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
        {/* verification success &&*/}
        {inProgress && (
          <div className="modal_body sucess_body">
          <img
          src={warning_img}
          alt=""
          style={{ margin: "auto", marginTop: "24px", marginBottom: "24px" }}
        />
        {/* </div> */}
        <h3 className="success_pin">Verification in Progress</h3>
        <p className="success_p text-center">We’re currently verifying your identity. This <br />usually takes 5 minutes or less. We’ll let you <br />know once your identity is verfied</p>
          <Button
            variant="contained"
            className="pin_btn pin_suucess_btn"
            onClick={() => closeModal()}
          >
            Okay
          </Button>
        </div>  
        )}
        
        {/* verification failed && */}
        {isVerified && (
          <div className="modal_body sucess_body pt-24">
          <img
          // src={verified}
          src={check_circle}
          alt=""
          style={{ margin: "auto", marginTop: "24px", marginBottom: "24px" }}
        />
        {/* </div> */}
        <h3 className="success_pin">I.D Submitted</h3>
        <p className="success_p text-center">We’re currently verifying your identity. This usually takes 5 minutes or less. We’ll let you know once your identity is verfied</p>
          <Button
            variant="contained"
            className="pin_btn pin_suucess_btn"
            onClick={() => closeModal()}
          >
            Okay
          </Button>
        </div>  
        )}

{isFailed && (
          <div className="modal_body sucess_body pt-24">
          <img
          src={error_circle}
          alt=""
          style={{ margin: "auto", marginTop: "24px", marginBottom: "24px" }}
        />
        {/* </div> */}
        <h3 className="success_pin">Verification Failed</h3>
        <p className="success_p text-center">We’re unable to verify your identity.</p>
          <Button
            variant="contained"
            className="pin_btn pin_suucess_btn"
            // onClick={() => closeModal()}
          >
            Try Again
          </Button>
        </div>  
        )}
        
      </div>
    </Modal>

    {/* verification  */}
    </>
    
  );
};

export default VerifyIdentityModal;
