import Modal from "components/Modal";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { PercentIcon } from "assets/Icons/PercentIcon";
import InputField from "components/forms/InputField";
import { NairaIcon } from "assets/Icons/NairaIcon";
import "./style.scss";
import { formatNumberWithCommas } from "components/forms/ValidatedInput";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { IconButton, MenuItem, Select } from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";
import uuid from "react-uuid";
import NormalSelectField from "components/forms/NormalSelectField";
import { MinusIcon } from "assets/Icons/MinusIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { ConfirmAdditionModal } from "./ConfirmAdditionModal";
type BulkChangeVariationModalProps = {
  openModal: boolean;
  closeModal: () => void;
  existingVariantList: any[];
  possibleVariantList: any[];
  optionList: any[];
  setFormValues: any;
};

const SingleVariationLine = ({
  line,
  trackingId,
  removeFromLineList,
  existingVariantList,
  setFormulatedVariants,
  formulatedVariant,
}: {
  line: any;
  trackingId: string;
  removeFromLineList: (id: string) => void;
  existingVariantList: any[];
  setFormulatedVariants: any;
  formulatedVariant: { name: string; id: string; errorText: string }[];
}) => {
  const [selectedOptions, setSelectedOptions] = useState<any>(null);
  const [isError, setIsError] = useState(false);
  const onChangeSelect = (value: any, option: any) => {
    setSelectedOptions({ ...selectedOptions, [option]: value });
  };

  useEffect(() => {
    if (selectedOptions) {
      if (Object.keys(selectedOptions).length === line?.length) {
        let variant: string[] = [];
        let errorText: string = "";
        line?.forEach((option: any) => {
          variant.push(selectedOptions[option.name]);
        });
        let finalVariant = variant.join("-");
        let checkList = existingVariantList.filter(
          (item: any) =>
            item.variant.toLowerCase() === finalVariant.toLowerCase()
        );
        if (checkList.length) {
          setIsError(true);
          errorText = "error";
        } else {
          const existingItem = formulatedVariant.find(
            (item) => item.name.toLowerCase() === finalVariant.toLowerCase()
          );
          if (existingItem) {
            setIsError(true);
            errorText = "error";
          } else {
            setIsError(false);
            errorText = "";
          }
        }

        const updatedFormulatedVariant = [...formulatedVariant];
        const index = updatedFormulatedVariant.findIndex(
          (item) => item.id === trackingId
        );
        if (index !== -1) {
          updatedFormulatedVariant[index] = {
            id: trackingId,
            name: finalVariant,
            errorText: errorText,
          };
        } else {
          updatedFormulatedVariant.push({
            id: trackingId,
            name: finalVariant,
            errorText: errorText,
          });
        }
        setFormulatedVariants(updatedFormulatedVariant);
      }
    }
  }, [selectedOptions]);

  return (
    <div className="pd_single_variant_line">
      <div className="top_side">
        {line?.map((option: any) => (
          <Select
            displayEmpty
            value={
              selectedOptions && selectedOptions[option?.name]
                ? selectedOptions[option?.name]
                : ""
            }
            onChange={(e) => {
              onChangeSelect(e.target.value, option?.name);
            }}
            className="my-select dark"
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem disabled value="">
              {option?.name}
            </MenuItem>
            {option && option?.values?.length
              ? option?.values?.map((el: any, i: number) => (
                  <MenuItem key={i} value={el}>
                    {el}
                  </MenuItem>
                ))
              : []}
          </Select>
        ))}
      </div>
      {isError && (
        <div className="error_area">
          <p className="error">
            This variation already exist, It can not be added
          </p>
        </div>
      )}
    </div>
  );
};

export const AddNewVariationModal = ({
  closeModal,
  openModal,
  existingVariantList = [],
  possibleVariantList = [],
  optionList,
  setFormValues,
}: BulkChangeVariationModalProps) => {
  const [formulatedVariant, setFormulatedVariants] = useState<
    { name: string; id: string; errorText: string }[]
  >([]);
  const [defaultObj, setDefaultObj] = useState<any>(null);
  const [lineList, setLineList] = useState<any[]>([]);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  useEffect(() => {
    if (optionList?.length) {
      setDefaultObj(
        optionList.map((item) => {
          return {
            ...item,
          };
        })
      );
    }
  }, [optionList]);

  const addToLineList = () => {
    setLineList((prev: any) => {
      return [...prev, { line: defaultObj, trackingId: `${uuid()}` }];
    });
  };
  const removeFromLineList = (id: string) => {
    const filteredList = lineList.filter((item: any) => item.trackingId !== id);
    setLineList(filteredList);
  };
  useEffect(() => {
    if (defaultObj?.length) {
      setLineList([{ line: defaultObj, trackingId: `${uuid()}` }]);
    }
  }, [defaultObj]);
  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={() => {
          closeModal();
          setFormulatedVariants([]);
        }}
      >
        <div className="add_new_variation_modal_container">
          <div className="title_section">
            <div className="text_side">
              <div className="title_block">
                <h4>Add New Product Variations</h4>
                <IconButton
                  type="button"
                  onClick={() => {
                    closeModal();
                    setFormulatedVariants([]);
                  }}
                  className="icon_button_container"
                >
                  <XIcon />
                </IconButton>
              </div>
              <div className="explain">
                <InfoCircleIcon />
                <p>
                  Variations that already exist cannot be added so you won’t be
                  able to select them.
                </p>
              </div>
            </div>
          </div>
          <div className="cover_container">
            <div className="variation_heading">
              <p>Product Variations</p>
            </div>
            <div className="variation_listings">
              {lineList?.length
                ? lineList?.map((item: any) => (
                    <SingleVariationLine
                      line={item.line}
                      key={item.trackingId2}
                      trackingId={item.trackingId}
                      removeFromLineList={removeFromLineList}
                      existingVariantList={existingVariantList}
                      setFormulatedVariants={setFormulatedVariants}
                      formulatedVariant={formulatedVariant}
                    />
                  ))
                : ""}
            </div>
            {possibleVariantList.length - existingVariantList.length <=
            lineList.length ? (
              ""
            ) : (
              <Button
                onClick={() => {
                  addToLineList();
                }}
                startIcon={<PlusIcon stroke="#009444" />}
                className="add_variant"
              >
                Add another Variation
              </Button>
            )}
          </div>
          <div className="button_section">
            <Button
              onClick={() => {
                setFormulatedVariants([]);
                closeModal();
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              disabled={
                !formulatedVariant.filter((item) => item.errorText !== "error")
                  .length
              }
              className={`add ${
                formulatedVariant.filter((item) => item.errorText !== "error")
                  .length
                  ? ""
                  : "disable"
              }`}
              variant="contained"
              onClick={() => {
                setOpenConfirmModal(true);
              }}
            >
              Add Variation
            </Button>
          </div>
        </div>
      </Modal>
      <ConfirmAdditionModal
        openModal={openConfirmModal}
        setFormValues={setFormValues}
        closeModal={() => {
          setOpenConfirmModal(false);
        }}
        closeParentModal={() => {
          closeModal();
        }}
        formulatedVariant={formulatedVariant}
      />
    </>
  );
};
