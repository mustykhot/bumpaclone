import { useState } from "react";
import ModalBottom from "components/ModalBottom";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import InputField from "components/forms/InputField";
import { SearchIcon } from "assets/Icons/SearchIcon";
import TableComponent from "components/table";
import { LoadingButton } from "@mui/lab";
import { Button, Select, MenuItem, Chip } from "@mui/material";
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
import SendPaymentRequestModal from "./SendPaymentRequestModal";
import jiji from "assets/images/origin/jiji.png";
import konga from "assets/images/origin/konga.png";
import facebook from "assets/images/origin/facebook.png";
import flutterwave from "assets/images/origin/flutterwave.png";
import instagramOrigin from "assets/images/origin/instagram.png";
import walkin from "assets/images/origin/walkin.png";
import jumia from "assets/images/origin/jumia.png";
import paystack from "assets/images/origin/paystack.png";
import physical from "assets/images/origin/physical.png";
import snapchat from "assets/images/origin/snapchat.png";
import whatsapp from "assets/images/origin/whatsapp.png";


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
};

export const getOriginImage = (origin: string) => {
    switch (origin) {
      case "walk-in":
        return {
          image: walkin,
          name: "Physical Sale",
        };
      case "facebook":
        return {
          image: facebook,
          name: "Facebook",
        };
      case "flutterwave":
        return {
          image: flutterwave,
          name: "Flutterwave",
        };
      case "instagram":
        return {
          image: instagramOrigin,
          name: "Instagram",
        };
      case "jiji":
        return {
          image: jiji,
          name: "Jiji",
        };
      case "jumia":
        return {
          image: jumia,
          name: "Jumia",
        };
      case "konga":
        return {
          image: konga,
          name: "Konga",
        };
      case "paystack":
        return {
          image: paystack,
          name: "Paystack",
        };
      case "snapchat":
        return {
          image: snapchat,
          name: "Snapchat",
        };
      case "whatsapp":
        return {
          image: whatsapp,
          name: "Whatsapp",
        };
      case "others":
        return {
          image: physical,
          name: "Others",
        };
      case "website":
        return {
          image: physical,
          name: "Website",
        };
      default:
        return {
          image: instagramOrigin,
          name: "Instagram",
        };
    }
  };

const UnpaidOrders = ({ closeModal,
    openModal }: propType) => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<string[] | number[]>([]);
    const [showPayment, setShowPayment] = useState(false);
    const [dataCount, setDataCount] = useState("25");
    const [bulkOrderStatus, setBulkOrderStatus] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<OrderType[]>([]);

    const [search, setSearch] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const [actionOrders] = useActionOrdersMutation();
    const {
        data: orderList,
        isLoading: orderLoad,
        isError: orderError,
    } = useGetOrdersQuery({
        limit: 10,
        search,
        page,
       paid_status: 'unpaid'
    });

    const handleClick = (val: OrderType) => {
        const newOrder = []
        newOrder.push(val);
        setSelectedOrder(newOrder);
        setShowPaymentModal(true)
    };

    return (
        <div className="request-payment-bottom-modal">
            <ModalBottom closeModal={closeModal} openModal={openModal}>
                <div className="pd_share_invoice_modal">
                    <div className="order_container-ig">
                        <ModalHeader text="Select an order" closeModal={closeModal} />
                        <div className="purchase_history section">
                            <div className="purchase_table">
                                <div className="table_section">
                                    <div className="table_action_container">

                                        <div className="search_container ml-auto">
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
                                        handleClick={handleClick}
                                        selected={
                                            selectedOrder.length
                                                ? selectedOrder[selectedOrder?.length - 1]
                                                : []
                                        }
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
                                        tableData={orderList?.orders?.data
                                            ?.filter((order) => order.payment_status !== "PAID")
                                            ?.map((row, i) => ({
                                                ...row,
                                                image: (
                                                    <img
                                                      src={getOriginImage(row.origin).image}
                                                      alt={getOriginImage(row.origin).name}
                                                      width={28}
                                                      height={28}
                                                      className="image_table_item"
                                                    />
                                                  ),

                                                order: (
                                                    <div className="order_name">
                                                        <h4>
                                                            #{row.id}{" "}
                                                            {row.customer ? ` • ${row.customer?.name}` : ""}
                                                        </h4>
                                                        <p>
                                                            {row.items && row.items.length
                                                                ? `${row.items[0]?.name} ${row.items.length > 1
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

                    {/* <div className="submit_form_section">
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
                                onClick={() => { setShowPaymentModal(true)}}
                                disabled={!selectedOrder.length}
                            >
                                Send
                            </LoadingButton>
                        </div>
                    </div> */}

                </div>
            </ModalBottom>

            {showPaymentModal && <SendPaymentRequestModal closeModal={() => setShowPaymentModal(false)} openModal={showPaymentModal} orderDetails={selectedOrder} />}
        </div>
    )

}

export default UnpaidOrders