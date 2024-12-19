import { useState } from "react";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import "./style.scss"
import { IdentityIcon } from "assets/Icons/IdentityIcon";
import { IconButton } from "@mui/material";
import { ChevronRight } from "assets/Icons/ChevronRight";
import { IntPassportIcon } from "assets/Icons/IntPassport";
import { VerifySmallIcon } from "assets/Icons/VerifySmallIcon";
import { LiscenceIcon } from "assets/Icons/LiscenceIcon";
import prembly from "../../../../../assets/images/prembly.png"
import { UploadOptions } from "./NINupload/UploadOptions";

type ModalProps = {
    openModal: boolean;
    closeModal: () => void;
};

const bankActions = [
    {
        icon: <VerifySmallIcon />,
        name: "National Identification Number (NIN)",
    },
    {
        icon: <IntPassportIcon />,
        name: "International Passport",
    },
    {
        icon: <LiscenceIcon />,
        name: "Driver's License",
    },


]

export const UpgradeTierModal = ({ openModal, closeModal }: ModalProps) => {
    const [showUploadOptions, setShowUploadOptions] = useState(false)
    return (
        <>
            <ModalRight
                closeModal={() => {
                    closeModal();
                }}
                openModal={openModal}
            >
                <div className="modal_right_children trans_modal statement_modal">

                    <div className="top_section ">
                        <ModalRightTitle
                            closeModal={() => {
                                closeModal();
                            }}
                            className="kyc_top"
                        />
                        <div className="trans_moadal_body verify_modal">
                            <div className="icon_flex gap-x-2">
                                <IdentityIcon />
                                <span>Upgrade to Tier 2</span>
                            </div>
                            <h4>We need to verify your identity to upgrade your account to tier 2. You will be required to upload a valid identity card to complete the process.</h4>
                            <h3>Choose a verification method</h3>
                            <h4>Choose any of the verification method below to complete verification and upgrade to tier 2</h4>

                            <div className="action_wrap">
                                {bankActions.map((item, i) => (
                                    <div className="single_action" key={i}
                                    onClick={() =>setShowUploadOptions(true)}
                                    >
                                        <div className="text_wrpper flex gap-x-2">
                                            <div className="icon">{item.icon}</div>
                                            <p>{item.name}</p>
                                        </div>
                                        <div className="icon">
                                            <IconButton>
                                                <ChevronRight />
                                            </IconButton>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                       
                    </div>

                    <div className="prembly gap-x-2">
                            <h5>Powered by </h5>
                            <img src={prembly} alt="prembly" />
                        </div>
                </div>
            </ModalRight>

            { showUploadOptions && (
                <UploadOptions 
                    openModal={showUploadOptions}
                    closeModal={() => setShowUploadOptions(false)}
                />
            )}
        </>
    );
};
