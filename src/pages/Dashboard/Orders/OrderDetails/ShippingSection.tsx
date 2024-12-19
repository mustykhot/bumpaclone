import { useState } from "react";
import moment from "moment";
import { Button, Chip, CircularProgress, IconButton } from "@mui/material";
import { OrderItemType, OrderType } from "Models/order";

import { PackageIcon } from "assets/Icons/PackageIcon";
import { GlobeIcon } from "assets/Icons/GlobeIcon";
import { BellIcon } from "assets/Icons/BellIcon";
import { CopyIcon } from "assets/Icons/CopyIcon";
import { CheckIcon } from "assets/Icons/CheckIcon";
import { PrinterIcon } from "assets/Icons/PrinterIcon";
import { PrimaryFillIcon } from "assets/Icons/PrimaryFillIcon";

import MessageModal from "components/Modal/MessageModal";
import DropDownWrapper from "components/DropDownWrapper";
import { PickupBookingModal } from "./PickupBookingModal";
import TrackShippingModal from "./TrackShippingModal";

import { convertAddress, convertAddressToCopy } from "utils/constants/general";
import { useCopyToClipboardHook } from "hooks/useCopyToClipboardHook";
import { showToast } from "store/store.hooks";
import { translateAutomaticShippingStatus, translateOrderStatus } from "utils";

export const shipping_status_list = [
  {
    value: "SHIPPED",
    key: "Shipped",
  },
  {
    value: "DELIVERED",
    key: "Delivered",
  },

  {
    value: "RETURNED",
    key: "Returned",
  },
];

type propType = {
  openShippingWarning: boolean;
  setOpenShippingWarning: any;
  activeOrder: OrderType;
  setEditAddressAction: any;
  setEditAddressModal: any;
  setIsEditAddress: any;
  setSelectCustomerModal: any;
  setOpenGeneralWarningAction: any;
  setOpenGeneralWarningMessage: any;
  canManageOrder: boolean;
  setOpenGeneralWarningModal: any;
  handleInvoiceLimitExceeded: any;
  isRestricted: boolean;
  isSubscriptionType: string;
};

const ShippingSection = ({
  activeOrder,
  openShippingWarning,
  setOpenShippingWarning,
  setEditAddressAction,
  setEditAddressModal,
  setIsEditAddress,
  canManageOrder,
  setSelectCustomerModal,
  setOpenGeneralWarningMessage,
  setOpenGeneralWarningAction,
  setOpenGeneralWarningModal,
  handleInvoiceLimitExceeded,
  isRestricted,
  isSubscriptionType,
}: propType) => {
  const [openBookPickupModal, setOpenBookPickupModal] = useState(false);
  const [openTrackShipmentModal, setOpenTrackShipmentModal] = useState(false);
  const [shippingWarningMessage, setShippingWarningMessage] = useState("");

  const { isCopied: isTrackingCopied, handleCopyClick: handleTrackingCopy } =
    useCopyToClipboardHook(
      activeOrder ? activeOrder?.shipping_record?.tracking_number || "" : ""
    );

  const {
    isCopied: isCopiedShipping,
    handleCopyClick: handleCopyClickShipping,
  } = useCopyToClipboardHook(
    activeOrder
      ? activeOrder?.shipping_details
        ? convertAddressToCopy(activeOrder?.shipping_details)
        : activeOrder?.customer && activeOrder?.customer?.shipping_address
        ? convertAddressToCopy(activeOrder?.customer?.shipping_address)
        : ""
      : ""
  );

  const handleDownloadShippingSlip = () => {
    if (isRestricted && isSubscriptionType != "growth") {
      handleInvoiceLimitExceeded(isSubscriptionType);
      return;
    }
    if (activeOrder) {
      window.open(activeOrder?.shipping_slip, "_blank");
    }
  };

  const checkShippingDetails = (details: any) => {
    const messages = [];

    if (!details?.country || details?.country.trim() === "") {
      messages.push("Country is empty");
    }

    if (!details?.city || details?.city.trim() === "") {
      messages.push("City is empty");
    }

    if (!details?.state || details?.state.trim() === "") {
      messages.push("State is empty");
    }

    if (!details?.phone || details?.phone.trim() === "") {
      messages.push("Phone number is empty");
    }

    return messages.length > 0 ? messages.join(", ") : "";
  };

  return (
    <>
      <PickupBookingModal
        openModal={openBookPickupModal}
        closeModal={() => {
          setOpenBookPickupModal(false);
        }}
        order={activeOrder}
      />

      <TrackShippingModal
        openModal={openTrackShipmentModal}
        closeModal={() => {
          setOpenTrackShipmentModal(false);
        }}
        order={activeOrder}
      />

      <MessageModal
        openModal={openShippingWarning}
        closeModal={() => {
          setOpenShippingWarning(false);
        }}
        title="Some details are not available"
        description={shippingWarningMessage}
        remove_icon_bg={true}
        cancelBtnText="Edit Details"
        cancelBtnAction={() => {
          setEditAddressAction("shipping");
          setEditAddressModal(true);
          setIsEditAddress(true);
        }}
        btnChild={
          <Button
            onClick={() => {
              handleDownloadShippingSlip();
            }}
            className="primary_styled_button"
            variant="contained"
          >
            Download Anyway
          </Button>
        }
      />

      <div className="shipping_status_section section">
        <div className="top_side">
          <p>Shipping</p>
          {activeOrder?.order_history && (
            <div className="flex items-center gap-2">
              {activeOrder?.status && (
                <Chip
                  color={
                    translateAutomaticShippingStatus(
                      activeOrder?.shipping_status
                    )?.color
                  }
                  label={
                    translateAutomaticShippingStatus(
                      activeOrder?.shipping_status
                    )?.label
                  }
                />
              )}
              <DropDownWrapper
                origin="right"
                closeOnChildClick
                className=" "
                action={
                  <Button className="grey_btn" endIcon={<PrimaryFillIcon />}>
                    Action
                  </Button>
                }
              >
                <div className="cover_buttons">
                  <ul className="select_list btn_list">
                    {activeOrder?.shipping_record ||
                    activeOrder?.shipping_option ? (
                      ""
                    ) : (
                      <li>
                        <Button
                          startIcon={<PackageIcon stroke="#5C636D" />}
                          onClick={() => {
                            if (activeOrder?.should_resolve === 1) {
                              showToast("Resolve Order to continue", "warning");
                            } else {
                              setOpenBookPickupModal(true);
                            }
                          }}
                        >
                          Book Pickup
                        </Button>
                      </li>
                    )}
                    {activeOrder?.shipping_record && (
                      <li>
                        <Button
                          startIcon={<GlobeIcon stroke="#5C636D" />}
                          onClick={() => {
                            setOpenTrackShipmentModal(true);
                          }}
                        >
                          Track Shipment
                        </Button>
                      </li>
                    )}
                    <li>
                      <Button
                        startIcon={<PrinterIcon stroke="#5C636D" />}
                        onClick={() => {
                          if (activeOrder?.should_resolve === 1) {
                            showToast("Resolve Order to continue", "warning");
                          } else {
                            if (activeOrder?.customer) {
                              let message = checkShippingDetails(
                                activeOrder?.shipping_details
                              );
                              if (message) {
                                setOpenShippingWarning(true);
                                setShippingWarningMessage(message);
                              } else {
                                handleDownloadShippingSlip();
                              }
                            } else {
                              showToast("Add customer details", "warning");
                              setSelectCustomerModal(true);
                            }
                          }
                        }}
                      >
                        Download Shipping Slip
                      </Button>
                    </li>
                  </ul>
                </div>
              </DropDownWrapper>
            </div>
          )}
        </div>
        <div className="bottom_side">
          {activeOrder?.shipping_record && (
            <div className="text_flex shipping-schedule">
              <p className="light">Schedule</p>
              <div className="flex gap-2 items-center">
                <p className="bold">
                  {moment(
                    new Date(activeOrder?.shipping_record?.shipment[0]?.date)
                  ).format("L")}
                </p>
                <IconButton className="icon_button_container small">
                  <BellIcon />
                </IconButton>
              </div>
            </div>
          )}
          {activeOrder?.customer && (
            <div className="address_side">
              <div className="title_flex">
                <p className="title">Address</p>
                {activeOrder?.shipping_details &&
                  (activeOrder?.shipping_details?.country ||
                    activeOrder?.shipping_details?.state ||
                    activeOrder?.shipping_details?.street ||
                    activeOrder?.shipping_details?.city) &&
                  canManageOrder &&
                  activeOrder?.order_history && (
                    <div className="address_actions">
                      <Button
                        onClick={() => {
                          if (activeOrder?.should_resolve === 1) {
                            showToast("Resolve Order to continue", "warning");
                          } else {
                            setEditAddressAction("shipping");
                            setEditAddressModal(true);
                            setIsEditAddress(true);
                          }
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          handleCopyClickShipping();
                        }}
                        type="button"
                      >
                        {isCopiedShipping ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  )}
              </div>

              <div className="address_flex">
                <p className="shipping_address">
                  {activeOrder?.shipping_details &&
                  (activeOrder?.shipping_details?.country ||
                    activeOrder?.shipping_details?.state ||
                    activeOrder?.shipping_details?.street ||
                    activeOrder?.shipping_details?.city)
                    ? convertAddress(activeOrder?.shipping_details)
                    : canManageOrder &&
                      activeOrder?.order_history && (
                        <Button
                          onClick={() => {
                            if (activeOrder?.should_resolve === 1) {
                              showToast("Resolve Order to continue", "warning");
                            } else {
                              setEditAddressAction("shipping");
                              setEditAddressModal(true);
                            }
                          }}
                          sx={{ height: "36px", marginTop: "10px" }}
                          variant="outlined"
                        >
                          Add shipping address
                        </Button>
                      )}
                </p>

                {activeOrder?.shipping_details?.zip ? (
                  <p className="zip_code">
                    Postal code:
                    <span> {activeOrder?.shipping_details?.zip}</span>
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
          )}

          <div className="select_box">
            {canManageOrder && activeOrder?.shipping_option && (
              <>
                <label>Select shipping status:</label>
                <div className="select_shippment_box">
                  {shipping_status_list.map((item, i: number) => (
                    <Button
                      key={i}
                      onClick={() => {
                        if (activeOrder?.order_history) {
                          if (activeOrder?.should_resolve !== 1) {
                            if (item.value === "DELIVERED") {
                              setOpenGeneralWarningAction("MARKASDELIVERED");
                              setOpenGeneralWarningMessage(
                                "This will send a delivery confirmation and order review email to your customer."
                              );
                              setOpenGeneralWarningModal(true);
                            } else if (item.value === "SHIPPED") {
                              setOpenGeneralWarningAction("MARKASSHIPPED");
                              setOpenGeneralWarningMessage(
                                "This will notify the customer via email that their order has been shipped."
                              );
                              setOpenGeneralWarningModal(true);
                            } else if (item.value === "RETURNED") {
                              setOpenGeneralWarningAction("MARKASRETURNED");
                              setOpenGeneralWarningMessage(
                                "This will update the status to returned, return the items to inventory, and adjust the transaction amounts accordingly."
                              );
                              setOpenGeneralWarningModal(true);
                            }
                          } else {
                            showToast("Resolve order to continue", "warning");
                          }
                        } else {
                          showToast(
                            "This action can not be taken on order history",
                            "warning"
                          );
                        }
                      }}
                      className={`${item.key} ${
                        activeOrder?.shipping_status === item.value
                          ? "active"
                          : ""
                      }`}
                    >
                      {item.key}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>

          {activeOrder?.shipping_record && (
            <div className="tracking">
              <p className="title">Tracking Number</p>
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <p>{activeOrder?.shipping_record?.tracking_number}</p>
                  <IconButton onClick={() => handleTrackingCopy()}>
                    {isTrackingCopied ? (
                      <CheckIcon stroke={"#5C636D"} />
                    ) : (
                      <CopyIcon />
                    )}
                  </IconButton>
                </div>
                <Button
                  onClick={() => {
                    setOpenTrackShipmentModal(true);
                  }}
                >
                  Track Shipment
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShippingSection;
