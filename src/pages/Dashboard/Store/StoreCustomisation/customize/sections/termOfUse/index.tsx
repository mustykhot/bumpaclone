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
import { TermsOfUseModal } from "./modal";
const TermOfUse = () => {
  const dispatch = useAppDispatch();
  const themeConfigData = useAppSelector(selectThemeConfigData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTermsOfUse, setShowTermsOfUse] = useState(false);
  const [termsOfUseInfo, setTermsOfUseInfo] = useState({});

  useEffect(() => {
    if (themeConfigData) {
      setShowTermsOfUse(themeConfigData?.terms_of_use?.show);
      setTermsOfUseInfo(themeConfigData?.terms_of_use);
    }
  }, [themeConfigData]);

  const saveChanges = (data: any) => {
    if (data?.show === true && !data?.content) {
      return;
    }
    setTermsOfUseInfo(data);
    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.termsOfUse]: data,
      })
    );
  };

  return (
    <>
      <div className="section">
        <FormSectionHeader title="TERMS OF USE" />
        <div className="section_content">
          <div className="countdown">
            <SectionTitle
              title="Display Terms of Use"
              desc="Toggle to show a terms of use section on your website."
            />

            <div className="actions">
              {showTermsOfUse && (
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
                checked={showTermsOfUse}
                onChange={() => {
                  setShowTermsOfUse(!showTermsOfUse);
                  saveChanges({ ...termsOfUseInfo, show: !showTermsOfUse });
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <TermsOfUseModal
        openModal={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        data={termsOfUseInfo}
        saveChanges={saveChanges}
      />
    </>
  );
};

export default TermOfUse;
