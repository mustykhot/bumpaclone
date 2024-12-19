import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { IconButton, CircularProgress } from "@mui/material";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import Modal from "components/Modal";
import { useGetInvalidCustomersQuery } from "services";

import "./styles.scss";

type PropType = {
  openModal: boolean;
  closeModal: () => void;
  type: string;
};

const InvalidCustomersModal = ({ closeModal, openModal, type }: PropType) => {
  const [dataCount, setDataCount] = useState(15);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading, isFetching } = useGetInvalidCustomersQuery({
    limit: dataCount,
    page: 1,
  });

  const [count, setCount] = useState();
  const [emailList, setEmailList] = useState<any>([]);
  const [phoneList, setPhoneList] = useState<any>([]);

  useEffect(() => {
    if (!isFetching && data) {
      const num =
        type === "email"
          ? data?.invalidEmailsCount
          : type === "sms"
          ? data?.invalidPhonesCount
          : 0;

      setCount(num);

      if (type === "sms") {
        let list = data?.invalidPhones.data;
        if (page === 1) {
          setPhoneList(list);
        } else {
          setPhoneList((prev: any) => [...prev, ...list]);
        }
        setPhoneList(data?.invalidPhones.data);
        setHasMore(data?.invalidPhonesCount > data?.invalidPhones.data.length);
      } else if (type === "email") {
        let list = data?.invalidEmails.data;
        if (page === 1) {
          setEmailList(list);
        } else {
          setEmailList((prev: any) => [...prev, ...list]);
        }
        setEmailList(data?.invalidEmails.data);
        setHasMore(data?.invalidEmailsCount > data?.invalidEmails.data.length);
      }
    }
  }, [data, isFetching]);

  const fetchMoreData = () => {
    setPage(page + 1);
    setDataCount(dataCount + 15);
  };

  return (
    <div>
      <Modal
        openModal={openModal}
        closeModal={() => closeModal()}
        closeOnOverlayClick={true}
      >
        <div className="invalid_customers_wrap">
          <div onClick={() => closeModal()}>
            <IconButton type="button" className="back_btn_wrap">
              <CloseSqIcon />
            </IconButton>
          </div>
          <div className="modal_body">
            {isLoading ? (
              <div className="loading_state">
                <CircularProgress />
              </div>
            ) : (
              <>
                <h3>Excluded Selections {`(${count})`}</h3>
                <p>
                  The customers listed below are not selected due to incorrect{" "}
                  {type === "email" ? "email addresses" : "phone numbers"}{" "}
                  required to send the campaign message. Update customer details
                  with the correct information to be able to send campaign{" "}
                  {type === "email" ? "emails" : "SMS"}.
                </p>
                {type === "email" && (
                  <div className="name_lists" id="scroller_top">
                    <ul>
                      <InfiniteScroll
                        dataLength={emailList?.length}
                        next={fetchMoreData}
                        scrollableTarget={"scroller_top"}
                        hasMore={hasMore}
                        loader={<CircularProgress />}
                      >
                        {emailList &&
                          emailList.map((item: any, index: number) => (
                            <li key={index}>{item.name}</li>
                          ))}
                      </InfiniteScroll>
                    </ul>
                  </div>
                )}

                {type === "sms" && (
                  <div className="name_lists" id="scroller_top">
                    <ul>
                      <InfiniteScroll
                        dataLength={phoneList?.length}
                        next={fetchMoreData}
                        scrollableTarget={"scroller_top"}
                        hasMore={hasMore}
                        loader={<CircularProgress />}
                      >
                        {phoneList &&
                          phoneList.map((item: any, index: number) => (
                            <li key={index}>{item.name}</li>
                          ))}
                      </InfiniteScroll>
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InvalidCustomersModal;
