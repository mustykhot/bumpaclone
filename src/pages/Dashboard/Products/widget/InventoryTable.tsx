import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Chip, IconButton, MenuItem, Select } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { onMessageListener } from "firebase";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { SearchIcon } from "assets/Icons/SearchIcon";
import productEmptyImg from "assets/images/products.png";
import { RefrshIcon } from "assets/Icons/RefreshIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { DownloadIcon } from "assets/Icons/DownloadIcon";
import { EditIcon } from "assets/Icons/EditIcon";
import { QrIcon } from "assets/Icons/QrIcon";
import { UpgradeModal } from "components/UpgradeModal";
import { GrowthModal } from "components/GrowthModal";
import TableComponent from "components/table";
import MessageModal from "components/Modal/MessageModal";
import EmptyResponse from "components/EmptyResponse";
import { removeFormattedNumerComma } from "components/forms/ValidatedInput";
import ErrorMsg from "components/ErrorMsg";
import { PermissionsType } from "Models";
import InputField from "components/forms/InputField";
import {
  useDeleteBulkProductMutation,
  useDeleteProductMutation,
  useGetCollectionsQuery,
  useGetSingleInventorySettingQuery,
  useGetLoggedInUserQuery,
  useGetProductQuery,
  useSetAppFlagMutation,
} from "services";
import { formatPrice, handleError, translateStatus } from "utils";
import {
  showToast,
  showVideoModal,
  useAppDispatch,
  useAppSelector,
} from "store/store.hooks";
import { addToBulkProduct } from "store/slice/BulkProductSlice";
import { API_URL } from "utils/constants/general";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
  selectPermissions,
  selectToken,
} from "store/slice/AuthSlice";
import { selectUserLocation } from "store/slice/AuthSlice";
import { SelectProductModal } from "./SelectProductModal";
import { PRODUCTROUTES } from "utils/constants/apiroutes";

import {
  addProductFilter,
  selectProductFilters,
} from "store/slice/FilterSlice";
import PageUpdateModal from "components/PageUpdateModal";
import { ReservedIcon } from "assets/Icons/ReservedIcon";

const headCell = [
  {
    key: "imagePath",
    name: "",
  },
  {
    key: "productName",
    name: "Product",
  },

  {
    key: "collectionName",
    name: "Collection",
  },
  {
    key: "variationsList",
    name: "Variations",
  },
  {
    key: "in_stock",
    name: "In Stock",
  },
  {
    key: "priceAmount",
    name: "Price",
  },
  {
    key: "statusName",
    name: "Status",
  },

  {
    key: "action",
    name: "",
  },
];
const filterList = [
  { name: "Unpublished", value: "0" },
  { name: "Published", value: "1" },
];

export const getVariationPrice = (variations: any) => {
  const variationNumList = variations.map((item: any) =>
    Number(removeFormattedNumerComma(item.price || 0))
  );
  const min = Math.min(...variationNumList);
  const max = Math.max(...variationNumList);
  if (min === max) {
    return `${formatPrice(min)}`;
  } else {
    return `${formatPrice(min)} - ${formatPrice(max)}`;
  }
};
export const comparePriceMinAndMAx = (
  price1: string | number,
  price2: string | number
) => {
  if (Number(price1) === Number(price2)) {
    return `${formatPrice(Number(price1))}`;
  } else {
    return `${formatPrice(Number(price2))} - ${formatPrice(Number(price1))}`;
  }
};
export const getVariationPriceWithNoFormat = (variations: any) => {
  const variationNumList = variations.map((item: any) =>
    Number(removeFormattedNumerComma(item.price || 0))
  );
  const min = Math.min(...variationNumList);
  const max = Math.max(...variationNumList);
  if (min === max) {
    return `${min}`;
  } else {
    return `${min} - ${max}`;
  }
};
export const getVariationWeight = (variations: any) => {
  const variationNumList = variations.map((item: any) =>
    Number(removeFormattedNumerComma(item.weight_kg || 0))
  );
  const min = Math.min(...variationNumList);
  const max = Math.max(...variationNumList);
  if (min === max) {
    return `${min}`;
  } else {
    return `${min} - ${max}`;
  }
};
export const getVariationDiscountPrice = (variations: any) => {
  const variationNumList = variations.map((item: any) =>
    Number(removeFormattedNumerComma(item?.sales || 0))
  );
  const min = Math.min(...variationNumList);
  const max = Math.max(...variationNumList);
  if (min === max) {
    return `${formatPrice(min)}`;
  } else {
    return `${formatPrice(min)} - ${formatPrice(max)}`;
  }
};
export const getVariationCostPrice = (variations: any) => {
  const variationNumList = variations.map((item: any) =>
    Number(removeFormattedNumerComma(item.cost || 0))
  );
  const min = Math.min(...variationNumList);
  const max = Math.max(...variationNumList);
  if (min === max) {
    return `${min === 0 ? "-" : formatPrice(min)}`;
  } else {
    return `${formatPrice(min)} - ${formatPrice(max)}`;
  }
};
type PropType = {
  refetchAnalytics: any;
};
export const InventoryTable = ({ refetchAnalytics }: PropType) => {
  const location = useLocation();
  const [stockList, setStockList] = useState([
    { key: "Low Stock", value: "3" },
    { key: "Out Of Stock", value: "0" },
  ]);
  const searchParams = new URLSearchParams(location.search);
  const [idTobeDeleted, setIdTobeDeleted] = useState("");
  const [selected, setSelected] = useState<string[] | number[]>([]);
  const [selectSingle, setSelectSingle] = useState<any[]>([]);
  const [selectBulk, setSelectBulk] = useState<any[]>([]);
  const [selectBulkFromApis, setSelectBulkFromApis] = useState<any[]>([]);
  const [dataCount, setDataCount] = useState("25");
  const userLocation = useAppSelector(selectUserLocation);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openPrintBarcode, setOpenPrintBarcode] = useState(false);
  const location_id = searchParams.get("location_id");
  const productFilters = useAppSelector(selectProductFilters);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const { data: userData } = useGetLoggedInUserQuery();
  const [setAppFlag, { isLoading: loadFlag }] = useSetAppFlagMutation();
  // table Actions
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data, isLoading, isFetching, isError, refetch } = useGetProductQuery({
    limit: Number(dataCount),
    page: productFilters?.page || 1,
    search: productFilters?.search,
    status: productFilters?.status,
    collection: productFilters?.collection,
    location_id: Number(location_id || userLocation?.id),
    variations: false,
    min_stock: productFilters?.min_stock,
    max_stock: productFilters?.max_stock,
  });
  const { data: settingsData } = useGetSingleInventorySettingQuery("low_stock");
  const { data: collectionList } = useGetCollectionsQuery({});
  const userPermission: PermissionsType = useAppSelector(selectPermissions);
  const token = useAppSelector(selectToken);
  const [isStaff, setIsStaff] = useState(false);
  const canManageProducts = isStaff ? userPermission?.products?.manage : true;
  const [load, setLoad] = useState(false);
  const [loadPrint, setLoadPrint] = useState(false);
  const [deleteProduct, { isLoading: loadDelete }] = useDeleteProductMutation();
  const [deleteBulkProduct, { isLoading: loadBulkDelete }] =
    useDeleteBulkProductMutation();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const [isBarcodeUpgrade, setIsBarcodeUpgrade] = useState(false);
  const [openGrowthModal, setOpenGrowthModal] = useState(false);
  const [stockFilter, setStockFilter] = useState("");

  const deleteProductFnc = async (id: string, callback?: () => void) => {
    try {
      let result = await deleteProduct(id);
      if ("data" in result) {
        if (callback) {
          showToast("Deleted successfully", "success");
        }
        setIdTobeDeleted("");

        callback && callback();
      } else {
        handleError(result);
        setIdTobeDeleted("");
      }
    } catch (error) {
      handleError(error);
      setIdTobeDeleted("");
    }
  };

  const bulkDelete = async () => {
    try {
      const productIds = selected?.map((id) => {
        return `${id}`;
      });
      let result = await deleteBulkProduct(productIds);
      if ("data" in result) {
        showToast("Deleted successfully", "success");
        setIdTobeDeleted("");
        setSelected([]);
        setOpenDeleteModal(false);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
      setIdTobeDeleted("");
    }
  };
  const updateAppFlag = async () => {
    let payload = {
      ...userData?.app_flags,
      webapp_updates: {
        ...userData?.app_flags?.webapp_updates,
        product_page: {
          version: 2,
          status: true,
        },
      },
    };
    try {
      let result = await setAppFlag(payload);
      if ("data" in result) {
        setOpenUpdateModal(false);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
    setOpenUpdateModal(false);
  };

  const resetAllFilters = () => {
    setStockFilter("");
    dispatch(
      addProductFilter({
        search: "",
        status: "",
        min_stock: "",
        max_stock: "",
        collection: "",
      })
    );
  };

  const bulkEditFnc = async () => {
    setLoad(true);
    try {
      const response = await fetch(
        `${API_URL}v2/${PRODUCTROUTES.PRODUCT}?ids=${selectBulk
          ?.map((item: any) => item.id)
          ?.join(",")}&limit=${selected.length}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        setLoad(false);
        dispatch(addToBulkProduct(data?.products?.data));
        navigate(`bulk-edit`);
      }
    } catch (error: any) {
      setLoad(false);
      showToast("Something went wrong", "error");
      throw error;
    }
  };

  const bulkPrintFnc = async () => {
    setLoadPrint(true);
    try {
      const response = await fetch(
        `${API_URL}v2/${PRODUCTROUTES.PRODUCT}?ids=${selectBulk
          ?.map((item: any) => item.id)
          ?.join(",")}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        setLoadPrint(false);
        setSelectBulkFromApis(data?.products?.data);
        setOpenPrintBarcode(true);
      }
    } catch (error: any) {
      setLoadPrint(false);
      showToast("Something went wrong", "error");
      throw error;
    }
  };

  const handleBulkEdit = () => {
    if (selectBulk.length) {
      bulkEditFnc();
    }
  };

  const handleBulkPrint = () => {
    if (
      isSubscriptionExpired ||
      (isSubscriptionType !== "growth" && isSubscriptionType !== "trial")
    ) {
      setIsBarcodeUpgrade(true);
      setOpenGrowthModal(true);
    } else {
      bulkPrintFnc();
    }
  };

  const handleOpenDeleteModal = (id: string, rowIndex: number) => {
    const cumulativeRowIndex =
      (productFilters?.page - 1) * parseInt(dataCount, 10) + rowIndex + 1;
    setIdTobeDeleted(id);
    setOpenDeleteModal(true);
    return;
  };

  const handleClick = (row: any, rowIndex: number) => {
    const cumulativeRowIndex =
      (productFilters?.page - 1) * parseInt(dataCount, 10) + rowIndex + 1;
    const { id } = row;
    navigate(`${id}/?count=${cumulativeRowIndex}`);
  };

  const handleOpenEditModal = (id: string, rowIndex: number) => {
    const cumulativeRowIndex =
      (productFilters?.page - 1) * parseInt(dataCount, 10) + rowIndex + 1;

    navigate(`edit/${id}/?count=${cumulativeRowIndex}`);
  };

  onMessageListener()
    .then((payload: any) => {
      setSelectBulk([]);
      setSelected([]);
      refetch();
    })
    .catch((err) => console.log("failed"));

  useEffect(() => {
    if (userPermission !== undefined) {
      setIsStaff(true);
    } else {
      setIsStaff(false);
    }
  }, [userPermission]);

  useEffect(() => {
    if (userData) {
      if (userData?.app_flags?.webapp_updates?.product_page?.version === 2) {
        if (userData?.app_flags?.webapp_updates?.product_page?.status) {
          setOpenUpdateModal(false);
        } else {
          setOpenUpdateModal(true);
        }
      } else {
        setOpenUpdateModal(true);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (settingsData) {
      setStockList([
        {
          key: "Low Stock",
          value:
            settingsData.inventory_setting.value ||
            settingsData.inventory_setting.default_value,
        },
        { key: "Out Of Stock", value: "0" },
      ]);
    }
  }, [settingsData]);

  useEffect(() => {
    setSelectBulk([]);
    setSelected([]);
  }, [userLocation?.id]);

  return (
    <>
      <MessageModal
        openModal={openDeleteModal}
        closeModal={() => {
          setOpenDeleteModal(false);
        }}
        icon={<TrashIcon />}
        btnChild={
          <Button
            onClick={() => {
              if (idTobeDeleted) {
                deleteProductFnc(idTobeDeleted, () => {
                  setSelectBulk([]);
                  setSelected([]);
                  setOpenDeleteModal(false);
                });
              } else {
                bulkDelete();
              }
            }}
            disabled={loadDelete || isDeleteLoading || loadBulkDelete}
            className="error"
          >
            {loadDelete || loadBulkDelete || isDeleteLoading ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Yes, delete"
            )}
          </Button>
        }
        description="Are you sure you want to delete selected products? This action is irreversible"
      />
      <SelectProductModal
        defaultSelectedProductList={selectBulkFromApis}
        setSelectBulk={setSelectBulk}
        setSelected={setSelected}
        setSelectBulkFromApis={setSelectBulkFromApis}
        openModal={openPrintBarcode}
        closeModal={() => {
          setOpenPrintBarcode(false);
        }}
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
          eventName="activate-barcode"
        />
      )}

      {data &&
      data?.products.data.length === 0 &&
      !isFetching &&
      !productFilters?.search &&
      !productFilters?.collection &&
      !productFilters?.min_stock &&
      !productFilters?.max_stock &&
      !productFilters?.status &&
      !isLoading ? (
        canManageProducts ? (
          <div className="empty_wrapper_for_emapty_state">
            <EmptyResponse
              message="Add new products to your store"
              image={productEmptyImg}
              extraText="You can add new products "
              btn={
                <div className="empty_btn_box">
                  <Button
                    variant="outlined"
                    component={Link}
                    to="import"
                    startIcon={<DownloadIcon />}
                  >
                    Import Products
                  </Button>
                  <Button
                    className="primary_styled_button"
                    variant="contained"
                    startIcon={<PlusIcon />}
                    onClick={() => {
                      navigate("create");
                    }}
                  >
                    Add new product
                  </Button>
                </div>
              }
            />
          </div>
        ) : (
          <ErrorMsg error={"Unauthorized access"} />
        )
      ) : (
        <>
          <div className="table_action_container">
            <div className="left_section">
              {selected.length ? (
                canManageProducts && (
                  <div className="show_selected_actions">
                    <p>Selected: {selected.length}</p>
                    <Button
                      onClick={() => setOpenDeleteModal(true)}
                      startIcon={loadDelete ? "" : <TrashIcon />}
                    >
                      {loadDelete || loadBulkDelete ? (
                        <CircularProgress size="1.5rem" sx={{}} />
                      ) : (
                        "Delete"
                      )}
                    </Button>

                    <Button onClick={handleBulkEdit} startIcon={<EditIcon />}>
                      {load ? (
                        <CircularProgress
                          size="1.5rem"
                          sx={{ color: "#5c636d" }}
                        />
                      ) : (
                        "Bulk edit selected products"
                      )}
                    </Button>
                    <Button onClick={handleBulkPrint} startIcon={<QrIcon />}>
                      {loadPrint ? (
                        <CircularProgress
                          size="1.5rem"
                          sx={{ color: "#5c636d" }}
                        />
                      ) : (
                        "Print Barcode"
                      )}
                    </Button>
                  </div>
                )
              ) : (
                <div className="filter_container">
                  <IconButton
                    onClick={() => {
                      refetch();
                      refetchAnalytics();
                    }}
                    className="icon_button_container medium"
                  >
                    <RefrshIcon />
                  </IconButton>
                  <Button
                    onClick={() => {
                      resetAllFilters();
                    }}
                    className={`filter_button `}
                  >
                    Clear Filters
                  </Button>

                  <Select
                    displayEmpty
                    value={productFilters?.status}
                    onChange={(e) => {
                      dispatch(
                        addProductFilter({
                          status: e.target.value,
                          page: 1,
                        })
                      );
                    }}
                    className="my-select dark small"
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem disabled value="">
                      Status
                    </MenuItem>
                    {filterList?.map((item: any) => (
                      <MenuItem key={item.key} value={item.value}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>

                  <Select
                    displayEmpty
                    value={productFilters?.max_stock}
                    onChange={(e) => {
                      dispatch(
                        addProductFilter({
                          max_stock: e.target.value,
                          page: 1,
                        })
                      );
                    }}
                    className="my-select dark small"
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem disabled value="">
                      Stock
                    </MenuItem>
                    {stockList?.map((item: any) => (
                      <MenuItem key={item.key} value={item.value}>
                        {item.key}
                      </MenuItem>
                    ))}
                  </Select>

                  <Select
                    displayEmpty
                    value={productFilters?.collection}
                    onChange={(e) => {
                      dispatch(
                        addProductFilter({
                          collection: e.target.value,
                          page: 1,
                        })
                      );
                    }}
                    className="my-select dark large"
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem disabled value="">
                      Filter by collection
                    </MenuItem>
                    {collectionList?.tags?.map((item: any) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.tag}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              )}
            </div>

            <div className="search_container">
              <InputField
                type={"text"}
                containerClass="search_field"
                value={productFilters?.search}
                onChange={(e: any) => {
                  dispatch(
                    addProductFilter({
                      search: e.target.value,
                      page: 1,
                    })
                  );
                }}
                placeholder="Search"
                suffix={<SearchIcon />}
              />
            </div>
          </div>
          <TableComponent
            isError={isError}
            page={productFilters?.page}
            setPage={(val) => {
              dispatch(
                addProductFilter({
                  page: val,
                })
              );
            }}
            isLoading={isLoading || isFetching}
            headCells={headCell}
            selectMultiple={true}
            selected={selected}
            showPagination={true}
            dataCount={dataCount}
            setDataCount={setDataCount}
            setSelected={setSelected}
            selectBulk={selectBulk}
            setSelectSingle={setSelectSingle}
            setSelectBulk={setSelectBulk}
            handleClick={handleClick}
            meta={{
              current: data?.products.current_page,
              perPage: 10,
              totalPage: data?.products.last_page,
            }}
            tableData={data?.products.data.map((row: any, i: number) => ({
              ...row,
              imagePath: (
                <img
                  src={`${row.alt_image_url}`}
                  alt="product"
                  className="image_item"
                  width={40}
                  height={40}
                />
              ),
              productName: (
                <div className="flex gap-1 items-center">
                  {row.title} {row?.reserved_quantity ? <ReservedIcon /> : ""}
                </div>
              ),
              collectionName: row?.tags.length,
              variationsList: row.variationCount,
              in_stock: row.quantity,
              priceAmount:
                row.variationCount > 0
                  ? comparePriceMinAndMAx(
                      row.max_selling_price,
                      row.min_selling_price
                    )
                  : `${formatPrice(row.price)}`,
              statusName: (
                <Chip
                  color={translateStatus(row.status)?.color}
                  label={translateStatus(row.status)?.label}
                />
              ),
              action: (
                <div className="flex gap-[28px] justify-end action z-10 ">
                  {canManageProducts && (
                    <IconButton
                      onClick={(e) => {
                        handleOpenEditModal(row.id, i);
                        e.stopPropagation();
                      }}
                      type="button"
                      className="icon_button_container z-10 trash"
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {canManageProducts && (
                    <IconButton
                      onClick={(e) => {
                        handleOpenDeleteModal(row.id, i);
                        e.stopPropagation();
                      }}
                      type="button"
                      className="icon_button_container z-10 trash"
                    >
                      <TrashIcon />
                    </IconButton>
                  )}
                </div>
              ),
              id: row.id,
            }))}
          />
        </>
      )}
      <PageUpdateModal
        openModal={openUpdateModal}
        isLoading={loadFlag}
        title={"Introducing Minimum Order Quantity Settings (MOQ)"}
        description={
          "We’re thrilled to roll out the Minimum and Maximum Order Quantity feature! This allows you to set exact limits on how many items a customer can purchase in a single order. Whether you’re aiming to drive higher sales through bulk or wholesale purchase this feature is for you."
        }
        size={"small"}
        closeModal={() => {
          updateAppFlag();
        }}
        btnText="Learn More"
        btnAction={() => {
          window.open(
            "https://support.getbumpa.com/support/solutions/articles/150000189091-setting-up-minimum-and-maximum-order-moq-quantity",
            "_blank"
          );
        }}
      />
    </>
  );
};
