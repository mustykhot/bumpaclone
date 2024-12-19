import { useState } from "react";
import { Button, Checkbox, IconButton } from "@mui/material";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import Modal from "components/Modal";
import bubblebumpa from "assets/images/bubblebumpa.png";

type ModalProps = {
  openModal: boolean;
  closeModal: () => void;
  connectShipBubble: () => void;
};

const ShipBubbleCheck = ({
  openModal,
  closeModal,
  connectShipBubble,
}: ModalProps) => {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={() => {
          closeModal();
        }}
      >
        <div className="meta_mdl_wrap">
          <div className={"close_btn"}>
            <IconButton
              type="button"
              className="back_btn_wrap"
              onClick={() => closeModal()}
            >
              <CloseSqIcon />
            </IconButton>
          </div>
          <div className={"details_wrap"}>
            <div className="first_content">
              <img src={bubblebumpa} alt="IgXBumpa" />
              <h2>Shipbubble Integration</h2>
              <p className="first_p para">
                Take advantage of shipbubble’s advanced shipping features to
                take delivery to the next level.
              </p>

              <div className="bullet_pts">
                <ul>
                  <li>
                    Sell Products faster on Instagram when you power your DM
                    with Bumpa tools.
                  </li>
                  <li>
                    Automatically record all IG sales & get business analytics
                    from Instagram.
                  </li>
                  <li>
                    Establish yourself as a Pro IG vendor with receipts &
                    invoices you can easily share on Instagram.
                  </li>
                  <li>
                    Easy pick up any IG conversation from where they stop with a
                    simple search on Bumpa
                  </li>
                  <li>
                    Secure your Instagram contacts & conversations even if you
                    lose your IG account.
                  </li>
                </ul>
              </div>
              <div className="terms_and_condition">
                <Checkbox
                  className="check_box"
                  checked={checked}
                  onChange={() => {
                    setChecked(!checked);
                  }}
                />
                <p>I agree to shipbubble’s terms and conditions</p>
              </div>
              <Button
                className="cnct_meta_btn"
                disabled={!checked}
                onClick={() => {
                  connectShipBubble();
                }}
              >
                Connect
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ShipBubbleCheck;
