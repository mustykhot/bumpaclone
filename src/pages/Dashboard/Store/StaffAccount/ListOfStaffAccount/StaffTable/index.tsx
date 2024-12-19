import { useEffect, useState } from "react";
import TableComponent from "components/table";
import InputField from "components/forms/InputField";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { EditIcon } from "assets/Icons/EditIcon";
import { Button, Chip, IconButton } from "@mui/material";
// import { Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MessageModal from "components/Modal/MessageModal";
import {
  useDeleteStaffAccountMutation,
  useResendStaffEmailMutation,
  useGetStaffAccountsQuery,
  useGetLoggedInUserQuery,
  useSetAppFlagMutation,
  useGetStoreInformationQuery,
} from "services";
import { selectIsSubscriptionType } from "store/slice/AuthSlice";
import Loader from "components/Loader";
import { LoadingButton } from "@mui/lab";
import moment from "moment";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import { IStaff } from "Models/staff";
import { InfoIcon } from "assets/Icons/InfoIcon";
import { BootstrapTooltip } from "pages/Dashboard/Transactions/TransactionHistoryTable";
import { Send02Icon } from "assets/Icons/SendI02con";
import { InfoCircleXLIcon } from "assets/Icons/InfoCircleXLIcon";
import { selectUserLocation } from "store/slice/AuthSlice";
import { PowerIcon } from "assets/Icons/PowerIcon";
import ReactivateStaffModal from "./ReactivateStaffModal";
import { UpgradeModal } from "components/UpgradeModal";
import PageUpdateModal from "components/PageUpdateModal";
import { PAGEUPDATEVERSIONS } from "utils/constants/general";

const headCell = [
  {
    key: "date",
    name: "Date Added",
  },

  {
    key: "name",
    name: "Staff Name",
  },
  {
    key: "role",
    name: "Staff Role",
  },
  {
    key: "records",
    name: "Orders Recorded",
  },
  {
    key: "lastLogin",
    name: "Last Login",
  },

  {
    key: "action",
    name: "",
  },
];

type IProp = {
  data: any;
  isError: boolean;
  isLoading: boolean;
  search: string;
  setSearch: (val: string) => void;
};

const StaffTable = ({
  data,
  isError,
  search,
  setSearch,
  isLoading: loadStaff,
}: IProp) => {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | number[]>([]);
  const [dataCount, setDataCount] = useState("25");
  const [openResendModal, setOpenResendModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openReactivateModal, setOpenReactivateModal] = useState(false);
  const userLocation = useAppSelector(selectUserLocation);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [isGrowthUpgrade, setIsGrowthUpgrade] = useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const [openBuySlots, setOpenBuySlots] = useState(false);
  const [maxPlan, setMaxPlan] = useState(false);
  const [reactivateAll, setReactivateAll] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [activeStaff, setActiveStaff] = useState<any>();
  const [activeEmail, setActiveEmail] = useState("");
  const [filter, setFilter] = useState("");
  const [mainRow, setMainRow] = useState("");
  const [searchedData, setSearchedData] = useState<any[]>([]);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const { data: userData } = useGetLoggedInUserQuery();
  const [setAppFlag, { isLoading: loadFlag }] = useSetAppFlagMutation();
  const [resendEmail, { isLoading: resendLoading }] =
    useResendStaffEmailMutation();
  const [deleteStaffAccount, { isLoading: deleteLoading }] =
    useDeleteStaffAccountMutation();
  const { data: staffData } = useGetStaffAccountsQuery({
    search: "",
    location_id: userLocation?.id,
  });
  const { data: storeData, isLoading: loadStore } =
    useGetStoreInformationQuery();
  const navigate = useNavigate();

  const handleShowDeleteModal = (id: string) => {
    setActiveId(id);
    setOpenDeleteModal(true);
  };

  const freeSlots = staffData?.slots?.available_staff_slots ?? 0;

  const handleShowResendModal = (email?: string) => {
    if (email) {
      setActiveEmail(email);
      setOpenResendModal(true);
    }
  };

  const handleDeleteStaff = async () => {
    try {
      const result = await deleteStaffAccount({ id: activeId });
      if ("data" in result) {
        showToast("Staff Account Deleted Successfully", "success");
        setOpenDeleteModal(false);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleResendEmail = async () => {
    try {
      const result = await resendEmail({ email: activeEmail });
      if ("data" in result) {
        showToast("Email sent successfully", "success");
        setOpenResendModal(false);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleRowClick = (subscriptionType: string) => {
    switch (subscriptionType) {
      case "starter":
      case "free":
        setIsProUpgrade(true);
        setOpenUpgradeModal(true);
        break;

      case "trial":
      case "pro":
        if (freeSlots > 0) {
          setOpenReactivateModal(true);
        } else {
          setOpenBuySlots(true);
          setMaxPlan(false);
          setIsGrowthUpgrade(true);
          setOpenUpgradeModal(true);
        }

        break;
      case "growth":
        if (freeSlots > 0) {
          setOpenReactivateModal(true);
        } else {
          setOpenBuySlots(true);
          setMaxPlan(true);
          setOpenUpgradeModal(true);
        }
        break;
      default:
        break;
    }
  };
  const updateAppFlag = async () => {
    let payload = {
      ...userData?.app_flags,
      webapp_updates: {
        ...userData?.app_flags?.webapp_updates,
        staff_page: {
          version: PAGEUPDATEVERSIONS.STAFFPAGE,
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

  useEffect(() => {
    if (userData) {
      if (
        userData?.app_flags?.webapp_updates?.staff_page?.version >=
        PAGEUPDATEVERSIONS.STAFFPAGE
      ) {
        if (userData?.app_flags?.webapp_updates?.staff_page?.status) {
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
    if (search) {
      let filtered = staffData?.staff?.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setSearchedData(filtered && filtered?.length ? [...filtered] : []);
    } else {
      setSearchedData(
        staffData?.staff && staffData?.staff?.length
          ? [...staffData?.staff]
          : []
      );
    }
  }, [search, data]);

  useEffect(() => {
    if (filter) {
      let filtered = staffData?.staff?.filter((item) => item.is_disabled);
      setSearchedData(filtered && filtered?.length ? [...filtered] : []);
    } else {
      setSearchedData(
        staffData?.staff && staffData?.staff?.length
          ? [...staffData?.staff]
          : []
      );
    }
  }, [filter]);

  return (
    <div>
      <div>
        <MessageModal
          openModal={openDeleteModal}
          closeModal={() => {
            setOpenDeleteModal(false);
          }}
          icon={<TrashIcon />}
          btnChild={
            <LoadingButton
              disabled={deleteLoading}
              loading={deleteLoading}
              onClick={handleDeleteStaff}
              className="error"
            >
              {!deleteLoading && "Yes, delete"}
            </LoadingButton>
          }
          description="Are you sure you want to delete Staff Account?"
        />
        <MessageModal
          openModal={openResendModal}
          closeModal={() => {
            setOpenResendModal(false);
          }}
          icon={<InfoIcon stroke="#5C636D" />}
          btnChild={
            <LoadingButton
              disabled={resendLoading}
              loading={resendLoading}
              onClick={handleResendEmail}
              variant="contained"
            >
              {!deleteLoading && "Yes, resend"}
            </LoadingButton>
          }
          description="Are you sure you want to resend mail?"
        />
        <div className="table_section">
          <div className="table_action_container">
            <div className="left_section">
              <div className="filter_container">
                <Button
                  onClick={() => {
                    setFilter("");
                    setSearch("");
                  }}
                  className={`filter_button ${filter === "" ? "active" : ""} `}
                >
                  All
                </Button>
                <Button
                  onClick={() => {
                    setFilter("filter");
                    setSearch("");
                  }}
                  className={`filter_button  ${
                    filter === "filter" ? "active" : ""
                  }`}
                >
                  Deactivated
                </Button>
              </div>
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
            page={page}
            setPage={setPage}
            isLoading={loadStaff}
            headCells={headCell}
            selectMultiple={false}
            showPagination={false}
            dataCount={dataCount}
            setDataCount={setDataCount}
            setSelected={setSelected}
            tableType="staff"
            handleClick={(row: any, rowIndex: number, e: any) => {
              if (row.is_disabled) {
                handleRowClick(isSubscriptionType);
                setActiveStaff(row);
                setMainRow(row.name.props.children[0]);
                return;
              }
              navigate(`details/${row.id}`, {
                state: {
                  details: data?.staff[rowIndex],
                },
              });
            }}
            tableData={searchedData.map((row: IStaff, i: number) => ({
              date: moment(row.created_at).format("L"),
              name: (
                <div className="flex items-center gap-1">
                  {row.name}{" "}
                  {row.status === "PENDING" && (
                    <Chip color={"warning"} label={"Pending Invite"} />
                  )}
                </div>
              ),
              role: row.role,
              records: row.order_count,
              lastLogin: row.last_seen
                ? moment(row.last_seen).format("L")
                : "-",
              action: (
                <div className="flex gap-[28px] justify-end">
                  {row?.status === "PENDING" && !row.is_disabled ? (
                    <BootstrapTooltip
                      slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, -8],
                              },
                            },
                          ],
                        },
                      }}
                      title="Resend activation link"
                      placement="top"
                    >
                      <IconButton
                        type="button"
                        className="icon_button_container trash"
                        onClick={(e) => {
                          handleShowResendModal(row?.email);
                          e.stopPropagation();
                        }}
                      >
                        <Send02Icon stroke="#5C636D" />
                      </IconButton>
                    </BootstrapTooltip>
                  ) : (
                    ""
                  )}
                  {row.is_disabled && freeSlots > 0 ? (
                    <IconButton
                      type="button"
                      className=" z-10 trash"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenReactivateModal(true);
                        setActiveStaff(row);
                      }}
                    >
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
                        title="Reactivate this staff"
                        placement="top"
                      >
                        <div className="">
                          <PowerIcon stroke="#5C636D" />
                        </div>
                      </BootstrapTooltip>
                    </IconButton>
                  ) : (
                    ""
                  )}
                  {row.is_disabled ? (
                    <IconButton
                      type="button"
                      className=" z-10 trash"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                        title="This account is disabled because your subscription has expired."
                        placement="top"
                      >
                        <div className="">
                          <InfoCircleXLIcon stroke="#5C636D" />
                        </div>
                      </BootstrapTooltip>
                    </IconButton>
                  ) : (
                    ""
                  )}
                  {!row.is_disabled && (
                    <IconButton
                      type="button"
                      className="icon_button_container trash"
                      onClick={(e) => {
                        if (row.is_disabled) {
                          handleRowClick(isSubscriptionType);
                        } else {
                          navigate(`edit/${row.id}`, {
                            state: {
                              details: row,
                            },
                          });
                        }
                        e.stopPropagation();
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}

                  <IconButton
                    type="button"
                    className="icon_button_container trash"
                    onClick={(e) => {
                      handleShowDeleteModal(row.id as string);
                      e.stopPropagation();
                    }}
                  >
                    <TrashIcon />
                  </IconButton>
                </div>
              ),
              id: row.id,
              is_disabled: row.is_disabled,
            }))}
          />
        </div>

        {/* <Reactivate */}
        {openReactivateModal && (
          <ReactivateStaffModal
            openModal={openReactivateModal}
            closeModal={() => setOpenReactivateModal(false)}
            item={activeStaff}
            slots={freeSlots}
            type="staff"
            reactivate_all={false}
            itemName={mainRow}
          />
        )}
      </div>
      <UpgradeModal
        openModal={openUpgradeModal}
        closeModal={() => setOpenUpgradeModal(false)}
        pro={isProUpgrade}
        growth={isGrowthUpgrade}
        staff={openBuySlots}
        width={openBuySlots && maxPlan ? "600px" : ""}
        title={"This staff account is disabled"}
        subtitle={"Upgrade to a higher plan or buy staff slot"}
        proFeatures={[
          "Add and manage up to 3 staff account",
          "View products & inventory managed by different staff members.",
        ]}
        growthFeatures={[
          "Add and manage up to 5 staff account.",
          "Oversee what your staff do in different staff locations.",
          "View products & inventory managed by different staff members.",
        ]}
        eventName="staff-account"
      />
      <PageUpdateModal
        openModal={openUpdateModal}
        isLoading={loadFlag}
        title={"Staff Accounts Slots Update"}
        description={
          "You can now purchase extra staff accounts based on your current subscription plan."
        }
        size={"small"}
        closeModal={() => {
          updateAppFlag();
        }}
        btnText="Cancel"
      />
    </div>
  );
};

export default StaffTable;
