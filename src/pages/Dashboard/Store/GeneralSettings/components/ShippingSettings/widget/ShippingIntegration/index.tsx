import { useState } from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from "@mui/material";

import shipbubble from "assets/images/shipbubble.png";
import { ChevronRight } from "assets/Icons/ChevronRight";
import { InfoCircleXLIcon } from "assets/Icons/InfoCircleXLIcon";

import { Toggle } from "components/Toggle";
import NormalSelectField from "components/forms/NormalSelectField";
import MessageModal from "components/Modal/MessageModal";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import { ContentHeader } from "../../settings";
import { LogisticsPartnerModal } from "./LogisticsPartnerModal";
import PackageWeight from "./packageWeight";

import {
  selectShipbubbleSettingsUpdateField,
  updateShipbubbleShippingSettingState,
} from "store/slice/ShippingSettingsSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { useGetShipbubbleCategoriesQuery } from "services";

import "./style.scss";
import NormalMultipleSelectField from "components/forms/NormalMultipleSelectField";

const ShippingIntegration = () => {
  const dispatch = useAppDispatch();
  const shipbubbleShippingSettingsUpdateFields = useAppSelector(
    selectShipbubbleSettingsUpdateField
  );

  console.log(
    shipbubbleShippingSettingsUpdateFields,
    "shipbubbleShippingSettingsUpdateFields"
  );

  const [openPartner, setOpenPartner] = useState(false);
  const [openAttention, setOpenAttention] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { data, isLoading, isFetching, isError } =
    useGetShipbubbleCategoriesQuery();

  const handleAccordionChange = (checked?: boolean) => {
    if (typeof checked === "boolean") {
      setExpanded(checked);
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <>
      <div className="pd-shipping-integration-settings ">
        <FormSectionHeader title="Integration setting" />
        <div className="content_area">
          <Accordion
            className="accordion"
            expanded={expanded}
            onChange={() => {
              handleAccordionChange();
            }}
          >
            <AccordionSummary
              className="accordion_summary"
              aria-controls="panel1a-content"
              id="panel1a-header"
              expandIcon={
                <Toggle toggled={expanded} handlelick={handleAccordionChange} />
              }
            >
              <div className="content_header">
                <img alt="shipbubble" src={shipbubble} />

                <div className="text">
                  <p className="content_title">Shipbubble</p>
                  <p className="content_description">
                    Use shipbubble shipping solution at checkout
                  </p>
                </div>
              </div>
            </AccordionSummary>

            <AccordionDetails className="accordion_details">
              <div className="shipping_category">
                <div className="content_header">
                  <p className="content_title">Shipping Category</p>

                  <p className="content_description">
                    This is the type of items category you sell to your
                    customers
                  </p>
                </div>

                <NormalMultipleSelectField
                  name="categories"
                  selectOption={
                    data?.data?.length
                      ? data?.data?.map((item) => {
                          return {
                            key: item.category,
                            value: `${item.category_id}`,
                          };
                        })
                      : []
                  }
                  required={false}
                  label="Select Category"
                  value={
                    shipbubbleShippingSettingsUpdateFields?.shipping_categories
                  }
                  handleCustomChange={(val: string[]) => {
                    dispatch(
                      updateShipbubbleShippingSettingState({
                        shipping_categories: val,
                      })
                    );
                  }}
                />
              </div>

              <div className="select_location_options">
                <div
                  className="choose_flex "
                  onClick={() => {
                    setOpenPartner(true);
                  }}
                >
                  <ContentHeader
                    title="Choose logistics partner"
                    description="Your customers will see these logistics company at checkout."
                  />

                  <ChevronRight />
                </div>

                <PackageWeight />
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>

      <LogisticsPartnerModal
        openModal={openPartner}
        closeModal={() => {
          setOpenPartner(false);
        }}
      />

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
    </>
  );
};

export default ShippingIntegration;
