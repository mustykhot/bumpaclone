import { useState } from "react";
import Modal from "components/Modal";
import { Button, IconButton } from "@mui/material";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import { ChevronRight } from "assets/Icons/ChevronRight";
import '../centre.scss'
import { UploadLargeIcon } from "assets/Icons/UploadLargeIcon";
import { CameraIcon } from "assets/Icons/CameraIcon";
import card from "assets/images/BusCard.png"
import NormalFileInput from "components/forms/NormalFileInput";
import { NinPreviewModal } from "./NinPreviewModal";
type propType = {
    openModal: boolean;
    closeModal: () => void;
};

export const UploadOptions = ({
    closeModal,
    openModal,
}: propType) => {
    const [NinPreview, setNinPreview] = useState(false)

    return (
        <>
            <Modal
                closeModal={() => {
                    closeModal();
                }}
                openModal={openModal}
            >
                <div className="pin_wrap upload_options">
                    <div className="close_btn" onClick={() => closeModal()}>
                        <IconButton type="button" className="back_btn_wrap">
                            <CloseSqIcon />
                        </IconButton>
                    </div>
                    <div className="modal_body sucess_body ">

                        <h3 className="success_pin upload_header">Choose how you want to upload</h3>
                        <p className="supload_p text-center ">Upload your NIN document using any of the <br /> methods below.</p>

                        <div className="card_wrapper">
                            <img src={card} alt="identity card" />
                        </div>
                        <div className="action_wrap">
                            {/* <WalletFileUpload /> */}
                            {/* <div className="single_action"
                            // onClick={() =>setShowUploadOptions(true)}
                            >
                                <div className="text_wrpper flex gap-x-2">
                                    <div className="icon"><UploadLargeIcon /></div>

                                    <p>Upload Image</p>

                                </div>

                                <div className="icon">
                                    <IconButton>
                                        <ChevronRight />
                                    </IconButton>
                                </div>
                            </div> */}
                            <div className="single_action"
                            // onClick={() =>setShowUploadOptions(true)}
                            >
                                <div className="text_wrpper flex gap-x-2">
                                    <div className="icon"><CameraIcon /></div>
                                    <p>Take A picture</p>
                                </div>
                                <div className="icon">
                                    <IconButton>
                                        <ChevronRight />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="contained"
                            className="pin_btn pin_suucess_btn"
                            onClick={() => setNinPreview(true)}
                        >
                            Continue
                        </Button>
                    </div>

                </div>
            </Modal>

            {NinPreview && (
                <NinPreviewModal
                    openModal={NinPreview}
                    closeModal={() => setNinPreview(false)}
                />
            )}
        </>

    );
};

