import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { EditIcon } from "assets/Icons/EditIcon";
import { SwitchComponent } from "components/SwitchComponent";
import SectionTitle from "../section-title";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import {
  selectThemeConfigData,
  setThemeConfigData,
} from "store/slice/ThemeSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { CONFIG_KEYS } from "utils/constants/general";
import { AboutUsModal } from "./modal";

const AboutUs = () => {
  const dispatch = useAppDispatch();
  const themeConfigData = useAppSelector(selectThemeConfigData);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [aboutUsInfo, setAboutUsInfo] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (themeConfigData) {
      setShowAboutUs(themeConfigData?.about_us?.show);
      setAboutUsInfo(themeConfigData?.about_us);
    }
  }, [themeConfigData]);

  const saveChanges = (data: any) => {
    if (data?.show === true && !data?.title) {
      return;
    }
    setAboutUsInfo(data);

    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.aboutUs]: data,
      })
    );
  };

  return (
    <>
      <div className="section">
        <FormSectionHeader title="ABOUT US" />
        <div className="section_content">
          <div className="countdown">
            <SectionTitle
              title="Display About Us"
              desc="Toggle to show an about us section on your website."
            />

            <div className="actions">
              {showAboutUs && (
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
                checked={showAboutUs}
                onChange={() => {
                  setShowAboutUs(!showAboutUs);
                  saveChanges({ ...aboutUsInfo, show: !showAboutUs });
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <AboutUsModal
        openModal={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        data={aboutUsInfo}
        saveChanges={saveChanges}
      />
    </>
  );
};

export default AboutUs;
