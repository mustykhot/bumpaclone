import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "./style.scss";
import { EditIcon } from "assets/Icons/EditIcon";
import { TaxType } from "services/api.types";
import { CircularProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";

interface IProp {
  setShowModal: () => void;
  showModal: boolean;
  taxToView: TaxType | null;
  deleteFnc: (id: string, callback?: () => void) => Promise<void>;
  loadDelete: boolean;
  setShowEditModal: () => void;
}

const ViewTaxDetails = ({
  setShowModal,
  showModal,
  deleteFnc,
  taxToView,
  loadDelete,
  setShowEditModal,
}: IProp) => {
  const handleEdit = () => {
    setShowEditModal();
  };

  return (
    <div className="view-modal">
      <ModalRight closeModal={setShowModal} openModal={showModal}>
        <div className="modal_right_children">
          <div className="top_section">
            <ModalRightTitle
              className="view-modal__right-title"
              closeModal={setShowModal}
              title="Tax Details"
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

            <div className="view-modal__container">
              <div className="view-modal__value column_value">
                <div className="top_value">
                  <div className="view-modal__value--left-align">Tax Name</div>
                  <div className="view-modal__value--right-align">
                    {taxToView?.name}
                  </div>
                </div>
                {(taxToView?.flags?.pos_apply ||
                  taxToView?.flags?.storefront_apply) && (
                  <div className="bottom_value">
                    <p></p>
                    <div className="info">
                      <InfoCircleIcon />
                      <p>
                        Applied to{" "}
                        {taxToView?.flags?.pos_apply &&
                        taxToView?.flags?.storefront_apply
                          ? "web and POS "
                          : taxToView?.flags?.pos_apply &&
                            !taxToView?.flags?.storefront_apply
                          ? "POS "
                          : taxToView?.flags?.storefront_apply &&
                            !taxToView?.flags?.pos_apply
                          ? "web "
                          : ""}
                        checkout
                      </p>{" "}
                    </div>
                  </div>
                )}
              </div>

              <div className="view-modal__value">
                {" "}
                <div className="view-modal__value--left-align">Percentage</div>
                <div className="view-modal__value--right-align">
                  {taxToView?.percent}%
                </div>
              </div>

              <div className="view-modal__description">
                <div>Tax Descrpition</div>
                <div>{taxToView?.description}</div>
              </div>
            </div>
          </div>

          <div className="bottom_section view-modal__footer">
            <div>
              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  deleteFnc(`${taxToView?.id}`, () => {
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

export default ViewTaxDetails;
