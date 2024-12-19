import { IconButton } from "@mui/material";
import Modal from "components/Modal";
import meta from "assets/images/meta2.png";
import { metaAppList } from "../Meta";
import { Button } from "@mui/material";
import "./style.scss";
import { XIcon } from "assets/Icons/XIcon";

type ConnecMetaModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const ConnecMetaModal = ({
  closeModal,
  openModal,
}: ConnecMetaModalProps) => {
  return (
    <>
      <Modal openModal={openModal} closeModal={closeModal}>
        <div className="connect_modal">
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

          <img
            className="meta_image"
            src={meta}
            width={154}
            height={30}
            alt="meta"
          />

          <h2>Connect to Facebook, Instagram and Messenger</h2>

          <div className="integrations">
            {metaAppList.map((item) => {
              return (
                <div className="single_integration">
                  <img src={item.image} alt="app" />
                  <div className="text_box">
                    <h5>{item.name}</h5>
                    <p>{item.extraDescription}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="button_container">
            <Button variant="contained" className="primary">
              Connect to Meta
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
