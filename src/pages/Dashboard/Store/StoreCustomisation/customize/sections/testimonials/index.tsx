import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { EditIcon } from "assets/Icons/EditIcon";
import { SwitchComponent } from "components/SwitchComponent";
import { AnyObject } from "Models";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import {
  selectThemeConfigData,
  setThemeConfigData,
} from "store/slice/ThemeSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { CONFIG_KEYS } from "utils/constants/general";
import SectionTitle from "../section-title";
import { TestimonialsModal } from "./modal";

const Testimonials = () => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const themeConfigData = useAppSelector(selectThemeConfigData);
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [testimonialsInfo, setTestimonialsInfo] = useState<AnyObject[]>([]);
  useEffect(() => {
    if (themeConfigData) {
      setShowTestimonials(themeConfigData?.testimonials?.show);
      setTestimonialsInfo(themeConfigData?.testimonials?.comments);
    }
  }, [themeConfigData]);

  const saveChanges = (show: boolean) => {
    if (show === true && testimonialsInfo?.length < 1) {
      return;
    }

    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.testimonials]: {
          show,
          comments: testimonialsInfo,
        },
      })
    );
  };

  return (
    <>
      <div className="section">
        <FormSectionHeader title="CUSTOMER TESTIMONIALS" />

        <div className="section_content">
          <div className="brands">
            <SectionTitle
              title="Feature Customer Testimonials"
              desc="Toggle to show your associated customer testimonials on your website."
            />

            <div className="actions">
              {showTestimonials && (
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
                checked={showTestimonials}
                onChange={() => {
                  setShowTestimonials(!showTestimonials);
                  saveChanges(!showTestimonials);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <TestimonialsModal
        openModal={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        testimonialsInfo={testimonialsInfo}
        setTestimonialsInfo={(data: any) => setTestimonialsInfo(data)}
        saveChanges={() => saveChanges(showTestimonials)}
      />
    </>
  );
};

export default Testimonials;
