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
import { ShareIcon } from "assets/Icons/ShareIcon";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";
import ErrorMsg from "components/ErrorMsg";
import Loader from "components/Loader";
import InputField from "components/forms/InputField";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { Next, Prev } from "components/table/pagination";
import MessageModal from "components/Modal/MessageModal";
import EmptyResponse from "components/EmptyResponse";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import { AddItemModalDiscount } from "./AddItemModalDiscount";
import {
  useDeleteDiscountMutation,
  useGetSingleDiscountItemQuery,
  useGetSingleDiscountQuery,
  useRemoveItemDiscountMutation,
} from "services";
import { formatPrice, handleError, translateDiscountStatus } from "utils";
import { IMAGEURL, alt_image_url } from "utils/constants/general";
import { showToast } from "store/store.hooks";
import { useCopyToClipboardHook } from "hooks/useCopyToClipboardHook";
import "./style.scss";

const tabList = [{ label: "Products", value: "products" }];
export const ViewDiscount = () => {
  const [searchProduct, setSearchProduct] = useState("");
  const [productToDelete, setProductToDelete] = useState({ type: "", id: "" });
  const [page, setPage] = useState(1);
  const [openAddItemModal, setOpenAddItemModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, isError } = useGetSingleDiscountQuery(id);
  const {
    data: itemData,
    isLoading: loadItem,
    isFetching: fetchItem,
    isError: itemError,
  } = useGetSingleDiscountItemQuery({
    id: `${id}`,
    search: searchProduct,
    page,
    limit: 10,
  });

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { isCopied, handleCopyClick } = useCopyToClipboardHook(
    data ? data.discounts.url : ""
  );
  const [deleteDiscount, { isLoading: loadDelete }] =
    useDeleteDiscountMutation();
  const deleteDiscountFnc = async (id: string, callback?: () => void) => {
    try {
      let result = await deleteDiscount(id);
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

  const [removeItem, { isLoading: loadRemove }] =
    useRemoveItemDiscountMutation();

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
  if (isLoading || loadItem) {
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
                  deleteDiscountFnc(`${id}`, () => {
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
          text="Discount Details"
          button={
            <div className="action_buttons">
              <Button
                startIcon={<ShareIcon />}
                onClick={() => {
                  handleCopyClick();
                }}
                className="grey_btn"
              >
                {isCopied ? "Copied" : "Copy Link"}
              </Button>
              <Button
                startIcon={<PlusIcon stroke="#009444" />}
                variant="outlined"
                className="edit"
                onClick={() => {
                  setOpenAddItemModal(true);
                }}
              >
                Add Item{" "}
              </Button>{" "}
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
              <FormSectionHeader title="Discounted Products" />

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
                          key={item?.discountable?.id}
                        >
                          <div className="right_details">
                            <img
                              src={
                                item?.discountable_type === "App\\Collection"
                                  ? item?.discountable?.image_path
                                    ? `${IMAGEURL}${item?.discountable?.image_path}`
                                    : alt_image_url
                                  : item?.discountable_type ===
                                    "App\\ProductVariation"
                                  ? item?.discountable?.image
                                    ? `${IMAGEURL}${item?.discountable?.image}`
                                    : alt_image_url
                                  : item?.discountable?.alt_image_url
                              }
                              alt="product"
                            />
                            <div className="discount_details">
                              <p className="product_name">
                                {item?.discountable_type === "App\\Collection"
                                  ? `${item?.discountable?.tag} (collection)`
                                  : item?.discountable_type ===
                                    "App\\ProductVariation"
                                  ? `${item?.discountable?.product_title} (${item?.discountable?.variant})`
                                  : item?.discountable?.title}
                              </p>
                            </div>
                          </div>
                          <div className="delete-wrapper">
                            <p className="product_price">
                              {item?.discountable_type !== "App\\Collection" &&
                                formatPrice(Number(item?.discountable?.price))}
                            </p>
                            <IconButton
                              type="button"
                              onClick={() => {
                                setOpenDeleteModal(true);
                                setProductToDelete({
                                  type:
                                    item?.discountable_type ===
                                    "App\\Collection"
                                      ? "collections"
                                      : item?.discountable_type ===
                                        "App\\ProductVariation"
                                      ? "product_variations"
                                      : "producs",
                                  id: item?.discountable?.id,
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
                  <p className="light_text">Description</p>
                  <h3 className="bold_text">{data?.discounts.description}</h3>
                </div>
                <div className="single_detail">
                  <p className="light_text">Discount Type</p>
                  <h3 className="bold_text">
                    {data?.discounts.type === "percentage"
                      ? `Percentage (%) Discount`
                      : data?.discounts.type === "fixed"
                      ? `Fixed (N) Discount`
                      : "Cart Discount"}
                  </h3>
                </div>
                <div className="single_detail">
                  <p className="light_text">Discount</p>
                  <h3 className="bold_text">
                    {data?.discounts.type === "percentage"
                      ? `${Math.trunc(Number(data?.discounts.value))}%`
                      : data?.discounts.type === "fixed"
                      ? `${formatPrice(Number(data?.discounts.value))}`
                      : "Cart Discount"}
                  </h3>
                </div>

                <div className="single_detail">
                  <p className="light_text">Discount Products</p>
                  <h4 className="bold_text">
                    {(data?.discounts?.products_count
                      ? data?.discounts?.products_count
                      : 0) +
                      (data?.discounts?.product_variations_count
                        ? data?.discounts?.product_variations_count
                        : 0)}
                  </h4>
                </div>
                <div className="single_detail">
                  <p className="light_text">Discount Collections</p>
                  <h4 className="bold_text">
                    {data?.discounts?.collections_count}
                  </h4>
                </div>
                <div className="single_detail">
                  <p className="light_text">Discount Status</p>

                  <Chip
                    color={
                      translateDiscountStatus(data?.discounts.live_status).color
                    }
                    label={
                      translateDiscountStatus(data?.discounts.live_status).label
                    }
                  />
                </div>
                <div className="single_detail">
                  <p className="light_text">Discount Validity</p>
                  <h4 className="bold_text">
                    {data?.discounts.valid_till
                      ? `${
                          moment(data?.discounts.valid_from).format(
                            "DD/MM/YYYY, h:mm:ss a"
                          ) +
                          " - " +
                          moment(data?.discounts.valid_till).format(
                            "DD/MM/YYYY, h:mm:ss a"
                          )
                        }`
                      : `${
                          moment(data?.discounts.valid_from).format(
                            "DD/MM/YYYY, h:mm:ss a"
                          ) +
                          " - " +
                          "No date set"
                        }`}
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
