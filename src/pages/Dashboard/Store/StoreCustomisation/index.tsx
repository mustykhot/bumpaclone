import {
  useActivateThemeMutation,
  useGetMarketPlaceThemesQuery,
  useGetThemesQuery,
} from "services";
import themesInfo from "assets/images/themes-announcement.svg";
import "./style.scss";
import Loader from "components/Loader";
import ErrorMsg from "components/ErrorMsg";
import { ThemeType } from "services/api.types";
import { Button, CircularProgress } from "@mui/material";
import { PalatteIcon } from "assets/Icons/Sidebar/PaletteIcon";
import { LightBulbIcon } from "assets/Icons/LightBulbIcon";
import { PaintPourIcon } from "assets/Icons/PaintPourIcon";
import { useNavigate } from "react-router-dom";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
import { useState } from "react";
import MessageModal from "components/Modal/MessageModal";
import { InfoIcon } from "assets/Icons/InfoIcon";
import { THEMECATEGORY } from "utils/constants/general";

const SingleTheme = ({
  theme,
  type,
  activateFnc,
}: {
  theme: ThemeType;
  type: string;
  activateFnc?: (id: string) => void;
}) => {
  const navigate = useNavigate();
  return (
    <div className="pd_single_theme_box">
      <div
        style={{
          backgroundImage: `url(${theme.preview_image})`,
        }}
        className="theme_image"
      >
        <div className="absolute_box">
          {type === "market" && (
            <Button
              startIcon={<PalatteIcon stroke="#0D1821" />}
              className="buy_btn"
              onClick={() => {
                navigate(`/dashboard/customisation/preview/${theme.id}`);
              }}
            >
              Buy Theme
            </Button>
          )}
          {type === "mine" && (
            <Button
              startIcon={<LightBulbIcon stroke="#FFFFFF" />}
              className="apply_btn"
              onClick={() => {
                activateFnc && activateFnc(`${theme.id}`);
              }}
            >
              Apply Theme
            </Button>
          )}
          {type === "mine" && (
            <Button
              startIcon={<PaintPourIcon stroke="#0D1821" />}
              className="customize_btn"
              onClick={() => {
                navigate(`/dashboard/customisation/${theme.id}`);
              }}
            >
              Customize
            </Button>
          )}
        </div>
      </div>
      <div className="name_box">
        <p className="theme_name">{theme.name}</p>
        {theme.active && <p className="active">Active</p>}
      </div>
    </div>
  );
};

const StoreCustomisation = () => {
  const [selectedTheme, setSelectedTheme] = useState("");
  const [activateTheme, { isLoading }] = useActivateThemeMutation();
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const {
    data: themeData,
    isLoading: loadTheme,
    isError: themeError,
  } = useGetThemesQuery();
  const {
    data: marketThemeData,
    isLoading: loadMarketTheme,
    isError: marketThemeError,
  } = useGetMarketPlaceThemesQuery();

  const activateThemeFnc = async (id: string) => {
    try {
      let result = await activateTheme(id);
      if ("data" in result) {
        showToast("Activated successfuly", "success");
        setSelectedTheme("");
        setOpenModal(false);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const marketplaceThemes = () => {
    if (marketThemeData && themeData) {
      const marketplace = new Set(
        marketThemeData?.data?.map((item) => item.id)
      );
      const installed = new Set(themeData?.data?.map((item) => item.id));

      const uniqueInArr1 = marketThemeData?.data?.filter(
        (item: any) => !installed.has(item.id)
      );
      const uniqueInArr2 = themeData?.data?.filter(
        (item: any) => !marketplace.has(item.id)
      );

      return [...uniqueInArr1, ...uniqueInArr2];
    } else {
      return [];
    }
  };

  if (loadMarketTheme || loadTheme) {
    return <Loader />;
  }
  return (
    <>
      <div className="pd_store_customization">
        <div className="pd_page_title">
          <h1>Storefront Customisation</h1>
          <p className="page_description">Choose your preferred store theme</p>
        </div>

        <div className="my_theme_section">
          <div className="section_header">
            <h4 className="section_title">My Theme</h4>
          </div>
          {!themeError && themeData && themeData?.data?.length ? (
            <div className="theme_flex_display">
              {themeData?.data?.map((item) => (
                <SingleTheme
                  activateFnc={(id: string) => {
                    setSelectedTheme(id);
                    setOpenModal(true);
                  }}
                  type="mine"
                  theme={item}
                />
              ))}
            </div>
          ) : (
            ""
          )}

          {themeError && <ErrorMsg message="Something went wrong" />}
        </div>

        <div className="my_theme_section market">
          <div className="section_header">
            <h4 className="section_title">More Themes</h4>
            <p className="section_description">
              You can buy more themes to elevate your store’s look and feel
            </p>
          </div>

          <div className="page_btn_flex">
            {THEMECATEGORY.map((item) => (
              <Button
                onClick={() => {
                  setSelectedCategory(item.value);
                }}
                className={`${selectedCategory === item.value ? "active" : ""}`}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {!marketThemeError ? (
            marketplaceThemes()?.length ? (
              <div className="theme_flex_display">
                {marketplaceThemes()?.map((item) => (
                  <SingleTheme type="market" theme={item} />
                ))}
              </div>
            ) : (
              <div className="empty_theme">
                <img src={themesInfo} alt="icon" />
                <p>More themes coming soon!</p>
              </div>
            )
          ) : (
            ""
          )}
          {marketThemeError && <ErrorMsg message="Something went wrong" />}
        </div>
      </div>

      <MessageModal
        openModal={openModal}
        closeModal={() => {
          setOpenModal(false);
        }}
        icon={<InfoIcon stroke="#5C636D" />}
        btnChild={
          <Button
            onClick={() => {
              if (selectedTheme) {
                activateThemeFnc(selectedTheme);
              }
            }}
            disabled={isLoading}
            className="primary_styled_button"
            variant="contained"
          >
            {isLoading ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Yes, activate"
            )}
          </Button>
        }
        description="Are you sure you want to activate selected theme"
      />
    </>
  );
};

export default StoreCustomisation;
