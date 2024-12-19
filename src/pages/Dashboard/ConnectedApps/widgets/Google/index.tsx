import { useState } from "react";
import { Button } from "@mui/material";
import google from "assets/images/google.png";
import { LinkBrokenIcon } from "assets/Icons/LinkBrokenIcon";
import { LinkIcon } from "assets/Icons/LinkIcon";
import { CheckedCircleIcon } from "assets/Icons/CheckedCircleIcon";
import { ConnectGoogleModal } from "../Modals/ConnectGoogleModal";
type MetaProps = {};



export const Google = ({}: MetaProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="general_conneccted_app_container google">
      <div className="title_flex">
        <div className="title_container">
          <img src={google} alt="app" className="app_image" />
          <h4>Google</h4>
        </div>
        {isConnected && (
          <div className="connected_box">
            <CheckedCircleIcon /> <p>Connected</p>
          </div>
        )}
      </div>

      <p className="description">Connect to Facebook, Instagram & Messenger</p>

      <Button
        onClick={() => {
          if (isConnected) {
          } else {
            setOpenModal(true);
          }
        }}
        startIcon={isConnected ? <LinkBrokenIcon /> : <LinkIcon />}
        className={`connect_button ${isConnected ? "connected" : ""}`}
      >
        {isConnected ? "Disconnect" : "Connect"}
      </Button>
      <ConnectGoogleModal
        openModal={openModal}
        closeModal={() => {
          setOpenModal(false);
        }}
      />
    </div>
  );
};
