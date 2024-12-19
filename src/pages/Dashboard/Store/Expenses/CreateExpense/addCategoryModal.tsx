import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import ValidatedInput from "components/forms/ValidatedInput";
import ValidatedTextArea from "components/forms/ValidatedTextArea";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useCreateCategoryMutation } from "services";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
import { LoadingButton } from "@mui/lab";


type AddCategoryModalProps = {
  openModal: boolean;
  closeModal: () => void;
};
type CategoryFeilds = {
  title: string;
  description: string;
};

export const AddCategoryModal = ({
  openModal,
  closeModal,
}: AddCategoryModalProps) => {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const methods = useForm<CategoryFeilds>({
    mode: "all",
  });

  const {
    formState: { isValid },
    handleSubmit,
  } = methods;

  const onSubmit: SubmitHandler<CategoryFeilds> = async (data) => {
    try {
      const payload = {
        name: data.title,
        description: data.description,
      };

      let result = await createCategory(payload);
      if ("data" in result) {
        showToast("Category Created Successfully", "success");
        closeModal();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <ModalRight
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal_right_children">
            <div className="top_section">
              <ModalRightTitle
                closeModal={() => {
                  closeModal();
                }}
                title="Create Category"
              />

              <div className="brief_form">
                <ValidatedInput name="title" label="Title" type={"text"} />

                <ValidatedTextArea
                  name="description"
                  label="Description"
                  height={"h-[120px]"}
                />
              </div>
            </div>

            <div className="bottom_section">
              <Button type="button" className="cancel" onClick={closeModal}>
                Cancel
              </Button>
              <LoadingButton type="submit" className="save" disabled={!isValid}>
                {!isLoading && "Continue"}
              </LoadingButton>
            </div>
          </div>
        </form>
      </FormProvider>
    </ModalRight>
  );
};
