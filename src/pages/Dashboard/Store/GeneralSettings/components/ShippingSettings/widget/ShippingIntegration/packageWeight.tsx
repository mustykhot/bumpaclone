import { useState } from "react";

import { PickBoxIcon } from "assets/Icons/PickBoxIcon";
import { ChevronRight } from "assets/Icons/ChevronRight";

import { ContentHeader } from "../../settings";
import { WeightModal } from "./WeightModal";

import { useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  selectShipbubbleSettingsUpdateField,
  updateShipbubbleShippingSettingState,
} from "store/slice/ShippingSettingsSlice";

const PackageWeight = () => {
  const dispatch = useAppDispatch();
  const shipbubbleShippingSettingsUpdateFields = useAppSelector(
    selectShipbubbleSettingsUpdateField
  );

  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="pd_package_weight">
        <ContentHeader
          title="Package Weight And Size"
          description="Click here to select package weight and size"
        />

        <div className="input_weight">
          <div className="default_shipping">
            <label>Shipping Box Size</label>
            <div
              className="display_selected_box"
              onClick={() => {
                setOpenModal(true);
              }}
            >
              <PickBoxIcon />
              <div className="text">
                <p className="size">
                  <span>Small</span>
                  {` (${
                    shipbubbleShippingSettingsUpdateFields?.custom_box_size
                      ?.weight
                  }kg, H:${
                    shipbubbleShippingSettingsUpdateFields?.custom_box_size
                      ?.height || 0
                  }cm, L:${
                    shipbubbleShippingSettingsUpdateFields?.custom_box_size
                      ?.length || 0
                  }cm, W:${
                    shipbubbleShippingSettingsUpdateFields?.custom_box_size
                      ?.width || 0
                  }cm )`}
                </p>
                <ChevronRight className="chevron" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <WeightModal
        openModal={openModal}
        closeModal={() => {
          setOpenModal(false);
        }}
      />
    </>
  );
};

export default PackageWeight;
