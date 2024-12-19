import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { EditIcon } from "assets/Icons/EditIcon";
import { SwitchComponent } from "components/SwitchComponent";
import { HomepageHeroModal } from "./modal";
import SectionTitle from "../section-title";
import { AnyObject } from "Models";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import {
  selectThemeConfigData,
  setThemeConfigData,
} from "store/slice/ThemeSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { CONFIG_KEYS } from "utils/constants/general";

const HomepageHero = () => {
  const dispatch = useAppDispatch();
  const themeConfigData = useAppSelector(selectThemeConfigData);
  const [showHomepageHero, setShowHomepageHero] = useState(false);
  const [homepageHeroInfo, setHomepageHeroInfo] = useState<AnyObject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (themeConfigData) {
      setShowHomepageHero(themeConfigData?.homepage_hero?.show);
      setHomepageHeroInfo(themeConfigData?.homepage_hero?.list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeConfigData]);

  const saveChanges = (show: boolean) => {
    if (show === true && homepageHeroInfo?.length < 1) {
      return;
    }

    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.homepageHero]: {
          show,
          list: homepageHeroInfo,
        },
      })
    );
  };

  return (
    <>
      <div className="section">
        <FormSectionHeader title="HERO (HOMEPAGE)" />

        <div className="section_content">
          <div className="brands">
            <SectionTitle
              title="Display Custom Hero"
              desc="Enable this to showcase a custom hero as the top banner of your homepage."
            />

            <div className="actions">
              {showHomepageHero && (
                <Button
                  variant="outlined"
                  onClick={() => setIsModalOpen(true)}
                  className="edit_btn"
                  startIcon={<EditIcon stroke="#009444" />}
                >
                  Edit
                </Button>
              )}
              <SwitchComponent
                checked={showHomepageHero}
                onChange={() => {
                  setShowHomepageHero(!showHomepageHero);
                  saveChanges(!showHomepageHero);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <HomepageHeroModal
        openModal={isModalOpen}
        closeModal={() => {
          setIsModalOpen(false);
        }}
        homepageHeroInfo={homepageHeroInfo}
        setHomepageHeroInfo={(data: any) => setHomepageHeroInfo(data)}
        saveChanges={() => saveChanges(showHomepageHero)}
      />
    </>
  );
};

export default HomepageHero;
