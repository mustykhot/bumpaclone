import { useEffect, useState } from "react";
import { dashboardBarChartOption } from "utils/analyticsOptions";
import Chart from "react-apexcharts";
import "./style.scss";
import { LineChartCard } from "components/LineChartCard";
import { useSalesAnalyticsQuery } from "services";
import moment from "moment";
import ErrorMsg from "components/ErrorMsg";
import Loader from "components/Loader";
import { formatNumber, formatPrice } from "utils";
import { ApexOptions } from "apexcharts";
import { useNavigate } from "react-router-dom";
import { BusinessInfo } from "pages/Dashboard/Home";
import { TagIcon } from "assets/Icons/TagIcon";
import { Tag03Icon } from "assets/Icons/Tag03Icon";
import { PackagePlusIcon } from "assets/Icons/PackagePlusIcon";
import { BoxIcon } from "assets/Icons/BoxIcon";
import { LineMainChartCard } from "components/LineMainChartCard";
import { Skeleton } from "@mui/material";

type CustomerAnalyticsProps = {
  dateRange: any | null;
  selectedCompareDate: any | null;
};

export const CustomerAnalytics = ({
  dateRange,
  selectedCompareDate,
}: CustomerAnalyticsProps) => {
  const [barWidth, setBarWidth] = useState<any>(undefined);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [series, setSeries] = useState<any>([]);
  // const [, setResetRender] = useState<any>();
  // const updateRender = useCallback(() => setResetRender({}), []);
  const navigate = useNavigate();
  const [barStyleOptions, setBarStyleOptions] = useState<ApexOptions>({
    ...dashboardBarChartOption,
    chart: {
      id: "Customers",
    },
  });

  // endpoints
  const {
    data: analyticsTotalCustomers,
    isLoading: analyticsTotalCustomersLoading,
    isFetching: totalCustomersFetching,
    isError: totalCustomersError,
  } = useSalesAnalyticsQuery({
    type: "customers",
    dataset: "total_customers",
    from: dateRange
      ? moment(new Date(dateRange[0]?.startDate)).format("Y-MM-DD")
      : "",
    to: dateRange
      ? moment(new Date(dateRange[0]?.endDate)).format("Y-MM-DD")
      : "",
    compare_from: selectedCompareDate
      ? moment(new Date(selectedCompareDate[0]?.startDate)).format("Y-MM-DD")
      : "",
    compare_to: selectedCompareDate
      ? moment(new Date(selectedCompareDate[0]?.endDate)).format("Y-MM-DD")
      : "",
  });

  const {
    data: analyticsCustomersWithOrders,
    isLoading: analyticsCustomersWithOrdersLoading,
    isFetching: customersWithOrdersFetching,
    isError: customersWithOrdersError,
  } = useSalesAnalyticsQuery({
    type: "customers",
    dataset: "customers_with_orders",
    from: dateRange
      ? moment(new Date(dateRange[0]?.startDate)).format("Y-MM-DD")
      : "",
    to: dateRange
      ? moment(new Date(dateRange[0]?.endDate)).format("Y-MM-DD")
      : "",
    compare_from: selectedCompareDate
      ? moment(new Date(selectedCompareDate[0]?.startDate)).format("Y-MM-DD")
      : "",
    compare_to: selectedCompareDate
      ? moment(new Date(selectedCompareDate[0]?.endDate)).format("Y-MM-DD")
      : "",
  });
  const {
    data: analyticsOverview,
    isLoading: analyticsOverviewLoading,
    isFetching: overviewFetching,
    isError: overviewError,
  } = useSalesAnalyticsQuery({
    type: "customers",
    dataset: "overview",
    from: dateRange
      ? moment(new Date(dateRange[0]?.startDate)).format("Y-MM-DD")
      : "",
    to: dateRange
      ? moment(new Date(dateRange[0]?.endDate)).format("Y-MM-DD")
      : "",
    compare_from: selectedCompareDate
      ? moment(new Date(selectedCompareDate[0]?.startDate)).format("Y-MM-DD")
      : "",
    compare_to: selectedCompareDate
      ? moment(new Date(selectedCompareDate[0]?.endDate)).format("Y-MM-DD")
      : "",
  });

  const {
    data: analyticsTopCustomerOrder,
    isLoading: analyticsTopCustomerOrderLoading,
    isFetching: topCustomerOrderFetching,
    isError: topCustomerOrderError,
  } = useSalesAnalyticsQuery({
    type: "customers",
    dataset: "top_customers_order",
    from: dateRange
      ? moment(new Date(dateRange[0]?.startDate)).format("Y-MM-DD")
      : "",
    to: dateRange
      ? moment(new Date(dateRange[0]?.endDate)).format("Y-MM-DD")
      : "",
    compare_from: selectedCompareDate
      ? moment(new Date(selectedCompareDate[0]?.startDate)).format("Y-MM-DD")
      : "",
    compare_to: selectedCompareDate
      ? moment(new Date(selectedCompareDate[0]?.endDate)).format("Y-MM-DD")
      : "",
  });

  const {
    data: analyticsTopCustomerVolume,
    isLoading: analyticsTopCustomerVolumeLoading,
    isFetching: topCustomerVolumeFetching,
    isError: topCustomerVolumeError,
  } = useSalesAnalyticsQuery({
    type: "customers",
    dataset: "top_customers_volume",
    from: dateRange
      ? moment(new Date(dateRange[0]?.startDate)).format("Y-MM-DD")
      : "",
    to: dateRange
      ? moment(new Date(dateRange[0]?.endDate)).format("Y-MM-DD")
      : "",
    compare_from: selectedCompareDate
      ? moment(new Date(selectedCompareDate[0]?.startDate)).format("Y-MM-DD")
      : "",
    compare_to: selectedCompareDate
      ? moment(new Date(selectedCompareDate[0]?.endDate)).format("Y-MM-DD")
      : "",
  });

  const setBarSeriesOption = (
    analyticsTotalCustomers: any,
    analyticsCustomersWithOrders: any
  ) => {
    if (analyticsTotalCustomers && analyticsCustomersWithOrders) {
      setSeries([
        {
          name: "Total Customers",
          data: analyticsTotalCustomers?.data?.chart?.current_period?.data?.map(
            (item: any) => Number(item.value)
          ),
        },
        {
          name: "Total Customers that placed an Order",
          data: analyticsCustomersWithOrders?.data?.chart?.current_period?.data?.map(
            (item: any) => Number(item.value)
          ),
        },
      ]);
      setBarStyleOptions({
        ...barStyleOptions,
        xaxis: {
          ...barStyleOptions.xaxis,
          categories:
            analyticsTotalCustomers?.data?.chart?.current_period?.data?.map(
              (item: any) => item.dateLabel
            ),
        },
      });
    }
  };
  useEffect(() => {
    setBarSeriesOption(analyticsTotalCustomers, analyticsCustomersWithOrders);
    // eslint-disable-next-line
  }, [analyticsCustomersWithOrders, analyticsTotalCustomers]);

  useEffect(() => {
    if (screenWidth <= 700) {
      setBarWidth(750);
    }
  }, [screenWidth]);
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (customersWithOrdersError || totalCustomersError) {
    return <ErrorMsg error="Something went wrong" />;
  }

  return (
    <>
      <div className="pd_transactions pd_customers_analytics ">
        <div className="transaction_details">
          <div className="left_section">
            <div className="chart_section">
              <div className="transaction_summary">
                <div className="detail ">
                  <p className="title">Total Customers</p>
                  <p className="amount">
                    {analyticsOverview?.data[0]?.value || 0}
                  </p>
                </div>
              </div>

              <div className="chart_container">
                {customersWithOrdersFetching ||
                analyticsCustomersWithOrdersLoading ||
                totalCustomersFetching ||
                analyticsTotalCustomersLoading ? (
                  [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <Skeleton
                      key={item}
                      animation="wave"
                      width="100%"
                      height={30}
                    />
                  ))
                ) : (
                  <Chart
                    options={barStyleOptions}
                    series={series}
                    height={300}
                    width={barWidth}
                    type="bar"
                  />
                )}
              </div>
            </div>
            <div className="line_card_flex_container">
              <LineMainChartCard
                dataset="average_spend"
                type="customers"
                dateRange={dateRange}
                fileName="Average-Spend"
                selectedCompareDate={selectedCompareDate}
              />

              <LineMainChartCard
                dataset="returning_customers"
                type="customers"
                dateRange={dateRange}
                fileName="Returning-Customer"
                selectedCompareDate={selectedCompareDate}
              />

              {/* <LineChartCard
                  title={analytics.data.overviews[3]?.title}
                  amount={analytics.data.overviews[3]?.value}
                  indicatorText={analytics.data.overviews[3]?.progress_text}
                  isIncrease={
                    analytics.data.overviews[3]?.progress >= 0 ? true : false
                  }
                  data={analytics.data.average_spend}
                  dateRange={dateRange}
                  selectedCompareDate={selectedCompareDate}
                />
                <LineChartCard
                  title={analytics.data.overviews[2]?.title}
                  amount={analytics.data.overviews[2]?.value}
                  indicatorText={analytics.data.overviews[2]?.progress_text}
                  isIncrease={
                    analytics.data.overviews[2]?.progress >= 0 ? true : false
                  }
                  data={analytics.data.returning_customers}
                  dateRange={dateRange}
                  selectedCompareDate={selectedCompareDate}
                /> */}
            </div>
            <LineMainChartCard
              dataset="new_customers"
              type="customers"
              dateRange={dateRange}
              selectedCompareDate={selectedCompareDate}
            />

            {/* <LineChartCard
                title={analytics.data.overviews[1]?.title}
                amount={analytics.data.overviews[1]?.value}
                indicatorText={analytics.data.overviews[1]?.progress_text}
                isIncrease={
                  analytics.data.overviews[1]?.progress >= 0 ? true : false
                }
                data={analytics.data.new_customers}
                dateRange={dateRange}
                selectedCompareDate={selectedCompareDate}
              /> */}
          </div>
          <div className="right_section">
            <div className="customer_summary_container">
              <div className="title_box">
                <p>Customers Overview</p>
              </div>

              {(analyticsOverviewLoading || overviewFetching) && (
                <div className="mt-[20px]">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Skeleton
                      key={item}
                      animation="wave"
                      width="100%"
                      height={30}
                    />
                  ))}
                </div>
              )}
              {overviewError && <ErrorMsg error="Something went wrong" />}

              {!analyticsOverviewLoading &&
                !overviewFetching &&
                !overviewError &&
                analyticsOverview &&
                analyticsOverview?.data && (
                  <div className="summary_flex">
                    <BusinessInfo
                      amount={analyticsOverview?.data[0]?.value || 0}
                      title={
                        analyticsOverview?.data[0]?.title || "Total Customers"
                      }
                      icon={<TagIcon stroke="#5C636D" />}
                    />{" "}
                    <BusinessInfo
                      amount={analyticsOverview?.data[1]?.value || 0}
                      title={
                        analyticsOverview?.data[1]?.title || "New Customers"
                      }
                      icon={<Tag03Icon stroke="#5C636D" />}
                    />{" "}
                    <BusinessInfo
                      amount={analyticsOverview?.data[2]?.value || 0}
                      title={
                        analyticsOverview?.data[2]?.title ||
                        "Returning Customers"
                      }
                      icon={<PackagePlusIcon stroke="#5C636D" />}
                    />{" "}
                    <BusinessInfo
                      amount={analyticsOverview?.data[3]?.value || 0}
                      title={
                        analyticsOverview?.data[3]?.title ||
                        "Avg. Spend / Customer"
                      }
                      icon={<BoxIcon stroke="#5C636D" />}
                    />{" "}
                    {/* <BusinessInfo
                    amount="0"
                    title="DIGITAL PRODUCTS"
                    icon={<MonitorIcon stroke="#5C636D" />}
                  /> */}
                  </div>
                )}
            </div>
            <div className="top_selling_product">
              <h3>TOP 5 CUSTOMERS BY NUMBER OF ORDERS PLACED</h3>
              {(analyticsTopCustomerOrderLoading ||
                topCustomerOrderFetching) && (
                <div className="mt-[20px]">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Skeleton
                      key={item}
                      animation="wave"
                      width="100%"
                      height={30}
                    />
                  ))}
                </div>
              )}

              {topCustomerOrderError && (
                <ErrorMsg error="Something went wrong" />
              )}

              {!analyticsTopCustomerOrderLoading &&
              !topCustomerOrderFetching &&
              !topCustomerOrderError &&
              analyticsTopCustomerOrder &&
              analyticsTopCustomerOrder?.data ? (
                <>
                  {analyticsTopCustomerOrder?.data?.summary?.data?.length ? (
                    analyticsTopCustomerOrder?.data?.summary?.data?.map(
                      (item: any, i: number) => (
                        <div
                          onClick={() => {
                            if (item.id) {
                              navigate(`/dashboard/customers/${item.id}`);
                            }
                          }}
                          className="top_collection"
                          key={i}
                        >
                          <p className="collection_name">{item.label}</p>
                          <p className="count">{item.value} Orders</p>
                        </div>
                      )
                    )
                  ) : (
                    <p className="empty_record">
                      There are no records for the selected date range.
                    </p>
                  )}
                </>
              ) : (
                ""
              )}
            </div>
            <div className="top_selling_product">
              <h3>TOP 5 CUSTOMERS BY VOLUME</h3>
              {(analyticsTopCustomerVolumeLoading ||
                topCustomerVolumeFetching) && (
                <div className="mt-[20px]">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Skeleton
                      key={item}
                      animation="wave"
                      width="100%"
                      height={30}
                    />
                  ))}
                </div>
              )}

              {topCustomerVolumeError && (
                <ErrorMsg error="Something went wrong" />
              )}

              {!analyticsTopCustomerVolumeLoading &&
              !topCustomerVolumeFetching &&
              !topCustomerVolumeError &&
              analyticsTopCustomerVolume &&
              analyticsTopCustomerVolume?.data ? (
                <>
                  {analyticsTopCustomerVolume?.data?.summary?.data?.length ? (
                    analyticsTopCustomerVolume?.data?.summary?.data?.map(
                      (item: any, i: number) => (
                        <div
                          onClick={() => {
                            if (item.id) {
                              navigate(`/dashboard/customers/${item.id}`);
                            }
                          }}
                          className="top_collection"
                          key={i}
                        >
                          <p className="collection_name">{item.label}</p>
                          <p className="count">{item.value}</p>
                        </div>
                      )
                    )
                  ) : (
                    <p className="empty_record">
                      There are no records for the selected date range.
                    </p>
                  )}
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
