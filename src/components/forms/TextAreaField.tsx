import { DetailedHTMLProps } from "react";
import "./style.scss";

export type textAreaPropTypes = {
  height?: string;
  label?: string;
  extraClass?: string;
  variant?: "condensed" | "free";
  spaceY?: boolean;
  bg?: string;
  containerClass?: string;
  count?: number;
} & DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

const TextAreaField = ({
  label,
  height,
  extraClass = "",
  spaceY = true,
  variant = "condensed",
  bg = "white",
  count,
  ...props
}: textAreaPropTypes) => {
  return (
    <div className={`TextArea ${extraClass}  `}>
      {label && <label className={` text-sm`}>{label}</label>}
      {props.maxLength && (
        <div className="absolute bg-white text-sm text-grey p-2 top-0 right-0">
          {count}/{props.maxLength}
        </div>
      )}
      <textarea
        className={`focus:outline-0 px-4 placeholder-neutral bg-transparent w-full z-10 resize-none ${
          props.maxLength ? "pt-7" : "pt-4"
        }  ${height ? height : "h-auto"}`}
        {...props}
      />
    </div>
  );
};
export default TextAreaField;
