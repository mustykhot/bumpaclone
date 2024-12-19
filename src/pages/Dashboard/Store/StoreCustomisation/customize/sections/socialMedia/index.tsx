import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { EditIcon } from "assets/Icons/EditIcon";
import { SwitchComponent } from "components/SwitchComponent";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import SectionTitle from "../section-title";
import {
  selectThemeConfigData,
  setThemeConfigData,
} from "store/slice/ThemeSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { CONFIG_KEYS } from "utils/constants/general";
import { SocialMediaModal } from "./modal";

const SocialMedia = () => {
  const dispatch = useAppDispatch();
  const themeConfigData = useAppSelector(selectThemeConfigData);
  const [showSocials, setShowSocials] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (themeConfigData) {
      setShowSocials(themeConfigData?.social_links?.show);
      setSocialLinks(themeConfigData?.social_links?.links);
    }
  }, [themeConfigData]);

  const saveChanges = (show: boolean) => {
    if (show === true && socialLinks?.length < 1) {
      return;
    }

    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.socialLinks]: {
          show,
          links: socialLinks,
        },
      })
    );
  };

  return (
    <>
      <div className="section">
        <FormSectionHeader title="SOCIAL MEDIA" />

        <div className="section_content">
          <div className="countdown">
            <SectionTitle
              title="Display Social Media Handles"
              desc="Toggle to activate and edit your social media handles on your website."
            />

            <div className="actions">
              {showSocials && (
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
                checked={showSocials}
                onChange={() => {
                  setShowSocials(!showSocials);
                  saveChanges(!showSocials);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <SocialMediaModal
        openModal={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        socialLinks={socialLinks}
        setSocialLinks={setSocialLinks}
        saveChanges={() => saveChanges(showSocials)}
      />
    </>
  );
};

export default SocialMedia;
