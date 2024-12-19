import { useState } from "react";
import parse from "html-react-parser";
import { useNavigate } from "react-router-dom";
import { Button, Chip } from "@mui/material";
import moment from "moment";

import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { Recipients } from "../Recipients";

import { ICampaign } from "Models/marketing";
import { setCampaigns } from "store/slice/CampaignSlice";
import { useAppDispatch } from "store/store.hooks";
import { IMAGEURL } from "utils/constants/general";

import "./style.scss";

type ViewCampaignProps = {
  openModal: boolean;
  closeModal: () => void;
  activeData: ICampaign;
};

export const ViewCampaign = ({
  openModal,
  closeModal,
  activeData,
}: ViewCampaignProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isRecipientsOpen, setIsRecipientOpen] = useState(false);

  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children pd_view_campaign">
          <div className="top_section">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              title={`${activeData?.name as string}`}
            >
              <div className="campaign_features">
                <div className="extra_info">
                  <Chip color="info" label={activeData?.type} />
                  <Chip color="success" label={activeData?.status} />
                  <p className="date">
                    {moment(activeData?.created_at).format("L")}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setIsRecipientOpen(true);
                  }}
                  variant="outlined"
                >
                  View Report
                </Button>
              </div>
            </ModalRightTitle>

            <div className="campaign_details">
              {activeData?.banner && activeData?.banner !== IMAGEURL && (
                <img
                  src={`${
                    !activeData?.banner?.includes(
                      "salescabal.s3.eu-west-3.amazonaws.com"
                    )
                      ? `${IMAGEURL}${activeData?.banner as string}`
                      : `${activeData?.banner as string}`
                  }`}
                  alt="campaign"
                />
              )}
              <div className="body">{parse(activeData?.content || "")}</div>
            </div>
          </div>

          {/* <div className="bottom_section">
            <Button
              type="button"
              disabled={!Boolean(Object.keys(activeData).length)}
              className="save"
              onClick={() => {
                dispatch(setCampaigns(activeData));
                navigate("create", { state: { activeData: activeData } });
              }}
            >
              Duplicate Campaign
            </Button>
          </div> */}
        </div>
      </ModalRight>

      <Recipients
        openModal={isRecipientsOpen}
        activeData={activeData}
        closeModal={() => {
          setIsRecipientOpen(false);
        }}
      />
    </>
  );
};
