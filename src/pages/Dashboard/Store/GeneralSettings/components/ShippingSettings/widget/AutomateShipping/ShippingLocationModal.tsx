import { useState } from "react";

import Button from "@mui/material/Button";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { Toggle } from "components/Toggle";
import InputField from "components/forms/InputField";
import { ContentHeader } from "../../settings";

import {
  selectSettingsUpdateField,
  updateShippingSettingState,
} from "store/slice/ShippingSettingsSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";

import "./style.scss";

type ModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const AllLocation = () => {
  const dispatch = useAppDispatch();

  const [expanded, setExpanded] = useState<boolean>(false);

  const shippingSettingsUpdateFields = useAppSelector(
    selectSettingsUpdateField
  );

  let expandedToggle =
    shippingSettingsUpdateFields?.automated_shipping_location_type ===
    "blacklist"
      ? true
      : false;

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  const handleToggleChange = (checked: boolean) => {
    if (!checked) {
      dispatch(
        updateShippingSettingState({
          automated_shipping_location_type: "blacklist",
        })
      );
      setExpanded(true);
    }
  };

  return (
    <Accordion
      className="accordion single_location_section"
      expanded={expanded}
      onChange={handleAccordionChange}
    >
      <AccordionSummary
        className="accordion_summary"
        aria-controls="panel1a-content"
        id="panel1a-header"
        expandIcon={
          <Toggle toggled={expandedToggle} handlelick={handleToggleChange} />
        }
      >
        <ContentHeader
          title="All locations except"
          description=" Blacklist locations you’re not shipping to"
        />
      </AccordionSummary>

      <AccordionDetails className="accordion_details">
        <div className="location_input_section">
          <InputField
            name="type"
            label="Location"
            placeholder="Enter Location"
          />
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export const SpecificLocation = () => {
  const dispatch = useAppDispatch();

  const [expanded, setExpanded] = useState<boolean>(false);

  const shippingSettingsUpdateFields = useAppSelector(
    selectSettingsUpdateField
  );
  let expandedToggle =
    shippingSettingsUpdateFields?.automated_shipping_location_type ===
    "whitelist"
      ? true
      : false;

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  const handleToggleChange = (checked: boolean) => {
    if (!checked) {
      dispatch(
        updateShippingSettingState({
          automated_shipping_location_type: "whitelist",
        })
      );
      setExpanded(true);
    }
  };

  return (
    <Accordion
      className="accordion single_location_section"
      expanded={expanded}
      onChange={handleAccordionChange}
    >
      <AccordionSummary
        className="accordion_summary"
        aria-controls="panel1a-content"
        id="panel1a-header"
        expandIcon={
          <Toggle toggled={expandedToggle} handlelick={handleToggleChange} />
        }
      >
        <ContentHeader
          title="Specific locations"
          description="Ship to specific locations"
        />
      </AccordionSummary>

      <AccordionDetails className="accordion_details">
        <div className="location_input_section">
          <InputField
            name="type"
            label="Location"
            placeholder="Enter Location"
          />
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export const ShippingLocationModal = ({
  openModal,
  closeModal,
}: ModalProps) => {
  const dispatch = useAppDispatch();

  const shippingSettingsUpdateFields = useAppSelector(
    selectSettingsUpdateField
  );

  return (
    <>
      <ModalRight
        closeOnOverlayClick={false}
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children automated_shipping_modal location_modal">
          <div className="top_section" id="scroller_top">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              title={"Automated Shipping Location"}
              children={
                <p className="modal_description">
                  Agile business intelligence in the cloud for everyone. Learn
                  what can be the best central tool for your entire team. Watch
                  now
                </p>
              }
            />

            <div className="location_toggle_section">
              <div className="single_location_section flex_box">
                <ContentHeader
                  title="All locations worldwide"
                  description=" This means you can deliver to anywhere in the world"
                />

                <Toggle
                  toggled={
                    shippingSettingsUpdateFields?.automated_shipping_location_type ===
                    "all"
                      ? true
                      : false
                  }
                  handlelick={() => {
                    dispatch(
                      updateShippingSettingState({
                        automated_shipping_location_type: "all",
                      })
                    );
                  }}
                />
              </div>

              <AllLocation />

              <SpecificLocation />
            </div>
          </div>

          <div className="bottom_section">
            <Button type="button" className="cancel" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="button" className="save" onClick={() => {}}>
              Save changes
            </Button>
          </div>
        </div>
      </ModalRight>
    </>
  );
};
