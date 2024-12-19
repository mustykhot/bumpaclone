import { Button, Chip, IconButton, Skeleton, Tooltip } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import { ChevronRight } from "assets/Icons/ChevronRight";
import { CopyIcon } from "assets/Icons/CopyIcon";
import { FillArrowIcon } from "assets/Icons/FillArrowIcon";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { SearchIcon } from "assets/Icons/SearchIcon";
import EmptyReferral from "assets/images/EmptyReferral.png";
import ReferralCoinLarge from "assets/images/ReferralCoinLarge.svg";
import TransparentNairaBW from "assets/images/TransparentNairaBW.png";
import DateRangeDropDown from "components/DateRangeDropDown";
import InputField from "components/forms/InputField";
import TableComponent from "components/table";
import { useCopyToClipboardHook } from "hooks/useCopyToClipboardHook";
import {
  useActivateReferralMutation,
  useGetReferralAnalyticsQuery,
  useGetStoreInformationQuery,
  useGetStoreReferralsQuery,
} from "services";
import { selectCurrentStore, setStoreDetails } from "store/slice/AuthSlice";
import {
  addReferralFilter,
  selectReferralFilters,
} from "store/slice/FilterSlice";
import {
  selectShowReferralModal,
  setShowReferralModal,
} from "store/slice/NotificationSlice";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  formatPrice,
  formatPricewrapp,
  handleError,
  translateReferralStatus,
} from "utils";
import { thisWeekEnd, thisWeekStart } from "utils/constants/general";
import { ActivateReferralModal } from "./widget/ActivateReferralModal";
import { HowItWorksModal } from "./widget/HowItWorksReferral";

export const Referrals = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isShowReferralModal = useAppSelector(selectShowReferralModal);
  const userStore = useAppSelector(selectCurrentStore);
  const [activateReferral, { isLoading: activateReferralLoading }] =
    useActivateReferralMutation();
  const [dataCount, setDataCount] = useState("25");
  const [displayReferralModal, setDisplayReferralModal] = useState(false);
  const [openHowItWorksModal, setOpenHowItWorksModal] = useState(false);
  const hasActivatedReferral = userStore?.has_activated_referral !== 0;

  const [dateRange, setDateRange] = useState<any>([
    {
      startDate: "",
      endDate: "",
      key: "selection",
    },
  ]);

  const [tableDateRange, setTableDateRange] = useState<any>([
    {
      startDate: "",
      endDate: "",
      key: "selection",
    },
  ]);

  const {
    data: referralAnalytics,
    isLoading: isLoadingReferralAnalytics,
    refetch: refetchReferralAnalytics,
  } = useGetReferralAnalyticsQuery({
    from:
      dateRange && dateRange[0].startDate
        ? moment(new Date(dateRange[0]?.startDate)).format("Y-MM-DD")
        : "",
    to:
      dateRange && dateRange[0].endDate
        ? moment(new Date(dateRange[0]?.endDate)).format("Y-MM-DD")
        : "",
  });

  const referralFilters = useAppSelector(selectReferralFilters);

  const filterList = [
    {
      name: "All",
      value: "",
    },
    {
      name: "Pending",
      value: "pending",
    },
    {
      name: "Successful",
      value: "successful",
    },
  ];

  const headCell = [
    {
      key: "date",
      name: "Date",
    },
    {
      key: "store",
      name: "Store Name",
    },
    {
      key: "referral",
      name: "Referral Name",
    },
    {
      key: "phone",
      name: "Phone Number",
    },
    {
      key: "amount",
      name: "Amount Earned",
    },
    {
      key: "status",
      name: "Referral Status",
    },
  ];

  const {
    data: storeReferrals,
    isLoading: isStoreReferralsLoading,
    isFetching: isStoreReferralsFetching,
    isError: isStoreReferralsError,
    refetch: refetchStoreReferrals,
  } = useGetStoreReferralsQuery({
    from:
      tableDateRange && tableDateRange[0].startDate
        ? moment(new Date(tableDateRange[0]?.startDate)).format("Y-MM-DD")
        : "",
    to:
      tableDateRange && tableDateRange[0].endDate
        ? moment(new Date(tableDateRange[0]?.endDate)).format("Y-MM-DD")
        : "",
    status: referralFilters?.status,
    search: referralFilters?.search,
    page: referralFilters?.page,
    limit: Number(dataCount),
  });

  const { data: latestStoreInfo, refetch: refetchStoreInfo } =
    useGetStoreInformationQuery();

  const handleActiveReferral = async () => {
    try {
      let result = await activateReferral();
      if ("data" in result) {
        setDisplayReferralModal(false);
        showToast("You’ve joined in successfully", "success");

        refetchStoreInfo();

        refetchReferralAnalytics();
        refetchStoreReferrals();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const { handleCopyClick: handleCopyCodeClick } = useCopyToClipboardHook(
    `${userStore?.referral_code}`
  );

  const { handleCopyClick: handleCopyLinkClick } = useCopyToClipboardHook(
    `${userStore?.referral_link}`
  );

  const queryParams = new URLSearchParams(location.search);
  const fromHomeReferral = queryParams.get("fromHomeReferral");

  useEffect(() => {
    if (fromHomeReferral) {
      dispatch(setShowReferralModal(true));
    }
  }, [fromHomeReferral]);

  useEffect(() => {
    if (isShowReferralModal) {
      setDisplayReferralModal(true);
    }
  }, [isShowReferralModal]);

  useEffect(() => {
    if (latestStoreInfo) {
      dispatch(setStoreDetails(latestStoreInfo.store));
    }
  }, [latestStoreInfo, dispatch]);

  useEffect(() => {
    if (userStore) {
      refetchReferralAnalytics();
      refetchStoreReferrals();
    }
  }, [userStore, refetchReferralAnalytics, refetchStoreReferrals]);

  useEffect(() => {
    setTimeout(() => {
      if (fromHomeReferral) {
        queryParams.delete("fromHomeReferral");
      }
      const newUrl = `${window.location.origin}${window.location.pathname}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      window.history.replaceState(null, "", newUrl);
    }, 1000);
    // eslint-disable-next-line
  }, [fromHomeReferral]);

  return (
    <>
      <div className="pd_referrals">
        <div className="title_section">
          <h3 className="name_of_section">Referrals</h3>
          {!hasActivatedReferral && (
            <Button
              onClick={() => {
                setOpenHowItWorksModal(true);
              }}
              variant="contained"
              className="new"
            >
              <div className="new-content">
                <p>
                  New to Bumpa referrals? <span>See how it works</span>
                </p>
                <ChevronRight stroke="#009444" />
              </div>
            </Button>
          )}
        </div>
        <div className="info-section">
          <div className="info-section__number">
            <div className="info-section__number--one">
              <div className="info-section__number--one-text">
                <h4>
                  AVAILABLE BALANCE{" "}
                  <Tooltip
                    title="Balance can only be used for Bumpa subscriptions"
                    placement="top"
                  >
                    <IconButton>
                      <InfoCircleIcon stroke="#5C636D" strokeWidth={1.5} />
                    </IconButton>
                  </Tooltip>
                </h4>
                <div className="balance">
                  <span>₦</span>
                  {isLoadingReferralAnalytics ? (
                    <Skeleton
                      animation="wave"
                      width={40}
                      style={{ marginLeft: "10px" }}
                    />
                  ) : (
                    <h2>
                      {formatPricewrapp(
                        referralAnalytics?.pending_payment ?? 0
                      )}
                    </h2>
                  )}
                </div>
                <Button
                  onClick={() => {
                    navigate(`/dashboard/subscription`);
                  }}
                  className="subscribe"
                >
                  <p>Use balance to subscribe</p>
                </Button>
              </div>
              <img src={TransparentNairaBW} alt="Currency" />
            </div>
            <div className="info-section__number--two">
              <DateRangeDropDown
                className="date-range"
                setCustomState={setDateRange}
                from="referrals"
                action={
                  <Button
                    variant="outlined"
                    endIcon={<FillArrowIcon stroke="#5C636D" />}
                    className="export filter"
                  >
                    {dateRange && dateRange[0].startDate
                      ? `${moment(dateRange[0]?.startDate).format(
                          "D/MM/YYYY"
                        )} - ${moment(dateRange[0]?.endDate).format(
                          "D/MM/YYYY"
                        )}`
                      : "Select date range"}
                  </Button>
                }
              />
              <div className="info-section__number--two-analytics-wrap">
                <div className="info-section__number--two-wrap">
                  <div className="info-section__number--two-each">
                    <h4>Total Commission Earned</h4>
                    <div className="commission">
                      <span>₦</span>
                      {isLoadingReferralAnalytics ? (
                        <Skeleton
                          animation="wave"
                          width={40}
                          style={{ marginLeft: "10px" }}
                        />
                      ) : (
                        <p>
                          {formatPricewrapp(
                            referralAnalytics?.total_earned ?? 0
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="info-section__number--two-each">
                    <h4>Total Referrals</h4>
                    <p>
                      {isLoadingReferralAnalytics ? (
                        <Skeleton
                          animation="wave"
                          width={40}
                          style={{ marginLeft: "10px" }}
                        />
                      ) : (
                        referralAnalytics?.total_referrals
                      )}
                    </p>
                  </div>
                </div>
                <div className="info-section__number--two-wrap">
                  <div className="info-section__number--two-each">
                    <h4>Successful Referrals</h4>
                    <p>
                      {isLoadingReferralAnalytics ? (
                        <Skeleton
                          animation="wave"
                          width={40}
                          style={{ marginLeft: "10px" }}
                        />
                      ) : (
                        referralAnalytics?.earned_referrals
                      )}
                    </p>
                  </div>
                  <div className="info-section__number--two-each">
                    <h4>Pending Referrals</h4>
                    <p>
                      {isLoadingReferralAnalytics ? (
                        <Skeleton
                          animation="wave"
                          width={40}
                          style={{ marginLeft: "10px" }}
                        />
                      ) : (
                        referralAnalytics?.pending_referrals
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="info-section__right">
            <div className="info-section__right--one">
              {hasActivatedReferral ? (
                <div className="info-section__right--one-text">
                  <h3>Refer & Earn</h3>
                  <p>Refer other business owners and earn amazing rewards.</p>
                  <Button
                    onClick={() => {
                      setOpenHowItWorksModal(true);
                    }}
                    variant="contained"
                    className="works"
                  >
                    <div className="works-content">
                      <p>See how it works</p>
                      <ChevronRight stroke="#009444" />
                    </div>
                  </Button>
                </div>
              ) : (
                <div className="info-section__right--one-text new">
                  <h3>Join the Super Referrers Community</h3>
                  <h4>Need support for referrals?</h4>
                  <p>
                    Join our community of super referrers and get resources to
                    increase your earnings.
                  </p>
                  <Button
                    onClick={() => {
                      setDisplayReferralModal(true);
                    }}
                    variant="contained"
                    className="works"
                  >
                    <div className="works-content">
                      <p>Get started</p>
                    </div>
                  </Button>
                </div>
              )}
              <div className="info-section__right--one-image">
                <img src={ReferralCoinLarge} alt="Referral" />
              </div>
            </div>
            <div className="info-section__right--two">
              <div className="info-section__right--two-each">
                <p>Your Referral Code</p>
                <Button
                  onClick={() => {
                    handleCopyCodeClick();
                  }}
                  className="copy"
                >
                  <div className="copyWrap">
                    <span>{userStore?.referral_code}</span>
                    <div className="buttonWrap">
                      <CopyIcon stroke="#009444" />
                    </div>
                  </div>
                </Button>
              </div>
              <div className="info-section__right--two-each">
                <p>Your Referral Link</p>
                <Button
                  onClick={() => {
                    handleCopyLinkClick();
                  }}
                  className="copy"
                >
                  <div className="copyWrap">
                    <span className="link">{userStore?.referral_link}</span>
                    <div className="buttonWrap">
                      <CopyIcon stroke="#009444" />
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="referral_table_section">
          <div className="referral_table_section-header">
            <h3>Referral History</h3>
          </div>
          <div className="referral_table_section-action">
            <div className="left_section">
              <div className="filter_container">
                {filterList.map((item, i) => (
                  <Button
                    key={i}
                    onClick={() => {
                      dispatch(
                        addReferralFilter({
                          status: item.value,
                        })
                      );
                    }}
                    className={`filter_button ${
                      item.value === referralFilters.status ? "active" : ""
                    }`}
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="search_container">
              <DateRangeDropDown
                origin={"right"}
                className="date-range_table"
                setCustomState={setTableDateRange}
                from="referrals"
                action={
                  <Button
                    variant="outlined"
                    endIcon={<FillArrowIcon stroke="#5C636D" />}
                    className="export filter"
                  >
                    {tableDateRange && tableDateRange[0].startDate
                      ? `${moment(tableDateRange[0]?.startDate).format(
                          "D/MM/YYYY"
                        )} - ${moment(tableDateRange[0]?.endDate).format(
                          "D/MM/YYYY"
                        )}`
                      : "Select date range"}
                  </Button>
                }
              />
              <InputField
                type={"text"}
                containerClass="search_field"
                value={referralFilters?.search}
                onChange={(e: any) => {
                  dispatch(
                    addReferralFilter({
                      search: e.target.value,
                    })
                  );
                }}
                placeholder="Search"
                suffix={<SearchIcon />}
              />
            </div>
          </div>
          <TableComponent
            isError={isStoreReferralsError}
            isLoading={isStoreReferralsLoading || isStoreReferralsFetching}
            page={referralFilters?.page}
            setPage={(val) => {
              dispatch(
                addReferralFilter({
                  page: val,
                })
              );
            }}
            headCells={headCell}
            showPagination={true}
            dataCount={dataCount}
            setDataCount={setDataCount}
            meta={{
              current: storeReferrals?.referrals?.current_page,
              perPage: 10,
              totalPage: storeReferrals?.referrals?.last_page,
            }}
            tableData={storeReferrals?.referrals?.data.map((row: any) => ({
              id: row.id,
              date: moment(row.created_at).format("ll"),
              store: row.name,
              referral: row.referral_name,
              phone: row.phone,
              amount: formatPrice(row.amount_paid),
              status: (
                <Chip
                  color={translateReferralStatus(row.status)?.color}
                  label={translateReferralStatus(row.status)?.label}
                />
              ),
            }))}
            emptyImg={EmptyReferral}
            emptyMessage="Look like you haven’t referred anyone"
          />
        </div>
      </div>
      <ActivateReferralModal
        btnAction={() => {
          handleActiveReferral();
        }}
        closeModal={() => {
          dispatch(setShowReferralModal(false));
          setDisplayReferralModal(false);
        }}
        openModal={displayReferralModal}
        isLoading={activateReferralLoading}
      />
      <HowItWorksModal
        openModal={openHowItWorksModal}
        closeModal={() => setOpenHowItWorksModal(false)}
      />
    </>
  );
};
