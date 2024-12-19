import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import FileInput from "components/forms/FileInput";
import ValidatedTextArea from "components/forms/ValidatedTextArea";
import ValidatedInput, {
  removeFormattedNumerComma,
} from "components/forms/ValidatedInput";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useAppSelector } from "store/store.hooks";
import "./style.scss";
import { NairaIcon } from "assets/Icons/NairaIcon";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { AddExpenseModal } from "./addExpenseModal";
import { selectCategoryName, selectCategoryId } from "store/slice/Expense";
import { useCreateExpenseMutation } from "services";
import { getCurrencyFnc, handleError } from "utils";
import { showToast, useAppDispatch } from "store/store.hooks";
import { useNavigate } from "react-router-dom";
import { setCategoryId } from "store/slice/Expense";
import moment from "moment";

export type ExpenseFeilds = {
  amount: number | string;
  notes: string;
  date: string;
};

export const CreateExpense = () => {
  const [openModal, setOpenModal] = useState(false);
  const [imgObj, setImgObj] = useState<any>();
  const [imageFile, setImageFile] = useState<string>("");
  const [createExpense, { isLoading }] = useCreateExpenseMutation();
  const methods = useForm<ExpenseFeilds>({
    mode: "all",
  });
  const {
    formState: { isValid },
    handleSubmit,
    reset,
  } = methods;

  const selectedCategoryId = useAppSelector(selectCategoryId);
  const selectedCategoryName = useAppSelector(selectCategoryName);

  const navigate = useNavigate();
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
    try {
      const payload = {
        ...imgObj,
        notes: data.notes,
        amount: `${removeFormattedNumerComma(data.amount)}`,
        expense_category_id: parseInt(selectedCategoryId),
        expense_date: moment(data.date).format("DD/MM/YYYY"),
      };

      let result = await createExpense(payload);

      if ("data" in result) {
        showToast("Expense Created Successfully", "success");
        navigate("/dashboard/store/expenses");
        if (typeof _cio !== "undefined") {
          _cio.track("web_expenses_record", payload);
        }
        dispatch(setCategoryId(""));
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
            <ModalHeader text="Create Expense" />

            <div className="form_field_container">
              <div className="order_details_container">
                <FormSectionHeader title="Expense Image (Optional)" />
                <div className="px-[16px] file-container">
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
              </div>
              <div className="order_details_container">
                <FormSectionHeader title="Expense Details" />
                <div className="px-[16px]">
                  <div
                    onClick={() => {
                      setOpenModal(true);
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
                    placeholder="0.00"
                    formatValue={true}
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
            </div>
            <div className="button_container">
              <Button
                onClick={() => {
                  reset();
                  setImageFile("");
                }}
                variant="contained"
                type="button"
                className="preview"
              >
                Clear Fields
              </Button>

              <LoadingButton
                loading={isLoading}
                variant="contained"
                className="add"
                type="submit"
                disabled={!isValid || (!selectedCategoryId ? true : false)}
              >
                Save{" "}
              </LoadingButton>
            </div>
          </div>
        </form>
      </FormProvider>

      <AddExpenseModal
        openModal={openModal}
        closeModal={() => {
          setOpenModal(false);
        }}
      />
    </div>
  );
};
