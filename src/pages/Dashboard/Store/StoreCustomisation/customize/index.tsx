import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import ErrorMsg from "components/ErrorMsg";
import Loader from "components/Loader";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { AnyObject } from "Models";
import { areObjsValuesEqual } from "utils/constants/general";

import { handleError } from "utils";
import { useGetSingleThemeQuery, useUpdateThemeMutation } from "services";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  selectThemeConfigData,
  setThemeConfigData,
} from "store/slice/ThemeSlice";
import "./style.scss";
import Branding from "./sections/branding";
import HomepageHero from "./sections/homepageHero";
import FeaturedCollections from "./sections/collections";
import Brands from "./sections/brands";
import ProductsHighlight from "./sections/productHighlight";
import Countdown from "./sections/countdown";
import SocialMedia from "./sections/socialMedia";
import Newsletter from "./sections/newsLetter";
import Testimonials from "./sections/testimonials";
import Regulations from "./sections/regulations";
import AboutUs from "./sections/aboutUs";
import Faq from "./sections/faq";
import ReturnPolicy from "./sections/returnPolicy";
import TermOfUse from "./sections/termOfUse";

const CustomizeThemePage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const themeConfigData = useAppSelector(selectThemeConfigData);
  const [savedThemeConfigData, setSavedThemeConfigData] = useState<AnyObject>(
    {}
  );
  console.log(themeConfigData, "themeConfigData");
  const {
    data: singleThemeData,
    isLoading: loadSingleTheme,
    isError: singleThemeError,
  } = useGetSingleThemeQuery(`${id}`);
  const [updateTheme, { isLoading }] = useUpdateThemeMutation();

  const saveThemeConfigChanges = async () => {
    try {
      const payload = { data: themeConfigData };
      let result = await updateTheme({ body: payload, id: `${id}` });
      if ("data" in result) {
        showToast("Theme updated succesfully", "success");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (singleThemeData) {
      dispatch(setThemeConfigData(singleThemeData?.options));
      setSavedThemeConfigData(singleThemeData?.options);
    }
  }, [singleThemeData]);

  const areNewConfigChangesMade = !areObjsValuesEqual(
    savedThemeConfigData,
    themeConfigData
  );

  if (singleThemeError) {
    return <ErrorMsg message="Something went wrong" />;
  }
  return (
    <div className="pd_customize_theme_page">
      {loadSingleTheme && <Loader />}
      {singleThemeData && (
        <div className="form_container">
          <div className="form_section">
            <ModalHeader text="Customise storefront" />
            <div className="form_field_container">
              <Branding />
              <HomepageHero />
              <FeaturedCollections />
              <Brands />
              <ProductsHighlight />
              <Countdown />
              <SocialMedia />
              <Newsletter />
              <Testimonials />
              <Regulations />
              <AboutUs />
              <Faq />
              <ReturnPolicy />
              <TermOfUse />
            </div>
          </div>

          <div className="submit_form_section">
            <div className="button_container2">
              <Button onClick={() => {}} className="discard">
                Cancel
              </Button>
            </div>
            <div className="button_container">
              <Button
                onClick={saveThemeConfigChanges}
                variant="contained"
                className="add"
                type="submit"
                disabled={!areNewConfigChangesMade}
              >
                {isLoading ? (
                  <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizeThemePage;
