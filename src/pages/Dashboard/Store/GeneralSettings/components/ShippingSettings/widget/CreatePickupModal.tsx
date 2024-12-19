import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";

import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import ValidatedInput from "components/forms/ValidatedInput";
import InputField from "components/forms/InputField";
import AutoCompleteField from "components/forms/AutoComplete";
import SelectField from "components/forms/SelectField";
import {
  useCreatePickupLocationMutation,
  useGetCityByStateIDQuery,
  useGetCountriesQuery,
  useGetStatesByCountryIDQuery,
  useEditPickupLocationMutation,
} from "services";
import { showToast, useAppSelector } from "store/store.hooks";
import { selectUserLocation } from "store/slice/AuthSlice";
import { PickupLocationType } from "services/api.types";
import { handleError } from "utils";
import { getObjWithValidValues } from "utils/constants/general";

export type PickupField = {
  location_id: number;
  phone: string;
  city_id: string;
  country_id: string;
  state_id: string;
  address?: string;
  id?: string;
  is_dispatch: boolean;
  opening_hour: string;
  closing_hour: string;
};

type ModalProps = {
  editFields?: PickupLocationType | null;
  openModal: boolean;
  closeModal: () => void;
  type?: string;
  setEditField?: (val: any) => void;
};

export const CreatePickupModal = ({
  editFields,
  setEditField,
  openModal,
  closeModal,
  type,
}: ModalProps) => {
  const userLocation = useAppSelector(selectUserLocation);

  const [createPickup, { isLoading }] = useCreatePickupLocationMutation();
  const [editPickup, { isLoading: isEditLoading }] =
    useEditPickupLocationMutation();
  const [selectedCountry, setSelectedCountry] = useState<any>("");
  const [selectedState, setSelectedState] = useState<any>("");

  const { data: countries, isLoading: loadCountries } = useGetCountriesQuery();
  const { data: states, isLoading: loadStates } = useGetStatesByCountryIDQuery(
    selectedCountry,
    {
      skip: selectedCountry ? false : true,
    }
  );
  const { data: city, isLoading: loadCity } = useGetCityByStateIDQuery(
    selectedState,
    {
      skip: selectedState ? false : true,
    }
  );

  const methods = useForm<PickupField>({
    mode: "all",
  });

  const {
    formState: { isValid },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = methods;

  const onSubmit: SubmitHandler<PickupField> = async (data) => {
    const payload = {
      ...data,
      is_dispatch: type === "dispatch" ? true : false,
      id: editFields?.id,
      location_id: userLocation?.id,
    };
    if (editFields) {
      try {
        let result = await editPickup({
          id: `${editFields?.id}`,
          body: getObjWithValidValues(payload),
        });
        if ("data" in result) {
          showToast("Edited successfully", "success");
          closeModal();
          setEditField && setEditField(null);
          resetFields();
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    } else {
      try {
        let result = await createPickup(getObjWithValidValues(payload));
        if ("data" in result) {
          showToast("Created successfully", "success");
          resetFields();
          closeModal();
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  const resetFields = () => {
    reset();
    setSelectedCountry("");
    setSelectedState("");
  };

  useEffect(() => {
    if (editFields) {
      setValue("phone", editFields?.phone);
      setValue("country_id", `${editFields?.country_id}`);
      setValue("state_id", `${editFields?.state_id}`);
      setValue("city_id", `${editFields?.city_id}`);
      setValue("address", editFields?.address);
      setValue("opening_hour", editFields?.opening_hour);
      setValue("closing_hour", editFields?.closing_hour);
      setSelectedCountry(editFields?.country_id);
      setSelectedState(editFields?.state_id);
    }
  }, [editFields]);

  return (
    <ModalRight
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="modal_right_children automated_shipping_modal create_pickup_modal"
        >
          <div className="top_section">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              title={`${
                type === "dispatch" ? "Dispatch" : "Customer"
              } Pick-up Location`}
            />

            <div className="pickup_form">
              <InputField
                name="store_location"
                label="Store Location"
                disabled
                value={userLocation?.name}
                type={"text"}
                containerClass={"disabled"}
              />

              <ValidatedInput
                name="phone"
                required
                label="Contact Phone Number"
                type={"number"}
                placeholder="Enter Phone"
              />

              <AutoCompleteField
                isLoading={loadCountries}
                name="country_id"
                label="Country"
                required
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
                }}
              />

              <div className="form-group-flex">
                <SelectField
                  name="state_id"
                  label="State"
                  isLoading={loadStates}
                  required
                  selectOption={
                    states && states.length
                      ? states.map((item) => {
                          return { key: item.name, value: item.id };
                        })
                      : []
                  }
                  handleCustomChange={(val) => {
                    setSelectedState(val);
                  }}
                />

                <SelectField
                  isLoading={loadCity}
                  name="city_id"
                  label="City"
                  required
                  selectOption={
                    city && city.length
                      ? city.map((item) => {
                          return { key: item.name, value: item.id };
                        })
                      : []
                  }
                />
              </div>

              <ValidatedInput
                name="address"
                required={true}
                label="Address"
                type={"text"}
                placeholder="Enter Address"
              />

              {type === "customer" && (
                <div className="form-group-flex">
                  <ValidatedInput
                    name="opening_hour"
                    required={true}
                    label="Opening Hour"
                    type={"time"}
                  />

                  <ValidatedInput
                    name="closing_hour"
                    required={true}
                    label="Closing Hour"
                    type={"time"}
                  />
                </div>
              )}
            </div>
          </div>

          <div className=" bottom_section">
            <Button type="button" className="cancel" onClick={closeModal}>
              Cancel
            </Button>

            <Button type="submit" disabled={!isValid} className="save">
              {isLoading || isEditLoading ? (
                <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </ModalRight>
  );
};
