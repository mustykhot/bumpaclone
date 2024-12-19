import {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useState,
} from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import "./style.scss";
import { IconButton } from "@mui/material";
import { useAppSelector } from "store/store.hooks";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";

export type InputProps = {
  errMsg?: string;
  label?: string;
  extraClass?: string;
  variant?: "condensed" | "free";
  spaceY?: boolean;
  bg?: string;
  suffix?: any;
  prefix?: any;
  extralabel?: string | ReactNode;
  showError?: boolean;
  onkeypress?: any;
  containerClass?: string;
  autoFocus?: boolean;
  name?: string;
  openUpgradeModal?: boolean;
  setOpenUpgradeModal?: (value: boolean) => void;
} & Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "spaceY" | "bg" | "variant" | "extraClass"
>;

const InputField = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      errMsg,
      extraClass = "",
      spaceY = true,
      variant = "condensed",
      bg = "white",
      prefix,
      suffix,
      extralabel,
      containerClass,
      autoFocus,
      showError = true,
      onKeyDown,
      name,
      openUpgradeModal,
      setOpenUpgradeModal,
      ...props
    },
    ref
  ): JSX.Element => {
    const [showPassword, setShowPassword] = useState(false);
    const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
    const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);

    const handleClick = () => {
      if (
        name === "barcode" &&
        (isSubscriptionExpired ||
          (isSubscriptionType !== "growth" && isSubscriptionType !== "trial"))
      ) {
        setOpenUpgradeModal?.(true);
      }
    };

    return (
      <div className={`form-group-wrapper ${containerClass}`}>
        {label && (
          <label className={`${extralabel ? "flex_label" : ""}  `}>
            {label}{" "}
            {props.required ? <span className="text-error">*</span> : ""}
            {extralabel && extralabel}
          </label>
        )}
        <div className={`form-group ${extraClass} `}>
          {prefix}
          <input
            {...props}
            name={name}
            ref={ref}
            autoFocus={autoFocus}
            onKeyDown={onKeyDown}
            type={showPassword ? "text" : props.type}
            className={`focus:outline-none placeholder-neutral text-black bg-transparent w-full z-10 `}
            onClick={handleClick}
          />
          {suffix}
          {props.type === "password" && (
            <IconButton
              size="small"
              sx={{ mr: "-0.7rem" }}
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
        {errMsg && showError && <div className="input-err-msg">{errMsg}</div>}
      </div>
    );
  }
);

export default InputField;
