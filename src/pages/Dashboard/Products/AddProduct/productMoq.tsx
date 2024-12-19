import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ValidatedInput from "components/forms/ValidatedInput";
import { Toggle } from "components/Toggle";
import { useFormContext } from "react-hook-form";
import { IndicatorComponent } from "components/IndicatorComponent";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import { useAppSelector } from "store/store.hooks";
import { UpgradeModal } from "components/UpgradeModal";

type ComponentType = {
  isEdit?: boolean;
};

export const ProductMoq = ({ isEdit }: ComponentType) => {
  const { setValue, watch } = useFormContext();
  const [expanded, setExpanded] = useState<boolean>(false);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);

  const handleAccordionChange = (checked?: boolean) => {
    const shouldOpenUpgradeModal =
      isSubscriptionExpired ||
      isSubscriptionType === "free" ||
      isSubscriptionType === "starter";

    if (typeof checked === "boolean") {
      if (checked === false && shouldOpenUpgradeModal) {
        setOpenUpgradeModal(true);
      } else {
        setExpanded(checked);
      }
    } else {
      if (expanded === false && shouldOpenUpgradeModal) {
        setOpenUpgradeModal(true);
      } else {
        setExpanded(!expanded);
      }
    }
  };

  return (
    <>
      <div className="extra_sections">
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
            <div className="flex items-center">
              <p>Order Quantity</p>
              <IndicatorComponent
                hover={true}
                text={
                  " This sets the minimum and/or maximum number of items a customer can purchase in a single order. You can set one or both values"
                }
              />
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="form-group-flex">
              <ValidatedInput
                name="minimum_order_quantity"
                label="Minimum Order Quantity"
                placeholder="Enter minimum Quantity"
                formatValue={true}
                type={"number"}
                required={false}
                extraindicator="Minimum quantity required per order."
              />

              <ValidatedInput
                name="maximum_order_quantity"
                label="Maximum  Order Quantity"
                placeholder="Enter maximum order quantity"
                formatValue={true}
                type={"number"}
                required={false}
                extraindicator="Maximum quantity allowed per order."
                rules={{
                  validate: (value) => {
                    if (value) {
                      return (
                        Number(value) >
                          Number(watch("minimum_order_quantity")) ||
                        "Maximum order quantity should be greater than minimum"
                      );
                    }
                  },
                }}
              />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      {openUpgradeModal && (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => setOpenUpgradeModal(false)}
          pro={true}
          title={`Add MOQ and MaxOQ to your website!`}
          subtitle={`Manage wholesales easily with MOQs`}
          eventName="moq"
        />
      )}
    </>
  );
};
