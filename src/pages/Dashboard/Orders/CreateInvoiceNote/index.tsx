import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import { LoadingButton } from "@mui/lab";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import TextEditor from "components/forms/TextEditor";
import Loader from "components/Loader";
import ValidatedInput from "components/forms/ValidatedInput";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { useCreateNoteMutation } from "services";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import { getObjWithValidValues } from "utils/constants/general";
import "./style.scss";
import { GrowthModal } from "components/GrowthModal";

export type InvoiceNoteFields = {
  title: string;
  content: string;
  active?: boolean;
};
const CreateInvoiceNote = () => {
  const navigate = useNavigate();
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const [active, setActive] = useState(false);
  const [openGrowthModal, setOpenGrowthModal] = useState(false);
  const methods = useForm<InvoiceNoteFields>({
    mode: "all",
  });

  const [createNote, { isLoading }] = useCreateNoteMutation();

  const onSubmit: SubmitHandler<InvoiceNoteFields> = async (data) => {
    if (isSubscriptionExpired || isSubscriptionType !== "growth") {
      setOpenGrowthModal(true);
    } else {
      let payload = {
        content: data.content,
        title: data.title,
        active: active,
      };

      try {
        let result = await createNote(getObjWithValidValues(payload));
        if ("data" in result) {
          showToast("Created successfully", "success");
          navigate(-1);
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  const {
    formState: { isValid },
    handleSubmit,
    reset,
  } = methods;

  return (
    <div className="pd_create_note">
      {isLoading && <Loader />}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form_section">
            <ModalHeader text="Add a Note on your invoice" />

            <div className="form_field_container">
              <div className="order_details_container">
                <div className="info-section px-[16px]">
                  <InfoCircleIcon />
                  <p>
                    This is the general note that’ll be displayed on all of your
                    invoices. You can add multiple notes but can only use one at
                    a time.
                  </p>
                </div>
                <div className="px-[16px]">
                  <div className="">
                    <ValidatedInput
                      name="title"
                      label="Title"
                      type={"text"}
                      placeholder="Enter title"
                    />
                    <TextEditor label="Shipping Description" name="content" />
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
            </div>{" "}
            <div className="button_container">
              <Button
                onClick={() => {
                  setActive(false);
                }}
                variant="contained"
                type="submit"
                disabled={!isValid}
                className="preview"
              >
                Save
              </Button>

              <LoadingButton
                loading={false}
                variant="contained"
                className="add"
                type="submit"
                onClick={() => {
                  setActive(true);
                }}
                disabled={!isValid}
              >
                Save and Activate
              </LoadingButton>
            </div>
          </div>
        </form>
      </FormProvider>

      <GrowthModal
        openModal={openGrowthModal}
        closeModal={() => {
          setOpenGrowthModal(false);
        }}
        title={`Improve Your Invoicing with Custom Notes`}
        subtitle={`Ideal for large businesses needing personalised communication on invoices.`}
        growthFeatures={[
          "Custom Messages: Add custom notes to your invoices for clear and effective communication with your customers.",
          "Flexible Note Management: Create and manage various notes for different needs, easily selecting the right note for each invoice.",
          "Improved Process: Simplify your invoicing and increase customer satisfaction with custom messaging.",
        ]}
        buttonText={`Upgrade to Growth`}
        eventName="invoice"
      />
    </div>
  );
};

export default CreateInvoiceNote;
