import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "./style.scss";
import { EditIcon } from "assets/Icons/EditIcon";
import Button from "@mui/material/Button";
import { ShippingType } from "services/api.types";
import { CircularProgress } from "@mui/material";

interface IProp {
  setShowModal: () => void;
  setShowEditModal: () => void;
  showModal: boolean;
  deleteFnc: (id: string, callback?: () => void) => void;

  loadDelete: boolean;
  shippingToView: ShippingType | null;
}

const ViewShippingDetails = ({
  setShowModal,
  showModal,
  setShowEditModal,
  deleteFnc,
  shippingToView,
  loadDelete,
}: IProp) => {
  const handleEdit = () => {
    setShowModal();
    setShowEditModal();
  };
  return (
    <div className="edit-modal">
      <ModalRight closeModal={setShowModal} openModal={showModal}>
        <div className="modal_right_children">
          <div className="top_section">
            <ModalRightTitle
              className="edit-modal__right-title"
              closeModal={setShowModal}
              title="Shipping Details"
              extraChild={
                <Button
                  onClick={handleEdit}
                  type="button"
                  startIcon={<EditIcon stroke="#009444" />}
                  className="edit"
                >
                  Edit
                </Button>
              }
            />

            <div className="edit-modal__container">
              <div className="edit-modal__value">
                {" "}
                <div className="edit-modal__value--left-align">
                  Shipping Title
                </div>
                <div className="edit-modal__value--right-align">
                  {shippingToView?.name}
                </div>
              </div>

              <div className="edit-modal__value">
                {" "}
                <div className="edit-modal__value--left-align">
                  Shipping Fee
                </div>
                <div className="edit-modal__value--right-align">
                  {shippingToView?.price_formatted}
                </div>
              </div>

              <div className="edit-modal__description">
                <div>Shipping Description</div>
                <div>{shippingToView?.description}</div>
              </div>
            </div>
          </div>

          <div className="bottom_section ">
            <div>
              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  deleteFnc(`${shippingToView?.id}`, () => {
                    setShowModal();
                  });
                }}
                sx={{ color: "#ffffff" }}
              >
                {loadDelete ? (
                  <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      </ModalRight>
    </div>
  );
};

export default ViewShippingDetails;
