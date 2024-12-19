import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import { ArrowRightIcon } from "assets/Icons/ArrowRightIcon";
import { CheckIcon } from "assets/Icons/CheckIcon";
import Loader from "components/Loader";
import { UpgradeModal } from "components/UpgradeModal";
import FaviconTypeFileInput from "components/forms/FaviconTypeFileInput";
import NormalFileInput from "components/forms/NormalFileInput";
import { ILayout } from "Models/customisation";
import {
  useGetStoreInformationQuery,
  useGetStoreLayoutQuery,
  useGetStoreThemeColorQuery,
  useUpdateStoreLayoutMutation,
} from "services";
import {
  selectCurrentUser,
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
  setStoreDetails,
} from "store/slice/AuthSlice";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import { CUSTOMISATION_ROUTES } from "utils/constants/apiroutes";
import { SwitchComponent } from "../../../../../components/SwitchComponent";
import AboutSectionNotification from "./AboutSectionNotification";
import BannerTextNotification from "./BannerTextNotification";
import CustomMessageNotification from "./CustomMessageNotification";
import NewsLetterNotification from "./NewsLetterNotification.tsx";
import ProductListNotification from "./ProductListNotification";
import ReturnPolicyNotification from "./ReturnPolicyNotification";
import SocialmediaNotification from "./SocialmediaNotification";

interface SettingsInterface {
  header: string;
  msg: string;
  checked: boolean;
  name: string;
}

interface IColorList {
  color: string;
  selected: boolean;
}

const settingsList = [
  {
    header: "Newsletter and Pop-up notification",
    msg: "Edit and activate your newsletter feature",
    checked: false,
    name: "newsletter",
  },
  {
    header: "Custom message (Top-banner)",
    msg: "Edit and activate your custom message feature",
    checked: false,
    name: "custom_message",
  },
  {
    header: "Social media links (contact)",
    msg: "Edit and activate your social media links feature",
    checked: false,
    name: "social_links",
  },
  {
    header: "About us section",
    msg: "Add an about us section to your storefront",
    checked: false,
    name: "about_us",
  },
  {
    header: "Return Policy",
    msg: "Add a return policy to your storefront",
    checked: false,
    name: "return_policy",
  },
  {
    header: "Products Listing",
    msg: "Edit your product listing",
    checked: false,
    name: "product_listing",
  },
  {
    header: "Banner Text",
    msg: "Add your customised texts to the banner section",
    checked: false,
    name: "hero_banner",
  },
];

const CustomiseTheme = () => {
  const [selectedColour, setSelectedColour] = useState("rgb(0, 148, 68)");
  const [selectedImage, setSelectedImage] = useState<{ [key: string]: string }>(
    {}
  );
  const [imageUrl, setImageUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");

  const [listOfSettings, setListOfSittings] =
    useState<SettingsInterface[]>(settingsList);
  const [showNewsLetterNotification, setShowNewsLetterNotification] =
    useState(false);
  const [showBannerText, setShowBannerText] = useState(false);
  const [showCustomMessageNotification, setShowCustomMessageNotification] =
    useState(false);
  const [showAboutNotification, setShowAboutNotification] = useState(false);
  const [showPolicyNotification, setShowPolicyNotification] = useState(false);
  const [showMediaNotification, setShowMediaNotification] = useState(false);
  const [showProductListNotification, setShowProductListNotification] =
    useState(false);
  const [customiseData, setCustomiseData] = useState({});
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [isStarterUpgrade, setIsStarterUpgrade] = useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const [faviconContent, setFaviconContent] = useState(false);

  const { data, isLoading } = useGetStoreLayoutQuery();
  const [updateStoreLayout, { isLoading: updateLoading }] =
    useUpdateStoreLayoutMutation();
  const { isLoading: themeLoading, data: themeData } =
    useGetStoreThemeColorQuery();
  const {
    data: storeData,
    refetch,
    isLoading: isStoreLoading,
    isFetching,
  } = useGetStoreInformationQuery();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const user = useAppSelector(selectCurrentUser);

  //Function to turn off/on notification
  const handleSwitch = (i: number) => {
    const newList = [...listOfSettings];
    let dataValue = { ...customiseData } as ILayout;
    newList.forEach((item, index: number) => {
      if (index === i) {
        item.checked = !item.checked;
      }
    });

    if (!newList[i].checked) {
      if (newList[i].name === "product_listing") {
        dataValue.product_listing = "";
      } else if (newList[i].name === "return_policy") {
        dataValue.return_policy.status = false;
      } else if (newList[i].name === "custom_message") {
        dataValue.custom_message.status = false;
      } else if (newList[i].name === "newsletter") {
        dataValue.newsletter.status = false;
      } else if (newList[i].name === "social_links") {
        dataValue.social_links.status = false;
      } else if (newList[i].name === "about_us") {
        dataValue.about_us.status = false;
      } else if (newList[i].name === "hero_banner") {
        dataValue.hero_banner.status = false;
      }
    }

    if (newList[i].checked) {
      if (newList[i].name === "return_policy") {
        dataValue.return_policy.status = true;
      } else if (newList[i].name === "custom_message") {
        dataValue.custom_message.status = true;
      } else if (newList[i].name === "newsletter") {
        dataValue.newsletter.status = true;
      } else if (newList[i].name === "social_links") {
        dataValue.social_links.status = true;
      } else if (newList[i].name === "about_us") {
        dataValue.about_us.status = true;
      } else if (newList[i].name === "hero_banner") {
        dataValue.hero_banner.status = true;
      }
    }
    setCustomiseData(dataValue);
    setListOfSittings(newList);
  };

  //Function to toggle the edit modal for each notifications
  const handleNotifications = (value: string) => {
    switch (value) {
      case "Newsletter and Pop-up notification":
        return setShowNewsLetterNotification(true);
      case "Custom message (Top-banner)":
        return setShowCustomMessageNotification(true);
      case "About us section":
        return setShowAboutNotification(true);
      case "Return Policy":
        return setShowPolicyNotification(true);
      case "Social media links (contact)":
        return setShowMediaNotification(true);
      case "Products Listing":
        return setShowProductListNotification(true);
      case "Banner Text":
        return setShowBannerText(true);
    }
  };

  //update page data with response gotten when the getStoreLayout request is completed
  useEffect(() => {
    if (data && data?.layout) {
      let config = JSON.parse(JSON.stringify(data.layout));
      const newList = [...listOfSettings];
      newList[0].checked = data?.layout?.newsletter?.status;
      newList[1].checked = data?.layout?.custom_message?.status;
      newList[2].checked = data?.layout?.social_links?.status;
      newList[3].checked = data?.layout?.about_us?.status;
      newList[4].checked = data?.layout?.return_policy?.status;
      newList[6].checked = data?.layout?.hero_banner?.status;
      if (data.layout.product_listing) {
        newList[5].checked = true;
      }
      setListOfSittings(newList);
      setImageUrl(config?.hero_banner?.banner_image);
      setFaviconUrl(config?.favicon?.url);
      setCustomiseData(config);
      setSelectedColour(
        `rgb(${config.theme_color.red}, ${config.theme_color.green}, ${config.theme_color.blue})`
      );
    }
  }, [data]);

  //set the color pallete and corresponsing images when page loads and the getThemeColor request is completed
  const listOfColors = useMemo(() => {
    if (themeData) {
      const list = [...themeData.colors];
      const themeList: IColorList[] = [];
      let images = { ...selectedImage };

      list.map((item, i) => {
        let numbersOnly: string[] = [];
        item.color.replace(/\d+/g, (match: string): any => {
          numbersOnly.unshift(match);
        });

        const color = `rgb(${numbersOnly[0]}, ${numbersOnly[1]}, ${numbersOnly[2]})`;
        const imageUrl = item.desktop_image;
        const selected = false;
        themeList.push({ color, selected });
        images = { ...images, [color]: imageUrl };
      });
      setSelectedImage(images);
      return themeList;
    }
  }, [themeData]);

  const onUpload = (value: string) => {
    setImageUrl(value);
    let dataValue = { ...customiseData } as ILayout;
    dataValue.hero_banner.banner_image = value;
    dataValue.hero_banner.status = true;
    setCustomiseData(dataValue);
  };
  const onUploadFavicon = (value: string) => {
    setFaviconUrl(value);
    let dataValue = { ...customiseData } as ILayout;
    if (dataValue.hasOwnProperty("favicon")) {
      dataValue.favicon.url = value;
      dataValue.favicon.status = true;
      setCustomiseData(dataValue);
    } else {
      dataValue.favicon = {
        url: value,
        status: true,
      };
      setCustomiseData(dataValue);
    }
  };
  const resetDefaultUpload = () => {
    setImageUrl("");
    let dataValue = { ...customiseData } as ILayout;
    dataValue.hero_banner.banner_image = "";
    dataValue.hero_banner.status = false;
    setCustomiseData(dataValue);
  };
  const resetDefaultUploadForFavicon = () => {
    setFaviconUrl("");
    let dataValue = { ...customiseData } as ILayout;
    dataValue.favicon.url = "";
    dataValue.favicon.status = false;
    setCustomiseData(dataValue);
  };

  const handleSave = async () => {
    if (isSubscriptionExpired || isSubscriptionType === "free") {
      setFaviconContent(false);
      setIsProUpgrade(false);
      setIsStarterUpgrade(true);
      setOpenUpgradeModal(true);
    } else {
      await saveCustomisation();
    }
  };

  const saveCustomisation = async () => {
    try {
      const payload = { ...customiseData } as ILayout;
      let result = await updateStoreLayout({ config: payload });

      if ("data" in result) {
        if (result.data.first_time_customize) {
          if (typeof _cio !== "undefined") {
            _cio.identify({
              id: user?.email,
              website_launched: true,
            });
          }

          if (typeof mixpanel !== "undefined") {
            mixpanel.people.set("website_launched", true);
          }
        }
        if (typeof _cio !== "undefined") {
          _cio.track("web_customise_store", payload);
        }
        showToast("Store Customisation updated Successfully", "success");
        navigate(-1);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleOpenUpgradeModal = (event: any) => {
    if (isSubscriptionExpired || isSubscriptionType === "free") {
      event.preventDefault();
      setIsStarterUpgrade(false);
      setFaviconContent(true);
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
    }
  };

  const proFeaturesList = faviconContent
    ? [
        "Business logo (favicon) on your website link)",
        "No free shipping automation",
        "No one-use website discounts.",
      ]
    : [
        "Change the colors, layout etc of your website",
        "Favicon",
        "Add up to 500 products",
        "Get a free.com.ng domain name on a 1 year plan",
      ];

  const growthFeaturesList = faviconContent
    ? [
        "Business logo (favicon) on your website link)",
        "Automatically set free shipping for purchases beyond a certain amount.",
        "Create one-use website discounts for new or loyal discounts ",
      ]
    : [
        "Business logo (favicon on your website link)",
        "Automatically set free shipping for purchases beyond a certain amount.",
        "Add unlimited products to your store",
        "Get free .com.ng domain name",
      ];

  //updates the selectedColor value to the theme_color
  useEffect(() => {
    if (Object.keys(customiseData).length && selectedColour) {
      const str = selectedColour;
      let numbersOnly: string[] = [];
      str.replace(/\d+/g, (match): any => {
        numbersOnly.push(match);
      });

      let dataValue: any = { ...customiseData };

      dataValue.theme_color.red = parseInt(numbersOnly[0]);
      dataValue.theme_color.green = parseInt(numbersOnly[1]);
      dataValue.theme_color.blue = parseInt(numbersOnly[2]);
      setCustomiseData(dataValue);
    }
  }, [selectedColour]);

  return (
    <div>
      {(isLoading || themeLoading || isStoreLoading || isFetching) && (
        <Loader />
      )}
      <div>
        <div>
          <div className="customise-theme">
            <div className="customise-theme__heading">
              <Link to="/dashboard/customisation">
                <ArrowRightIcon />
              </Link>
              <h3>Customise storefront</h3>
            </div>

            <div className="customise-theme__container">
              <div className="customise-theme__banner-title">
                <p className="text">Store Banner</p>
              </div>
              <div className="customise-theme__upload">
                <div>
                  <p className="text">Upload store banner (1440 x 350)</p>{" "}
                </div>
                <div>
                  <NormalFileInput
                    dimensions="1440 x 350"
                    onFileUpload={onUpload}
                    name="image"
                    type="img"
                    uploadPath={`${CUSTOMISATION_ROUTES.CUSTOMISATION}/uploadbanner`}
                    defaultImg={imageUrl}
                    resetDefaultUpload={resetDefaultUpload}
                    aspect={1440 / 350}
                    cropWidth={1440}
                    cropHeight={350}
                  />
                  {/* baner toggle */}
                  <div className="customise-theme__switch-area">
                    <div className="customise-theme__switch-label">
                      <label htmlFor={listOfSettings[6].name}>
                        <h3>{listOfSettings[6].header}</h3>
                        <p>{listOfSettings[6].msg}</p>
                      </label>
                    </div>
                    <div className="customise-theme__switch-component">
                      {listOfSettings[6].checked && (
                        <button
                          onClick={() => {
                            handleNotifications(listOfSettings[6].header);
                          }}
                        >
                          Edit
                        </button>
                      )}
                      <SwitchComponent
                        checked={listOfSettings[6].checked}
                        onChange={() => handleSwitch(6)}
                        // index={index}
                        index={6}
                        id={listOfSettings[6].name}
                      />
                    </div>
                  </div>

                  {/* favicon section */}
                  <div className="favicon_section">
                    <h3>Favicon</h3>
                    <p className="text">
                      This is your store logo icon that’ll appear in your
                      browser tab
                    </p>
                  </div>
                  <FaviconTypeFileInput
                    dimensions="16px x 16px"
                    onFileUpload={onUploadFavicon}
                    name="image"
                    type="img"
                    uploadPath={`${CUSTOMISATION_ROUTES.CUSTOMISATION}/uploadasset`}
                    defaultImg={faviconUrl}
                    resetDefaultUpload={resetDefaultUploadForFavicon}
                    aspect={16 / 16}
                    cropWidth={16}
                    cropHeight={16}
                    showModal={handleOpenUpgradeModal}
                  />
                </div>
              </div>

              <div className="customise-theme__theme-section">
                <div className="customise-theme__theme-title">Theme Colour</div>
                <div className="customise-theme__theme-container">
                  <div>
                    <div className="customise-theme__theme">
                      {listOfColors?.map((color, index) => (
                        <button
                          className="customise-theme__theme--bg"
                          style={{ backgroundColor: color.color }}
                          key={index}
                          onClick={() => {
                            setSelectedColour(color.color);
                          }}
                        >
                          {color.selected}{" "}
                          {color.color === selectedColour && <CheckIcon />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="customise-theme__brand">
                    <img src={selectedImage[selectedColour]} alt="brand" />
                  </div>
                </div>
              </div>

              <div className="customise-theme__setings-section">
                <div className="customise-theme__theme-title">
                  Website settings
                </div>

                <div>
                  {listOfSettings
                    .filter((item) => item.name !== "hero_banner") // Exclude item with name "banner"
                    .map((item: SettingsInterface, index: number) => (
                      <div key={index} className="customise-theme__switch-area">
                        <div className="customise-theme__switch-label">
                          <label htmlFor={item.name}>
                            <h3>{item.header}</h3>
                            <p>{item.msg}</p>
                          </label>
                        </div>
                        <div className="customise-theme__switch-component">
                          {item.checked && (
                            <button
                              onClick={() => {
                                handleNotifications(item.header);
                              }}
                            >
                              Edit
                            </button>
                          )}
                          <div>
                            <SwitchComponent
                              checked={item.checked}
                              onChange={() => handleSwitch(index)}
                              index={index}
                              id={item.name}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="settings-footer">
            <div>
              <Button
                type="button"
                className="cancel"
                onClick={() => navigate("/dashboard/customisation")}
              >
                Cancel
              </Button>
              <LoadingButton
                type="button"
                loading={updateLoading || isStoreLoading || isFetching}
                disabled={updateLoading || isStoreLoading || isFetching}
                className="save"
                onClick={handleSave}
              >
                Save Changes
              </LoadingButton>
            </div>
          </div>
        </div>
        {showBannerText && (
          <BannerTextNotification
            setShowModal={() => {
              setShowBannerText(false);
            }}
            showModal={showBannerText}
            setCustomiseData={setCustomiseData}
            customiseData={customiseData as ILayout}
          />
        )}
        {showNewsLetterNotification && (
          <NewsLetterNotification
            setShowModal={() => {
              setShowNewsLetterNotification(false);
            }}
            showModal={showNewsLetterNotification}
            setCustomiseData={setCustomiseData}
            customiseData={customiseData as ILayout}
          />
        )}
        {showCustomMessageNotification && (
          <CustomMessageNotification
            setShowModal={() => {
              setShowCustomMessageNotification(false);
            }}
            showModal={showCustomMessageNotification}
            setCustomiseData={setCustomiseData}
            customiseData={customiseData as ILayout}
          />
        )}
        {showAboutNotification && (
          <AboutSectionNotification
            setShowModal={() => {
              setShowAboutNotification(false);
            }}
            showModal={showAboutNotification}
            setCustomiseData={setCustomiseData}
            customiseData={customiseData as ILayout}
          />
        )}
        {showPolicyNotification && (
          <ReturnPolicyNotification
            setShowModal={() => {
              setShowPolicyNotification(false);
            }}
            showModal={showPolicyNotification}
            setCustomiseData={setCustomiseData}
            customiseData={customiseData as ILayout}
          />
        )}
        {showMediaNotification && (
          <SocialmediaNotification
            setShowModal={() => {
              setShowMediaNotification(false);
            }}
            showModal={showMediaNotification}
            customiseData={customiseData as ILayout}
            setCustomiseData={setCustomiseData}
          />
        )}
        {showProductListNotification && (
          <ProductListNotification
            setShowModal={() => {
              setShowProductListNotification(false);
            }}
            showModal={showProductListNotification}
            customiseData={customiseData as ILayout}
            setCustomiseData={setCustomiseData}
          />
        )}
        {openUpgradeModal && (
          <UpgradeModal
            openModal={openUpgradeModal}
            closeModal={() => setOpenUpgradeModal(false)}
            starter={isStarterUpgrade}
            pro={isProUpgrade}
            title={`${
              faviconContent
                ? "Add your logo on your website link (Favicon)"
                : "Customize your website on a Bumpa Plan"
            }`}
            subtitle={`${
              faviconContent
                ? "Customise how your website looks on Google search."
                : "Change your website’s color, layout, product listing with website customization."
            }`}
            starterFeatures={[
              "Change the colors, layout etc of your website",
              "No business logo (favicon) on website",
              "Add up to 100 products",
              "Purchase a custom domain name",
            ]}
            proFeatures={proFeaturesList}
            growthFeatures={growthFeaturesList}
            eventName={`${faviconContent ? "favicon" : "site-customization"}`}
          />
        )}
      </div>
    </div>
  );
};

export default CustomiseTheme;
