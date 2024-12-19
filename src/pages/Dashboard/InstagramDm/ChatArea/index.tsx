import { useState, useEffect, useRef } from "react";
import "./style.scss";
import { SendIcon } from "assets/Icons/SendIcon";
import { UploadFileIcon } from "assets/Icons/UploadFileIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { Button } from "@mui/material";
import { UserIcon } from "assets/Icons/UserIcon";
import { UserIcon2 } from "assets/Icons/UserIcon2";
import { LinkIcon } from "assets/Icons/LinkIcon";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { ChevronLeftIcon } from "assets/Icons/ChevronLeftIcon";
import moment from "moment";
import {
  handleError,
  extractLinkFromString,
  createOrderMessage,
  observeNewLines,
  selectedProductsMessages,
  parseString,
  renderPage,
  convertToImage,
  selectedPaymentMessage,
  groupMessageDays,
  observeNewLinesOrder,
} from "utils";
import {
  useSendInstagramMessageMutation,
  useGetInstagramMessageInformationQuery,
  useGetNewInstagramUserProfilePictureMutation,
} from "services/messenger.api";
import {
  useGetCustomersQuery,
  useGetOrdersQuery,
  usePostMediaUploadMutation,
  useGetProductQuery,
} from "services";
import { IConversationsList, ICustomerProfile } from "Models/messenger";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  setMessageList,
  selectMessageList,
  selectMetaData,
  selectProfilePicture,
  setActiveIndex,
} from "store/slice/InstagramSlice";
import { useNavigate } from "react-router-dom";
import AddCustomerModal from "../AddCustomer";
import { CustomerType } from "services/api.types";
import { selectCurrentStore } from "store/slice/AuthSlice";
import CreateOrderModal from "../CreateOrderModal";
import SendInvoiceModal from "../SendInvoiceModal";
import RequestPaymentModal from "../RequestPaymentModal";
import { IMAGEURL } from "utils/constants/general";
import { SelectInstagramProductModal } from "../SelectProductModal";
import { selectPermissions } from "store/slice/AuthSlice";
import { PermissionsType } from "Models";
import { Avatar } from "@mui/material";
import {
  selectActiveIndex,
  setConversationList,
  selectConversationList,
} from "store/slice/InstagramSlice";
import { LoadingButton } from "@mui/lab";
import ImageModal from "./ImageModal";
import { selectUserLocation } from "store/slice/AuthSlice";

interface IProp {
  chat: IConversationsList;
  setDisplayScreen: (val: string) => void;
  displayScreen: string;
  setActiveChat: (val: IConversationsList) => void;
  setMessagesListCopy: (val: IConversationsList[]) => void;
  singleLiveMessage: string;
  messagesListCopy: IConversationsList[];
  searchValue: string;
}

const ChatArea = ({
  chat,
  displayScreen,
  setDisplayScreen,
  setMessagesListCopy,
  singleLiveMessage,
  messagesListCopy,
  setActiveChat,
  searchValue,
}: IProp) => {
  const selectedMetaData = useAppSelector(selectMetaData);
  const pageAccessToken = selectedMetaData?.integration
    ?.page_access_token as string;
  const igId = selectedMetaData?.integration?.igid as string;

  const userPermission: PermissionsType = useAppSelector(selectPermissions);

  const [isStaff, setIsStaff] = useState(false);
  const canManageMessaging = isStaff ? userPermission?.messaging.manage : true;

  const [customer, setCustomer] = useState<CustomerType>();
  const [isCustomer, setIsCustomer] = useState(false);
  const [messageValue, setMessageValue] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [skipOrder, setSkipOrder] = useState(true);
  const [skipProduct, setSkipProduct] = useState(true);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createCustomerHeader, setCreateCustomerHeader] = useState("");
  const [orderMessage, setOrderMessage] = useState("");
  const [productMessage, setProductMessage] = useState("");
  const [openProductModal, setOpenProductModal] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [sendInstagramMessage] = useSendInstagramMessageMutation();
  const [invoiceLoader, setInvoiceLoader] = useState(false);
  const [chatProfiledata, setChatProfileData] = useState<ICustomerProfile>();
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const userLocation = useAppSelector(selectUserLocation);

  const [getNewInstagramUserProfilePicture, { isError }] =
    useGetNewInstagramUserProfilePictureMutation();
  const { data: customerData } = useGetCustomersQuery({
    limit: 2000,
  });
  const { data: orderData } = useGetOrdersQuery(
    {
      customer_id: customer?.id?.toString() as string,
      limit: 2000,
      location_id: userLocation?.id,
    },
    { skip: skipOrder, refetchOnMountOrArgChange: true }
  );

  const { data: productData } = useGetProductQuery(
    {
      customer_id: customer?.id?.toString() as string,
      limit: 2000,
      location_id: userLocation?.id,
    },
    { skip: skipProduct, refetchOnMountOrArgChange: true }
  );
  const [postMediaUpload] = usePostMediaUploadMutation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedMessageList = useAppSelector(selectMessageList);
  const selectedCurrentStore = useAppSelector(selectCurrentStore);
  const selectedActiveIndex = useAppSelector(selectActiveIndex);
  const selectedConversationList = useAppSelector(selectConversationList);
  const selectedProfilePicture = useAppSelector(selectProfilePicture);

  //function to send message to instagram
  const handleChatSendAction = async (message: string) => {
    if (!message) {
      return false;
    }
    const newMessageUnsent = {
      message: message,
      id: Date.now().toString(),
      status: 0,
      from: { username: "", id: igId },
      created_time: new Date().toISOString(),
    };
    try {
      const newList = JSON.parse(JSON.stringify(selectedMessageList));
      for (let i = 0; i < newList.length; i++) {
        if (newList[i].day === "Today") {
          newList[i].messages.unshift(newMessageUnsent);
          break;
        }
        if (newList[i].day !== "Today") {
          let newArray = [];
          newArray.push(newMessageUnsent);
          const newData = {
            day: "Today",
            messages: newArray,
          };
          newList.unshift(newData);
          break;
        }
      }

      dispatch(setMessageList(newList));
      dispatch(setActiveIndex(0));

      const newSelectedConversationList = JSON.parse(
        JSON.stringify(selectedConversationList)
      );
      const newMessagesListCopy = [...messagesListCopy];

      const newConversation = selectedConversationList?.find(
        (item: any) => item.id === chat?.id
      );
      const newSingleMessagesList = messagesListCopy?.find(
        (item: any) => item.id === chat?.id
      );

      if (
        newConversation !== undefined ||
        newSingleMessagesList !== undefined
      ) {
        const newConversationMessageCopyList = JSON.parse(
          JSON.stringify(newConversation)
        );
        const newSingleMessagesCopyList = JSON.parse(
          JSON.stringify(newSingleMessagesList)
        );

        newConversationMessageCopyList?.messages?.data?.unshift(
          newMessageUnsent
        );
        newSingleMessagesCopyList?.messages?.data?.unshift(newMessageUnsent);

        newSelectedConversationList.unshift(newConversationMessageCopyList);
        newMessagesListCopy.unshift(
          newSingleMessagesCopyList as IConversationsList
        );

        const newArray = newSelectedConversationList
          ?.map((item: any, index: number) => {
            if (item.id === chat?.id && index !== 0) {
              return undefined;
            }
            return item;
          })
          .filter((item: any) => item !== undefined);

        const newMessageCopyArray = newMessagesListCopy
          ?.map((item: any, index: number) => {
            if (item.id === chat?.id && index !== 0) {
              return undefined;
            }
            return item;
          })
          .filter((item: any) => item !== undefined);

        dispatch(setConversationList(newArray));
        setMessagesListCopy(newMessageCopyArray);
        setActiveChat(newConversationMessageCopyList);

        const payload = {
          recipient: {
            id: chat?.participants?.data[1]?.id,
          },
          message: {
            text: message,
          },
        };
        setMessageValue("");
        setProductMessage("");
        setOrderMessage("");
        let result = await sendInstagramMessage({
          body: JSON.stringify(payload),
          pageAccessToken,
        });
        if ("data" in result) {
          setMessageValue("");
          setProductMessage("");
          setOrderMessage("");
        } else {
          newConversationMessageCopyList?.messages?.data?.shift();
          newSingleMessagesCopyList?.messages?.data?.shift();

          // newSelectedConversationList.unshift(newConversationMessageCopyList);
          // newMessagesListCopy.unshift(
          //   newSingleMessagesCopyList as IConversationsList
          // );

          dispatch(setConversationList(newSelectedConversationList));
          setMessagesListCopy(newMessagesListCopy);
          setActiveChat(newConversationMessageCopyList);

          showToast(
            `An error occured while sending this message: ${messageValue}`,
            "error"
          );
          setMessageValue("");
          setProductMessage("");
          setOrderMessage("");
        }
      }
    } catch (error) {
      const newSelectedConversationList = JSON.parse(
        JSON.stringify(selectedConversationList)
      );
      const newMessagesListCopy = [...messagesListCopy];

      const newConversation = selectedConversationList?.find(
        (item: any) => item.id === chat?.id
      );
      const newSingleMessagesList = messagesListCopy?.find(
        (item: any) => item.id === chat?.id
      );

      if (
        newConversation !== undefined ||
        newSingleMessagesList !== undefined
      ) {
        const newConversationMessageCopyList = JSON.parse(
          JSON.stringify(newConversation)
        );
        const newSingleMessagesCopyList = JSON.parse(
          JSON.stringify(newSingleMessagesList)
        );

        newConversationMessageCopyList?.messages?.data?.shift();
        newSingleMessagesCopyList?.messages?.data?.shift();

        // newSelectedConversationList.unshift(newConversationMessageCopyList);
        // newMessagesListCopy.unshift(
        //   newSingleMessagesCopyList as IConversationsList
        // );

        dispatch(setConversationList(newSelectedConversationList));
        setMessagesListCopy(newMessagesListCopy);
        setActiveChat(newConversationMessageCopyList);

        console.error(error);
        showToast(
          `An error occured while sending this message: ${messageValue}`,
          "error"
        );
        setMessageValue("");
        setProductMessage("");
        setOrderMessage("");
      }
    }
  };

  //function to upload image to instagram
  const handleSendFileAction = async () => {
    if (!fileUrl && !fileType) {
      return false;
    }
    const newMessageUnsent = {
      attachments: {
        data: [
          {
            image_data: {
              url: fileUrl,
            },
          },
        ],
      },
      id: Date.now().toString(),
      status: 0,
      message: "",
      from: { username: "", id: igId },
      created_time: new Date().toISOString(),
    };
    try {
      const newList = JSON.parse(JSON.stringify(selectedMessageList));
      for (let i = 0; i < newList.length; i++) {
        if (newList[i].day === "Today") {
          newList[i].messages.unshift(newMessageUnsent);
          break;
        }
        if (newList[i].day !== "Today") {
          const newData = {
            day: "Today",
            messages: [newMessageUnsent],
          };
          newList.unshift(newData);
          break;
        }
      }

      dispatch(setMessageList(newList));
      dispatch(setActiveIndex(0));
      if (chatContainerRef?.current != null) {
        setTimeout(() => {
          const chatContainer = chatContainerRef.current as HTMLElement | null;
          if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
          }
        }, 1000);
      }

      const newSelectedConversationList = JSON.parse(
        JSON.stringify(selectedConversationList)
      );
      const newMessagesListCopy = [...messagesListCopy];

      const newConversation = selectedConversationList?.find(
        (item: any) => item.id === chat?.id
      );
      const newSingleMessagesList = messagesListCopy?.find(
        (item: any) => item.id === chat?.id
      );

      if (newConversation !== undefined) {
        const newConversationMessageCopyList = JSON.parse(
          JSON.stringify(newConversation)
        );
        const newSingleMessagesCopyList = JSON.parse(
          JSON.stringify(newSingleMessagesList)
        );

        newConversationMessageCopyList?.messages?.data?.unshift(
          newMessageUnsent
        );
        newSingleMessagesCopyList?.messages?.data?.unshift(newMessageUnsent);

        newSelectedConversationList.unshift(newConversationMessageCopyList);
        newMessagesListCopy.unshift(
          newSingleMessagesCopyList as IConversationsList
        );

        const newArray = newSelectedConversationList
          ?.map((item: any, index: number) => {
            if (item.id === chat?.id && index !== 0) {
              return undefined;
            }
            return item;
          })
          .filter((item: any) => item !== undefined);

        const newMessageCopyArray = newMessagesListCopy
          ?.map((item: any, index: number) => {
            if (item.id === chat?.id && index !== 0) {
              return undefined;
            }
            return item;
          })
          .filter((item: any) => item !== undefined);

        dispatch(setConversationList(newArray));
        setMessagesListCopy(newMessageCopyArray);
        setActiveChat(newConversationMessageCopyList);

        const payload = {
          recipient: {
            id: chat?.participants?.data[1]?.id,
          },
          message: {
            attachment: {
              type: fileType,
              payload: {
                url: fileUrl,
              },
            },
          },
          messaging_type: "MESSAGE_TAG",
          tag: "HUMAN_AGENT",
        };
        setFileUrl("");
        setFileType("");

        let result = await sendInstagramMessage({
          body: JSON.stringify(payload),
          pageAccessToken,
        });
        if ("data" in result) {
          setFileUrl("");
          setFileType("");
        } else {
          newConversationMessageCopyList?.messages?.data?.shift();
          newSingleMessagesCopyList?.messages?.data?.shift();

          // newSelectedConversationList.unshift(newConversationMessageCopyList);
          // newMessagesListCopy.unshift(
          //   newSingleMessagesCopyList as IConversationsList
          // );

          dispatch(setConversationList(newSelectedConversationList));
          setMessagesListCopy(newMessagesListCopy);
          setActiveChat(newConversationMessageCopyList);

          showToast(`An error occured while sending your image`, "error");
          setFileUrl("");
          setFileType("");
        }
      }
    } catch (error) {
      const newSelectedConversationList = JSON.parse(
        JSON.stringify(selectedConversationList)
      );
      const newMessagesListCopy = [...messagesListCopy];

      const newConversation = selectedConversationList?.find(
        (item: any) => item.id === chat?.id
      );
      const newSingleMessagesList = messagesListCopy?.find(
        (item: any) => item.id === chat?.id
      );

      if (newConversation !== undefined) {
        const newConversationMessageCopyList = JSON.parse(
          JSON.stringify(newConversation)
        );
        const newSingleMessagesCopyList = JSON.parse(
          JSON.stringify(newSingleMessagesList)
        );

        newConversationMessageCopyList?.messages?.data?.shift();
        newSingleMessagesCopyList?.messages?.data?.shift();

        // newSelectedConversationList.unshift(newConversationMessageCopyList);
        // newMessagesListCopy.unshift(
        //   newSingleMessagesCopyList as IConversationsList
        // );

        dispatch(setConversationList(newSelectedConversationList));
        setMessagesListCopy(newMessagesListCopy);
        setActiveChat(newConversationMessageCopyList);

        console.error(error);
        showToast(`An error occured while sending your image`, "error");
        setFileUrl("");
        setFileType("");
      }
    }
  };

  //function to set image url
  const handleFileInputChange = async (event: any) => {
    try {
      setIsLoadingImages(true);
      setImageProgress(20);
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      setImageProgress(40);

      reader.addEventListener("load", async () => {
        const result = await postMediaUpload({
          name: file.name,
          image: `${reader?.result}`,
        });
        setImageProgress(60);

        if ("data" in result) {
          setImageProgress(100);
          setTimeout(() => {
            setFileType("image");
            setFileUrl(`${IMAGEURL}${result.data.image.path}` as string);
            setIsLoadingImages(false);
          }, 1000);
        }
      });
    } catch (err) {
      handleError(err);
      setIsLoadingImages(false);
    }
  };

  // function to send message with enter key
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleChatSendAction(messageValue);
    }
  };

  //send an order through Ig
  const handleOrder = (orderResponse: any) => {
    const messageString = createOrderMessage(orderResponse);
    setOrderMessage(messageString);
  };

  //send product through Ig
  const handleSelectedProduct = (selectedList: any) => {
    const messageString = selectedProductsMessages(selectedList);

    setProductMessage(messageString as string);
  };

  //send invoice through Ig
  const handleSentInvoice = async (selectedInvoice: any) => {
    try {
      setInvoiceLoader(true);
      const url = selectedInvoice?.invoice_pdf;
      const pdfUrl = await convertToImage(url);

      const imgFile = await renderPage(pdfUrl);

      const result = await postMediaUpload({
        name: "invoice-png",
        image: imgFile[0],
      });

      if ("data" in result) {
        setFileType("image");
        setFileUrl(`${IMAGEURL}${result.data.image.path}` as string);
        showToast("Invoice Sent", "success");
        setInvoiceLoader(false);
      } else {
        handleError(result);
        setInvoiceLoader(false);
      }
    } catch (err) {
      handleError(err);
      setInvoiceLoader(false);
    }
  };

  //send payment through Ig
  const handlePaymentSettlement = (selectedOrder: any) => {
    const messageString = selectedPaymentMessage(selectedOrder);
    setOrderMessage(messageString);
  };

  // find a particular order from order array

  const findSingleOrder = (link: string) => {
    const checkOrder = orderData?.orders?.data?.filter((order: any) =>
      order.order_page.includes(link)
    );
    if (checkOrder) {
      return checkOrder[0];
    }
  };

  // fetch a particular product with id

  const findSingleProduct = (link: string) => {
    const checkProduct = productData?.products?.data?.filter((product: any) =>
      product.url.includes(link)
    );

    if (checkProduct) {
      return checkProduct[0];
    }
  };

  // Get customer data and check if this user is a customer
  useEffect(() => {
    if (customerData) {
      const customerDetail = customerData?.customers?.data?.find(
        (customer, index) =>
          customer?.handle?.toLowerCase() ===
          chat?.participants?.data[1]?.username.toLowerCase()
      );

      if (customerDetail) {
        setCustomer(customerDetail);
        setIsCustomer(true);
      } else {
        setIsCustomer(false);
      }
    }
  }, [customerData, chat]);

  useEffect(() => {
    if (userPermission !== undefined) {
      setIsStaff(true);
    } else {
      setIsStaff(false);
    }
  }, [userPermission]);

  //watch for sucessful upload to s3bucket and call function to make request with the media to instagram
  useEffect(() => {
    if (fileUrl && fileType) {
      handleSendFileAction();
    }
    // eslint-disable-next-line
  }, [fileUrl, fileType]);

  useEffect(() => {
    if (orderMessage) {
      handleChatSendAction(orderMessage);
    }
    // eslint-disable-next-line
  }, [orderMessage]);

  useEffect(() => {
    if (productMessage) {
      handleChatSendAction(productMessage);
    }
    // eslint-disable-next-line
  }, [productMessage]);

  useEffect(() => {
    if (customer) {
      setSkipProduct(false);
      setSkipOrder(false);
    }
  }, [customer]);

  useEffect(() => {
    if (chat) {
      const result = groupMessageDays(chat.messages.data);
      dispatch(setMessageList(result));
    }
    // eslint-disable-next-line
  }, [chat, singleLiveMessage]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [selectedMessageList]);

  const getProfile = async () => {
    try {
      const chatCopy = { ...chat };
      const result = await getNewInstagramUserProfilePicture({
        pageAccessToken,
        igSid: chatCopy?.participants?.data[1]?.id,
      });

      if ("data" in result) {
        setChatProfileData(result.data);
      } else {
        setChatProfileData(undefined);
      }
    } catch (err) {
      console.log(err);
      setChatProfileData(undefined);
    }
  };

  useEffect(() => {
    if (chat?.participants?.data[1]?.id) {
      setChatProfileData(undefined);
      getProfile();
    }
  }, [chat]);

  useEffect(() => {
    if (chatContainerRef?.current != null) {
      setTimeout(() => {
        const chatContainer = chatContainerRef.current as HTMLElement | null;
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 1000);
    }
  }, [chat]);

  return (
    <div className={`chat-dm ${displayScreen}`}>
      <div className="chat-dm__header">
        <div className="title">
          <span
            className="link-back"
            onClick={() => {
              setDisplayScreen("list-screen");
            }}
          >
            <ChevronLeftIcon />
          </span>

          <Avatar
            src={
              selectedProfilePicture[selectedActiveIndex] !== undefined
                ? selectedProfilePicture[selectedActiveIndex][
                    chat.participants.data[1].id
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
              {chat?.participants?.data?.length &&
                chat?.participants?.data[1]?.username}
            </h5>
            <p>
              @
              {chat?.participants?.data?.length &&
                chat?.participants?.data[1]?.username}
            </p>
          </div>
        </div>

        <div className="add-customer-button">
          {!isCustomer && (
            <div>
              <Button
                className="not-customer-desktop"
                onClick={() => {
                  setShowCustomerModal(true);
                }}
                startIcon={<PlusIcon stroke="#009444" />}
              >
                Add customer
              </Button>
              <div
                className="not-customer-mobile"
                onClick={() => {
                  setIsCustomer(true);
                }}
              >
                <UserIcon2 />
              </div>
            </div>
          )}

          {isCustomer && (
            <div>
              <Button
                onClick={() =>
                  navigate(`/dashboard/customers/${customer?.id}`, {
                    state: { from: "Instagram", index: selectedActiveIndex },
                  })
                }
                className="is-customer-desktop"
                startIcon={<UserIcon stroke="#009444" />}
              >
                Profile Details
              </Button>
              {/* <button
                onClick={() =>
                  navigate(`/dashboard/customers/${customer?.id}`, {
                    state: { from: "Instagram", index: selectedActiveIndex },
                  })
                }
                className="is-customer-desktop"
              >
                <UserIcon />
              </button> */}

              <button
                onClick={() =>
                  navigate(`/dashboard/customers/${customer?.id}`, {
                    state: { from: "Instagram", index: selectedActiveIndex },
                  })
                }
                className="is-customer-mobile"
              >
                <PlusIcon />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="chat-dm__container" ref={chatContainerRef}>
        {selectedMessageList
          ?.slice(0)
          ?.reverse()
          ?.map((data: any, index: number) => (
            <div>
              <div className="group-date-container">
                <hr></hr>
                <div className="group-date">{data?.day}</div>
                <hr></hr>
              </div>

              {data?.messages
                ?.slice(0)
                ?.reverse()
                ?.map((message: any, index: number) => (
                  <div key={index} className="chat-dm__message">
                    {/* from customers  */}
                    {message?.from?.id === chat?.participants?.data[1]?.id ? (
                      <div className="customer-container">
                        {message?.message && (
                          <button className="customer">
                            <div className="customers-profile-section">
                              <div className="profile-img">
                                <Avatar
                                  src={
                                    selectedProfilePicture[
                                      selectedActiveIndex
                                    ] !== undefined
                                      ? selectedProfilePicture[
                                          selectedActiveIndex
                                        ][chat.participants.data[1].id]
                                          ?.profile_pic
                                      : ""
                                  }
                                  alt="profile"
                                  className="avatar"
                                  sx={{
                                    width: {
                                      xs: "32px",
                                      md: "32px",
                                    },
                                    height: { xs: "32px", md: "32px" },
                                  }}
                                />
                              </div>
                            </div>

                            <div className="customers-chatbox">
                              <div>{message?.message}</div>
                              <div className="time">
                                {moment(message?.created_time).format("LT")}
                              </div>
                            </div>
                          </button>
                        )}

                        {message?.attachments?.data?.map((item: any) => (
                          <div className="customer__">
                            {item?.image_data && (
                              <img
                                src={item?.image_data?.url}
                                alt="upload"
                                onClick={() => {
                                  setOpenImageModal(!openImageModal);
                                  setSelectedImage(item?.image_data?.url);
                                }}
                              />
                            )}
                            <ImageModal
                              imageSource={selectedImage}
                              openModal={openImageModal}
                              setOpenmodal={() =>
                                setOpenImageModal(!openImageModal)
                              }
                            />
                          </div>
                        ))}

                        {/* This is for unsupported media type */}
                        {message?.is_unsupported && (
                          <div className="customer">
                            <div className="customers-profile-section">
                              <div className="profile-img">
                                <Avatar
                                  src={
                                    selectedProfilePicture[
                                      selectedActiveIndex
                                    ] !== undefined
                                      ? selectedProfilePicture[
                                          selectedActiveIndex
                                        ][chat.participants.data[1].id]
                                          ?.profile_pic
                                      : ""
                                  }
                                  alt="profile"
                                  className="avatar"
                                  sx={{
                                    width: {
                                      xs: "32px",
                                      md: "32px",
                                    },
                                    height: { xs: "32px", md: "32px" },
                                  }}
                                />
                              </div>
                            </div>
                            <div className="no-file-supported">
                              <div>
                                <div className="no-support-title">
                                  Media not supported.
                                </div>
                                <div className="no-support-file-content">
                                  This message cannot be displayed.
                                </div>
                              </div>
                              <div className="icon">
                                <InfoCircleIcon />
                              </div>
                            </div>
                          </div>
                        )}
                        {/* End of unsupported media type */}
                      </div>
                    ) : (
                      <div className="sales-container">
                        {/* This for request payment link */}
                        {message?.message && (
                          <div className="sales-person">
                            <div className="message-content">
                              {" "}
                              {message?.message.includes(
                                `${selectedCurrentStore?.url_link}/p/`
                              ) ? (
                                <div>
                                  <div>
                                    {!message?.message.includes(
                                      "Kindly use the link below to make payment for your order"
                                    ) && (
                                      <div className="alignment">
                                        {message?.message.includes(
                                          `${selectedCurrentStore?.url_link}/p/`
                                        ) &&
                                          !message?.message.includes(
                                            "Kindly use the link below to make payment for your order."
                                          ) && <span> You sent an order </span>}
                                        {!message?.message.includes(
                                          `${selectedCurrentStore?.url_link}/p/`
                                        ) &&
                                          !message?.message.includes(
                                            "Kindly use the link below to make payment for your order"
                                          ) && (
                                            <span> {message?.message} </span>
                                          )}

                                        <span className="time-and-icon">
                                          <span className="time">
                                            {moment(
                                              message?.created_time
                                            ).format("LT")}
                                          </span>
                                          {/* 
                                  {!isLoading && <span className="delivered">
                                    <DeliveredIcon />
                                  </span>
                                  }

                                  {isLoading && messageValue && (
                                    <span className="not-delivered">
                                      <NotDeliveredIcon />
                                    </span>
                                  )} */}

                                          {/* {isError && (
                                    <span className="failed">
                                      <RetryIcon />
                                    </span>
                                  )} */}
                                        </span>
                                      </div>
                                    )}
                                    {message?.message.includes(
                                      `${selectedCurrentStore?.url_link}/p/`
                                    ) &&
                                      !message?.message.includes(
                                        "Kindly use the link below to make payment for your order"
                                      ) && (
                                        <div>
                                          <div
                                            className="order-messages"
                                            dangerouslySetInnerHTML={{
                                              __html: observeNewLinesOrder(
                                                message?.message
                                              ),
                                            }}
                                          ></div>
                                          <a
                                            href={`/dashboard/orders/${
                                              findSingleOrder(
                                                extractLinkFromString(
                                                  message?.message
                                                ) as string
                                              )?.id
                                            }`}
                                            // href={`${extractLinkFromString(
                                            //   message?.message
                                            // )}`}
                                            // target="_blank"
                                            // rel="noopener noreferrer"
                                            className="order-file"
                                          >
                                            <div className="order-item">
                                              <div className="items">
                                                <div className="items-number">
                                                  Items:{" "}
                                                  {findSingleOrder(
                                                    extractLinkFromString(
                                                      message?.message
                                                    ) as string
                                                  )?.items?.reduce(
                                                    (
                                                      accumulator,
                                                      currentItem
                                                    ) =>
                                                      accumulator +
                                                      currentItem.quantity,
                                                    0
                                                  )}
                                                </div>
                                                <div className="items-id">
                                                  Order No:
                                                  {
                                                    findSingleOrder(
                                                      extractLinkFromString(
                                                        message?.message
                                                      ) as string
                                                    )?.id
                                                  }{" "}
                                                </div>
                                                <div className="items-price">
                                                  Amount:{" "}
                                                  {
                                                    findSingleOrder(
                                                      extractLinkFromString(
                                                        message?.message
                                                      ) as string
                                                    )?.currency_code
                                                  }
                                                  {
                                                    findSingleOrder(
                                                      extractLinkFromString(
                                                        message?.message
                                                      ) as string
                                                    )?.total
                                                  }
                                                </div>
                                              </div>
                                              <div className="items-badge-area">
                                                <div className="items-badge">
                                                  <div>
                                                    {
                                                      findSingleOrder(
                                                        extractLinkFromString(
                                                          message?.message
                                                        ) as string
                                                      )?.payment_status
                                                    }
                                                  </div>
                                                </div>
                                                <div className="item-share-icon">
                                                  <LinkIcon />
                                                </div>
                                              </div>
                                            </div>
                                          </a>
                                        </div>
                                      )}

                                    {message?.message.includes(
                                      `${selectedCurrentStore?.url_link}/p/`
                                    ) &&
                                      message?.message.includes(
                                        "Kindly use the link below to make payment for your order."
                                      ) && (
                                        <div>
                                          <div className="payment-messages">
                                            Kindly use the link below to make
                                            payment for your order:
                                          </div>
                                          <a
                                            href={`${
                                              extractLinkFromString(
                                                message?.message
                                              )?.split("/n/n")[0]
                                            }`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="body-link"
                                          >{`${
                                            extractLinkFromString(
                                              message?.message
                                            )?.split("/n/n")[0]
                                          }`}</a>
                                          <a
                                            href={`/dashboard/orders/${
                                              findSingleOrder(
                                                extractLinkFromString(
                                                  message?.message
                                                )?.split("/n/n")[0] as string
                                              )?.id
                                            }`}
                                            // href={`${extractLinkFromString(
                                            //   message?.message
                                            // )?.split("/n/n")[0]
                                            //   }`}
                                            // target="_blank"
                                            // rel="noopener noreferrer"
                                            className="order-file"
                                          >
                                            <div className="order-item">
                                              <div className="items">
                                                <div className="items-number">
                                                  Items:{" "}
                                                  {findSingleOrder(
                                                    extractLinkFromString(
                                                      message?.message
                                                    )?.split(
                                                      "/n/n"
                                                    )[0] as string
                                                  )?.items?.reduce(
                                                    (
                                                      accumulator,
                                                      currentItem
                                                    ) =>
                                                      accumulator +
                                                      currentItem.quantity,
                                                    0
                                                  )}
                                                </div>
                                                <div className="items-id">
                                                  Order No:
                                                  {
                                                    findSingleOrder(
                                                      extractLinkFromString(
                                                        message?.message
                                                      )?.split(
                                                        "/n/n"
                                                      )[0] as string
                                                    )?.id
                                                  }{" "}
                                                </div>
                                                <div className="items-price">
                                                  Amount:{" "}
                                                  {
                                                    findSingleOrder(
                                                      extractLinkFromString(
                                                        message?.message
                                                      )?.split(
                                                        "/n/n"
                                                      )[0] as string
                                                    )?.currency_code
                                                  }
                                                  {
                                                    findSingleOrder(
                                                      extractLinkFromString(
                                                        message?.message
                                                      )?.split(
                                                        "/n/n"
                                                      )[0] as string
                                                    )?.total
                                                  }
                                                </div>
                                              </div>
                                              <div className="items-badge-area">
                                                <div className="items-badge">
                                                  <div>
                                                    {
                                                      findSingleOrder(
                                                        extractLinkFromString(
                                                          message?.message
                                                        )?.split(
                                                          "/n/n"
                                                        )[0] as string
                                                      )?.payment_status
                                                    }
                                                  </div>
                                                </div>
                                                <div className="item-share-icon">
                                                  <LinkIcon />
                                                </div>
                                              </div>
                                            </div>
                                          </a>

                                          <span
                                            className="time-and-icon"
                                            style={{ marginTop: "1rem" }}
                                          >
                                            <span className="time">
                                              {moment(
                                                message?.created_time
                                              ).format("LT")}
                                            </span>

                                            {/* {!isLoading && <span className="delivered">
                                <DeliveredIcon />
                              </span>
                              }

                              {isLoading && messageValue && (
                                <span className="not-delivered">
                                  <NotDeliveredIcon />
                                </span>
                              )} */}
                                          </span>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              ) : // ))
                              message?.message.includes(
                                  `${selectedCurrentStore?.url_link}/products/`
                                ) ? (
                                <div>
                                  {parseString(
                                    message?.message,
                                    selectedCurrentStore
                                  ).length ? (
                                    parseString(
                                      message?.message,
                                      selectedCurrentStore
                                    )?.map((item: any, index: number) => (
                                      <div key={index}>
                                        <div className="alignment">
                                          <div>
                                            <div
                                              dangerouslySetInnerHTML={{
                                                __html: observeNewLines(
                                                  item.productName
                                                ),
                                              }}
                                            ></div>
                                            <div
                                              dangerouslySetInnerHTML={{
                                                __html: observeNewLines(
                                                  `${item.currencySymbol}${item.productPrice}`
                                                ),
                                              }}
                                            ></div>
                                            <div
                                              dangerouslySetInnerHTML={{
                                                __html: observeNewLines(
                                                  `<a target="_blank" class='ig-actions-url' href='${item.productLink}'>${item.productLink}</a>`
                                                ),
                                              }}
                                            ></div>
                                          </div>
                                        </div>

                                        <a
                                          href={`/dashboard/products/${
                                            findSingleProduct(
                                              extractLinkFromString(
                                                item.productLink
                                              ) as string
                                            )?.id
                                          }`}
                                          // href={`${extractLinkFromString(
                                          //   item.productLink
                                          // )}`}
                                          // target="_blank"
                                          // rel="noopener noreferrer"
                                          className="product-file"
                                        >
                                          <div className="product-image">
                                            {/* findSingleProduct(extractLinkFromString(item) as string)?.image_path || findSingleProduct(extractLinkFromString(item) as string)?.image_url */}
                                            <img
                                              src={
                                                findSingleProduct(
                                                  extractLinkFromString(
                                                    item.productLink
                                                  ) as string
                                                )?.alt_image_url
                                              }
                                              alt="product"
                                            />
                                          </div>
                                          <div className="product-content">
                                            <div>
                                              {
                                                findSingleProduct(
                                                  extractLinkFromString(
                                                    item.productLink
                                                  ) as string
                                                )?.name
                                              }
                                            </div>
                                            <div className="product-price">
                                              {
                                                findSingleProduct(
                                                  extractLinkFromString(
                                                    item.productLink
                                                  ) as string
                                                )?.quantity
                                              }{" "}
                                              items in stock
                                            </div>
                                            <div className="share-product">
                                              <div>Tap to view</div>
                                              <div className="share-icon">
                                                <LinkIcon />
                                              </div>
                                            </div>
                                          </div>
                                        </a>
                                        {/* } */}
                                      </div>
                                    ))
                                  ) : (
                                    <div>
                                      <div className="alignment">
                                        <span>
                                          <span
                                            dangerouslySetInnerHTML={{
                                              __html: observeNewLines(
                                                message?.message
                                              ),
                                            }}
                                          ></span>
                                        </span>
                                      </div>

                                      <a
                                        href={`/dashboard/products/${
                                          findSingleProduct(
                                            extractLinkFromString(
                                              message?.message
                                            ) as string
                                          )?.id
                                        }`}
                                        // href={`${extractLinkFromString(
                                        //   message?.message
                                        // )}`}
                                        // target="_blank"
                                        // rel="noopener noreferrer"
                                        className="product-file"
                                      >
                                        <div className="product-image">
                                          {/* findSingleProduct(extractLinkFromString(item) as string)?.image_path || findSingleProduct(extractLinkFromString(item) as string)?.image_url */}
                                          <img
                                            src={
                                              findSingleProduct(
                                                extractLinkFromString(
                                                  message?.message
                                                ) as string
                                              )?.alt_image_url
                                            }
                                            alt="product"
                                          />
                                        </div>
                                        <div className="product-content">
                                          <div>
                                            {
                                              findSingleProduct(
                                                extractLinkFromString(
                                                  message?.message
                                                ) as string
                                              )?.name
                                            }
                                          </div>
                                          <div className="product-price">
                                            {
                                              findSingleProduct(
                                                extractLinkFromString(
                                                  message?.message
                                                ) as string
                                              )?.price_formatted
                                            }
                                          </div>
                                          <div className="share-product">
                                            <div>
                                              {
                                                findSingleProduct(
                                                  extractLinkFromString(
                                                    message?.message
                                                  ) as string
                                                )?.quantity
                                              }{" "}
                                              items in stock
                                            </div>
                                            <div className="share-icon">
                                              <LinkIcon />
                                            </div>
                                          </div>
                                        </div>
                                      </a>
                                      {/* } */}
                                    </div>
                                  )}

                                  <span className="time-and-icon">
                                    <span className="time">
                                      {moment(message?.created_time).format(
                                        "LT"
                                      )}
                                    </span>

                                    {/* {!isLoading && <span className="delivered">
                                <DeliveredIcon />
                              </span>
                              }

                              {isLoading && messageValue && (
                                <span className="not-delivered">
                                  <NotDeliveredIcon />
                                </span>
                              )} */}
                                  </span>
                                </div>
                              ) : (
                                <div className="alignment">
                                  <span>
                                    {!message?.message.includes(
                                      `${selectedCurrentStore?.url_link}/p/`
                                    )
                                      ? message?.message
                                      : "You sent an order"}
                                  </span>
                                  {/* messageValue && <span>{selectedSentMessage}</span> */}

                                  <span className="time-and-icon">
                                    <span className="time">
                                      {moment(message?.created_time).format(
                                        "LT"
                                      )}
                                    </span>

                                    {/* {!isLoading && <span className="delivered">
                                <DeliveredIcon />
                              </span>
                              }

                              {isLoading && messageValue && (
                                <span className="not-delivered">
                                  <NotDeliveredIcon />
                                </span>
                              )} */}
                                    {/* 
                            {isError && (
                              <span className="failed">
                                <RetryIcon />
                              </span>
                            )} */}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <div>
                          {message?.attachments?.data?.map((item: any) => (
                            <div className="sales-container__uploaded-image">
                              {item?.image_data && (
                                <img
                                  src={item?.image_data?.url}
                                  alt="upload"
                                  onClick={() => {
                                    setOpenImageModal(!openImageModal);
                                    setSelectedImage(item?.image_data?.url);
                                  }}
                                />
                              )}

                              <ImageModal
                                imageSource={selectedImage}
                                openModal={openImageModal}
                                setOpenmodal={() =>
                                  setOpenImageModal(!openImageModal)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
      </div>

      {canManageMessaging && (
        <div className="footer">
          {isLoadingImages && (
            <div className="flex  space-x-5 justify-center uploading-image-container items-center">
              <div className="progress-text">Uploading Image</div>
              <div className="w-[21rem] bg-white rounded-full h-[16px] border progress">
                <div
                  className="dark:bg-green-600 h-[16px] rounded-full"
                  style={{ width: `${imageProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          <div className="action-buttons">
            <button
              onClick={() => {
                // if (!isCustomer) {
                //   setShowCustomerModal(true);
                //   setCreateCustomerHeader("to select products");
                // } else {
                setOpenProductModal(true);
                // }
              }}
            >
              Send Product
            </button>
            <button
              onClick={() => {
                if (!isCustomer) {
                  setShowCustomerModal(true);
                  setCreateCustomerHeader("to create order");
                } else {
                  setShowCreateOrderModal(true);
                }
              }}
            >
              Create Order
            </button>
            <button
              onClick={() => {
                if (!isCustomer) {
                  setShowCustomerModal(true);
                  setCreateCustomerHeader("to request payment");
                } else {
                  setShowPaymentModal(true);
                }
              }}
            >
              Request Payment
            </button>
            <LoadingButton
              loading={invoiceLoader}
              onClick={() => {
                if (!isCustomer) {
                  setShowCustomerModal(true);
                  setCreateCustomerHeader("to share invoice");
                } else {
                  setShowInvoiceModal(true);
                }
              }}
            >
              Share Invoice
            </LoadingButton>
          </div>

          <div className="textbox-section">
            <div className="textbox">
              <input
                type="text"
                name="message"
                value={messageValue}
                onChange={(e) => {
                  setMessageValue(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Message..."
              />
              <button
                onClick={() => {
                  handleChatSendAction(messageValue);
                }}
                type="button"
              >
                <SendIcon />
              </button>
            </div>

            <div className="icons-section">
              {/* <MicroPhoneIcon /> */}
              <label>
                <UploadFileIcon />
                <input
                  disabled={isLoadingImages}
                  onChange={handleFileInputChange}
                  name="user_image"
                  id="user_image"
                  hidden
                  type="file"
                  accept="image/*"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {
        <AddCustomerModal
          openModal={showCustomerModal}
          closeModal={() => setShowCustomerModal(false)}
          discardFunc={() => {
            navigate("/dashboard/messages", {
              state: { index: selectedActiveIndex },
            });
            setShowCustomerModal(false);
          }}
          from={createCustomerHeader}
          handle={chat?.participants?.data[1]?.username}
        />
      }
      {showCreateOrderModal && (
        <CreateOrderModal
          openModal={showCreateOrderModal}
          closeModal={() => {
            setShowCreateOrderModal(false);
          }}
          handleOrder={handleOrder}
          activeChat={chat as IConversationsList}
        />
      )}
      {showInvoiceModal && (
        <SendInvoiceModal
          openModal={showInvoiceModal}
          closeModal={() => {
            setShowInvoiceModal(false);
          }}
          id={customer?.id}
          handleSentInvoice={handleSentInvoice}
        />
      )}

      {showPaymentModal && (
        <RequestPaymentModal
          openModal={showPaymentModal}
          closeModal={() => {
            setShowPaymentModal(false);
          }}
          id={customer?.id}
          handlePaymentSettlement={handlePaymentSettlement}
        />
      )}

      {openProductModal && (
        <SelectInstagramProductModal
          openModal={openProductModal}
          closeModal={() => {
            setOpenProductModal(false);
          }}
          handleSelectedProduct={handleSelectedProduct}
        />
      )}
    </div>
  );
};

export default ChatArea;
