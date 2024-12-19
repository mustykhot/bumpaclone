import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import parse from "html-react-parser";
import moment from "moment";
import { Button, Skeleton } from "@mui/material";
import { ChevronSelectorIcon } from "assets/Icons/ChevronSelectorIcon";
import rewind from "assets/images/rewind.png";
import { ChevronRight } from "assets/Icons/ChevronRight";
import { ImagePlusIcon } from "assets/Icons/ImagePlusIcon";
import DateRangeDropDown from "components/DateRangeDropDown";
import DisplayCustomerGroup from "components/DisplayCustomerGroup";
import TableComponent from "components/table";
import ExplainerComponent from "components/ExplainerComponent";
import { ReserveProductModal } from "../modals/ReserveProductModal";
import { ProductSummaryBox } from "..";
import { BusinessInfo } from "pages/Dashboard/Home";
import { AddOrRemoveItemModal } from "../modals/AddOrRemoveItemModal";
import { PreviewImagesModal } from "../modals/previewImagesModal";
import { thisWeekEnd, IMAGEURL, thisWeekStart } from "utils/constants/general";
import { FormSectionHeader } from "../../AddProduct/widget/FormSectionHeader";
import { useAppSelector } from "store/store.hooks";
import { selectPermissions, selectUserLocation } from "store/slice/AuthSlice";
import {
  capitalizeText,
  formatNumber,
  formatPrice,
  translateStatus,
} from "utils";
import "./style.scss";

import {
  useGetProductLedgerQuery,
  useGetSingleProductLedgerSummaryQuery,
} from "services";

import { PermissionsType } from "Models";
import { IndicatorComponent } from "components/IndicatorComponent";
const headCell = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "source",
    name: "Source",
  },
  {
    key: "activity",
    name: "Activity",
  },
  {
    key: "qtybefore",
    name: "Quantity Before",
  },
  {
    key: "quantity",
    name: "Quantity",
  },
  {
    key: "qtyafter",
    name: "Quantity After",
  },
];

type PropType = {
  product: any;
  isLoading: boolean;
  isSubscriptionType: any;
  cumulativeRowIndex: any;
  refetch: any;
  canManageProducts: boolean;
};

export const getSource = (type: any) => {
  switch (true) {
    case type.includes("Order"):
      return "Order";
    case type.includes("InventoryAdjustment"):
      return "Adjustment";
    case type.includes("InventoryTransfer"):
      return "Transfer";
    default:
      break;
  }
};

const ProductWithNoVariations = ({
  product,
  isLoading,
  isSubscriptionType,
  cumulativeRowIndex,
  refetch,
  canManageProducts,
}: PropType) => {
  const navigate = useNavigate();
  const [actionType, setActionType] = useState("");
  const [openUpdateItemModal, setOpenUpdateItemModal] = useState(false);
  const [viewAllImages, setViewAllImages] = useState(false);
  const [firstImage, setFirstImage] = useState<any>("");
  const [openModal, setOpenModal] = useState(false);
  const userLocation = useAppSelector(selectUserLocation);

  const [dataCount, setDataCount] = useState("10");
  const [openReserveModal, setOpenReserveModal] = useState(false);

  const [page, setPage] = useState(1);
  const { id } = useParams();
  const [dateRange, setDateRange] = useState<any>([
    {
      startDate: thisWeekStart,
      endDate: thisWeekEnd,
      key: "selection",
    },
  ]);

  const {
    data: historyData,
    isLoading: loadHistory,
    isError: isHistoryError,
  } = useGetSingleProductLedgerSummaryQuery({
    id,
    location_id: Number(userLocation?.id),
  });
  const {
    data: productLedger,
    isLoading: loadProductLedger,
    isFetching: fetchProductLedger,
    isError: productLedgerError,
  } = useGetProductLedgerQuery({
    limit: Number(dataCount),
    page: page,
    id,
    location_id: Number(userLocation?.id),
    from_date: dateRange
      ? moment(new Date(dateRange[0]?.startDate)).format("Y-MM-DD")
      : "",
    to_date: dateRange
      ? moment(new Date(dateRange[0]?.endDate)).format("Y-MM-DD")
      : "",
  });

  const handleUpdate = (type: string) => {
    setActionType(type);
    setOpenUpdateItemModal(true);
  };

  return (
    <>
      <div className="pd_product_with_no_variations">
        <div className="general_product_analytics">
          <BusinessInfo
            amount={
              historyData && historyData?.product_history
                ? `${Number(historyData?.product_history?.total_sold)}`
                : `0`
            }
            title={"Total Sold"}
            loading={loadHistory}
          />
          <BusinessInfo
            amount={
              historyData && historyData.product_history
                ? `${historyData.product_history.product_removed}`
                : "0"
            }
            title={"Total Removed"}
            loading={loadHistory}
          />
          <BusinessInfo
            amount={
              historyData && historyData.product_history
                ? `${historyData.product_history.product_returned}`
                : "0"
            }
            title={"Total Returned"}
            loading={loadHistory}
          />
          <BusinessInfo
            amount={`${formatPrice(product?.price)}`}
            title={"Price"}
            loading={isLoading}
          />
          <BusinessInfo
            amount={`${product?.weight_kg || ""}kg`}
            title={"Weight"}
            loading={isLoading}
          />
        </div>
        <div className="product_details_container">
          <div className="left_section">
            <div className="product_information section">
              {isLoading ? (
                <div className="summary_skeleton">
                  {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                    <Skeleton
                      key={item}
                      animation="wave"
                      height={30}
                      width={"100%"}
                    />
                  ))}
                </div>
              ) : (
                <>
                  <div className="product_summary_and_image_container">
                    <div className="stock_update_box">
                      <div className="available_Section">
                        <h2> Quantity</h2>
                        {product?.reserved_quantity ? (
                          <div className="flex items-center">
                            <IndicatorComponent
                              hover
                              text="This shows items currently held in the customer’s cart until payment is made or reserved time is expired. This does not deduct from your inventory until payment is confirmed."
                            />

                            <div className="reserved_text flex items-center ml-4 translate-y-[-2px]">
                              <p className="">
                                Reserved quantity:{" "}
                                {Number(product?.reserved_quantity)}
                              </p>
                              <Button
                                onClick={() => {
                                  setOpenReserveModal(true);
                                }}
                                className="h-[unset]"
                                endIcon={<ChevronRight stroke="#009444" />}
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="action_flex">
                        {canManageProducts && (
                          <Button
                            onClick={() => {
                              handleUpdate("remove");
                            }}
                            className="increament_btn"
                          >
                            Remove
                          </Button>
                        )}
                        <h4>{formatNumber(product?.quantity || 0)}</h4>
                        {canManageProducts && (
                          <Button
                            onClick={() => {
                              handleUpdate("add");
                            }}
                            className="increament_btn"
                          >
                            Add
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="description">
                      {product?.description && (
                        <div className="pd_long_description">
                          <h5>Short Description</h5>
                          <p>{product?.description}</p>
                        </div>
                      )}
                      {product?.details && (
                        <div className="pd_long_description">
                          <h5>Long Description</h5>
                          {product?.details ? parse(product?.details) : ""}
                        </div>
                      )}
                    </div>
                    {product?.images && product?.images?.length ? (
                      <div className="product_images">
                        <h5>Product Images</h5>
                        <div className="image_grid">
                          {product?.images?.map((item: any, i: number) => {
                            if (viewAllImages ? true : i < 4) {
                              return (
                                <div
                                  onClick={() => {
                                    setFirstImage(`${IMAGEURL}${item.path}`);
                                    setOpenModal(true);
                                  }}
                                  className={`image_box ${
                                    item.name === product?.image
                                      ? "thumbnail"
                                      : ""
                                  }`}
                                >
                                  {item.name === product?.image && (
                                    <div className="absolute_thumbnail_text">
                                      <p>Thumbnail</p>
                                    </div>
                                  )}
                                  <img
                                    src={`${IMAGEURL}${item.path}`}
                                    alt="product"
                                  />
                                </div>
                              );
                            }
                          })}
                        </div>
                        {product?.images?.length > 4 && (
                          <Button
                            onClick={() => {
                              setViewAllImages(!viewAllImages);
                            }}
                            className="view_all_btn"
                          >
                            View {viewAllImages ? "Less" : "All"} images
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="product_images">
                        <h5>Product Images</h5>
                        <div className="image_grid">
                          <div
                            onClick={() => {
                              navigate(
                                `/dashboard/products/edit/${id}?count=${cumulativeRowIndex}`
                              );
                            }}
                            className={`image_box empty`}
                          >
                            <ImagePlusIcon />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="right_section">
            <div className="details section">
              {isLoading ? (
                <div className="skeleton_box">
                  {[1, 2, 3, 4, 5, 6, 7]?.map((item) => (
                    <Skeleton
                      animation="wave"
                      key={item}
                      height={30}
                      width={"100%"}
                    />
                  ))}
                </div>
              ) : (
                product && (
                  <>
                    <FormSectionHeader title="Product Details" />
                    <div className="px-[16px]">
                      <div className="single_detail">
                        <p className="light_text">Cost Price</p>

                        <h4 className="bold_text">
                          {Number(product?.cost) === 0
                            ? "-"
                            : `${formatPrice(product?.cost)}`}
                        </h4>
                      </div>

                      <div className="single_detail">
                        <p className="light_text">Discounted Price</p>
                        <h4 className="bold_text">
                          {Number(product?.sales) === 0
                            ? "-"
                            : `${formatPrice(product?.sales)}`}
                        </h4>
                      </div>

                      <div className="single_detail">
                        <p className="light_text">Date Added</p>
                        <h4 className="bold_text">
                          {product?.formattedCreatedAt}
                        </h4>
                      </div>

                      <div className="single_detail">
                        <p className="light_text">Unit</p>
                        <h4 className="bold_text">{product?.unit}</h4>
                      </div>
                      {(product?.minimum_order_quantity ||
                        product?.maximum_order_quantity) && (
                        <div className="single_detail">
                          <p className="light_text">
                            Min and Max Order Quantity
                          </p>
                          <h4 className="bold_text">{`${
                            product?.minimum_order_quantity || "∞"
                          } - ${product?.maximum_order_quantity || "∞"}`}</h4>
                        </div>
                      )}
                      {product?.tags?.length ? (
                        <div className="single_detail">
                          <p className="light_text">Collections</p>
                          <h4 className="bold_text">
                            <DisplayCustomerGroup
                              groupList={product?.tags?.map(
                                (item: any) => item.tag
                              )}
                            />
                          </h4>
                        </div>
                      ) : (
                        ""
                      )}

                      {product?.barcode && !product?.variations?.length && (
                        <div className="single_detail">
                          <p className="light_text">Barcode</p>
                          <h3 className="bold_text">{product?.barcode}</h3>
                        </div>
                      )}
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>

        <div className="weekly_product_history_table_section">
          <div className="section_title">
            <p className="history">Product History</p>
            <DateRangeDropDown
              origin={"right"}
              setCustomState={setDateRange}
              defaultDates={{
                startDate: dateRange[0]?.startDate,
                endDate: dateRange[0]?.endDate,
              }}
              minDate={moment("2024-02-01").toDate()}
              action={
                <Button
                  endIcon={<ChevronSelectorIcon />}
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
          </div>
          <div className="section_description">
            <p></p>
            <p>
              Showing history for
              {` ${moment(dateRange[0]?.startDate).format(
                "D/MM/YYYY"
              )} - ${moment(dateRange[0]?.endDate).format("D/MM/YYYY")}`}
            </p>
          </div>

          <div className="history_analysis ">
            <ProductSummaryBox
              number={productLedger?.ledger_history?.total_sold}
              title="Sold"
              color="blue"
            />
            <ProductSummaryBox
              number={productLedger?.ledger_history?.total_added}
              title="Added"
              color="green"
            />
            <ProductSummaryBox
              number={productLedger?.ledger_history?.total_removed}
              title="Removed"
              color="yellow"
            />
            <ProductSummaryBox
              number={productLedger?.ledger_history?.total_returned}
              title="Returned"
              color="red"
            />
          </div>

          <div className="table_container">
            <TableComponent
              isError={productLedgerError}
              page={page}
              setPage={setPage}
              isLoading={loadProductLedger || fetchProductLedger}
              headCells={headCell}
              selectMultiple={false}
              showPagination={true}
              dataCount={dataCount}
              setDataCount={setDataCount}
              emptyImg={rewind}
              handleClick={(row: any) => {
                if (row.orderId) {
                  navigate(
                    `/dashboard/orders/${row.orderId}?backAction=${true}`
                  );
                }
              }}
              meta={{
                current: productLedger?.ledger_history?.history?.current_page,
                perPage: productLedger?.ledger_history?.history?.per_page,
                totalPage: productLedger?.ledger_history?.history?.last_page,
              }}
              tableData={productLedger?.ledger_history?.history?.data?.map(
                (row, i: number) => ({
                  date: `${moment(row.created_at).format("LLL")}`,
                  activity: `${capitalizeText(row.action)} ${
                    row?.user?.name ? ` by ${row?.user?.name}` : ""
                  }`,
                  qtybefore: row.quantity_before,
                  qtyafter: row.quantity_after,
                  quantity: row.quantity,
                  orderId:
                    getSource(row.source_type) === "Order"
                      ? row.source_id
                      : null,
                  id: row.id,
                  source: getSource(row.source_type),
                })
              )}
            />
          </div>
        </div>
      </div>
      <AddOrRemoveItemModal
        openModal={openUpdateItemModal}
        type={actionType}
        closeModal={() => {
          setOpenUpdateItemModal(false);
        }}
      />
      <PreviewImagesModal
        openModal={openModal}
        closeModal={() => {
          setOpenModal(false);
        }}
        images={
          product?.images && product?.images?.length
            ? product?.images?.map((item: any) => `${IMAGEURL}${item.path}`)
            : []
        }
        firstImage={firstImage}
      />
      <ReserveProductModal
        openModal={openReserveModal}
        order={product?.reserved_orders}
        refetch={refetch}
        closeModal={() => {
          setOpenReserveModal(false);
        }}
      />
    </>
  );
};
export default ProductWithNoVariations;
