import "./style.scss";
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
import { useCreateDiscountMutation } from "services";
import { showToast } from "store/store.hooks";
import { getCurrencyFnc, handleError } from "utils";
import Loader from "components/Loader";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getObjWithValidValues } from "utils/constants/general";

export type CreateDiscountFields = {
  name: string;
  type: string;
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
  start_date: string;
  end_date: string;
  all?: boolean;
};

const CreateDiscount = () => {
  const navigate = useNavigate();
  const methods = useForm<CreateDiscountFields>({
    mode: "all",
  });
  const {
    formState: { isValid },
    handleSubmit,
    watch,
    reset,
  } = methods;
  const [createDiscount, { isLoading }] = useCreateDiscountMutation();
  const onSubmit: SubmitHandler<CreateDiscountFields> = async (data) => {
    const payload = {
      description: data.name,
      type: data.type,
      all: data.all || false,
      value: removeFormattedNumerComma(data.amount || 0) as number,
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
      collections: data.all
        ? undefined
        : data.collectionIdList
        ? data.collectionIdList
        : undefined,
      max_discount: removeFormattedNumerComma(data.max_percentage_amount),
    };

    try {
      let result = await createDiscount(getObjWithValidValues(payload));
      if ("data" in result) {
        showToast("Created successfully", "success");
        navigate("/dashboard/discounts");
        if (typeof _cio !== "undefined") {
          _cio.track("web_discount_add", payload);
        }

        if (typeof mixpanel !== "undefined") {
          mixpanel.track("web_discount_add", payload);
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="pd_create_discount">
      {isLoading && <Loader />}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form_section">
            <ModalHeader text="Create Discount" />

            <div className="form_field_container">
              <div className="order_details_container">
                <div className="discount_sections">
                  <FormSectionHeader title="Discount Details" />
                  <div className="px-[16px]">
                    <ValidatedInput
                      name="name"
                      placeholder="Enter discount name e.g September Discount"
                      label="Discount Name"
                      type={"text"}
                      required={false}
                    />
                  </div>
                </div>
                <div className="discount_sections">
                  <FormSectionHeader title="Discount Type" />
                  <div className="px-[16px]">
                    <div className="form-group-autoflex ">
                      <SelectField
                        name="type"
                        selectOption={[
                          {
                            value: "fixed",
                            key: "Fixed Discount",
                            icon: (
                              <p className="text-[#222D37] text-[20px]">
                                {getCurrencyFnc()}
                              </p>
                            ),
                          },
                          {
                            value: "percentage",
                            key: "Percentage Discount",
                            icon: <PercentIcon />,
                          },
                        ]}
                        label="Select discount type"
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
                              <p className="text-[#222D37] text-[20px]">
                                {getCurrencyFnc()}
                              </p>
                            ) : (
                              <PercentIcon />
                            )
                          }
                        />
                      )}
                    </div>
                    {watch("type") === "percentage" && (
                      <ValidatedInput
                        name="max_percentage_amount"
                        label="Maximum discount"
                        required={false}
                        formatValue={true}
                        type={"number"}
                        prefix={
                          <p className="text-[#222D37] text-[20px]">
                            {getCurrencyFnc()}
                          </p>
                        }
                        extraindicator="The total amount of discount will not exceed this
                        value"
                      />
                    )}
                    {watch("type") === "cart" && (
                      <div className="form-group-autoflex ">
                        <SelectField
                          name="cart_type"
                          selectOption={[
                            {
                              value: "fixed",
                              key: "Fixed Cart Discount",
                              icon: (
                                <p className="text-[#222D37] text-[20px]">
                                  {getCurrencyFnc()}
                                </p>
                              ),
                            },
                            {
                              value: "percentage",
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
                              <p className="text-[#222D37] text-[20px]">
                                {getCurrencyFnc()}
                              </p>
                            }
                          />
                        )}

                        {watch("cart_type") === "percentage" && (
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
                            <p className="text-[#222D37] text-[20px]">
                              {getCurrencyFnc()}
                            </p>
                          }
                          extraindicator="Coupon applies to orders above cart value"
                        />
                        {watch("cart_type") === "percentage" && (
                          <ValidatedInput
                            name="max_cart_percentage_amount"
                            label="Maximum discount"
                            required={false}
                            type={"number"}
                            prefix={
                              <p className="text-[#222D37] text-[20px]">
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
                  watch("type") === "fixed") && (
                  <div className="discount_sections">
                    <FormSectionHeader title="Select Products / Collections" />
                    <ProductSection />
                  </div>
                )}
                {(watch("type") === "percentage" ||
                  watch("type") === "fixed") && (
                  <div className="discount_sections">
                    <FormSectionHeader title="Discount Validity" />
                    <div className="px-[16px]">
                      <div className="form-group-flex">
                        <ValidatedInput
                          name="start_date"
                          label="Start Date"
                          type={"datetime-local"}
                          defaultValue={moment().format("YYYY-MM-DDTHH:mm")}
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
            {/* <Button className="discard">Discard</Button> */}
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
                loading={isLoading}
                variant="contained"
                className="add"
                type="submit"
                disabled={!isValid}
              >
                Save
              </LoadingButton>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateDiscount;
