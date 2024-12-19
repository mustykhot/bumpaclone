import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
// import "./style.scss";
// import { Recipients } from "../Recipients";
type CustomerDetailsProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const CustomerDetailsModal = ({ openModal, closeModal }: CustomerDetailsProps) => {
    return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children pd_view_campaign ">
          <div className="top_section">
          <ModalRightTitle
                            closeModal={() => {
                                closeModal();
                            }}
                            title="Customers (42) "
                        >


                        </ModalRightTitle>

                        <div className="notification_details -mt-7 customer_list">
                            <div className="body">
                                <div className="px-[32px]">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, i) => {
                                        return (
                                            <div className=" single_customer block" key={i}>
                                                <p className="customer_name">{i+1}. &nbsp;Adechukwu Babatunde</p>
                                                <p className="customer_name ml-4">adechukwubabtunde@gmail.com</p>
                                            </div>
                                        )
                                    })}
                                </div>

                            </div>



                        </div>
          </div>

        
        </div>
      </ModalRight>
      
    </>
  );
};
