import { Button, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import "./style.scss";
import { FileAttachmentIcon } from "assets/Icons/FileAttachmentIcon";
import { HardDriveIcon } from "assets/Icons/HardDriveIcon";
import { MarkIcon } from "assets/Icons/MarkIcon";
import { PresentationChartIcon } from "assets/Icons/PresentationChartIcon";
import { ScanIcon } from "assets/Icons/ScanIcon";
import { ShoppingBagIcon } from "assets/Icons/ShoppingBagIcon";
import { ServerIcon } from "assets/Icons/Sidebar/SeverIcon";
import { Tag03Icon } from "assets/Icons/Tag03Icon";
import { XIcon } from "assets/Icons/XIcon";
import animationData from "assets/images/confetti.json";
import FreeTrial from "assets/images/FreeTrial.png";
import Modal from "components/Modal";
import { SubmitButton } from "components/forms/SubmitButton";
import { IStoreInformation } from "Models/store";
import { useSetupStoreActivateFreeTrialMutation } from "services/auth.api";
import { selectCurrentUser, setStoreDetails } from "store/slice/AuthSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import { useGetStoreInformationQuery } from "services";

type propType = {
  openModal: boolean;
  closeModal: () => void;
};

export type ActivateFreeTrialFields = {
  activate_free_trial?: boolean;
  store: IStoreInformation;
};

const featuresList = [
  {
    icon: <Tag03Icon />,
    text: "Add & Manage Products",
    value: "2000",
  },
  {
    icon: <ShoppingBagIcon />,
    text: "Unlimited sales record",
    value: "mark",
  },
  {
    icon: <FileAttachmentIcon />,
    text: "Issue invoices/receipts",
    value: "2000",
  },
  {
    icon: <HardDriveIcon stroke="#009444" strokeWidth={1.5} />,
    text: "In store checkout software (Point of Sale)",
    value: "mark",
  },
  {
    icon: <PresentationChartIcon />,
    text: "Comprehensive Business Analytics",
    value: "mark",
  },
  {
    icon: <ServerIcon isActive strokeWidth={1.5} />,
    text: "Integrations: Shipbubble, Fez, Google Analytics, Facebook Pixel etc",
    value: "mark",
  },
  {
    icon: <ScanIcon stroke="#009444" />,
    text: "Barcode generator/scanner software",
    value: "mark",
  },
];

const ActivateFreeTrialModal = ({ closeModal, openModal }: propType) => {
  const [activateFreeTrialSuccessModal, setActivateFreeTrialSuccessModal] =
    useState(false);
  const [play, setPlay] = useState(false);
  const { refetch } = useGetStoreInformationQuery();
  const [setupStoreActivateFreeTrial, { isLoading: activateFreeTrialLoading }] =
    useSetupStoreActivateFreeTrialMutation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  const handleActivateFreeTrialSuccess = async () => {
    const payload = {
      activate_free_trial: true,
    };

    try {
      let result = await setupStoreActivateFreeTrial(payload);
      if ("data" in result) {
        dispatch(setStoreDetails(result.data.store));
        refetch();
        setActivateFreeTrialSuccessModal(true);
        if (typeof _cio !== "undefined") {
          _cio.identify({
            id: user?.email,
            free_trial_activated: true,
          });
        }

        if (typeof mixpanel !== "undefined") {
          mixpanel.people.set("free_trial_activated", true);
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

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
    <>
      <Modal
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        {activateFreeTrialSuccessModal ? (
          <div className="activate_freetrial_modal success">
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
              <img src={FreeTrial} alt="Activate Free Trial" />
            </div>
            <div className="text_section">
              <h2>Growth Free Trial Activated</h2>
              <p>
                You now have exclusive access to to Growth features worth
                N250,000 for the next 14 days. Enjoy!
              </p>
            </div>
            <div className="button_container">
              <Button
                onClick={closeModal}
                variant="contained"
                className="primary_styled_button"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="activate_freetrial_modal">
            <div className="title_section">
              <div className="text_section">
                <h2>Ready to Enjoy Growth Benefits For Free?</h2>
                <span>
                  Here are some benefits of the Bumpa Growth plan, you will
                  enjoy FREE for the next 14 days!
                </span>
              </div>
              <IconButton
                type="button"
                onClick={closeModal}
                className="icon_button_container"
              >
                <XIcon />
              </IconButton>
            </div>
            <div className="features_section">
              <div className="features_section--header">
                <h3>Bumpa Growth</h3>
              </div>
              <div className="features_section--main">
                <h4>Features</h4>
                {featuresList?.map((item: any, i: number) => (
                  <div key={i} className="features_section--list">
                    <div className="iconWrap">
                      <div className="icon">{item.icon}</div>
                      <p>{item.text}</p>
                    </div>
                    {item.value === "mark" ? <MarkIcon /> : <p>{item.value}</p>}
                  </div>
                ))}
              </div>
            </div>
            <div className="button_container">
              <SubmitButton
                handleClick={handleActivateFreeTrialSuccess}
                text="Activate Growth Free Trial"
                isLoading={activateFreeTrialLoading}
                type={"submit"}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ActivateFreeTrialModal;
