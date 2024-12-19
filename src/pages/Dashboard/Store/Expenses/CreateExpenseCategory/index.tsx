import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import ValidatedTextArea from "components/forms/ValidatedTextArea";
import ValidatedInput from "components/forms/ValidatedInput";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
import { useCreateCategoryMutation } from "services";

type CategoryFeilds = {
  title: string;
  description: string;
};

export const CreateExpenseCategory = () => {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const methods = useForm<CategoryFeilds>({
    mode: "all",
  });
  const {
    formState: { isValid },
    handleSubmit,
    reset,
  } = methods;

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<CategoryFeilds> = async (data) => {
    try {
      const payload = {
        name: data.title,
        description: data.description,
      };

      let result = await createCategory(payload);
      if ("data" in result) {
        showToast("Category Created Successfully", "success");
        navigate("/dashboard/store/expenses");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="pd_create_store_information pd_createexpense">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form_section">
            <ModalHeader text="Create Expense Category" />

            <div className="form_field_container">
              <div className="order_details_container">
                <FormSectionHeader title="Expense Details" />
                <div className="px-[16px]">
                  <ValidatedInput
                    name="title"
                    label="Category Title"
                    placeholder="Enter Category Title"
                    type={"text"}
                  />

                  <ValidatedTextArea
                    name="description"
                    label="Category Description"
                    height="h-[120px]"
                    required={false}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="submit_form_section">
            {/* <Button className="discard">Unsaved</Button> */}
            <div></div>
            <div className="button_container">
              <Button
                onClick={() => {
                  reset();
                }}
                variant="contained"
                type="button"
                className="preview"
              >
                Discard
              </Button>

              <LoadingButton
                loading={isLoading}
                variant="contained"
                className="add"
                type="submit"
                disabled={!isValid}
              >
                Save{" "}
              </LoadingButton>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
