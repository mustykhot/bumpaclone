import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { LinkBrokenIcon } from "assets/Icons/LinkBrokenIcon";
import { LinkIcon } from "assets/Icons/LinkIcon";
import { CheckedCircleIcon } from "assets/Icons/CheckedCircleIcon";
import GettingStartedModal from "./GettingStartedModal";
import ConnectFincraModal from "./ConnectFincraModal";
import BvnVerificationModal from "./BvnVerificatioModal";
import BvnVerifiedSuccessModal from './BvnVerifiedSuccessModal'
import BvnVerificationFailureModal from "./BvnVerificationFailureModal";
import CreatePinModal from "./CreatePinModal";
import CreatePinSuccessModal from "./CreatePinSuccessModal";
import FincraIcon from 'assets/images/Fincra.svg'
import BvnOtpVerification from "./BvnOtpVerification";


type fincraWalletProps = {
    data: any
};


export const FincraWallet = ({ data }: fincraWalletProps) => {
    const [openGettingStartedModal, setOpenGettingStartedModal] = useState(false);
    const [openFincraConnectModal, setOpenFincraConnectModal] = useState(false);
    const [openBvnSuccessModal, setOpenBvnSuccessModal] = useState(false);
    const [openBvnFailureModal, setOpenBvnFailureModal] = useState(false);
    const [openBvnModal, setOpenBvnModal] = useState(false);
    const [openPinModal, setOpenPinModal] = useState(false)
    const [openPinSuccessModal, setOpenPinSuccessModal] = useState(false)
    const [openOtpVerification, setOpenOtpVerification] = useState(false)
    const [isConnected, setIsConnected] = useState<boolean>(
        data?.success ? true :  false
    );
    useEffect(() => {
        if (data?.success) {
            setIsConnected(true);
        }
    }, [data]);

    return (
        <>
            <div className="general_conneccted_app_container paystack">
                <div className="title_flex">
                    <div className="title_container">
                        <img src={FincraIcon} alt='logo' className="app_image" />
                        <h4>Fincra</h4>
                    </div>
                    {isConnected && (
                        <div className="connected_box">
                            <CheckedCircleIcon /> <p>Connected</p>
                        </div>
                    )}
                </div>

                <p className="description">Connect your Pocket wallet</p>

               {!isConnected && <Button
                    startIcon={<LinkIcon />}
                    className={`connect_button ${isConnected ? "connected" : ""}`}
                    onClick={() => {
                        if(!isConnected){
                            setOpenGettingStartedModal(true)
                        }
                    }}
                >
                  Connect
                </Button>
}
            </div>

            {openGettingStartedModal && <GettingStartedModal openModal={openGettingStartedModal}
                closeModal={() => setOpenGettingStartedModal(false)} btnAction={() => { setOpenFincraConnectModal(true) }} />}

            {openFincraConnectModal && <ConnectFincraModal openModal={openFincraConnectModal}
                closeModal={() => { setOpenFincraConnectModal(false) }} btnAction={() => { setOpenBvnModal(true) }} />}

            {openBvnModal && <BvnVerificationModal openModal={openBvnModal}
                closeModal={() => { setOpenBvnModal(false) }}
                btnAction={() => { setOpenOtpVerification(true) }}
            />}

            {openOtpVerification && <BvnOtpVerification openModal={openOtpVerification}
                closeModal={() => { setOpenOtpVerification(false) }}
                btnSuccessAction={() => {
                    setOpenBvnSuccessModal(true);
                    setOpenFincraConnectModal(false); setOpenGettingStartedModal(false); setOpenBvnModal(false)
                }}
                btnFailureAction={() => {
                    setOpenBvnFailureModal(true);
                }}
            />}

            {openBvnSuccessModal && <BvnVerifiedSuccessModal openModal={openBvnSuccessModal}
                closeModal={() => { setOpenBvnSuccessModal(false) }} btnAction={() => { setOpenPinModal(true) }} />}

            {openBvnFailureModal && <BvnVerificationFailureModal
                openModal={openBvnFailureModal}
                closeModal={() => { setOpenBvnFailureModal(false) }}
                btnAction={() => { setOpenBvnModal(true); setOpenBvnFailureModal(false); }} />}



            {openPinModal && <CreatePinModal openModal={openPinModal} closeModal={() => setOpenPinModal(false)}
                btnAction={() => { setOpenPinSuccessModal(true); setOpenBvnSuccessModal(false) }} />}

            {openPinSuccessModal && <CreatePinSuccessModal openModal={openPinSuccessModal} closeModal={() => { setOpenPinSuccessModal(false); setOpenPinModal(false) }} />}


        </>
    );
};
