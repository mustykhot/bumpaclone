import { ReactNode, useEffect, useState } from "react";
import {
  get,
  RegisterOptions,
  FieldPath,
  useFormContext,
} from "react-hook-form";
import type { FieldValues, Path, PathValue } from "react-hook-form/dist/types";
import PhoneInput, { CountryData } from "react-phone-input-2";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { IconButton } from "@mui/material";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { IndicatorComponent } from "components/IndicatorComponent";
import { InputProps } from "./InputField";
import { useAppSelector } from "store/store.hooks";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import "react-phone-input-2/lib/style.css";
import "./style.scss";

export function formatNumberWithCommas(number: number) {
  // Check if the input is a valid number
  if (isNaN(number)) {
    return "Invalid Number";
  }

  // Convert the number to a string and split it into parts
  const parts = number.toString().split(".");

  // Format the integer part with commas
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Join the parts back together, including the decimal part if it exists
  return parts.join(".");
}

export function removeFormattedNumerComma(value?: string | number) {
  return value ? Number(String(value).replace(/,/g, "")) : null;
}

export type validationProps<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues> = FieldPath<TFormValues>
> = {
  errMsg?: string;
  extraindicator?: string;
  name: TName;
  showError?: boolean;
  title?: string;
  extramessage?: string | ReactNode;
  extralabel?: string | ReactNode;
  message?: ReactNode;
  extraError?: string;
  noOptional?: boolean;
  rules?: Omit<
    RegisterOptions<TFormValues, TName>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  required?: boolean;
  formatValue?: boolean;
  handleChange?: (e: any) => void;
  openUpgradeModal?: boolean;
  setOpenUpgradeModal?: (value: boolean) => void;
  phoneWithDialCode?: boolean;
  phoneWithOnlyNigerianDialCode?: boolean;
  domainInfo?: string | ReactNode;
  belowText?: ReactNode;
  max?: number;
  disabledNote?: string;
  showDisabledNote?: boolean;
  innerClass?: string;
};

const ValidatedInput = <TFormValues extends FieldValues>({
  name,
  errMsg,
  extraError,
  rules,
  required = true,
  label,
  extralabel,
  extraClass = "",
  spaceY = true,
  variant = "condensed",
  bg = "white",
  prefix,
  suffix,
  type,
  containerClass = "",
  showError = true,
  title,
  message,
  extramessage,
  extraindicator,
  noOptional = false,
  formatValue = false,
  openUpgradeModal,
  setOpenUpgradeModal,
  handleChange,
  phoneWithDialCode = false,
  phoneWithOnlyNigerianDialCode = false,
  domainInfo,
  belowText,
  max,
  disabledNote,
  showDisabledNote,
  innerClass,
  ...props
}: validationProps<TFormValues> & Omit<InputProps, "name" | "required">) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<TFormValues>();

  let pattern: RegExp;
  switch (type) {
    case "url":
      pattern =
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
      break;
    case "number":
      pattern = /^\d{1,3}(,\d{3})*(.\d+)?$/;
      break;
    case "email":
      pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{1,})+$/;
      break;
    default:
      pattern = /[a-zA-Z0-9]/;
      break;
  }

  const error = get(errors, name);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("ng");

  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);

  const handleDateClick = () => {
    document?.getElementById("date")?.focus();
  };

  const getPhonePlaceholder = (countryCode: string) => {
    return countryCode === "ng" ? "+2348012345678" : "Enter phone number";
  };

  return (
    <div className={`form-group-wrapper ${containerClass}`}>
      {label && (
        <label
          className={`${error ? "error" : ""} ${
            extralabel ? "flex_label" : ""
          } ${extraClass}`}
          htmlFor={name}
        >
          <p>
            {label}{" "}
            {!required ? (
              noOptional ? (
                ""
              ) : (
                "(Optional)"
              )
            ) : (
              <span className="text-error">*</span>
            )}
          </p>
          {title && <IndicatorComponent text={title} />}
          {extralabel && extralabel}
        </label>
      )}
      <div
        className={`form-group bg-${bg} ${
          error ? "errorbg" : ""
        } ${extraClass} ${innerClass} ${
          phoneWithDialCode || phoneWithOnlyNigerianDialCode
            ? "codeInput focus:outline-none placeholder-neutral bg-transparent w-full z-10"
            : ""
        }`}
      >
        {prefix}
        {phoneWithDialCode || phoneWithOnlyNigerianDialCode ? (
          <PhoneInput
            country={"ng"}
            onlyCountries={phoneWithOnlyNigerianDialCode ? ["ng"] : undefined}
            placeholder={getPhonePlaceholder(selectedCountry)}
            autoFormat={false}
            disableDropdown={phoneWithOnlyNigerianDialCode}
            value={watch(name) || ""}
            onChange={(value, country: CountryData) => {
              setValue(
                name,
                value as PathValue<TFormValues, Path<TFormValues>>,
                { shouldValidate: true }
              );
              if (handleChange) handleChange(value);
              if (typeof country === "object") {
                setSelectedCountry(country.countryCode);
              }
            }}
            inputProps={{
              id: name,
              ...register(name, {
                required: required ? "This Field is required" : false,
                pattern: {
                  value: pattern,
                  message: `Please enter a valid ${type} field`,
                },
                ...rules,
              }),
            }}
          />
        ) : (
          <input
            {...register(name, {
              required: required ? "This Field is required" : false,
              pattern: {
                value: pattern,
                message: `Please enter a valid ${type} field`,
              },
              ...(type === "password"
                ? {
                    minLength: {
                      value: 4,
                      message: "Password must have at least 4 characters",
                    },
                  }
                : {}),
              onChange: (e) => {
                if (
                  formatValue &&
                  !isNaN(parseInt(e.target.value?.replace(/,/g, "")))
                ) {
                  setValue(
                    name,
                    formatNumberWithCommas(
                      parseFloat(String(e.target.value)?.replace(/,/g, ""))
                    ) as PathValue<TFormValues, Path<TFormValues>>
                  );
                }
                if (handleChange) handleChange(e);
              },
              ...rules,
            })}
            name={name}
            id={type === "date" ? "date" : name}
            {...props}
            type={showPassword ? "text" : type === "number" ? "text" : type}
            onClick={() => {
              if (type === "date") {
                handleDateClick();
              } else if (
                name === "barcode" &&
                (isSubscriptionExpired ||
                  (isSubscriptionType !== "growth" &&
                    isSubscriptionType !== "trial"))
              ) {
                setOpenUpgradeModal?.(true);
              }
            }}
            className={`focus:outline-none placeholder-neutral bg-transparent w-full z-10 `}
          />
        )}
        {suffix}
        {type === "password" && (
          <IconButton
            size="small"
            sx={{ mr: "0.4rem" }}
            className="select-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <VisibilityOutlinedIcon fontSize="small" />
            ) : (
              <VisibilityOffOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        )}
      </div>
      {error && showError && (
        <div className="input-err-msg">{error.message || errMsg}</div>
      )}
      {extraError && <div className="input-err-msg">{extraError}</div>}
      {extraindicator && (
        <div className="input_extra_indicator">
          <InfoCircleIcon /> <p>{extraindicator}</p>{" "}
        </div>
      )}
      {extramessage && <p className="input_extra_message">{extramessage}</p>}
      {message && <div className="input-err-msg">{message}</div>}
      {domainInfo && (
        <div className="input_extra_indicator">
          <InfoCircleIcon stroke="#848D99" /> <p>{domainInfo}</p>
        </div>
      )}
      {belowText}
      {props.disabled && showDisabledNote && disabledNote && (
        <div className="input_extra_indicator">
          <InfoCircleIcon stroke="#848D99" />
          <p className="disabledNote">{disabledNote}</p>
        </div>
      )}
    </div>
  );
};

export default ValidatedInput;
