import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { EditIcon } from "assets/Icons/EditIcon";
import { SwitchComponent } from "components/SwitchComponent";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import SectionTitle from "../section-title";
import { CountDownModal } from "./modal";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  selectThemeConfigData,
  setThemeConfigData,
} from "store/slice/ThemeSlice";
import { CONFIG_KEYS } from "utils/constants/general";

const Countdown = () => {
  const dispatch = useAppDispatch();
  const themeConfigData = useAppSelector(selectThemeConfigData);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownInfo, setCountdownInfo] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (themeConfigData) {
      setShowCountdown(themeConfigData?.countdown_section?.show);
      setCountdownInfo(themeConfigData?.countdown_section);
    }
  }, [themeConfigData]);

  const saveChanges = (data: any) => {
    if (data?.show === true && !data?.title) {
      return;
    }
    setCountdownInfo(data);
    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.countdownSection]: data,
      })
    );
  };

  return (
    <>
      <div className="section">
        <FormSectionHeader title="COUNTDOWN / COMING SOON" />

        <div className="section_content">
          <div className="countdown">
            <SectionTitle
              title="Countdown Section"
              desc="Toggle to add a countdown/coming soon section to your website."
            />

            <div className="actions">
              {showCountdown && (
                <Button
                  variant="outlined"
                  onClick={() => setIsModalOpen(true)}
                  className="edit_btn btn_secondary"
                  startIcon={<EditIcon stroke="#009444" />}
                >
                  Edit
                </Button>
              )}

              <SwitchComponent
                checked={showCountdown}
                onChange={() => {
                  setShowCountdown(!showCountdown);
                  saveChanges({ ...countdownInfo, show: !showCountdown });
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <CountDownModal
        openModal={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        data={countdownInfo}
        saveChanges={saveChanges}
      />
    </>
  );
};

export default Countdown;
