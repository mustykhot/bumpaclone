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
import { RegulationsModal } from "./modal";

const Regulations = () => {
  const dispatch = useAppDispatch();
  const themeConfigData = useAppSelector(selectThemeConfigData);
  const [showRegulations, setShowRegulations] = useState(false);
  const [regulationsList, setRegulationsList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (themeConfigData) {
      setShowRegulations(themeConfigData?.regulations?.show);
      setRegulationsList(themeConfigData?.regulations?.list);
    }
  }, [themeConfigData]);

  const saveChanges = (show: boolean) => {
    if (show === true && regulationsList?.length < 1) {
      return;
    }

    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.regulations]: {
          show,
          list: regulationsList,
        },
      })
    );
  };

  return (
    <>
      <div className="section">
        <FormSectionHeader title="REGULATIONS" />
        <div className="section_content">
          <div className="countdown">
            <SectionTitle
              title="Display Store Regulations"
              desc="Toggle to add your store regulations on your website."
            />

            <div className="actions">
              {showRegulations && (
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
                checked={showRegulations}
                onChange={() => {
                  setShowRegulations(!showRegulations);
                  saveChanges(!showRegulations);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <RegulationsModal
        openModal={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        regulationsList={regulationsList}
        setRegulationsList={setRegulationsList}
        saveChanges={() => saveChanges(showRegulations)}
      />
    </>
  );
};

export default Regulations;
