import { Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { XIcon } from "assets/Icons/XIcon";
import FastTime from "assets/images/FastTime.png";
import Modal from "components/Modal";

type FreeTrialExpiryModalProps = {
  openModal: boolean;
  closeModal: () => void;
  expired: boolean;
  expiring: boolean;
  remainingDays: number | null;
  daysText: string;
  slug: string;
};

const FreeTrialExpiryModal = ({
  closeModal,
  openModal,
  expired,
  expiring,
  remainingDays,
  daysText,
  slug,
}: FreeTrialExpiryModalProps) => {
  const navigate = useNavigate();

  const navigatePath = expired
    ? `/dashboard/subscription/select-plan?type=upgrade&slug=${slug}`
    : `/dashboard/subscription/select-plan?type=subscribe&slug=${slug}`;
  const buttonText = expired ? "Upgrade Your Account" : "Subscribe";

  return (
    <Modal
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <div className="freetrial_expiry_modal">
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
        <div className="image_section">
          <img src={FastTime} alt="Clock" />
        </div>
        <div className="text_section">
          {expired && <h2>Your Free Trial Has Ended!</h2>}
          {expiring && (
            <h2>
              Your Free Trial Ends in {remainingDays} {daysText}!
            </h2>
          )}
          {expired && (
            <p>Your account has been downgraded to a Bumpa Basic plan.</p>
          )}
          {expiring && (
            <p>
              You will lose access to all premium features soon. Keep exploring
              the app or upgrade your account to unlock more exciting features.
            </p>
          )}
        </div>
        <div className="discount_section">
          {expired && (
            <p>
              If you would like to keep your premium features, use the discount
              code: <span className="welcome">WELCOME10</span> to get a{" "}
              <span className="percent">10%</span> discount off any subscription
              plan.
            </p>
          )}
          {expiring && (
            <p>
              Use the discount code:{" "}
              <span className="welcome">WELCOME2024</span> to get a{" "}
              <span className="percent">20%</span> discount on any subscription
              plan, if you subscribe today.
            </p>
          )}
        </div>
        <div className="button_container">
          <Button
            onClick={() => {
              navigate(navigatePath);
              closeModal();
            }}
            variant="contained"
            className="primary primary_styled_button"
          >
            {buttonText}
          </Button>
          {expired && (
            <Button
              onClick={() => {
                closeModal();
              }}
              variant="outlined"
            >
              Skip, I’ll do this later
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default FreeTrialExpiryModal;
