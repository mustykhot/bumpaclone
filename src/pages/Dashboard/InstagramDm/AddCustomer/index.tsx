import ModalBottom from "components/ModalBottom";
import { AddNewCustomer } from "pages/Dashboard/Customers/AddNewCustomer";
import './style.scss'

type propType = {
    openModal: boolean;
    closeModal: () => void;
    discardFunc: ( ) => void;
    from?: string
    handle?: string
};

const AddCustomerModal = ({ closeModal, openModal, discardFunc, from, handle }: propType) => {
    return (
        <div className="create-product-modal-bottom">
        <ModalBottom closeModal={closeModal} openModal={openModal}>
            <AddNewCustomer discardFunc={discardFunc} from={from} handle={handle}/>
        </ModalBottom>
        </div>
    )
}

export default AddCustomerModal;