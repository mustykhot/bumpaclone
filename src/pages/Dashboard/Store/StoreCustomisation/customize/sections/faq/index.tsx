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
import { FaqModal } from "./modal";

const Faq = () => {
  const dispatch = useAppDispatch();
  const themeConfigData = useAppSelector(selectThemeConfigData);
  const [showFaq, setShowFaq] = useState(false);
  const [faqList, setFaqList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (themeConfigData) {
      setShowFaq(themeConfigData?.faq?.show);
      setFaqList(themeConfigData?.faq?.list);
    }
  }, [themeConfigData]);

  const saveChanges = (show: boolean) => {
    if (show === true && faqList?.length < 1) {
      return;
    }

    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.faq]: {
          show,
          list: faqList,
        },
      })
    );
  };

  return (
    <>
      <div className="section">
        <FormSectionHeader title="FAQs" />

        <div className="section_content">
          <div className="countdown">
            <SectionTitle
              title="Display Store FAQs"
              desc="Toggle to add your store faqs on your website."
            />

            <div className="actions">
              {showFaq && (
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
                checked={showFaq}
                onChange={() => {
                  setShowFaq(!showFaq);
                  saveChanges(!showFaq);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <FaqModal
        openModal={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        faqList={faqList}
        setFaqList={setFaqList}
        saveChanges={() => saveChanges(showFaq)}
      />
    </>
  );
};

export default Faq;
