import { ApexOptions } from "apexcharts";
import { formatNumber, formatPrice } from "utils";

export const homePieOptions: ApexOptions = {
  chart: {
    type: "donut",
  },
  responsive: [
    {
      breakpoint: 360,
      options: {
        chart: {
          width: 280,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            show: true,
            offsetY: 10,
          },
          value: {
            show: false,
          },
          total: {
            show: false,
            // formatter: function (value) {
            //   return `${formatPrice(Number(Number(value).toFixed(2)))}`;
            // },

            formatter: function (w) {
              return formatPrice(
                w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0)
              );
            },
          },
        },
      },
    },
  },
  dataLabels: {
    enabled: true,

    formatter: function (value) {
      return `${Number(value).toFixed(0)}%`;
    },
  },
  legend: {
    show: true,
  },

  tooltip: {
    y: {
      formatter: function (value) {
        return formatPrice(Number(value.toFixed(2)));
      },
    },
  },

  colors: ["#9747FF", "#17DB71", "#D90429", "#0059DE", "#FFB60A"],
  labels: [],
};

export const pieOptions: ApexOptions = {
  chart: {
    type: "donut",
  },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            show: true,
            offsetY: 10,
          },
          value: {
            show: false,
          },

          total: {
            show: false,

            // formatter: function (value) {
            //   return `${formatPrice(Number(Number(value).toFixed(2)))}`;
            // },
            formatter: function (w) {
              return formatPrice(
                w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0)
              );
            },
          },
        },
      },
    },
  },
  responsive: [
    {
      breakpoint: 540,
      options: {
        chart: {
          width: 320,
        },
        legend: {
          position: "bottom",
        },
      },
    },
    {
      breakpoint: 330,
      options: {
        chart: {
          width: 280,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],

  dataLabels: {
    enabled: true,
    formatter: function (value) {
      return `${Number(value).toFixed(0)}%`;
    },
  },
  legend: {
    show: true,
  },
  tooltip: {
    y: {
      formatter: function (value) {
        return formatPrice(Number(value.toFixed(2)));
      },
    },
  },

  colors: [
    "#9747FF",
    "#17DB71",
    "#D90429",
    "#0059DE",
    "#FFB60A",
    "#009444",
    "#9747FF",
    "#FF66A9",
    "#9D5000",
    "#004A4F",
    "#8A8A8A",
    "#00E4E4",
    "#048AB4",
  ],

  labels: [],
};

export const dashboardBarChartOption: ApexOptions = {
  chart: {
    id: "basic-bar",
  },
  yaxis: {
    labels: {
      formatter: function (value) {
        return formatNumber(Number(value));
      },
      style: {
        fontSize: "14px",
        fontWeight: 500,
        colors: "#9BA2AC",
      },
    },
  },

  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    labels: {
      style: {
        fontSize: "14px",
        fontWeight: 500,
        colors: "#9BA2AC",
      },
    },
  },
  stroke: {
    colors: ["transparent"],
    width: 1,
  },
  colors: ["#007A38", "#17DB71"],
  dataLabels: {
    enabled: false,
  },
  grid: {
    borderColor: "#D4D7DB",
    strokeDashArray: 5,
  },
  plotOptions: {
    bar: {
      columnWidth: "20px",
      borderRadius: 4,
      borderRadiusApplication: "end",
    },
  },
};
