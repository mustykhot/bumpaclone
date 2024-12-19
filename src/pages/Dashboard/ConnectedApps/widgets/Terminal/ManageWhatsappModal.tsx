import { Button } from "@mui/material";
import { WhatsappIcon } from "assets/Icons/WhatsappIcon";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "./ManageTerminalModal.scss";
import { useState } from "react";
import { AddWhatsappNumberModal } from "./AddWhatsappNumberModal";
import { RemoveWhatsappNumberModal } from "./RemoveWhatsappNumber";

type ModalProps = {
  openModal: boolean;
  closeModal: () => void;
  terminalInfo: any;
};

export const ManageWhatsappModal = ({
  openModal,
  closeModal,
  terminalInfo,
}: ModalProps) => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<string>("");

  const handleRemoveClick = (number: string) => {
    setSelectedNumber(number);
    setOpenRemoveModal(true);
  };

  const handleRemoveSuccess = () => {
    setOpenRemoveModal(false);
    setSelectedNumber("");
  };

  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children manage_whatsapp_modal">
          <div className="top_section">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              title="Manage WhatsApp Number"
              className="whatsapp_top"
            />
            <div className="whatsapp_modal_body">
              <p>
                These are the numbers that will receive WhatsApp notifications
                when you receive a payment. These numbers wouldn’t see your
                account balance in the notification.
                <br />
                <br />
                <span>Note: You can add up to 5 whatsapp numbers</span>
              </p>
              <div className="numbers_section">
                {terminalInfo &&
                  terminalInfo?.data?.whatsapp_phone_numbers.map(
                    (number: string, i: number) => {
                      return (
                        <div className="numbers_section--each" key={i}>
                          <div className="numbers_section--each-no">
                            <WhatsappIcon />
                            <p>{number}</p>
                          </div>
                          <div className="numbers_section--each-button">
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleRemoveClick(number)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      );
                    }
                  )}
              </div>
            </div>
          </div>
          <div className="bottom_section">
            <Button
              variant="contained"
              onClick={() => {
                setOpenAddModal(true);
              }}
              disabled={terminalInfo?.data?.whatsapp_phone_numbers?.length >= 5}
            >
              Add WhatsApp Number
            </Button>
          </div>
        </div>
      </ModalRight>
      {openAddModal && (
        <AddWhatsappNumberModal
          openModal={openAddModal}
          closeModal={() => {
            setOpenAddModal(false);
          }}
          terminalId={terminalInfo?.data?.id}
        />
      )}
      {openRemoveModal && (
        <RemoveWhatsappNumberModal
          openModal={openRemoveModal}
          closeModal={() => {
            setOpenRemoveModal(false);
          }}
          onSuccess={handleRemoveSuccess}
          terminalId={terminalInfo?.data?.id}
          phoneNumber={selectedNumber}
        />
      )}
    </>
  );
};
