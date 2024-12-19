import ModalRight from "components/ModalRight";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "./style.scss";
import ValidatedInput from "components/forms/ValidatedInput";
import ValidatedTextArea from "components/forms/ValidatedTextArea";
import { PercentageIcon } from "assets/Icons/PercentageIcon";
import { ShippingType, TaxType } from "services/api.types";
import { useEffect, useState } from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { Button, CircularProgress } from "@mui/material";
import { useEditTaxMutation } from "services";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
interface IProp {
  setShowModal: () => void;
  showModal: boolean;
  taxToView: TaxType | null;
}

export type EditTaxFeilds = {
  name?: string;
  percent?: number;
  description?: string;
  flags?: {
    pos_apply: boolean;
    storefront_apply: boolean;
  };
};

const EditTaxModal = ({ setShowModal, showModal, taxToView }: IProp) => {
  const [isWebCheckout, setIsWebCheckout] = useState(false);
  const [isPosCheckout, setIsPosCheckout] = useState(false);
  const methods = useForm<EditTaxFeilds>({
    mode: "all",
  });
  const [editTax, { isLoading }] = useEditTaxMutation();

  const onSubmit: SubmitHandler<EditTaxFeilds> = async (data) => {
    const payload = {
      ...data,
      flags: {
        pos_apply: isPosCheckout,
        storefront_apply: isWebCheckout,
      },
    };
    try {
      let result = await editTax({
        body: payload,
        id: `${taxToView?.id}`,
      });
      if ("data" in result) {
        showToast("Created successfully", "success");
        setShowModal();
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
    setValue,
  } = methods;

  useEffect(() => {
    if (taxToView) {
      setValue("name", taxToView.name);
      setValue("percent", taxToView.percent);
      setValue("description", taxToView.description);
      setIsPosCheckout(taxToView?.flags?.pos_apply || false);
      setIsWebCheckout(taxToView?.flags?.storefront_apply || false);
    }
  }, [taxToView]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="edit-modal">
        <ModalRight closeModal={setShowModal} openModal={showModal}>
          <div className="modal_right_children">
            <div className="top_section">
              <ModalRightTitle
                className="edit-modal__right-title"
                closeModal={setShowModal}
                title="Edit Tax Details"
              />

              <div className="edit-modal__container">
                <div className="">
                  <ValidatedInput
                    name="name"
                    label="Tax Name"
                    type={"text"}
                    required={false}
                    placeholder="Enter Name"
                    containerClass="pd-shipping-input"
                  />

                  <ValidatedInput
                    type={"text"}
                    name="percent"
                    label="Percentage"
                    placeholder="0.00"
                    required={false}
                    prefix={<PercentageIcon />}
                    containerClass="pd-shipping-input"
                  />

                  <ValidatedTextArea
                    name="description"
                    required={false}
                    label="Tax Description"
                    extraClass="pd-shipping-input"
                    height="h-[120px]"
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

            <div className="bottom_section ">
              <Button className="cancel" onClick={setShowModal}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                {isLoading ? (
                  <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </ModalRight>
      </form>
    </FormProvider>
  );
};

export default EditTaxModal;
