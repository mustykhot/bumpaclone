import SelectField from "components/forms/SelectField";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import "./style.scss";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { Download02Icon } from "assets/Icons/Download02Icon";
import ExcelFileInput from "components/forms/ExcelFileInput";
type importField = {
  file: File;
  import: string;
};
export const ImportProducts = () => {
  const methods = useForm<importField>({
    mode: "all",
  });
  const {
    formState: { isValid },
    // handleSubmit,
    // setValue,
    watch,
  } = methods;
  return (
    <div className="pd_import_products">
      <FormProvider {...methods}>
        <form>
          <div className="form_section">
            <ModalHeader text="Import your products" />
            <div className="form_field_container">
              {/* <SelectField
                name="import"
                selectOption={[
                  {
                    value: "CSV",
                    key: "csv",
                  },
                ]}
                label="Where are you importing your products from?"
                placeholder="Select product import source"
              /> */}

              <ExcelFileInput
                name="file"
                label="Click here to select file"
                labelText="Upload file"
                type="file"
                isExcel={true}
                accept="csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
              <Button
                className="download mt-3 flex"
                startIcon={<Download02Icon />}
              >
                Download Sample
              </Button>
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
