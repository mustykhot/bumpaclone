import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ClearIcon } from "assets/Icons/ClearIcon";
import { PlusCircleIcon } from "assets/Icons/PlusCircleIcon";
import ValidatedInput from "components/forms/ValidatedInput";
import { formatPhoneNumber, validatePhoneNumber } from "utils";
import { GetTerminalModalField } from ".";

type StepThreeProps = {
  onSubmit: (data: GetTerminalModalField) => void;
  isLoading: boolean;
};

export const StepThree = ({ onSubmit, isLoading }: StepThreeProps) => {
  const { watch, setValue, trigger, getValues, clearErrors } = useFormContext();
  const [visibleInputs, setVisibleInputs] = useState(1);

  const phoneNumbers = watch("whatsapp_numbers") || [];

  const hasValidNumber =
    phoneNumbers.some(
      (number: string) => number && validatePhoneNumber(number, false) === true
    ) &&
    !phoneNumbers.some((number: string) => {
      return (
        number &&
        number.trim() !== "" &&
        validatePhoneNumber(number, false) !== true
      );
    });

  const handleFormSubmit = () => {
    const currentNumbers = getValues("whatsapp_numbers");

    clearErrors("whatsapp_numbers");

    const formattedNumbers = currentNumbers
      .filter((number: string) => number && number.trim() !== "")
      .filter((number: string) => validatePhoneNumber(number, false) === true)
      .map((number: string) => formatPhoneNumber(number));

    if (formattedNumbers.length > 0) {
      onSubmit({ whatsapp_numbers: formattedNumbers });
    }
  };

  const handlePhoneNumberChange = (index: number, value: string) => {
    let inputValue = value;

    if (inputValue.startsWith("234") && !inputValue.startsWith("+234")) {
      inputValue = "+234" + inputValue.slice(3);
    }

    setValue(`whatsapp_numbers.${index}`, inputValue);

    if (!inputValue.trim()) {
      clearErrors(`whatsapp_numbers.${index}`);
    } else {
      trigger(`whatsapp_numbers.${index}`);
    }
  };

  const handleAddNumber = () => {
    if (visibleInputs < 5) {
      setVisibleInputs((prev) => prev + 1);
    }
  };

  const handleRemoveNumber = (index: number) => {
    setValue(`whatsapp_numbers.${index}`, "");
    clearErrors(`whatsapp_numbers.${index}`);

    for (let i = index; i < visibleInputs - 1; i++) {
      const nextValue = getValues(`whatsapp_numbers.${i + 1}`);
      setValue(`whatsapp_numbers.${i}`, nextValue);
    }

    setValue(`whatsapp_numbers.${visibleInputs - 1}`, "");
    setVisibleInputs((prev) => prev - 1);
  };

  const renderClearButton = (index: number) => {
    if (index === 0) return null;

    return (
      <Button onClick={() => handleRemoveNumber(index)}>
        <ClearIcon />
      </Button>
    );
  };

  return (
    <div className="main three">
      <div className="main--header three">
        <h2>Add up to 5 WhatsApp Numbers</h2>
        <p>
          These are the numbers that will receive WhatsApp notifications when
          you receive a payment.
        </p>
      </div>
      <div className="main--whatsapp">
        {Array.from({ length: visibleInputs }).map((_, index) => (
          <div key={index} className="main--whatsapp_visible">
            <div className="main--whatsapp_input">
              <ValidatedInput
                name={`whatsapp_numbers.${index}`}
                type="tel"
                phoneWithDialCode
                suffix={renderClearButton(index)}
                rules={{
                  validate: {
                    validateIfNotEmpty: (value) => {
                      if (!value || value.trim() === "") {
                        clearErrors(`whatsapp_numbers.${index}`);
                        return true;
                      }
                      return validatePhoneNumber(value, false);
                    },
                  },
                }}
                onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
              />
            </div>
          </div>
        ))}
        <div className="main--whatsapp_button">
          {visibleInputs < 5 && (
            <Button
              onClick={handleAddNumber}
              variant="text"
              startIcon={<PlusCircleIcon />}
            >
              Add another WhatsApp number
            </Button>
          )}
        </div>
      </div>
      <div className="button_container">
        <LoadingButton
          onClick={() => handleFormSubmit()}
          loading={isLoading}
          disabled={isLoading || !hasValidNumber}
          variant="contained"
        >
          Continue
        </LoadingButton>
      </div>
    </div>
  );
};
