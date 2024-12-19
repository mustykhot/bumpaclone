import { useEffect, useState } from "react";
import { Checkbox } from "@mui/material";
import Button from "@mui/material/Button";

import Modal from "components/Modal";
import InputField from "components/forms/InputField";
import NormalSelectField from "components/forms/NormalSelectField";

import { useGetCountriesQuery, useGetStatesQuery } from "services";
import { OrderType } from "Models/order";
import "./style.scss";

type EditAddressModalProps = {
  openModal: boolean;
  title: string;
  order: OrderType | null | undefined;
  closeModal: () => void;
  actionFnc: (value: any, callback?: () => void) => void;
};

export const EditAddressModal = ({
  closeModal,
  openModal,
  actionFnc,
  title,
  order,
}: EditAddressModalProps) => {
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    phone: "",
  });
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isBoth, setIsBoth] = useState(false);
  const [applyShipping, setApplyShipping] = useState(false);
  const { data: countries, isLoading: loadCountries } = useGetCountriesQuery();
  const { data: states, isLoading: loadStates } = useGetStatesQuery(
    selectedCountry,
    { skip: selectedCountry ? false : true }
  );
  const handleInputs = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      street: "",
      city: "",
      state: "",
      country: "",
      zip: "",
      phone: "",
    });
  };

  useEffect(() => {
    if (order) {
      if (order.shipping_details) {
        setSelectedCountry(order.shipping_details.country);
        setFormData({
          street: order.shipping_details.street,
          city: order.shipping_details.city,
          state: order.shipping_details.state,
          country: order.shipping_details.country,
          zip: order.shipping_details.zip,
          phone: order.shipping_details.phone,
        });
      } else if (order.customer && order.customer?.shipping_address) {
        setSelectedCountry(order.customer?.shipping_address.country);
        setFormData({
          street: order.customer?.shipping_address.street,
          city: order.customer?.shipping_address.city,
          state: order.customer?.shipping_address.state,
          country: order.customer?.shipping_address.country,
          zip: order.customer?.shipping_address.zip,
          phone: order.customer?.shipping_address.phone,
        });
      }
    }
  }, [order]);

  return (
    <>
      <Modal openModal={openModal} closeModal={closeModal}>
        <div className="change_value_container">
          <div className="title_section">
            <h6>
              {order ? "Edit" : "Add"} {title} address{" "}
            </h6>
          </div>
          <div className="form_section">
            <div className="form_aspect w-full">
              <div className="form-group-flex">
                <NormalSelectField
                  name="country"
                  isLoading={loadCountries}
                  required={false}
                  selectOption={
                    countries && countries.length
                      ? [
                          { key: "Nigeria", value: "Nigeria" },
                          ...countries.map((item) => {
                            return { key: item.name, value: item.name };
                          }),
                        ]
                      : []
                  }
                  value={formData.country}
                  handleCustomChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setFormData({ ...formData, country: e.target.value });
                  }}
                  label="Country"
                />
                <NormalSelectField
                  name="state"
                  required={false}
                  isLoading={loadStates}
                  handleCustomChange={(e) => {
                    setFormData({ ...formData, state: e.target.value });
                  }}
                  value={formData.state}
                  selectOption={
                    states && states.length
                      ? states.map((item) => {
                          return { key: item, value: item };
                        })
                      : []
                  }
                  label="State"
                />
              </div>

              <InputField
                name="street"
                label="Address"
                type={"text"}
                value={formData.street}
                onChange={(e) => {
                  handleInputs(e);
                }}
              />
              <InputField
                name="phone"
                label="Phone number"
                type={"text"}
                value={formData.phone}
                onChange={(e) => {
                  handleInputs(e);
                }}
              />
              <InputField
                name="city"
                label="City"
                type={"text"}
                value={formData.city}
                onChange={(e) => {
                  handleInputs(e);
                }}
              />
              {formData.country !== "Nigeria" && (
                <InputField
                  name="zip"
                  label="Zip/Postal Code"
                  type={"text"}
                  value={formData.zip}
                  onChange={(e) => {
                    handleInputs(e);
                  }}
                />
              )}

              {title === "shipping" && (
                <div className="check_box flex items-center">
                  <Checkbox
                    checked={applyShipping}
                    onChange={() => {
                      setApplyShipping(!applyShipping);
                    }}
                    sx={{
                      paddingLeft: 0,
                    }}
                  />{" "}
                  <p className="text-[14px]">
                    Apply details to customer's shipping address
                  </p>
                </div>
              )}

              <div className="check_box flex items-center">
                <Checkbox
                  checked={isBoth}
                  onChange={() => {
                    setIsBoth(!isBoth);
                  }}
                  sx={{
                    paddingLeft: 0,
                  }}
                />{" "}
                <p className="text-[14px]">
                  Apply details to customer's
                  {title === "shipping" ? " billing" : " shipping"} address
                </p>
              </div>
            </div>

            <div className="btn_flex">
              <Button
                onClick={() => {
                  actionFnc({ ...formData, isBoth, applyShipping }, () => {
                    resetForm();
                  });
                  closeModal();
                }}
                className="primary_styled_button"
                variant="contained"
              >
                Apply
              </Button>
              <Button
                onClick={() => {
                  closeModal();
                }}
                variant="outlined"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
