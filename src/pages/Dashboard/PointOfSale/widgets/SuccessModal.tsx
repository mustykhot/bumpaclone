import Modal from "components/Modal";
import check_circle from "assets/images/checkcircle.png";
import { Button } from "@mui/material";
import "./style.scss";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { OrderType } from "Models/order";
import { useNavigate } from "react-router-dom";
import React, { MutableRefObject, useRef, useState } from "react";
import { CreateCustomerModal } from "./SelectCustomer/CreateCustomer";
import { useReactToPrint } from "react-to-print";
import {
  selectCurrentStore,
  selectCurrentUser,
  selectUserLocation,
} from "store/slice/AuthSlice";
import { showToast, useAppSelector } from "store/store.hooks";
import moment from "moment";
import { formatNumber, formatPrice, handleError } from "utils";
import { convertLocationAddress } from "utils/constants/general";
import { useEditOrdersMutation } from "services";
type propType = {
  openModal: boolean;
  closeModal: () => void;
  closeAllModal: () => void;
  createdOrder: OrderType | null;
  setCreatedOrder: any;
};

export const ComponentToPrint = React.forwardRef(
  (props: { createdOrder: OrderType | undefined }, ref: any) => {
    const userLocation = useAppSelector(selectUserLocation);
    const orderToPrint = props.createdOrder;
    const userStore = useAppSelector(selectCurrentStore);
    const user = useAppSelector(selectCurrentUser);
    let totalQuantity: number = 0;
    orderToPrint?.items?.forEach((item) => {
      totalQuantity += item.quantity;
    });

    return (
      <div className="receipt_container" ref={ref}>
        <div className="first_top_section">
          <div className="business_name_aspect">
            <p className="store_name">{userStore?.name}</p>
            <p className="store_address">
              {convertLocationAddress(userLocation)}
            </p>
            <p className="store_address">{user?.phone}</p>
          </div>
          <img
            src={userStore?.logo_url}
            className="logo_receipt"
            alt="storelogo"
          />
        </div>
        <div className="attendant_name">
          <p>Attendant: {user?.name}</p>
        </div>
        <div className="order_id_date">
          <p className="order_id">ORDER #{orderToPrint?.id}</p>
          <p className="order_date">
            {moment(orderToPrint?.order_date).format("LL")} at
            {moment(orderToPrint?.order_date).format("LT")}
          </p>
        </div>

        {orderToPrint?.customer && (
          <div className="customer-details">
            <p>Customer Name: {orderToPrint?.customer?.name}</p>
            <p>Phone Number: {orderToPrint?.customer?.phone}</p>
            <p>
              Customer Address:
              {convertLocationAddress(orderToPrint?.customer?.address)}
            </p>
          </div>
        )}

        <div className="order_items_table">
          <table>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>QTY</th>
                <th>PRICE (N)</th>
                <th>TOTAL (N)</th>
              </tr>
            </thead>
            <tbody>
              {orderToPrint?.items?.length
                ? orderToPrint?.items.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{formatNumber(Number(item.price))}</td>
                        <td>{formatNumber(Number(item.total))}</td>
                      </tr>
                    );
                  })
                : ""}
            </tbody>
          </table>
        </div>

        <div className="order_details_section">
          <div className="single_detail">
            <p className="light">Total Products</p>
            <p className="bold">{totalQuantity}</p>
          </div>
          <div className="single_detail">
            <p className="light">Sub Total</p>
            <p className="bold">
              {formatPrice(Number(orderToPrint?.sub_total))}
            </p>{" "}
          </div>
          {Number(orderToPrint?.discount) !== 0 || orderToPrint?.coupon_code ? (
            orderToPrint?.coupon_code ? (
              <div className="single_detail">
                <p className="light">Coupon: {orderToPrint?.coupon_code}</p>
                <p className="bold">
                  {`- ${formatPrice(Number(orderToPrint?.discount_val))}`}
                </p>
              </div>
            ) : (
              <div className="single_detail">
                <p className="light">Discount</p>
                <p className="bold">
                  {`- ${formatPrice(Number(orderToPrint?.discount_val))}`}
                </p>
              </div>
            )
          ) : (
            ""
          )}
          {orderToPrint?.taxes && orderToPrint?.taxes.length ? (
            <div className="single_detail">
              <p className="light">Tax</p>
              <p className="bold">{formatPrice(Number(orderToPrint?.tax))}</p>
            </div>
          ) : (
            ""
          )}

          <div className="single_detail">
            <p className="extrabold small">Total</p>
            <p className="extrabold">
              {formatPrice(Number(orderToPrint?.total))}
            </p>
          </div>
        </div>

        <div className="payment_details_section">
          <div className="single_detail">
            <p className="light">Payment method</p>
            <p className="bold">
              {orderToPrint?.transactions
                ?.map((item) => item.method)
                .join(", ")}
            </p>
          </div>

          <div className="single_detail">
            <p className="light">Amount Paid</p>
            <p className="bold">
              {formatPrice(Number(orderToPrint?.amount_paid))}
            </p>
          </div>
          {Number(orderToPrint?.amount_due || 0) !== 0 && (
            <div className="single_detail">
              <p className="light">Ammount Due</p>
              <p className="bold">
                {formatPrice(Number(orderToPrint?.amount_due))}
              </p>
            </div>
          )}
        </div>
        <div className="thanks_side">
          <p className="thanks">Thanks for shopping with us!</p>
          <p className="visit">{userStore?.url_link}</p>
        </div>
      </div>
    );
  }
);

const SuccessModal = ({
  closeModal,
  closeAllModal,
  openModal,
  createdOrder,
  setCreatedOrder,
}: propType) => {
  const [openCustomer, setOpenCustomer] = useState(false);
  const componentRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [editOrder, { isLoading: loadEdit }] = useEditOrdersMutation();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const addCustomerToOrder = async (id: string, cb?: () => void) => {
    const payload = {
      ...createdOrder,
      order_date: moment(createdOrder?.order_date).format("DD/MM/YYYY"),
      customer_id: id,
    };
    try {
      let result = await editOrder({
        body: payload,
        id: `${createdOrder?.id}`,
      });
      if ("data" in result) {
        showToast("Customer added successfully", "success");
        setCreatedOrder(result.data.order);
        cb && cb();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const navigate = useNavigate();
  return (
    <>
      <div className="cover_receipt_to_print">
        <ComponentToPrint
          //@ts-ignore
          createdOrder={createdOrder}
          ref={componentRef}
        />
      </div>
      <Modal
        closeModal={() => {
          closeModal();
        }}
        closeOnOverlayClick={false}
        openModal={openModal}
      >
        <div className="success_wrap">
          <img
            src={check_circle}
            alt="check circle"
            style={{ margin: "auto", marginTop: "24px", marginBottom: "24px" }}
          />

          <h3>Checkout Succesful</h3>
          <p>
            You've Succesfully recorded an order
            {createdOrder?.customer && (
              <span> for {createdOrder?.customer?.name}</span>
            )}{" "}
          </p>
          <div className="btns">
            <Button
              onClick={() => {
                handlePrint();
              }}
              variant="contained"
              className="view_order_btn primary_styled_button"
            >
              Print Receipt
            </Button>

            <Button
              onClick={() => {
                closeAllModal();
                navigate(
                  `/dashboard/orders/${createdOrder?.id}?isFirst=${true}`
                );
              }}
              variant="outlined"
              className="view_order_btn "
            >
              View Order
            </Button>
            {!createdOrder?.customer && (
              <Button
                onClick={() => {
                  setOpenCustomer(true);
                }}
                variant="outlined"
                className="view_order_btn add_customer_absolute"
              >
                Add Customer
              </Button>
            )}
            <Button
              onClick={() => {
                closeAllModal();
              }}
              variant="outlined"
              className="view_order_btn "
            >
              Back to POS
            </Button>
          </div>
        </div>
      </Modal>
      <CreateCustomerModal
        openModal={openCustomer}
        extraLoad={loadEdit}
        extraFnc={(id: string, cb?: () => void) => {
          addCustomerToOrder(id, cb);
        }}
        closeModal={() => {
          setOpenCustomer(false);
        }}
      />
    </>
  );
};

export default SuccessModal;
