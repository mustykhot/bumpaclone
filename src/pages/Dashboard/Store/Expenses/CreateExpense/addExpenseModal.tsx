import { useState, useEffect } from "react";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import Button from "@mui/material/Button/Button";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { AddCategoryModal } from "./addCategoryModal";
import { useGetCategoriesQuery } from "services";
import { useAppDispatch } from "store/store.hooks";
import { useAppSelector } from "store/store.hooks";
import {
  selectCategoryId,
  setCategoryId,
  setCategoryName,
} from "store/slice/Expense";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import RadioInputs from "components/forms/RadioInputs";
import { ICategory } from "Models/store";
import { setAllCategories } from "store/slice/Expense";

type AddExpenseModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export type CategoryFeilds = {
  categoryId: "";
};

type OptionsType = {
  label: string;
  value: string;
};

export const AddExpenseModal = ({
  openModal,
  closeModal,
}: AddExpenseModalProps) => {
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [options, setOptions] = useState<OptionsType[]>([]);

  const { data } = useGetCategoriesQuery({ search: "" });

  const methods = useForm<CategoryFeilds>({
    mode: "all",
  });

  const {
    formState: { isValid },
    handleSubmit,
  } = methods;

  const dispatch = useAppDispatch();
  const selectedCategoryId = useAppSelector(selectCategoryId);

  useEffect(() => {
    if (data) {
      const newOptionsArray: OptionsType[] = [];
      data.categories.forEach((item: ICategory, i: number) => {
        newOptionsArray.push({ label: item.name, value: item.id as string });
      });
      setOptions(newOptionsArray);
    }
  }, [data]);

  useEffect(() => {
    dispatch(setCategoryName());
    // eslint-disable-next-line
  }, [selectedCategoryId]);

  useEffect(() => {
    if (data) {
      dispatch(setAllCategories(data?.categories));
    }
    // eslint-disable-next-line
  }, [data]);

  const onSubmit: SubmitHandler<CategoryFeilds> = async (data) => {
    dispatch(setCategoryId(data.categoryId));
    closeModal();
  };

  return (
    <>
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
                  title="Expense Categories"
                  extraChild={
                    <Button
                      onClick={() => {
                        setOpenCategoryModal(true);
                      }}
                      variant="outlined"
                      startIcon={<PlusIcon stroke="#009444" />}
                    >
                      New Category
                    </Button>
                  }
                />
                <div className="pd_select_category">
                  <div className="category_list">
                    <RadioInputs
                      className="category_radio"
                      options={options}
                      name="categoryId"
                      defaultValue={
                        selectedCategoryId && selectedCategoryId.toString()
                      }
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="bottom_section">
                <Button type="button" className="cancel" onClick={closeModal}>
                  Cancel
                </Button>
                <Button disabled={!isValid} type="submit" className="save">
                  Continue
                </Button>
              </div>{" "}
            </div>
          </form>
        </FormProvider>
      </ModalRight>

      <AddCategoryModal
        openModal={openCategoryModal}
        closeModal={() => {
          setOpenCategoryModal(false);
        }}
      />
    </>
  );
};
