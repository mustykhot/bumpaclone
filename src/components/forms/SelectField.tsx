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
import { Autocomplete, TextField } from "@mui/material";

type option = string[] | { key: string; value: string | number; icon?: any }[];

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
  handleCustomChange?: (arg: any) => void;
  searchable?: boolean;
};

export default function SelectField<
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
  defaultValue = "",
  showError = true,
  searchable,
}: Props<TFormValues>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFormValues>();

  const error = get(errors, name);

  const options = selectOption.map((option) =>
    typeof option === "string"
      ? { label: option, value: option }
      : { label: option.key, value: option.value }
  );

  return (
    <div className="select-group">
      <FormControl
        sx={{
          mt: variant === "free" ? 4 : 2,
          mb: 2,
          width: "100%",
        }}
        className={`form-group bg-${bg} ${className}`}
      >
        {label && (
          <label
            className={`font-medium flex w-full  z-10 bg-${bg} text-sm ${
              extraLabel ? "justify-between" : ""
            }`}
            htmlFor={name}
          >
            {label}{" "}
            {required ? (
              <span className="text-error">*</span>
            ) : (
              !required && " (Optional)"
            )}
            {extraLabel}
          </label>
        )}
        <Controller
          control={control}
          name={name}
          rules={{ required: required ? "This field is required" : false }}
          render={({ field: { onChange, value = defaultValue, ref } }) =>
            searchable ? (
              <Autocomplete
                className="select-mui"
                options={options}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputRef={ref}
                    placeholder={placeholder}
                    error={!!error}
                  />
                )}
                value={options.find((option) => option.value === value) || null}
                onChange={(_, newValue) => {
                  const newValueValue = newValue !== null ? newValue.value : "";
                  onChange(newValueValue as any);
                  handleCustomChange && handleCustomChange(newValueValue);
                }}
                disabled={isLoading || isDisabled}
                loading={isLoading}
              />
            ) : (
              <Select
                className="select-mui"
                ref={ref}
                value={value}
                displayEmpty={displayEmpty}
                onChange={(e: any) => {
                  onChange(e.target.value);
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
                          display: "flex",
                          gap: "8px",
                        }}
                        key={`option-${i}`}
                        className={`menu-item`}
                        value={
                          typeof option === "string" ? option : option.value
                        }
                      >
                        {typeof option === "string" ? "" : option.icon}{" "}
                        {typeof option === "string" ? option : option.key}
                      </MenuItem>
                    );
                  })}
                {(fetchErr || selectOption?.length === 0) && !isLoading && (
                  <MenuItem value={""} disabled className="center">
                    {noOptionMsg || "No Options"}
                  </MenuItem>
                )}
              </Select>
            )
          }
        />
        {error && showError && (
          <div className="input-err-msg ">{error.message}</div>
        )}
      </FormControl>
    </div>
  );
}
