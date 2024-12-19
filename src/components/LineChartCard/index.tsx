import { ApexOptions } from "apexcharts";
import { Indicator } from "components/Indicator";
import Chart from "react-apexcharts";

import "./style.scss";
import { useEffect, useState } from "react";
import moment from "moment";
import { formatNumber } from "utils";
type LineChartCardProps = {
  title: string;
  amount?: string;
  isIncrease?: boolean | null;
  indicatorText?: string | null;
  data: any | null;
  selectedCompareDate?: any;
  dateRange?: any;
};

export const LineChartCard = ({
  title,
  amount,
  indicatorText,
  isIncrease,
  data = null,
  selectedCompareDate,
}: LineChartCardProps) => {
  const [LineOptions, setLineOptions] = useState<ApexOptions>({
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
    if (data) {
      if (selectedCompareDate) {
        let oldAxis: string[] = data.current_period.data.map(
          (item: any) => item.dateLabel
        );
        let newAxis: string[] = data.previous_period.data.map(
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
            categories: combined,
          },
        });
      } else {
        setLineOptions({
          ...LineOptions,
          xaxis: {
            ...LineOptions.xaxis,
            categories: data.current_period.data.map(
              (item: any) => item.dateLabel
            ),
          },
        });
      }
    }
    // eslint-disable-next-line
  }, [data, selectedCompareDate]);

  useEffect(() => {
    if (data) {
      if (selectedCompareDate) {
        setSeries([
          {
            name: `${moment(data.current_period.range[0]).format(
              "ll"
            )} - ${moment(data.current_period.range[1]).format("ll")}`,
            data: data.current_period.data.map((item: any) =>
              Number(item.value)
            ),
          },
          {
            name: `${moment(data.previous_period.range[0]).format(
              "ll"
            )} - ${moment(data.previous_period.range[1]).format("ll")}`,
            data: data.previous_period.data.map((item: any) =>
              Number(item.value)
            ),
          },
        ]);
      } else {
        setSeries([
          {
            name: `${moment(data.current_period.range[0]).format(
              "ll"
            )} - ${moment(data.current_period.range[1]).format("ll")}`,
            data: data.current_period.data.map((item: any) =>
              Number(item.value)
            ),
          },
        ]);
      }
    }
  }, [data, selectedCompareDate]);

  useEffect(() => {
    if (screenWidth <= 600) {
      setBarWidth(750);
    } else {
      setBarWidth(undefined);
    }
  }, [series, screenWidth]);

  // else if (series.length && series[0]?.data && series[0]?.data.length > 8) {
  //   setBarWidth(750);
  // else if (
  //   series.length &&
  //   series[0]?.data &&
  //   screenWidth > 1300
  //   // series[0]?.data.length > 14 &&
  // ) {
  //   setBarWidth(750);
  // }
  // }
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
      <div className="top_section">
        <div className="left_text_box">
          <p className="title">{title}</p>
          {amount && <p className="amount">{amount}</p>}
          {data && indicatorText && isIncrease && (
            <Indicator indicatorText={indicatorText} isIncrease={isIncrease} />
          )}
        </div>
        <div className="right_text_box">
          {data && (
            <>
              <div className="date">
                <span></span>
                <p>{`${moment(data.current_period.range[0]).format(
                  "ll"
                )} - ${moment(data.current_period.range[1]).format("ll")}`}</p>
              </div>
              {selectedCompareDate && (
                <div className="date compare">
                  <span></span>
                  <p>{`${moment(data.previous_period.range[0]).format(
                    "ll"
                  )} - ${moment(data.previous_period.range[1]).format(
                    "ll"
                  )}`}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {data ? (
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
        <p className="empty_record">There is no record during this period.</p>
      )}
    </div>
  );
};
