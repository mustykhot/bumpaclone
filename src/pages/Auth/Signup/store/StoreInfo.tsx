import { Button } from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import ValidatedInput from "components/forms/ValidatedInput";
import { SectionTitle } from "../widget/SectionTitle";

type StoreInfoProps = { display: string };

const staffList = [
  {
    text: "None",
    value: "0",
  },
  {
    text: "1 - 2",
    value: "1-2",
  },
  {
    text: "3 - 5",
    value: "3-5",
  },
  {
    text: "6+",
    value: "6+",
  },
];

const ordersList = [
  {
    text: "0 - 10",
    value: "0-10",
  },
  {
    text: "11 - 50",
    value: "11-50",
  },
  {
    text: "51 - 100",
    value: "51-100",
  },
  {
    text: "101 - 500",
    value: "101-500",
  },
  {
    text: "501+",
    value: "501+",
  },
];

const physicalStoresList = [
  {
    text: "None",
    value: "0",
  },
  {
    text: "1",
    value: "1",
  },
  {
    text: "2",
    value: "2",
  },
  {
    text: "3",
    value: "3",
  },
  {
    text: "4",
    value: "4",
  },
  {
    text: "5+",
    value: "5+",
  },
];

export const StoreInfo = ({ display }: StoreInfoProps) => {
  const { setValue, watch, clearErrors, trigger } = useFormContext();
  const domain = watch("domain");
  const store_name = watch("store_name");
  const ordersCount = watch("ordersCount");
  const staffCount = watch("staffCount");
  const physicalStoreCount = watch("physicalStoreCount");

  useEffect(() => {
    if (store_name !== undefined && store_name !== null) {
      const sanitizedStoreName = store_name.replace(/\s+/g, "");
      setValue("domain", sanitizedStoreName);
      clearErrors("domain");
      if(store_name) {
        trigger("domain");
      }
    }
  }, [store_name, setValue, clearErrors, trigger]);

  return (
    <div className={`${display} pd_formsection pd_storeInfoSection`}>
      <SectionTitle
        title="You’re almost done!"
        description="Tell us a little bit about your business."
      />
      <ValidatedInput
        name="store_name"
        placeholder="Enter business name"
        label="Business Name"
        type={"text"}
        extraClass={"extraInfo"}
      />
      <ValidatedInput
        name="domain"
        placeholder="Enter business domain"
        label="Store URL"
        type={"text"}
        extraClass={"no_padding extraInfo"}
        suffix={<p className="url_suffix">.bumpa.shop</p>}
        rules={{
          pattern: {
            value: /^[a-zA-Z0-9-]+$/,
            message:
              "The domain may only contain letters, numbers, and dashes.",
          },
        }}
        domainInfo={
          <>
            You can upgrade your website domain to <span>.com</span>,{" "}
            <span>.com.ng</span> or any domain of your choice later.
          </>
        }
      />
      <div className="ask_about_staff">
        <p>
          How many orders do you get weekly?{" "}
          <span className="text-error">*</span>
        </p>
        <div className="button_container">
          {ordersList.map((item, i) => {
            return (
              <Button
                key={i}
                onClick={() => {
                  setValue("ordersCount", item.value);
                }}
                className={`${ordersCount === item.value ? "active" : ""}`}
              >
                {item.text}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="ask_about_staff">
        <p>
          How many staff do you have? <span className="text-error">*</span>
        </p>
        <div className="button_container">
          {staffList.map((item, i) => {
            return (
              <Button
                key={i}
                onClick={() => {
                  setValue("staffCount", item.value);
                }}
                className={`${staffCount === item.value ? "active" : ""}`}
              >
                {item.text}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="ask_about_staff">
        <p>
          How many physical stores do you have?{" "}
          <span className="text-error">*</span>
        </p>
        <div className="button_container">
          {physicalStoresList.map((item, i) => {
            return (
              <Button
                key={i}
                onClick={() => {
                  setValue("physicalStoreCount", item.value);
                }}
                className={`${
                  physicalStoreCount === item.value ? "active" : ""
                }`}
              >
                {item.text}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
