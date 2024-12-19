import { IconButton } from "@mui/material";
import Modal from "components/Modal";
import google from "assets/images/google-L.png";
import { Button } from "@mui/material";
import "./style.scss";
import { XIcon } from "assets/Icons/XIcon";
import { BuildingIcon } from "assets/Icons/BuildingIcon";
import { ShoppingCartIcon } from "assets/Icons/ShoppingCartIcon";
import { useState } from "react";
import { RightArrowIcon } from "assets/Icons/RightArrowIcon";
import { PhoneIcon } from "assets/Icons/PhoneIcon";
import { MessageDotSquareIcon } from "assets/Icons/MessageDotSquareIcon";
import { MailIcon } from "assets/Icons/MailIcon";
import { SwitchHorizontalOutlineIcon } from "assets/Icons/SwitchHorizontalOutlineIcon";
import { BumpaIcon } from "assets/Icons/BumpaIcon";
import CircularProgress from "@mui/material/CircularProgress";

type ConnectGoogleModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const googleFeatureList = [
  {
    icon: <BuildingIcon stroke="#009444" />,
    description:
      "Add a CTA to your FB page, get better analytics with pixel, & sell more via ads. ",
    title: "More Visisbility",
  },
  {
    icon: <ShoppingCartIcon stroke="#009444" />,
    description:
      "Add a CTA to your FB page, get better analytics with pixel, & sell more via ads. ",
    title: "Sell more online",
  },
];

const methodList = [
  {
    icon: <PhoneIcon stroke="#009444" />,
    description: "A call will be placed to ",
    code: "092843828",
    title: "Phone Call Verification",
    method: "call",
  },
  {
    icon: <MessageDotSquareIcon />,
    description: "SMS will be sent to  ",
    code: "092843828",
    title: "SMS Verification",
    method: "sms",
  },
  {
    icon: <MailIcon stroke="#009444" />,
    description: "Email will be sent to ",
    code: "bumpa@email.com",
    title: "Email Verification",
    method: "email",
  },
];

export const ConnectGoogleModal = ({
  closeModal,
  openModal,
}: ConnectGoogleModalProps) => {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<string | null>(null);
  const goNext = (val: number) => {
    setStep(step + val);
  };
  return (
    <>
      <Modal openModal={openModal} closeModal={closeModal}>
        <div className="connect_modal google_connection">
          {step === 0 && (
            <div className="first_step">
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
                src={google}
                width={94}
                height={94}
                alt="google"
              />

              <h2>Connect to Google My Business</h2>

              <div className="integrations">
                {googleFeatureList.map((item, i) => {
                  return (
                    <div key={i} className="single_integration">
                      {item.icon}
                      <div className="text_box">
                        <h5>{item.title}</h5>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="button_container">
                <Button
                  onClick={() => {
                    goNext(1);
                  }}
                  variant="contained"
                  className="primary"
                >
                  Connect to Google My Business{" "}
                </Button>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="second_step">
              <IconButton
                onClick={() => {
                  goNext(-1);
                }}
                className="icon_button_container"
              >
                <RightArrowIcon className=" rotate-180 " />
              </IconButton>
              <div className="google_container">
                <img
                  className="meta_image"
                  src={google}
                  width={64}
                  height={64}
                  alt="google"
                />
                <h4>Google Verification</h4>
                <p>
                  To verify your Google My Business account, select a
                  verification method below.
                </p>
              </div>
              <div className="integrations">
                {methodList.map((item, i) => {
                  return (
                    <div
                      onClick={() => {
                        setMethod(item.method);
                      }}
                      className={`single_integration ${
                        method === item.method ? "active" : ""
                      }`}
                      key={i}
                    >
                      {item.icon}
                      <div className="text_box">
                        <h5>{item.title}</h5>
                        <p>
                          {item.description} <span>{item.code}</span>{" "}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="button_container">
                <Button
                  onClick={() => {
                    goNext(1);
                  }}
                  variant="contained"
                  className="primary"
                >
                  Continue{" "}
                </Button>
                <Button
                  onClick={() => {
                    closeModal();
                  }}
                  variant="outlined"
                  className="cancel"
                >
                  Cancel{" "}
                </Button>
              </div>{" "}
            </div>
          )}
          {step === 2 && (
            <div className="third_step">
              <div className="image_box">
                <img src={google} width={64} height={64} alt="google" />
                <SwitchHorizontalOutlineIcon className="switch" />
                <BumpaIcon />
              </div>
              <h2>Connecting to Google</h2>
              <p>This will only take a few seconds</p>
              <CircularProgress />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
