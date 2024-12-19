import { IconButton, TableCell } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import uuid from "react-uuid";
import { EmptyImageIcon } from "assets/Icons/EmptyImageIcon";
import { TrashIcon } from "assets/Icons/TrashIcon";
import InputField from "components/forms/InputField";
import TableComponent from "components/table";
import { ChangeEvent, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { optionType } from "./productOptionsSection";
import { SelectVariantImage } from "./SelectVariantImageModal";
import { FormSectionHeader } from "./widget/FormSectionHeader";
import { IMAGEURL } from "utils/constants/general";
import { getCurrencyFnc, mergeArraysOfVariation } from "utils";
import { BulkChangeVariationModal } from "./bulkChangeVariationModal";
import Button from "@mui/material/Button";
import { showToast, useAppSelector } from "store/store.hooks";
import ValidatedInput, {
  formatNumberWithCommas,
  removeFormattedNumerComma,
} from "components/forms/ValidatedInput";
import MessageModal from "components/Modal/MessageModal";
import { AddNewVariationModal } from "./AddNewVariationModal";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { GrowthModal } from "components/GrowthModal";
import { Toggle } from "components/Toggle";
import { IndicatorComponent } from "components/IndicatorComponent";
import { UpgradeModal } from "components/UpgradeModal";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";

type ProductMoqProps = {
  formValues: any[];
  setFormValues: any;
  handleChange: any;
  isEdit?: boolean;
  handleBulkActionButton: any;
  handleFeildsChange: any;
};

const headCell = [
  { key: "image", name: "" },
  { key: "variant", name: "Variant" },
  { key: "minimum_order_quantity", name: "Min Qty" },
  { key: "maximum_order_quantity", name: "Max Qty" },
];

export const ProductMoqVariants = ({
  isEdit,
  formValues,
  setFormValues,
  handleChange,
  handleBulkActionButton,
  handleFeildsChange,
}: ProductMoqProps) => {
  const [selected, setSelected] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const { watch } = useFormContext();
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
      <>
        {(watch("isVariantionApplied") === "Yes" || isEdit) &&
        formValues?.length ? (
          <Accordion
            className="accordion"
            expanded={expanded}
            onChange={() => {
              handleAccordionChange();
            }}
          >
            <AccordionSummary
              className={`accordion_summary less_margin`}
              expandIcon={
                <Toggle toggled={expanded} handlelick={handleAccordionChange} />
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
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
            <AccordionDetails className="less_margin_details">
              <div className="pd_product_variation">
                <div className="variation_table">
                  <TableComponent
                    isLoading={false}
                    showPagination={false}
                    headCells={headCell}
                    headCellChild={
                      <>
                        {headCell?.map((cell) => {
                          return (
                            <TableCell
                              className="truncate"
                              key={cell.key}
                              align={"left"}
                              padding={"normal"}
                            >
                              {cell.key === "minimum_order_quantity" ||
                              cell.key === "maximum_order_quantity" ? (
                                <div className="flex items-center gap-4">
                                  <p>{cell.name}</p>
                                  <Button
                                    onClick={() => {
                                      handleBulkActionButton(
                                        `Input ${cell.name}`,
                                        `${cell.key}`
                                      );
                                    }}
                                  >
                                    Add In Bulk
                                  </Button>
                                </div>
                              ) : (
                                cell.name
                              )}
                            </TableCell>
                          );
                        })}
                      </>
                    }
                    setSelected={setSelected}
                    tableData={formValues.map((item, i) => ({
                      variant: item.variant,
                      image: (
                        <div className={`image_details`}>
                          {item.image ? (
                            <img
                              src={`${IMAGEURL}${item.image}`}
                              alt="variation"
                            />
                          ) : (
                            <EmptyImageIcon />
                          )}
                        </div>
                      ),
                      minimum_order_quantity: (
                        <InputField
                          value={item.minimum_order_quantity}
                          onChange={handleFeildsChange(
                            "minimum_order_quantity",
                            i,
                            true
                          )}
                          type={"text"}
                          extraClass={"price"}
                        />
                      ),
                      maximum_order_quantity: (
                        <InputField
                          value={item.maximum_order_quantity}
                          onChange={handleFeildsChange(
                            "maximum_order_quantity",
                            i,
                            true
                          )}
                          type={"text"}
                          extraClass={"price"}
                        />
                      ),
                      id: item.id,
                    }))}
                  />
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        ) : (
          ""
        )}
      </>
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
