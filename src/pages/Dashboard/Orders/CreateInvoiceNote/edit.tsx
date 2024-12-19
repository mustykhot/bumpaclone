import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import { LoadingButton } from "@mui/lab";
import { UpgradeModal } from "components/UpgradeModal";
import TextEditor from "components/forms/TextEditor";
import Loader from "components/Loader";
import ValidatedInput from "components/forms/ValidatedInput";
import { InvoiceNoteFields } from ".";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { useEditNoteMutation, useGetSingleNoteQuery } from "services";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import { getObjWithValidValues } from "utils/constants/general";
import "./style.scss";
import { GrowthModal } from "components/GrowthModal";

const EditInvoiceNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const [openGrowthModal, setOpenGrowthModal] = useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const methods = useForm<InvoiceNoteFields>({
    mode: "all",
  });
  const { data, isLoading, isError, error } = useGetSingleNoteQuery(id);

  const [editNote, { isLoading: loadEdit }] = useEditNoteMutation();
  const onSubmit: SubmitHandler<InvoiceNoteFields> = async (data) => {
    if (isSubscriptionExpired || isSubscriptionType !== "growth") {
      setOpenGrowthModal(true);
    } else {
      let payload = {
        content: data.content,
        title: data.title,
      };

      try {
        let result = await editNote(
          getObjWithValidValues({ id, body: payload })
        );
        if ("data" in result) {
          showToast("Edited successfully", "success");
          navigate("/dashboard/orders");
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
    setValue,
    reset,
  } = methods;

  useEffect(() => {
    if (data) {
      setValue("content", data?.note?.content);
      setValue("title", data?.note?.title);
    }
  }, [data]);

  return (
    <div className="pd_create_note">
      {(isLoading || loadEdit) && <Loader />}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form_section">
            <ModalHeader text="Edit Invoice Note" />

            <div className="form_field_container">
              <div className="order_details_container">
                <div className="px-[16px]">
                  <div className="">
                    <ValidatedInput
                      name="title"
                      label="Title"
                      type={"text"}
                      placeholder="Enter title"
                    />
                    <TextEditor label="Shipping Description" name="content" />{" "}
                  </div>
                </div>
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
            </div>{" "}
            <div className="button_container">
              <LoadingButton
                loading={false}
                variant="contained"
                className="add"
                type="submit"
              >
                Save
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

export default EditInvoiceNote;
