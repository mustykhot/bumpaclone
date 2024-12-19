import { useState, useEffect } from "react";
import "./style.scss";
import themeImage from "assets/images/right-theme-image.svg";
import leftThemeImage from "assets/images/left-theme-image.svg";
import Button from "@mui/material/Button";
import { BulbLight } from "assets/Icons/BulbLight";
import { InfoIcon } from "assets/Icons/InfoIcon";
import themesInfo from "assets/images/themes-announcement.svg";
import { Link } from "react-router-dom";
import {
  useGetStoreInformationQuery,
  useUpdateStoreThemeMutation,
} from "services";
import { handleError } from "utils";
import { showToast } from "store/store.hooks";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Skeleton } from "@mui/material";
import Loader from "components/Loader";
import ErrorMsg from "components/ErrorMsg";

const ListOfThemes = () => {
  const [template, setTemplate] = useState("");
  const [updateStoreThemeMutation, { isLoading }] =
    useUpdateStoreThemeMutation();

  const {
    data: storeData,
    isLoading: loadStore,
    isError,
  } = useGetStoreInformationQuery();

  const navigate = useNavigate();

  useEffect(() => {
    if (storeData) {
      setTemplate(storeData?.store?.template as string);
    }
  }, [storeData]);

  const handleChange = async (value: string) => {
    try {
      const result = await updateStoreThemeMutation({ template: value });
      if ("data" in result) {
        setTemplate(value);
        showToast("Store theme Updated Successfully", "success");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  if (isError) {
    return <ErrorMsg />;
  }
  return (
    <>
      {loadStore && <Loader />}
      <div className="pd_theme_list">
        <div className="list__heading">
          <h3>Storefront Customisation</h3>
          <p>Choose your preferred store theme</p>
        </div>

        <div className="list__container">
          <div className="list__theme">
            {/* <div
              className={`list__itemone ${
                template === "salescabal" ? "active" : ""
              }`}
            >
              <div className="list__itemone-image">
                <img src={leftThemeImage} alt="theme" />
              </div>
              <div
                className={`list__itemone-footer  ${
                  template === "salescabal" ? "footer-active" : ""
                }`}
              >
                <div>
                  <span className="template-name">Salescabal Theme</span>
                  {template === "salescabal" && (
                    <span className="active-badge">Active</span>
                  )}
                </div>

                <div>
                  {template !== "salescabal" && (
                    <LoadingButton
                      loading={isLoading}
                      startIcon={<BulbLight />}
                      onClick={() => handleChange("salescabal")}
                      className="apply"
                    >
                      Apply
                    </LoadingButton>
                  )}
                  {template === "salescabal" && (
                    <div className="list__not-customisable">
                      <div>
                        <InfoIcon />
                      </div>
                      <div>This theme is not customisable</div>
                    </div>
                  )}
                </div>
              </div>
            </div> */}

            <div
              className={`list__itemtwo ${
                template === "bumpa" ? "active" : ""
              }`}
            >
              <div className="list__itemtwo-image">
                <img src={themeImage} alt="theme" />
              </div>
              <div
                className={`list__itemtwo-footer ${
                  template === "bumpa" ? "footer-active" : ""
                }`}
              >
                <div>
                  <span className="template-name">Bumpa Theme</span>
                  {template === "bumpa" && (
                    <span className="active-badge">Active</span>
                  )}
                </div>

                <div>
                  {template !== "bumpa" && (
                    <LoadingButton
                      loading={isLoading}
                      startIcon={<BulbLight />}
                      onClick={() => handleChange("bumpa")}
                      className="apply"
                    >
                      Apply
                    </LoadingButton>
                  )}
                  {template === "bumpa" && (
                    <LoadingButton
                      className="customise-theme"
                      onClick={() => navigate("customise-theme")}
                    >
                      Customise theme
                    </LoadingButton>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="list__info">
            <div>
              <img src={themesInfo} alt="icon" />
              <p>More themes coming soon!</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListOfThemes;
