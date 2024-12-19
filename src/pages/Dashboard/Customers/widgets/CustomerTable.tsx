import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { IconButton, MenuItem, Select, Tooltip } from "@mui/material";
import { Button } from "@mui/material";
import { CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { UserIcon } from "assets/Icons/Sidebar/UserIcon";
import { EditIcon } from "assets/Icons/EditIcon";
import InputField from "components/forms/InputField";
import EmptyResponse from "components/EmptyResponse";
import MessageModal from "components/Modal/MessageModal";
import TableComponent from "components/table";
import {
  useDeleteCustomerMutation,
  useGetCustomersQuery,
  useGetLoggedInUserQuery,
  useSetAppFlagMutation,
} from "services";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import customer from "assets/images/customer.png";
import {
  addCustomerFilter,
  selectCustomerFilters,
} from "store/slice/FilterSlice";
import { WarningIcon } from "assets/Icons/WarningIcon";
import { BootstrapTooltip } from "pages/Dashboard/Transactions/TransactionHistoryTable";
import PageUpdateModal from "components/PageUpdateModal";
import { PAGEUPDATEVERSIONS } from "utils/constants/general";

const headCell = [
  {
    key: "date",
    name: "Date Added",
  },
  {
    key: "name",
    name: "Name",
  },
  {
    key: "email",
    name: "Email Address",
  },

  {
    key: "phone",
    name: "Phone Number",
  },
  {
    key: "action",
    name: "",
  },
];

export const CustomerTable = () => {
  const [selected, setSelected] = useState<string[] | number[]>([]);
  const [selectBulk, setSelectBulk] = useState<any[]>([]);
  const location = useLocation();
  const [idTobeDeleted, setIdTobeDeleted] = useState<number | string>("");
  const [dataCount, setDataCount] = useState("25");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const customerFilters = useAppSelector(selectCustomerFilters);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const { data: userData } = useGetLoggedInUserQuery();
  const [setAppFlag, { isLoading: loadFlag }] = useSetAppFlagMutation();
  const dispatch = useAppDispatch();
  const [deleteCustomer, { isLoading: loadDelete }] =
    useDeleteCustomerMutation();
  const navigate = useNavigate();
  const { data, isLoading, isFetching, isError, refetch } =
    useGetCustomersQuery({
      limit: Number(dataCount),
      page: customerFilters?.page,
      search: customerFilters?.search,
      field: customerFilters?.field,
    });

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const deleteInBulk = async () => {
    try {
      setIsDeleteLoading(true);
      const productRequests = selected?.map((id) => {
        return deleteCustomerFnc(`${id}`);
      });

      const responses = await Promise.all(productRequests);
      if (responses?.length) {
        setSelected([]);
        showToast("Customers successfully deleted", "success");
        setOpenDeleteModal(false);
      }
    } catch (error) {
      showToast(
        "Failed to delete one or more customer(s). Please try again.",
        "error"
      );
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const deleteCustomerFnc = async (
    id: number | string,
    callback?: () => void
  ) => {
    try {
      let result = await deleteCustomer(Number(id));
      if ("data" in result) {
        if (callback) {
          showToast("Deleted successfully", "success");
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
        customer_page: {
          version: PAGEUPDATEVERSIONS.CUSTOMERPAGE,
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

  const resetFilters = () => {
    dispatch(
      addCustomerFilter({
        page: 1,
        search: "",
        field: "",
      })
    );
  };

  useEffect(() => {
    if (userData) {
      if (
        userData?.app_flags?.webapp_updates?.customer_page?.version ===
        PAGEUPDATEVERSIONS.CUSTOMERPAGE
      ) {
        if (userData?.app_flags?.webapp_updates?.customer_page?.status) {
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
                deleteCustomerFnc(`${idTobeDeleted}`, () => {
                  setOpenDeleteModal(false);
                  setSelected([]);
                });
              } else {
                bulkDelete();
              }
            }}
            disabled={loadDelete || isDeleteLoading}
            className="error"
          >
            {loadDelete || isDeleteLoading ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Yes, delete"
            )}
          </Button>
        }
        description="Are you sure you want to delete selected customers?"
      />
      {data &&
      data?.customers?.data?.length === 0 &&
      !customerFilters?.search &&
      !customerFilters?.field ? (
        <div className="empty_wrapper_for_emapty_state">
          <EmptyResponse
            message="Add customers to your contact list"
            image={customer}
            extraText="You can add a new customer or import your contacts."
            btn={
              <div className="empty_btn_box">
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate("create");
                  }}
                  startIcon={<AddIcon />}
                >
                  Add customers
                </Button>
              </div>
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
                  <Button
                    onClick={() => {
                      navigate(
                        `/dashboard/customers/creategroup?list=${JSON.stringify(
                          selectBulk.map((item) => {
                            return { name: item.name, id: item.id };
                          })
                        )}`
                      );
                    }}
                    startIcon={<UserIcon />}
                  >
                    Create Group
                  </Button>
                </div>
              ) : (
                <div className="filter_container">
                  <Button
                    onClick={() => {
                      resetFilters();
                    }}
                    className={`filter_button `}
                  >
                    Clear Filters
                  </Button>
                  <Select
                    displayEmpty
                    value={customerFilters?.field}
                    onChange={(e) => {
                      dispatch(
                        addCustomerFilter({
                          field: e.target.value,
                          page: 1,
                        })
                      );
                    }}
                    className="my-select dark"
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem disabled value="">
                      Info Validation
                    </MenuItem>

                    <MenuItem value="&email_valid=true">
                      Correct Email Address
                    </MenuItem>
                    <MenuItem value="&phone_valid=true">
                      Correct Phone Number
                    </MenuItem>
                    <MenuItem value="&email_valid=false">
                      Incorrect Email Address
                    </MenuItem>
                    <MenuItem value="&phone_valid=false">
                      Incorrect Phone Number
                    </MenuItem>
                  </Select>
                </div>
              )}
            </div>

            <div className="search_container">
              <InputField
                type={"text"}
                containerClass="search_field"
                value={customerFilters?.search}
                onChange={(e: any) => {
                  dispatch(
                    addCustomerFilter({
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
            page={customerFilters?.page}
            setPage={(val) => {
              dispatch(
                addCustomerFilter({
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
            setSelectBulk={setSelectBulk}
            meta={{
              current: data?.customers?.current_page,
              perPage: 10,
              totalPage: data?.customers?.last_page,
            }}
            handleClick={(row: any) => {
              navigate(`${row.id}`);
            }}
            tableData={data?.customers?.data.map((row, i) => ({
              date: moment(row.created_at).format("ll"),
              name: (
                <div className="inner_name">
                  {<span>{row.name}</span>}
                  <BootstrapTooltip
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, -10],
                            },
                          },
                        ],
                      },
                    }}
                    title={
                      !row.email_valid && !row.phone_valid
                        ? "This customer has incorrect email and phone number"
                        : !row.email_valid
                        ? "This customer has an incorrect email."
                        : !row.phone_valid
                        ? "This customer has an incorrect phone number."
                        : ""
                    }
                    placement="top"
                  >
                    <div className="">
                      {!row.email_valid ||
                        (!row.phone_valid && <WarningIcon />)}
                    </div>
                  </BootstrapTooltip>
                </div>
              ),
              email: row.email,
              phone: row.phone,
              // orders: "20",
              action: (
                <div className="flex gap-[28px] justify-end">
                  <IconButton
                    onClick={(e) => {
                      navigate(`edit/${row.id}`);
                      e.stopPropagation();
                    }}
                    type="button"
                    className="icon_button_container"
                  >
                    <EditIcon />
                  </IconButton>{" "}
                  <IconButton
                    onClick={(e) => {
                      setIdTobeDeleted(row.id);
                      // deleteCustomerFnc(row.id);
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

      <PageUpdateModal
        openModal={openUpdateModal}
        isLoading={loadFlag}
        title={"Customer Filters"}
        description={
          "You can now view customers with correct and incorrect phone numbers or email addresses for easy correction."
        }
        size={"small"}
        closeModal={() => {
          updateAppFlag();
        }}
        btnText="Close"
        btnAction={() => {
          updateAppFlag();
        }}
      />
    </>
  );
};
