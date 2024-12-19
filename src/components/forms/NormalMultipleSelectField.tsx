import { ReactNode } from "react";
import {
  Controller,
  get,
  FieldPath,
  RegisterOptions,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

type option = { key: string; value: string }[];

type Props<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues> = FieldPath<TFormValues>
> = {
  name: TName;
  rules?: Omit<
    RegisterOptions<TFormValues, TName>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  required?: boolean;
  selectOption: option;
  fetchErr?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  label?: string;
  extraLabel?: ReactNode;
  placeholder?: string;
  defaultValue?: any[];
  value?: string[];
  className?: string;
  variant?: "condensed" | "free";
  spaceY?: boolean;
  displayEmpty?: boolean;
  showError?: boolean;
  bg?: string;
  noOptionMsg?: string;
  extramessage?: string | ReactNode;
  handleCustomChange?: (arg: any) => void;
  extraClass?: string;
};

export default function NormalMultipleSelectField<
  TFormValues extends Record<string, unknown>
>({
  name,
  className,
  required = true,
  selectOption = [],
  isLoading,
  isDisabled,
  handleCustomChange,
  placeholder,
  fetchErr,
  label,
  extraLabel,
  noOptionMsg,
  spaceY = true,
  variant = "condensed",
  bg = "white",
  displayEmpty = true,
  defaultValue,
  showError = true,
  value = [],
  extraClass,
  extramessage,
}: Props<TFormValues>) {
  return (
    <div className={`select-group ${extraClass}`}>
      <FormControl
        sx={{
          mt: variant === "free" ? 4 : 2,
          mb: 2,
          width: "100%",
        }}
        className={`form-group bg-${bg}   ${className}`}
      >
        {label && (
          <label
            className={`font-medium flex w-full justify-between z-10 bg-${bg} text-sm`}
            htmlFor={name}
          >
            {label}
            {!required && " (Optional)"}
            {extraLabel}
          </label>
        )}
        <Select
          className="select-mui"
          multiple
          value={value}
          displayEmpty={displayEmpty}
          renderValue={(selected: any) => {
            const preparedList = selectOption
              .filter((item) => {
                return selected.includes(item.value);
              })
              .map((item) => item.key);
            return preparedList.join(", ");
          }}
          onChange={(e: any) => {
            handleCustomChange && handleCustomChange(e.target.value);
          }}
          disabled={isLoading || isDisabled}
        >
          {isLoading && (
            <MenuItem value={""} disabled className="center">
              Loading...
            </MenuItem>
          )}
          {!isLoading && placeholder && (
            <MenuItem className="menu-item placeholder" value={""}>
              {placeholder}
            </MenuItem>
          )}
          {!isLoading &&
            selectOption.map((option, i) => {
              return (
                <MenuItem
                  sx={{
                    "&.Mui-selected, &:hover": {
                      background: "primary.main",
                    },
                  }}
                  key={`option-${i}`}
                  className={`menu-item`}
                  value={typeof option === "string" ? option : option.value}
                >
                  <Checkbox
                    checked={
                      (value as string[])?.indexOf(
                        typeof option === "string" ? option : option.value
                      ) > -1
                    }
                  />

                  {typeof option === "string" ? option : option.key}
                </MenuItem>
              );
            })}
          {(fetchErr || selectOption?.length === 0) && (
            <MenuItem value={""} disabled className="center">
              {noOptionMsg || "No Options"}
            </MenuItem>
          )}
        </Select>
        {extramessage && <p className="input_extra_message">{extramessage}</p>}
      </FormControl>
    </div>
  );
}
