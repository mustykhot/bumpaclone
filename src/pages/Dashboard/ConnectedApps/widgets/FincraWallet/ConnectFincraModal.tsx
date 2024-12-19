import { IconButton } from "@mui/material";
import Modal from "components/Modal";
import { Button } from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";
import { BankIcon } from "assets/Icons/BankIcon";
import { CartIcon } from "assets/Icons/CartIcon";
import Fincra from "assets/images//Fincra.svg"

type ConnectFincraProps = {
    openModal: boolean;
    closeModal: () => void;
    btnAction: () => void;
};

const ConnectFincraModal = ({
    closeModal,
    openModal,
    btnAction,
}: ConnectFincraProps) => {
    return (
        <Modal openModal={openModal} closeModal={closeModal}>
            <div className="connect_modal success_modal">
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

                <div className="flex flex-col justify-center items-center space-y-10">
                    <div>
                        <img src={Fincra} alt='logo' />
                    </div>

                    <div className="px-8">
                        <h2>Connect to Fincra </h2>
                        <p className="text-center mt-0 text-text-grey">
                            Get your personal bank account to receive money directly from your customers.
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex space-x-4 mt-4 bg-light-grey px-4 py-4 rounded-[16px]">
                        <div><BankIcon stroke='#009444' /></div>
                        <div>
                            <h6 className="font-medium text-base text-black-02">Get a Business Account</h6>
                            <p className="text-sm mt-1 text-grey-01">Get a business account to receive bank transfers and get automatic payment confirmation.</p>
                        </div>
                    </div>

                    {/* <div className="flex space-x-4 mt-4 bg-light-grey px-4 py-4 rounded-[16px]">
                        <div><CartIcon stroke='#009444' /></div>
                        <div>
                            <h6 className="font-medium text-base text-black-02">Add Fincra to web checkout</h6>
                            <p className="text-sm mt-1 text-grey-01">Add your Pocket handle and bank account as a payment option at checkout.</p>
                        </div>
                    </div> */}
                </div>


                <div className="button_container mt-6">
                    <Button
                        onClick={() => {
                            btnAction();
                        }}
                        variant="contained"
                        className="primary primary_styled_button"
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default ConnectFincraModal