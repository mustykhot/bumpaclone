import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
} from "@mui/material";

import { InfoCircleXLIcon } from "assets/Icons/InfoCircleXLIcon";
import { ChevronRight } from "assets/Icons/ChevronRight";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";

import InputField from "components/forms/InputField";
import { Toggle } from "components/Toggle";
import MessageModal from "components/Modal/MessageModal";
import { ContentHeader } from "../../settings";
import { PickupModal } from "../PickupModal";
import { ShippingLocationModal } from "./ShippingLocationModal";

import {
  selectSettingsUpdateField,
  updateShippingSettingState,
} from "store/slice/ShippingSettingsSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";

import "./style.scss";

const logisticsOptionList = [
  { name: "Pick-Up", value: "pickup" },
  { name: "Drop-Off", value: "drop-off" },
];

const AutomateShipping = () => {
  const dispatch = useAppDispatch();
  const shippingSettingsUpdateFields = useAppSelector(
    selectSettingsUpdateField
  );

  const [openPickup, setOpenPickup] = useState(false);
  const [openAttention, setOpenAttention] = useState(false);
  const [openShippingLocation, setOpenShippingLocation] = useState(false);

  const handleAccordionChange = (checked?: boolean) => {
    if (typeof checked === "boolean") {
      dispatch(updateShippingSettingState({ automated_shipping: checked }));
    } else {
      dispatch(
        updateShippingSettingState({
          automated_shipping: !shippingSettingsUpdateFields?.automated_shipping,
        })
      );
    }
  };

  return (
    <>
      <div className="pd_automate_shipping ">
        <div className="content_area">
          <Accordion
            className="accordion"
            expanded={shippingSettingsUpdateFields?.automated_shipping}
            onChange={() => {
              handleAccordionChange();
            }}
          >
            <AccordionSummary
              className="accordion_summary"
              aria-controls="panel1a-content"
              id="panel1a-header"
              expandIcon={
                <Toggle
                  toggled={
                    shippingSettingsUpdateFields?.automated_shipping || false
                  }
                  handlelick={handleAccordionChange}
                />
              }
            >
              <div className="content_header">
                <div className="text">
                  <p className="content_title">Automated Shipping</p>

                  <p className="content_description">
                    Click here to turn on automated shipping{" "}
                  </p>
                </div>
              </div>
            </AccordionSummary>

            <AccordionDetails className="accordion_details">
              <div className="select_location_options">
                <div
                  className="choose_flex"
                  onClick={() => {
                    setOpenPickup(true);
                  }}
                >
                  <ContentHeader
                    title="Dispatch Pick-up Location"
                    description="This is where dispatch riders will come to pick-up the items"
                  />

                  <ChevronRight />
                </div>

                {/* <div
                  className="choose_flex"
                  onClick={() => {
                    setOpenShippingLocation(true);
                  }}
                >
                  <ContentHeader
                    title="Choose Location for Automated Shipping "
                    description="You can selected which stores you want automated shipping to be applied to."
                  />

                  <ChevronRight />
                </div> */}

                <div className="default-weight">
                  <ContentHeader
                    title="Default Package Weight"
                    description="This is the default weight that your product will fallback to when weight is missing."
                  />

                  <InputField
                    label="Fallback Weight"
                    suffix={<p className="kg">Kg</p>}
                    type="number"
                    value={shippingSettingsUpdateFields?.default_weight_kg}
                    onChange={(e) => {
                      dispatch(
                        updateShippingSettingState({
                          default_weight_kg: `${e.target.value}`,
                        })
                      );
                    }}
                  />
                </div>

                <div className="pickup_or_dropoff">
                  <ContentHeader
                    title="Pickup / Drop off"
                    description="This settings shows if you want the dispatch rider to come to your pickup location or you want it drop item at their office."
                  />

                  <div className="pickup_or_dropoff_select">
                    {logisticsOptionList.map((item) => (
                      <div
                        className={`singlePickOption ${
                          item.value ===
                          shippingSettingsUpdateFields?.shipping_mode
                            ? "active"
                            : ""
                        }`}
                        onClick={(e) => {
                          dispatch(
                            updateShippingSettingState({
                              shipping_mode: item.value,
                            })
                          );
                        }}
                      >
                        <Checkbox
                          checked={
                            item.value ===
                            shippingSettingsUpdateFields?.shipping_mode
                          }
                        />
                        {item.name}
                      </div>
                    ))}
                  </div>

                  <div className="indicate_pickup">
                    <InfoCircleIcon />

                    <p>
                      Dispatch rider will come to your pick-up location to pick
                      up the item. <span>Add pick-up location</span>
                    </p>
                  </div>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>

      <MessageModal
        openModal={openAttention}
        closeModal={() => {
          setOpenAttention(false);
        }}
        title="Attention"
        icon={<InfoCircleXLIcon stroke="#5C636D" />}
        description="For automated shipping to work, you must add weight to all of your products."
        hideCancel
        btnChild={
          <Button
            onClick={() => {
              setOpenAttention(false);
            }}
            variant="contained"
            className="primary_styled_button"
          >
            Yes, I understand
          </Button>
        }
      />

      <PickupModal
        openModal={openPickup}
        type={"dispatch"}
        closeModal={() => {
          setOpenPickup(false);
        }}
      />

      <ShippingLocationModal
        openModal={openShippingLocation}
        closeModal={() => {
          setOpenShippingLocation(false);
        }}
      />
    </>
  );
};

export default AutomateShipping;
