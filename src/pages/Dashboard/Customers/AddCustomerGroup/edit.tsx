import { Button } from "@mui/material";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import "./style.scss";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import ValidatedInput from "components/forms/ValidatedInput";
import { LoadingButton } from "@mui/lab";
import MultipleSelectField from "components/forms/MultipleSelectField";
import {
  useEditCustomerGroupMutation,
  useGetCustomersQuery,
  useGetSingleCustomerGroupQuery,
} from "services";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
import { useNavigate, useParams } from "react-router-dom";
import { CustomerGroupFields } from ".";
import { useEffect, useState } from "react";
import Loader from "components/Loader";
import ErrorMsg from "components/ErrorMsg";
import { SelectCustomerModal } from "./SelectCustomer";

export const EditCustomerGroup = () => {
  const { id } = useParams();
  const methods = useForm<CustomerGroupFields>({
    mode: "all",
  });
  const { setValue, reset, watch } = methods;
  const {
    data,
    isLoading: loadSingleGroup,
    isError,
  } = useGetSingleCustomerGroupQuery({
    id: id,
    limit: 25,
    page: 1,
    search: "",
  });

  const [openCustomer, setOpenCustomer] = useState(false);
  const [editGroup, { isLoading }] = useEditCustomerGroupMutation();
  const navigate = useNavigate();
  const {
    formState: { isValid },
    handleSubmit,
  } = methods;

  useEffect(() => {
    if (data) {
      setValue("name", data.group.name);
      // @ts-ignore
      const idList = data.group.customers.data.map((item) => {
        return { id: `${item.id}`, name: item.name };
      });
      setValue("customers", idList);
    }
    // eslint-disable-next-line
  }, [data]);

  const onSubmit: SubmitHandler<CustomerGroupFields> = async (data) => {
    let payload = {
      name: data.name,
      customers: data.customers?.map((item) => `${item.id}`),
    };
    try {
      let result = await editGroup({ body: payload, id: id });
      if ("data" in result) {
        showToast("Edited successfully", "success");
        navigate(-1);
        if (typeof _cio !== "undefined") {
          _cio.track("web_customer_group", payload);
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  if (isError) {
    return <ErrorMsg error={"Something went wrong"} />;
  }
  if (loadSingleGroup) {
    return <Loader />;
  }
  return (
    <div className="pd_send_campaign pd_new_customer_group">
      {isLoading && <Loader />}

      <FormProvider {...methods}>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="form_section">
            <ModalHeader text="Edit customer group" />
            <div className="form_field_container">
              <div className="image_field_container">
                <Accordion expanded={true} className="accordion">
                  <AccordionSummary
                    expandIcon={<ChevronDownIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className="accordion_summary"
                  >
                    <p>Customer Group Details</p>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ValidatedInput
                      name="name"
                      placeholder="Enter Name"
                      label="Group name"
                      type={"text"}
                    />

                    {/* <MultipleSelectField
                      name="customers"
                      required={false}
                      selectOption={
                        customers
                          ? customers.customers?.data.length
                            ? customers.customers?.data.map((item) => {
                                return { key: item.name, value: `${item.id}` };
                              })
                            : []
                          : []
                      }
                      label="Select Customers"
                    /> */}
                    <div className="cover_customer_select">
                      <div
                        onClick={() => {
                          setOpenCustomer(true);
                        }}
                        className="pick_cutomer"
                      >
                        <label>Select Customers</label>
                        <div>
                          <p>
                            {watch("customers") && watch("customers")?.length
                              ? watch("customers")
                                  ?.map((customer) => customer.name)
                                  .join(", ")
                              : "Select customers"}
                          </p>
                          <ChevronDownIcon />
                        </div>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>
          </div>

          <div className="submit_form_section">
            {/* <Button className="discard">Unsaved</Button> */}
            <div></div>{" "}
            <div className="button_container">
              <Button
                variant="contained"
                type="button"
                // disabled={!isValid}
                className="preview"
                onClick={() => {
                  reset();
                }}
              >
                Discard
              </Button>

              <LoadingButton
                loading={false}
                variant="contained"
                className="add"
                type="submit"
              >
                Save Changes
              </LoadingButton>
            </div>
          </div>
          <SelectCustomerModal
            openModal={openCustomer}
            closeModal={() => {
              setOpenCustomer(false);
            }}
          />
        </form>
      </FormProvider>
    </div>
  );
};
