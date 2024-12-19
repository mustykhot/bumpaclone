import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  MutableRefObject,
} from "react";
import "./style.scss";

type Props = {
  action: ReactNode;
  children: ReactNode;
  className?: string;
  closeOnChildClick?: boolean;
  position?: "top" | "bottom";
  closeOnOutsideClick?: boolean;
  extraClick?: Function;
  hover?: boolean;
  origin?: "left" | "right";
};

const DropDownWrapper = ({
  action,
  children,
  className,
  closeOnChildClick = false,
  closeOnOutsideClick = true,
  hover,
  position = "bottom",
  origin = "left",
  extraClick = () => {},
}: Props) => {
  const [showDropDown, setshowDropDown] = useState(false);
  const ref = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (closeOnOutsideClick) {
        if (showDropDown && ref.current && !ref.current?.contains(e.target)) {
          setshowDropDown(false);
        }
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [showDropDown, closeOnOutsideClick]);

  return (
    <div ref={ref} className={`drop-down-wrapper ${className || ""}`}>
      <div
        onClick={() => {
          extraClick();
          setshowDropDown(!showDropDown);
        }}
        onMouseEnter={() => {
          hover && setshowDropDown(true);
        }}
        onMouseLeave={() => {
          hover && setshowDropDown(false);
        }}
        className="drop-down-action"
      >
        {action}
      </div>
      <div
        onClick={() =>
          closeOnChildClick ? setshowDropDown(!showDropDown) : null
        }
        className={`drop-down-content ${
          origin === "right" ? "right_side" : ""
        } ${
          position === "top"
            ? "origin-bottom-left bottom-[120%] left-0"
            : origin === "right"
            ? "origin-top-right top-[120%]"
            : "origin-top-left top-[120%]"
        } ${showDropDown ? "show-drop-down" : ""} `}
      >
        {children}
      </div>
    </div>
  );
};

export default DropDownWrapper;
