import { IConversationsList } from "Models/messenger";
import "./style.scss";
import moment from "moment";
import { memo } from "react";
import {
  selectMetaData,
  selectProfilePicture,
  setActiveIndex,
  setProfilePicture,
} from "store/slice/InstagramSlice";
import { useAppSelector } from "store/store.hooks";
import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface IProp {
  conversation: IConversationsList;
  activeChat: IConversationsList;
  setActiveChat: (chat: IConversationsList) => void;
  onSelect: () => void;
  index: number;
}

const ChatList = ({
  conversation,
  onSelect,
  activeChat,
  setActiveChat,
  index,
}: IProp) => {
  const selectedMetaData = useAppSelector(selectMetaData);
  const selectedProfilePicture = useAppSelector(selectProfilePicture);

  const [activeCard, setActiveCard] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      conversation?.participants?.data[1]?.id ===
      activeChat?.participants?.data[1]?.id
    ) {
      setActiveCard(true);
    } else {
      setActiveCard(false);
    }
  }, [activeChat, conversation]);

  return (
    <div
      className={`chat-box ${activeCard ? "active-box" : ""}`}
      onClick={() => {
        dispatch(setActiveIndex(index));
        onSelect();
        setActiveChat(conversation);
      }}
    >
      <Avatar
        src={
          selectedProfilePicture[index] !== undefined
            ? selectedProfilePicture[index][
                conversation?.participants?.data[1]?.id
              ]?.profile_pic
            : ""
        }
        alt="profile"
        className="avatar"
        sx={{
          width: {
            xs: "48px",
            md: "48px",
          },
          height: { xs: "48px", md: "48px" },
        }}
      />
      <div className="profile-name">
        <h5>
          {conversation?.participants?.data?.length &&
            conversation?.participants?.data[1]?.username}
        </h5>
        <p>
          {conversation?.messages?.data?.length &&
            conversation?.messages?.data[0]?.message}
        </p>
      </div>
      <div className="other-details">
        {/* {chat?.unreadMessages > 0 && <div className="unread">4</div>} */}
        <div className="time">
          {moment(conversation?.updated_time).format("LT")}
        </div>
      </div>
    </div>
  );
};

export default memo(ChatList);
