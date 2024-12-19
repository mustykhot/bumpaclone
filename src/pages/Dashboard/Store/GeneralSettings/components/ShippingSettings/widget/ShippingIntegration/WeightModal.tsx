import { Button, IconButton } from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";
import { ScaleIcon } from "assets/Icons/ScaleIcon";
import customImg from "assets/images/custom.png";

import Modal from "components/Modal";
import ErrorMsg from "components/ErrorMsg";
import InputField from "components/forms/InputField";

import {
  selectShipbubbleSettingsUpdateField,
  updateShipbubbleShippingSettingState,
} from "store/slice/ShippingSettingsSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { useGetShipbubbleBoxSizeQuery } from "services";
import "./style.scss";

type ModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

const compareObjects = (obj1?: any, obj2?: any) => {
  return (
    obj1?.max_weight === obj2?.weight &&
    obj1?.height === obj2?.height &&
    obj1?.width === obj2?.width &&
    obj1?.length === obj2?.length
  );
};

export const WeightModal = ({ openModal, closeModal }: ModalProps) => {
  const dispatch = useAppDispatch();
  const { data, isLoading, isFetching, isError } =
    useGetShipbubbleBoxSizeQuery();
  const shipbubbleShippingSettingsUpdateFields = useAppSelector(
    selectShipbubbleSettingsUpdateField
  );

  return (
    <Modal
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <div className="pd_weight_modal">
        <div className="header">
          <div className="text_flex">
            <IconButton className="icon_button_container">
              <ScaleIcon />
            </IconButton>
            <h3>Shipping Box Size</h3>
          </div>

          <IconButton
            onClick={() => {
              closeModal();
            }}
            className="icon_button_container"
          >
            <XIcon />
          </IconButton>
        </div>
        <>
          {isLoading && !isError && ""}

          {isError && <ErrorMsg error="Something went wrong" />}

          {!isError && data && data?.data && (
            <>
              <div className="box_flex">
                {[
                  ...data?.data,
                  {
                    name: "custom",
                    description_image_url: customImg,
                    max_weight: "",
                    length: "",
                    width: "",
                    height: "",
                  },
                ].map((item) => (
                  <div
                    className={`single_box ${
                      item.name === "custom"
                        ? item.name ===
                          shipbubbleShippingSettingsUpdateFields
                            ?.custom_box_size?.name
                          ? "active"
                          : ""
                        : compareObjects(
                            item,
                            shipbubbleShippingSettingsUpdateFields?.custom_box_size
                          )
                        ? "active"
                        : ""
                    }`}
                    key={item.name}
                    onClick={() => {
                      dispatch(
                        updateShipbubbleShippingSettingState({
                          custom_box_size: {
                            weight: item.max_weight,
                            length: item.length,
                            width: item.width,
                            height: item.height,
                            name: item.name,
                          },
                        })
                      );
                    }}
                  >
                    <img src={item.description_image_url} alt="flyer" />

                    <div className="text_section">
                      <p className="name">{item.name}</p>
                      {item.name !== "custom" ? (
                        <>
                          <p className="weight">
                            Max Weight: {item.max_weight} Kg
                          </p>
                          <p className="size">
                            H:{item.height}cm. L:
                            {item.length}
                            cm W:
                            {item.width}cm
                          </p>
                        </>
                      ) : (
                        <p className="size">Enter your size</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {shipbubbleShippingSettingsUpdateFields?.custom_box_size?.name ===
                "custom" && (
                <div className="custom_inputs">
                  <h4>Enter custom weight and size</h4>

                  <div className="form-group-autoflex">
                    <InputField
                      label="Weight"
                      value={
                        shipbubbleShippingSettingsUpdateFields?.custom_box_size
                          ?.weight
                      }
                      suffix={<p className="kg">Kg</p>}
                      onChange={(e) => {
                        dispatch(
                          updateShipbubbleShippingSettingState({
                            custom_box_size: {
                              ...shipbubbleShippingSettingsUpdateFields?.custom_box_size,
                              weight: `${e.target.value}`,
                            },
                          })
                        );
                      }}
                    />

                    <InputField
                      label="Height"
                      value={
                        shipbubbleShippingSettingsUpdateFields?.custom_box_size
                          ?.height
                      }
                      suffix={<p className="kg">cm</p>}
                      onChange={(e) => {
                        dispatch(
                          updateShipbubbleShippingSettingState({
                            custom_box_size: {
                              ...shipbubbleShippingSettingsUpdateFields?.custom_box_size,
                              height: `${e.target.value}`,
                            },
                          })
                        );
                      }}
                    />

                    <InputField
                      label="Width"
                      value={
                        shipbubbleShippingSettingsUpdateFields?.custom_box_size
                          ?.width
                      }
                      suffix={<p className="kg">cm</p>}
                      onChange={(e) => {
                        dispatch(
                          updateShipbubbleShippingSettingState({
                            custom_box_size: {
                              ...shipbubbleShippingSettingsUpdateFields?.custom_box_size,
                              width: `${e.target.value}`,
                            },
                          })
                        );
                      }}
                    />

                    <InputField
                      label="Length"
                      value={
                        shipbubbleShippingSettingsUpdateFields?.custom_box_size
                          ?.length
                      }
                      suffix={<p className="kg">cm</p>}
                      onChange={(e) => {
                        dispatch(
                          updateShipbubbleShippingSettingState({
                            custom_box_size: {
                              ...shipbubbleShippingSettingsUpdateFields?.custom_box_size,
                              length: `${e.target.value}`,
                            },
                          })
                        );
                      }}
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={closeModal}
                variant="contained"
                className="primary_styled_button"
              >
                Save
              </Button>
            </>
          )}
        </>
      </div>
    </Modal>
  );
};
