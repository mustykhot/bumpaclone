import { MutableRefObject, useEffect } from "react";

type UseOutsideClickProps = {
  ref: MutableRefObject<HTMLDivElement>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UseOutsideClick = ({
  ref,
  isOpen,
  setIsOpen,
}: UseOutsideClickProps) => {
  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (isOpen && ref.current && !ref.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isOpen, ref, setIsOpen]);
  return <></>;
};
