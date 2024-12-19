import { Button, IconButton } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import "./style.scss";
import { XIcon } from "assets/Icons/XIcon";
import TerminalPayment from "assets/images/terminal-payment.png";

type PropType = {
  openModal: boolean;
  closeModal: () => void;
  btnAction: () => void;
};

const TerminalModal = ({ openModal, closeModal, btnAction }: PropType) => {
  return (
    <>
      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "just" }}
            className={`pd_terminal_modal_container`}
          >
            <div className="cover_update_container">
              <IconButton
                onClick={() => {
                  closeModal();
                }}
                className="cancel_box"
              >
                <XIcon />
              </IconButton>
              <img src={TerminalPayment} alt="terminal" className="image_box" />
              <div className="text_section">
                <div className="single_text">
                  <h4 className="title">
                    Protect your business from fake bank alerts
                  </h4>
                  <p className="description">
                    With Bumpa Terminal, you and your staff can quickly confirm
                    offline payments in 15 seconds and efficiently track them.
                  </p>
                </div>
                <Button
                  variant="contained"
                  className="primary_styled_button"
                  onClick={() => {
                    btnAction();
                  }}
                >
                  Learn more
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TerminalModal;
