import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import {
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Pagination,
  PaginationItem,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import { CopyIcon } from "assets/Icons/CopyIcon";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { MarkIcon } from "assets/Icons/MarkIcon";
import ErrorMsg from "components/ErrorMsg";
import Loader from "components/Loader";
import EmptyResponse from "components/EmptyResponse";
import MessageModal from "components/Modal/MessageModal";
import { Next, Prev } from "components/table/pagination";
import InputField from "components/forms/InputField";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { useCopyToClipboardHook } from "hooks/useCopyToClipboardHook";
import { AddItemModalDiscount } from "./AddItemModalDiscount";
import {
  useDeleteCouponMutation,
  useGetSingleCouponItemQuery,
  useGetSingleCouponQuery,
  useRemoveItemCouponMutation,
} from "services";
import { formatPrice, handleError, translateDiscountStatus } from "utils";
import { IMAGEURL, alt_image_url } from "utils/constants/general";
import { showToast } from "store/store.hooks";
import "./style.scss";

const tabList = [
  { label: "Products", value: "products" },
  { label: "Collections", value: "collections" },
];
export const ViewCoupon = () => {
  const [searchProduct, setSearchProduct] = useState("");
  const [page, setPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState({ type: "", id: "" });
  const [openAddItemModal, setOpenAddItemModal] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();
  const { data, isLoading, isError } = useGetSingleCouponQuery(id);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { isCopied, handleCopyClick } = useCopyToClipboardHook(
    data ? data.coupon.code : ""
  );

  const {
    data: itemData,
    isLoading: loadItem,
    isFetching: fetchItem,
    isError: itemError,
  } = useGetSingleCouponItemQuery({
    id: `${id}`,
    search: searchProduct,
    page,
    limit: 10,
  });
  const [deleteCoupon, { isLoading: loadDelete }] = useDeleteCouponMutation();
  const deleteCouponFnc = async (id: string, callback?: () => void) => {
    try {
      let result = await deleteCoupon(id);
      if ("data" in result) {
        showToast("Deleted Successfully", "success");
        setOpenDeleteModal(false);
        navigate(-1);
        callback && callback();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const [removeItem, { isLoading: loadRemove }] = useRemoveItemCouponMutation();

  const removeFnc = async (body: {
    products?: string[];
    collections?: string[];
    product_variations?: string[];
  }) => {
    try {
      let result = await removeItem({ body, id });
      if ("data" in result) {
        showToast("Removed Successfully", "success");
        setProductToDelete({ type: "", id: "" });
        setOpenDeleteModal(false);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  if (isError || itemError) {
    return <ErrorMsg error="Something went wrong" />;
  }
  if (isLoading) {
    return <Loader />;
  }
  return (
    data &&
    itemData && (
      <div className="pd_view_product pd_view_discount">
        {fetchItem && !searchProduct && <Loader />}

        <MessageModal
          openModal={openDeleteModal}
          closeModal={() => {
            setOpenDeleteModal(false);
            setProductToDelete({ type: "", id: "" });
          }}
          icon={<TrashIcon />}
          disabled={loadDelete || loadRemove}
          closeOnOverlayClick={!loadRemove}
          btnChild={
            <Button
              disabled={loadDelete || loadRemove}
              onClick={() => {
                if (productToDelete.id) {
                  if (productToDelete.type === "collections") {
                    removeFnc({
                      collections: [`${productToDelete.id}`],
                    });
                  } else if (productToDelete.type === "product_variations") {
                    removeFnc({
                      product_variations: [`${productToDelete.id}`],
                    });
                  } else {
                    removeFnc({
                      products: [`${productToDelete.id}`],
                    });
                  }
                } else {
                  deleteCouponFnc(`${id}`, () => {
                    setOpenDeleteModal(false);
                  });
                }
              }}
              className="error"
            >
              {loadDelete || loadRemove ? (
                <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
              ) : (
                "Yes, delete"
              )}
            </Button>
          }
          description={
            productToDelete?.id
              ? "Are you sure you want to remove this item?"
              : "Are you sure you want to delete?"
          }
        />
        <AddItemModalDiscount
          openModal={openAddItemModal}
          closeModal={() => {
            setOpenAddItemModal(false);
          }}
        />
        <ModalHeader
          text="Coupon Details"
          button={
            <div className="action_buttons">
              {data?.coupon?.class === "item" && (
                <Button
                  startIcon={<PlusIcon stroke="#009444" />}
                  variant="outlined"
                  className="edit"
                  onClick={() => {
                    setOpenAddItemModal(true);
                  }}
                >
                  Add Item{" "}
                </Button>
              )}
              <IconButton
                onClick={() => {
                  setOpenDeleteModal(true);
                }}
                type="button"
                className="icon_button_container"
              >
                <TrashIcon />
              </IconButton>
            </div>
          }
        />

        <div className="product_details_container">
          <div className="left_section">
            <div className="product_information section">
              <FormSectionHeader title="Discounted Products/Collections" />

              {itemData && itemData?.data?.length ? (
                <>
                  <div className="px-[16px]">
                    {/* <div className="search_container">
                      <InputField
                        type={"text"}
                        containerClass="search_field"
                        value={searchProduct}
                        onChange={(e: any) => {
                          setSearchProduct(e.target.value);
                        }}
                        placeholder="Search"
                        suffix={
                          searchProduct && fetchItem ? (
                            <CircularProgress
                              size="1.5rem"
                              sx={{ color: "#9BA2AC" }}
                            />
                          ) : (
                            <SearchIcon />
                          )
                        }
                      />
                    </div> */}
                    {itemData?.data?.map((item: any) => {
                      return (
                        <div
                          className="single_discount "
                          key={item?.couponable?.id}
                        >
                          <div className="right_details">
                            <img
                              src={
                                item?.couponable_type === "App\\Collection"
                                  ? item?.couponable?.image_path
                                    ? `${IMAGEURL}${item?.couponable?.image_path}`
                                    : alt_image_url
                                  : item?.couponable_type ===
                                    "App\\ProductVariation"
                                  ? item?.couponable?.image
                                    ? `${IMAGEURL}${item?.couponable?.image}`
                                    : alt_image_url
                                  : item?.couponable?.alt_image_url
                              }
                              alt="product"
                            />
                            <div className="discount_details">
                              <p className="product_name">
                                {item?.couponable_type === "App\\Collection"
                                  ? `${item?.couponable?.tag} (collection)`
                                  : item?.couponable_type ===
                                    "App\\ProductVariation"
                                  ? `${item?.couponable?.product_title} (${item?.couponable?.variant})`
                                  : item?.couponable?.title}
                              </p>
                            </div>
                          </div>
                          <div className="delete-wrapper">
                            <p className="product_price">
                              {item?.couponable_type !== "App\\Collection" &&
                                formatPrice(Number(item?.couponable?.price))}
                            </p>
                            <IconButton
                              type="button"
                              onClick={() => {
                                setOpenDeleteModal(true);
                                setProductToDelete({
                                  type:
                                    item?.couponable_type === "App\\Collection"
                                      ? "collections"
                                      : item?.couponable_type ===
                                        "App\\ProductVariation"
                                      ? "product_variations"
                                      : "producs",
                                  id: item?.couponable?.id,
                                });
                              }}
                              className="icon_button_container"
                            >
                              <TrashIcon />
                            </IconButton>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <EmptyResponse message="No record found" />
              )}
            </div>
            <div className="pagination-wrap">
              <div className="paginate_discount">
                {itemData?.last_page !== 1 && (
                  <Pagination
                    color="primary"
                    page={page || 1}
                    onChange={(e, val) => setPage(val)}
                    count={itemData?.last_page}
                    defaultPage={1}
                    shape="rounded"
                    renderItem={(item) => (
                      <PaginationItem
                        slots={{ previous: Prev, next: Next }}
                        {...item}
                      />
                    )}
                  />
                )}{" "}
              </div>
            </div>
          </div>
          <div className="right_section">
            <div className="details section">
              <FormSectionHeader title="Discount Details" />
              <div className="px-[16px]">
                <div className="single_detail">
                  <p className="light_text">Coupon Name</p>
                  <h3 className="bold_text">{data?.coupon?.description}</h3>
                </div>
                <div className="single_detail">
                  <p className="light_text">Coupon Code</p>
                  <div className="copy_code flex items-center">
                    <h3 className="bold_text pr-4">{data?.coupon.code}</h3>
                    <IconButton
                      onClick={() => {
                        handleCopyClick();
                      }}
                      type="button"
                      className="icon_button_container"
                    >
                      {isCopied ? <MarkIcon /> : <CopyIcon />}
                    </IconButton>
                  </div>
                </div>
                <div className="single_detail">
                  <p className="light_text">Coupon Type</p>
                  <h4 className="bold_text">
                    {data?.coupon.type === "percentage"
                      ? `Percentage (%) Discount`
                      : data?.coupon.type === "fixed"
                      ? `Fixed (N) Discount`
                      : "Cart Discount"}
                  </h4>
                </div>
                <div className="single_detail">
                  <p className="light_text">Discount</p>
                  <h4 className="bold_text">
                    {data?.coupon.type === "percentage"
                      ? `${Math.trunc(Number(data?.coupon.value))}%`
                      : data?.coupon.type === "fixed"
                      ? `${formatPrice(Number(data?.coupon.value))}`
                      : "Cart Discount"}
                  </h4>
                </div>
                <div className="single_detail">
                  <p className="light_text">Number of Use</p>
                  <h4 className="bold_text">{data?.coupon.total_usage}</h4>
                </div>
                {data?.coupon?.max_uses && (
                  <div className="single_detail">
                    <p className="light_text">Maximum Usage</p>
                    <h4 className="bold_text">{data?.coupon?.max_uses}</h4>
                  </div>
                )}
                {data?.coupon?.max_per_customer && (
                  <div className="single_detail">
                    <p className="light_text">Maximum Usage Per Customer</p>
                    <h4 className="bold_text">
                      {data?.coupon?.max_per_customer}
                    </h4>
                  </div>
                )}
                <div className="single_detail">
                  <p className="light_text">Minumum cart value</p>
                  <h4 className="bold_text">
                    {formatPrice(Number(data?.coupon.minimum_value || 0))}
                  </h4>
                </div>
                <div className="single_detail">
                  <p className="light_text"> Maximum Discount</p>
                  <h4 className="bold_text">
                    {formatPrice(Number(data?.coupon.max_discount || 0))}
                  </h4>
                </div>
                <div className="single_detail">
                  <p className="light_text">Coupon Status</p>

                  <Chip
                    color={
                      translateDiscountStatus(data?.coupon.live_status).color
                    }
                    label={
                      translateDiscountStatus(data?.coupon.live_status).label
                    }
                  />
                </div>
                <div className="single_detail">
                  <p className="light_text">Coupon Validity</p>
                  <h4 className="bold_text">
                    {moment(data?.coupon.valid_from).format(
                      "DD/MM/YYYY, h:mm:ss a"
                    ) +
                      " - " +
                      moment(data?.coupon.valid_till).format(
                        "DD/MM/YYYY, h:mm:ss a"
                      )}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
