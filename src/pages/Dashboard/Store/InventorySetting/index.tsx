import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import Button from "@mui/material/Button";
import { LoadingButton } from "@mui/lab";
import { UpgradeModal } from "components/UpgradeModal";
import { Toggle } from "components/Toggle";
import InputField from "components/forms/InputField";
import Loader from "components/Loader";
import ErrorMsg from "components/ErrorMsg";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import {
  useGetInventorySettingQuery,
  useGetLoggedInUserQuery,
  useSetAppFlagMutation,
  useUpdateInventorySettingMutation,
} from "services";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError, secondsToTime, timeToSeconds } from "utils";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";

import {
  InventorySettingsChild,
  InventorySettingsSection,
} from "services/api.types";
import "./style.scss";
import PageUpdateModal from "components/PageUpdateModal";
import { PAGEUPDATEVERSIONS } from "utils/constants/general";
import MessageModal from "components/Modal/MessageModal";
import { InfoIcon } from "assets/Icons/InfoIcon";

type UpdateFncType = {
  id: number;
  type: string;
  value: any;
};
const SingleSettingChild = ({
  settingChild,
  updateFnc,
}: {
  settingChild: InventorySettingsChild;
  updateFnc: ({ id, type, value }: UpdateFncType) => void;
}) => {
  const [toggleSetting, setToggleSetting] = useState(false);
  const [duration, setDuration] = useState({
    days: "",
    hours: "",
    minutes: "",
  });

  const handleChangeToggle = (val: boolean) => {
    setToggleSetting(val);
    updateFnc({ id: settingChild?.id, type: settingChild?.type, value: val });
  };

  useEffect(() => {
    updateFnc({
      id: settingChild?.id,
      type: settingChild?.type,
      value: {
        days: Number(duration?.days || 0),
        hours: Number(duration?.hours || 0),
        minutes: Number(duration?.minutes || 0),
      },
    });
  }, [duration]);

  useEffect(() => {
    if (settingChild?.type === "duration") {
      let timeObj = secondsToTime(
        Number(
          settingChild?.value && settingChild?.value !== "0"
            ? settingChild?.value
            : settingChild?.default_value
        )
      );
      setDuration(timeObj);
    } else if (settingChild?.type === "boolean") {
      setToggleSetting(
        settingChild?.value
          ? settingChild?.value === "0"
            ? false
            : true
          : settingChild?.default_value === "0"
          ? false
          : true
      );
    }
  }, [settingChild]);

  switch (settingChild?.type) {
    case "duration":
      return (
        <>
          <div className="title_description_section">
            <div className="text_section">
              <p className="title">{settingChild?.name}</p>
              <p className="description">{settingChild?.description}</p>
            </div>
          </div>
          <div className="form-group-autoflex">
            <InputField
              onChange={(e) => {
                setDuration((prev) => {
                  return {
                    ...prev,
                    days: e.target.value,
                  };
                });
              }}
              value={duration?.days}
              label="Day"
              type="number"
            />
            <InputField
              onChange={(e) => {
                setDuration((prev) => {
                  return {
                    ...prev,
                    hours: e.target.value,
                  };
                });
              }}
              value={duration?.hours}
              label="Hours"
              type="number"
            />
            <InputField
              value={duration?.minutes}
              label="Minutes"
              type="number"
              min={10}
              errMsg={
                Number(duration?.hours || 0) || Number(duration?.days || 0)
                  ? ""
                  : Number(duration?.minutes || 0) < 10
                  ? "Minutes can't  be less than 10"
                  : ""
              }
              onChange={(e) => {
                setDuration((prev) => {
                  return {
                    ...prev,
                    minutes: e.target.value,
                  };
                });
              }}
            />
          </div>
        </>
      );
    case "boolean":
      return (
        <>
          <div className="title_description_section">
            <div className="text_section">
              <p className="title">{settingChild?.name}</p>
              <p className="description">{settingChild?.description}</p>
            </div>
            <Toggle
              toggled={toggleSetting}
              handlelick={() => {
                handleChangeToggle(!toggleSetting);
              }}
            />
          </div>
        </>
      );
    default:
      break;
  }
};

const SingleSettingSection = ({
  section,
  updateFnc,
  setNotifyReservedInventory,
}: {
  section: InventorySettingsSection;
  updateFnc: ({ id, type, value }: UpdateFncType) => void;
  setNotifyReservedInventory: (val: boolean) => void;
}) => {
  const [toggleSetting, setToggleSetting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const handleChangeAccordion = () => {
    setExpanded(!expanded);
  };

  const handleChangeAccordionToggle = (val: boolean, id: number) => {
    setToggleSetting(val);
    updateFnc({ id, type: section?.type, value: val });
    if (section?.children && section?.children?.length) {
      setExpanded(val);
    }

    if (val && section.code === "reserve_inventory") {
      setNotifyReservedInventory(true);
    } else {
      setNotifyReservedInventory(false);
    }
  };

  useEffect(() => {
    if (section?.children && section?.children?.length) {
      setExpanded(
        section?.value
          ? section?.value === "0"
            ? false
            : true
          : section?.default_value === "0"
          ? false
          : true
      );
      setToggleSetting(
        section?.value
          ? section?.value === "0"
            ? false
            : true
          : section?.default_value === "0"
          ? false
          : true
      );
    } else {
      if (section?.type == "boolean") {
        setToggleSetting(
          section?.value
            ? section?.value === "0"
              ? false
              : true
            : section?.default_value === "0"
            ? false
            : true
        );
      } else {
      }
    }
  }, [section]);
  return (
    <>
      {section?.children && section?.children?.length ? (
        <div className="section">
          <Accordion
            expanded={expanded}
            className="section_accordion"
            onChange={(e) => {
              handleChangeAccordion();
            }}
          >
            <AccordionSummary
              expandIcon={
                <Toggle
                  toggled={toggleSetting}
                  handlelick={() => {
                    handleChangeAccordionToggle(!toggleSetting, section?.id);
                  }}
                />
              }
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <div className="title_description_section">
                <div className="text_section">
                  <p className="title">{section.name}</p>
                  <p className="description">{section.description}</p>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              {section?.children?.map((child) => (
                <SingleSettingChild
                  updateFnc={updateFnc}
                  key={child?.id}
                  settingChild={child}
                />
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
      ) : section.type === "boolean" ? (
        <div className="payment_confirm_section section">
          <div className="title_description_section">
            <div className="text_section">
              <p className="title">{section.name}</p>
              <p className="description">{section.description}</p>
            </div>
            <Toggle
              toggled={toggleSetting}
              handlelick={(val: boolean) => {
                handleChangeAccordionToggle(!toggleSetting, section?.id);
              }}
            />
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

const InventorySetting = () => {
  const navigate = useNavigate();
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const [updateInventory, { isLoading }] = useUpdateInventorySettingMutation();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [setAppFlag, { isLoading: loadFlag }] = useSetAppFlagMutation();
  const { data: userData } = useGetLoggedInUserQuery();
  const [notifyReservedInventory, setNotifyReservedInventory] = useState(false);
  const [openNotifyModal, setOpenNotifyModal] = useState(false);
  const [settingsToUpdate, setSettingsToUpdate] = useState<
    {
      id: number;
      value: any;
      type: string;
    }[]
  >([]);
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
    <div className="pd_inventory_setting">
      {(loadInventory || isFetching || isLoading) && <Loader />}
      {data && data?.inventory_settings && (
        <div className="form_cover">
          <div className="form_section">
            <ModalHeader text="Inventory Settings" />

            <div className="form_field_container">
              <div className="order_details_container">
                {Object.entries(data?.inventory_settings).map(
                  ([sectionKey, sectionArray]) => (
                    <div key={sectionKey}>
                      <FormSectionHeader title={sectionKey} />
                      {sectionArray.map((section) => {
                        return (
                          <SingleSettingSection
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
          </div>
          <div className="submit_form_section">
            <div className="button_container2">
              <Button
                onClick={() => {
                  navigate(-1);
                }}
                className="discard"
              >
                Cancel
              </Button>
            </div>{" "}
            <div className="button_container">
              <LoadingButton
                loading={false}
                variant="contained"
                className="add"
                type="submit"
                onClick={() => {
                  if (notifyReservedInventory) {
                    setOpenNotifyModal(true);
                  } else {
                    onSubmit();
                  }
                }}
                disabled={false}
              >
                Save
              </LoadingButton>
            </div>
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
          eventName="inventory-settings"
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
