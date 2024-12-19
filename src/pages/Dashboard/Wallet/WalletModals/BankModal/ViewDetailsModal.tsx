import { useState } from "react";
import Modal from "components/Modal";
import img from "../../../../../assets/images/wallet_bank.png";
import { Button, IconButton } from "@mui/material";
// import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import BankModalDetails from "./BankModalDetails";

type propType = {
  openModal: boolean;
  closeModal: () => void;
};

const MyBankDetailsModal = ({
  closeModal,
  openModal,
}: propType) => {

  const [showBankDetailsModal, setShowBankDetailsModal] = useState(false)


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
        {/* <div className="icon_wrapper"> */}
        <div className="modal_body sucess_body">
          <img
          src={img}
          alt=""
          style={{ margin: "auto", marginTop: "24px", marginBottom: "24px" }}
        />
        {/* </div> */}
        <h3 className="success_pin">Bumpa Bank Account</h3>
        <p className="success_p text-center">You can use your bank account to receive payment <br /> from your customers both offline and online</p>
          <Button
            variant="contained"
            className="pin_btn pin_suucess_btn"
            onClick={() => setShowBankDetailsModal(true)}
          >
            View My Bank Account
          </Button>
        </div>
        
      </div>
    </Modal>

    <BankModalDetails 
      openModal={showBankDetailsModal}
      closeModal={() => setShowBankDetailsModal(false)}
    />
    </>
    
  );
};

export default MyBankDetailsModal;
