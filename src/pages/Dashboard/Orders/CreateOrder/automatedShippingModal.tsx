import { useCallback } from "react";
import { debounce } from "lodash";
import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { useEffect, useState } from "react";
import InputField from "components/forms/InputField";
import TextAreaField from "components/forms/TextAreaField";
import {
  useGetCountriesQuery,
  useGetCityByStateIDQuery,
  useGetStatesByCountryIDQuery,
  useLoadCourierMutation,
  useGetCustomerPickupLocationQuery,
  useSubmitCourierMutation,
} from "services";
import { showToast, useAppSelector } from "store/store.hooks";
import { areObjectsEqual, formatPrice, handleError } from "utils";
import { Checkbox, CircularProgress, Radio } from "@mui/material";
import { getObjWithValidValues } from "utils/constants/general";
import { selectUserLocation } from "store/slice/AuthSlice";

import { useFormContext } from "react-hook-form";
import AutoCompleteField from "components/forms/AutoComplete";

import { selectProductItems } from "store/slice/OrderSlice";
import moment from "moment";
import { CourierType } from "services/api.types";
import NormalSelectField from "components/forms/NormalSelectField";

type ModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export type CourierFormType = {
  pickup_date: string;
  location_id: string;
  customer_delivery_address: string;
  city_id: string;
  country_id: string;
  state_id: string;
  phone: string;
  first_name: string;
  last_name: string;
  email: string;
  save_customer_address: boolean;
  customer_id: number;
  customer_pickup_location_id?: string;
  items: {
    id: number;
    quantity: number;
    price: number;
    name: string;
    description: string;
  }[];
};

type FormType = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  pickup_date: string;
  customer_delivery_address: string;
  city_id: string;
  state_id: string;
  country_id: string;
  customer_pickup_location_id?: string;
};

export const AutomatedShippingModal = ({
  openModal,
  closeModal,
}: ModalProps) => {
  const userLocation = useAppSelector(selectUserLocation);
  const [loadCourier, { isLoading: isCourierLoading }] =
    useLoadCourierMutation();

  const [submitCourier, { isLoading: isSubmitCourierLoading }] =
    useSubmitCourierMutation();
  const { watch, setValue } = useFormContext();
  const addedProducts = useAppSelector(selectProductItems);
  const [temporaryFormData, setTemporaryFormData] = useState<FormType | null>(
    null
  );
  const [formData, setFormData] = useState<FormType>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    pickup_date: "",
    customer_delivery_address: "",
    city_id: "",
    state_id: "",
    country_id: "",
    customer_pickup_location_id: "",
  });

  const [saveToCustomer, setSaveToCustomer] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<any>("");
  const [selectedState, setSelectedState] = useState<any>("");
  const [courierResult, setCourierList] = useState<CourierType[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<CourierType | null>(
    null
  );
  const [requestToken, setRequestToken] = useState("");

  const {
    data: countries,
    isLoading: loadCountries,
    isFetching: fetchCountries,
  } = useGetCountriesQuery();

  const {
    data: states,
    isLoading: loadStates,
    isFetching: fetchStates,
  } = useGetStatesByCountryIDQuery(selectedCountry, {
    skip: selectedCountry ? false : true,
  });

  const {
    data: city,
    isLoading: loadCity,
    isFetching: fetchCity,
  } = useGetCityByStateIDQuery(selectedState, {
    skip: selectedState ? false : true,
  });

  const {
    data: customerPickupLocation,
    isLoading: loadCustomerPickupLocation,
    isError,
  } = useGetCustomerPickupLocationQuery(watch("customer_details")?.id, {
    skip: watch("customer_details")?.id ? false : true,
  });

  const handleInputs = async (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const loadCourierFnc = async () => {
    const payload = {
      pickup_date: formData?.pickup_date
        ? moment(formData?.pickup_date).format("YYYY-MM-DD")
        : "",
      phone: formData?.phone,
      customer_delivery_address: formData?.customer_delivery_address,
      city_id: `${formData?.city_id}`,
      country_id: `${formData?.country_id}`,
      state_id: `${formData?.state_id}`,
      first_name: formData?.first_name,
      last_name: formData?.last_name,
      email: formData?.email,
      save_customer_address: saveToCustomer,
      location_id: `${userLocation?.id}`,
      customer_id: watch("customer_details")?.id,
      customer_pickup_location_id: areObjectsEqual(formData, temporaryFormData)
        ? formData?.customer_pickup_location_id
        : "",
      items: addedProducts.map((item: any) => {
        return getObjWithValidValues({
          id: item.itemId ? item.itemId : item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          description: item.description || "",
        });
      }),
    };

    try {
      let result = await loadCourier(getObjWithValidValues(payload));
      if ("data" in result) {
        setCourierList(result.data?.data?.couriers || []);
        setRequestToken(result.data?.data?.request_token);
        showToast("Loaded successfuly", "success");
        setStep(1);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const submitSelectedCourier = async (courier: CourierType | null) => {
    if (courier) {
      const payload = {
        token: requestToken,
        courier_id: courier?.courier_id,
        courier_service_code: courier?.service_code,
      };

      try {
        let result = await submitCourier(payload);
        if ("data" in result) {
          showToast("Saved successfuly", "success");
          setValue("automatedShippingCourier", {
            img: courier?.courier_image,
            name: courier?.courier_name,
            price: result?.data?.data?.shipment?.payment?.shipping_fee,
          });
          setValue("shipping_record_id", result?.data?.data?.record?.id);
          setValue(
            "shipping_price",
            result?.data?.data?.shipment?.payment?.shipping_fee
          );
          setValue("shipping_option", null);

          closeEntireModal();
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    } else {
      showToast("Please select a shipping service", "warning");
    }
  };

  const closeModalFnc = () => {
    if (step === 0) {
      closeEntireModal();
    } else {
      setStep(0);
    }
  };

  const closeEntireModal = () => {
    setStep(0);
    setSelectedCourier(null);
    setRequestToken("");

    closeModal();
  };

  useEffect(() => {
    if (watch("customer_details")) {
      let customerDetails = watch("customer_details");
      setTemporaryFormData({
        ...formData,
        first_name: customerDetails?.first_name || "",
        last_name: customerDetails?.last_name || "",
        phone: customerDetails?.phone || "",
        email: customerDetails?.email || "",
        customer_delivery_address:
          customerDetails?.shipping_address?.street || "",

        pickup_date: moment().format("YYYY-MM-DD"),
      });

      setFormData({
        ...formData,
        first_name: customerDetails?.first_name || "",
        last_name: customerDetails?.last_name || "",
        phone: customerDetails?.phone || "",
        email: customerDetails?.email || "",
        customer_delivery_address:
          customerDetails?.shipping_address?.street || "",

        pickup_date: moment().format("YYYY-MM-DD"),
      });
    }
  }, [watch("customer_details")]);

  useEffect(() => {
    if (customerPickupLocation && customerPickupLocation?.data?.length) {
      let latest = customerPickupLocation?.data[0];

      setValue("country_id", `${latest?.country_id}`);

      setFormData({
        ...formData,
        customer_pickup_location_id: latest?.id,
        city_id: `${latest?.city_id}`,
        state_id: `${latest?.state_id}`,
        country_id: `${latest?.country_id}`,
        customer_delivery_address: latest?.address,
      });

      setTemporaryFormData({
        ...formData,
        customer_pickup_location_id: latest?.id,
        city_id: `${latest?.city_id}`,
        state_id: `${latest?.state_id}`,
        country_id: `${latest?.country_id}`,
        customer_delivery_address: latest?.address,
      });

      setSelectedCountry(`${latest?.country_id}`);
      setSelectedState(`${latest?.state_id}`);
    }
  }, [customerPickupLocation]);

  console.log(formData, "formData");

  return (
    <ModalRight
      closeModal={() => {
        closeModalFnc();
      }}
      closeOnOverlayClick={false}
      openModal={openModal}
    >
      <div className="modal_right_children pd-select-automated-shipping-options-modal">
        <div className="top_section">
          <ModalRightTitle
            closeModal={() => {
              closeModalFnc();
            }}
            title={`Automated Shipping`}
          />

          {step === 0 && (
            <div className="brief_form">
              <div className="form-group-flex">
                <InputField
                  name="first_name"
                  placeholder="Raji "
                  label="First Name"
                  required={true}
                  type={"text"}
                  value={formData.first_name}
                  onChange={(e) => {
                    handleInputs(e);
                  }}
                />
                <InputField
                  name="last_name"
                  placeholder=" Mustapha"
                  label="Last Name"
                  type={"text"}
                  value={formData.last_name}
                  onChange={(e) => {
                    handleInputs(e);
                  }}
                />
              </div>

              <div className="form-group-flex">
                <InputField
                  name="phone"
                  placeholder="08087427344"
                  label="Phone"
                  type={"tel"}
                  value={formData.phone}
                  onChange={(e) => {
                    handleInputs(e);
                  }}
                />

                <InputField
                  name="email"
                  placeholder="gift@getbumpa.com"
                  label="Email"
                  type={"text"}
                  value={formData.email}
                  onChange={(e) => {
                    handleInputs(e);
                  }}
                  required
                />
              </div>

              <InputField
                name="pickup_date"
                label="Pickup Date"
                type="date"
                value={formData.pickup_date}
                onChange={(e) => {
                  handleInputs(e);
                }}
              />

              <AutoCompleteField
                loading={loadCountries || fetchCountries}
                name="country_id"
                required
                label="Country"
                selectOption={
                  countries && countries.length
                    ? [
                        { label: "Nigeria", value: `160` },
                        ...countries.map((item) => {
                          return {
                            label: item.name,
                            value: `${item.id}`,
                          };
                        }),
                      ]
                    : []
                }
                handleCustomChange={(val) => {
                  setSelectedCountry(val.value);

                  setFormData({
                    ...formData,
                    country_id: val.value,
                    state_id: "",
                    city_id: "",
                  });
                }}
              />
              <div className="form-group-flex">
                <NormalSelectField
                  name="state_id"
                  label="State"
                  isLoading={loadStates || fetchStates}
                  value={formData?.state_id}
                  selectOption={
                    states && states.length
                      ? states.map((item) => {
                          return { key: item.name, value: item.id };
                        })
                      : []
                  }
                  handleCustomChange={(e) => {
                    setSelectedState(e.target.value);
                    setFormData({
                      ...formData,
                      state_id: e.target.value,
                      city_id: "",
                    });
                  }}
                />

                <NormalSelectField
                  isLoading={loadCity || fetchCity}
                  name="city_id"
                  label="City"
                  value={formData?.city_id}
                  selectOption={
                    city && city.length
                      ? city.map((item) => {
                          return { key: item.name, value: item.id };
                        })
                      : []
                  }
                  handleCustomChange={(e) => {
                    setFormData({ ...formData, city_id: e.target.value });
                  }}
                />
              </div>

              <InputField
                name="customer_delivery_address"
                label="Delivery Address"
                required
                type={"text"}
                value={formData.customer_delivery_address}
                onChange={(e) => {
                  handleInputs(e);
                }}
              />

              <div className="checkbox_section">
                <Checkbox
                  checked={saveToCustomer}
                  onChange={() => {
                    setSaveToCustomer(!saveToCustomer);
                  }}
                />
                <p>Save to customer's information</p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="shipping-partner">
              <h4>Select Shipping Rate</h4>

              <div className="list">
                {courierResult?.map((item, i) => (
                  <div
                    key={i}
                    className="partner-item"
                    onChange={() => setSelectedCourier(item)}
                  >
                    <div className="flex items-center gap-2">
                      <Radio
                        checked={
                          item.courier_id === selectedCourier?.courier_id
                        }
                        name="radio-buttons"
                      />
                      <div className="image-name">
                        <img src={item.courier_image} alt="partner" />
                        <p>{item.courier_name}</p>
                      </div>
                    </div>

                    <div className="text">
                      <p className="fee">Fee</p>
                      <p className="amount">
                        {formatPrice(Number(item.total))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className=" bottom_section">
          <Button
            type="button"
            className="cancel"
            disabled={isCourierLoading || isSubmitCourierLoading}
            onClick={() => closeModalFnc()}
          >
            Cancel
          </Button>

          <Button
            type="button"
            className="save"
            disabled={isCourierLoading || isSubmitCourierLoading}
            onClick={() => {
              if (step === 0) {
                loadCourierFnc();
              } else {
                submitSelectedCourier(selectedCourier);
              }
            }}
          >
            {isCourierLoading || isSubmitCourierLoading ? (
              <CircularProgress sx={{ color: "#ffffff" }} size="1.5rem" />
            ) : step === 0 ? (
              "Load Shipping Rates"
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};
