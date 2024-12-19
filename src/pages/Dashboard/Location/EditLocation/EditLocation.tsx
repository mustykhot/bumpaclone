import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import AutoCompleteField from "components/forms/AutoComplete";
import SelectField from "components/forms/SelectField";
import ValidatedInput from "components/forms/ValidatedInput";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import {
  useEditLocationMutation,
  useGetCityByStateIDQuery,
  useGetCountriesQuery,
  useGetStatesByCountryIDQuery,
} from "services";
import { LocationType } from "services/api.types";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
import { getObjWithValidValues } from "utils/constants/general";
import { CreateLocationFields } from "../CreateLocation";

type EditLocationModalProps = {
  openModal: boolean;
  closeModal: () => void;
  locationToBeEdited?: LocationType | null | undefined;
};

export const EditLocationModal = ({
  openModal,
  closeModal,
  locationToBeEdited,
}: EditLocationModalProps) => {
  const [isPrimary, setIsPrimary] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<any>("");
  const [selectedState, setSelectedState] = useState<any>("");

  const [editLocation, { isLoading }] = useEditLocationMutation();
  const { data: countries, isLoading: loadCountries } = useGetCountriesQuery();
  const { data: states, isLoading: loadStates } = useGetStatesByCountryIDQuery(
    selectedCountry,
    {
      skip: !selectedCountry,
    }
  );
  const { data: city, isLoading: loadCity } = useGetCityByStateIDQuery(
    selectedState,
    {
      skip: !selectedState,
    }
  );

  const methods = useForm<CreateLocationFields>({
    mode: "all",
  });
  const { handleSubmit, setValue, reset } = methods;

  const onSubmit: SubmitHandler<CreateLocationFields> = async (data) => {
    try {
      let result = await editLocation({
        body: { ...getObjWithValidValues(data), is_default: isPrimary ? 1 : 0 },
        id: locationToBeEdited?.id,
      });
      if ("data" in result) {
        showToast("Edited successfully", "success");
        closeModal();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (locationToBeEdited) {
      setValue("name", locationToBeEdited?.name);
      setValue("address", locationToBeEdited?.address);
      setValue("country_id", `${locationToBeEdited?.country_id}`);
      setValue("state_id", `${locationToBeEdited?.state_id}`);
      setValue("city_id", `${locationToBeEdited?.city_id}`);
      setSelectedCountry(locationToBeEdited?.country_id);
      setSelectedState(locationToBeEdited?.state_id);
      setIsPrimary(locationToBeEdited?.is_default === 1 ? true : false);
    }
  }, [locationToBeEdited, countries, states]);

  return (
    <ModalRight
      closeModal={() => {
        reset();
        closeModal();
      }}
      openModal={openModal}
    >
      <FormProvider {...methods}>
        <form className="w-full h-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="modal_right_children">
            <div className="top_section">
              <ModalRightTitle
                closeModal={() => {
                  closeModal();
                }}
                title="Edit Location"
              />

              <div className="brief_form ">
                <ValidatedInput
                  name="name"
                  label="Store Name"
                  placeholder="Enter Name"
                  required={false}
                />
                <ValidatedInput
                  name="address"
                  label="Address"
                  placeholder="Enter Address"
                  required={false}
                />
                <AutoCompleteField
                  isLoading={loadCountries}
                  name="country_id"
                  label="Country"
                  required={false}
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
                <SelectField
                  name="state_id"
                  label="State"
                  isLoading={loadStates}
                  required={false}
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
                  required={false}
                  selectOption={
                    city && city.length
                      ? city.map((item) => {
                          return { key: item.name, value: item.id };
                        })
                      : []
                  }
                />
              </div>
            </div>

            <div className="productOptionSubmit bottom_section">
              <Button
                type="button"
                className="cancel"
                onClick={() => {
                  reset();
                  closeModal();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="save">
                {isLoading ? (
                  <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </ModalRight>
  );
};
