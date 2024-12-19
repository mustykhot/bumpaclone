import { ReactNode } from "react";
import { FieldPath, RegisterOptions, FieldValues } from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

type option =
  | string[]
  | { key: string; value: string; disabled?: boolean; icon?: any }[];

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
  defaultValue?: string;
  className?: string;
  variant?: "condensed" | "free";
  spaceY?: boolean;
  displayEmpty?: boolean;
  showError?: boolean;
  bg?: string;
  noOptionMsg?: string;
  onChange?: any;
  value?: any;
  handleCustomChange?: (arg: any) => void;
};

export default function NormalSelectField<
  TFormValues extends Record<string, unknown>
>({
  name,
  className,
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
  onChange,
  value,
}: Props<TFormValues>) {
  return (
    <div className="select-group">
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
            {extraLabel}
          </label>
        )}
        <Select
          className="select-mui"
          value={value}
          defaultValue={defaultValue}
          displayEmpty={displayEmpty}
          onChange={(e) => {
            onChange && onChange(e.target.value);
            handleCustomChange && handleCustomChange(e);
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
                    display: "flex",
                    gap: "8px",
                  }}
                  key={`option-${i}`}
                  disabled={
                    typeof option === "string"
                      ? false
                      : option.disabled
                      ? option.disabled
                      : false
                  }
                  className={`menu-item`}
                  value={typeof option === "string" ? option : option.value}
                >
                  {typeof option === "string" ? "" : option.icon}
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
      </FormControl>
    </div>
  );
}
