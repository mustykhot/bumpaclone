import { useFormContext, get } from "react-hook-form";
import { trapSpacesForRequiredFields } from "utils";
import "./style.scss";
import { textAreaPropTypes } from "./TextAreaField";
import { validationProps } from "./ValidatedInput";
import { ReactNode } from "react";
type AreaType = {
  belowText?: ReactNode;
};
const ValidatedTextArea = <TFormValues extends Record<string, unknown>>({
  name,
  errMsg,
  rules,
  required = true,
  label,
  extraClass = "",
  spaceY = true,
  variant = "free",
  bg = "white",
  containerClass = "",
  height,
  count,
  belowText,
  ...props
}: validationProps<TFormValues> &
  AreaType &
  Omit<textAreaPropTypes, "name" | "required">) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<TFormValues>();
  const error = get(errors, name);

  return (
    <>
      <div className={`TextArea ${extraClass}  `}>
        {label && (
          <label className={` text-sm ${error ? "error" : ""} `}>
            {label}
            {required ? (
              <span className="text-error">*</span>
            ) : (
              !required && " (Optional)"
            )}
          </label>
        )}
        {props.maxLength && (
          <div className="absolute bg-white text-sm text-grey p-2 top-0 right-0">
            {count}/{props.maxLength}
          </div>
        )}
        <textarea
          {...register(name, {
            required: required ? "This Field is required" : false,
            validate: {
              isNotEmpty: (value: any) =>
                trapSpacesForRequiredFields(value, required),
            },
            ...rules,
          })}
          className={`focus:outline-0 px-4 placeholder-neutral bg-transparent w-full z-10 resize-none ${
            props.maxLength ? "pt-7" : "pt-4"
          }  ${error ? "errorbg" : ""}   ${height ? height : "h-auto"} ${
            error ? "errorbg" : ""
          }  `}
          {...props}
        />
        {belowText}
      </div>
    </>
  );
};
export default ValidatedTextArea;
