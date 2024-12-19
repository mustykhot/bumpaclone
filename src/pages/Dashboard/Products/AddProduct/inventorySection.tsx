import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ValidatedInput from "components/forms/ValidatedInput";
import { Toggle } from "components/Toggle";
import SelectField from "components/forms/SelectField";
import { useFormContext } from "react-hook-form";
import MultipleSelectField from "components/forms/MultipleSelectField";
import {
  selectCurrentUser,
  selectUserAssignedLocation,
  selectUserLocation,
} from "store/slice/AuthSlice";
import { useAppSelector } from "store/store.hooks";
import { useGetLocationsQuery } from "services";
import { GrowthModal } from "components/GrowthModal";

const unitList = [
  {
    value: "pc",
    key: "pc",
  },
  {
    value: "box",
    key: "box",
  },
  {
    value: "pack",
    key: "pack",
  },
  {
    value: "pair",
    key: "pair",
  },
  {
    value: "bag",
    key: "bag",
  },
  {
    value: "cm",
    key: "cm",
  },
  {
    value: "feet",
    key: "feet",
  },
  {
    value: "g",
    key: "g",
  },
  {
    value: "in",
    key: "in",
  },
  {
    value: "kg",
    key: "kg",
  },
  {
    value: "km",
    key: "km",
  },
  {
    value: "lb",
    key: "lb",
  },
  {
    value: "mg",
    key: "mg",
  },
  {
    value: "yard",
    key: "yard",
  },
  {
    value: "portion",
    key: "portion",
  },
  {
    value: "bowl",
    key: "bowl",
  },
  {
    value: "bottle",
    key: "bottle",
  },
  {
    value: "plate",
    key: "plate",
  },
  {
    value: "carton",
    key: "carton",
  },
];
type ComponentType = {
  setCheckStockToVariation?: (val: boolean) => void;
  checkStockToVariation?: boolean;
  isEdit?: boolean;
};

export const InventorySection = ({
  checkStockToVariation,
  setCheckStockToVariation,
  isEdit,
}: ComponentType) => {
  const { setValue, watch } = useFormContext();
  const [diabled, setDisabled] = useState(false);
  const [openGrowthModal, setOpenGrowthModal] = useState(false);
  const userLocation = useAppSelector(selectUserLocation);
  const user = useAppSelector(selectCurrentUser);
  const assignedLocations = useAppSelector(selectUserAssignedLocation);
  const {
    data: locationData,
    isLoading: loadLocation,
    isFetching: isFetchingLocatio,
    isError: isErrorLocation,
  } = useGetLocationsQuery();
  useEffect(() => {
    setValue("unit", "pc");
  }, []);
  useEffect(() => {
    setValue("location_ids", [`${userLocation?.id}`]);
  }, []);

  useEffect(() => {
    let variations = watch("variations");
    if (variations && variations?.length) {
      let totalQuantity = variations.reduce((acc: any, current: any) => {
        const age = parseInt(current.stock, 10);
        if (!isNaN(age)) {
          return acc + age;
        } else {
          return acc;
        }
      }, 0);
      setValue("stock_from_variation", totalQuantity);
    }
  }, [watch("variations")]);

  return (
    <div className="extra_sections">
      <Accordion className="accordion" expanded={true}>
        <AccordionSummary
          className="accordion_summary"
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <p>Product Inventory</p>
        </AccordionSummary>
        <AccordionDetails>
          <div className="form-group-flex">
            {isEdit
              ? ""
              : watch("isVariantionApplied") === "No" && (
                  <ValidatedInput
                    name="stock"
                    label="Stock Quantity"
                    placeholder="Enter quantity"
                    formatValue={true}
                    type={"number"}
                  />
                )}

            {isEdit ? (
              ""
            ) : Number(user?.is_staff) === 0 ? (
              <MultipleSelectField
                name="location_ids"
                selectOption={
                  locationData
                    ? locationData?.data?.length
                      ? locationData?.data?.map((item: any) => {
                          return {
                            key: item.name,
                            value: `${item.id}`,
                          };
                        })
                      : []
                    : []
                }
                required={false}
                label="Select Product Locations"
              />
            ) : assignedLocations?.length > 1 ? (
              <MultipleSelectField
                name="location_ids"
                selectOption={
                  assignedLocations
                    ? assignedLocations?.length
                      ? assignedLocations?.map((item: any) => {
                          return {
                            key: item.name,
                            value: `${item.id}`,
                          };
                        })
                      : []
                    : []
                }
                required={false}
                label="Select Product Locations"
              />
            ) : (
              ""
            )}
          </div>
          <div className="form-group-flex">
            <SelectField
              name="unit"
              label="Unit"
              required={false}
              selectOption={unitList}
              placeholder="Select Unit"
            />
            {watch("isVariantionApplied") === "No" && (
              <ValidatedInput
                name="weight_kg"
                label="Weight"
                type={"text"}
                required={false}
              />
            )}
          </div>

          {watch("isVariantionApplied") === "No" && !isEdit && (
            <ValidatedInput
              name="barcode"
              label="Barcode"
              required={false}
              placeholder="Focus to scan barcode"
              extramessage={
                <p className="focus_scan">Focus here to scan barcode</p>
              }
              openUpgradeModal={openGrowthModal}
              setOpenUpgradeModal={setOpenGrowthModal}
            />
          )}
        </AccordionDetails>
      </Accordion>
      <GrowthModal
        openModal={openGrowthModal}
        closeModal={() => {
          setOpenGrowthModal(false);
        }}
        title={`Generate barcodes easily on the Growth Plan`}
        subtitle={`Get better inventory tracking when you use Bumpa’s barcode generator.`}
        growthFeatures={[
          "Generate barcodes for better inventory tracking",
          "Upload business logo on website",
          "Create unique barcodes for your products & sell faster.",
        ]}
        buttonText={`Upgrade to Growth`}
        eventName="scan-barcode"
      />
    </div>
  );
};
