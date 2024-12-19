import { ApexOptions } from "apexcharts";
import { Indicator } from "components/Indicator";
import Chart from "react-apexcharts";

import "./style.scss";
import { useEffect, useState } from "react";
import moment from "moment";
import { formatNumber } from "utils";
import { useSalesAnalyticsQuery } from "services";
import ErrorMsg from "components/ErrorMsg";
import { Skeleton } from "@mui/material";
type LineMainChartCardProps = {
  selectedCompareDate?: any;
  dateRange?: any;
  dataset?: string;
  type?: string;
  location_id?: string | null | number;
  fileName?: string;
};

export const LineMainChartCard = ({
  selectedCompareDate,
  dateRange,
  type = "",
  dataset = "",
  location_id,
  fileName,
}: LineMainChartCardProps) => {
  const {
    data: analytics,
    isLoading,
    isFetching,
    isError,
  } = useSalesAnalyticsQuery({
    type,
    dataset,
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
    location_id: location_id,
  });
  const [LineOptions, setLineOptions] = useState<ApexOptions>({
    chart: {
      id: fileName,
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return formatNumber(Number(value));
        },
        style: {
          fontSize: "12px",
          fontWeight: 400,
          colors: "#9BA2AC",
        },
      },
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 400,
          colors: "#9BA2AC",
        },
      },
    },
    stroke: {
      curve: "straight",
      width: 3,
    },
    colors: ["#007A38", "#0059DE"],
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: "#D4D7DB",
      strokeDashArray: 5,
    },
    legend: {
      show: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
  });
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [barWidth, setBarWidth] = useState<any>(undefined);

  const [series, setSeries] = useState<any>([]);

  useEffect(() => {
    if (analytics && analytics?.data) {
      let chart = analytics.data.chart;
      if (selectedCompareDate) {
        let oldAxis: string[] = chart?.current_period?.data?.map(
          (item: any) => item.dateLabel
        );
        let newAxis: string[] = chart?.previous_period?.data?.map(
          (item: any) => item.dateLabel
        );
        const combined: string[] = [];

        oldAxis.forEach((item: any, index: number) => {
          combined.push(`${item} - ${newAxis[index]}`);
        });
        setLineOptions({
          ...LineOptions,
          xaxis: {
            ...LineOptions.xaxis,
            // @ts-ignore
            convertedCatToNumeric: true,
            categories: combined,
          },
        });
      } else {
        // @ts-ignore
        setLineOptions({
          ...LineOptions,
          xaxis: {
            ...LineOptions.xaxis,
            // @ts-ignore
            convertedCatToNumeric: true,
            categories: chart?.current_period?.data?.map(
              (item: any) => item.dateLabel
            ),
          },
        });
      }
    }
    // eslint-disable-next-line
  }, [analytics, analytics?.data, selectedCompareDate]);

  useEffect(() => {
    if (analytics && analytics.data) {
      let chart = analytics.data.chart;
      if (selectedCompareDate) {
        setSeries([
          {
            name: `${moment(chart.current_period.range[0]).format(
              "ll"
            )} - ${moment(chart.current_period.range[1]).format("ll")}`,
            data: chart.current_period.data.map((item: any) =>
              Number(item?.value || 0)
            ),
          },
          {
            name: `${moment(chart.previous_period.range[0]).format(
              "ll"
            )} - ${moment(chart.previous_period.range[1]).format("ll")}`,
            data: chart.previous_period.data.map((item: any) =>
              Number(item?.value || 0)
            ),
          },
        ]);
      } else {
        setSeries([
          {
            name: `${moment(chart.current_period.range[0]).format(
              "ll"
            )} - ${moment(chart.current_period.range[1]).format("ll")}`,
            data: chart.current_period.data.map((item: any) =>
              Number(item?.value || 0)
            ),
          },
        ]);
      }
    }
  }, [analytics, analytics?.data, selectedCompareDate]);

  useEffect(() => {
    if (screenWidth <= 600) {
      setBarWidth(750);
    } else {
      setBarWidth(undefined);
    }
  }, [series, screenWidth]);

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
    <div className="pd_line_chart_card">
      {(isLoading || isFetching) && (
        <div className="skeleton_box">
          {" "}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <Skeleton key={item} animation="wave" width="100%" height={30} />
          ))}
        </div>
      )}
      {isError && <ErrorMsg error={"Something went wrong"} />}
      {!isLoading && !isFetching && !isError ? (
        <>
          <div className="top_section">
            <div className="left_text_box">
              <p className="title">
                {analytics && analytics?.data?.summary?.title}
              </p>
              {analytics && (
                <p className="amount">{analytics?.data?.summary?.value}</p>
              )}
              {analytics &&
              analytics?.data?.summary?.progress &&
              analytics?.data?.summary?.progress_text ? (
                <Indicator
                  indicatorText={analytics?.data?.summary?.progress_text}
                  isIncrease={
                    analytics?.data?.summary?.progress >= 0 ? true : false
                  }
                />
              ) : (
                ""
              )}
            </div>
            <div className="right_text_box">
              {analytics && analytics?.data?.chart && (
                <>
                  <div className="date">
                    <span></span>
                    <p>{`${moment(
                      analytics?.data?.chart?.current_period.range[0]
                    ).format("ll")} - ${moment(
                      analytics?.data?.chart?.current_period.range[1]
                    ).format("ll")}`}</p>
                  </div>
                  {selectedCompareDate && (
                    <div className="date compare">
                      <span></span>
                      <p>{`${moment(
                        analytics?.data?.chart?.previous_period.range[0]
                      ).format("ll")} - ${moment(
                        analytics?.data?.chart?.previous_period.range[1]
                      ).format("ll")}`}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          {analytics && analytics?.data?.chart ? (
            <div className="chart_box">
              <Chart
                options={LineOptions}
                series={series}
                height={220}
                type="area"
                // width={700}
                width={barWidth}
              />
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
  );
};
