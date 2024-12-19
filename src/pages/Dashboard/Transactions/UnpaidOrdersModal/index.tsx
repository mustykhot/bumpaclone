import { useState } from "react";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { Button, Select, MenuItem, Chip } from "@mui/material";
import "./style.scss";
// import { useNavigate } from "react-router-dom";
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
import { showToast } from "store/store.hooks";
import moment from "moment";
import { ORDERSTATUS } from "utils/constants/general";
import { OrderType } from "Models/order";

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
  setOrderId: (val: any) => void;
  setOpenConfirm: (val: boolean) => void;
};
export type CreateOrderFeilds = {};

export const UnpaidOrdersModal = ({
  closeModal,
  openModal,
  setOpenConfirm,
  setOrderId,
}: propType) => {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[] | number[]>([]);
  const [dataCount, setDataCount] = useState("25");

  // table actions
  const [search, setSearch] = useState("");
  const [actionOrders] = useActionOrdersMutation();
  const {
    data: orderList,
    isLoading: orderLoad,
    isError: orderError,
  } = useGetOrdersQuery({
    limit: 20,
    search,
    page,
    paid_status: "UNPAID,PARTIALLY_PAID,PENDING",
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

  return (
    <div className="request-payment-bottom-modal">
      <ModalBottom closeModal={closeModal} openModal={openModal}>
        <div className="pd_share_invoice_modal">
          <div className="order_container-ig">
            <ModalHeader text="Select Payment" closeModal={closeModal} />
            <div className="purchase_history section">
              <div className="purchase_table">
                <div className="table_section">
                  <div className="table_action_container">
                    <div className="left_section">
                      {selected.length ? (
                        <div className="show_selected_actions"></div>
                      ) : (
                        <div className="filter_container">
                          <Button className={`filter_button`}>Unpaid</Button>
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
                    showPagination={true}
                    dataCount={dataCount}
                    setDataCount={setDataCount}
                    setSelected={setSelected}
                    isInstagram={true}
                    meta={{
                      current: orderList?.orders?.current_page,
                      perPage: 10,
                      totalPage: orderList?.orders?.last_page,
                    }}
                    handleClick={(row: any) => {
                      setOrderId(row.id);
                      setOpenConfirm(true);
                    }}
                    tableData={orderList?.orders?.data
                      ?.filter((order) => order.payment_status !== "PAID")
                      ?.map((row, i) => ({
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
        </div>
      </ModalBottom>
    </div>
  );
};
