import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Tab,
  Tabs,
} from "@mui/material";

import { CheckCircleLargeIcon } from "assets/Icons/CheckCircleLarge";

import InputField from "components/forms/InputField";
import { Toggle } from "components/Toggle";
import MessageModal from "components/Modal/MessageModal";
import ProductSetting from "./components/ProductSettings";
import InventorySetting from "./components/InventorySettings";

import {
  InventorySettingsChild,
  InventorySettingsSection,
} from "services/api.types";
import { secondsToTime } from "utils";

import "./style.scss";
import { UploadIcon } from "assets/Icons/UploadIcon";
import { useSingleUploadHook } from "hooks/useSingleUploadHook";
import NormalFileInput from "components/forms/NormalFileInput";
import { SETTINGSROUTES } from "utils/constants/apiroutes";
import { XIcon } from "assets/Icons/XIcon";
import { RefrshIcon } from "assets/Icons/RefreshIcon";
import ShippingSettings from "./components/ShippingSettings/settings";

const TABSCONTANTS = {
  INVENTORY: "Inventory",
  PRODUCTS: "Products",
  SHIPPING: "Shipping",
  NOTIFICATION: "Notification",
};

const tabList = [
  { label: TABSCONTANTS.INVENTORY, value: TABSCONTANTS.INVENTORY },
  { label: TABSCONTANTS.PRODUCTS, value: TABSCONTANTS.PRODUCTS },
  { label: TABSCONTANTS.SHIPPING, value: TABSCONTANTS.SHIPPING },
  { label: TABSCONTANTS.NOTIFICATION, value: TABSCONTANTS.NOTIFICATION },
];

type TabType = "inventory" | "products" | "shipping" | "notification";

export type UpdateFncType = {
  id: number;
  type: string;
  value: any;
};

export const SettingChildItem = ({
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

export const SettingItem = ({
  section,
  updateFnc,
  setNotifyReservedInventory,
}: {
  section: InventorySettingsSection;
  updateFnc: ({ id, type, value }: UpdateFncType) => void;
  setNotifyReservedInventory: (val: boolean) => void;
}) => {
  const [toggleSetting, setToggleSetting] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [imageValue, setImageValue] = useState("");
  const [expanded, setExpanded] = useState(false);

  const { uploadImage, uploadLoading, uploadedImage } = useSingleUploadHook();

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

  const localChangeHandler = async (file: Blob) => {
    uploadImage("profile-avatar", file);
  };

  const resetDefaultUpload = () => {
    setImageValue("");
  };

  const onUpload = (value: string) => {
    setImageValue(value);
    updateFnc({
      id: section?.id,
      type: section?.type,
      value: value,
    });
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
      } else if (section?.type == "integer") {
        setInputValue(section?.value ? section?.value : section?.default_value);
      } else if (section?.type == "image") {
        // setImageValue(section?.value ? section?.value : section?.default_value);
        setImageValue("");
      }
    }
  }, [section]);

  useEffect(() => {
    if (uploadedImage) {
      setImageValue(uploadedImage);
      updateFnc({
        id: section?.id,
        type: section?.type,
        value: uploadedImage,
      });
    }
  }, [uploadedImage]);

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
                <SettingChildItem
                  updateFnc={updateFnc}
                  key={child?.id}
                  settingChild={child}
                />
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
      ) : section.type === "boolean" ? (
        <div className="section">
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
      ) : section.type === "integer" ? (
        <div className="section">
          <div className="title_description_section">
            <div className="text_section">
              <p className="title">{section?.name}</p>
              <p className="description">{section?.description}</p>
            </div>
          </div>
          <div className="form-group-autoflex">
            <InputField
              onChange={(e) => {
                updateFnc({
                  id: section?.id,
                  type: section?.type,
                  value: e.target.value,
                });
                setInputValue(e.target.value);
              }}
              value={inputValue}
              type="number"
            />
          </div>
        </div>
      ) : section.type === "image" ? (
        <div className="section">
          <div className="title_description_section">
            <div className="text_section">
              <p className="title">{section?.name}</p>
              <p className="description">{section?.description}</p>
            </div>
          </div>

          <div className="image-upload-container">
            {imageValue ? (
              <div className="uploaded-image-container">
                <img src={imageValue} alt="size" />
                <div className="reset-reupload-buttons">
                  <label htmlFor="uploaded-image">
                    {uploadLoading ? (
                      <CircularProgress
                        size="1.5rem"
                        sx={{ color: "#000000" }}
                      />
                    ) : (
                      <>
                        <RefrshIcon stroke="#222D37" />
                        <span>Change</span>
                      </>
                    )}
                    <input
                      onChange={(e) => {
                        let file = e.target.files && e.target?.files[0];
                        if (file) {
                          localChangeHandler(file);
                        }
                      }}
                      name="uploaded-image"
                      id="uploaded-image"
                      hidden
                      type="file"
                    />
                  </label>
                  <Button
                    onClick={() => resetDefaultUpload()}
                    startIcon={<XIcon stroke="#D90429" />}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <NormalFileInput
                uploadPath={`${SETTINGSROUTES.UPLAOD_PROFILE_AVATAR}`}
                name="image"
                type="img"
                resetDefaultUpload={resetDefaultUpload}
                onFileUpload={onUpload}
                addCrop={false}
                extraType="profile"
              />
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

const GeneralSettings = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlTab = searchParams.get("tab");

  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [tab, setTab] = useState<TabType>(TABSCONTANTS.INVENTORY as TabType);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: TabType) => {
    setTab(newValue);
    const newUrl = `${window.location.origin}${window.location.pathname}?tab=${newValue}`;
    window.history.replaceState(null, "", newUrl);
  };

  useEffect(() => {
    if (urlTab) {
      setTab(urlTab as TabType);
    } else {
      setTab(TABSCONTANTS.INVENTORY as TabType);
    }
  }, [urlTab]);
  return (
    <>
      <div className="general-settings-container">
        <div className="page-title">
          <h3>Settings</h3>
          <p className="page-description">
            Tailor the web app settings to create a personalized experience that
            matches your business needs.
          </p>
        </div>

        <div className="page-content">
          <div className="tab-container">
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tab}
                onChange={handleChangeTab}
                variant="scrollable"
                scrollButtons={false}
              >
                {tabList.map((item, i) => (
                  <Tab key={i} value={item.value} label={item.label} />
                ))}
              </Tabs>
            </Box>
          </div>

          <div className="display-pages">
            {tab === TABSCONTANTS.INVENTORY && (
              <InventorySetting setOpenSuccessModal={setOpenSuccessModal} />
            )}

            {tab === TABSCONTANTS.PRODUCTS && (
              <ProductSetting setOpenSuccessModal={setOpenSuccessModal} />
            )}

            {tab === TABSCONTANTS.SHIPPING && (
              <ShippingSettings setOpenSuccessModal={setOpenSuccessModal} />
            )}
          </div>
        </div>
      </div>

      <MessageModal
        openModal={openSuccessModal}
        closeModal={() => {
          setOpenSuccessModal(false);
        }}
        icon={<CheckCircleLargeIcon stroke="#222D37" />}
        title="Settings Saved Successfully"
        description="You’ve successfully updated your inventory settings."
      />
    </>
  );
};

export default GeneralSettings;
