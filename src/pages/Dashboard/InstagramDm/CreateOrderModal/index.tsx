import ModalBottom from "components/ModalBottom";
import { CreateOrder } from "pages/Dashboard/Orders/CreateOrder";
import { IConversationsList } from "Models/messenger";
import "./style.scss";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  activeChat: IConversationsList;
  handleOrder: (order: any) => void;
};

export type CreateOrderFeilds = {};

const CreateOrderModal = ({
  closeModal,
  openModal,
  handleOrder,
  activeChat,
}: propType) => {
  const customerOrder = (payload: any) => {
    handleOrder(payload);
  };
  return (
    <div className="create-modal-bottom">
      <ModalBottom
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <CreateOrder
          discardFnc={() => {
            closeModal();
          }}
          preSelectedCustomer={activeChat?.participants?.data[1]?.username}
          onSuccess={customerOrder}
          from="instagram"
        />
      </ModalBottom>
    </div>
  );
};

export default CreateOrderModal;
