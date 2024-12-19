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
import { ReturnPolicyModal } from "./modal";

const ReturnPolicy = () => {
  const dispatch = useAppDispatch();
  const themeConfigData = useAppSelector(selectThemeConfigData);
  const [showReturnPolicy, setShowReturnPolicy] = useState(false);
  const [returnPolicyInfo, setReturnPolicyInfo] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (themeConfigData) {
      setShowReturnPolicy(themeConfigData?.return_policy?.show);
      setReturnPolicyInfo(themeConfigData?.return_policy);
    }
  }, [themeConfigData]);

  const saveChanges = (data: any) => {
    if (data?.show === true && !data?.content) {
      return;
    }
    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.returnPolicy]: data,
      })
    );
    setReturnPolicyInfo(data);
  };

  return (
    <>
      <div className="section">
        <FormSectionHeader title="RETURN POLICY" />
        <div className="section_content">
          <div className="countdown">
            <SectionTitle
              title="Display Return Policy"
              desc="Toggle to show a return policy section on your website."
            />

            <div className="actions">
              {showReturnPolicy && (
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
                checked={showReturnPolicy}
                onChange={() => {
                  setShowReturnPolicy(!showReturnPolicy);
                  saveChanges({ ...returnPolicyInfo, show: !showReturnPolicy });
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <ReturnPolicyModal
        openModal={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        data={returnPolicyInfo}
        saveChanges={saveChanges}
      />
    </>
  );
};

export default ReturnPolicy;
