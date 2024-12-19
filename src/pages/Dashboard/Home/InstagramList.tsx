import { Avatar } from "@mui/material";
import { IConversationsList } from "Models/messenger";
import { truncateString } from "utils";
import moment from "moment";
import { useGetInstagramUserProfilePictureQuery } from "services/messenger.api";
import { useNavigate } from "react-router-dom";
import { selectMetaData } from "store/slice/InstagramSlice";
import { useAppSelector } from "store/store.hooks";

const InstagramList = ({
  index,
  conversation,
}: {
  index: number;
  conversation: IConversationsList;
}) => {
  const selectedMetaData = useAppSelector(selectMetaData);

  const pageAccessToken = selectedMetaData?.integration
    ?.page_access_token as string;
  const { data: profileData } = useGetInstagramUserProfilePictureQuery({
    pageAccessToken,
    igSid: conversation?.participants?.data[1]?.id,
  });

  const navigate = useNavigate();

  return (
    <div
      className="single_dm"
      key={index}
      onClick={() => navigate("/dashboard/messages", { state: { index } })}
    >
      <Avatar
        sx={{
          width: {
            xs: "32px",
            md: "32px",
          },
          height: { xs: "32px", md: "32px" },
        }}
        src={profileData?.profile_pic}
        className="avatar"
        alt={"avatar"}
      />
      <div className="text_box">
        <div className="top">
          <h4 className="name">
            {conversation?.participants?.data?.length &&
              conversation?.participants?.data[1]?.username}
          </h4>
          {false && <p className="count">4</p>}
        </div>
        <div className="bottom">
          <p className="message">
            {conversation?.messages?.data?.length &&
              truncateString(conversation.messages?.data[0]?.message, 30)}
          </p>
          <p className="time">
            {moment(conversation.messages?.data[0]?.created_time).format("LT")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstagramList;
