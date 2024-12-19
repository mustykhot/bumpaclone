import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chip, IconButton, CircularProgress } from "@mui/material";
import { Button } from "@mui/material";
import moment from "moment";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { SearchIcon } from "assets/Icons/SearchIcon";
import TableComponent from "components/table";
import InputField from "components/forms/InputField";
import { CouponDetailsModal } from "./customers/CouponDetailsModal";
import EmptyResponse from "components/EmptyResponse";
import MessageModal from "components/Modal/MessageModal";
import {
  useDeleteCouponMutation,
  useGetCouponsQuery,
  useGetLoggedInUserQuery,
  useSetAppFlagMutation,
} from "services";
import { PlusIcon } from "assets/Icons/PlusIcon";
import coupon from "assets/images/coupon.png";
import { formatPrice, handleError, translateDiscountStatus } from "utils";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { addCouponFilter, selectCouponFilters } from "store/slice/FilterSlice";
import PageUpdateModal from "components/PageUpdateModal";

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
    name: "Discounts",
  },

  {
    key: "products",
    name: "Products",
  },

  {
    key: "rate",
    name: "Use Rate",
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
export const CouponTable = () => {
  const navigate = useNavigate();
  const [dataCount, setDataCount] = useState("25");
  const [selected, setSelected] = useState<string[] | number[]>([]);
  const [openCouponDetailsModal, setOpenCouponDetailsModal] = useState(false);
  const couponFilters = useAppSelector(selectCouponFilters);
  const dispatch = useAppDispatch();
  const { data, isLoading, isFetching, isError } = useGetCouponsQuery({
    status: couponFilters?.status,
    search: couponFilters?.search,
    limit: Number(dataCount),
    page: couponFilters?.page,
    expired: couponFilters?.expired,
  });
  const [idTobeDeleted, setIdTobeDeleted] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteCoupon, { isLoading: loadDelete }] = useDeleteCouponMutation();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const { data: userData } = useGetLoggedInUserQuery();
  const [setAppFlag, { isLoading: loadFlag }] = useSetAppFlagMutation();
  const deleteInBulk = async () => {
    try {
      setIsDeleteLoading(true);
      const productRequests = selected?.map((id) => {
        return deleteCouponFnc(`${id}`);
      });

      const responses = await Promise.all(productRequests);
      if (responses?.length) {
        setSelected([]);
        showToast("Coupons successfully deleted", "success");
        setOpenDeleteModal(false);
      }
    } catch (error) {
      showToast(
        "Failed to delete one or more coupon(s). Please try again.",
        "error"
      );
    } finally {
      setIsDeleteLoading(false);
    }
  };
  const deleteCouponFnc = async (id: string, callback?: () => void) => {
    try {
      let result = await deleteCoupon(id);
      if ("data" in result) {
        if (callback) {
          showToast("Deleted successfully", "success");
          setOpenDeleteModal(false);
          setIdTobeDeleted("");
        }
        callback && callback();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };
  const updateAppFlag = async () => {
    let payload = {
      ...userData?.app_flags,
      webapp_updates: {
        ...userData?.app_flags?.webapp_updates,
        coupon_page: {
          version: 1,
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
  const bulkDelete = () => {
    deleteInBulk();
  };

  useEffect(() => {
    if (userData) {
      if (userData?.app_flags?.webapp_updates?.coupon_page?.version >= 1) {
        if (userData?.app_flags?.webapp_updates?.coupon_page?.status) {
          setOpenUpdateModal(false);
        } else {
          setOpenUpdateModal(true);
        }
      } else {
        setOpenUpdateModal(true);
      }
    }
  }, [userData]);

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
                deleteCouponFnc(idTobeDeleted, () => {
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
      !couponFilters?.search &&
      !couponFilters?.expired &&
      !couponFilters?.status ? (
        <div className="empty_wrapper">
          <EmptyResponse
            message="Coupons"
            image={coupon}
            extraText="Every coupon created will appear here."
            btn={
              <Button
                sx={{
                  padding: "12px 24px",
                }}
                variant="contained"
                startIcon={<PlusIcon />}
                onClick={() => {
                  navigate("create-coupon");
                }}
              >
                Create Coupon{" "}
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
                        addCouponFilter({
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
                          addCouponFilter({
                            expired: null,
                            status: item.value,
                            page: 1,
                          })
                        );
                      }}
                      className={`filter_button ${
                        item.value === couponFilters?.status ? "active" : ""
                      }`}
                    >
                      {item.name}
                    </Button>
                  ))}
                  <Button
                    onClick={() => {
                      dispatch(
                        addCouponFilter({
                          expired: 1,
                          status: "",
                          page: 1,
                        })
                      );
                    }}
                    className={`filter_button ${
                      couponFilters?.expired === 1 ? "active" : ""
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
                value={couponFilters?.search}
                onChange={(e: any) => {
                  dispatch(
                    addCouponFilter({
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
            page={couponFilters?.page}
            setPage={(val) => {
              dispatch(
                addCouponFilter({
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
              navigate(`coupons/${row.id}`);
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
              rate: row.total_usage,
              status: (
                <Chip
                  color={translateDiscountStatus(row.live_status).color}
                  label={translateDiscountStatus(row.live_status).label}
                />
              ),
              // channel: <Chip color="info" label={`Email`} />,
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

          <PageUpdateModal
            openModal={openUpdateModal}
            isLoading={loadFlag}
            title={"Manage how a customer uses a coupon"}
            description={
              "You now can control how many times a customer can redeem a coupon. For example, you can limit a coupon to one use per customer and specify the total number of general coupon use allowed. This helps you run effective promotions and manage discounts better."
            }
            size={"small"}
            closeModal={() => {
              updateAppFlag();
            }}
            btnText="Dismiss"
            btnAction={() => {
              updateAppFlag();
            }}
          />
        </>
      )}
    </>
  );
};
