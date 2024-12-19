import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import ExcelFileInput from "components/forms/ExcelFileInput";
type importField = {
  file: File;
};
export const ImportCustomer = () => {
  const methods = useForm<importField>({
    mode: "all",
  });
  const {
    formState: { isValid },
    // handleSubmit,
    // setValue,
  } = methods;
  return (
    <div className="pd_import_products">
      <FormProvider {...methods}>
        <form>
          <div className="form_section">
            <ModalHeader text="Import your customers" />
            <div className="form_field_container">
              <ExcelFileInput
                name="file"
                label="Click here to select file or drag and drop file"
                labelText="Upload file"
                type="file"
                isExcel={true}
                accept="csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
            </div>
          </div>

          <div className="submit_form_section justify_end">
            <div className="button_container">
              <Button variant="contained" type="button" className="preview">
                Discard
              </Button>
              <LoadingButton
                loading={false}
                variant="contained"
                className="add"
                type="submit"
                disabled={!isValid}
              >
                Continue{" "}
              </LoadingButton>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
