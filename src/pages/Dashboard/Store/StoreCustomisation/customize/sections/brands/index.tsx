import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { EditIcon } from "assets/Icons/EditIcon";
import { SwitchComponent } from "components/SwitchComponent";
import SectionTitle from "../section-title";
import { BrandsModal } from "./modal";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import { AnyObject } from "Models";
import {
  selectThemeConfigData,
  setThemeConfigData,
} from "store/slice/ThemeSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { CONFIG_KEYS } from "utils/constants/general";

const Brands = () => {
  const dispatch = useAppDispatch();
  const themeConfigData = useAppSelector(selectThemeConfigData);
  const [showBrands, setShowBrands] = useState(false);
  const [brandsInfo, setBrandsInfo] = useState<AnyObject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (themeConfigData) {
      setShowBrands(themeConfigData?.brands_section?.show);
      setBrandsInfo(themeConfigData?.brands_section?.brands);
    }
  }, [themeConfigData]);

  const saveChanges = (show: boolean) => {
    if (show === true && brandsInfo?.length < 1) {
      return;
    }

    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.brandsSection]: {
          show,
          brands: brandsInfo,
        },
      })
    );
  };

  return (
    <>
      <div className="section">
        <FormSectionHeader title="BRANDS" />

        <div className="section_content">
          <div className="brands">
            <SectionTitle
              title="Feature Brands"
              desc="Toggle to show your associated brands on your website."
            />

            <div className="actions">
              {showBrands && (
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
                checked={showBrands}
                onChange={() => {
                  setShowBrands(!showBrands);
                  saveChanges(!showBrands);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <BrandsModal
        openModal={isModalOpen}
        closeModal={() => {
          setIsModalOpen(false);
        }}
        brandsInfo={brandsInfo}
        setBrandsInfo={(data: any) => setBrandsInfo(data)}
        saveChanges={() => saveChanges(showBrands)}
      />
    </>
  );
};

export default Brands;
