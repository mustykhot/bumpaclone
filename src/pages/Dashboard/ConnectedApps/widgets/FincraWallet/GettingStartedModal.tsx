import { IconButton } from "@mui/material";
import Modal from "components/Modal";
import { Button } from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";
import WalletIcon from "assets/Icons/WalletIcon";

type GettingStartedProps = {
    openModal: boolean;
    closeModal: () => void;
    btnAction: () => void;
};

const GettingStartedModal = ({
    closeModal,
    openModal,
    btnAction,
}: GettingStartedProps) => {
    return (
        <Modal openModal={openModal} closeModal={closeModal}>
            <div className="connect_modal general_modal success_modal">
                <div className="cancel_section">
                    <IconButton
                        onClick={() => {
                            closeModal();
                        }}
                        className="icon_button_container"
                    >
                        <XIcon />
                    </IconButton>
                </div>

                <div className="mt-10">
                    <WalletIcon />
                </div>

                <div className="px-8">
                    <h2>Introducing Bumpa Wallet </h2>

                    <p className="description">
                        Your gateway to easy payment directly to your personal bank account with automatic confirmation.
                    </p>
                </div>


                <div className="button_container">
                    <Button
                        onClick={() => {
                            btnAction();
                        }}
                        variant="contained"
                        className="primary primary_styled_button"
                    >
                        Get Started
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default GettingStartedModal