import { LineChartCard } from "components/LineChartCard";
import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { dashboardBarChartOption, pieOptions } from "utils/analyticsOptions";
import "./style.scss";
// import { useSalesAnalyticsQuery } from "services";

// type MessagesAnalyticsProps = {
//   dateRange: any | null;
//   selectedCompareDate: any | null;
// };

export const MessagesAnalytics = () => {
  const [barWidth, setBarWidth] = useState<any>(undefined);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  // const {
  //   data: analytics,
  //   isLoading: analyticsLoading,
  //   isFetching,
  //   isError,
  // } = useSalesAnalyticsQuery({
  //   type: "messages",
  //   from: dateRange
  //     ? moment(new Date(dateRange[0]?.startDate)).format("Y-MM-DD")
  //     : "",
  //   to: dateRange
  //     ? moment(new Date(dateRange[0]?.endDate)).format("Y-MM-DD")
  //     : "",
  //   compare_from: selectedCompareDate
  //     ? moment(new Date(selectedCompareDate[0]?.startDate)).format("Y-MM-DD")
  //     : "",
  //   compare_to: selectedCompareDate
  //     ? moment(new Date(selectedCompareDate[0]?.endDate)).format("Y-MM-DD")
  //     : "",
  // });

  const series = [
    {
      name: "Total Sales",
      data: [30, 40, 45, 50, 49, 60, 70, 91, 10, 80, 78, 40],
    },
    {
      name: "Online sales",
      data: [10, 100, 15, 20, 29, 80, 60, 30, 10, 100, 15, 20],
    },
  ];

  const pieSeries = [44, 55, 41, 17, 15];

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

  return (
    <div className="pd_transactions pd_messages_analytics">
      <div className="transaction_details">
        <div className="left_section">
          <div className="chart_section">
            <div className="transaction_summary">
              <div className="detail ">
                <p className="title">Total Conversations</p>
                <p className="amount">1000</p>
              </div>
              <div className="detail border">
                <p className="title">Total Sales from DM</p>
                <p className="amount">₦14,465,300</p>
              </div>
              <div className="detail ">
                <p className="title">Number of customers </p>
                <p className="amount">2000</p>
              </div>
            </div>

            <div className="chart_container">
              <Chart
                options={dashboardBarChartOption}
                series={series}
                height={300}
                width={barWidth}
                type="bar"
              />
            </div>
          </div>

          <div className="line_card_flex_container">
            <LineChartCard
              title="Average Spend Per Customer"
              amount={"₦12,420,000"}
              indicatorText="3.5% from last week"
              isIncrease={false}
              data={[]}
            />{" "}
            <LineChartCard
              title="Average DMs per day"
              amount="30"
              indicatorText="3.5% from last week"
              isIncrease={false}
              data={[]}
            />
            <LineChartCard
              title="Average response time"
              amount="9 min"
              indicatorText="3.5% from last week"
              isIncrease={false}
              data={[]}
            />{" "}
            <LineChartCard
              title="Average conversion time"
              amount="1 hour 30 min"
              indicatorText="3.5% from last week"
              isIncrease={false}
              data={[]}
            />
          </div>
        </div>
        <div className="right_section">
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
          <div className="top_selling_product">
            <h3>TOP 5 CUSTOMERS BY CONVERSATION</h3>
            {[1, 2, 3, 4, 5].map((item) => (
              <div className="top_collection" key={item}>
                <p className="collection_name">Jewellery</p>
                <p className="count">50 product sold</p>
              </div>
            ))}
          </div>{" "}
          <div className="top_selling_product">
            <h3>TOP 5 CUSTOMERS BY AMOUNT SPENT</h3>
            {[1, 2, 3, 4, 5].map((item) => (
              <div className="top_collection" key={item}>
                <p className="collection_name">Jewellery</p>
                <p className="count">50 product sold</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
