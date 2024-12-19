import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, IconButton } from "@mui/material";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import congrats from "assets/images/congrats.png";
import { PlayIcon } from "assets/Icons/PlayIcon";
import Modal from "components/Modal";
import { showVideoModal } from "store/store.hooks";
import "./style.scss";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  closeTempModal: () => void;
  loadCloseFnc: boolean;
};

const updateList: {
  title: string;
  description: string;
  video_iframe?: ReactNode;
  video_title?: string;
  page_link?: string;
}[] = [
  {
    title: "Messaging Credits are Available & Cheaper on the App",
    description:
      "Purchase messaging credits directly on the app & get them cheaper the more you buy.",
  },
  {
    title: "Bumpa Terminal is now on the App",
    description:
      "Get/Connect a Terminal account number to your app & view Terminal payments under Transactions.",
  },
  {
    title: "Better SMS Reporting",
    description:
      "Get real time reports on SMS with the View Reports tab after sending a campaign.",
  },
  {
    title: "Email Campaigns Update",
    description:
      "Email campaigns now cost two messaging credits & new email templates are coming soon on the app.",
  },
  {
    title: "SMS Delivery",
    description:
      "For better delivery rates, it is recommended to send SMS campaigns between 8 am - 8 pm & refrain from using special characters like #, *",
  },
];

const FeatureUpdateModal = ({
  closeModal,
  openModal,
  loadCloseFnc,
  closeTempModal,
}: propType) => {
  const navigate = useNavigate();
  return (
    <Modal
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
      closeOnOverlayClick={false}
    >
      <div className="improvement_modal_wrap">
        <div className="close_btn">
          <img src={congrats} alt="congrats" />
          <IconButton
            onClick={() => {
              closeModal();
            }}
            type="button"
            className="close_btn_wrap"
          >
            {loadCloseFnc ? (
              <CircularProgress
                size="1.5rem"
                sx={{ zIndex: 10, color: "#222D37" }}
              />
            ) : (
              <CloseSqIcon />
            )}
          </IconButton>
        </div>

        <div className="improvement_container">
          <div className="top_container">
            <p className="first_description">What's New</p>
            <p className="second_description">
              New product updates and bug fixes available now on the app.
            </p>
          </div>

          <div className="list_container">
            {updateList.map((item, i) => (
              <div key={i} className="single_update">
                <p className="title">{item.title}</p>
                <p className="description">{item.description}</p>
                {item.video_iframe ? (
                  <Button
                    onClick={() => {
                      showVideoModal(
                        true,
                        item.video_iframe,
                        item?.video_title || ""
                      );
                    }}
                    variant="contained"
                    className="primary_styled_button"
                    startIcon={<PlayIcon />}
                  >
                    Watch video tutorial
                  </Button>
                ) : item.page_link ? (
                  <Button
                    onClick={() => {
                      closeTempModal();
                      navigate(`${item.page_link}`);
                    }}
                    variant="outlined"
                  >
                    Try it out
                  </Button>
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FeatureUpdateModal;
