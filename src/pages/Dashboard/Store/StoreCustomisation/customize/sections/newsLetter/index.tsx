import { useEffect, useState } from "react";
import { EditIcon } from "assets/Icons/EditIcon";
import { Button } from "@mui/material";
import { SwitchComponent } from "components/SwitchComponent";
import SectionTitle from "../section-title";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  selectThemeConfigData,
  setThemeConfigData,
} from "store/slice/ThemeSlice";
import { CONFIG_KEYS } from "utils/constants/general";
import { NewsletterModal } from "./modal";

const Newsletter = () => {
  const dispatch = useAppDispatch();

  const themeConfigData = useAppSelector(selectThemeConfigData);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [newsletterInfo, setNewsletterInfo] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (themeConfigData) {
      setShowNewsletter(themeConfigData?.newsletter?.show);
      setNewsletterInfo(themeConfigData?.newsletter);
    }
  }, [themeConfigData]);

  const saveChanges = (data: any) => {
    if (data?.show === true && !data?.title) {
      return;
    }
    setNewsletterInfo(data);
    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.newsletter]: data,
      })
    );
  };

  return (
    <>
      <div className="section">
        <FormSectionHeader title="NEWSLETTER" />
        <div className="section_content">
          <div className="countdown">
            <SectionTitle
              title="Display Newsletter Form"
              desc="Toggle to show a newsletter pop-up form to your website."
            />

            <div className="actions">
              {showNewsletter && (
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
                checked={showNewsletter}
                onChange={() => {
                  setShowNewsletter(!showNewsletter);
                  saveChanges({ ...newsletterInfo, show: !showNewsletter });
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <NewsletterModal
        openModal={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        data={newsletterInfo}
        saveChanges={saveChanges}
      />
    </>
  );
};

export default Newsletter;
