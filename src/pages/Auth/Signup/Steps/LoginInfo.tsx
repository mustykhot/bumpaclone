import { Checkbox } from "@mui/material";
import { useFormContext } from "react-hook-form";
import "./style.scss";
import SelectField from "components/forms/SelectField";
import ValidatedInput from "components/forms/ValidatedInput";
import { validatePhoneNumber } from "utils";
import { SectionTitle } from "../widget/SectionTitle";

type LoginInfoProps = {
  display: string;
  isChecked: boolean;
  isMarketingChecked: boolean;
  setChecked: (val: boolean) => void;
  setMarketingChecked: (val: boolean) => void;
};

export const LoginInfo = ({
  display,
  setChecked,
  setMarketingChecked,
  isChecked,
  isMarketingChecked,
}: LoginInfoProps) => {
  const { watch } = useFormContext();

  return (
    <div className={`${display} pd_formsection pd_loginInfo`}>
      <SectionTitle
        title="Create a Bumpa Account"
        description="Start your stress free business management journey here."
      />
      <div className="form-group-flex">
        <ValidatedInput
          name="firstName"
          placeholder="Precious"
          label="First Name"
          type={"text"}
        />
        <ValidatedInput
          name="lastName"
          placeholder="Gift"
          label="Last Name"
          type={"text"}
        />
      </div>
      <ValidatedInput
        label="Email Address"
        name="email"
        type={"email"}
        placeholder="you@email.com"
      />
      <ValidatedInput
        name="phone"
        label="Phone Number"
        type={"tel"}
        phoneWithOnlyNigerianDialCode
        rules={{
          validate: (value) => validatePhoneNumber(value, true),
        }}
      />
      <SelectField
        name="howto"
        required={true}
        selectOption={[
          { value: "friend/family", key: "Friend/Family" },
          {
            value: "instagram",
            key: "Instagram",
          },
          { value: "tiktok", key: "TikTok" },
          { value: "google_search", key: "Google Search" },
          { value: "referral", key: "Referral" },
          { value: "a_bumpa_website", key: "A Bumpa website" },
          { value: "facebook/instagram_ads", key: "Facebook/Instagram Ads" },
          { value: "google_ads", key: "Google Ads" },
          { value: "others", key: "Others" },
        ]}
        label="How did you hear about Bumpa?"
        className="howTo"
      />
      {watch("howto") === "referral" && (
        <ValidatedInput
          label="Referral Code"
          name="referral_code"
          type={"text"}
          placeholder=""
        />
      )}
      {watch("howto") === "others" && (
        <ValidatedInput
          label="Please specify how you heard about us"
          name="explain_how"
          type={"text"}
          placeholder=""
        />
      )}
      <div className="checkbox_container">
        <Checkbox
          checked={isChecked}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setChecked(!isChecked);
          }}
        />
        <p>
          I agree to the{" "}
          <a
            target="_blank"
            href="https://www.getbumpa.com/legal/general-terms-of-use"
            rel="noreferrer"
          >
            General Terms of Use
          </a>
          ,{" "}
          <a
            target="_blank"
            href="https://www.getbumpa.com/legal/merchant-terms-of-service"
            rel="noreferrer"
          >
            Merchant Terms of Use{" "}
          </a>
          &{" "}
          <a
            target="_blank"
            href="https://www.getbumpa.com/legal/general-privacy-policy"
            rel="noreferrer"
          >
            General Privacy Policy{" "}
          </a>
          of Bumpa
        </p>
      </div>
      <div className="checkbox_container">
        <Checkbox
          checked={isMarketingChecked}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setMarketingChecked(!isMarketingChecked);
          }}
        />
        <p>
          I'll like to receive marketing communication and business tips from
          Bumpa.
        </p>
      </div>
    </div>
  );
};
