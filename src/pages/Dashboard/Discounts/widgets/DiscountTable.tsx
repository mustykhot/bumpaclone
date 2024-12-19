import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import moment from "moment";
import { Chip, IconButton, CircularProgress } from "@mui/material";
import discount from "assets/images/discount.png";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { SearchIcon } from "assets/Icons/SearchIcon";
import InputField from "components/forms/InputField";
import TableComponent from "components/table";
import MessageModal from "components/Modal/MessageModal";
import EmptyResponse from "components/EmptyResponse";
import { CouponDetailsModal } from "./customers/CouponDetailsModal";
import { useDeleteDiscountMutation, useGetDiscountsQuery } from "services";
import { formatPrice, handleError, translateDiscountStatus } from "utils";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  addDiscountFilter,
  selectDiscountFilters,
} from "store/slice/FilterSlice";

const headCell = [
  {
    key: "date",
    name: "Date Created",
  },
  {
    key: "description",
    name: "Description",
  },
  {
    key: "type",
    name: "Discount Type",
  },
  {
    key: "discounts",
    name: "Discount",
  },

  {
    key: "products",
    name: "Products",
  },
  {
    key: "status",
    name: "Status",
  },
  {
    key: "action",
    name: "",
  },
];
const filterList = [
  { name: "Active", value: "active" },
  { name: "Inactive", value: "inactive" },
];
export const DiscountTable = () => {
  const navigate = useNavigate();
  const [dataCount, setDataCount] = useState("25");
  const discountFilters = useAppSelector(selectDiscountFilters);
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string[] | number[]>([]);
  const [openCouponDetailsModal, setOpenCouponDetailsModal] = useState(false);
  const [idTobeDeleted, setIdTobeDeleted] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteDiscount, { isLoading: loadDelete }] =
    useDeleteDiscountMutation();
  const { data, isLoading, isFetching, isError } = useGetDiscountsQuery({
    status: discountFilters?.status,
    search: discountFilters?.search,
    limit: Number(dataCount),
    page: discountFilters?.page,
    expired: discountFilters?.expired,
  });
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const deleteInBulk = async () => {
    try {
      setIsDeleteLoading(true);
      const productRequests = selected?.map((id) => {
        return deleteDiscountFnc(`${id}`);
      });

      const responses = await Promise.all(productRequests);
      if (responses?.length) {
        setSelected([]);
        showToast("Discounts successfully deleted", "success");
        setOpenDeleteModal(false);
      }
    } catch (error) {
      showToast(
        "Failed to delete one or more discount(s). Please try again.",
        "error"
      );
    } finally {
      setIsDeleteLoading(false);
    }
  };
  const deleteDiscountFnc = async (id: string, callback?: () => void) => {
    try {
      let result = await deleteDiscount(id);
      if ("data" in result) {
        if (callback) {
          showToast("Deleted successfully", "success");
          setOpenDeleteModal(false);
        }
        setIdTobeDeleted("");
        callback && callback();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };
  const bulkDelete = () => {
    deleteInBulk();
  };

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
                deleteDiscountFnc(idTobeDeleted, () => {
                  setOpenDeleteModal(false);
                });
              } else {
                bulkDelete();
              }
            }}
            className="error"
            disabled={loadDelete || isDeleteLoading}
          >
            {loadDelete || isDeleteLoading ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Yes, delete"
            )}
          </Button>
        }
        description="Are you sure you want to delete?"
      />
      <CouponDetailsModal
        openModal={openCouponDetailsModal}
        closeModal={() => {
          setOpenCouponDetailsModal(false);
        }}
      />

      {data &&
      data?.data?.length === 0 &&
      !discountFilters?.search &&
      !discountFilters?.expired &&
      !discountFilters?.status ? (
        <div className="empty_wrapper">
          <EmptyResponse
            message="Discounts"
            image={discount}
            extraText="Every discount created will appear here."
            btn={
              <Button
                sx={{
                  padding: "12px 24px",
                }}
                variant="contained"
                className="primary_styled_button"
                startIcon={<PlusIcon />}
                onClick={() => {
                  navigate("create-discount");
                }}
              >
                Create Discount{" "}
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <div className="table_action_container">
            <div className="left_section">
              {selected?.length ? (
                <div className="show_selected_actions">
                  <p>Selected: {selected?.length}</p>
                  <Button
                    onClick={() => {
                      setIdTobeDeleted("");
                      setOpenDeleteModal(true);
                    }}
                    startIcon={<TrashIcon />}
                  >
                    Delete
                  </Button>
                </div>
              ) : (
                <div className="filter_container">
                  <Button
                    onClick={() => {
                      dispatch(
                        addDiscountFilter({
                          expired: null,
                          status: "",
                          page: 1,
                          search: "",
                        })
                      );
                    }}
                    className={`filter_button`}
                  >
                    All
                  </Button>
                  {filterList.map((item, i) => (
                    <Button
                      key={i}
                      onClick={() => {
                        dispatch(
                          addDiscountFilter({
                            expired: null,
                            status: item.value,
                            page: 1,
                          })
                        );
                      }}
                      className={`filter_button ${
                        item.value === discountFilters?.status ? "active" : ""
                      }`}
                    >
                      {item.name}
                    </Button>
                  ))}
                  <Button
                    onClick={() => {
                      dispatch(
                        addDiscountFilter({
                          expired: 1,
                          status: "",
                          page: 1,
                        })
                      );
                    }}
                    className={`filter_button ${
                      discountFilters?.expired === 1 ? "active" : ""
                    }`}
                  >
                    Expired
                  </Button>
                </div>
              )}
            </div>

            <div className="search_container">
              <InputField
                type={"text"}
                containerClass="search_field"
                value={discountFilters?.search}
                onChange={(e: any) => {
                  dispatch(
                    addDiscountFilter({
                      page: 1,
                      search: e.target.value,
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
            page={discountFilters?.page}
            setPage={(val) => {
              dispatch(
                addDiscountFilter({
                  page: val,
                })
              );
            }}
            dataCount={dataCount}
            setDataCount={setDataCount}
            isLoading={isLoading || isFetching}
            headCells={headCell}
            selectMultiple={true}
            selected={selected}
            showPagination={true}
            setSelected={setSelected}
            handleClick={(row: any) => {
              navigate(`${row.id}`);
            }}
            meta={{
              current: data?.current_page,
              perPage: 10,
              totalPage: data?.last_page,
            }}
            tableData={data?.data?.map((row) => ({
              ...row,
              description: row.description,
              date: moment(row.created_at).format("DD-MM-YYYY"),
              type:
                row.type === "percentage"
                  ? "Percentage Discount"
                  : row.type === "fixed"
                  ? "Fixed discount"
                  : "Cart Discount",
              discounts:
                row.type === "percentage"
                  ? `${Math.trunc(Number(row.value))}%`
                  : row.type === "fixed"
                  ? `${formatPrice(Number(row.value))}`
                  : "Cart Discount",
              products:
                (row?.products_count ? row?.products_count : 0) +
                (row?.product_variations_count
                  ? row?.product_variations_count
                  : 0),
              status: (
                <Chip
                  color={translateDiscountStatus(row.live_status).color}
                  label={translateDiscountStatus(row.live_status).label}
                />
              ),
              action: (
                <div className="flex gap-[28px] justify-end">
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
                </div>
              ),
              id: row.id,
            }))}
          />
        </>
      )}
    </>
  );
};
