import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { Checkbox } from "@mui/material";
import "./style.scss";
import { useEffect, useState } from "react";
import { CreateShippingModal } from "./CreateShipping";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { getCurrencyFnc, hasMatchingId } from "utils";
import { ShippingType } from "services/api.types";
import { useFormContext } from "react-hook-form";
import { useGetShippingQuery } from "services";
import { selectUserLocation } from "store/slice/AuthSlice";
import { useAppSelector } from "store/store.hooks";
type ShippingModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const SelectShippingModal = ({
  openModal,
  closeModal,
}: ShippingModalProps) => {
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [openCreateShipping, setOpenCreateShipping] = useState(false);
  const userLocation = useAppSelector(selectUserLocation);

  const { data, isLoading, isError } = useGetShippingQuery({
    location_id: userLocation?.id ? userLocation?.id : null,
  });
  const { watch, setValue } = useFormContext();
  const [selected, setSelected] = useState<ShippingType | null>(null);

  const onSubmit = () => {
    setValue("shipping_price", selected?.price);
    setValue("shipping_option", selected);
    setValue("automatedShippingCourier", null);
    setValue("shipping_record_id", null);
    closeModal();
  };

  useEffect(() => {
    if (watch("customer")) {
      setSelected(watch("customer"));
    }
  }, []);

  return (
    <>
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
              title="Select shipping"
              extraChild={
                <Button
                  variant="outlined"
                  startIcon={<PlusIcon stroke="#009444" />}
                  onClick={() => {
                    setOpenCreateShipping(true);
                  }}
                >
                  New Shipping
                </Button>
              }
            />
            <div className="displayList">
              {data?.shippingTypes?.map((item, i) => {
                return (
                  <div key={i} className="item">
                    <div>
                      <Checkbox
                        checked={item.id === selected?.id}
                        onChange={() => {
                          setSelected(item);
                        }}
                      />
                      <p className="name">{item.name}</p>
                    </div>
                    <p>
                      {getCurrencyFnc()} {item.price}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className=" bottom_section">
            <Button
              type="button"
              className="cancel"
              onClick={() => {
                setValue("shipping_price", "");
                setValue("shipping_option", null);
                setSelected(null);
                closeModal();
              }}
            >
              Cancel
            </Button>
            <Button type="button" className="save" onClick={onSubmit}>
              Continue{" "}
            </Button>
          </div>
        </div>
      </ModalRight>
      <CreateShippingModal
        openModal={openCreateShipping}
        closeModal={() => {
          setOpenCreateShipping(false);
        }}
      />
    </>
  );
};
