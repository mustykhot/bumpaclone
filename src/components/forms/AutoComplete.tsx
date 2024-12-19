import {
  get,
  RegisterOptions,
  FieldPath,
  useFormContext,
  Controller,
} from "react-hook-form";
import FormControl from "@mui/material/FormControl";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Autocomplete,
  Checkbox,
  createFilterOptions,
  FilterOptionsState,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect, useState, ReactNode } from "react";
import type { FieldValues } from "react-hook-form/dist/types";
import CheckIcon from "@mui/icons-material/Check";

const filter: (
  options: option[],
  state: FilterOptionsState<option>
) => option[] = createFilterOptions();
type optionObj = { label: string; value: string; isSuggested?: boolean };
type option = string | optionObj;
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
  selectOption: option[];
  fetchErr?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  extraLabel?: ReactNode;
  label?: string;
  placeholder?: string;
  // defaultValue?: PathValue<TFormValues, Path<TFormValues>> | undefined;
  defaultValue?: string;
  className?: string;
  variant?: "condensed" | "free";
  spaceY?: boolean;
  bg?: string;
  noOptionMsg?: string;
  freeSolo?: boolean;
  handleCustomChange?: (arg: any) => void;
  multiple?: boolean;
  extramessage?: string | ReactNode;
  showError?: boolean;

  loading?: boolean;
  containerClass?: string;
};
// rules?: RegisterOptions;

export default function AutoCompleteField<TFormValues extends FieldValues>({
  name,
  className,
  required = true,
  selectOption = [],
  label,
  handleCustomChange,
  placeholder,
  showError,
  freeSolo = false,
  spaceY = true,
  variant = "free",
  bg = "white",
  defaultValue = "",
  extraLabel,
  multiple = false,
  loading,
  extramessage,
  containerClass = "",
  ...props
}: Props<TFormValues>) {
  const [inputVal, setinputVal] = useState<string | never[]>("");
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TFormValues>();

  // const isOptionEqualToValue = multiple
  //   ? {}
  //   : {
  //       isOptionEqualToValue: (option: option, value: option) =>
  //         option === value,
  //     };

  const error = get(errors, name);
  useEffect(() => {
    register(name, {
      required: required ? "This field is required" : required,
    });
  }, [name, register, required]);

  return (
    <div className={`${containerClass} select-group`}>
      <FormControl
        sx={{
          width: "100%",
        }}
        className={`form-group    ${className}`}
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
        <Controller
          control={control}
          name={name}
          render={({
            field: { onChange, value = multiple ? [] : defaultValue, ref },
          }) => {
            let findValue = (selectOption?.find(
              (el) => (typeof el === "string" ? el : el?.value) === value
            ) || "") as optionObj;

            setinputVal(
              loading
                ? ""
                : selectOption.every((el) => typeof el === "string") || freeSolo
                ? value
                : findValue?.label
            );
            return (
              <Autocomplete
                loading={loading}
                className="autoComplete-mui"
                isOptionEqualToValue={(option: option, value: option) =>
                  typeof option === "string"
                    ? option === value
                    : option.label ===
                      (typeof value === "string" ? value : value?.label)
                }
                disablePortal
                clearOnBlur={false}
                getOptionLabel={(option: any) => {
                  if (typeof option === "string") {
                    return option;
                  } else if (option?.isSuggested) {
                    // is the selected option is freemode/user suggested option
                    return option?.value;
                  } else {
                    // Regular option
                    return option?.label;
                  }
                }}
                multiple={multiple}
                options={selectOption ? selectOption : []}
                filterOptions={(options: any, params: any) => {
                  // Suggest the creation of a new value if the autocomplete is a free solo type
                  if (freeSolo) {
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    const isExisting = options.some(
                      (option: any) =>
                        inputValue ===
                        (typeof option === "string" ? option : option.value)
                    );
                    if (inputValue !== "" && !isExisting) {
                      filtered.push({
                        label: `Add '${inputValue}'`,
                        value: inputValue,
                        isSuggested: true,
                      });
                    }
                    return filtered;
                  } else return filter(options, params);
                }}
                handleHomeEndKeys
                value={loading ? "Loading ..." : inputVal}
                onChange={(e: any, value: any) => {
                  if (value) {
                    if (Array.isArray(value)) {
                      onChange(
                        value?.map((item) =>
                          typeof item === "string" ? item : item?.value
                        ) as any
                      );
                    } else {
                      onChange(
                        typeof value === "string"
                          ? value
                          : (value?.value as any)
                      );
                    }
                    if (handleCustomChange) {
                      handleCustomChange(value);
                    }
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    // inputRef={props.field.ref}
                    placeholder={placeholder}
                    InputProps={{
                      ...params.InputProps,
                    }}
                  />
                )}
                renderOption={(renderProps, option: any, { selected }) => (
                  <MenuItem
                    {...renderProps}
                    className="menu-item text-base w-full"
                    sx={{
                      justifyContent: "space-between",
                      background: selected ? "#F5FAFF" : "transparent",
                    }}
                    key={`${
                      typeof option === "string" ? option : option?.value
                    }`}
                  >
                    {typeof option === "string" ? option : option?.label}
                    {multiple && (
                      <Checkbox
                        icon={<></>}
                        checkedIcon={
                          <CheckIcon
                            color="primary"
                            fontSize="small"
                            sx={{ p: 0 }}
                          />
                        }
                        sx={{ border: "none", p: 0 }}
                        checked={selected}
                      />
                    )}
                  </MenuItem>
                )}
              />
            );
          }}
        />
      </FormControl>
      {extramessage && <p className="input_extra_message">{extramessage}</p>}

      {error && showError && (
        <div className="input-err-msg ">{error.message}</div>
      )}
    </div>
  );
}
