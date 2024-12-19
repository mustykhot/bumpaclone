import { useEffect, useState } from "react";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import {
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
} from "@mui/material";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { IconButton, Avatar } from "@mui/material";
import "./style.scss";
import { EditIcon } from "assets/Icons/EditIcon";
import { SearchIcon } from "assets/Icons/SearchIcon";
import InputField from "components/forms/InputField";
import TableComponent from "components/table";
import { MAil01Icon } from "assets/Icons/Mail01Icon";
import DisplayCustomerGroup from "components/DisplayCustomerGroup";
import { useNavigate, useParams } from "react-router-dom";
import {
  useActionOrdersMutation,
  useDeleteCustomerMutation,
  useGetSingleCustomerQuery,
} from "services";
import {
  formatNumber,
  formatPrice,
  handleError,
  removeFirstZero,
  translateOrderPaymentStatus,
  translateOrderShippmentStatus,
  translateOrderStatus,
} from "utils";
import parse from "html-react-parser";
import { showToast, useAppSelector } from "store/store.hooks";
import ErrorMsg from "components/ErrorMsg";
import moment from "moment";
import Loader from "components/Loader";
import { ORDERSTATUS, convertAddress } from "utils/constants/general";
import { useGetOrdersQuery } from "services";
import MessageModal from "components/Modal/MessageModal";
import { useCopyToClipboardHook } from "hooks/useCopyToClipboardHook";
import { MarkIcon } from "assets/Icons/MarkIcon";
import { CopyIcon } from "assets/Icons/CopyIcon";
import { WhatsappIcon2Icon } from "assets/Icons/WhatsappIcon2";
import { useLocation } from "react-router-dom";
import { IgCustomerIcon } from "assets/Icons/IgCustomerIcon";
import { selectUserLocation } from "store/slice/AuthSlice";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { InfoCircleXLIcon } from "assets/Icons/InfoCircleXLIcon";
import { BootstrapTooltip } from "pages/Dashboard/Transactions/TransactionHistoryTable";
import { WarningIcon } from "assets/Icons/WarningIcon";

const headCell = [
  {
    key: "order",
    name: "Order ID & Name",
  },
  {
    key: "total",
    name: "Total",
  },
  {
    key: "status",
    name: "Status",
  },

  {
    key: "date",
    name: "Date",
  },
];
export const CustomerProfile = () => {
  const { id } = useParams();
  const [bulkOrderStatus, setBulkOrderStatus] = useState("");
  const [totalBalance, setTotalBalance] = useState(0);
  const [actionOrders, { isLoading: loadAction }] = useActionOrdersMutation();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[] | number[]>([]);
  const [dataCount, setDataCount] = useState("25");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  // table actions
  const [orderStatus, setOrderStatus] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const userLocation = useAppSelector(selectUserLocation);

  const location = useLocation();

  const resetActions = () => {
    setBulkOrderStatus("");
  };
  const resetFilters = () => {
    setSearch("");
    setOrderStatus("");
  };

  const { data, isLoading, isError } = useGetSingleCustomerQuery({
    id: id,
    location_id: userLocation?.id,
  });

  const { isCopied, handleCopyClick } = useCopyToClipboardHook(
    data
      ? data.customer && data.customer.shipping_address
        ? convertAddress(data.customer.shipping_address)
        : ""
      : ""
  );
  const [deleteCustomer, { isLoading: loadDelete }] =
    useDeleteCustomerMutation();
  const deleteCustomerFnc = async () => {
    try {
      let result = await deleteCustomer(Number(id));
      if ("data" in result) {
        showToast("Deleted successfully", "success");
        navigate(-1);
        setOpenDeleteModal(false);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const {
    data: orderList,
    isLoading: orderLoad,
    isFetching,
    isError: orderError,
  } = useGetOrdersQuery({
    limit: 10,
    search,
    page,
    status: orderStatus,
    customer_id: id,
    location_id: userLocation?.id,
  });

  const actionOrderFnc = async (id: string, action: string, body?: any) => {
    try {
      let result = await actionOrders({ id, action, body });
      if ("data" in result) {
        if (result.data.error) {
          showToast(result.data.error, "error");
        } else {
          showToast("Updated successfully", "success");
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const bulkAction = (action: string, body?: any) => {
    selected.forEach((item) => {
      actionOrderFnc(`${item}`, action, body);
    });
    setSelected([]);
    resetActions();
  };

  useEffect(() => {
    if (data) {
      let totalAmount = data.transactions.reduce(
        (accumulator: any, item: any) => {
          let price: number = Number(item.amount);
          return accumulator + price;
        },
        0
      );
      setTotalBalance(totalAmount);
    }
  }, [data]);

  if (isError) {
    return <ErrorMsg error={"Something went wrong"} />;
  }
  if (isLoading || loadAction) {
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
              deleteCustomerFnc();
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
        description="Are you sure you want to delete?"
      />
      {data && (
        <div className="pd_customer_profile">
          <ModalHeader
            text="Customer Profile"
            closeModal={() => {
              if (location?.state?.from === "Instagram") {
                navigate(`/dashboard/messages`, {
                  state: { index: location?.state?.index },
                });
              } else {
                navigate(-1);
              }
            }}
            button={
              <div className="action_buttons">
                <Button
                  variant="outlined"
                  startIcon={<EditIcon stroke={"#009444"} />}
                  className="edit"
                  onClick={() => {
                    navigate(`/dashboard/customers/edit/${id}`);
                  }}
                >
                  Edit Profile
                </Button>
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
          {!data.customer.email_valid ||
            (!data.customer.phone_valid && (
              <div className="warning-info">
                <p className="warning_text">
                  <InfoCircleXLIcon className="info_icon" />
                  {!data.customer.email_valid && !data.customer.phone_valid
                    ? "This customer's email and phone number needs to be updated."
                    : !data.customer.email_valid
                    ? "This customer's email needs to be updated."
                    : !data.customer.phone_valid
                    ? "This customer's phone number needs to be updated."
                    : ""}
                </p>
                <Button
                  className="btn"
                  onClick={() => {
                    navigate(`/dashboard/customers/edit/${id}?email=false`);
                  }}
                >
                  Update Information
                </Button>
              </div>
            ))}

          <div className="customer_profile_container">
            <div className="left_section">
              <div className="basic_information section">
                <div className="avatar_container">
                  <Avatar src={""} className="avatar" />
                  <div className="name_section">
                    <p className="name">{data.customer.name}</p>
                    <p className="duration">
                      Customer since:&nbsp;
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(data.customer.created_at).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days ago
                    </p>
                  </div>
                </div>
                {data.customer.notes && (
                  <div className="description">
                    <h3 className="title">Additional Description</h3>
                    <p className="story"> {parse(data.customer.notes || "")}</p>
                  </div>
                )}
                <div className="summary">
                  <div className="single_summary">
                    <p className="summary_name">LAST ORDER</p>
                    <p className="summaey_value">
                      {data.customer.last_purchase
                        ? moment(data.customer.last_purchase).format("l")
                        : "None selected"}
                    </p>
                  </div>
                  <div className="single_summary">
                    <p className="summary_name">TOTAL AMOUNT SPENT</p>
                    <p className="summaey_value">
                      {formatPrice(Number(totalBalance))}
                    </p>
                  </div>{" "}
                  <div className="single_summary">
                    <p className="summary_name">TOTAL ORDERS</p>
                    <p className="summaey_value">
                      {formatNumber(Number(data.ordersCount))}
                    </p>
                  </div>
                  <div className="single_summary">
                    <p className="summary_name">TOTAL ORDERS VALUE</p>
                    <p className="summaey_value">
                      {formatPrice(Number(data.ordersTotal))}
                    </p>
                  </div>
                  {/* <div className="single_summary">
                    <p className="summary_name">TOTAL REFUNDS</p>
                    <p className="summaey_value"></p>
                  </div> */}
                </div>
              </div>
              <div className="purchase_history section">
                <div className="purchase_table">
                  <h3 className="title">Purchase History</h3>
                  <div className="table_section">
                    <div className="table_action_container">
                      <div className="left_section">
                        {selected?.length ? (
                          <div className="show_selected_actions">
                            <p>Selected: {selected?.length}</p>
                            <Select
                              displayEmpty
                              value={bulkOrderStatus}
                              onChange={(e) => {
                                setBulkOrderStatus(e.target.value);
                                if (e.target.value === "processing") {
                                  bulkAction("markAsProcessing");
                                } else if (e.target.value === "completed") {
                                  bulkAction("markAsCompleted");
                                } else if (e.target.value === "cancelled") {
                                  bulkAction("changeStatus", {
                                    status: "CANCELLED",
                                  });
                                }
                              }}
                              className="my-select dark large"
                              inputProps={{ "aria-label": "Without label" }}
                              renderValue={(selected) => {
                                return `Mark order as: ${selected}`;
                              }}
                            >
                              <MenuItem disabled value="">
                                Order status
                              </MenuItem>
                              <MenuItem value="processing">Processing</MenuItem>
                              <MenuItem value="completed">Completed</MenuItem>
                              <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                          </div>
                        ) : (
                          <div className="filter_container">
                            <Button
                              onClick={() => {
                                resetFilters();
                                resetActions();
                              }}
                              className={`filter_button `}
                            >
                              Clear Filters
                            </Button>
                            <Select
                              displayEmpty
                              value={orderStatus}
                              onChange={(e) => {
                                setOrderStatus(e.target.value);
                              }}
                              className="my-select dark"
                              inputProps={{ "aria-label": "Without label" }}
                            >
                              <MenuItem disabled value="">
                                Order status
                              </MenuItem>
                              {ORDERSTATUS.map((item, i) => {
                                return (
                                  <MenuItem key={i} value={item.value}>
                                    {item.label}
                                  </MenuItem>
                                );
                              })}
                            </Select>
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
                      isError={orderError}
                      page={page}
                      setPage={setPage}
                      isLoading={orderLoad || isFetching}
                      headCells={headCell}
                      selectMultiple={true}
                      selected={selected}
                      showPagination={true}
                      dataCount={dataCount}
                      setDataCount={setDataCount}
                      setSelected={setSelected}
                      handleClick={(row: any) => {
                        navigate(
                          `/dashboard/orders/${row.id}?backAction=${true}`
                        );
                      }}
                      meta={{
                        current: orderList?.orders?.current_page,
                        perPage: 10,
                        totalPage: orderList?.orders?.last_page,
                      }}
                      tableData={orderList?.orders?.data.map(
                        (row: any, i: number) => ({
                          ...row,
                          order: (
                            <div className="order_name">
                              <h4>
                                #{row.order_number}{" "}
                                {row.customer ? ` • ${row.customer?.name}` : ""}
                              </h4>
                              <p>
                                {row.items && row.items?.length
                                  ? `${row.items[0]?.name} ${
                                      row.items?.length > 1
                                        ? `+${row.items?.length} items`
                                        : ""
                                    }  `
                                  : ""}
                              </p>
                            </div>
                          ),
                          total: `${formatPrice(Number(row.total))}`,
                          status: (
                            <Chip
                              color={translateOrderStatus(row.status)?.color}
                              label={translateOrderStatus(row.status)?.label}
                            />
                          ),
                          payment: (
                            <Chip
                              color={
                                translateOrderPaymentStatus(row.payment_status)
                                  ?.color
                              }
                              label={
                                translateOrderPaymentStatus(row.payment_status)
                                  ?.label
                              }
                            />
                          ),
                          shipping: (
                            <Chip
                              color={
                                translateOrderShippmentStatus(
                                  row.shipping_status
                                )?.color
                              }
                              label={
                                translateOrderShippmentStatus(
                                  row.shipping_status
                                )?.label
                              }
                            />
                          ),
                          date: `${moment(row.created_at).calendar()} `,
                          id: row.id,
                        })
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="right_section">
              <div className="contact_section section">
                <p className="title">Contact Details</p>
                <div className="p-[24px] pt-[18px]">
                  {data.customer.phone && (
                    <div
                      onClick={() => {
                        window.open(
                          `https://wa.me/234${removeFirstZero(
                            data.customer.phone
                          )}`,
                          "_blank"
                        );
                      }}
                      className="contact first"
                    >
                      <IconButton
                        type="button"
                        className="icon_button_container small"
                      >
                        <WhatsappIcon2Icon />
                      </IconButton>
                      <p>{data.customer.phone}</p>{" "}
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
                          !data.customer.phone_valid &&
                          "This customer has incorrect phone number"
                        }
                        placement="top"
                      >
                        <div className="warning-tip">
                          {!data.customer.phone_valid && <WarningIcon />}
                        </div>
                      </BootstrapTooltip>
                    </div>
                  )}
                  {data.customer.alternative_phone && (
                    <div
                      onClick={() => {
                        window.open(
                          `https://wa.me/234${removeFirstZero(
                            data.customer.alternative_phone
                          )}`,
                          "_blank"
                        );
                      }}
                      className="contact"
                    >
                      <IconButton
                        type="button"
                        className="icon_button_container small"
                      >
                        <WhatsappIcon2Icon />
                      </IconButton>
                      <p>{data.customer.alternative_phone}</p>
                    </div>
                  )}
                  {data.customer.email && (
                    <div
                      onClick={() => {
                        window.open(`mailto:${data.customer.email}`, "_blank");
                      }}
                      className="contact"
                    >
                      <IconButton
                        type="button"
                        className="icon_button_container small"
                      >
                        <MAil01Icon />
                      </IconButton>
                      <p>{data.customer.email}</p>
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
                        title={"This customer has incorrect email"}
                        placement="top"
                      >
                        <div className="warning-tip">
                          {!data.customer.email_valid && <WarningIcon />}
                        </div>
                      </BootstrapTooltip>
                    </div>
                  )}

                  {data.customer.handle && (
                    <div
                      onClick={() => {
                        window.open(
                          `https://www.instagram.com/${data.customer.handle}/`,
                          "_blank"
                        );
                      }}
                      className="contact"
                    >
                      <IconButton
                        type="button"
                        className="icon_button_container small"
                      >
                        <IgCustomerIcon />
                      </IconButton>
                      <p>{data.customer.handle}</p>
                    </div>
                  )}

                  {/* <Button
                    className="send_message"
                    variant="outlined"
                    startIcon={<MessageIcon isActive={true} />}
                  >
                    Send Message
                  </Button> */}
                </div>
              </div>
              <div className="group_section section">
                <p className="title">Customer Group</p>
                <div className="p-[24px] pt-[18px]">
                  <DisplayCustomerGroup
                    groupList={data.groups.map((item) => item.name)}
                  />
                </div>
              </div>
              <div className="address_section section">
                <p className="title">Address</p>
                <div className="p-[24px] pt-[18px]">
                  <div className="biling">
                    <div className="flex items-center gap-2 mb-2">
                      <h3>Shipping Address</h3>
                      {data.customer &&
                        data.customer.shipping_address &&
                        (data.customer.shipping_address.country ||
                          data.customer.shipping_address.state ||
                          data.customer.shipping_address.street ||
                          data.customer.shipping_address.city) && (
                          <IconButton
                            onClick={() => {
                              handleCopyClick();
                            }}
                            type="button"
                            className="icon_button_container"
                          >
                            {isCopied ? <MarkIcon /> : <CopyIcon />}
                          </IconButton>
                        )}
                    </div>
                    <p>
                      {data.customer &&
                      data.customer.shipping_address &&
                      (data.customer.shipping_address.country ||
                        data.customer.shipping_address.state ||
                        data.customer.shipping_address.street ||
                        data.customer.shipping_address.city)
                        ? convertAddress(data.customer.shipping_address)
                        : "None selected"}
                    </p>
                  </div>{" "}
                  <div className="biling">
                    <h3>Billing Address</h3>
                    <p>
                      {data.customer &&
                      data.customer.billing_address &&
                      (data.customer.billing_address.country ||
                        data.customer.billing_address.state ||
                        data.customer.billing_address.street ||
                        data.customer.billing_address.city)
                        ? convertAddress(data.customer.billing_address)
                        : "None selected"}
                    </p>
                  </div>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
