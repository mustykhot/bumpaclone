import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import SelectField from "components/forms/SelectField";
import ValidatedInput, {
  removeFormattedNumerComma,
} from "components/forms/ValidatedInput";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { NairaIcon } from "assets/Icons/NairaIcon";
import { PercentIcon } from "assets/Icons/PercentIcon";
import { ProductSection } from "./ProductSection";
import { CollectionType } from "services/api.types";
import { useCreateCouponMutation } from "services";
import Loader from "components/Loader";
import { showToast, useAppSelector } from "store/store.hooks";
import { getCurrencyFnc, handleError } from "utils";
import {
  generateRandomCode,
  getObjWithValidValues,
} from "utils/constants/general";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { TagIcon } from "assets/Icons/TagIcon";
import { ShoppingCartIcon } from "assets/Icons/ShoppingCartIcon";
import { useState } from "react";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import { UpgradeModal } from "components/UpgradeModal";

const couponTypeList = [
  { name: "Shopping Cart", type: "cart", icon: <ShoppingCartIcon /> },
  { name: "Product(s)", type: "product", icon: <TagIcon /> },
];

export type CreateCouponFields = {
  name: string;
  type: string;
  code: string;
  max_percentage_amount?: number;
  amount: number;
  percentage: string;
  cart_type: string;
  cart_amount: number;
  cart_percentage: number;
  min_cart_value: number;
  max_cart_percentage_amount: number;
  productIdList: string[];
  productList: any[];
  variationList: any[];
  variationIdList: string[];
  collectionIdList: string[];
  collectionList: CollectionType[];
  usage_per_customer: string;
  total_usage: string;
  min_cart_count: string;
  start_date: string;
  end_date: string;
  minimum_value?: number;
  max_uses?: number;
  max_per_customer?: number;
  all?: boolean;
};

const CreateCoupon = () => {
  const methods = useForm<CreateCouponFields>({
    mode: "all",
  });
  const {
    formState: { isValid },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = methods;
  const [createCoupon, { isLoading }] = useCreateCouponMutation();
  const [couponType, setCouponType] = useState("cart");
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const navigate = useNavigate();
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);

  const onSubmit: SubmitHandler<CreateCouponFields> = async (data) => {
    const hasMaxPerCustomerOrUses = data.max_per_customer || data.max_uses;

    if (
      (isSubscriptionExpired ||
        isSubscriptionType === "free" ||
        isSubscriptionType === "starter") &&
      hasMaxPerCustomerOrUses
    ) {
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
    } else {
      const payload = {
        description: data.name,
        code: data.code,
        type: data.type,
        value: removeFormattedNumerComma(data.amount) as number,
        minimum_value: removeFormattedNumerComma(
          data.minimum_value || 0
        ) as number,
        valid_from: data.start_date,
        valid_till: data.end_date,
        products: data.all
          ? undefined
          : data.productIdList
          ? data.productIdList
          : undefined,
        product_variations: data.all
          ? undefined
          : data.variationIdList
          ? data.variationIdList
          : undefined,
        class:
          (data.productIdList && data.productIdList?.length) ||
          (data.variationIdList && data.variationIdList?.length) ||
          (data.collectionIdList && data.collectionIdList?.length)
            ? "item"
            : "cart",
        collections: data.collectionIdList ? data.collectionIdList : undefined,
        max_discount: removeFormattedNumerComma(data.max_percentage_amount),
        max_per_customer: data?.max_per_customer,
        max_uses: data?.max_uses,
        all: data?.all || false,
      };
      try {
        let result = await createCoupon(getObjWithValidValues(payload));
        if ("data" in result) {
          showToast("Created successfully", "success");
          navigate("/dashboard/discounts?tab=coupons");

          if (typeof _cio !== "undefined") {
            _cio.track("web_coupon_add", payload);
          }
          if (typeof mixpanel !== "undefined") {
            mixpanel.track("web_coupon_add", payload);
          }
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="pd_create_discount">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form_section">
            <ModalHeader text="Create Coupon" />

            <div className="form_field_container">
              <div className="order_details_container">
                <div className="type_container">
                  <label className="add_label">Select Coupon Type</label>
                  <div className="select_type">
                    {couponTypeList.map((item) => {
                      return (
                        <Button
                          startIcon={item.icon}
                          variant="contained"
                          key={item.type}
                          onClick={() => {
                            setCouponType(item.type);
                          }}
                          className={` ${
                            couponType === item.type ? "active" : ""
                          }`}
                        >
                          {item.name}
                        </Button>
                      );
                    })}
                  </div>
                  <div className="info_flex">
                    <InfoCircleIcon stroke="#9BA2AC" />
                    <p>
                      {couponType === "product"
                        ? "Coupon will only be applied to the products selected when customers shop on your website"
                        : "Coupon will be applied to the entire cart on checkout"}
                    </p>
                  </div>
                </div>

                <div className="discount_sections">
                  <FormSectionHeader title="Coupon Details" />
                  <div className="px-[16px]">
                    <div className="form-group-flex ">
                      <ValidatedInput
                        name="name"
                        placeholder="Enter coupon name e.g Black Friday Sale"
                        label="Coupon Description"
                        type={"text"}
                      />
                      <ValidatedInput
                        name="code"
                        placeholder="Enter coupon code"
                        label="Coupon Code"
                        type={"text"}
                        extralabel={
                          <Button
                            onClick={() => {
                              let randomcode = generateRandomCode();
                              setValue("code", randomcode);
                            }}
                            sx={{ height: "24px" }}
                          >
                            Generate code
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="discount_sections">
                  <FormSectionHeader title="Coupon Type" />
                  <div className="px-[16px]">
                    <div className="form-group-autoflex ">
                      <SelectField
                        name="type"
                        selectOption={[
                          {
                            value: "fixed",
                            key: "Fixed Coupon",
                            icon: (
                              <p className="text-[#222D37] font-semibold text-[20px]">
                                {getCurrencyFnc()}
                              </p>
                            ),
                          },
                          {
                            value: "percentage",
                            key: "Percentage Coupon",
                            icon: <PercentIcon />,
                          },
                          // {
                          //   value: "cart",
                          //   key: "Cart Coupon",
                          //   icon: <CartIcon />,
                          // },
                        ]}
                        label="Select coupon type"
                      />
                      {(watch("type") === "fixed" ||
                        watch("type") === "percentage") && (
                        <ValidatedInput
                          name="amount"
                          label={
                            watch("type") === "fixed"
                              ? "Amount"
                              : "Percentage discount"
                          }
                          type={"number"}
                          formatValue={watch("type") === "fixed" ? true : false}
                          prefix={
                            watch("type") === "fixed" ? (
                              <p className="text-[#222D37] font-semibold text-[20px]">
                                {getCurrencyFnc()}
                              </p>
                            ) : (
                              <PercentIcon />
                            )
                          }
                        />
                      )}
                    </div>
                    <div className="form-group-autoflex ">
                      {watch("type") === "percentage" && (
                        <ValidatedInput
                          name="max_percentage_amount"
                          label="Maximum coupon discount amount"
                          required={false}
                          formatValue={true}
                          type={"number"}
                          prefix={
                            <p className="text-[#222D37] font-semibold text-[20px]">
                              {getCurrencyFnc()}
                            </p>
                          }
                          extraindicator="The highest discount a customer user can get"
                        />
                      )}
                      {(watch("type") === "percentage" ||
                        watch("type") === "fixed") && (
                        <ValidatedInput
                          name="minimum_value"
                          label="Minimum cart value"
                          required={false}
                          formatValue={true}
                          type={"number"}
                          prefix={
                            <p className="text-[#222D37] font-semibold text-[20px]">
                              {getCurrencyFnc()}
                            </p>
                          }
                          extraindicator="The minimum cart value"
                        />
                      )}
                    </div>
                    <div className="form-group-autoflex mt-2">
                      <ValidatedInput
                        name="max_per_customer"
                        label="Number of use per customer"
                        required={false}
                        formatValue={true}
                        type={"number"}
                        extraindicator="The total number of times a customer can use this coupon"
                      />
                      <ValidatedInput
                        name="max_uses"
                        label="Set Maximum Coupon Usage"
                        required={false}
                        formatValue={true}
                        type={"number"}
                        extraindicator="Set a maximum number of coupon usage"
                      />
                    </div>

                    {watch("type") === "cart" && (
                      <div className="form-group-autoflex ">
                        <SelectField
                          name="cart_type"
                          selectOption={[
                            {
                              value: "fixed",
                              key: "Fixed Cart Discount",
                              icon: (
                                <p className="text-[#222D37] font-semibold text-[20px]">
                                  {getCurrencyFnc()}
                                </p>
                              ),
                            },
                            {
                              value: "percent",
                              key: "Percentage Cart Discount",
                              icon: <PercentIcon />,
                            },
                          ]}
                          label="Select cart discount type"
                        />

                        {watch("cart_type") === "fixed" && (
                          <ValidatedInput
                            name="cart_amount"
                            label="Amount"
                            type={"number"}
                            prefix={
                              <p className="text-[#222D37] font-semibold text-[20px]">
                                {getCurrencyFnc()}
                              </p>
                            }
                          />
                        )}

                        {watch("cart_type") === "percent" && (
                          <ValidatedInput
                            name="cart_percentage"
                            label="Percentage discount"
                            type={"number"}
                            prefix={<PercentIcon />}
                          />
                        )}
                      </div>
                    )}
                    {watch("type") === "cart" && (
                      <div className="form-group-autoflex ">
                        <ValidatedInput
                          name="min_cart_value"
                          label="Minimum cart value"
                          required={false}
                          type={"number"}
                          prefix={
                            <p className="text-[#222D37] font-semibold text-[20px]">
                              {getCurrencyFnc()}
                            </p>
                          }
                          extraindicator="Coupon applies to orders above cart value"
                        />
                        {watch("cart_type") === "percent" && (
                          <ValidatedInput
                            name="max_cart_percentage_amount"
                            label="Maximum discount"
                            required={false}
                            type={"number"}
                            prefix={
                              <p className="text-[#222D37] font-semibold text-[20px]">
                                {getCurrencyFnc()}
                              </p>
                            }
                            extraindicator="The highest discount a customer user can gete"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {(watch("type") === "percentage" ||
                  watch("type") === "fixed") &&
                  couponType === "product" && (
                    <div className="discount_sections">
                      <FormSectionHeader title="Select Products / Collections" />
                      <ProductSection />
                    </div>
                  )}
                {(watch("type") === "percentage" ||
                  watch("type") === "fixed") && (
                  <div className="discount_sections">
                    <FormSectionHeader title="Coupon Vadility" />
                    <div className="px-[16px]">
                      <div className="form-group-flex">
                        <ValidatedInput
                          name="start_date"
                          label="Start Date"
                          defaultValue={moment().format("YYYY-MM-DDTHH:mm")}
                          type={"datetime-local"}
                        />
                        <ValidatedInput
                          name="end_date"
                          label="End Date"
                          type={"datetime-local"}
                          min={
                            watch("start_date")
                              ? moment(watch("start_date")).format(
                                  "YYYY-MM-DDTHH:mm"
                                )
                              : ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="submit_form_section">
            {/* <Button className="discard hidden">Discard</Button> */}
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
                onClick={() => {
                  reset();
                }}
                variant="contained"
                type="button"
                // disabled={!isValid}
                className="preview"
              >
                Clear Fields
              </Button>

              <LoadingButton
                loading={false}
                variant="contained"
                className="add"
                type="submit"
                disabled={!isValid}
              >
                Create Coupon
              </LoadingButton>
            </div>
          </div>
        </form>
      </FormProvider>
      {openUpgradeModal && (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => setOpenUpgradeModal(false)}
          pro={isProUpgrade}
          title={`Customize coupon usage on your website`}
          subtitle={`Choose how many times a customer can use one coupon & how many customers can use a particular coupon.`}
          proFeatures={[
            "Set one time use coupons",
            "Set limit for number of customers that can use a coupon",
            "Get one location website to run sales",
            "Send up to 500 invoices/receipts to customers monthly",
          ]}
          growthFeatures={[
            "Set one time use coupons",
            "Set limit for number of customers that can use a coupon",
            "Get 2 in 1 multiple location website",
            "Send unlimited invoices/receipts to customers",
          ]}
          eventName="coupon"
        />
      )}
    </div>
  );
};

export default CreateCoupon;
