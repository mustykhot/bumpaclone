import { XIcon } from "assets/Icons/XIcon";
import React, { ReactNode } from "react";
type BannerProps = {
  openModal: boolean;
  closeModal: Function;
  className?: string;
  text: string | ReactNode;
  textClass?: string;
};

const TopBanner = ({ openModal, closeModal, className, text }: BannerProps) => {
  return (
    <>
      {openModal && (
        <div className={`${className} warning info`}>
          <p className="warning_text">{text}</p>
          <div className="helper_icone" onClick={() => closeModal()}>
            <XIcon stroke="#fff" />
          </div>
        </div>
      )}
    </>
  );
};

export default TopBanner;
