import { useEffect, useState } from "react";
import FaviconTypeFileInput from "components/forms/FaviconTypeFileInput";
import NormalFileInput from "components/forms/NormalFileInput";
import InputField from "components/forms/InputField";
import NormalSelectField from "components/forms/NormalSelectField";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import SectionTitle from "../section-title";
import {
  selectThemeConfigData,
  setThemeConfigData,
} from "store/slice/ThemeSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { CONFIG_KEYS, FONT_FAMILY_OPTIONS } from "utils/constants/general";
import { findFontOption } from "utils";
import { CUSTOMISATION_ROUTES } from "utils/constants/apiroutes";

const Branding = () => {
  const dispatch = useAppDispatch();
  const themeConfigData = useAppSelector(selectThemeConfigData);
  const [themeColor, setThemeColor] = useState("");
  const [font, setFont] = useState<any>(`"Aleo", serif`);
  const [imageUrl, setImageUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");

  useEffect(() => {
    if (themeConfigData) {
      setFaviconUrl(themeConfigData?.favicon);
      setThemeColor(themeConfigData?.theme_color);
      setFont(themeConfigData?.font?.value);
      setImageUrl(themeConfigData?.store_banner);
    }
  }, [themeConfigData]);

  const onUpload = (value: string) => {
    setImageUrl(value);
    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.store_banner]: value,
      })
    );
  };
  const onUploadFavicon = (value: string) => {
    setFaviconUrl(value);
    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.favicon]: value,
      })
    );
  };
  const resetDefaultUpload = () => {
    setImageUrl("");
    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.store_banner]: "",
      })
    );
  };
  const resetDefaultUploadForFavicon = () => {
    setFaviconUrl("");
    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.favicon]: "",
      })
    );
  };

  const updateThemeColor = (value: string) => {
    console.log(value, "colorr");
    setThemeColor(value);
    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.themeColor]: value,
      })
    );
  };

  const updateFont = (value: string) => {
    setFont(value);
    let fontObj = findFontOption(value, FONT_FAMILY_OPTIONS);

    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.font]: fontObj,
      })
    );
  };

  console.log(themeConfigData, "themeConfigData");
  return (
    <div className="branding section">
      <FormSectionHeader title="BRANDING" />
      <div className="section_content">
        <SectionTitle
          title="Favicon"
          desc="This is your store logo icon that'll appear in your browser tab."
        />
        <div className="favicon_upload">
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
          />
        </div>
      </div>

      <div className="section_content">
        <SectionTitle
          title="Theme Colour"
          desc="Choose your preferred theme colour to personalise your website."
        />

        <div className="theme_color">
          <InputField
            type="color"
            value={themeColor}
            onChange={(e) => updateThemeColor(e?.target?.value)}
          />
        </div>
      </div>

      <div className="section_content">
        <SectionTitle
          title="Font"
          desc="Choose your preferred font to personalise your website."
        />

        <div className="font_selection">
          <NormalSelectField
            name="font"
            placeholder="Select font..."
            defaultValue={font}
            selectOption={FONT_FAMILY_OPTIONS?.map((item: any) => {
              return {
                key: item.label,
                value: item.value,
              };
            })}
            value={font}
            handleCustomChange={(e) => {
              updateFont(e.target.value);
            }}
          />
          <div
            className="preview"
            style={{
              ["--preview-font-family" as string]: font,
            }}
          >
            <h1>Text preview | 01234.</h1>
            <h3>Text preview | 01234.</h3>
            <p>Text preview | 01234.</p>
            <span>Text preview | 01234.</span>
          </div>
        </div>
      </div>

      <div className="section_content">
        <SectionTitle
          title="Page Title Banner"
          desc="This background image will appear behind the page title in the top section of certain pages on your website."
        />

        <div className="favicon_upload store_banner_upload">
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
        </div>
      </div>
    </div>
  );
};

export default Branding;
