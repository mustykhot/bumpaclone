import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import "./style.scss";
import { GrowthModal } from "components/GrowthModal";
import NormalFileInput from "components/forms/NormalFileInput";
import SelectField from "components/forms/SelectField";
import ValidatedTextArea from "components/forms/ValidatedTextArea";
import ValidatedInput from "components/forms/ValidatedInput";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import {
  useGetCountriesQuery,
  useGetStatesQuery,
  useUpdateStoreInformationMutation,
} from "services";
import { SETTINGSROUTES } from "utils/constants/apiroutes";
import { formatPhoneNumber, handleError, validatePhoneNumber } from "utils";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  selectCurrentStore,
  selectCurrentUser,
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
  setStoreDetails,
} from "store/slice/AuthSlice";

export type StoreInformationFeilds = {
  description: string;
  phone: string;
  city: string;
  zip: string;
  subtitle: string;
  street: string;
  country: string;
  state: string;
  currency: string;
  name: string;
  business_name?: string;
  business_sector: string;
};

type EditInformationProps = {
  fromCompleteStore?: boolean;
  closeStoreInfoModal?: () => void;
};

const EditInformation = ({
  fromCompleteStore = false,
  closeStoreInfoModal,
}: EditInformationProps) => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [nonValidated, setNonValidated] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  const [selectedBusinessSector, setSelectedBusinessSector] = useState("");
  const [openGrowthModal, setOpenGrowthModal] = useState(false);
  const [cacVerificationComplete, setCacVerificationComplete] = useState(false);
  const userStore = useAppSelector(selectCurrentStore);
  const { data: countries, isLoading: loadCountries } = useGetCountriesQuery();
  const { data: states, isLoading: loadStates } = useGetStatesQuery(
    selectedCountry,
    { skip: selectedCountry ? false : true }
  );
  const [updateStoreInformation, { isLoading: updateLoading }] =
    useUpdateStoreInformationMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const user = useAppSelector(selectCurrentUser);

  const resetDefaultUpload = () => {
    setImageUrl("");
  };

  const methods = useForm<StoreInformationFeilds>({
    mode: "all",
    reValidateMode: "onChange",
  });

  const {
    formState: { isValid },
    handleSubmit,
    setValue,
  } = methods;

  const onSubmit: SubmitHandler<StoreInformationFeilds> = async (data) => {
    if (
      selectedCurrency === "USD" &&
      (isSubscriptionExpired ||
        (isSubscriptionType !== "growth" && isSubscriptionType !== "trial"))
    ) {
      setOpenGrowthModal(true);
      return;
    }

    const payload = {
      description: data.description,
      currency: selectedCurrency,
      phone: formatPhoneNumber(data?.phone),
      subtitle: data.subtitle,
      state: selectedState,
      city: data.city,
      zip: data.zip,
      street: data.street,
      country: selectedCountry,
      name: data.name,
      business_name: data.business_name,
      business_sector: data.business_sector,
    };

    try {
      let result = await updateStoreInformation(payload);
      if ("data" in result) {
        showToast("Store Information Updated Successfully", "success");
        dispatch(setStoreDetails(result.data.store));
        if (fromCompleteStore) {
          if (typeof _cio !== "undefined") {
            _cio.track("web_storeinfo_onboarding");
          }
          if (typeof mixpanel !== "undefined") {
            mixpanel.track("web_storeinfo_onboarding");
          }
          closeStoreInfoModal?.();
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (userStore) {
      setImageUrl(userStore?.logo_url as string);
      setValue("zip", userStore?.address?.zip as string, {
        shouldValidate: true,
      });
      setValue("street", userStore?.address?.street as string, {
        shouldValidate: true,
      });
      setValue("city", userStore?.address?.city as string, {
        shouldValidate: true,
      });
      setValue("country", userStore?.address?.country as string, {
        shouldValidate: true,
      });
      setValue("state", userStore?.address?.state as string, {
        shouldValidate: true,
      });
      setValue("currency", userStore?.currency as string, {
        shouldValidate: true,
      });
      setValue("subtitle", userStore?.subtitle as string, {
        shouldValidate: true,
      });
      setValue("phone", userStore?.phone as string, { shouldValidate: true });
      setValue("name", userStore?.name as string, {
        shouldValidate: true,
      });
      setValue("business_name", userStore?.business_name as string, {
        shouldValidate: true,
      });
      setValue("description", userStore?.description as string, {
        shouldValidate: true,
      });
      setValue("business_sector", userStore?.meta?.business_sector as string, {
        shouldValidate: true,
      });
      setNonValidated(false);
      if (userStore?.cac) {
        setCacVerificationComplete(true);
      }
    }
  }, [userStore]);

  const acceptedCurrencies = [
    {
      id: 23,
      name: "Nigerian Naira",
      code: "NGN",
      symbol: "\u20a6",
      precision: 2,
      thousand_separator: ",",
      decimal_separator: ".",
      swap_currency_symbol: 0,
    },
    {
      id: 1,
      name: "US Dollar",
      code: "USD",
      symbol: "$",
      precision: 2,
      thousand_separator: ",",
      decimal_separator: ".",
      swap_currency_symbol: 0,
    },
  ];

  const businessSectorList = [
    { value: "fashion", label: "Fashion" },
    { value: "electronics", label: "Electronics" },
    { value: "gadgets", label: "Gadgets" },
    { value: "home_decoration_garden", label: "Home /Decoration/ Garden" },
    { value: "beauty_personal_care", label: "Beauty & Personal Care" },
    { value: "health_wellness", label: "Health & Wellness" },
    { value: "sports_outdoors", label: "Sports & Outdoors" },
    { value: "automotive", label: "Automotive" },
    { value: "food_beverage", label: "Food & Beverage" },
    { value: "baby_kids", label: "Baby & Kids" },
    { value: "pet_supplies", label: "Pet Supplies" },
    { value: "office_supplies", label: "Office Supplies" },
    { value: "books", label: "Books" },
    { value: "industrial_scientific", label: "Industrial & Scientific" },
    { value: "toys_games", label: "Toys & Games" },
    { value: "fmcg_supermarket", label: "FMCG/Supermarket" },
    { value: "agro_products", label: "Agro Products" },
    { value: "hospitality", label: "Hospitality" },
  ];

  return (
    <>
      <div className="pd_create_store_information">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form_section">
              <ModalHeader
                text="Store Information"
                closeModal={() => {
                  if (fromCompleteStore) {
                    closeStoreInfoModal?.();
                  } else {
                    navigate(-1);
                  }
                }}
              />
              <div className="form_field_container">
                <div className="order_details_container">
                  <FormSectionHeader title="Store Logo" />
                  <div className="px-[16px]">
                    <NormalFileInput
                      uploadPath={`${SETTINGSROUTES.STORE_UPLOAD_LOGO}`}
                      name="logo"
                      labelText="Upload Store Logo"
                      type="img"
                      resetDefaultUpload={resetDefaultUpload}
                      defaultImg={imageUrl}
                      addCrop={false}
                    />
                  </div>
                </div>
                <div className="order_details_container">
                  <FormSectionHeader title="Store Information" />
                  <div className="px-[16px]">
                    <ValidatedInput
                      name="name"
                      placeholder="Enter store name"
                      label="Store Name"
                      type={"text"}
                    />

                    <ValidatedInput
                      name="business_name"
                      placeholder="Enter business name"
                      label="Business Name"
                      type={"text"}
                      required={false}
                      disabled={cacVerificationComplete}
                      showDisabledNote={cacVerificationComplete}
                      disabledNote="Business name cannot be changed after CAC verification."
                    />

                    <SelectField
                      name="business_sector"
                      defaultValue={selectedBusinessSector}
                      selectOption={businessSectorList.map((sector) => ({
                        key: sector.label,
                        value: sector.value,
                      }))}
                      label="Business Sector"
                      handleCustomChange={(val) => {
                        setSelectedBusinessSector(val);
                      }}
                      className="howTo"
                    />

                    <ValidatedInput
                      name="subtitle"
                      label="Store Tag Line"
                      type={"text"}
                      required={false}
                      placeholder="Your business slogan eg: Peak: It’s in You"
                    />

                    <ValidatedTextArea
                      name="description"
                      label="Store Description"
                      height="h-[120px]"
                      required={false}
                    />

                    <SelectField
                      name="currency"
                      defaultValue={selectedCurrency}
                      selectOption={acceptedCurrencies.map((currency) => ({
                        key: currency.name,
                        value: currency.code,
                      }))}
                      label="Store Currency"
                      handleCustomChange={(val) => {
                        setSelectedCurrency(val);
                      }}
                      className="howTo"
                    />

                    <ValidatedInput
                      name="phone"
                      label="Contact Phone"
                      type={"text"}
                      phoneWithOnlyNigerianDialCode
                      rules={{
                        validate: (value) => validatePhoneNumber(value, true),
                      }}
                    />
                    <ValidatedInput
                      name="street"
                      label="Address"
                      placeholder="Enter address"
                      type={"text"}
                      required={false}
                    />

                    <div className="form-group-flex">
                      <SelectField
                        name="country"
                        isLoading={loadCountries}
                        defaultValue={selectedCountry}
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
                        handleCustomChange={(val) => {
                          setSelectedCountry(val);
                        }}
                        label="Country"
                        className="howTo"
                        searchable
                      />
                      <SelectField
                        name="state"
                        isLoading={loadStates}
                        defaultValue={selectedState}
                        selectOption={
                          states && states.length
                            ? states.map((item: string) => {
                                return { key: item, value: item };
                              })
                            : []
                        }
                        handleCustomChange={(val) => {
                          setSelectedState(val);
                        }}
                        label="State"
                        className="howTo"
                        searchable
                      />
                    </div>

                    <div className="form-group-flex">
                      <ValidatedInput name="city" label="City" type={"text"} />

                      <ValidatedInput
                        name="zip"
                        label="Zip Code"
                        type={"text"}
                        required={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="submit_form_section storeInfo">
              <Button className="discard">Discard</Button>
              <div className="button_container">
                <Button
                  onClick={() => {
                    if (fromCompleteStore) {
                      closeStoreInfoModal?.();
                    } else {
                      navigate(-1);
                    }
                  }}
                  variant="contained"
                  type="button"
                  className="preview"
                >
                  Cancel
                </Button>

                <LoadingButton
                  loading={updateLoading}
                  variant="contained"
                  className="add"
                  type="submit"
                  disabled={!isValid || nonValidated}
                >
                  Save{" "}
                </LoadingButton>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
      <GrowthModal
        openModal={openGrowthModal}
        closeModal={() => {
          setOpenGrowthModal(false);
        }}
        title={`Set your store currency to dollars on the Growth Plan`}
        subtitle={`Set up a dollar store & receive payments in dollars on the Growth Plan.`}
        growthFeatures={[
          "Set up your website Product Prices in dollars.",
          "Give customers the option to shop in Dollars or Naira on your website.",
          "Change the prices of multiple products at once with Bulk Product Edit.",
          "Receive settlement in dollars.",
        ]}
        buttonText={`Upgrade to Growth`}
        eventName="multicurrency"
      />
    </>
  );
};

export default EditInformation;
