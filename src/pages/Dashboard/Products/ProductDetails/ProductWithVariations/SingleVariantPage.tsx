import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import parse from "html-react-parser";
import { Button, CircularProgress, IconButton, Skeleton } from "@mui/material";
import { CopyIcon } from "assets/Icons/CopyIcon";
import { PrimaryFillIcon } from "assets/Icons/PrimaryFillIcon";
import { PrinterIcon } from "assets/Icons/PrinterIcon";
import { ScanIcon } from "assets/Icons/ScanIcon";
import rewind from "assets/images/rewind.png";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { ChevronSelectorIcon } from "assets/Icons/ChevronSelectorIcon";
import { ChevronRight } from "assets/Icons/ChevronRight";
import { EmptyImageIcon } from "assets/Icons/EmptyImageIcon";
import { ChevronLeftNewIcon } from "assets/Icons/ChevronNewLeftIcon";
import ErrorMsg from "components/ErrorMsg";
import Loader from "components/Loader";
import DropDownWrapper from "components/DropDownWrapper";
import TableComponent from "components/table";
import DateRangeDropDown from "components/DateRangeDropDown";
import { GrowthModal } from "components/GrowthModal";
import { UpgradeModal } from "components/UpgradeModal";
import MessageModal from "components/Modal/MessageModal";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { PrintBarcodeSingleModal } from "../modals/PrintBarcodeSingleModal";
import { LinkExistingMultipleBarcodeModal } from "../modals/LinkExistingMultipleBarcode ";
import { AddOrRemoveItemModal } from "../modals/AddOrRemoveItemModal";
import { FormSectionHeader } from "../../AddProduct/widget/FormSectionHeader";
import { PreviewImagesModal } from "../modals/previewImagesModal";
import { getSource } from "../ProductWithoutVariation";
import { BusinessInfo } from "pages/Dashboard/Home";
import { capitalizeText, formatNumber, formatPrice, handleError } from "utils";

import {
  IMAGEURL,
  getObjWithValidValues,
  thisWeekEnd,
  thisWeekStart,
} from "utils/constants/general";
import { showToast, useAppSelector } from "store/store.hooks";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
  selectPermissions,
  selectUserLocation,
} from "store/slice/AuthSlice";
import { ProductSummaryBox } from "..";
import {
  useEditProductMutation,
  useGetSingleProductVariationQuery,
  useGetSingleVariationLedgerSummaryQuery,
  useGetVariationProductLedgerQuery,
} from "services";
import { PermissionsType } from "Models";
import "./style.scss";

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

const SingleVariantPage = () => {
  const [actionType, setActionType] = useState("");
  const [openUpdateItemModal, setOpenUpdateItemModal] = useState(false);
  const [viewAllImages, setViewAllImages] = useState(false);
  const [firstImage, setFirstImage] = useState<any>("");
  const [openModal, setOpenModal] = useState(false);
  const userLocation = useAppSelector(selectUserLocation);
  const [dataCount, setDataCount] = useState("10");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const userPermission: PermissionsType = useAppSelector(selectPermissions);
  const [isStaff, setIsStaff] = useState(false);
  const canManageProducts = isStaff ? userPermission?.products?.manage : true;
  const { id } = useParams();
  const [openBarcode, setOpenBarcode] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [openLinkMultipleModal, setOpenLinkMultipleModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editProduct, { isLoading: editLoad }] = useEditProductMutation();
  const queryParams = new URLSearchParams(location.search);
  const cumulativeRowIndex = Number(queryParams.get("count"));
  const [openGrowthModal, setOpenGrowthModal] = useState(false);
  const [isBarcodeUpgrade, setIsBarcodeUpgrade] = useState(false);
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
  } = useGetSingleVariationLedgerSummaryQuery({
    id,
    location_id: Number(userLocation?.id),
  });
  const {
    data: productLedger,
    isLoading: loadProductLedger,
    isFetching: fetchProductLedger,
    isError: productLedgerError,
  } = useGetVariationProductLedgerQuery({
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
  const { data, isLoading, isFetching, isError, error } =
    useGetSingleProductVariationQuery({
      id,
      location_id: userLocation?.id,
    });

  const handleUpdate = (type: string) => {
    setActionType(type);
    setOpenUpdateItemModal(true);
  };

  const viewNextVariant = (id: number, type: "forward" | "backward") => {
    let listOfId: number[] =
      data?.product_variations?.product?.variations?.map(
        (item: any) => item.id
      ) || [];
    let indexOfId = listOfId.indexOf(id);
    if (listOfId?.length) {
      if (type === "forward") {
        if (indexOfId === listOfId?.length - 1) {
          navigate(`/dashboard/products/variant/${listOfId[0]}`);
        } else {
          navigate(`/dashboard/products/variant/${listOfId[indexOfId + 1]}`);
        }
      } else {
        if (indexOfId === 0) {
          navigate(
            `/dashboard/products/variant/${listOfId[listOfId?.length - 1]}`
          );
        } else {
          if (indexOfId === listOfId?.length - 1) {
            navigate(`/dashboard/products/variant/${listOfId[0]}`);
          } else {
            navigate(`/dashboard/products/variant/${listOfId[0]}`);
          }
        }
      }
    }
  };

  const onSubmit = async (newFormValues?: any[]) => {
    let variantList = newFormValues || [];
    let realVariations = variantList?.map((item: any) => {
      return {
        image: item.image,
        variant: item.variant.trim(),
        id: item.id,
        stock: item.stock,
        price: item.price,
        sales: item.sales,
        cost: item.cost,
      };
    });
    let removeEmptyVariations = realVariations?.map((item: any) =>
      getObjWithValidValues(item)
    );

    const payload = {
      ...data?.product_variations?.product,
      tags:
        data?.product_variations?.product?.tags &&
        data?.product_variations?.product?.tags?.length
          ? data?.product_variations?.product?.tags?.map(
              (item: any) => item.tag
            )
          : null,
      variations: removeEmptyVariations,
    };
    try {
      let result = await editProduct({
        body: getObjWithValidValues(payload),
        id: data?.product_variations?.product?.id,
      });
      if ("data" in result) {
        showToast("Edited Successfuly", "success");
        setOpenDeleteModal(false);
        navigate(-1);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const removeVariation = (i: number | null) => {
    if (i !== null) {
      let newFormValues = [...data?.product_variations?.product?.variations];
      let filtered = newFormValues.filter((item) => item.id !== i);
      onSubmit(filtered);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (userPermission !== undefined) {
      setIsStaff(true);
    } else {
      setIsStaff(false);
    }
  }, [userPermission]);
  if (isError) {
    return (
      <ErrorMsg
        error={
          // @ts-ignore
          error?.status === 404
            ? "Product does not exist"
            : // @ts-ignore
            error?.status === "FETCH_ERROR"
            ? "Kindly check your internet connection"
            : "Something went wrong"
        }
      />
    );
  }
  return (
    <>
      {(isLoading || isFetching) && <Loader />}
      {data && data.product_variations && (
        <div className="pd_product_details">
          <ModalHeader
            text={
              <div className="product_name_flex">
                <div className="variant_name">
                  <p>{data.product_variations?.product?.name}</p>
                  <h3>{data.product_variations?.variant}</h3>
                </div>
              </div>
            }
            closeModal={() => {
              navigate(-1);
            }}
            button={
              <div className="action_buttons">
                {canManageProducts && (
                  <>
                    {data?.product_variations?.product?.variations?.length >
                    1 ? (
                      <div className="button_arrow_cover">
                        <IconButton
                          onClick={() => {
                            viewNextVariant(Number(id), "backward");
                          }}
                        >
                          <ChevronLeftNewIcon stroke="#5C636D" />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            viewNextVariant(Number(id), "forward");
                          }}
                        >
                          <ChevronRight stroke="#5C636D" />
                        </IconButton>
                      </div>
                    ) : (
                      ""
                    )}

                    <DropDownWrapper
                      origin={screenWidth <= 600 ? "left" : "right"}
                      className="navbar_dropdown"
                      action={
                        <Button
                          startIcon={<CopyIcon stroke="#5C636D" />}
                          className="grey_btn"
                          endIcon={<PrimaryFillIcon />}
                        >
                          Barcode
                        </Button>
                      }
                    >
                      <div className="cover_buttons">
                        <ul className="select_list btn_list">
                          <li className="scan_btns">
                            <Button
                              onClick={() => {
                                setOpenBarcode(true);
                              }}
                              startIcon={
                                <span className="span">
                                  <PrinterIcon stroke="#5C636D" />
                                </span>
                              }
                            >
                              Print Barcode
                            </Button>
                          </li>
                          <li className="scan_btns">
                            <Button
                              onClick={() => {
                                setOpenLinkMultipleModal(true);
                              }}
                              startIcon={
                                <span className="span">
                                  <ScanIcon />{" "}
                                </span>
                              }
                            >
                              Link Existing Barcode{" "}
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </DropDownWrapper>

                    <IconButton
                      onClick={() => {
                        setOpenDeleteModal(true);
                      }}
                      type="button"
                      className="icon_button_container"
                    >
                      <TrashIcon />
                    </IconButton>
                  </>
                )}
              </div>
            }
          />
          <div className="pd_product_with_no_variations">
            <div className="general_product_analytics">
              <BusinessInfo
                amount={formatPrice(data?.product_variations?.price || 0)}
                title={"Price"}
                loading={isLoading}
              />
              <BusinessInfo
                amount={formatPrice(data?.product_variations?.cost || 0)}
                title={"Cost Price"}
                loading={isLoading}
              />
              <BusinessInfo
                amount={formatPrice(data?.product_variations?.sales || 0)}
                title={"Discounted Price"}
                loading={isLoading}
              />
              <BusinessInfo
                amount={
                  historyData && historyData?.summary
                    ? `${Number(historyData?.summary?.total_sold)}`
                    : `0`
                }
                title={"Overall Total Sold"}
                loading={loadHistory}
              />
              <BusinessInfo
                amount={
                  historyData && historyData?.summary
                    ? `${Number(historyData?.summary?.total_removed)}`
                    : `0`
                }
                title={"Overall Total Removed"}
                loading={loadHistory}
              />{" "}
              <BusinessInfo
                amount={
                  historyData && historyData?.summary
                    ? `${Number(historyData?.summary?.total_returned)}`
                    : `0`
                }
                title={"Overall Total Returned"}
                loading={loadHistory}
              />
              <BusinessInfo
                amount={`${data?.product_variations?.weight_kg || ""}kg`}
                title={"Weight"}
                loading={loadHistory}
              />
              {(data?.product_variations?.minimum_order_quantity ||
                data?.product_variations?.maximum_order_quantity) && (
                <BusinessInfo
                  amount={`${
                    data?.product_variations?.minimum_order_quantity || "∞"
                  } - ${
                    data?.product_variations?.maximum_order_quantity || "∞"
                  }`}
                  title={"Min and Max Order Quantity"}
                  loading={isLoading}
                />
              )}
            </div>

            <div className="product_details_container">
              <div className="left_section">
                <div className="product_information section">
                  {isLoading ? (
                    <div className="summary_skeleton">
                      {[1, 2, 3, 4, 5, 6, 7]?.map((item) => (
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
                          <p>Quantity</p>
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
                            <h4>
                              {formatNumber(
                                data?.product_variations?.quantity || 0
                              )}
                            </h4>
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

                        <div className="description for_variants">
                          {!data?.product_variations?.product?.description &&
                          !data?.product_variations?.product?.details ? (
                            <div className="empty_description">
                              <p>Product description is empty</p>
                            </div>
                          ) : (
                            <>
                              {data?.product_variations?.product
                                ?.description && (
                                <div className="pd_long_description">
                                  <h5>Short Description</h5>
                                  <p>
                                    {
                                      data?.product_variations?.product
                                        ?.description
                                    }
                                  </p>
                                </div>
                              )}
                              {data?.product_variations?.product?.details && (
                                <div className="pd_long_description">
                                  <h5>Long Description</h5>
                                  {data?.product_variations?.product?.details
                                    ? parse(
                                        data?.product_variations?.product
                                          ?.details
                                      )
                                    : ""}
                                </div>
                              )}
                            </>
                          )}
                        </div>
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
                    data &&
                    data?.product_variations && (
                      <>
                        <FormSectionHeader title="Product Image" />
                        <div className="px-[16px]">
                          {data?.product_variations?.image ? (
                            <div
                              onClick={() => {
                                setFirstImage(
                                  `${IMAGEURL}${data?.product_variations?.image}`
                                );
                                setOpenModal(true);
                              }}
                              className={`variant_image_box `}
                            >
                              <img
                                src={`${IMAGEURL}${data?.product_variations?.image}`}
                                alt="product"
                              />
                            </div>
                          ) : (
                            <div className="empty_image_representation">
                              <div className="empty_image_cover">
                                <EmptyImageIcon stroke="#5c636d" />
                              </div>
                              <p>Variant has no image</p>
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
                          )} - ${moment(dateRange[0]?.endDate).format(
                            "D/MM/YYYY"
                          )}`
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

              <div className="history_analysis">
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
                  meta={{
                    current:
                      productLedger?.ledger_history?.history?.current_page,
                    perPage: productLedger?.ledger_history?.history?.per_page,
                    totalPage:
                      productLedger?.ledger_history?.history?.last_page,
                  }}
                  handleClick={(row: any) => {
                    if (row.orderId) {
                      navigate(
                        `/dashboard/orders/${row.orderId}?backAction=${true}`
                      );
                    }
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
                      id: row.id,
                      source: getSource(row.source_type),

                      orderId:
                        getSource(row.source_type) === "Order"
                          ? row.source_id
                          : null,
                    })
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <AddOrRemoveItemModal
        openModal={openUpdateItemModal}
        type={actionType}
        variantId={data?.product_variations?.id}
        productId={data?.product_variations?.product?.id}
        closeModal={() => {
          setOpenUpdateItemModal(false);
        }}
      />
      <PrintBarcodeSingleModal
        openModal={openBarcode}
        closeModal={() => {
          setOpenBarcode(false);
        }}
        variantId={data?.product_variations?.id}
        product={data?.product_variations?.product}
      />
      <LinkExistingMultipleBarcodeModal
        openModal={openLinkMultipleModal}
        closeModal={() => {
          setOpenLinkMultipleModal(false);
        }}
        variants={data?.product_variations?.product?.variations
          ?.map((item: any) => {
            return {
              ...item,
              image: item?.image
                ? `${IMAGEURL}${item?.image}`
                : `${data?.product_variations?.product?.alt_image_url}`,
            };
          })
          .filter(
            (variant: any) => variant.id === data?.product_variations?.id
          )}
      />
      <MessageModal
        openModal={openDeleteModal}
        closeModal={() => {
          setOpenDeleteModal(false);
        }}
        icon={<TrashIcon />}
        btnChild={
          <Button
            onClick={() => {
              removeVariation(data?.product_variations?.id);
            }}
            disabled={editLoad}
            className="error"
          >
            {editLoad ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Yes, delete"
            )}
          </Button>
        }
        description="Are you sure you want to delete this product? This action is irreversible"
      />
      <PreviewImagesModal
        openModal={openModal}
        closeModal={() => {
          setOpenModal(false);
        }}
        images={[]}
        firstImage={firstImage}
      />
      {openGrowthModal && isBarcodeUpgrade && (
        <GrowthModal
          openModal={openGrowthModal}
          closeModal={() => {
            setIsBarcodeUpgrade(false);
            setOpenGrowthModal(false);
          }}
          title={`Generate barcodes easily on the Growth Plan`}
          subtitle={`Get better inventory tracking when you use Bumpa’s barcode generator.`}
          growthFeatures={[
            "Generate barcodes for better inventory tracking",
            "Upload business logo on website",
            "Create unique barcodes for your products & sell faster.",
          ]}
          buttonText={`Upgrade to Growth`}
        />
      )}
    </>
  );
};
export default SingleVariantPage;
