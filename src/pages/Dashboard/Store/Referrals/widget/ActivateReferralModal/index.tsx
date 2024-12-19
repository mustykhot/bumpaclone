import { Button, CircularProgress, IconButton } from "@mui/material";
import "./style.scss";
import { CheckedCircleIcon } from "assets/Icons/CheckedCircleIcon";
import { XIcon } from "assets/Icons/XIcon";
import BumpaReferrals from "assets/images/BumpaReferrals.svg";
import Modal from "components/Modal";

type ActivateReferralModalProps = {
  openModal: boolean;
  closeModal: () => void;
  btnAction: Function;
  isLoading: boolean;
};

const benefitsList = [
  {
    text: "Share your referral code or link with them",
  },
  {
    text: "Encourage them to subscribe to any Bumpa plan",
  },
  {
    text: "You earn 10% of the subscription fee",
  },
];

export const ActivateReferralModal = ({
  closeModal,
  openModal,
  btnAction,
  isLoading,
}: ActivateReferralModalProps) => {
  return (
    <Modal openModal={openModal} closeModal={closeModal}>
      <div className="activate_referral_modal">
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
          <h2>Refer and Earn!</h2>
          <p>
            Introduce Bumpa to business owners like yourself & earn when they
            subscribe.
          </p>
        </div>
        <div className="card_section">
          <div className="card_section--text">
            <h3>It’s simple and easy!</h3>
            {benefitsList?.map((item: any, i: number) => (
              <div key={i} className="card_section--list">
                <CheckedCircleIcon strokeWidth={1} />
                <p>{item.text}</p>
              </div>
            ))}
          </div>
          <div className="card_section--image">
            <img src={BumpaReferrals} alt="Referral" />
          </div>
        </div>
        <div className="button_container">
          <Button
            onClick={() => {
              btnAction();
            }}
            variant="contained"
            className="primary primary_styled_button"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress
                size="1.5rem"
                sx={{ zIndex: 10, color: "#ffffff" }}
              />
            ) : (
              "Join now"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
