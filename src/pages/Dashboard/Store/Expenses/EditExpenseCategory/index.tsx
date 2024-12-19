import { useEffect } from "react";
import Button from "@mui/material/Button";
import { LoadingButton } from "@mui/lab";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import ValidatedInput from "components/forms/ValidatedInput";
import ValidatedTextArea from "components/forms/ValidatedTextArea";
import { ICategory } from "Models/store";
import { useUpdateCategoryMutation } from "services";
import { handleError } from "utils";
import { showToast } from "store/store.hooks";

type ViewCategoryModalProps = {
  openModal: boolean;
  closeModal: () => void;
  categoryDetails: ICategory;
};

type CategoryFeilds = {
  title: string;
  description: string;
};

export const EditExpenseCategoryModal = ({
  openModal,
  closeModal,
  categoryDetails,
}: ViewCategoryModalProps) => {
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();
  const methods = useForm<CategoryFeilds>({
    mode: "all",
  });
  const {
    formState: { isValid },
    handleSubmit,
    setValue,
  } = methods;

  const onSubmit: SubmitHandler<CategoryFeilds> = async (data) => {
    const payload = {
      name: data.title,
      description: data.description,
    };

    const id = categoryDetails.id;
    try {
      let result = await updateCategory({ payload, id });
      if ("data" in result) {
        showToast("Category Updated Successfully", "success");
        closeModal();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    setValue("title", categoryDetails?.name);
    setValue("description", categoryDetails?.description);
    // eslint-disable-next-line
  }, [categoryDetails, openModal]);

  return (
    <ModalRight
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal_right_children pd_edit_category">
            <div className="top_section">
              <ModalRightTitle
                closeModal={() => {
                  closeModal();
                }}
                title="Edit Category"
              />

              <div className="brief_form">
                <ValidatedInput
                  name="title"
                  label="Category Title"
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

            <div className="bottom_section">
              <>
                <Button type="button" className="cancel" onClick={closeModal}>
                  Cancel
                </Button>
                <LoadingButton
                  loading={isLoading}
                  type="submit"
                  className="save"
                  disabled={!isValid}
                >
                  {!isLoading && "Save"}
                </LoadingButton>
              </>
            </div>
          </div>{" "}
        </form>
      </FormProvider>
    </ModalRight>
  );
};
