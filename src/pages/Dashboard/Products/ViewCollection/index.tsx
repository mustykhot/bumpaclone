import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { Button, Chip, CircularProgress } from "@mui/material";
import { IconButton, Avatar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { differenceInDays } from "date-fns";

import { TrashIcon } from "assets/Icons/TrashIcon";
import { ShareIcon } from "assets/Icons/ShareIcon";
import { EditIcon } from "assets/Icons/EditIcon";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { MessageIcon } from "assets/Icons/Sidebar/MessageIcon";
import { MAil01Icon } from "assets/Icons/Mail01Icon";
import { PhoneIcon } from "assets/Icons/PhoneIcon";
import product from "assets/images/product.png";
import { EyeIcon } from "assets/Icons/EyeIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";

import InputField from "components/forms/InputField";
import TableComponent from "components/table";
import DisplayCustomerGroup from "components/DisplayCustomerGroup";
import ErrorMsg from "components/ErrorMsg";
import { AddCollectionProductModal } from "./addCollectionProductModal";
import { comparePriceMinAndMAx } from "../widget/InventoryTable";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import Loader from "components/Loader";
import MessageModal from "components/Modal/MessageModal";

import {
  useDeleteCollectionMutation,
  useDeleteCustomerMutation,
  useDeleteProductFromCollectionMutation,
  useGetProductQuery,
  useGetSingleCollectionQuery,
  useGetSingleCustomerQuery,
} from "services";
import { formatPrice, handleError, translateStatus } from "utils";
import { showToast } from "store/store.hooks";

import { IMAGEURL, convertAddress } from "utils/constants/general";
import { selectPermissions } from "store/slice/AuthSlice";
import { useAppSelector } from "store/store.hooks";
import { selectUserLocation } from "store/slice/AuthSlice";
import { useCopyToClipboardHook } from "hooks/useCopyToClipboardHook";
import { PermissionsType } from "Models";

import "./style.scss";

const headCell = [
  {
    key: "productName",
    name: "Product",
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
  { name: "All", value: "" },
  { name: "Unpublished", value: "0" },
  { name: "Published", value: "1" },
];

export const ViewCollection = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[] | number[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [dataCount, setDataCount] = useState("25");
  const [idTobeDeleted, setIdTobeDeleted] = useState("");
  const [openAddProductToCollection, setOpenAddProductToCollection] =
    useState(false);
  const [filter, setFilter] = useState({ name: "All", value: "" });
  const [deleteSelf, setDeleteSelf] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const userLocation = useAppSelector(selectUserLocation);
  const { data, isLoading, isError } = useGetSingleCollectionQuery(id);
  const { isCopied, handleCopyClick } = useCopyToClipboardHook(
    data ? `${data.collection.url}?location=${userLocation?.id}` : ""
  );
  const {
    data: productList,
    isLoading: loadProduct,
    isError: errorProduct,
  } = useGetProductQuery({
    limit: Number(dataCount),
    page: page,
    search: search,
    status: filter.value,
    collection: `${id}`,
    location_id: userLocation?.id,
  });

  const userPermission: PermissionsType = useAppSelector(selectPermissions);

  const [isStaff, setIsStaff] = useState(false);
  const canManageProducts = isStaff ? userPermission?.products?.manage : true;

  const [deleteProduct, { isLoading: loadDeleteProduct }] =
    useDeleteProductFromCollectionMutation();
  const deleteProductFnc = async (body: string[], callback?: () => void) => {
    try {
      let result = await deleteProduct({ body: { products: body }, id });
      if ("data" in result) {
        showToast("Deleted successfully", "success");
        setIdTobeDeleted("");
        callback && callback();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const [deleteCollection, { isLoading: loadDelete }] =
    useDeleteCollectionMutation();
  const deleteCollectionFnc = async () => {
    try {
      let result = await deleteCollection(id);
      if ("data" in result) {
        showToast("Deleted successfully", "success");
        setDeleteSelf(false);
        navigate(-1);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const bulkDelete = () => {
    deleteProductFnc(
      selected.map((item) => `${item}`),
      () => {
        setOpenDeleteModal(false);
        setSelected([]);
      }
    );
  };

  useEffect(() => {
    if (userPermission !== undefined) {
      setIsStaff(true);
    } else {
      setIsStaff(false);
    }
  }, [userPermission]);

  if (isError) {
    return <ErrorMsg error={"Something went wrong"} />;
  }
  if (isLoading) {
    return <Loader />;
  }

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
              if (deleteSelf) {
                deleteCollectionFnc();
              } else {
                if (idTobeDeleted) {
                  deleteProductFnc([`${idTobeDeleted}`], () => {
                    setOpenDeleteModal(false);
                  });
                } else {
                  bulkDelete();
                }
              }
            }}
            className="error"
          >
            {loadDeleteProduct || loadDelete ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Yes, delete"
            )}
          </Button>
        }
        description="Are you sure you want to remove product?"
      />

      {data && (
        <div className="pd_customer_profile pd_view_collection">
          <ModalHeader
            text="Collection"
            button={
              canManageProducts && (
                <div className="action_buttons">
                  <Button
                    onClick={() => {
                      handleCopyClick();
                    }}
                    startIcon={<ShareIcon />}
                    className="grey_btn"
                  >
                    {isCopied ? "Link Copied" : "Copy Link"}
                  </Button>{" "}
                  <Button
                    variant="outlined"
                    startIcon={<PlusIcon stroke={"#009444"} />}
                    className="edit"
                    onClick={() => {
                      setOpenAddProductToCollection(true);
                    }}
                  >
                    Add Product
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PlusIcon stroke={"#009444"} />}
                    className="edit"
                    onClick={() => {
                      navigate(`/dashboard/products/edit-collection/${id}`);
                    }}
                  >
                    Edit Collection
                  </Button>
                  <IconButton
                    onClick={() => {
                      setDeleteSelf(true);
                      setOpenDeleteModal(true);
                    }}
                    type="button"
                    className="icon_button_container"
                  >
                    <TrashIcon />
                  </IconButton>
                </div>
              )
            }
          />

          <div className="customer_profile_container">
            <div className="left_section">
              <div className="basic_information section">
                <div className="avatar_container">
                  <Avatar
                    src={
                      data.collection.image_path
                        ? `${IMAGEURL}${data.collection.image_path}`
                        : ""
                    }
                    className="avatar"
                  />
                  <div className="name_section">
                    <p className="name">{data.collection.tag}</p>
                  </div>
                </div>
                {data.collection.description && (
                  <div className="description">
                    <h3 className="title">Collection Description:</h3>
                    <p className="story">{data.collection.description}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="right_section">
              <div className="contact_section section">
                <p className="title">Collection Information</p>
                <div className="p-[24px] pt-[18px]">
                  <div className="single_collection_information large">
                    <p className="faint">Date Created</p>
                    <p className="bold">
                      {moment(data.collection.created_at).format("ll")}
                    </p>
                  </div>
                  <div className="single_collection_information ">
                    <p className="faint">Total Products </p>
                    <p className="bold">{data.collection.products?.length}</p>
                  </div>{" "}
                  <div className="single_collection_information ">
                    <p className="faint">Published Products</p>
                    <p className="bold">
                      {data.collection.products &&
                        data.collection.products.filter(
                          (product: any) => product.published === true
                        ).length}
                    </p>
                  </div>{" "}
                  <div className="single_collection_information ">
                    <p className="faint">UnPublished Products</p>
                    <p className="bold">
                      {data.collection.products &&
                        data.collection.products.filter(
                          (product: any) => product.published === false
                        ).length}
                    </p>{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="purchase_history section">
            <div className="purchase_table">
              <h3 className="title">
                Products ({data.collection.products?.length})
              </h3>
              <div className="table_section">
                <div className="table_action_container">
                  <div className="left_section">
                    {selected.length ? (
                      canManageProducts && (
                        <div className="show_selected_actions">
                          <p>Selected: {selected.length}</p>
                          <Button
                            onClick={() => {
                              setOpenDeleteModal(true);
                            }}
                            startIcon={<TrashIcon />}
                          >
                            Delete
                          </Button>
                        </div>
                      )
                    ) : (
                      <div className="filter_container">
                        {filterList.map((item, i) => (
                          <Button
                            key={i}
                            onClick={() => {
                              setFilter(item);
                            }}
                            className={`filter_button ${
                              item.value === filter.value ? "active" : ""
                            }`}
                          >
                            {item.name}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="search_container">
                    <InputField
                      type={"text"}
                      containerClass="search_field"
                      value={search}
                      onChange={(e: any) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Search"
                      suffix={<SearchIcon />}
                    />
                  </div>
                </div>
                <TableComponent
                  isError={errorProduct}
                  page={page}
                  setPage={setPage}
                  isLoading={loadProduct}
                  headCells={headCell}
                  selectMultiple={true}
                  selected={selected}
                  showPagination={true}
                  dataCount={dataCount}
                  setDataCount={setDataCount}
                  setSelected={setSelected}
                  meta={{
                    current: productList?.products.current_page,
                    perPage: 10,
                    totalPage: productList?.products.last_page,
                  }}
                  tableData={productList?.products.data.map(
                    (row: any, i: number) => ({
                      ...row,
                      imageTag: (
                        <img
                          src={product}
                          alt="instagram"
                          width={40}
                          height={40}
                        />
                      ),
                      productName: row.title,
                      collectionName: row?.collection,
                      variationsList: row.variations.length,
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
                        <div className="flex gap-[28px] justify-end">
                          {canManageProducts && (
                            <IconButton
                              onClick={() => {
                                setIdTobeDeleted(row.id);
                                setOpenDeleteModal(true);
                              }}
                              type="button"
                              className="icon_button_container"
                            >
                              <TrashIcon />
                            </IconButton>
                          )}
                        </div>
                      ),
                      id: row.id,
                    })
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <AddCollectionProductModal
        openModal={openAddProductToCollection}
        tag={data ? data.collection.tag : ""}
        description={data ? data.collection.description : ""}
        image_path={data ? data.collection.image_path || "" : ""}
        prevIds={
          data && data.collection.products && data.collection.products.length
            ? data.collection.products.map((item) => item.id)
            : []
        }
        id={data ? `${data.collection.id}` || "" : ""}
        closeModal={() => {
          setOpenAddProductToCollection(false);
        }}
      />
    </>
  );
};
