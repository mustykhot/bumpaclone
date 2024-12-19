import { useState, useEffect } from "react";
import "./style.scss";
import { InstagramIcon } from "assets/Icons/InstagramIcon";
import { WhatsappIcon } from "assets/Icons/WhatsappIcon";
import { FacebookIcon } from "assets/Icons/FacebookIcon";
import ChatList from "./ChatList";
import ChatArea from "./ChatArea";
import {
  useGetInstagramConversationQuery,
  useGetInstagramMessageInformationQuery,
  useGetNewInstagramUserProfilePictureMutation,
} from "services/messenger.api";
import {
  selectMetaData,
  setShowIgDm,
  setMetaData,
  setConversationList,
  selectConversationList,
  selectWebhookMessage,
  setActiveIndex,
} from "store/slice/InstagramSlice";
import { useAppSelector } from "store/store.hooks";
import { IConversationsList } from "Models/messenger";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from "react-router-dom";
import EmptyResponse from "components/EmptyResponse";
import {
  selectActiveIndex,
  setProfilePicture,
  selectProfilePicture,
} from "store/slice/InstagramSlice";
import InputField from "components/forms/InputField";
import { IconButton, Skeleton } from "@mui/material";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { useGetMetaIntegrationQuery } from "services";
import { useAppDispatch } from "store/store.hooks";
import ErrorMsg from "components/ErrorMsg";
import { handleError } from "utils";
import { Button } from "@mui/material";
import { ConnectGoogleModal } from "pages/Dashboard/ConnectedApps/widgets/Modals/ConnectGoogleModal";
import { getFbeV2Url } from "utils/constants/general";
import {
  selectCurrentStore,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import { CustomRefreshIcon } from "assets/Icons/CustomRefreshIcon";
import { UpgradeModal } from "components/UpgradeModal";

const InstagramDm = () => {
  const [messageLists, setMessageLists] = useState<IConversationsList[]>([]);
  const [activeSocial, setActiveSocial] = useState("instagram");
  const [displayScreen, setDisplayScreen] = useState("list-screen");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [nextLink, setNextLink] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isFetch, setIsFetch] = useState(false);
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [messagesListCopy, setMessagesListCopy] = useState<
    IConversationsList[]
  >([]);
  const [messageId, setMessageId] = useState("");
  const [singleLiveMessage, setSingleLiveMessage] = useState<any>({});
  const [openModal, setOpenModal] = useState(false);
  // const [activeIndex, setActiveIndex] = useState(0);
  const [conversationSkip, setConversationSkip] = useState(true);
  const [messageInformationSkip, setMessageInformationSkip] = useState(true);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);

  const selectedMetaData = useAppSelector(selectMetaData);
  const selectedConversationList = useAppSelector(selectConversationList);
  const selectedWebhookMessage = useAppSelector(selectWebhookMessage);
  const store = useAppSelector(selectCurrentStore);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);

  const pageAccessToken = selectedMetaData?.integration
    ?.page_access_token as string;
  const pageId = selectedMetaData?.integration?.page_id as string;

  const { data: singleMessageData } = useGetInstagramMessageInformationQuery(
    { pageAccessToken, messageId },
    { skip: messageInformationSkip }
  );

  const location = useLocation();
  const selectedActiveIndex = useAppSelector(selectActiveIndex);
  const dispatch = useAppDispatch();
  const selectedProfilePicture = useAppSelector(selectProfilePicture);

  const { data, isLoading, isSuccess, isError, error, refetch } =
    useGetInstagramConversationQuery(
      {
        limit: 400,
        pageId,
        pageAccessToken,
        nextUrl: nextLink,
      },
      { skip: conversationSkip, refetchOnMountOrArgChange: true }
    );

  const [getNewInstagramUserProfilePicture, { data: profileData }] =
    useGetNewInstagramUserProfilePictureMutation();

  const { data: meta, isLoading: metaLoad } = useGetMetaIntegrationQuery();

  const [activeIgSid, setActiveIgSid] = useState(
    selectedConversationList[location?.state?.index || 0]?.participants?.data[1]
      ?.id
  );

  const [activeChat, setActiveChat] = useState(
    selectedConversationList[location?.state?.index || 0]
  );

  const getProfile = async (igid: string) => {
    try {
      const result = await getNewInstagramUserProfilePicture({
        pageAccessToken,
        igSid: igid,
      });
      const id = igid;
      if ("data" in result) {
        const profilePictureCopy = { ...selectedProfilePicture };
        profilePictureCopy[id] = result.data;
        dispatch(setProfilePicture(profilePictureCopy));
        return result.data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (selectedConversationList.length) {
      async function fetchData() {
        const result = await Promise.all(
          selectedConversationList?.map(async (item: any) => {
            const newItem = await getProfile(item?.participants?.data[1]?.id);
            return { [item.participants.data[1].id]: newItem };
          })
        );
        dispatch(setProfilePicture(result));
      }

      fetchData();
    }
  }, [selectedConversationList]);

  const displayChatArea = () => {
    setDisplayScreen("details-screen");
  };

  const handleClick = (value: string) => {
    setActiveSocial(value);
  };

  const loadMore = () => {
    // Load more data when the user scrolls to the bottom
    // Update the posts and hasMore state accordingly
    if (data?.paging?.next) {
      // setSkipPagination(false)
      let url = data?.paging?.next.split("limit=400")[1];
      setNextLink(url);
    }
  };

  const refresh = () => {
    setNextLink("");
  };

  const handleLoadMore = () => {
    // Call the loadMore function to fetch the next page of data
    loadMore();
  };

  useEffect(() => {
    if (pageId && pageAccessToken) {
      setConversationSkip(false);
    }
  }, [pageAccessToken, pageId]);

  useEffect(() => {
    if (messageId && pageAccessToken) {
      setMessageInformationSkip(false);
    }
  }, [messageId, pageAccessToken]);

  useEffect(() => {
    if (meta?.integration) {
      dispatch(setShowIgDm(true));
      dispatch(setMetaData(meta));
      if (typeof _cio !== "undefined") {
        _cio.track("web_connect_meta", meta?.integration);
      }
      if (typeof mixpanel !== "undefined") {
        mixpanel.track("web_connect_meta", meta?.integration);
      }
    }
    // eslint-disable-next-line
  }, [meta?.integration]);

  useEffect(() => {
    if (selectedWebhookMessage) {
      setMessageId(selectedWebhookMessage?.message?.mid);
    }
  }, [selectedWebhookMessage]);

  useEffect(() => {
    if (singleMessageData && !isLoading) {
      if ("from" in singleMessageData) {
        const dataFrom = JSON.parse(
          JSON.stringify((singleMessageData as { from: any })?.from)
        );

        if (activeChat?.participants?.data[0]?.id !== dataFrom?.id) {
          const newSelectedConversationList = JSON.parse(
            JSON.stringify(selectedConversationList)
          );
          const newConversation = newSelectedConversationList?.find(
            (item: any) => item?.participants?.data[1]?.id === dataFrom?.id
          );
          if (newConversation !== undefined) {
            const newMessagesCopyList = JSON.parse(
              JSON.stringify(newConversation)
            );
            newMessagesCopyList?.messages?.data?.unshift(singleMessageData);

            newSelectedConversationList.unshift(newMessagesCopyList);
            const newArray = newSelectedConversationList
              ?.map((item: IConversationsList, index: number) => {
                if (
                  item?.participants?.data[1]?.id === dataFrom?.id &&
                  index !== 0
                ) {
                  return undefined;
                }
                return item;
              })
              .filter((item: any) => item !== undefined);

            dispatch(setConversationList(newArray));
            setMessagesListCopy(newArray);
            setActiveChat(newMessagesCopyList);
          }
        }
      }
    }
  }, [singleMessageData]);

  useEffect(() => {
    if (data) {
      setActiveChat(
        location?.state?.index
          ? data?.data[location?.state?.index]
          : data?.data[selectedActiveIndex]
      );
      // setActiveIgSid(data?.data[0]?.participants?.data[1]?.id)
      if (data?.data && !nextLink) {
        setMessageLists(data?.data);
        setMessagesListCopy(data?.data);
        const newCopy = [...data?.data];
        dispatch(setConversationList(newCopy));
      } else if (data?.data && nextLink) {
        let newData = [...messageLists];
        data?.data.forEach((element, index) => {
          if (!messageLists.includes(element)) {
            newData.push(element);
          }
        });
        setMessageLists(newData);
        setMessagesListCopy(newData);
        const newCopy = [...newData];
        dispatch(setConversationList(newCopy));
        setActiveChat(
          location?.state?.index
            ? newData[location?.state?.index]
            : newData[selectedActiveIndex]
        );
      }
    }
    // eslint-disable-next-line
  }, [data, nextLink]);

  useEffect(() => {
    if (searchValue && messagesListCopy.length && data) {
      const newData = JSON.parse(JSON.stringify(messagesListCopy));
      const lowerCase = searchValue.toLowerCase();
      let result = newData.filter(
        (item: any) =>
          item?.participants?.data[1]?.username
            ?.toLowerCase()
            ?.includes(lowerCase) ||
          item?.messages?.data?.find((chat: { message: string }) =>
            chat?.message?.toLowerCase()?.includes(lowerCase)
          )
      );
      if (location?.state?.index) {
        location.state.index = 0;
      }
      if (result.length) {
        dispatch(setConversationList(result));
        setActiveChat(result[0]);
        dispatch(setActiveIndex(0));
      } else {
        dispatch(setConversationList(result));
      }
    } else if (!searchValue && messagesListCopy.length) {
      dispatch(setConversationList(messagesListCopy));
      if (location?.state?.index) {
        setActiveChat(messagesListCopy[location?.state?.index]);
        dispatch(setActiveIndex(0));
      } else {
        setActiveChat(messagesListCopy[0]);
        dispatch(setActiveIndex(0));
      }
    }
  }, [searchValue]);

  useEffect(() => {
    if (isSuccess) {
      setHasMore(true);
    }
  }, [isSuccess]);

  const refreshIG = async () => {
    if (isFetch) {
      try {
        setIsFetchLoading(true);
        const result = await refetch();
        setIsFetch(false);
        if ("data" in result) {
          setIsFetchLoading(false);
          return;
        } else {
          handleError(result);
          setIsFetchLoading(false);
        }
      } catch (err) {
        setIsFetchLoading(false);
        console.log(err);
        handleError(err);
      }
    }
  };

  useEffect(() => {
    refreshIG();
  }, [isFetch]);

  const handleStartMetaConnection = () => {
    if (
      isSubscriptionType === "growth" ||
      isSubscriptionType === "pro" ||
      isSubscriptionType === "trial"
    ) {
      startMetaConnection();
    } else {
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
    }
  };

  const startMetaConnection = async () => {
    const prep = {
      name: store?.name || "",
      url_link: store?.url_link || "",
      id: store?.id || "",
    };
    const fbeV2Url = getFbeV2Url(prep);
    window.open(fbeV2Url, "_self");
  };

  if (!meta?.integration && !metaLoad) {
    return (
      <div className="empty_msg_box">
        <h4>Connect to Instagram</h4>
        <p>Close sales from your instagram dm</p>
        <Button
          onClick={handleStartMetaConnection}
          className="primary_styled_button"
          variant="contained"
        >
          Connect Instagram
        </Button>
      </div>
    );
  }

  if (isError && error && !isLoading) {
    if ("data" in error) {
      const data = JSON.parse(JSON.stringify(error.data));
      if (data?.error?.code === 190 || !pageAccessToken) {
        return (
          <ErrorMsg
            error={
              "Sorry, Instagram session has expired. Please reconnect to meta."
            }
            button={
              <Button
                onClick={handleStartMetaConnection}
                className="primary_styled_button"
                variant="contained"
              >
                Connect Instagram
              </Button>
            }
          />
        );
      } else if (data?.error?.code === 1) {
        return (
          <ErrorMsg
            error={
              "An error occured. Please  verify that your instagram business account has the required permissions and reconnect to meta or reach out to the support team."
            }
            button={
              <Button
                onClick={handleStartMetaConnection}
                className="primary_styled_button"
                variant="contained"
              >
                Connect Instagram
              </Button>
            }
          />
        );
      }
    }
  }

  if ((!pageAccessToken || !pageId) && !metaLoad) {
    return (
      <ErrorMsg
        error={"Sorry, Instagram session has expired. Please reconnect to meta"}
        button={
          <Button
            onClick={handleStartMetaConnection}
            className="primary_styled_button"
            variant="contained"
          >
            Connect Instagram
          </Button>
        }
      />
    );
  }

  return (
    <>
      <div className="instagram-dm">
        <div className="instagram-dm__header-center">
          <div className="instagram-dm__title">
            <h3>Instagram DM</h3>
            <p>Close sales on Instagram from Bumpa</p>
          </div>

          <div className="instagram-dm__search">
            <InputField
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              placeholder="Search"
              containerClass="search_field"
              suffix={<SearchIcon />}
            />
            <div
              className="refresh-dm"
              onClick={() => {
                setIsFetch(true);
              }}
            >
              <IconButton>
                <CustomRefreshIcon />
              </IconButton>
              <span className="refresh-text">Refresh</span>
            </div>
          </div>
        </div>
        {isLoading || metaLoad || isFetchLoading ? (
          <div className={`instagram-dm__chat-area ${displayScreen}`}>
            <div className="socials">
              {[1, 2, 3].map((item) => (
                <Skeleton
                  animation="wave"
                  key={item}
                  variant="circular"
                  width={25}
                  height={25}
                />
              ))}
            </div>
            <div className="chat-list skeleton-chatlist">
              {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                <div key={item} className="dm_content_skeleton">
                  <div className="left">
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="right">
                    <Skeleton
                      animation="wave"
                      height={20}
                      width="100%"
                      style={{ marginBottom: 6 }}
                    />
                    <Skeleton animation="wave" height={20} width="50%" />
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-area">
              <div className="chat-dm__header">
                <div className="title">
                  <div className="left">
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="right">
                    <Skeleton animation="wave" height={20} width="50%" />
                    <Skeleton animation="wave" height={20} width="25%" />
                  </div>
                </div>

                <div className="add-customer-button">
                  <Skeleton animation="wave" height={45} width={20} />
                </div>
              </div>

              <div className="skeleton-chat-area">
                <div className="dm_content_skeleton">
                  <div className="left">
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="right">
                    <Skeleton animation="wave" height={20} width="50%" />
                    <Skeleton animation="wave" height={20} width="25%" />
                  </div>
                </div>
                <div className="dm_content_skeleton_inverse">
                  <div className="left">
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="right">
                    <Skeleton
                      animation="wave"
                      height={20}
                      width="50%"
                      style={{ marginLeft: "auto" }}
                    />
                    <Skeleton
                      animation="wave"
                      height={20}
                      width="25%"
                      style={{ marginLeft: "auto" }}
                    />
                  </div>
                </div>
                <div className="dm_content_skeleton">
                  <div className="left">
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="right">
                    <Skeleton animation="wave" height={20} width="50%" />
                    <Skeleton animation="wave" height={20} width="25%" />
                  </div>
                </div>
                <div className="dm_content_skeleton_inverse">
                  <div className="left">
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="right">
                    <Skeleton
                      animation="wave"
                      height={20}
                      width="50%"
                      style={{ marginLeft: "auto" }}
                    />
                    <Skeleton
                      animation="wave"
                      height={20}
                      width="25%"
                      style={{ marginLeft: "auto" }}
                    />
                  </div>
                </div>
                <div className="dm_content_skeleton">
                  <div className="left">
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="right">
                    <Skeleton animation="wave" height={20} width="50%" />
                    <Skeleton animation="wave" height={20} width="25%" />
                  </div>
                </div>
                <div className="dm_content_skeleton_inverse">
                  <div className="left">
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="right">
                    <Skeleton
                      animation="wave"
                      height={20}
                      width="50%"
                      style={{ marginLeft: "auto" }}
                    />
                    <Skeleton
                      animation="wave"
                      height={20}
                      width="25%"
                      style={{ marginLeft: "auto" }}
                    />
                  </div>
                </div>
                <div className="dm_content_skeleton">
                  <div className="left">
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="right">
                    <Skeleton animation="wave" height={20} width="50%" />
                    <Skeleton animation="wave" height={20} width="25%" />
                  </div>
                </div>
                <div className="dm_content_skeleton_inverse">
                  <div className="left">
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="right">
                    <Skeleton
                      animation="wave"
                      height={20}
                      width="50%"
                      style={{ marginLeft: "auto" }}
                    />
                    <Skeleton
                      animation="wave"
                      height={20}
                      width="25%"
                      style={{ marginLeft: "auto" }}
                    />
                  </div>
                </div>
                <div className="dm_content_skeleton">
                  <div className="left">
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="right">
                    <Skeleton animation="wave" height={20} width="50%" />
                    <Skeleton animation="wave" height={20} width="25%" />
                  </div>
                </div>
                <div className="dm_content_skeleton_inverse">
                  <div className="left">
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="right">
                    <Skeleton
                      animation="wave"
                      height={20}
                      width="50%"
                      style={{ marginLeft: "auto" }}
                    />
                    <Skeleton
                      animation="wave"
                      height={20}
                      width="25%"
                      style={{ marginLeft: "auto" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {selectedConversationList.length === 0 &&
            !searchValue &&
            meta?.integration ? (
              <EmptyResponse message="No Available Chat History" />
            ) : selectedConversationList.length === 0 &&
              searchValue &&
              meta?.integration ? (
              <EmptyResponse message="No Chat, Contacts or Messages matched your search" />
            ) : (
              <div className={`instagram-dm__chat-area ${displayScreen}`}>
                <div className="socials">
                  <button
                    onClick={() => {
                      handleClick("instagram");
                    }}
                  >
                    <InstagramIcon />
                    <div
                      className={activeSocial === "instagram" ? "active" : ""}
                    ></div>
                  </button>
                  <button
                    onClick={() => {
                      handleClick("whatsapp");
                    }}
                    className="disabled-socials"
                    disabled
                  >
                    <WhatsappIcon />
                    <div
                      className={activeSocial === "whatsapp" ? "active" : ""}
                    ></div>
                  </button>
                  <button
                    onClick={() => {
                      handleClick("facebook");
                    }}
                    className="disabled-socials"
                    disabled
                  >
                    {" "}
                    <FacebookIcon />
                    <div
                      className={activeSocial === "facebook" ? "active" : ""}
                    ></div>
                  </button>
                </div>
                <div className="chat-list" id="chat-list">
                  {/* <InputField
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                      }}
                      placeholder="Search"
                      containerClass="search_field"
                      suffix={<SearchIcon />}
                    /> */}
                  <InfiniteScroll
                    dataLength={messageLists.length}
                    next={handleLoadMore}
                    hasMore={hasMore}
                    loader={isLoading}
                    scrollableTarget="chat-list"
                    refreshFunction={refresh}
                    pullDownToRefresh={true}
                    pullDownToRefreshThreshold={50}
                    pullDownToRefreshContent={
                      <h3 style={{ textAlign: "center" }}>
                        {/* &#8595; Pull down to refresh */}
                      </h3>
                    }
                    releaseToRefreshContent={
                      <h3 style={{ textAlign: "center" }}>
                        &#8593; Release to refresh
                      </h3>
                    }
                  >
                    {selectedConversationList?.map(
                      (conversation: IConversationsList, index: number) => (
                        <div key={index}>
                          <ChatList
                            conversation={conversation}
                            onSelect={displayChatArea}
                            setActiveChat={setActiveChat}
                            index={index}
                            activeChat={activeChat as IConversationsList}
                          />
                        </div>
                      )
                    )}
                  </InfiniteScroll>
                </div>
                <div className="chat-area">
                  <ChatArea
                    chat={activeChat as IConversationsList}
                    displayScreen={displayScreen}
                    setDisplayScreen={setDisplayScreen}
                    setActiveChat={setActiveChat}
                    setMessagesListCopy={setMessagesListCopy}
                    singleLiveMessage={singleLiveMessage}
                    messagesListCopy={messagesListCopy}
                    searchValue={searchValue}
                  />
                </div>
              </div>
            )}
            <ConnectGoogleModal
              openModal={openModal}
              closeModal={() => {
                setOpenModal(false);
              }}
            />
            {openUpgradeModal && (
              <UpgradeModal
                openModal={openUpgradeModal}
                closeModal={() => setOpenUpgradeModal(false)}
                pro={isProUpgrade}
                title={`Sell faster on Instagram`}
                subtitle={`Connect your Instagram DMs to Bumpa & sell faster.`}
                proFeatures={[
                  "Receive Instagram DMs on Bumpa & Sell faster",
                  "Share up to 500 invoices/receipts on Instagram",
                  "Add up to 500 products to your store",
                ]}
                growthFeatures={[
                  "Receive Instagram DMs on Bumpa & Sell faster",
                  "Share unlimited invoices/receipts on Instagram",
                  "Add unlimited products to your store",
                ]}
                eventName="meta"
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default InstagramDm;
