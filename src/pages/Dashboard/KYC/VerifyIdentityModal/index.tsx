import { Button, IconButton } from "@mui/material";
import "./style.scss";
import { BankIcon } from "assets/Icons/BankIcon";
import { CertificateIcon } from "assets/Icons/CertificateIcon";
import { MarkerPinIcon } from "assets/Icons/MarkerPinIcon";
import { UserIdIcon } from "assets/Icons/UserIdIcon";
import { XIcon } from "assets/Icons/XIcon";
import prembly from "assets/images/prembly.png";
import Verified from "assets/images/Verified.png";
import Modal from "components/Modal";

type VerifyIdentityModalProps = {
  openModal: boolean;
  closeModal: () => void;
  btnAction: Function;
};

const verficationList = [
  {
    text: "National Identification Number (NIN)",
    icon: <UserIdIcon />,
  },
  {
    text: "Bank Verification Number (BVN)",
    icon: <BankIcon stroke="#009444" />,
  },
  {
    text: "CAC Document Verification",
    icon: <CertificateIcon />,
  },
];

export const VerifyIdentityModal = ({
  closeModal,
  openModal,
  btnAction,
}: VerifyIdentityModalProps) => {
  return (
    <>
      <Modal openModal={openModal} closeModal={closeModal}>
        <div className="verify_identity_modal">
          <div className="cancel_section">
            <IconButton
              onClick={() => {
                closeModal();
              }}
              className="icon_button_container"
            >
              <XIcon />
            </IconButton>
          </div>
          <h2>Let’s verify your identity</h2>
          <p className="description">
            Due to recent regulatory requirements from the Central Bank of
            Nigeria, all Bumpa users are required to verify their identity
            before receiving settlement.
          </p>
          <div className="box">
            <div className="box_text">
              <h3>You’ll need the following to get verified:</h3>
              <div className="box_list">
                {verficationList.map((verify, i) => (
                  <div className="box_list--each" key={i}>
                    {verify.icon}
                    <p>{verify.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="box_img">
              <img src={Verified} alt="Verified" />
            </div>
          </div>
          <div className="button_container">
            <Button
              onClick={() => {
                btnAction();
              }}
              variant="contained"
              className="primary primary_styled_button"
            >
              Continue
            </Button>
          </div>
          <div className="powered-by">
            <h4>Powered by</h4>
            <img src={prembly} alt="Prembly" />
          </div>
        </div>
      </Modal>
    </>
  );
};
