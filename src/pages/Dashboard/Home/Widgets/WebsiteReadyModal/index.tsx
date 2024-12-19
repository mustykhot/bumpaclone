import { Button, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { CopyIcon } from "assets/Icons/CopyIcon";
import { Globe02Icon } from "assets/Icons/Globe02Icon";
import { XIcon } from "assets/Icons/XIcon";
import animationData from "assets/images/confetti.json";
import WebsiteReady from "assets/images/WebsiteReady.png";
import Modal from "components/Modal";
import { useCopyToClipboardHook } from "hooks/useCopyToClipboardHook";

type WebsiteReadyModalProps = {
  openModal: boolean;
  closeModal: () => void;
  url: string;
  urlLink: string;
};

const WebsiteReadyModal = ({
  closeModal,
  openModal,
  url,
  urlLink,
}: WebsiteReadyModalProps) => {
  const navigate = useNavigate();

  const [play, setPlay] = useState(false);

  const { isCopied, handleCopyClick } = useCopyToClipboardHook(urlLink);

  const successOptions = {
    loop: 2,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    setPlay(true);
  }, []);

  return (
    <Modal
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <div className="website_ready_modal">
        {play && (
          <div className="lottie_div">
            <Lottie
              isStopped={!play}
              options={successOptions}
              height={400}
              width={400}
            />
          </div>
        )}
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
          <img src={WebsiteReady} alt="Website Ready" />
        </div>
        <div className="text_section">
          <h2>Yaay! Your website is ready!</h2>
          <div className="link">
            <Globe02Icon stroke="#5C636D" strokeWidth={6} />
            <span>{url}</span>
            <span
              onClick={() => {
                handleCopyClick();
              }}
              className="copy"
            >
              {isCopied ? (
                "Copied!"
              ) : (
                <CopyIcon stroke="#009444" strokeWidth={1.5} />
              )}
            </span>
          </div>
          <p>
            Customise your website to make it look better or share your website
            link on social media, so your customers can start shopping.
          </p>
        </div>
        <div className="button_container">
          <Button
            onClick={() => {
              navigate("/dashboard/customisation/customise-theme");
            }}
            variant="outlined"
            className="customise"
          >
            Customise website
          </Button>
          <Button
            onClick={() => {
              window.open(urlLink, "_blank");
            }}
            variant="contained"
            className="primary primary_styled_button"
          >
            View Website
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default WebsiteReadyModal;
