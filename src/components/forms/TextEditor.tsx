import { Controller, FieldValues, useFormContext, get } from "react-hook-form";
import { validationProps } from "./ValidatedInput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules } from "./NormalTextEditor";

type Props = {
  placeholder?: string;
  disabled?: boolean;
  minLength?: number;
  label?: string;
  format?: any;
};
const TextEditor = <TFormValues extends FieldValues>({
  name,
  rules,
  label,
  required = true,
  disabled = false,
  placeholder,
  minLength = 5,
  format,
}: validationProps<TFormValues> & Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFormValues>();
  return (
    <div className={`quill_container ${errors?.body ? "error" : ""}`}>
      {label && (
        <label>
          {label} {!required && "(Optional)"}{" "}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        rules={{
          required: required ? "This field is required" : false,
          // minLength: {
          //   value: minLength,
          //   message: "Content is too short",
          // },
          ...rules,
        }}
        render={({ field: { ref, value = "<p></p>", onChange, ...field } }) => (
          <ReactQuill
            readOnly={disabled}
            {...field}
            placeholder={placeholder}
            value={value}
            modules={modules}
            onChange={(val: any) => {
              onChange(val);
              // if (val?.includes("@")) {
              // } else {
              //   onChange(val);
              // }
            }}
            defaultValue={"<p></p>"}
          />
        )}
      />
      {get(errors, name) && (
        <div className="input-err-msg">{get(errors, name)?.message}</div>
      )}
    </div>
  );
};

export default TextEditor;
