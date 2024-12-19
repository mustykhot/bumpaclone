import {
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import {
  Controller,
  FieldPath,
  FieldValues,
  get,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import { ReactNode } from "react";

export type Props<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues> = FieldPath<TFormValues>
> = {
  errMsg?: string;
  name: TName;
  showError?: boolean;
  label?: string;
  rules?: RegisterOptions<TFormValues, TName>;
  required?: boolean;
  defaultValue?: string;
  className?: string;
  options: { label: string | ReactNode; value: string }[];
};

const RadioInputs = <TFormValues extends FieldValues>({
  label,
  errMsg,
  name,
  options,
  defaultValue,
  className,
}: Props<TFormValues>) => {
  const methods = useFormContext();

  return (
    <div className={className}>
      <Controller
        control={methods.control}
        name={name}
        rules={{ required: "This field is required" }}
        render={({ field: { onChange, value = "", ref } }) => (
          <FormControl
            ref={ref}
            error={get(methods.formState.errors, name)?.message ? true : false}
            fullWidth
          >
            <FormLabel id={`${name}-group-label`}>{label}</FormLabel>
            <RadioGroup
              defaultValue={defaultValue}
              value={value || defaultValue}
              onChange={(e: any) => {
                onChange(e.target.value);
              }}
              row
              aria-labelledby={`${name}-group-label`}
              name={name}
              sx={{ justifyContent: "space-between" }}
            >
              {options.map(({ label, value }) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  label={label}
                  control={<Radio />}
                />
              ))}
            </RadioGroup>
            {get(methods.formState.errors, name)?.message && (
              <FormHelperText sx={{ m: 0, ml: "auto" }}>
                {errMsg || get(methods.formState.errors, name)?.message}
              </FormHelperText>
            )}
          </FormControl>
        )}
      />
    </div>
  );
};

export default RadioInputs;
