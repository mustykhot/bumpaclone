import InfiniteScroll from "react-infinite-scroll-component";
import { IconButton, CircularProgress, Button } from "@mui/material";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import Modal from "components/Modal";
import { useGetInvalidCustomersQuery } from "services";
import "./styles.scss";

type PropType = {
  openModal: boolean;
  closeModal: () => void;
  invalidCount: number;
  invalidList: any[];
  type: string;
  proceed: () => void;
  hasMore: boolean;
  fetchMoreInvalidData: () => void;
};

const InvalidCustomerGroup = ({
  closeModal,
  openModal,
  invalidList,
  invalidCount,
  type,
  proceed,
  hasMore,
  fetchMoreInvalidData,
}: PropType) => {
  return (
    <div>
      <Modal
        openModal={openModal}
        closeModal={() => closeModal()}
        closeOnOverlayClick={true}
      >
        <div className="invalid_customers_wrap">
          <div onClick={() => closeModal()}>
            <IconButton type="button" className="back_btn_wrap">
              <CloseSqIcon />
            </IconButton>
          </div>
          <div className="modal_body">
            <>
              <h3>Excluded Selections {`(${invalidCount})`}</h3>
              <p>
                The customers listed below are not selected due to incorrect{" "}
                {type === "email" ? "email addresses" : "phone numbers"}{" "}
                required to send the campaign message. Update customer details
                with the correct information to be able to send campaign{" "}
                {type === "email" ? "emails" : "SMS"}.
              </p>
              <div className="name_lists" id="scroller_top">
                <ul>
                  <InfiniteScroll
                    dataLength={invalidList?.length}
                    next={fetchMoreInvalidData}
                    scrollableTarget={"scroller_top"}
                    hasMore={hasMore}
                    loader={
                      <div className="loading_state">
                        <CircularProgress />
                      </div>
                    }
                  >
                    {invalidList.map((item: any, index: number) => (
                      <li key={index}>{item.name}</li>
                    ))}
                  </InfiniteScroll>
                </ul>
              </div>
              <Button onClick={() => proceed()} className="proceed_invalid">
                Proceed
              </Button>
            </>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InvalidCustomerGroup;
