import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, IconButton } from "@mui/material";
import { Button } from "@mui/material";
import productImg from "assets/images/products.png";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { EditIcon } from "assets/Icons/EditIcon";
import { RefrshIcon } from "assets/Icons/RefreshIcon";
import TableComponent from "components/table";
import MessageModal from "components/Modal/MessageModal";
import EmptyResponse from "components/EmptyResponse";
import InputField from "components/forms/InputField";
import { PermissionsType } from "Models";
import { useDeleteCollectionMutation, useGetCollectionsQuery } from "services";
import { showToast } from "store/store.hooks";
import { handleError, truncateString } from "utils";
import { selectPermissions } from "store/slice/AuthSlice";
import { useAppSelector } from "store/store.hooks";

const headCell = [
  {
    key: "collection",
    name: "Collection",
  },
  {
    key: "description",
    name: "Description",
  },
  {
    key: "products",
    name: "Products",
  },

  {
    key: "action",
    name: "",
  },
];
const filterList = ["All"];

export const CollectionTable = () => {
  const [selected, setSelected] = useState<string[] | number[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [idTobeDeleted, setIdTobeDeleted] = useState("");
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const { data, isLoading, isFetching, isError, refetch } =
    useGetCollectionsQuery({
      search: search,
    });
  const userPermission: PermissionsType = useAppSelector(selectPermissions);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const canManageProducts = isStaff ? userPermission?.products?.manage : true;
  const [deleteCollection, { isLoading: loadDelete }] =
    useDeleteCollectionMutation();
  const deleteCollectionFnc = async (id: string, callback?: () => void) => {
    try {
      let result = await deleteCollection(id);
      if ("data" in result) {
        if (callback) {
          showToast("Deleted successfully", "success");
        }
        callback && callback();
        setIdTobeDeleted("");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const deleteInBulk = async () => {
    try {
      setIsDeleteLoading(true);
      const productRequests = selected?.map((id) => {
        return deleteCollectionFnc(`${id}`);
      });

      const responses = await Promise.all(productRequests);
      if (responses?.length) {
        setSelected([]);
        showToast("Collections successfully deleted", "success");
        setOpenDeleteModal(false);
      }
    } catch (error) {
      showToast(
        "Failed to delete one or more collection(s). Please try again.",
        "error"
      );
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const bulkDelete = () => {
    deleteInBulk();
  };

  useEffect(() => {
    if (userPermission !== undefined) {
      setIsStaff(true);
    } else {
      setIsStaff(false);
    }
  }, [userPermission]);

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
                deleteCollectionFnc(idTobeDeleted, () => {
                  setOpenDeleteModal(false);
                });
              } else {
                bulkDelete();
              }
            }}
            className="error"
          >
            {loadDelete ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Yes, delete"
            )}
          </Button>
        }
        description="Are you sure you want to delete selected collections?"
      />
      {data && data?.tags?.length === 0 && !search ? (
        canManageProducts && (
          <div className="empty_wrapper_for_emapty_state">
            <EmptyResponse
              message="Collections"
              image={productImg}
              extraText="Every collection created will appear here."
              btn={
                <Button
                  sx={{
                    padding: "12px 24px",
                  }}
                  variant="contained"
                  startIcon={<PlusIcon />}
                  onClick={() => {
                    navigate("create-collection");
                  }}
                >
                  Create Collection
                </Button>
              }
            />
          </div>
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
                  <IconButton
                    onClick={() => {
                      refetch();
                    }}
                    className="icon_button_container medium"
                  >
                    <RefrshIcon />
                  </IconButton>
                  {filterList.map((item, i) => (
                    <Button
                      key={i}
                      onClick={() => {
                        setFilter(item);
                      }}
                      className={`filter_button ${
                        item === filter ? "active" : ""
                      }`}
                    >
                      {item}
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
                }}
                placeholder="Search"
                suffix={<SearchIcon />}
              />
            </div>
          </div>
          <TableComponent
            isError={isError}
            isLoading={isLoading || isFetching}
            headCells={headCell}
            selectMultiple={true}
            selected={selected}
            showPagination={false}
            setSelected={setSelected}
            handleClick={(row: any) => {
              navigate(`/dashboard/products/collection/${row.id}`);
            }}
            tableData={data?.tags?.map((row) => ({
              products: row.products_count,
              collection: row.tag,
              description: truncateString(row.description, 40),
              action: (
                <div className="flex gap-[28px] justify-end">
                  {canManageProducts && (
                    <IconButton
                      onClick={(e) => {
                        navigate(
                          `/dashboard/products/edit-collection/${row.id}`
                        );
                        e.stopPropagation();
                      }}
                      type="button"
                      className="icon_button_container"
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {canManageProducts && (
                    <IconButton
                      onClick={(e) => {
                        setIdTobeDeleted(`${row.id}`);
                        setOpenDeleteModal(true);
                        e.stopPropagation();
                      }}
                      type="button"
                      className="icon_button_container"
                    >
                      <TrashIcon />
                    </IconButton>
                  )}
                </div>
              ),
              id: `${row.id}`,
            }))}
          />
        </>
      )}
    </>
  );
};
