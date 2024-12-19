import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "./style.scss";
import { EditIcon } from "assets/Icons/EditIcon";
import Button from "@mui/material/Button";
import { ShippingType } from "services/api.types";
import { CircularProgress } from "@mui/material";
import { Toggle } from "components/Toggle";
import { formatPrice } from "utils";
import { useGetShippingQuery } from "services";
import { selectUserLocation } from "store/slice/AuthSlice";
import { useAppSelector } from "store/store.hooks";
import { useEffect, useState } from "react";
import Loader from "components/Loader";
import ErrorMsg from "components/ErrorMsg";

interface IProp {
  setShowModal: () => void;
  setShowEditModal: () => void;
  showModal: boolean;
  shippingToView: ShippingType | null;
  handleToggleFreeshipping: any;
  deleteFnc: (id: string, callback?: () => void) => void;
  setShowFreeEditModal: (val: boolean) => void;
  loadDelete: boolean;
}

const ViewFreeShippingDetails = ({
  setShowModal,
  showModal,
  setShowEditModal,
  handleToggleFreeshipping,
  setShowFreeEditModal,
  deleteFnc,
  loadDelete,
}: IProp) => {
  const userLocation = useAppSelector(selectUserLocation);
  const [freeShipping, setFreeShipping] = useState<ShippingType | null>(null);
  const { data, isLoading, isError } = useGetShippingQuery({
    location_id: userLocation?.id ? userLocation?.id : null,
  });
  useEffect(() => {
    if (data && data?.shippingTypes?.length) {
      let filtered = data?.shippingTypes?.filter((item) => item?.is_free === 1);
      if (filtered?.length) {
        setFreeShipping(filtered[0]);
      } else {
        setFreeShipping(null);
      }
    }
  }, [data]);

  return (
    <>
      {isLoading && <Loader />}
      {
        <div className="edit-modal">
          <ModalRight closeModal={setShowModal} openModal={showModal}>
            <div className="modal_right_children">
              {isError && <ErrorMsg error={"Something went wrong"} />}
              {!isError && freeShipping && (
                <>
                  <div className="top_section">
                    <ModalRightTitle
                      className="edit-modal__right-title"
                      closeModal={setShowModal}
                      title="Shipping Details"
                      extraChild={
                        <Button
                          onClick={() => {
                            setShowFreeEditModal(true);
                          }}
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
                        <p className="edit-modal__value--left-align">
                          {freeShipping?.status === 1
                            ? "Deactiviate"
                            : "Activate"}
                        </p>
                        <div className="edit-modal__value--right-align">
                          <Toggle
                            toggled={freeShipping?.status === 1 ? true : false}
                            handlelick={handleToggleFreeshipping}
                          />
                        </div>
                      </div>

                      <div className="edit-modal__value">
                        <p className="edit-modal__value--left-align">
                          Shipping Title
                        </p>
                        <p className="edit-modal__value--right-align">
                          {freeShipping?.name}
                        </p>
                      </div>

                      <div className="edit-modal__value">
                        <div className="edit-modal__value--left-align">
                          Minimum cart amount
                        </div>
                        <p className="edit-modal__value--right-align">
                          {formatPrice(
                            freeShipping?.conditions?.minimum_cart || 0
                          )}
                        </p>
                      </div>

                      <div className="edit-modal__description">
                        <p>Shipping Description</p>
                        <p>{freeShipping?.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bottom_section ">
                    <div>
                      <Button
                        color="error"
                        variant="contained"
                        onClick={() => {
                          deleteFnc(`${freeShipping?.id}`);
                        }}
                        sx={{ color: "#ffffff" }}
                      >
                        {loadDelete ? (
                          <CircularProgress
                            size="1.5rem"
                            sx={{ color: "#ffffff" }}
                          />
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ModalRight>
        </div>
      }
    </>
  );
};

export default ViewFreeShippingDetails;
