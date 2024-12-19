import { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ValidatedInput from "components/forms/ValidatedInput";
import { Checkbox } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { Toggle } from "components/Toggle";

const label = { inputProps: { "aria-label": "Switch demo" } };
export const PricingSection = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [checked, setChecked] = useState(true);
  const { setValue } = useFormContext();

  useEffect(() => {
    setValue("addDiscount", checked);
  }, [checked, setValue]);

  const handleChange = (checked?: boolean) => {
    if (checked === true || checked === false) {
      setExpanded(checked);
    } else {
      setExpanded(!expanded);
    }
  };
  return (
    <div className="pricing_section extra_sections">
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
          <p>Product Pricing</p>
        </AccordionSummary>
        <AccordionDetails>
          <div className="form-group-flex">
            <ValidatedInput name="price" label="Pricing" type={"number"} />
            <ValidatedInput
              name="discount"
              required={false}
              max={100}
              label="Discount"
              type={"number"}
            />
          </div>
          <div className="tax">
            <Checkbox
              checked={checked}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setChecked(e.target.checked);
              }}
            />
            <p>Charge tax on this product</p>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
