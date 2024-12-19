import { useEffect } from "react";
import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { NairaIcon } from "assets/Icons/NairaIcon";
import { useState } from "react";
import ValidatedTextArea from "components/forms/ValidatedTextArea";
import { ExpenseFeilds } from "../CreateExpense";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import FileInput from "components/forms/FileInput";
import ValidatedInput, {
  formatNumberWithCommas,
  removeFormattedNumerComma,
} from "components/forms/ValidatedInput";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { IExpense } from "Models/store";
import { selectCategoryId } from "store/slice/Expense";
import { useAppSelector } from "store/store.hooks";
import { useUpdateExpenseMutation } from "services";
import { getCurrencyFnc, handleError } from "utils";
import { showToast, useAppDispatch } from "store/store.hooks";
import { LoadingButton } from "@mui/lab";
import { setCategoryId, selectCategoryName } from "store/slice/Expense";
import { AddExpenseModal } from "../CreateExpense/addExpenseModal";
import moment from "moment";
import { IMAGEURL } from "utils/constants/general";

type ViewExpenseModalProps = {
  openModal: boolean;
  closeModal: () => void;
  expenseDetails: IExpense;
};

export const ViewExpenseModal = ({
  openModal,
  closeModal,
  expenseDetails,
}: ViewExpenseModalProps) => {
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [updateExpense, { isLoading }] = useUpdateExpenseMutation();
  const [imgObj, setImgObj] = useState<any>();
  const [imageFile, setImageFile] = useState<string>("");

  const methods = useForm<ExpenseFeilds>({
    mode: "all",
    reValidateMode: "onChange",
  });
  const {
    formState: { isValid },
    handleSubmit,
    setValue,
  } = methods;

  const selectedCategoryId = useAppSelector(selectCategoryId);
  const selectedCategoryName = useAppSelector(selectCategoryName);
  const dispatch = useAppDispatch();

  const uploadPayload = (val: any) => {
    const payload = {
      attachment_receipt: JSON.stringify({
        name: val?.name,
        data: val?.image,
      }),
    };
    setImgObj(payload as any);
  };

  const onSubmit: SubmitHandler<ExpenseFeilds> = async (data) => {
    const payload = {
      ...imgObj,
      notes: data.notes,
      amount: `${removeFormattedNumerComma(data.amount)}`,
      expense_category_id: parseInt(selectedCategoryId),

      expense_date: moment(data.date).format("DD/MM/YYYY"),
    };

    const id = expenseDetails.id;
    try {
      let result = await updateExpense({ payload, id });
      if ("data" in result) {
        showToast("Expenses Updated Successfully", "success");
        closeModal();
        dispatch(setCategoryId(""));
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (Object.keys(expenseDetails).length > 0) {
      setValue(
        "amount",
        formatNumberWithCommas(
          parseFloat(String(expenseDetails?.amount || 0)?.replace(/,/g, ""))
        ),
        {
          shouldValidate: true,
        }
      );
      setValue(
        "date",
        moment(expenseDetails?.formattedExpenseDate).format("YYYY-MM-DD"),
        { shouldValidate: true }
      );
      setValue("notes", expenseDetails?.notes, { shouldValidate: true });
      setImageFile(`${expenseDetails?.receipt_url}` as string);
      dispatch(setCategoryId(expenseDetails?.category?.id as string));
    }
    // eslint-disable-next-line
  }, [expenseDetails, openModal]);

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
                  title="Edit Expense"
                />

                <div className="pd_expense_edit">
                  <div className="px-[16px] file-container edit-file">
                    {!imageFile ? (
                      <FileInput
                        name="logo"
                        labelText="Upload Expense Image (Optional)"
                        required={false}
                        uploadPayload={uploadPayload}
                        type="img"
                        addCrop={false}
                        getFile={(val) => setImageFile(val)}
                      />
                    ) : (
                      <div className="thumbnail_box">
                        <img src={imageFile} alt="Receipt" />
                        <div className="change_thumbnail">
                          <label htmlFor="category_image">
                            Change Image
                            <input
                              onChange={(e) => {
                                let file = e.target.files && e.target?.files[0];
                                const reader = new FileReader();
                                if (file) {
                                  reader.readAsDataURL(file);
                                  reader.addEventListener("load", async () => {
                                    setImageFile(`${reader?.result}`);
                                    uploadPayload({
                                      name: file?.name || "",
                                      image: `${reader?.result}`,
                                    });
                                  });
                                }
                              }}
                              name="category_image"
                              id="category_image"
                              hidden
                              type="file"
                              accept="image/png, image/gif, image/jpeg"
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    onClick={() => {
                      setOpenCategoryModal(true);
                    }}
                    className="pick_category"
                  >
                    <label>Expense Category</label>
                    <div>
                      <p>
                        {selectedCategoryId
                          ? selectedCategoryName
                          : "Select expense category"}
                      </p>
                      <ChevronDownIcon />
                    </div>
                  </div>
                  <ValidatedInput
                    name="amount"
                    label="Expense Amount"
                    prefix={
                      <p className="text-[#9BA2AC] font-semibold text-[20px]">
                        {getCurrencyFnc()}
                      </p>
                    }
                    formatValue={true}
                    placeholder="0.00"
                    type={"number"}
                  />

                  <ValidatedInput
                    name="date"
                    label="Date"
                    placeholder="Enter Date"
                    type={"date"}
                  />

                  <ValidatedTextArea
                    name="notes"
                    label="Additional Notes"
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
                    type="submit"
                    loading={isLoading}
                    className="save"
                    disabled={
                      !isValid ||
                      (!selectedCategoryId ? true : false) ||
                      isLoading
                    }
                  >
                    Continue{" "}
                  </LoadingButton>
                </>
              </div>
            </div>{" "}
          </form>
        </FormProvider>
      </ModalRight>

      <AddExpenseModal
        openModal={openCategoryModal}
        closeModal={() => {
          setOpenCategoryModal(false);
        }}
      />
    </>
  );
};
