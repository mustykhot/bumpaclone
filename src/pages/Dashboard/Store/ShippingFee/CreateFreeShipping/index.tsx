import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import Button from "@mui/material/Button";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import "./style.scss";
import ValidatedInput, {
  removeFormattedNumerComma,
} from "components/forms/ValidatedInput";
import ValidatedTextArea from "components/forms/ValidatedTextArea";
import { LoadingButton } from "@mui/lab";
import { NairaIcon } from "../../../../../assets/Icons/NairaIcon";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCreateShippingMutation } from "services";
import { showToast, useAppSelector } from "store/store.hooks";
import { getCurrencyFnc, handleError } from "utils";
import Loader from "components/Loader";
import { selectIsSubscriptionExpired, selectIsSubscriptionType, selectUserLocation } from "store/slice/AuthSlice";
import { getObjWithValidValues } from "utils/constants/general";
import { CreateShippingFeilds } from "../CreateShipping";
import { UpgradeModal } from "components/UpgradeModal";

const CreateFreeShipping = () => {
  const navigate = useNavigate();
  const userLocation = useAppSelector(selectUserLocation);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const [isCheck, setIsCheck] = useState(true);
  const [activate, setActivate] = useState(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const methods = useForm<CreateShippingFeilds>({
    mode: "all",
  });

  const [createShipping, { isLoading }] = useCreateShippingMutation();

  const onSubmit: SubmitHandler<CreateShippingFeilds> = async (data) => {
    if (
      isSubscriptionExpired ||
      isSubscriptionType === "free" ||
      isSubscriptionType === "starter"
    ) {
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
    } else {
      let payload = {
        conditions: { minimum_cart: removeFormattedNumerComma(data.price || 0) },
        free: true,
        status: activate,
        location_id: userLocation?.id ? userLocation?.id : null,
        description: data.description,
        name: data.name,
      };
  
      try {
        let result = await createShipping(getObjWithValidValues(payload));
        if ("data" in result) {
          showToast("Created successfully", "success");
          navigate(-1);
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  const {
    formState: { isValid },
    handleSubmit,
    setValue,
    reset,
  } = methods;
  useEffect(() => {
    setValue("name", "Free Shipping");
  }, []);
  return (
    <div className="pd_create_shipping">
      {isLoading && <Loader />}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form_section">
            <ModalHeader text="Create Free Shipping" />

            <div className="form_field_container">
              <div className="order_details_container">
                <FormSectionHeader title="Enter Free Shipping Details" />
                <div className="px-[16px]">
                  <div className="">
                    <ValidatedInput
                      name="name"
                      label="Shipping Title"
                      disabled
                      type={"text"}
                      placeholder="Enter title"
                      containerClass="pd-shipping-input"
                    />

                    <ValidatedInput
                      type={"number"}
                      name="price"
                      label="Set Minimum Cart Amount"
                      placeholder="0.00"
                      formatValue={true}
                      prefix={
                        <p className="text-[#9BA2AC] font-semibold text-[20px]">
                          {getCurrencyFnc()}
                        </p>
                      }
                      containerClass="pd-shipping-input"
                    />
                    <div className="info-section">
                      <InfoCircleIcon />
                      <p>
                        Set the minimum amount customers need to spend to get
                        free shipping.
                      </p>
                    </div>

                    <ValidatedTextArea
                      name="description"
                      label="Shipping Description"
                      extraClass="pd-shipping-input"
                      height="h-[120px]"
                      required={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="submit_form_section">
            {/* <Button className="discard">Unsaved</Button> */}
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
            </div>{" "}
            <div className="button_container">
              <Button
                onClick={() => {
                  setActivate(false);
                }}
                variant="contained"
                type="submit"
                disabled={!isValid}
                className="preview"
              >
                Save
              </Button>

              <LoadingButton
                loading={false}
                variant="contained"
                className="add"
                type="submit"
                onClick={() => {
                  setActivate(true);
                }}
                disabled={!isValid}
              >
                Save and Activate
              </LoadingButton>
            </div>
          </div>
        </form>
      </FormProvider>
      {openUpgradeModal && (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => setOpenUpgradeModal(false)}
          pro={isProUpgrade}
          title={`Automate Free Shipping For Big Purchases`}
          subtitle={`Give customers  free shipping automatically when they buy above a price you choose.`}
          proFeatures={[
            "Add Free Shipping by Cart Value",
            "Connect to shipping companies",
            "1 location website",
            "Set store currency only in Naira",
          ]}
          growthFeatures={[
            "Add Free Shipping by Cart Value",
            "Connect to shipping companies",
            "2-in 1 multiple location website",
            "Set store currency in Naira or Dollar",
          ]}
          eventName="free-shipping"
        />
      )}
    </div>
  );
};

export default CreateFreeShipping;
