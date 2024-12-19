import { useState, useEffect } from "react";
import {
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Skeleton,
} from "@mui/material";

import { SearchIcon } from "assets/Icons/SearchIcon";

import ErrorMsg from "components/ErrorMsg";
import InputField from "components/forms/InputField";
import ModalRight from "components/ModalRight";
import EmptyResponse from "components/EmptyResponse";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { ICampaign, IEntry } from "Models/marketing";

import {
  useGetSingleCampaignV2Query,
  useResendFailedCampaignsMutation,
} from "services";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";

import { RefrshIcon } from "assets/Icons/RefreshIcon";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingProductBox } from "pages/Dashboard/Orders/widgets/product/SelectProductModal";
import "./style.scss";

type RecipientsProps = {
  openModal: boolean;
  closeModal: () => void;
  activeData: ICampaign;
};

const filters = ["All", "Delivered", "Sent", "Waiting", "Failed", "Rejected"];

const sentTargetStatuses = ["submitted", "sent", "buffered"];
const failedTargetStatuses = [
  "failed",
  "absentsubscriber",
  "insufficientcredit",
  "invalidlinkid",
  "donotdisturb",
  "donotdisturbrejection",
];
const rejectedTargetStatuses = [
  "rejected",
  "expired",
  "userinactive",
  "useraccountsuspended",
  "userinactive",
  "usernotsubscribedtoproduct",
  "userdoesnotexist",
  "notnetworkprovider",
  "userinblacklist",
];

const getChipColor = (status: string) => {
  if (status === "success") {
    return { color: "success", label: "Delivered" };
  } else if (status === "pending") {
    return { color: "warning", label: "Waiting" };
  } else if (sentTargetStatuses.includes(status?.toLowerCase())) {
    return { color: "info", label: "Sent" };
  } else if (failedTargetStatuses.includes(status?.toLowerCase())) {
    return { color: "default", label: "Failed" };
  } else if (rejectedTargetStatuses.includes(status?.toLowerCase())) {
    return { color: "error", label: "Rejected" };
  }
};

export const Recipients = ({
  openModal,
  closeModal,
  activeData,
}: RecipientsProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const [hasMore, setHasMore] = useState(true);
  const [activityList, setActivityList] = useState<any[]>([]);

  const [resendFailedCampaign, { isLoading: isResendLoading }] =
    useResendFailedCampaignsMutation();

  const { data, isLoading, isFetching, isError, refetch } =
    useGetSingleCampaignV2Query(
      { id: `${activeData?.id}`, page, limit: 25, filter, search: searchValue },
      {
        skip: activeData?.id ? false : true,
      }
    );

  const handleResend = async () => {
    try {
      let result = await resendFailedCampaign(`${activeData?.id}`);

      if ("data" in result) {
        showToast("Resent Successfully", "success");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const fetchMoreData = () => {
    if (data?.campaign?.entries?.last_page === page) {
      setHasMore(false);
    } else {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    if (data) {
      let list: any = data?.campaign?.entries?.data;
      if (searchValue || filter !== "All") {
        if (page === 1) {
          setActivityList(list);
        } else {
          setActivityList((prev) => [...prev, ...list]);
        }
      } else {
        if (page === 1) {
          setActivityList(list);
        } else {
          setActivityList((prev) => [...prev, ...list]);
        }
      }
    }
  }, [data, searchValue, page]);

  return (
    <ModalRight
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <div className="modal_right_children pd_view_campaign pd_recipient">
        <div className="top_section" id="scroller_top">
          <ModalRightTitle
            closeModal={() => {
              closeModal();
            }}
            title={`Recipients(${data?.campaign?.entries?.total || 0})`}
            className="remove_border"
          ></ModalRightTitle>

          <div className="recipient_body">
            <InputField
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setPage(1);
                setHasMore(true);
              }}
              placeholder="Search"
              containerClass="search_field"
              suffix={<SearchIcon />}
            />

            <div className="filter_container">
              {filters.map((item, i) => (
                <Button
                  key={i}
                  onClick={() => {
                    setFilter(item);
                    setPage(1);
                    setHasMore(true);
                  }}
                  className={`${filter === item ? "active" : ""}`}
                >
                  {item}
                </Button>
              ))}

              <IconButton
                onClick={() => {
                  refetch();
                  setHasMore(true);
                }}
                className="icon_button_container "
              >
                <RefrshIcon />
              </IconButton>
            </div>

            <div className="reciepient_list_container">
              {!isError && !isLoading ? (
                activityList && activityList.length ? (
                  <div className="single_related_product">
                    <InfiniteScroll
                      dataLength={activityList.length}
                      next={fetchMoreData}
                      scrollableTarget={"scroller_top"}
                      hasMore={hasMore}
                      loader={<h4></h4>}
                    >
                      {activityList.map((item: IEntry, i: number) => (
                        <div key={item.id} className="single_recipient">
                          <div className="text_section">
                            <p className="serial_number">{i + 1}.</p>
                            <div className="name_container">
                              <p className="name">{item?.customer_name}</p>
                              <p className="email">{item?.recipient}</p>
                            </div>
                          </div>
                          {item?.status && (
                            <div className="status">
                              <Chip
                                label={getChipColor(item?.status)?.label}
                                color={
                                  (getChipColor(item?.status)?.color ||
                                    "default") as any
                                }
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </InfiniteScroll>
                  </div>
                ) : (
                  <EmptyResponse message="No record found" />
                )
              ) : (
                ""
              )}

              {(isLoading || isFetching) &&
                [1, 2, 3, 4].map((item) => <LoadingProductBox key={item} />)}
              {isError && <ErrorMsg error={"Something went wrong"} />}
            </div>
          </div>
        </div>

        {/* <div className="bottom_section">
          <Button type="button" className="save" onClick={handleResend}>
            {isResendLoading ? (
              <CircularProgress size="1.5rem" sx={{ color: "#fff" }} />
            ) : (
              "Resend Campaigns"
            )}
          </Button>
        </div> */}
      </div>
    </ModalRight>
  );
};
