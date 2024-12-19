import { useEffect, useState } from "react";
import Button from "@mui/material/Button";

import { InfoIcon } from "assets/Icons/InfoIcon";

import { UpgradeModal } from "components/UpgradeModal";
import Loader from "components/Loader";
import ErrorMsg from "components/ErrorMsg";
import MessageModal from "components/Modal/MessageModal";
import PageUpdateModal from "components/PageUpdateModal";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import { SettingItem } from "../../index";

import {
  useGetInventorySettingQuery,
  useGetLoggedInUserQuery,
  useSetAppFlagMutation,
  useUpdateInventorySettingMutation,
} from "services";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError, timeToSeconds } from "utils";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";

import { PAGEUPDATEVERSIONS } from "utils/constants/general";

import "./style.scss";

type UpdateFncType = {
  id: number;
  type: string;
  value: any;
};

const InventorySetting = ({
  setOpenSuccessModal,
}: {
  setOpenSuccessModal: (val: boolean) => void;
}) => {
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const { data: userData } = useGetLoggedInUserQuery();

  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [notifyReservedInventory, setNotifyReservedInventory] = useState(false);
  const [openNotifyModal, setOpenNotifyModal] = useState(false);
  const [settingsToUpdate, setSettingsToUpdate] = useState<
    {
      id: number;
      value: any;
      type: string;
    }[]
  >([]);

  const [updateInventory, { isLoading }] = useUpdateInventorySettingMutation();
  const [setAppFlag, { isLoading: loadFlag }] = useSetAppFlagMutation();

  const {
    data,
    isLoading: loadInventory,
    isFetching,
    isError,
  } = useGetInventorySettingQuery();
  const updateFnc = ({ id, type, value }: UpdateFncType) => {
    let prevState = settingsToUpdate;
    const index = prevState.findIndex((existingItem) => existingItem.id === id);

    if (index !== -1) {
      prevState[index] = { id, value, type };
    } else {
      prevState.push({ id, value, type });
    }

    setSettingsToUpdate(prevState);
  };

  const onSubmit = async () => {
    if (
      isSubscriptionExpired ||
      isSubscriptionType === "free" ||
      isSubscriptionType === "starter"
    ) {
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
    } else {
      let payload = settingsToUpdate?.map((item) => {
        return {
          id: item.id,
          value:
            item?.type === "duration" ? timeToSeconds(item.value) : item.value,
        };
      });

      let duration = payload.filter((item) => item.id === 2)[0];

      if (duration && duration?.value < 600) {
        showToast("Duration should not be less than 10 minutes", "error", 6000);
      } else {
        try {
          let result = await updateInventory({ inventory_settings: payload });
          if ("data" in result) {
            showToast("Settings Updated successfully", "success");
            setSettingsToUpdate([]);
            setOpenSuccessModal(true);
          } else {
            handleError(result);
          }
        } catch (error) {
          handleError(error);
        }
      }
    }
  };

  const updateAppFlag = async () => {
    let payload = {
      ...userData?.app_flags,
      webapp_updates: {
        ...userData?.app_flags?.webapp_updates,
        inventory_settings_page: {
          version: PAGEUPDATEVERSIONS.INVENTORYSETTING,
          status: true,
        },
      },
    };
    try {
      let result = await setAppFlag(payload);
      if ("data" in result) {
        setOpenUpdateModal(false);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
    setOpenUpdateModal(false);
  };

  useEffect(() => {
    if (userData) {
      if (
        userData?.app_flags?.webapp_updates?.inventory_settings_page
          ?.version === PAGEUPDATEVERSIONS.INVENTORYSETTING
      ) {
        if (
          userData?.app_flags?.webapp_updates?.inventory_settings_page?.status
        ) {
          setOpenUpdateModal(false);
        } else {
          setOpenUpdateModal(true);
        }
      } else {
        setOpenUpdateModal(true);
      }
    }
  }, [userData]);

  if (isError) {
    return <ErrorMsg />;
  }

  return (
    <div className="pd-inventory-setting">
      {(loadInventory || isFetching || isLoading) && <Loader />}
      {data && data?.inventory_settings && (
        <div className="form-cover">
          <div className="form-section">
            <div className="form-field-container">
              {Object.entries(data?.inventory_settings).map(
                ([sectionKey, sectionArray]) => (
                  <div key={sectionKey}>
                    <FormSectionHeader title={sectionKey} />
                    {sectionArray.map((section) => {
                      return (
                        <SettingItem
                          updateFnc={updateFnc}
                          section={section}
                          key={section?.id}
                          setNotifyReservedInventory={
                            setNotifyReservedInventory
                          }
                        />
                      );
                    })}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="button-container">
            <Button
              variant="contained"
              className="primary_styled_button"
              onClick={() => {
                if (notifyReservedInventory) {
                  setOpenNotifyModal(true);
                } else {
                  onSubmit();
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      )}

      {openUpgradeModal && (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => setOpenUpgradeModal(false)}
          pro={isProUpgrade}
          title={`Optimize Your Inventory Settings`}
          subtitle={`Reserve Stock and Cancel Unpaid Orders Automatically.`}
          proFeatures={[
            "Set reserved inventory to hold items until payment is made or reserved time is up.",
            "Set time to automate cancellation of orders with Time to to cancel.",
            "Track reserved quantity easily on the product page.",
          ]}
          growthFeatures={[
            "Set reserved inventory to hold items until payment is made or reserved time is up.",
            "Set time to automate cancellation of orders with Time to to cancel.",
            "Track reserved quantity easily on the product page.",
          ]}
        />
      )}

      <MessageModal
        openModal={openNotifyModal}
        closeModal={() => {
          setOpenNotifyModal(false);
        }}
        icon={<InfoIcon stroke="#5C636D" />}
        remove_icon_bg
        btnChild={
          <Button
            onClick={() => {
              onSubmit();
              setOpenNotifyModal(false);
            }}
            className="primary_styled_button"
            variant="contained"
          >
            Save
          </Button>
        }
        description="Turning on Reserved Inventory means items in customers’ carts are temporarily held for the time you have set. It will not reduce your available stock  quantity which is your actual stock quantity, you will however see the items. This setting works best with online payments - Paystack, where payment is confirmed automatically. We recommend a reservation time of 30 minutes to ensure smooth sales and stock management."
      />
    </div>
  );
};

export default InventorySetting;
