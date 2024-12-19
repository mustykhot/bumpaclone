import TextAreaField from "components/forms/TextAreaField";

import {
  selectSettingsUpdateField,
  updateShippingSettingState,
} from "store/slice/ShippingSettingsSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";

const CheckOutNote = () => {
  const dispatch = useAppDispatch();

  const shippingSettingsUpdateFields = useAppSelector(
    selectSettingsUpdateField
  );

  return (
    <div
      className="content_area"
      style={{ borderTop: `1px solid var(--grey04)` }}
    >
      <div className="content_header">
        <p className="content_title">Add a checkout note</p>

        <p className="content_description">
          This note will be displayed when your customers are about to checkout
        </p>
      </div>
      <TextAreaField
        value={shippingSettingsUpdateFields?.checkout_note || ""}
        height={"h-[120px] mt-[16px]"}
        onChange={(e) => {
          dispatch(
            updateShippingSettingState({
              checkout_note: e.target.value,
            })
          );
        }}
      />{" "}
    </div>
  );
};

export default CheckOutNote;
