import { LoadingButton } from "@mui/lab";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import MultipleSelectField from "components/forms/MultipleSelectField";
import ValidatedInput, {
  removeFormattedNumerComma,
} from "components/forms/ValidatedInput";
import ValidatedTextArea from "components/forms/ValidatedTextArea";
import Loader from "components/Loader";
import { IStoreInformation } from "Models/store";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import { useCreateShippingMutation, useGetLocationsQuery } from "services";
import { useSetupStoreShippingMethodMutation } from "services/auth.api";
import {
  selectCurrentUser,
  selectUserAssignedLocation,
  selectUserLocation,
  setStoreDetails,
} from "store/slice/AuthSlice";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { getCurrencyFnc, handleError } from "utils";
import { getObjWithValidValues } from "utils/constants/general";

export type CreateShippingFeilds = {
  name: string;
  price: number;
  description: string;
  visible: boolean;
  location_ids?: string[];
  free?: boolean;
  status?: boolean;
  conditions?: { minimum_cart: number };
};

type CreateShippingProps = {
  fromCompleteStore?: boolean;
  closeShippingMethodModal?: () => void;
};

type setupStoreShippingMethodResult = {
  data?: {
    store?: IStoreInformation;
  };
};

const isSetupStoreShippingMethodResult = (
  result: any
): result is setupStoreShippingMethodResult => {
  return result && typeof result === "object" && "data" in result;
};

const CreateShipping = ({
  fromCompleteStore = false,
  closeShippingMethodModal,
}: CreateShippingProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userLocation = useAppSelector(selectUserLocation);
  const [isCheck, setIsCheck] = useState(true);
  const methods = useForm<CreateShippingFeilds>({
    mode: "all",
  });
  const {
    data: locationData,
    isLoading: loadLocation,
    isFetching: isFetchingLocatio,
    isError: isErrorLocation,
  } = useGetLocationsQuery();
  const assignedLocations = useAppSelector(selectUserAssignedLocation);
  const user = useAppSelector(selectCurrentUser);

  const [createShipping, { isLoading }] = useCreateShippingMutation();
  const [setupStoreShippingMethod, { isLoading: shippingMethodLoading }] =
    useSetupStoreShippingMethodMutation();

  const onSubmit: SubmitHandler<CreateShippingFeilds> = async (data) => {
    let payload = getObjWithValidValues({
      ...data,
      price: removeFormattedNumerComma(data.price || 0) as number,
      visible: isCheck,
      location_ids:
        data?.location_ids && data?.location_ids?.length
          ? data?.location_ids
          : [],
    });

    try {
      let result;
      if (fromCompleteStore) {
        result = await setupStoreShippingMethod(payload);
      } else {
        result = await createShipping(payload);
      }

      if (isSetupStoreShippingMethodResult(result) && result.data) {
        showToast("Created successfully", "success");
        if (fromCompleteStore && result.data.store) {
          dispatch(setStoreDetails(result.data.store));
          if (typeof _cio !== "undefined") {
            _cio.track("web_shipping_onboarding");
          }
          if (typeof mixpanel !== "undefined") {
            mixpanel.track("web_shipping_onboarding");
          }
          closeShippingMethodModal?.();
        } else {
          navigate(-1);
        }

        if (typeof _cio !== "undefined") {
          _cio.track("web_shipping", data);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const {
    formState: { isValid },
    handleSubmit,
    setValue,
    reset,
  } = methods;

  useEffect(() => {
    setValue("location_ids", [`${userLocation?.id}`]);
  }, []);

  return (
    <div className="pd_create_shipping">
      {isLoading || (shippingMethodLoading && <Loader />)}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form_section">
            <ModalHeader
              text="Create Shipping Method"
              closeModal={() => {
                if (fromCompleteStore) {
                  closeShippingMethodModal?.();
                } else {
                  navigate(-1);
                }
              }}
            />
            <div className="form_field_container">
              <div className="order_details_container">
                <FormSectionHeader title="Shipping Details" />
                <div className="px-[16px]">
                  <div className="">
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
                      placeholder="0.00"
                      formatValue={true}
                      prefix={
                        <p className="text-[#9BA2AC] font-semibold text-[20px]">
                          {getCurrencyFnc()}
                        </p>
                      }
                      required={false}
                      containerClass="pd-shipping-input"
                    />
                    <div className="info-section">
                      <InfoCircleIcon />
                      <div>Leave blank to make shipping fee “FREE”</div>
                    </div>

                    <ValidatedTextArea
                      name="description"
                      label="Shipping Description"
                      extraClass="pd-shipping-input"
                      height="h-[120px]"
                      required={false}
                    />
                    {Number(user?.is_staff) === 0 ? (
                      <MultipleSelectField
                        name="location_ids"
                        isLoading={loadLocation}
                        extraClass="mt-2"
                        selectOption={
                          locationData
                            ? locationData?.data?.length
                              ? locationData?.data?.map((item: any) => {
                                  return {
                                    key: item.name,
                                    value: `${item.id}`,
                                  };
                                })
                              : []
                            : []
                        }
                        required={false}
                        label="Select Locations"
                      />
                    ) : assignedLocations?.length > 1 ? (
                      <MultipleSelectField
                        name="location_ids"
                        extraClass="mt-2"
                        selectOption={
                          assignedLocations
                            ? assignedLocations?.length
                              ? assignedLocations?.map((item: any) => {
                                  return {
                                    key: item.name,
                                    value: `${item.id}`,
                                  };
                                })
                              : []
                            : []
                        }
                        required={false}
                        label="Select Product Locations"
                      />
                    ) : (
                      ""
                    )}

                    <div className="shipping-visibility">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isCheck}
                              onChange={() => {
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
            </div>
          </div>
          <div className="submit_form_section">
            <div className="button_container2">
              <Button
                onClick={() => {
                  reset();
                  if (fromCompleteStore) {
                    closeShippingMethodModal?.();
                  } else {
                    navigate(-1);
                  }
                }}
                className="discard"
              >
                Cancel
              </Button>
            </div>{" "}
            <div className="button_container">
              <Button
                onClick={() => {
                  reset();
                }}
                variant="contained"
                type="button"
                className="preview"
              >
                Clear Fields
              </Button>

              <LoadingButton
                loading={false}
                variant="contained"
                className="add"
                type="submit"
                disabled={!isValid}
              >
                Create Shipping Method
              </LoadingButton>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateShipping;
