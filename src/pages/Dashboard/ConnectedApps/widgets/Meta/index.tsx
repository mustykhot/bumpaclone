import { useState } from "react";
import { Button } from "@mui/material";
import meta from "assets/images/meta.png";
import { LinkBrokenIcon } from "assets/Icons/LinkBrokenIcon";
import { LinkIcon } from "assets/Icons/LinkIcon";
import { CheckedCircleIcon } from "assets/Icons/CheckedCircleIcon";
import facebook from "assets/images/facebook.png";
import instagram from "assets/images/instagram.png";
import pixel from "assets/images/pixel.png";
import messanger from "assets/images/messanger.png";
import "./style.scss";
import { Toggle } from "components/Toggle";
import { ConnecMetaModal } from "../Modals/ConnectMetaModal";
import { GeneralModal } from "../Modals/GeneralModal";
import { SuccessfulConnectionModal } from "../Modals/SuccessfulConnectionModal";
type MetaProps = {};
type SingleMetaType = {
  title: string;
  description: string;
  image: any;
  checked: boolean;
};
export const SingleMeta = ({
  title,
  description,
  image,
  checked,
}: SingleMetaType) => {
  return (
    <div className="pd_single_meta">
      <div className="top">
        <img src={image} alt="meta" />
        <h4>{title}</h4>
        <Toggle toggled={checked} />
      </div>
      <p> {description} </p>
    </div>
  );
};

export const metaAppList = [
  {
    name: "Facebook",
    checked: false,
    image: facebook,
    description: "Start selling on facebook",
    extraDescription:
      "Add a CTA to your FB page, get better analytics with pixel, & sell more via ads. ",
  },
  {
    name: "Instagram",
    checked: false,
    image: instagram,
    description: "Start selling on instagram",
    extraDescription:
      "Add a CTA to your FB page, get better analytics with pixel, & sell more via ads. ",
  },
  {
    name: "Pixels",
    checked: false,
    image: pixel,
    description: "Start selling on facebook",
    extraDescription:
      "Add a CTA to your FB page, get better analytics with pixel, & sell more via ads. ",
  },
  {
    name: "Messanger",
    checked: false,
    image: messanger,
    description: "Start selling on facebook",
    extraDescription:
      "Add a CTA to your FB page, get better analytics with pixel, & sell more via ads. ",
  },
];

export const Meta = ({}: MetaProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openMetaModal, setOpenMetaModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  return (
    <div
      className={`general_conneccted_app_container meta ${
        isConnected ? "connected" : ""
      }`}
    >
      <div className="meta_flex">
        <div className="left">
          {" "}
          <div className="title_flex">
            <div className="title_container">
              <img src={meta} alt="app" className="app_image" />
              <h4>Meta</h4>
            </div>
            {isConnected && (
              <div className="connected_box">
                <CheckedCircleIcon /> <p>Connected</p>
              </div>
            )}
          </div>
          <p className="description">
            Connect to Facebook, Instagram & Messenger
          </p>
          <Button
            onClick={() => {
              setOpenModal(true);
            }}
            startIcon={isConnected ? <LinkBrokenIcon /> : <LinkIcon />}
            className={`connect_button ${isConnected ? "connected" : ""}`}
          >
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
        </div>
        {isConnected && (
          <div className="right">
            {metaAppList.map(({ name, description, image, checked }, i) => (
              <SingleMeta
                title={name}
                description={description}
                image={image}
                checked={checked}
                key={i}
              />
            ))}
          </div>
        )}
      </div>

      <ConnecMetaModal
        openModal={openModal}
        closeModal={() => {
          setOpenModal(false);
        }}
      />

      <GeneralModal
        openModal={openMetaModal}
        btnText={"Link Instagram"}
        image={<img src={instagram} width={100} height={100} alt="instagram" />}
        title="Connect to Instagram"
        description={
          "Link your business to your instagram account and start selling through Bumpa "
        }
        closeModal={() => {
          setOpenMetaModal(false);
        }}
      />
      <SuccessfulConnectionModal
        openModal={openSuccessModal}
        isFailed={true}
        closeModal={() => {
          setOpenSuccessModal(false);
        }}
        title="Connected to Instagram"
        description="You can now conclude sales on instagram DM through Bumpa"
      />
    </div>
  );
};
