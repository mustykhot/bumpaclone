import { SelectProductModal } from "pages/Dashboard/Orders/widgets/product/SelectProductModal";
import './style.scss'

type ProductModalProps = {
  openModal: boolean;
  closeModal: () => void;
  handleSelectedProduct: (val: any) => void;
};



export const SelectInstagramProductModal = ({
  openModal,
  closeModal,
 handleSelectedProduct
}: ProductModalProps) => {

 return(
  <div className="product-ig-modal">
  <SelectProductModal openModal={openModal} closeModal={closeModal} dispatchFunc={handleSelectedProduct} saveBtnMessage="Send"/>
  </div>
 )
};

