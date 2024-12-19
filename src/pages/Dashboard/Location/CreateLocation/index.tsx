import { Button, Checkbox, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import "./style.scss";
import AutoCompleteField from "components/forms/AutoComplete";
import ValidatedInput from "components/forms/ValidatedInput";
import { GrowthModal } from "components/GrowthModal";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import {
  useCreateLocationMutation,
  useGetCityByStateIDQuery,
  useGetCountriesQuery,
  useGetLocationsQuery,
  useGetStatesByCountryIDQuery,
} from "services";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import ExtraLocationModal from "./ExtraLocationModal";
import ExtraSuccessModal from "./ExtraSuccessModal";

export type CreateLocationFields = {
  name: string;
  address: string;
  country_id: string;
  state_id: string;
  city_id: string;
  is_default?: number;
};

const CreateLocation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);

  const [isPrimary, setIsPrimary] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<any>("");
  const [selectedState, setSelectedState] = useState<any>("");
  const [openGrowthModal, setOpenGrowthModal] = useState(false);
  const [isMoreLocationUpgrade, setIsMoreLocationUpgrade] = useState(false);
  const [openExtraLocationModal, setOpenExtraLocationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [createLocation, { isLoading }] = useCreateLocationMutation();
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
  const { data: locations } = useGetLocationsQuery();

  const methods = useForm<CreateLocationFields>({
    mode: "all",
  });
  const { handleSubmit, reset } = methods;

  const freeSlots = locations?.slots?.available_location_slots;

  const onSubmit: SubmitHandler<CreateLocationFields> = async (data) => {
    if (isSubscriptionType === "growth" && freeSlots === 0) {
      setIsMoreLocationUpgrade(true);
      setOpenGrowthModal(true);
    } else if (
      isSubscriptionExpired ||
      (isSubscriptionType !== "growth" && isSubscriptionType !== "trial")
    ) {
      setOpenGrowthModal(true);
    } else {
      const payload = {
        ...data,
        is_default: isPrimary ? 1 : 0,
      };
      try {
        let result = await createLocation(payload);
        if ("data" in result) {
          showToast("Created successfuly", "success");
          navigate("/dashboard/store/location");
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  const growthFeaturesList = isMoreLocationUpgrade
    ? [
        "Manage inventory & sales across more store locations on one Bumpa account.",
        "Manage a 2 in 1 website for different locations.",
        "Manage staff activities in different locations with the same dashboard.",
      ]
    : [
        "Manage inventory & sales across more store locations on one Bumpa account.",
        "Manage a 2 in 1 website for different locations.",
        "Get point-of-sale software for faster checkout in your physical store.",
        "Manage staff activities in different locations with the same dashboard.",
      ];

  const decodedURL = location.search.replace(/&amp;/g, "&");
  const queryParams = new URLSearchParams(decodedURL);
  const successPayment = queryParams.get("success");
  const slotsPurchased = queryParams.get("slot");

  useEffect(() => {
    if (successPayment) {
      setShowSuccessModal(true);
    }
    setTimeout(() => {
      queryParams.delete("success");
      queryParams.delete("slot");
    }, 2000);

    const newUrl = `${location.pathname}`;
    window.history.pushState({}, "", newUrl);
  }, [successPayment]);

  return (
    <div className="pd_create_location">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form_section">
            <ModalHeader text="Add Store Location" />
            <div className="form_field_container">
              <FormSectionHeader title="Address Details" />
              <div className="px-[16px] py-[24px]">
                <ValidatedInput
                  name="name"
                  label="Location Name"
                  placeholder="Enter Name"
                />
                <ValidatedInput
                  name="address"
                  label="Address"
                  placeholder="Enter Address"
                />
                <AutoCompleteField
                  isLoading={loadCountries}
                  name="country_id"
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
                  }}
                />
                <AutoCompleteField
                  isLoading={loadStates}
                  name="state_id"
                  label="State"
                  selectOption={
                    states && states.length
                      ? states.map((item) => {
                          return { label: item.name, value: item.id };
                        })
                      : []
                  }
                  handleCustomChange={(val) => {
                    setSelectedState(val.value);
                  }}
                />

                <AutoCompleteField
                  isLoading={loadCity}
                  name="city_id"
                  label="City"
                  required={false}
                  selectOption={
                    city && city.length
                      ? city.map((item) => {
                          return { label: item.name, value: item.id };
                        })
                      : []
                  }
                />
                <div className="checkbox_section">
                  <Checkbox
                    checked={isPrimary}
                    onChange={() => {
                      setIsPrimary(!isPrimary);
                    }}
                  />
                  <p>Make this address my primary address</p>
                </div>
              </div>
            </div>
          </div>

          <div className="submit_form_section">
            <div className="button_container2">
              <Button
                onClick={() => {
                  reset();
                  navigate(-1);
                }}
                className="discard"
              >
                Cancel
              </Button>
            </div>
            <div className="button_container">
              <Button
                variant="contained"
                type="button"
                onClick={() => {
                  reset();
                }}
                className="preview"
              >
                Clear Fields
              </Button>

              <Button variant="contained" className="add" type="submit">
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
      <GrowthModal
        openModal={openGrowthModal}
        closeModal={() => {
          setOpenGrowthModal(false);
        }}
        moreLocation={isMoreLocationUpgrade}
        title={
          isMoreLocationUpgrade
            ? "Add an extra location on Bumpa"
            : "Manage a new store location on Bumpa"
        }
        subtitle={`Manage multiple stores easily on Bumpa.`}
        growthFeatures={growthFeaturesList}
        buttonText={
          isMoreLocationUpgrade
            ? "Add More Store Locations"
            : "Upgrade to Growth"
        }
        setShowModal={setOpenExtraLocationModal}
        eventName="multilocation"
      />
      <ExtraLocationModal
        openModal={openExtraLocationModal}
        closeModal={() => setOpenExtraLocationModal(false)}
      />
      <ExtraSuccessModal
        openModal={showSuccessModal}
        closeModal={() => setShowSuccessModal(false)}
        // @ts-ignore
        numOfLocations={parseInt(slotsPurchased)}
      />
    </div>
  );
};

export default CreateLocation;
