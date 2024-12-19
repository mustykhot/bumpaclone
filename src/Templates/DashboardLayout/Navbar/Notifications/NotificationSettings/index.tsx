import ModalRight from "components/ModalRight";
import "./style.scss";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
type NotificationSettingProps = {
  openModal: boolean;
  closeModal: () => void;
};


export const NotificationSettings = ({
  openModal,
  closeModal,
}: NotificationSettingProps) => (
  <ModalRight
    closeModal={() => {
      closeModal();
    }}
    openModal={openModal}
  >
    <div className="modal_right_children">
      <div className="top_section">
        <ModalRightTitle
          closeModal={() => {
            closeModal();
          }}
          title="Notification Settings"
        />
      </div>

      {/* <div className=" bottom_section">
        <Button type="button" className="cancel" onClick={closeModal}>
          Cancel
        </Button>
        <Button
          type="button"
          className="save"
          onClick={() => {
            submit();
          }}
        >
          Save{" "}
        </Button>
      </div> */}
    </div>
  </ModalRight>
);
