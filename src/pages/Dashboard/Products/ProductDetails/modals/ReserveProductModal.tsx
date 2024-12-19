import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import EmptyResponse from "components/EmptyResponse";

import { OrderType } from "Models/order";
import { getOriginImage } from "pages/Dashboard/Orders";
import "./style.scss";

type ProductModalProps = {
  openModal: boolean;
  closeModal: () => void;
  order?: OrderType[];
  refetch: any;
};

const SingleProduct = ({ order }: { order: OrderType }) => {
  const navigate = useNavigate();
  const calculateTimeLeft = () => {
    const now = moment();
    const duration = moment.duration(moment(order?.reserved_until).diff(now));
    const hours = Math.max(0, Math.floor(duration.asHours()));
    const minutes = Math.max(0, duration.minutes());
    const seconds = Math.max(0, duration.seconds());
    const formatValue = (value: number) => String(value).padStart(2, "0");
    return {
      hours: formatValue(hours),
      minutes: formatValue(minutes),
      seconds: formatValue(seconds),
    };
  };
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [order?.reserved_until]);
  return (
    <div
      className="single_related_product cursor-pointer"
      onClick={() => {
        navigate(`/dashboard/orders/${order?.id}?backAction=${true}`);
      }}
    >
      <div className="related_product_flex related_reserve_product_flex">
        <div className="left_container">
          <img
            src={getOriginImage(order.origin).image}
            alt={getOriginImage(order.origin).name}
            width={28}
            height={28}
          />
        </div>
        <div className={`right_container`} onClick={() => {}}>
          <div className="top">
            <p className="name">
              #{order.order_number}
              {order.customer ? ` • ${order.customer?.name}` : ""}
            </p>
            <div className="price_container">
              <p className="price">QTY: {order?.items?.length}</p>
            </div>
          </div>
          <div className="bottom">
            <p className="count"> {moment(order.created_at).calendar()}</p>
            <p className="text-[12px] text-[#5C636D]">
              Expires in{" "}
              <span className="text-error">{`${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReserveProductModal = ({
  openModal,
  closeModal,
  order,
  refetch,
}: ProductModalProps) => {
  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children reserved_modal">
          <div className="top_section" id="scroller_top">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              title="Reserved Quantity"
              extraChild={
                <Button
                  variant="outlined"
                  className="refresh_reserve"
                  onClick={() => {
                    refetch();
                  }}
                >
                  Refresh
                </Button>
              }
            >
              <p className="text-[12px]">
                This displays a countdown for orders that are reserved until
                payment is completed or the countdown runs out. You can view or
                cancel these reserved orders.
              </p>
            </ModalRightTitle>
            <div className="add_related_product_container">
              <div className="list_product_to_add_container">
                <div className="single_related_product">
                  {order?.length ? (
                    order?.map((item: any) => (
                      <SingleProduct order={item} key={item.id} />
                    ))
                  ) : (
                    <EmptyResponse message="No Reserved Product" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalRight>
    </>
  );
};
