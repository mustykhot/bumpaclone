import ModalRight from "components/ModalRight";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "./style.scss";
import ValidatedInput, {
  formatNumberWithCommas,
  removeFormattedNumerComma,
} from "components/forms/ValidatedInput";
import ValidatedTextArea from "components/forms/ValidatedTextArea";
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  CircularProgress,
  Button,
} from "@mui/material";
import { NairaIcon } from "assets/Icons/NairaIcon";
import { ShippingType } from "services/api.types";
import { useEffect, useState } from "react";
import { useEditShippingMutation } from "services";
import { showToast, useAppSelector } from "store/store.hooks";
// import { useNavigate } from "react-router-dom";
import { getCurrencyFnc, handleError } from "utils";
import { selectUserLocation } from "store/slice/AuthSlice";
import InputField from "components/forms/InputField";

interface IProp {
  setShowModal: () => void;
  showModal: boolean;
  shippingToView: ShippingType | null;
}

export type EditShippingFeilds = {
  name?: string;
  price?: number | string;
  description?: string;
  visible?: boolean;
  location_id?: number;
  status?: boolean;
  free?: boolean;
  conditions?: { minimum_cart: number };
};

const EditShipping = ({ setShowModal, showModal, shippingToView }: IProp) => {
  const methods = useForm<EditShippingFeilds>({
    mode: "all",
  });
  const [isCheck, setIsCheck] = useState(false);
  const [editShipping, { isLoading }] = useEditShippingMutation();
  const userLocation = useAppSelector(selectUserLocation);

  const onSubmit: SubmitHandler<EditShippingFeilds> = async (data) => {
    try {
      let result = await editShipping({
        body: {
          ...data,
          price: removeFormattedNumerComma(data.price || 0) as number,
          visible: isCheck,
        },
        id: `${shippingToView?.id}`,
      });
      if ("data" in result) {
        showToast("Created successfully", "success");
        setShowModal();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const { handleSubmit, setValue } = methods;
  useEffect(() => {
    if (shippingToView) {
      setValue("description", shippingToView?.description);
      setValue("name", shippingToView?.name);
      setValue("location_id", shippingToView?.location_id);
      setValue(
        "price",
        formatNumberWithCommas(
          parseFloat(String(shippingToView?.price || 0)?.replace(/,/g, ""))
        )
      );
      setValue("visible", shippingToView?.visible === 1 ? true : false);
      setIsCheck(shippingToView?.visible === 1 ? true : false);
    }
    // eslint-disable-next-line
  }, [shippingToView]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="edit-modal">
        <ModalRight closeModal={setShowModal} openModal={showModal}>
          <div className="modal_right_children">
            <div className="top_section">
              <ModalRightTitle
                className="edit-modal__right-title"
                closeModal={setShowModal}
                title="Edit Shipping Details"
              />

              <div className="edit-modal__container">
                <div className="">
                  <InputField
                    label="Store Location"
                    type={"text"}
                    value={userLocation?.name}
                    containerClass="styledInput"
                    disabled
                  />

                  <ValidatedInput
                    name="name"
                    label="Shipping Title"
                    type={"text"}
                    placeholder="Enter title"
                    containerClass="pd-shipping-input"
                  />

                  <ValidatedInput
                    type={"number"}
                    name="price"
                    label="Shipping Fee"
                    formatValue={true}
                    placeholder="0.00"
                    prefix={
                      <p className="text-[#9BA2AC] font-semibold text-[20px]">
                        {getCurrencyFnc()}
                      </p>
                    }
                    required={false}
                    containerClass="pd-shipping-input"
                  />

                  <ValidatedTextArea
                    name="description"
                    label="Shipping Description"
                    extraClass="pd-shipping-input"
                    height="h-[120px]"
                    required={false}
                  />
                  <div className="shipping-visibility">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isCheck}
                            onChange={(e) => {
                              setIsCheck(!isCheck);
                            }}
                          />
                        }
                        label="Make shipping method visible on web checkout"
                        labelPlacement="end"
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>

            <div className="bottom_section ">
              <Button className="cancel" onClick={setShowModal}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                {isLoading ? (
                  <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </ModalRight>
      </form>
    </FormProvider>
  );
};

export default EditShipping;
