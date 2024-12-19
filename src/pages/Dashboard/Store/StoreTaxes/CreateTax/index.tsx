import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import Button from "@mui/material/Button";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import "./style.scss";
import ValidatedInput from "components/forms/ValidatedInput";
import ValidatedTextArea from "components/forms/ValidatedTextArea";
import { LoadingButton } from "@mui/lab";
import { PercentageIcon } from "../../../../../assets/Icons/PercentageIcon";
import { useNavigate } from "react-router-dom";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
import { useCreateTaxMutation } from "services";
import { useState } from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

export type CreateTaxFeilds = {
  name: string;
  percent: number;
  description: string;
  flags?: {
    pos_apply: boolean;
    storefront_apply: boolean;
  };
};

const CreateTax = () => {
  const navigate = useNavigate();
  const methods = useForm<CreateTaxFeilds>({
    mode: "all",
  });
  const [createTax, { isLoading }] = useCreateTaxMutation();
  const [isWebCheckout, setIsWebCheckout] = useState(false);
  const [isPosCheckout, setIsPosCheckout] = useState(false);

  const onSubmit: SubmitHandler<CreateTaxFeilds> = async (data) => {
    const payload = {
      ...data,
      flags: {
        pos_apply: isPosCheckout,
        storefront_apply: isWebCheckout,
      },
    };
    try {
      let result = await createTax(payload);
      if ("data" in result) {
        showToast("Created successfully", "success");
        navigate(-1);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const {
    formState: { isValid },
    handleSubmit,
    reset,
  } = methods;

  return (
    <div className="pd_create_tax">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form_section">
            <ModalHeader text="Create Tax" />

            <div className="form_field_container">
              <div className="order_details_container">
                <FormSectionHeader title="Tax Details" />
                <div className="px-[16px]">
                  <div className="">
                    <ValidatedInput
                      name="name"
                      label="Tax Name"
                      type={"text"}
                      placeholder="Enter name"
                      containerClass="pd-tax-input"
                    />
                    <ValidatedTextArea
                      name="description"
                      label="Tax Description"
                      height="h-[120px]"
                      required={false}
                    />
                    <ValidatedInput
                      type={"text"}
                      name="percent"
                      label="Percentage discount"
                      placeholder="0.00"
                      prefix={<PercentageIcon />}
                      containerClass="pd-tax-input"
                    />

                    <div className="web-checkout">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isWebCheckout}
                              onChange={() => {
                                setIsWebCheckout(!isWebCheckout);
                              }}
                            />
                          }
                          label="Apply this tax to cart at website checkout"
                          labelPlacement="end"
                        />
                      </FormGroup>
                    </div>
                    <div className="web-checkout">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isPosCheckout}
                              onChange={() => {
                                setIsPosCheckout(!isPosCheckout);
                              }}
                            />
                          }
                          label="Apply this tax to cart at POS checkout"
                          labelPlacement="end"
                        />
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="submit_form_section">
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
                Create Tax
              </LoadingButton>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateTax;
