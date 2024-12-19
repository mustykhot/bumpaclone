import { useState } from "react";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { Button, Select, MenuItem, Chip } from "@mui/material";
import "./style.scss";
import InputField from "components/forms/InputField";
import { SearchIcon } from "assets/Icons/SearchIcon";
import TableComponent from "components/table";
import { LoadingButton } from "@mui/lab";
import ModalBottom from "components/ModalBottom";
import { useActionOrdersMutation, useGetOrdersQuery } from "services";
import {
  formatPrice,
  handleError,
  translateOrderPaymentStatus,
  translateOrderShippmentStatus,
  translateOrderStatus,
} from "utils";
import { showToast, useAppSelector } from "store/store.hooks";
import moment from "moment";
import { ORDERSTATUS } from "utils/constants/general";
import { OrderType } from "Models/order";
import { selectUserLocation } from "store/slice/AuthSlice";

const headCell = [
  {
    key: "image",
    name: "",
  },
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
    key: "payment",
    name: "Payment",
  },

  {
    key: "shipping",
    name: "Shipping",
  },
  {
    key: "date",
    name: "Date",
  },
];

type propType = {
  openModal: boolean;
  closeModal: () => void;
  handleSentInvoice: (val: any) => void;
  id: any;
};
export type CreateOrderFeilds = {};

const SendInvoiceModal = ({
  closeModal,
  openModal,
  handleSentInvoice,
  id,
}: propType) => {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[] | number[]>([]);
  const [dataCount, setDataCount] = useState("25");
  const [bulkOrderStatus, setBulkOrderStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderType[]>([]);

  // table actions
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [actionOrders] = useActionOrdersMutation();
  const userLocation = useAppSelector(selectUserLocation);

  const {
    data: orderList,
    isLoading: orderLoad,
    isError: orderError,
  } = useGetOrdersQuery({
    limit: 10,
    search,
    page,
    status: orderStatus,
    customer_id: id,
    location_id: userLocation?.id,
  });

  const resetActions = () => {
    setBulkOrderStatus("");
  };
  const resetFilters = () => {
    setSearch("");
    setOrderStatus("");
  };

  const handleClick = (val: OrderType) => {
    const newOrder = [...selectedOrder];
    newOrder.push(val);
    setSelectedOrder(newOrder);
  };

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

  return (
    <div className="invoice-bottom-modal">
      <ModalBottom closeModal={closeModal} openModal={openModal}>
        <div className="pd_share_invoice_modal">
          <div className="order_container">
            <ModalHeader text="Send Invoice" closeModal={closeModal} />
            <div className="purchase_history section">
              <div className="purchase_table">
                <div className="table_section">
                  <div className="table_action_container">
                    <div className="left_section">
                      {selected.length ? (
                        <div className="show_selected_actions">
                          <p>Selected: {selected.length}</p>
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
                    isLoading={orderLoad}
                    headCells={headCell}
                    selectMultiple={false}
                    selected={
                      selectedOrder.length
                        ? selectedOrder[selectedOrder?.length - 1]
                        : []
                    }
                    showPagination={true}
                    handleClick={handleClick}
                    dataCount={dataCount}
                    setDataCount={setDataCount}
                    setSelected={setSelected}
                    isInstagram={true}
                    meta={{
                      current: orderList?.orders?.current_page,
                      perPage: 10,
                      totalPage: orderList?.orders?.last_page,
                    }}
                    tableData={orderList?.orders?.data.map((row, i) => ({
                      ...row,

                      order: (
                        <div className="order_name">
                          <h4>
                            #{row.id}{" "}
                            {row.customer ? ` • ${row.customer?.name}` : ""}
                          </h4>
                          <p>
                            {row.items && row.items.length
                              ? `${row.items[0]?.name} ${
                                  row.items.length > 1
                                    ? `+${row.items.length} items`
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
                            translateOrderShippmentStatus(row.shipping_status)
                              ?.color
                          }
                          label={
                            translateOrderShippmentStatus(row.shipping_status)
                              ?.label
                          }
                        />
                      ),

                      date: `${moment(row.created_at).calendar()} `,
                      id: row.id,
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="submit_form_section">
            <div className="button_container">
              <Button
                onClick={() => {
                  closeModal();
                }}
                variant="contained"
                type="button"
                className="preview"
              >
                Cancel
              </Button>

              <LoadingButton
                loading={false}
                variant="contained"
                className="add"
                type="button"
                onClick={() => {
                  if (selectedOrder.length) {
                    handleSentInvoice(selectedOrder[selectedOrder?.length - 1]);
                    closeModal();
                  }
                }}
                disabled={!selectedOrder.length}
              >
                Send
              </LoadingButton>
            </div>
          </div>
        </div>
      </ModalBottom>
    </div>
  );
};

export default SendInvoiceModal;
