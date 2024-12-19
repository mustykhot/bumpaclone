import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressProps,
  IconButton,
  circularProgressClasses,
} from "@mui/material";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import ErrorMsg from "components/ErrorMsg";
import ModalRight from "components/ModalRight";
import EmptyResponse from "components/EmptyResponse";
import { LoadingProductBox } from "pages/Dashboard/Orders/widgets/product/SelectProductModal";
import { formatTransactionPrice, truncateString } from "utils";
import { useGetTransactionQuery } from "services";
import { selectUserLocation } from "store/slice/AuthSlice";
import { useAppSelector } from "store/store.hooks";
import { TransactionListType } from "services/api.types";
import "./style.scss";

type Props = {
  openModal: boolean;
  closeModal: () => void;
  actionFnc: (transaction: TransactionListType) => void;
  skipAction?: () => void;
  skipLoad?: boolean;
  isSkip?: boolean;
};

function FacebookCircularProgress(props: CircularProgressProps) {
  return (
    <Box sx={{ position: "relative" }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: "#ebf6f0",
        }}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: "#009444",
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </Box>
  );
}

export const TransactionsToMatchModal = ({
  openModal,
  closeModal,
  actionFnc,
  skipAction,
  isSkip = true,
  skipLoad,
}: Props) => {
  const [page, setPage] = useState(1);
  const userLocation = useAppSelector(selectUserLocation);

  const {
    data: transactions,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetTransactionQuery({
    page,
    channel: "TERMINAL",
    unmatched: true,
    location_id: userLocation?.id,
  });

  const [hasMore, setHasMore] = useState(true);
  const [activityList, setActivityList] = useState<TransactionListType[]>([]);
  const [refreshBtnClicked, setRefresBtnClicked] = useState(false);
  const fetchMoreData = () => {
    if (transactions?.transactions?.last_page === page) {
      setHasMore(false);
    } else {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    if (transactions) {
      let list = transactions?.transactions?.data || [];
      if (page === 1) {
        setActivityList(list);
      } else {
        setActivityList((prev) => [...prev, ...list]);
      }
    }
  }, [transactions]);
  useEffect(() => {
    if (!isFetching) {
      setRefresBtnClicked(false);
    }
  }, [isFetching]);

  return (
    <>
      <ModalRight
        closeModal={() => {
          if (!skipLoad) {
            closeModal();
          }
        }}
        openModal={openModal}
      >
        <div className="modal_right_children pd_show_transactions_to_match">
          <div className="top_section" id="scroller_top">
            <div className="title_section">
              <div className="title_container">
                <IconButton
                  type="button"
                  onClick={() => {
                    closeModal();
                  }}
                  className="icon_button_container pad"
                >
                  <BackArrowIcon />
                </IconButton>{" "}
                <h3>Match Terminal Payment</h3>
              </div>
              <div className="btn_flex">
                <Button
                  onClick={() => {
                    refetch();
                    setRefresBtnClicked(true);
                  }}
                  disabled={skipLoad}
                >
                  Refresh
                </Button>
                {isSkip && (
                  <Button
                    onClick={() => {
                      skipAction && skipAction();
                    }}
                    disabled={skipLoad}
                  >
                    {skipLoad ? (
                      <CircularProgress
                        size="1.5rem"
                        sx={{ color: "#000000" }}
                      />
                    ) : (
                      "Skip"
                    )}
                  </Button>
                )}
              </div>
            </div>

            {refreshBtnClicked ? (
              <div className="stand_alone_loading_box">
                <FacebookCircularProgress />
                <p>Refreshing</p>
              </div>
            ) : (
              <>
                <div className="content_section">
                  <p className="content_title_text">
                    Click a transaction to match to the order
                  </p>
                </div>
                {isError && <ErrorMsg error={"Something went wrong"} />}
                {!isError && !isLoading && !isFetching ? (
                  activityList && activityList.length ? (
                    <div className="all_transaction_box">
                      <InfiniteScroll
                        dataLength={activityList.length}
                        next={fetchMoreData}
                        scrollableTarget={"scroller_top"}
                        hasMore={hasMore}
                        loader={<h4></h4>}
                      >
                        {activityList.map((item, i: any) => (
                          <div
                            key={i}
                            onClick={() => {
                              if (!skipLoad) {
                                actionFnc(item);
                              }
                            }}
                            className="single_transaction_box"
                          >
                            <div className="left_container">
                              <p className="name">
                                {item?.meta?.sender_name || "No Name Recorded"}
                              </p>
                              <p className="date">
                                {`${moment(item.created_at).format("LLL")}`}
                              </p>
                              {item.notes && (
                                <p className="note">
                                  Note:{truncateString(item.notes, 20)}
                                </p>
                              )}
                            </div>
                            <p className="amount">
                              {formatTransactionPrice(
                                Number(item.amount),
                                item.currency
                              )}
                            </p>
                          </div>
                        ))}
                      </InfiniteScroll>
                    </div>
                  ) : (
                    <EmptyResponse message="No Terminal Transactions To Match" />
                  )
                ) : (
                  ""
                )}
                {(isLoading || isFetching) &&
                  [1, 2, 3, 4].map((item) => (
                    <div key={item} className="px-[32px]">
                      <LoadingProductBox />
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      </ModalRight>
    </>
  );
};
