import { useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";

import Loader from "components/Loader";
import { UpgradeModal } from "components/UpgradeModal";
import DeliverySettings from "./widget/Delivery";
import CheckOutNote from "./widget/CheckoutNote";
import ShippingIntegration from "./widget/ShippingIntegration";
import CustomerPickup from "./widget/CustomerPickup";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";

import {
  useGetShippingSettingQuery,
  useUpdateShippingSettingsMutation,
  useGetShipBubbleSettingsQuery,
  useUpdateShipbubbleSettingsMutation,
} from "services";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";

import {
  initialShippingSettingUpdate,
  updateShippingSettingState,
  selectSettingsUpdateField,
  selectShipbubbleSettingsUpdateField,
  initialShipbubbleShippingSettingUpdate,
  updateShipbubbleShippingSettingState,
} from "store/slice/ShippingSettingsSlice";
import AutomateShipping from "./widget/AutomateShipping";
import "./style.scss";
import InfoBox from "components/InfoBox";

export type UpdateGeneralShippingSettingsField = {
  use_delivery_timeline?: boolean;
  delivery_days?: {
    day: string;
    times: { startTime: string; endTime: string }[];
  }[];
  same_day_delivery?: boolean;
  processing_days?: string;
  reminder_days?: number | string;
  checkout_note?: string | null;
  automated_shipping?: boolean;
  shipping_mode?: string;
  default_weight_kg?: string | number;
};

export type UpdateShipbubbleShippingSettingsField = {
  couriers?: string[];
  shipping_categories?: string[];
  custom_box_size?: {
    height?: string;
    weight?: string;
    length?: string;
    width?: string;
  };
};

export const ContentHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="pd_content_header">
      <p className="content_title">{title}</p>
      <p className="content_description">{description} </p>
    </div>
  );
};

const ShippingSettings = ({
  setOpenSuccessModal,
}: {
  setOpenSuccessModal: (val: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const shippingSettingsUpdateFields = useAppSelector(
    selectSettingsUpdateField
  );
  const shipbubbleShippingSettingsUpdateFields = useAppSelector(
    selectShipbubbleSettingsUpdateField
  );

  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);

  const {
    data: settingsData,
    isLoading: isSettingsLoading,
    isFetching: isSettingsFetching,
    isError: isSettingsError,
  } = useGetShippingSettingQuery();

  const {
    data: shipbubbleSettingsData,
    isLoading: isShipbubbleSettingsLoading,
    isFetching: isShipbubbleSettingsFetching,
    isError: isShipbubbleSettingsError,
  } = useGetShipBubbleSettingsQuery();

  const [updateShippingSetting, { isLoading }] =
    useUpdateShippingSettingsMutation();
  const [
    updateShipbubbleShippingSetting,
    { isLoading: isShipbubbleSettingLoading },
  ] = useUpdateShipbubbleSettingsMutation();

  const onSubmitGeneralSetting = async () => {
    if (
      isSubscriptionExpired ||
      isSubscriptionType === "free" ||
      isSubscriptionType === "starter"
    ) {
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
      return;
    }

    let payload = {
      use_delivery_timeline:
        shippingSettingsUpdateFields?.use_delivery_timeline,
      same_day_delivery: shippingSettingsUpdateFields?.same_day_delivery,
      processing_days: shippingSettingsUpdateFields?.processing_days,
      reminder_days: shippingSettingsUpdateFields?.reminder_days,
      checkout_note: shippingSettingsUpdateFields?.checkout_note,
      automated_shipping: shippingSettingsUpdateFields?.automated_shipping,
      shipping_mode: shippingSettingsUpdateFields?.shipping_mode,
      default_weight_kg: shippingSettingsUpdateFields?.default_weight_kg,
      delivery_days: shippingSettingsUpdateFields?.delivery_days?.map(
        (item) => {
          return {
            day: item.day,
            times: item.times
              .filter((item) => item.startTime && item.endTime)
              .map((time) => {
                return { startTime: time.startTime, endTime: time.endTime };
              }),
          };
        }
      ),
    };

    try {
      let result = await updateShippingSetting(payload);

      if ("data" in result) {
        showToast("Saved successfully", "success");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const onSubmitIntegrationSetting = async () => {
    if (
      isSubscriptionExpired ||
      isSubscriptionType === "free" ||
      isSubscriptionType === "starter"
    ) {
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
      return;
    }

    let payload = {
      couriers: shipbubbleShippingSettingsUpdateFields?.couriers,

      shipping_categories:
        shipbubbleShippingSettingsUpdateFields?.shipping_categories,
      custom_box_size: {
        height: shipbubbleShippingSettingsUpdateFields?.custom_box_size?.height,
        weight: shipbubbleShippingSettingsUpdateFields?.custom_box_size?.weight,
        length: shipbubbleShippingSettingsUpdateFields?.custom_box_size?.length,
        width: shipbubbleShippingSettingsUpdateFields?.custom_box_size?.width,
      },
    };

    try {
      let result = await updateShipbubbleShippingSetting(payload);

      if ("data" in result) {
        showToast("Saved successfully", "success");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (settingsData) {
      dispatch(initialShippingSettingUpdate(settingsData));
      dispatch(updateShippingSettingState(settingsData));
    }
  }, [settingsData]);

  useEffect(() => {
    if (shipbubbleSettingsData?.data) {
      dispatch(
        initialShipbubbleShippingSettingUpdate(shipbubbleSettingsData?.data)
      );
      let tempData = {
        ...shipbubbleSettingsData?.data,
        couriers: shipbubbleSettingsData?.data?.couriers
          ? shipbubbleSettingsData?.data?.couriers?.map(
              (item) => item.service_code
            )
          : [],
        shipping_categories: shipbubbleSettingsData?.data?.shipping_categories
          ?.length
          ? shipbubbleSettingsData?.data?.shipping_categories?.map(
              (item) => `${item.category_id}`
            )
          : [],
      };
      dispatch(updateShipbubbleShippingSettingState(tempData));
    }
  }, [shipbubbleSettingsData]);

  return (
    <div className="shipping-settings">
      {(isLoading || isSettingsLoading) && <Loader />}
      <div className="settings_form">
        <div className="form_section">
          <InfoBox
            color="yellow"
            text="You can set up delivery dates and time and also add a general note at checkout."
          />
          <div className="form_field_container">
            <div className="general-shipping-setting">
              <FormSectionHeader title="Geneeral Settings" />

              <DeliverySettings />

              <CheckOutNote />

              <CustomerPickup />

              <AutomateShipping />
            </div>
            <div className="button-container">
              <Button
                disabled={isLoading}
                variant="contained"
                className="primary_styled_button"
                onClick={onSubmitGeneralSetting}
              >
                {isLoading ? (
                  <CircularProgress size="1.5rem" sx={{ color: "#fffff" }} />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>

          <div className="form_field_container">
            <div className="general-shipping-setting">
              <ShippingIntegration />
            </div>

            <div className="button-container">
              <Button
                variant="contained"
                className="primary_styled_button"
                onClick={onSubmitIntegrationSetting}
              >
                {isShipbubbleSettingLoading ? (
                  <CircularProgress size="1.5rem" sx={{ color: "#fffff" }} />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

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
        />
      )}
    </div>
  );
};

export default ShippingSettings;
