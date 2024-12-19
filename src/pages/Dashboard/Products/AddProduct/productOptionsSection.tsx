import { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { IndicatorComponent } from "components/IndicatorComponent";
import { useFormContext } from "react-hook-form";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { AddProductOptionsModal } from "./productOptionModal";
import { IconButton } from "@mui/material";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { ProductVariation } from "./productVariation";
import { Toggle } from "components/Toggle";

export type optionType = {
  name: string;
  values: string[];
  id: string;
};
type ComponentType = {
  options: optionType[] | [];
  setOptions: React.Dispatch<React.SetStateAction<[] | optionType[]>>;
  defaultVariations?: any[] | null;
  checkDiscountToVariation?: boolean;
  checkStockToVariation?: boolean;
  checkPriceToVariation?: boolean;
  isEdit?: boolean;
  variationsPendingEdit?: any;
  optionsPendingEdit?: optionType[] | [];
};
export const ProductOptionSection = ({
  options,
  setOptions,
  defaultVariations,
  checkDiscountToVariation,
  checkStockToVariation,
  checkPriceToVariation,
  variationsPendingEdit,
  optionsPendingEdit,
  isEdit,
}: ComponentType) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [openAddOptionModal, setOpenAddOptionModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<optionType | null>(null);
  const [editType, setEditType] = useState("");
  const { setValue, watch } = useFormContext();
  const removeOption = (id: string) => {
    const newArray = options.filter((item) => item.id !== id);
    setOptions(newArray);
  };

  const handleChange = (checked?: boolean) => {
    if (checked === true || checked === false) {
      setExpanded(checked);
    } else {
      setExpanded(!expanded);
    }
    if (!checked && !options?.length && !isEdit) {
      setOpenAddOptionModal(true);
    }
  };

  useEffect(() => {
    setValue("options", options);
  }, [options, setValue]);

  return (
    <div className="extra_sections">
      <AddProductOptionsModal
        openModal={openAddOptionModal}
        options={options}
        setOptions={setOptions}
        setSelectedOption={setSelectedOption}
        selectedOption={selectedOption}
        removeOption={removeOption}
        editType={editType}
        setEditType={setEditType}
        isEdit={isEdit}
        variationsPendingEdit={variationsPendingEdit}
        optionsPendingEdit={optionsPendingEdit}
        closeModal={() => {
          setOpenAddOptionModal(false);
          setSelectedOption(null);
        }}
      />

      <Accordion
        className="accordion"
        expanded={expanded}
        onChange={() => {
          handleChange();
        }}
      >
        <AccordionSummary
          className="accordion_summary"
          expandIcon={<Toggle toggled={expanded} handlelick={handleChange} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className="flex items-center">
            <p>Product Options</p>
            {/* <IndicatorComponent hover={true} text={"hello"} /> */}
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="product_option_section">
            <>
              {options?.map((item, i) => {
                return (
                  <div className="single_option_display" key={i}>
                    <p className="title">{item.name}</p>
                    <div className="item_container_flex">
                      <div className="item_container">
                        {item.values.map((value, i) => (
                          <div key={i} className="single_option">
                            <p>{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="action_container">
                        <Button
                          onClick={() => {
                            setEditType("edit");
                            setSelectedOption({
                              name: item.name,
                              values: item.values,
                              id: item.id,
                            });
                            setOpenAddOptionModal(true);
                          }}
                          variant="outlined"
                        >
                          Edit
                        </Button>
                        {isEdit ? (
                          variationsPendingEdit?.length ? (
                            ""
                          ) : (
                            <IconButton
                              onClick={() => {
                                removeOption(item.id);
                              }}
                              className="icon_button_container pad"
                            >
                              <TrashIcon />
                            </IconButton>
                          )
                        ) : (
                          <IconButton
                            onClick={() => {
                              removeOption(item.id);
                            }}
                            className="icon_button_container pad"
                          >
                            <TrashIcon />
                          </IconButton>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isEdit ? (
                variationsPendingEdit?.length ? (
                  ""
                ) : (
                  <Button
                    onClick={() => {
                      setOpenAddOptionModal(true);
                    }}
                    variant="outlined"
                    startIcon={<AddIcon />}
                  >
                    Add Option
                  </Button>
                )
              ) : (
                <Button
                  onClick={() => {
                    setOpenAddOptionModal(true);
                  }}
                  variant="outlined"
                  startIcon={<AddIcon />}
                >
                  Add Option
                </Button>
              )}
            </>
          </div>
        </AccordionDetails>
      </Accordion>

      <ProductVariation
        options={options}
        defaultVariations={defaultVariations}
        checkDiscountToVariation={checkDiscountToVariation}
        checkPriceToVariation={checkPriceToVariation}
        checkStockToVariation={checkStockToVariation}
        isEdit={isEdit}
        editType={editType}
        setEditType={setEditType}
        variationsPendingEdit={variationsPendingEdit}
      />
    </div>
  );
};
