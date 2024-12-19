import { Button } from "@mui/material";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import "./style.scss";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import ValidatedInput from "components/forms/ValidatedInput";
import { LoadingButton } from "@mui/lab";
import MultipleSelectField from "components/forms/MultipleSelectField";
import {
  useAllAnalyticsSummaryQuery,
  useCreateCustomerGroupMutation,
  useGetCustomersQuery,
} from "services";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "components/Loader";
import { SelectCustomerModal, SelectedType } from "./SelectCustomer";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import { UpgradeModal } from "components/UpgradeModal";
import { GrowthModal } from "components/GrowthModal";
export type CustomerGroupFields = {
  name: string;
  customers?: SelectedType[];
};

export type CustomerGroupSubmitFields = {
  name?: string;
  customers?: string[];
};

export const AddCustomerGroup = () => {
  const methods = useForm<CustomerGroupFields>({
    mode: "all",
  });
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const listId = JSON.parse(searchParams.get("list") || "[]");
  const [openCustomer, setOpenCustomer] = useState(false);
  const [totalCustomerGroupCount, setTotalCustomerGroupCount] = useState(0);
  const [isStarterUpgrade, setIsStarterUpgrade] = useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [openGrowthModal, setOpenGrowthModal] = useState(false);
  const [isCustomUpgrade, setIsCustomUpgrade] = useState(false);

  const [createGroup, { isLoading }] = useCreateCustomerGroupMutation();
  const { data: analytics, isLoading: analyticsLoading } =
    useAllAnalyticsSummaryQuery({ type: "customers" });
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);

  const {
    formState: { isValid },
    handleSubmit,
    setValue,
    reset,
    watch,
  } = methods;

  const limits = {
    free: { current: 0, next: 5 },
    starter: { current: 5, next: 20 },
    pro: { current: 20, next: 100 },
    growth: { current: 100 },
  };

  const isUnderLimit = (subscriptionType: string, count: number) => {
    switch (subscriptionType) {
      case "free":
        return count < limits.free.current;
      case "starter":
        return count < limits.starter.current;
      case "pro":
        return count < limits.pro.current;
      case "trial":
        return count < limits.growth.current;
      case "growth":
        return count < limits.growth.current;
      default:
        return false;
    }
  };

  const handleLimitExceeded = (subscriptionType: string) => {
    switch (subscriptionType) {
      case "free":
        setIsStarterUpgrade(true);
        break;
      case "starter":
        setIsProUpgrade(true);
        break;
      case "pro":
        setOpenGrowthModal(true);
        break;
      case "trial":
        setIsCustomUpgrade(true);
        setOpenGrowthModal(true);
        break;
      case "growth":
        setIsCustomUpgrade(true);
        setOpenGrowthModal(true);
        break;
      default:
        break;
    }
    setOpenUpgradeModal(true);
  };

  const onSubmit: SubmitHandler<CustomerGroupFields> = async (data) => {
    if (
      isSubscriptionExpired &&
      totalCustomerGroupCount >= limits.free.current
    ) {
      handleLimitExceeded("free");
      return;
    }

    if (!isUnderLimit(isSubscriptionType, totalCustomerGroupCount)) {
      handleLimitExceeded(isSubscriptionType);
      return;
    }

    const payload = {
      name: data.name,
      customers: data.customers?.map((item) => `${item.id}`),
    };

    try {
      const result = await createGroup(payload);
      if ("data" in result) {
        showToast("Created successfully", "success");
        navigate(-1);
        if (typeof _cio !== "undefined") {
          _cio.track("web_customer_group", payload);
        }
        if (typeof mixpanel !== "undefined") {
          mixpanel.track("web_customer_group", payload);
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (analytics && analytics[1] && analytics[1]?.value) {
      setTotalCustomerGroupCount(Number(analytics[1]?.value));
    }
  }, [analytics]);

  useEffect(() => {
    if (listId && listId?.length) {
      // const list = listId.map((item: any) => `${item}`);
      setValue("customers", listId);
    }

    // eslint-disable-next-line
  }, []);

  return (
    <div className="pd_send_campaign pd_new_customer_group">
      {isLoading && <Loader />}
      <FormProvider {...methods}>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="form_section">
            <ModalHeader text="Create customer group" />
            <div className="form_field_container">
              <div className="image_field_container">
                <Accordion expanded={true} className="accordion">
                  <AccordionSummary
                    expandIcon={<ChevronDownIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className="accordion_summary"
                  >
                    <p>Customer Group Details</p>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ValidatedInput
                      name="name"
                      placeholder="Enter Name"
                      label="Group name"
                      type={"text"}
                    />
                    {/* <ValidatedTextArea
                      name="description"
                      label="Group Description"
                      height="h-[120px]"
                    /> */}
                    {/* <MultipleSelectField
                      name="customers"
                      required={false}
                      selectOption={
                        customers
                          ? customers.customers?.data.length
                            ? customers.customers?.data.map((item) => {
                                return { key: item.name, value: `${item.id}` };
                              })
                            : []
                          : []
                      }
                      label="Select Customers"
                    /> */}

                    <div className="cover_customer_select">
                      <div
                        onClick={() => {
                          setOpenCustomer(true);
                        }}
                        className="pick_cutomer"
                      >
                        <label>Select Customers</label>
                        <div>
                          <p>
                            {watch("customers") && watch("customers")?.length
                              ? watch("customers")
                                  ?.map((customer) => customer.name)
                                  .join(", ")
                              : "Select customers"}
                          </p>
                          <ChevronDownIcon />
                        </div>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>
          </div>

          <div className="submit_form_section">
            {/* <Button className="discard">Unsaved</Button> */}
            <div className="button_container2">
              <Button
                onClick={() => {
                  reset();
                  navigate(-1);
                }}
                className="discard"
              >
                Cancel
              </Button>
            </div>
            <div className="button_container">
              <Button
                variant="contained"
                type="button"
                className="preview"
                onClick={() => {
                  reset();
                }}
              >
                Clear Fields
              </Button>

              <LoadingButton
                loading={false}
                variant="contained"
                className="add"
                type="submit"
              >
                Create Group{" "}
              </LoadingButton>
            </div>
          </div>
          <SelectCustomerModal
            openModal={openCustomer}
            closeModal={() => {
              setOpenCustomer(false);
            }}
          />
          {openUpgradeModal && (
            <UpgradeModal
              openModal={openUpgradeModal}
              closeModal={() => setOpenUpgradeModal(false)}
              starter={isStarterUpgrade}
              pro={isProUpgrade}
              title={`Unlock Customer Groups on a Bumpa Plan`}
              subtitle={`Expand your marketing with more Customer Groups`}
              starterFeatures={[
                "Create up to 5 customer groups",
                "Get 100 messaging credits monthly",
                "No Instagram DM connection",
                "Discounts & coupons can be used multiple times",
              ]}
              proFeatures={[
                "Create up to 20 Customer Groups",
                "Get 200 messaging credits monthly",
                "Receive Instagram DMs on Bumpa",
                "Discounts can be used multiple times by the same customer",
              ]}
              growthFeatures={[
                "Create up to 100 Customer Groups",
                "Get 1000 messaging credits monthly",
                "Receive Instagram DMs on Bumpa",
                "Create one-use discounts for new & loyal customers",
              ]}
              eventName="customer-group"
            />
          )}
          {openGrowthModal && (
            <GrowthModal
              openModal={openGrowthModal}
              closeModal={() => {
                setOpenGrowthModal(false);
              }}
              title={`Create more Customer Groups with a ${
                isCustomUpgrade ? "Custom" : "Growth"
              } Plan`}
              subtitle={`Expand your marketing with more Customer Groups`}
              moreCustomerGroups={isCustomUpgrade}
              growthFeatures={[
                "Create more customer groups to properly segment your customers.",
                "Send more bulk SMS/ Emails to your customers.",
                "Aim for better conversions with campaigns sent based on customer behavior.",
              ]}
              buttonText={`${
                isCustomUpgrade
                  ? "Get More Customer Groups"
                  : "Upgrade to Growth"
              }`}
              eventName="customer-group"
            />
          )}
        </form>
      </FormProvider>
    </div>
  );
};
