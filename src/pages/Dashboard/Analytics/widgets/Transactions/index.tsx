import { CoinsHandIcon } from "assets/Icons/CoinsHandIcon";
import { CoinStackedIcon } from "assets/Icons/CoinStackedIcon";
import { CoinSwapIcon } from "assets/Icons/CoinSwapIcon";
import { Indicator } from "components/Indicator";
import { BusinessInfo } from "pages/Dashboard/Home";
import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { dashboardBarChartOption } from "utils/analyticsOptions";
import { Button } from "@mui/material";

import "./style.scss";
import { TransactionHistoryTable } from "./TransactionHistoryTable";
import { SettlementTable } from "./SettlementTable";
import { useSalesAnalyticsQuery, useTransactionSummaryQuery } from "services";
import moment from "moment";
import ErrorMsg from "components/ErrorMsg";
import Loader from "components/Loader";
import { ApexOptions } from "apexcharts";
import { useAppSelector } from "store/store.hooks";
import { selectSettlementData } from "store/slice/OrderSlice";
import { selectUserLocation } from "store/slice/AuthSlice";
import { formatPrice } from "utils";
type TransactionsProps = {
  dateRange: any | null;
};
const tableTab = [
  {
    name: "Transaction History",
    value: "transaction_history",
  },
  {
    name: "Settlement History",
    value: "settlement_history",
  },
];
export const Transactions = ({ dateRange }: TransactionsProps) => {
  const [barWidth, setBarWidth] = useState<any>(undefined);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [series, setSeries] = useState<any>([]);
  const [barStyleOptions, setBarStyleOptions] = useState<ApexOptions>({
    ...dashboardBarChartOption,
    chart: {
      id: "Sales",
    },
  });
  const userLocation = useAppSelector(selectUserLocation);
  const settlementData = useAppSelector(selectSettlementData);
  // const [, setResetRender] = useState<any>();
  const [tab, setTab] = useState("transaction_history");
  const { data: transactionSummary } = useTransactionSummaryQuery();
  const {
    data: analytics,
    isLoading: analyticsLoading,
    isFetching,
    isError,
  } = useSalesAnalyticsQuery({
    type: "transactions",
    from: dateRange
      ? moment(new Date(dateRange[0]?.startDate)).format("Y-MM-DD")
      : "",
    to: dateRange
      ? moment(new Date(dateRange[0]?.endDate)).format("Y-MM-DD")
      : "",
    location_id: userLocation?.id,
  });

  // const updateRender = useCallback(() => setResetRender({}), []);
  const setBarSeriesOption = (analytics: any) => {
    if (analytics) {
      setSeries([
        {
          name: "Online Sales",
          data: analytics.data.online_transactions.current_period.data.map(
            (item: any) => Number(item.value)
          ),
        },
        {
          name: "Offline Sales",
          data: analytics.data.offline_transactions.current_period.data.map(
            (item: any) => Number(item.value)
          ),
        },
      ]);
      setBarStyleOptions({
        ...barStyleOptions,

        xaxis: {
          ...barStyleOptions.xaxis,
          categories:
            analytics.data.offline_transactions.current_period.data.map(
              (item: any) => item.dateLabel
            ),
        },
      });
    }
  };
  useEffect(() => {
    setBarSeriesOption(analytics);
    // eslint-disable-next-line
  }, [analytics]);

  useEffect(() => {
    if (screenWidth <= 700) {
      setBarWidth(750);
    }
  }, [screenWidth]);

  useEffect(() => {
    if (settlementData) {
      setTab("settlement_history");
    }
  }, [settlementData]);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (analyticsLoading) {
    return <Loader />;
  }
  if (isError) {
    return <ErrorMsg error="Something went wrong" />;
  }

  return (
    <>
      {isFetching && <Loader />}

      {analytics && (
        <div className="pd_transactions">
          <div className="transaction_details">
            <div className="left_section full-left">
              <div className="chart_section">
                <div className="transaction_summary ">
                  <div className="detail border-right">
                    <p className="title">
                      {analytics.data.overviews[0]?.title}
                    </p>
                    <p className="amount">
                      {analytics.data.overviews[0]?.value}
                    </p>
                    <Indicator
                      indicatorText={analytics.data.overviews[0]?.progress_text}
                      isIncrease={
                        analytics.data.overviews[0]?.progress >= 0
                          ? true
                          : false
                      }
                    />
                  </div>
                  <div className="detail ">
                    <p className="title">Pending Settlement</p>
                    <p className="amount">
                      {formatPrice(
                        transactionSummary
                          ? Number(transactionSummary?.pending)
                          : 0
                      )}
                    </p>
                  </div>
                  {/* <div className="detail ">
                    <p className="title">Available Balance</p>
                    <p className="amount primary">N12,019</p>
                  </div> */}
                </div>

                <div className="chart_container">
                  <Chart
                    options={barStyleOptions}
                    series={series}
                    height={300}
                    width={barWidth}
                    type="bar"
                  />
                </div>
                <div className="business_info_section">
                  <div className="business_info_container">
                    <BusinessInfo
                      amount={analytics.data.overviews[1]?.value}
                      title="AMOUNT SETTLED"
                      icon={<CoinStackedIcon />}
                    />
                    <BusinessInfo
                      amount={analytics.data.overviews[5].value}
                      title="REFUNDED"
                      icon={<CoinSwapIcon />}
                    />{" "}
                    <BusinessInfo
                      amount={analytics.data.overviews[3]?.value}
                      title="TOTAL ONLINE"
                      icon={<CoinsHandIcon />}
                    />
                    <BusinessInfo
                      amount={analytics.data.overviews[3]?.value}
                      title="TOTAL OFFLINE"
                      icon={<CoinsHandIcon />}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="right_section">
              <div className="pd_line_chart_card">
                <div className="top_section">
                  <div className="left_text_box">
                    <p className="title large">Sales Channel</p>
                  </div>
                </div>
                <Chart
                  options={pieOptions}
                  series={pieSeries}
                  type="donut"
                  height={180}
                />
              </div>
            </div> */}
          </div>
          <div className="table_section tabbed">
            <div className="table_tab_container">
              {tableTab.map((item, i) => {
                return (
                  <Button
                    key={i}
                    onClick={() => {
                      setTab(item.value);
                    }}
                    className={`${tab === item.value ? "active" : ""}`}
                  >
                    {item.name}
                  </Button>
                );
              })}
            </div>
            {tab === "transaction_history" && <TransactionHistoryTable />}
            {tab === "settlement_history" && <SettlementTable />}
          </div>
        </div>
      )}
    </>
  );
};
