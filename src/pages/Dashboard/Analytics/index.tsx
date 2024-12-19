import { Button } from "@mui/material";
import { FillArrowIcon } from "assets/Icons/FillArrowIcon";
import DateRangeDropDown from "components/DateRangeDropDown";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import moment from "moment";
import { useEffect, useState } from "react";
import "./style.scss";
import { Sales } from "./widgets/Sales";
import { Transactions } from "./widgets/Transactions";
import { ProductAnalytics } from "./widgets/Products";
import { CampaignAnalytics } from "./widgets/Campaign";
import { CustomerAnalytics } from "./widgets/Customers";
import { thisYearEnd, thisYearStart } from "utils/constants/general";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "store/store.hooks";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import { UpgradeModal } from "components/UpgradeModal";

const tabList = [
  { label: "Sales", value: "sales" },
  { label: "Transactions", value: "transactions" },
  { label: "Products", value: "products" },
  { label: "Customers", value: "customers" },
  { label: "Campaigns", value: "campaigns" },
  // { label: "Messages", value: "messages" },
];

export const Analytics = () => {
  const [tab, setTab] = useState<
    | "sales"
    | "transactions"
    | "products"
    | "customers"
    | "campaigns"
    | "messages"
  >("sales");
  const [selectedCompareDate, setSelectedCompareDate] = useState<any>(null);
  const [dateRangeType, setDateRangeType] = useState("");
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  // const [tempSelectedCompareDate, setTempSelectedCompareDate] =
  //   useState<any>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlTab = searchParams.get("tab");

  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isFreeUser = isSubscriptionType === "free";
  const isStarterUser = isSubscriptionType === "starter";

  const [dateRange, setDateRange] = useState<any>([
    // {
    //   startDate: new Date(),
    //   endDate: addDays(new Date(), 7),
    //   key: "selection",
    // },
    {
      startDate: thisYearStart,
      endDate: thisYearEnd,
      key: "selection",
    },
  ]);

  const handleChangeTab = (
    event: React.SyntheticEvent,
    newValue:
      | "sales"
      | "transactions"
      | "products"
      | "customers"
      | "campaigns"
      | "messages"
  ) => {
    if (
      (isFreeUser || isStarterUser || isSubscriptionExpired) &&
      newValue === "campaigns"
    ) {
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
    } else {
      setTab(newValue);
      const newUrl = `${window.location.origin}${window.location.pathname}?tab=${newValue}`;
      window.history.replaceState(null, "", newUrl);
    }
  };

  // useEffect(() => {
  //   if (tempSelectedCompareDate) {
  //   }
  // }, [tempSelectedCompareDate]);

  useEffect(() => {
    if (urlTab) {
      setTab(
        urlTab as
          | "sales"
          | "transactions"
          | "products"
          | "customers"
          | "campaigns"
          | "messages"
      );
    } else {
      setTab("sales");
    }
  }, [urlTab]);

  useEffect(() => {
    setSelectedCompareDate(null);
  }, [dateRange]);

  return (
    <div className="pd_analytics">
      <div className="title_section">
        <h3 className="name_of_section">Analytics</h3>
        <div className="filter_actions">
          <h5>Select date to filter: </h5>
          {/* <DropDownWrappe
            closeOnChildClick
            origin={"right"}
            action={
              <Button
                variant="outlined"
                endIcon={<FillArrowIcon stroke="#009444" />}
                className="export"
              >
                Export as
              </Button>
            }
          >
            <ul className="select_list">
              <li>CSV</li>
              <li>Excel</li>
              <li>Pdf</li>
            </ul>
          </DropDownWrappe> */}
          <DateRangeDropDown
            origin={"right"}
            setCustomState={setDateRange}
            setDateRangeType={setDateRangeType}
            action={
              <Button
                variant="outlined"
                endIcon={<FillArrowIcon stroke="#5C636D" />}
                className="export filter"
              >
                {dateRange
                  ? `${moment(dateRange[0]?.startDate).format(
                      "D/MM/YYYY"
                    )} - ${moment(dateRange[0]?.endDate).format("D/MM/YYYY")}`
                  : "Select date range"}
              </Button>
            }
          />
          {tab === "transactions" || tab === "products" ? (
            ""
          ) : isSubscriptionExpired ||
            isSubscriptionType === "free" ||
            isSubscriptionType === "starter" ? (
            <Button
              variant="outlined"
              endIcon={<FillArrowIcon stroke="#5C636D" />}
              className="export filter"
              onClick={() => {
                setIsProUpgrade(true);
                setOpenUpgradeModal(true);
              }}
            >
              Compare :{" "}
              {selectedCompareDate
                ? `${moment(selectedCompareDate[0]?.startDate).format(
                    "D/MM/YYYY"
                  )} - ${moment(selectedCompareDate[0]?.endDate).format(
                    "D/MM/YYYY"
                  )}`
                : ""}
            </Button>
          ) : (
            <DateRangeDropDown
              origin={"right"}
              setCustomState={setSelectedCompareDate}
              compareDateRange={dateRange}
              dateRangeType={dateRangeType}
              resetCompare={() => {
                setSelectedCompareDate(null);
              }}
              action={
                <Button
                  variant="outlined"
                  endIcon={<FillArrowIcon stroke="#5C636D" />}
                  className="export filter"
                >
                  Compare :{" "}
                  {selectedCompareDate
                    ? `${moment(selectedCompareDate[0]?.startDate).format(
                        "D/MM/YYYY"
                      )} - ${moment(selectedCompareDate[0]?.endDate).format(
                        "D/MM/YYYY"
                      )}`
                    : ""}
                </Button>
              }
            />
          )}
        </div>
      </div>

      <div className="tab_container">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tab}
            onChange={handleChangeTab}
            variant="scrollable"
            scrollButtons={false}
          >
            {tabList.map((item, i) => (
              <Tab key={i} value={item.value} label={item.label} />
            ))}
          </Tabs>
        </Box>
      </div>

      <div className="analytics_container">
        {tab === "sales" && (
          <Sales
            dateRange={dateRange}
            selectedCompareDate={selectedCompareDate}
          />
        )}
        {tab === "transactions" && <Transactions dateRange={dateRange} />}
        {tab === "products" && <ProductAnalytics dateRange={dateRange} />}
        {tab === "customers" && (
          <CustomerAnalytics
            dateRange={dateRange}
            selectedCompareDate={selectedCompareDate}
          />
        )}
        {tab === "campaigns" && (
          <CampaignAnalytics
            dateRange={dateRange}
            selectedCompareDate={selectedCompareDate}
          />
        )}
        {/* {tab === "messages" && (
          <MessagesAnalytics
            dateRange={dateRange}
            selectedCompareDate={selectedCompareDate}
          />
        )} */}
      </div>
      {openUpgradeModal && (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => setOpenUpgradeModal(false)}
          pro={isProUpgrade}
          title={`View detailed analytics on a Bumpa plan`}
          subtitle={`Compare different datasets and get better business insights.`}
          proFeatures={[
            "Get Analytics on Campaigns & Compare Data",
            "No business summary via email",
            "Get business tips via Bumpa AI",
            "Cannot integrate Google Analytics",
          ]}
          growthFeatures={[
            "Get Analytics on Campaigns & Compare Data",
            "Get monthly business summary via email",
            "Get business tips via Bumpa AI",
            "Integrate Google Analytics",
          ]}
          eventName="analytics"
        />
      )}
    </div>
  );
};
