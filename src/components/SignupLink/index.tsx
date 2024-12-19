import { AppleWhiteIcon } from "assets/Icons/AppleWhiteIcon";
import { PlayWhiteIcon } from "assets/Icons/PlayWhiteIcon";
import Modal from "components/Modal";
import { useState } from "react";
import Qrcode from "react-qr-code";
import "./styles.scss"
import { IconButton } from "@mui/material";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
const SignupLink = ({
    text,
    className,
}: { text: string, className: string }) => {
    const [openModal, setOpenModal] = useState(false);
    const deviceType = () => {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "tablet";
        } else if (
            /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
                ua
            )
        ) {
            return "mobile";
        }
        return "desktop";
    };
    return (
        <>
            <span
                onClick={() => {
                    const typeOfDevice = deviceType();
                    if (typeOfDevice === "mobile" || typeOfDevice === "tablet") {
                        if (typeof window !== "undefined") {
                            window.open("https://bumpa.app", "_blank");
                        }
                    } else {
                        setOpenModal(true);
                    }
                }}
                className={className}
            >
                {text}
            </span>
            <Modal
                className="qr-modal"
                openModal={openModal}
                closeModal={() => setOpenModal(!openModal)}
            >
                <div className="qr_code_container">
                    <IconButton type="button" className="close_btn"
                        onClick={() => setOpenModal(false)}
                    >
                        <CloseSqIcon />
                    </IconButton>
                    <p className="scan">Scan to Download the Bumpa app and get started</p>
                    <Qrcode size={200} value={"https://bumpa.app"} />
                    <div className="btn_icon_box">
                        <AppleWhiteIcon
                            handleClick={() => {
                                if (typeof window !== "undefined") {
                                    window.open(
                                        "https://apps.apple.com/ng/app/bumpa/id1497638594",
                                        "_blank"
                                    );
                                }
                            }}
                        />
                        <PlayWhiteIcon
                            handleClick={() => {
                                if (typeof window !== "undefined") {
                                    window.open(
                                        "https://play.google.com/store/apps/details?id=com.salescabal.app",
                                        "_blank"
                                    );
                                }
                            }}
                        />
                    </div>
                    <p className="last_text">
                        For better experience, download the Bumpa mobile app.
                    </p>
                </div>
            </Modal>
        </>
    );
};

export default SignupLink;
