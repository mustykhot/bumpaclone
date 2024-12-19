import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { LargeWarningIcon } from "assets/Icons/LargeWarningIcon";
import ConfirmDeleteModal from "pages/Dashboard/Location/DeleteLocation/ConfirmDeleteModal";
import { useEffect, useState } from "react";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { useFormContext } from "react-hook-form";
import { optionType } from "./productOptionsSection";
const optionList = [
  { value: "No", label: "No, it doesn’t" },
  { value: "Yes", label: "Yes it has " },
];
const AskIsVariation = ({
  options,
  setOptions,
}: {
  options: optionType[] | [];
  setOptions: React.Dispatch<React.SetStateAction<[] | optionType[]>>;
}) => {
  const { setValue, watch } = useFormContext();
  const [radioValue, setRadioValue] = useState<string>(
    watch("isVariantionApplied")
  );
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const handleChange = (val: string) => {
    if (val === "Yes") {
      setValue("isVariantionApplied", "Yes");
      setRadioValue("Yes");
    } else {
      if (watch("variations")?.length) {
        setOpenWarningModal(true);
      } else {
        setValue("isVariantionApplied", "No");
        setRadioValue("No");
        setValue("variations", []);
        setValue("options", []);
        setOptions([]);
      }
    }
  };
  useEffect(() => {
    setRadioValue(watch("isVariantionApplied"));
  }, [watch("isVariantionApplied")]);

  return (
    <>
      <div className="pd_ask_variation">
        <div className="ask_question">Does this product have variations?</div>
        <div className="check_box_container flex gap-4">
          {optionList.map((item) => (
            <div className="flex items-center gap-2" key={item.value}>
              <Checkbox
                onClick={() => {
                  handleChange(item.value);
                }}
                checked={item.value === radioValue}
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<RadioButtonCheckedIcon />}
              />
              <p
                onClick={() => {
                  handleChange(item.value);
                }}
                className="cursor-pointer"
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
        {watch("isVariantionApplied") === "Yes" && (
          <div className="flex gap-[6px]  items-center">
            <InfoCircleIcon />
            <p className="text-[#848D99] text-[12px]">
              Prices and quantity will be added in the variation section
            </p>
          </div>
        )}
      </div>
      <ConfirmDeleteModal
        openModal={openWarningModal}
        closeModal={() => {
          setOpenWarningModal(false);
        }}
        icon={<LargeWarningIcon />}
        btnAction={() => {
          setValue("isVariantionApplied", "No");
          setRadioValue("No");
          setValue("variations", []);
          setValue("options", []);
          setOptions([]);
          setOpenWarningModal(false);
        }}
        description_text="Cnnfirming this will remove all variations"
        title="Confirm action"
        btnText="Yes, Continue"
      />
    </>
  );
};

export default AskIsVariation;
