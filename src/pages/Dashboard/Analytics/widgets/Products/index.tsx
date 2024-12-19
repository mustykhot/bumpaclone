import { useEffect, useState } from "react";
import { dashboardBarChartOption } from "utils/analyticsOptions";
import Chart from "react-apexcharts";
import "./style.scss";
import { BusinessInfo } from "pages/Dashboard/Home";
import { TagIcon } from "assets/Icons/TagIcon";
import { Tag03Icon } from "assets/Icons/Tag03Icon";
import { BoxIcon } from "assets/Icons/BoxIcon";
import { PackagePlusIcon } from "assets/Icons/PackagePlusIcon";
import { SlashCircleIcon } from "assets/Icons/SlashCircleIcon";
import { ApexOptions } from "apexcharts";
import { useSalesAnalyticsQuery } from "services";
import moment from "moment";
import Loader from "components/Loader";
import ErrorMsg from "components/ErrorMsg";
import { formatNumber, formatPrice } from "utils";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import { selectUserLocation } from "store/slice/AuthSlice";
import { useAppSelector } from "store/store.hooks";

type ProductAnalyticsProps = {
  dateRange: any | null;
};

export const ProductAnalytics = ({ dateRange }: ProductAnalyticsProps) => {
  const [barWidth, setBarWidth] = useState<any>(undefined);
  const userLocation = useAppSelector(selectUserLocation);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [series, setSeries] = useState<any>([]);
  const [barStyleOptions, setBarStyleOptions] = useState<ApexOptions>({
    ...dashboardBarChartOption,
    chart: {
      id: "Product",
    },
  });
  const navigate = useNavigate();

  // endpoints

  const { data: analytics, isLoading: analyticsLoading } =
    useSalesAnalyticsQuery({
      type: "products",

      from: dateRange
        ? moment(new Date(dateRange[0]?.startDate)).format("Y-MM-DD")
        : "",
      to: dateRange
        ? moment(new Date(dateRange[0]?.endDate)).format("Y-MM-DD")
        : "",
      location_id: userLocation?.id,
    });

  const {
    data: analyticsSummary,
    isLoading: analyticsSummaryLoading,
    isFetching: summaryFetching,
    isError: summaryError,
  } = useSalesAnalyticsQuery({
    type: "products",
    dataset: "summary",
    from: dateRange
      ? moment(new Date(dateRange[0]?.startDate)).format("Y-MM-DD")
      : "",
    to: dateRange
      ? moment(new Date(dateRange[0]?.endDate)).format("Y-MM-DD")
      : "",
    location_id: userLocation?.id,
  });

  const {
    data: analyticsOverview,
    isLoading: analyticsOverviewLoading,
    isFetching: overviewFetching,
    isError: overviewError,
  } = useSalesAnalyticsQuery({
    type: "products",
    dataset: "overview",
    from: dateRange
      ? moment(new Date(dateRange[0]?.startDate)).format("Y-MM-DD")
      : "",
    to: dateRange
      ? moment(new Date(dateRange[0]?.endDate)).format("Y-MM-DD")
      : "",
    location_id: userLocation?.id,
  });

  const {
    data: analyticsTopSelling,
    isLoading: analyticsTopSellingLoading,
    isFetching: topSellingFetching,
    isError: topSellingError,
  } = useSalesAnalyticsQuery({
    type: "products",
    dataset: "top_selling_products",
    from: dateRange
      ? moment(new Date(dateRange[0]?.startDate)).format("Y-MM-DD")
      : "",
    to: dateRange
      ? moment(new Date(dateRange[0]?.endDate)).format("Y-MM-DD")
      : "",
    location_id: userLocation?.id,
  });

  const {
    data: analyticsTopCollections,
    isLoading: analyticsTopCollectionsLoading,
    isFetching: topCollectionsFetching,
    isError: topCollectionsError,
  } = useSalesAnalyticsQuery({
    type: "products",
    dataset: "top_collections",
    from: dateRange
      ? moment(new Date(dateRange[0]?.startDate)).format("Y-MM-DD")
      : "",
    to: dateRange
      ? moment(new Date(dateRange[0]?.endDate)).format("Y-MM-DD")
      : "",
    location_id: userLocation?.id,
  });

  const {
    data: analyticsLeastSelling,
    isLoading: analyticsLeastSellingLoading,
    isFetching: leastSellingFetching,
    isError: leastSellingError,
  } = useSalesAnalyticsQuery({
    type: "products",
    dataset: "least_selling_products",
    from: dateRange
      ? moment(new Date(dateRange[0]?.startDate)).format("Y-MM-DD")
      : "",
    to: dateRange
      ? moment(new Date(dateRange[0]?.endDate)).format("Y-MM-DD")
      : "",
    location_id: userLocation?.id,
  });

  useEffect(() => {
    if (analyticsOverview) {
      setSeries([
        {
          name: "Total Products",
          data: analyticsOverview?.data?.total_products_chart?.data?.map(
            (item: any) => Number(item.value)
          ),
        },
        {
          name: "Products Sold",
          data: analyticsOverview?.data?.total_products_sold_chart?.data?.map(
            (item: any) => Number(item.value)
          ),
        },
      ]);

      setBarStyleOptions({
        ...barStyleOptions,
        xaxis: {
          ...barStyleOptions.xaxis,
          categories: analyticsOverview?.data?.total_products_chart?.data.map(
            (item: any) => item.dateLabel
          ),
        },
      });
    }

    // eslint-disable-next-line
  }, [analyticsOverview]);

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

  if (overviewError) {
    return <ErrorMsg error="Something went wrong" />;
  }
  return (
    <>
      <div className="pd_transactions pd_product_analytics ">
        <div className="transaction_details">
          <div className="left_section">
            <div className="chart_section">
              <div className="transaction_summary">
                <div className="detail ">
                  <p className="title">Total Products</p>
                  <p className="amount">
                    {formatNumber(
                      Number(
                        analyticsOverview?.data?.total_products?.value || 0
                      )
                    )}
                  </p>
                </div>
                <div className="detail border">
                  <p className="title">Total Stock Quantity</p>
                  <p className="amount">
                    {formatNumber(
                      Number(analyticsOverview?.data?.total_stock?.value || 0)
                    )}
                  </p>
                </div>
                <div className="detail ">
                  <p className="title">Inventory Value</p>
                  <p className="amount">
                    {formatPrice(
                      Number(
                        analyticsOverview?.data?.inventory_value?.value || 0
                      )
                    )}
                  </p>
                </div>
              </div>
              <div className="chart_container">
                {analyticsOverviewLoading || overviewFetching ? (
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
            <div className="top_selling">
              <div className="top_selling_product">
                <div className="topic_side">
                  <h3>Top Selling Products</h3>
                </div>

                {(analyticsTopSellingLoading || topSellingFetching) && (
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
                {topSellingError && <ErrorMsg error="Something went wrong" />}

                {!analyticsTopSellingLoading &&
                !topSellingFetching &&
                !topSellingError &&
                analyticsTopSelling &&
                analyticsTopSelling?.data ? (
                  <>
                    {analyticsTopSelling?.data[0]?.data?.length ? (
                      analyticsTopSelling?.data[0]?.data?.map(
                        (item: any, i: number) => (
                          <div
                            onClick={() => {
                              if (item.id) {
                                navigate(
                                  `/dashboard/products/${
                                    item.id
                                  }?isAnalytics=${true}`
                                );
                              }
                            }}
                            className="top_collection"
                            key={i}
                          >
                            <p className="collection_name">{item.label}</p>
                            <p className="count">{item.value} sold</p>
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
                <h3>Least Seling Products</h3>
                {/* {analytics.data.summaries[1]?.data &&
                    analytics.data.summaries[1]?.data.map(
                      (item: any, i: number) => {
                        return (
                          <div
                            onClick={() => {
                              if (item.id) {
                                navigate(`/dashboard/products/${item.id}`);
                              }
                            }}
                            className="top_collection"
                            key={i}
                          >
                            <p className="collection_name">{item.label}</p>
                            <p className="count">{item.value} sold</p>
                          </div>
                        );
                      }
                    )} */}

                {(analyticsLeastSellingLoading || leastSellingFetching) && (
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
                {leastSellingError && <ErrorMsg error="Something went wrong" />}

                {!analyticsLeastSellingLoading &&
                !leastSellingFetching &&
                !leastSellingError &&
                analyticsLeastSelling &&
                analyticsLeastSelling?.data ? (
                  <>
                    {analyticsLeastSelling?.data[0]?.data?.length ? (
                      analyticsLeastSelling?.data[0]?.data?.map(
                        (item: any, i: number) => (
                          <div
                            onClick={() => {
                              if (item.id) {
                                navigate(
                                  `/dashboard/products/${
                                    item.id
                                  }?isAnalytics=${true}`
                                );
                              }
                            }}
                            className="top_collection"
                            key={i}
                          >
                            <p className="collection_name">{item.label}</p>
                            <p className="count">{item.value} sold</p>
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
          <div className="right_section">
            <div className="product_summary_container">
              <div className="title_box">
                <p>Products Summary</p>
              </div>

              {(analyticsSummaryLoading || summaryFetching) && (
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
              {summaryError && <ErrorMsg error="Something went wrong" />}

              {!analyticsSummaryLoading &&
              !summaryFetching &&
              !summaryError &&
              analyticsSummary &&
              analyticsSummary?.data ? (
                <div className="summary_flex">
                  <BusinessInfo
                    amount={analyticsSummary?.data?.summary[0]?.value || 0}
                    title={
                      analyticsSummary?.data?.summary[0]?.title ||
                      "TOTAL PRODUCTS"
                    }
                    icon={<TagIcon stroke="#5C636D" />}
                  />{" "}
                  <BusinessInfo
                    amount={analyticsSummary?.data?.summary[1]?.value || 0}
                    title={
                      analyticsSummary?.data?.summary[1]?.title ||
                      "PRODUCT COLLECTIONS"
                    }
                    icon={<Tag03Icon stroke="#5C636D" />}
                  />{" "}
                  <BusinessInfo
                    amount={analyticsSummary?.data?.summary[2]?.value || 0}
                    title={
                      analyticsSummary?.data?.summary[2]?.title ||
                      "OUT OF STOCK"
                    }
                    icon={<SlashCircleIcon stroke="#5C636D" />}
                  />
                  <BusinessInfo
                    amount={analyticsSummary?.data?.summary[3]?.value || 0}
                    title={
                      analyticsSummary?.data?.summary[3]?.title ||
                      "PRODUCT VARIATIONS"
                    }
                    icon={<BoxIcon stroke="#5C636D" />}
                  />{" "}
                  {/* <BusinessInfo
                    amount="0"
                    title="DIGITAL PRODUCTS"
                    icon={<MonitorIcon stroke="#5C636D" />}
                  /> */}
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="top_selling_product">
              <h3>TOP 5 PRODUCT COLLECTIONS</h3>
              {(analyticsTopCollectionsLoading || topCollectionsFetching) && (
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
              {topCollectionsError && <ErrorMsg error="Something went wrong" />}
              {!analyticsTopCollectionsLoading &&
              !topCollectionsFetching &&
              !topCollectionsError &&
              analyticsTopCollections &&
              analyticsTopCollections?.data ? (
                <>
                  {analyticsTopCollections?.data[0]?.data?.length ? (
                    analyticsTopCollections?.data[0]?.data?.map(
                      (item: any, i: number) => (
                        <div
                          onClick={() => {
                            if (item.id) {
                              navigate(
                                `/dashboard/products/collection/${
                                  item.id
                                }?isAnalytics=${true}`
                              );
                            }
                          }}
                          className="top_collection"
                          key={i}
                        >
                          <p className="collection_name">{item.label}</p>
                          <p className="count">{item.value} sold</p>
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
