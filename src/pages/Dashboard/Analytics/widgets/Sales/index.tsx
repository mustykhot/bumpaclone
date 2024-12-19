import { LineChartCard } from "components/LineChartCard";
import { homePieOptions, pieOptions } from "utils/analyticsOptions";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import "./style.scss";
import { useSalesAnalyticsQuery } from "services";
import moment from "moment";
import Loader from "components/Loader";
import ErrorMsg from "components/ErrorMsg";
import { LineMainChartCard } from "components/LineMainChartCard";
import { Skeleton } from "@mui/material";
import { selectUserLocation } from "store/slice/AuthSlice";
import { useAppSelector } from "store/store.hooks";
type SalesProps = {
  dateRange: any | null;
  selectedCompareDate: any | null;
};

export const Sales = ({ dateRange, selectedCompareDate }: SalesProps) => {
  const [pieOptionsStyle, setPieOptionStyle] = useState<ApexOptions>({
    ...pieOptions,
    chart: {
      type: "donut",
      id: "Sales-by-channel",
    },
  });
  const [pieSeries, setPieSeries] = useState<any[]>([]);
  const userLocation = useAppSelector(selectUserLocation);

  const {
    data: analytics,
    isLoading,
    isFetching,
    isError,
  } = useSalesAnalyticsQuery({
    type: "sales",
    dataset: "sales_channels",
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
    location_id: userLocation?.id,
  });

  useEffect(() => {
    if (
      analytics &&
      analytics.data &&
      analytics.data.chart &&
      analytics.data.chart.data?.length
    ) {
      setPieOptionStyle({
        ...pieOptionsStyle,
        labels: analytics.data.chart.data.map(
          (item: any) => item.channel_label
        ),
      });
      let series = analytics.data.chart.data.map((item: any) =>
        Number(Number(item.value).toFixed(2))
      );
      setPieSeries(series);
    } else {
      setPieSeries([]);
    }
    // eslint-disable-next-line
  }, [analytics]);

  // if (analyticsLoading) {
  //   return <Loader />;
  // }

  return (
    <>
      {/* {isFetching && <Loader />} */}
      <div className="pd_sales">
        <div className="row">
          <LineMainChartCard
            dataset="total_sales"
            type="sales"
            fileName="Total-Sales"
            dateRange={dateRange}
            selectedCompareDate={selectedCompareDate}
            location_id={userLocation?.id}
          />
          {/* <LineChartCard
              title={analytics.data.overviews[0]?.title}
              amount={analytics.data.overviews[0]?.value}
              indicatorText={analytics.data.overviews[0]?.progress_text}
              isIncrease={
                analytics.data.overviews[0]?.progress >= 0 ? true : false
              }
              dateRange={dateRange}
              selectedCompareDate={selectedCompareDate}
              data={analytics.data.total_sales}
            /> */}
          <LineMainChartCard
            dataset="shipping_spend"
            type="sales"
            fileName="Shipping-Spend"
            dateRange={dateRange}
            selectedCompareDate={selectedCompareDate}
            location_id={userLocation?.id}
          />
          <LineMainChartCard
            dataset="net_profit"
            type="sales"
            fileName="Net-Profit"
            dateRange={dateRange}
            selectedCompareDate={selectedCompareDate}
            location_id={userLocation?.id}
          />

          <LineMainChartCard
            dataset="expenses"
            type="sales"
            fileName="Expenses"
            dateRange={dateRange}
            selectedCompareDate={selectedCompareDate}
            location_id={userLocation?.id}
          />

          <LineMainChartCard
            dataset="gross_profit"
            fileName="Gross-Profit"
            type="sales"
            dateRange={dateRange}
            selectedCompareDate={selectedCompareDate}
            location_id={userLocation?.id}
          />

          <LineMainChartCard
            dataset="offline_sales"
            fileName="Offline-Sales"
            type="sales"
            dateRange={dateRange}
            selectedCompareDate={selectedCompareDate}
            location_id={userLocation?.id}
          />

          <LineMainChartCard
            dataset="discounts_given"
            fileName="Discount-Given"
            type="sales"
            dateRange={dateRange}
            location_id={userLocation?.id}
            selectedCompareDate={selectedCompareDate}
          />

          <LineMainChartCard
            dataset="online_sales"
            fileName="Online-Sales"
            type="sales"
            dateRange={dateRange}
            selectedCompareDate={selectedCompareDate}
            location_id={userLocation?.id}
          />

          <div className="pd_line_chart_card donut">
            {(isLoading || isFetching) && (
              <div className="skeleton_box">
                {" "}
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <Skeleton
                    key={item}
                    animation="wave"
                    width="100%"
                    height={30}
                  />
                ))}{" "}
              </div>
            )}
            {isError && <ErrorMsg error={"Something went wrong"} />}
            {!isLoading && !isFetching && !isError ? (
              <>
                <div className="top_section">
                  <div className="left_text_box">
                    <p className="title large">Sales By Channel</p>
                  </div>
                  <div className="right_text_box">
                    <div className="date">
                      <span></span>
                      <p>{`${moment(new Date(dateRange[0]?.startDate)).format(
                        "ll"
                      )} - ${moment(new Date(dateRange[0]?.endDate)).format(
                        "ll"
                      )}`}</p>
                    </div>
                  </div>
                </div>
                {pieSeries && pieSeries?.length ? (
                  <div className="donut_section">
                    <div className="cover_donut_with_label">
                      <Chart
                        options={pieOptionsStyle}
                        series={pieSeries}
                        type="donut"
                        height={380}
                        width={500}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="empty_record">
                    There is no record during this period.
                  </p>
                )}
              </>
            ) : (
              ""
            )}
          </div>
          {/* <div className="pd_line_chart_card">
              <div className="top_section">
                <div className="left_text_box">
                  <p className="title large">Sales By Location</p>
                </div>
                <div className="right_text_box">
                  <div className="date">
                    <span></span>
                    <p>20/30/2023 - 10/40/2023</p>
                  </div>
                </div>
              </div>
              <Chart
                options={pieOptions}
                series={pieSeries}
                type="donut"
                height={180}
              />
            </div> */}
          <LineMainChartCard
            dataset="website_visits"
            type="sales"
            dateRange={dateRange}
            selectedCompareDate={selectedCompareDate}
            fileName="Website-Visits"
          />
          {/* <LineChartCard
              title={analytics.data.overviews[5].title}
              amount={analytics.data.overviews[5].value}
              indicatorText={analytics.data.overviews[5].progress_text}
              isIncrease={
                analytics.data.overviews[5].progress >= 0 ? true : false
              }
              data={analytics.data.website_visits}
              dateRange={dateRange}
              selectedCompareDate={selectedCompareDate}
            /> */}
          {/* <LineChartCard
              title="TOTAL REFUNDS"
              amount="₦12,420,000"
              indicatorText="3.5% from last week"
              isIncrease={false}
              data={[]}
            /> */}
        </div>
      </div>
    </>
  );
};
