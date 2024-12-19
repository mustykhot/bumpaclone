import { useState } from "react";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "../style.scss"
import prembly from "assets/images/prembly.png"
import { LoadingButton } from "@mui/lab";
import "../centre.scss"
import { Button } from "@mui/material";
import VerifyIdentityModal from "../../IdentityModals/VerifyIdentityModal";

type ModalProps = {
    openModal: boolean;
    closeModal: () => void;
};

export const NinPreviewModal = ({ openModal, closeModal }: ModalProps) => {
    const [verifyModal, setverifyModal] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [isFailed, setIsFailed] = useState(true)
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
                                    title="Identity Verification"
                                />
                        <div className="trans_moadal_body verify_modal">
                        <div className="img_wrapper">
                        </div>
                        <p className="warning">Ensure all details on the image upload are clear and readable before submitting for verification</p>
                        </div>
                        <div className="prembly gap-x-2 mb-8">
                            <h5>Powered by </h5>
                            <img src={prembly} alt="prembly" />
                        </div>
                       
                    </div>

                    {/* <div className="prembly gap-x-2 mb-8">
                            <h5>Powered by </h5>
                            <img src={prembly} alt="prembly" />
                        </div> */}
                        <div className="mt-8 bottom_section preview_bottom">
                            <div className="btn_wrpper gap-x-2">
                                <Button className="retake">
                                    Retake Picture
                                </Button>
                               <LoadingButton   
                                variant="contained"
                                type="submit"
                                onClick={() => setverifyModal(true)}
                            >
                                Submit I.D{" "}
                            </LoadingButton> 
                            </div>
                            
                              
                            </div>
                </div>
            </ModalRight>

          {verifyModal && (
            <VerifyIdentityModal 
                openModal = {verifyModal}
                closeModal={() => setverifyModal(false)}
                isVerified={isVerified}
                isFailed={isFailed}
            />
          )}
        </>
    );
};
