import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import {
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Skeleton,
} from "@mui/material";
import { ChevronRight } from "assets/Icons/ChevronRight";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { EyeIcon } from "assets/Icons/EyeIcon";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { EyeOffIcon } from "assets/Icons/EyeOffIcon";
import DropDownWrapper from "components/DropDownWrapper";
import TableComponent from "components/table";
import DisplayCustomerGroup from "components/DisplayCustomerGroup";
import {
  formatNumberWithCommas,
  removeFormattedNumerComma,
} from "components/forms/ValidatedInput";
import MessageModal from "components/Modal/MessageModal";
import {
  getVariationCostPrice,
  getVariationDiscountPrice,
  getVariationPrice,
  getVariationWeight,
} from "../../widget/InventoryTable";
import { BulkEditVariationModal } from "./bulkEditVariationModal";
import { PreviewImagesModal } from "../modals/previewImagesModal";
import { FormSectionHeader } from "../../AddProduct/widget/FormSectionHeader";
import { AddOrRemoveVariationsModal } from "../modals/AddOrRemoveVariationsModal";
import { formatNumber, formatPrice, handleError, translateStatus } from "utils";
import {
  IMAGEURL,
  alt_image_url,
  getObjWithValidValues,
} from "utils/constants/general";
import { selectUserLocation } from "store/slice/AuthSlice";
import { showToast, useAppSelector } from "store/store.hooks";
import { useEditProductMutation } from "services";
import "./style.scss";
import { ReservedIcon } from "assets/Icons/ReservedIcon";
import ExplainerComponent from "components/ExplainerComponent";
import { ReserveProductModal } from "../modals/ReserveProductModal";
import { IndicatorComponent } from "components/IndicatorComponent";

type PropType = {
  isLoading: boolean;
  product: any;
  canManageProducts: boolean;
  isSubscriptionType: any;
  cumulativeRowIndex: any;
  refetch: any;
};
const headCellsToHide = [
  { label: "Cost Price", key: "cost" },
  { label: "Discount Price", key: "sales" },
  { label: "Barcode", key: "barcode" },

  { label: "Weight", key: "weight_kg" },
  { label: "Min and Max Order Quantity", key: "minmax" },
];
const headCell = [
  {
    key: "image",
    name: "",
  },
  {
    key: "variant",
    name: "Variants",
  },
  {
    key: "quantity",
    name: "Quantity",
  },

  {
    key: "price",
    name: "Price",
  },
  {
    key: "barcode",
    name: "Barcode",
  },
  {
    key: "cost",
    name: "Cost",
  },
  {
    key: "sales",
    name: "Discount",
  },
  {
    key: "weight_kg",
    name: "Weight",
  },
  { name: "Min and Max Order Quantity", key: "minmax" },

  {
    key: "action",
    name: "",
  },
];
const ProductWithVariations = ({
  isLoading,
  product,
  canManageProducts,
  isSubscriptionType,
  cumulativeRowIndex,
  refetch,
}: PropType) => {
  const navigate = useNavigate();
  const userLocation = useAppSelector(selectUserLocation);
  const [viewAllImages, setViewAllImages] = useState(false);
  const [firstImage, setFirstImage] = useState<any>("");
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [openBulkActionModal, setOpenBulkActionModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [formValues, setFormValues] = useState<any[]>([]);
  const [openReserveModal, setOpenReserveModal] = useState(false);
  const [editProduct, { isLoading: editLoad }] = useEditProductMutation();
  const [inputVal, setInputVal] = useState("");
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [openDeleteVariantModal, setOpenDeleteVariantModal] = useState(false);
  const [openUpdateVariationsModal, setOpenUpdateVariationsModal] =
    useState(false);
  const [tableKeys, setTableKeys] = useState<string[]>([
    "image",
    "variant",
    "quantity",
    "price",
    "action",
  ]);
  const handleUpdate = (type: string) => {
    setActionType(type);
    setOpenUpdateVariationsModal(true);
  };

  const onSubmit = async (newFormValues?: any[]) => {
    let variantList = newFormValues ? newFormValues : formValues;
    let realVariations = variantList?.map((item: any) => {
      return {
        image: item.image,
        variant: item.variant.trim(),
        id: item.id,
        stock: item.stock,
        price: removeFormattedNumerComma(item.price),
        sales:
          Number(removeFormattedNumerComma(item.sales)) === 0
            ? null
            : Number(removeFormattedNumerComma(item.sales)),
        cost: removeFormattedNumerComma(item.cost),
      };
    });
    let removeEmptyVariations = realVariations?.map((item: any) =>
      getObjWithValidValues(item)
    );

    const payload = {
      ...product,
      tags:
        product?.tags && product?.tags?.length
          ? product?.tags?.map((item: any) => item.tag)
          : null,
      variations: removeEmptyVariations,
    };
    try {
      let result = await editProduct({
        body: getObjWithValidValues(payload),
        id: product?.id,
      });
      if ("data" in result) {
        showToast("Edited Successfuly", "success");
        setOpenBulkActionModal(false);
        setInputVal("");
        setIdToDelete(null);
        setOpenDeleteVariantModal(false);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const updateTableKeys = (key: string) => {
    if (tableKeys.includes(key)) {
      setTableKeys((prev) => prev.filter((item) => item !== key));
    } else {
      setTableKeys((prev) => [...prev, key]);
    }
  };

  // editing variations

  const removeVariation = (i: number | null) => {
    if (i !== null) {
      let newFormValues = [...formValues];
      let filtered = newFormValues.filter((item) => item.id !== i);
      onSubmit(filtered);
    }
  };

  const handleChange = (name: string, index: number, value: any) => {
    let newFormValues: Array<any> = [...formValues];
    newFormValues[index][name] = value;
    setFormValues([...newFormValues]);
  };
  const handleBulkActionButton = (title: string, action: string) => {
    setTitle(title);
    setActionType(action);
    setOpenBulkActionModal(true);
  };

  const handleBulkAction = async (val: number | string) => {
    if (actionType === "price") {
      formValues.forEach((item: any, i) => {
        if (selected.includes(item.id)) {
          handleChange("price", i, val);
        }
      });
      onSubmit();
    }
    if (actionType === "cost") {
      formValues.forEach((item: any, i) => {
        if (selected.includes(item.id)) {
          handleChange("cost", i, val);
        }
      });
      onSubmit();
    }
    if (actionType === "discount") {
      formValues.forEach((item: any, i) => {
        if (selected.includes(item.id)) {
          handleChange("sales", i, val);
        }
      });
      onSubmit();
    }
  };
  useEffect(() => {
    if (product?.variations?.length) {
      const prepareVariations = product?.variations?.map((item: any) => {
        return {
          stock: item.quantity,
          price: formatNumberWithCommas(
            parseFloat(String(item.price)?.replace(/,/g, ""))
          ),
          sales: item.sales
            ? formatNumberWithCommas(
                parseFloat(String(item.sales)?.replace(/,/g, ""))
              )
            : null,
          cost: item.cost
            ? formatNumberWithCommas(
                parseFloat(String(item.cost)?.replace(/,/g, ""))
              )
            : null,
          image: item.image ? item.image : "",
          variant: item.variant,
          id: item.id,
          discounts: item.discounts,
          has_discount: item.has_discount,
          quantityPassed: true,
        };
      });
      setFormValues(prepareVariations);
    } else {
      setFormValues([]);
    }
  }, [product]);

  return (
    <div className="pd_product_with_variaitions">
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
                  <div className="available_Section">
                    <h2>Quantity</h2>
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
              </div>
            </>
          )}
        </div>

        <div className="variant_section section bottom_detail_box">
          <FormSectionHeader
            title="Product Variations"
            otherElement={
              <DropDownWrapper
                origin={"right"}
                className="navbar_dropdown"
                action={
                  <Button endIcon={<ChevronDownIcon stroke="#009444" />}>
                    Show /hide
                  </Button>
                }
              >
                <div className="cover_buttons">
                  <ul className="select_list btn_list">
                    {headCellsToHide?.map((item) => (
                      <li className="scan_btns">
                        <Button
                          onClick={() => {
                            updateTableKeys(item.key);
                          }}
                          startIcon={
                            tableKeys.includes(item.key) ? (
                              <EyeOffIcon />
                            ) : (
                              <EyeIcon />
                            )
                          }
                        >
                          {tableKeys.includes(item.key) ? "Hide " : "Show "}
                          {item.label}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </DropDownWrapper>
            }
          />
          <div className="table_container">
            {selected?.length && canManageProducts ? (
              <div className="table_action_container">
                <p>Bulk Edit Action :</p>

                <Button
                  className="icon_action_button"
                  onClick={() => {
                    if (selected?.length) {
                      handleBulkActionButton("Input Price", "price");
                    } else {
                      showToast("Please select variations", "error");
                    }
                  }}
                >
                  Edit Price
                </Button>
                <Button
                  className="icon_action_button"
                  onClick={() => {
                    if (selected?.length) {
                      handleBulkActionButton("Input Cost", "cost");
                    } else {
                      showToast("Please select variations", "error");
                    }
                  }}
                >
                  Edit Cost
                </Button>

                <Button
                  className="icon_action_button"
                  onClick={() => {
                    if (selected?.length) {
                      handleBulkActionButton("Input Discount", "discount");
                    } else {
                      showToast("Please select variations", "error");
                    }
                  }}
                >
                  Edit Discounted Price
                </Button>
              </div>
            ) : (
              ""
            )}

            <TableComponent
              isLoading={isLoading}
              headCells={headCell.filter((item) =>
                tableKeys.includes(item.key)
              )}
              extraTableClass={
                tableKeys.includes("sales") ||
                tableKeys.includes("barcode") ||
                tableKeys.includes("cost")
                  ? "enlarge"
                  : ""
              }
              showPagination={false}
              handleClick={(row: any) => {
                navigate(
                  `/dashboard/products/variant/${row.id}?count=${cumulativeRowIndex}`
                );
              }}
              selectMultiple={true}
              selected={selected}
              setSelected={setSelected}
              tableData={product?.variations?.map((row: any, i: number) => ({
                image: (
                  <img
                    src={row.image ? `${IMAGEURL}${row.image}` : alt_image_url}
                    width={40}
                    height={40}
                    style={{
                      borderRadius: "4px",
                    }}
                    alt="product"
                  />
                ),
                variant: (
                  <p className="variant_name flex items-center gap-1">
                    {row.variant}
                    {row?.reserved_quantity ? <ReservedIcon /> : ""}
                  </p>
                ),
                quantity: formatNumber(row.quantity),
                price: `${formatPrice(row.price)}`,
                cost: Number(row.cost) === 0 ? "-" : `${formatPrice(row.cost)}`,
                sales: row.has_discount ? `${formatPrice(row.sales)}` : "-",
                barcode: row.barcode,
                minmax: `${row?.minimum_order_quantity || "∞"} - ${
                  row?.maximum_order_quantity || "∞"
                }`,
                weight_kg: `${row?.weight_kg}kg`,
                action: (
                  <div className="flex gap-[28px] justify-end action z-10 ">
                    {canManageProducts && (
                      <IconButton
                        onClick={(e) => {
                          setIdToDelete(row.id);
                          setOpenDeleteVariantModal(true);
                          e.stopPropagation();
                        }}
                        type="button"
                        className="icon_button_container trash z-10"
                      >
                        <TrashIcon stroke="#D90429" />{" "}
                      </IconButton>
                    )}
                    <IconButton type="button">
                      <ChevronRight />{" "}
                    </IconButton>
                  </div>
                ),
                id: row.id,
              }))}
            />
          </div>
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

                <div className="cover_image_and_description">
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
                      <div className="image_grid flex_image">
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
                    ""
                  )}
                </div>

                <div className="px-[16px]">
                  <div className="single_detail">
                    <p className="light_text">Price</p>
                    <h4 className="bold_text">
                      {product?.variations?.length
                        ? getVariationPrice(product?.variations)
                        : `${formatPrice(product?.price)}`}
                    </h4>
                  </div>
                  <div className="single_detail">
                    <p className="light_text">Cost Price</p>

                    <h4 className="bold_text">
                      {product?.variations?.length
                        ? getVariationCostPrice(product?.variations)
                        : Number(product?.cost) === 0
                        ? "-"
                        : `${formatPrice(product?.cost)}`}
                    </h4>
                  </div>
                  {product?.has_discount && (
                    <div className="single_detail">
                      <p className="light_text">Discounted Price</p>
                      <h4 className="bold_text">
                        {product?.variations?.length
                          ? getVariationDiscountPrice(product?.variations)
                          : formatPrice(Number(product?.sales))}
                      </h4>
                    </div>
                  )}
                  <div className="single_detail">
                    <p className="light_text">Weight</p>
                    <h4 className="bold_text">{`${getVariationWeight(
                      product?.variations
                    )}kg`}</h4>
                  </div>
                  <div className="single_detail">
                    <p className="light_text">Date Added</p>
                    <h4 className="bold_text">{product?.formattedCreatedAt}</h4>
                  </div>
                  <div className="single_detail">
                    <p className="light_text">Stock Quantity</p>
                    <h4 className="bold_text">
                      {formatNumber(product?.quantity || 0)}
                    </h4>
                  </div>
                  <div className="single_detail">
                    <p className="light_text">Unit</p>
                    <h4 className="bold_text">{product?.unit}</h4>
                  </div>
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
                  <div className="single_detail">
                    <p className="light_text">Product Status</p>
                    <Chip
                      color={translateStatus(product?.status)?.color}
                      label={translateStatus(product?.status)?.label}
                    />
                  </div>
                  <div className="single_detail">
                    <p className="light_text">Product Variations</p>
                    <h4 className="bold_text">
                      {product?.variations?.length}
                    </h4>{" "}
                  </div>
                  <div className="single_detail">
                    <p className="light_text">Product Location</p>
                    <h4 className="bold_text">{userLocation?.name}</h4>{" "}
                  </div>
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

      <AddOrRemoveVariationsModal
        openModal={openUpdateVariationsModal}
        type={actionType}
        variations={product ? product?.variations : []}
        closeModal={() => {
          setOpenUpdateVariationsModal(false);
        }}
      />
      <BulkEditVariationModal
        openModal={openBulkActionModal}
        inputVal={inputVal}
        setInputVal={setInputVal}
        closeModal={() => {
          setOpenBulkActionModal(false);
        }}
        title={title}
        actionFnc={(val: number | string, cb?: () => void) => {
          handleBulkAction(val);
        }}
        isLoading={editLoad}
      />
      <MessageModal
        openModal={openDeleteVariantModal}
        closeModal={() => {
          setOpenDeleteVariantModal(false);
        }}
        icon={<TrashIcon />}
        btnChild={
          <Button
            onClick={() => {
              removeVariation(idToDelete);
            }}
            className="error"
          >
            {editLoad ? (
              <CircularProgress size="1.2rem" sx={{ color: "#ffffff" }} />
            ) : (
              " Yes, delete"
            )}
          </Button>
        }
        description="Are you sure you want to delete"
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
    </div>
  );
};

export default ProductWithVariations;
