import { IconButton } from "@mui/material";
import "./style.scss";
import { XIcon } from "assets/Icons/XIcon";
import Modal from "components/Modal";

type HowItWorksModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const HowItWorksModal = ({
  closeModal,
  openModal,
}: HowItWorksModalProps) => {
  return (
    <Modal openModal={openModal} closeModal={closeModal}>
      <div className="how_it_works_modal">
        <div className="title_section">
          <div className="content"></div>
          <IconButton
            type="button"
            onClick={closeModal}
            className="icon_button_container"
          >
            <XIcon />
          </IconButton>
        </div>
        <div className="header_section">
          <h2>How Referral Works</h2>
        </div>
        <div className="info_section">
          Unlock the power of referrals with your unique Bumpa referral code and
          start earning 10% of the subscription fee for every new merchant you
          bring in.
          <br />
          <br />
          You can use your earnings to pay for your Bumpa subscription or other
          services like domains, additional product space, and more!
          <br />
          <br />
          <h3>Want to Earn Real Cash?</h3>
          Refer 5 subscribers, and you’ll automatically join the{" "}
          <span>Bumpa Champions program</span>, where you can earn up to 15% in
          cash for every new referral!
        </div>
      </div>
    </Modal>
  );
};
