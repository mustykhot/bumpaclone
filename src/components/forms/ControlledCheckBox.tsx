import {
  Controller,
  get,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { Checkbox } from "@mui/material";

type Props<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues> = FieldPath<TFormValues>
> = {
  name: TName;
  required?: boolean;
  handleCustomChange?: (arg: any) => void;
};

export default function SelectField<
  TFormValues extends Record<string, unknown>
>({
  name,
  required = true,

  handleCustomChange,
}: Props<TFormValues>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFormValues>();

  // const error = get(errors, name);

  return (
    <div className="select-group">
      <Controller
        control={control}
        name={name}
        rules={{ required: required ? "This field is required" : false }}
        render={({ field: { onChange, value, ref } }) => (
          <Checkbox
            // checked={checked}
            onChange={(e: any) => {
              // setChecked(e.target.checked);
              onChange(e.target.value);
              handleCustomChange && handleCustomChange(e.target.value);
            }}
          />
        )}
      />
    </div>
  );
}
