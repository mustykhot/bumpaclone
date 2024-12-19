import { Button, IconButton } from "@mui/material";
import "./style.scss";
import { XIcon } from "assets/Icons/XIcon";
import TerminalBannerImage from "assets/images/terminal-banner-image.svg";
import Modal from "components/Modal";

type TerminalGetStartedModalProps = {
  openModal: boolean;
  closeModal: () => void;
  btnAction: Function;
};

const benefitsList = [
  {
    benefit: "Staff can confirm payment via Whatsapp",
    desc: "You can add up to 5 people to receive payment alerts on WhatsApp and but only you can see your account balance",
  },
  {
    benefit: "Eliminates fraudulent bank transfers",
    desc: "You can receive payments in 30 seconds and get notified instantly for confirmation",
  },
  {
    benefit: "Business bank account",
    desc: "Bumpa terminal gives you an account number in your business name",
  },
  {
    benefit: "Fast settlement",
    desc: "Payments are settled into your primary bank account in less than 24 hours.",
  },
];

export const TerminalGetStartedModal = ({
  closeModal,
  openModal,
  btnAction,
}: TerminalGetStartedModalProps) => {
  return (
    <>
      <Modal openModal={openModal} closeModal={closeModal}>
        <div className="terminal_getstarted_modal">
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
          <div className="terminal_getstarted_modal--main">
            <div className="header_section">
              <img src={TerminalBannerImage} alt="Bumpa Terminal Logo" />
              <h2>What is Bumpa Terminal?</h2>
              <p className="description">
                Bumpa terminal is a product by Bumpa that allows you to confirm
                payments instantly.
              </p>
            </div>
            <div className="benefits_section">
              <h3>Benefits</h3>
              <div className="benefits_list">
                {benefitsList.map((benefit, i) => (
                  <div className="benefits_list--each" key={i}>
                    <h4>{benefit.benefit}</h4>
                    <p>{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="charges_section">
              <div className="charges_section--main">
                <h4>Transaction Charges</h4>
                <div className="charges_section--pricing">
                  <div className="charges_section--pricing_each">
                    <p>For transactions below ₦1000</p>
                    <h5>₦50</h5>
                  </div>
                  <div className="charges_section--pricing_each">
                    <p>For transactions below ₦5000</p>
                    <h5>₦75</h5>
                  </div>
                  <div className="charges_section--pricing_each">
                    <p>For transactions ₦5000 & above</p>
                    <h5>₦100</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="button_container">
              <Button
                onClick={() => {
                  if (typeof mixpanel !== "undefined") {
                    mixpanel.track("web_terminal_benefits");
                  }
                  btnAction();
                }}
                variant="contained"
                className="primary_styled_button"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
