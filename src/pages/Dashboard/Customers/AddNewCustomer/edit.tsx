import { useCallback, useRef } from "react";
import { debounce } from "lodash";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import "./style.scss";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import ValidatedInput from "components/forms/ValidatedInput";
import TextEditor from "components/forms/TextEditor";
import SelectField from "components/forms/SelectField";
import { Checkbox } from "@mui/material";
import { QuickCreateGroupModal } from "./QuickCreateGroup";
import {
  useEditCustomerMutation,
  useGetCountriesQuery,
  useGetCustomerGroupsQuery,
  useGetSingleCustomerQuery,
  useGetStatesQuery,
} from "services";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import MultipleSelectField from "components/forms/MultipleSelectField";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMsg from "components/ErrorMsg";
import Loader from "components/Loader";
import AutoCompleteField from "components/forms/AutoComplete";
import { getObjWithValidValues } from "utils/constants/general";
import { selectUserLocation } from "store/slice/AuthSlice";
import CustomerDetails from "pages/Dashboard/Pos/posComponents/widget/CustomerDetails";
import { useValidateField } from "utils/validateFields";

export type AddNewCustomerFields = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  handle?: string;
  notes?: string;
  billing_address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: number;
  };
  shipping_address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: number;
  };

  groups?: string[];
};
export const EditCustomer = () => {
  const methods = useForm<AddNewCustomerFields>({
    mode: "all",
  });
  const {
    // formState: { isValid },
    watch,
    setValue,
    handleSubmit,
    reset,
  } = methods;
  const { id } = useParams();
  const [openGroup, setOpenGroup] = useState(false);
  const [editCustomer, { isLoading: isEditing }] = useEditCustomerMutation();
  const [dryRunEditCustomer, { isLoading }] = useEditCustomerMutation();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryBilling, setSelectedCountryBilling] = useState("");
  const [isShipping, setIsShipping] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [runError, setRunError] = useState(false);
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { data: countries, isLoading: loadCountries } = useGetCountriesQuery();
  const userLocation = useAppSelector(selectUserLocation);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const validateField = useValidateField();

  const { data: states, isLoading: loadStates } = useGetStatesQuery(
    selectedCountry,
    {
      skip: selectedCountry ? false : true,
    }
  );
  const { data: statesBilling, isLoading: loadStatesBilling } =
    useGetStatesQuery(selectedCountryBilling, {
      skip: selectedCountryBilling ? false : true,
    });

  const { data: groups } = useGetCustomerGroupsQuery({
    search: "",
  });
  const {
    data: singleCustomer,
    isLoading: loadSingleCustomer,
    isError,
  } = useGetSingleCustomerQuery({ id: id, location_id: userLocation?.id });

  useEffect(() => {
    if (isShipping) {
      setSelectedCountryBilling(selectedCountry);
      setValue("billing_address.city", watch("shipping_address.city"));
      setValue("billing_address.country", watch("shipping_address.country"));
      setValue("billing_address.state", watch("shipping_address.state"));
      setValue("billing_address.zip", watch("shipping_address.zip"));
      setValue("billing_address.street", watch("shipping_address.street"));
    }

    // eslint-disable-next-line
  }, [isShipping]);

  useEffect(() => {
    if (singleCustomer) {
    }
  });

  const validateFieldOnSet = async (id: any) => {
    try {
      setIsValidating(true);
      const email = singleCustomer && singleCustomer.customer.email;
      const phone = singleCustomer && singleCustomer.customer.phone;

      const response = await dryRunEditCustomer({
        body: { email, phone },
        id: id,
        dryRun: true,
      }).unwrap();

      setPhoneError(undefined);
      setEmailError(undefined);
      setRunError(false);
    } catch (error: any) {
      setPhoneError(error.data.errors.phone);
      setEmailError(error.data.errors.email);
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    if (singleCustomer && singleCustomer.customer) {
      validateFieldOnSet(singleCustomer.customer.id);
    }
  }, [singleCustomer]);

  const onSubmit: SubmitHandler<AddNewCustomerFields> = async (data) => {
    let payload = {
      name: `${data.first_name} ${data.last_name}`,
      phone: data.phone,
      email: data.email,
      handle: data.handle,
      notes: data.notes,
      groups: data.groups,
      addresses: [
        {
          ...data.billing_address,
          type: "BILLING",
          default: 0,
          last_name: data.last_name,
          first_name: data.first_name,
          phone: data.phone,
        },
        {
          ...data.shipping_address,
          type: "SHIPPING",
          default: 1,
          last_name: data.last_name,
          first_name: data.first_name,
          phone: data.phone,
        },
      ],
    };

    try {
      let result = await editCustomer({
        body: getObjWithValidValues(payload),
        id,
        dryRun: false,
      });
      if ("data" in result) {
        showToast("Edited successfully", "success");
        navigate(-1);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (singleCustomer) {
      setValue("first_name", singleCustomer.customer.first_name);
      setValue("last_name", singleCustomer.customer.last_name);
      setValue("phone", singleCustomer.customer.phone);
      setValue("email", singleCustomer.customer.email);
      setValue("handle", singleCustomer.customer.handle);
      setValue("notes", singleCustomer.customer.notes);
      setValue(
        "billing_address.city",
        singleCustomer.customer.billing_address.city
      );
      setValue(
        "billing_address.country",
        singleCustomer.customer.billing_address.country
      );

      setSelectedCountryBilling(
        singleCustomer.customer.billing_address.country
      );
      setValue(
        "billing_address.state",
        singleCustomer.customer.billing_address.state
      );
      setValue(
        "billing_address.zip",
        Number(singleCustomer.customer.billing_address.zip)
      );
      setValue(
        "billing_address.street",
        singleCustomer.customer.billing_address.street
      );
      setValue(
        "shipping_address.city",
        singleCustomer.customer.shipping_address.city
      );
      setValue(
        "shipping_address.country",
        singleCustomer.customer.shipping_address.country
      );
      setSelectedCountry(singleCustomer.customer.shipping_address.country);

      setValue(
        "shipping_address.state",
        singleCustomer.customer.shipping_address.state
      );
      setValue(
        "shipping_address.zip",
        Number(singleCustomer.customer.shipping_address.zip)
      );
      setValue(
        "shipping_address.street",
        singleCustomer.customer.shipping_address.street
      );

      const groupIds = singleCustomer.groups.map((item) => `${item.id}`);
      setValue("groups", groupIds);
    }

    // eslint-disable-next-line
  }, [singleCustomer]);

  const handleInputs = async (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    let { name, value } = e.target;
    if (name === "phone" || name === "email") {
      await validateField(
        name,
        value,
        id,
        dryRunEditCustomer,
        [name],
        setEmailError,
        setPhoneError
      );
    }
    if (name === "phone") {
      setPhone(value);
    } else if (name === "email") {
      setEmail(value);
    }
  };

  if (isError) {
    return <ErrorMsg error={"Something went wrong"} />;
  }
  if (loadSingleCustomer) {
    return <Loader />;
  }

  return (
    <div className="pd_add_new_customer">
      {isEditing && !isValidating && <Loader />}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form_section">
            <div className="left_section">
              <ModalHeader
                text="Edit customer"
                // button={
                //   <Button variant="outlined" startIcon={<DownloadIcon />}>
                //     Import Contacts
                //   </Button>
                // }
              />

              <div className="details_box">
                <Accordion expanded={true} className="accordion">
                  <AccordionSummary
                    expandIcon={<ChevronDownIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className="accordion_summary"
                  >
                    <p>Customer Details</p>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="">
                      <div className="form-group-flex">
                        <ValidatedInput
                          name="first_name"
                          placeholder="Raji "
                          label="First Name"
                          type={"text"}
                        />
                        <ValidatedInput
                          name="last_name"
                          placeholder=" Mustapha"
                          label="Last Name"
                          type={"text"}
                        />
                      </div>
                      <ValidatedInput
                        name="phone"
                        placeholder="Enter phone number"
                        label="Phone Number"
                        type={"number"}
                        onChange={(e) => {
                          handleInputs(e);
                        }}
                        extraError={phoneError}
                        extraClass={phoneError && "errorbg"}
                      />

                      <ValidatedInput
                        name="email"
                        placeholder="Enter email address"
                        label="Email Address"
                        type="email"
                        required={false}
                        onChange={(e) => {
                          handleInputs(e);
                        }}
                        extraError={emailError}
                        extraClass={emailError && "errorbg"}
                      />

                      <ValidatedInput
                        name="handle"
                        label="Instagram Handle"
                        type={"text"}
                        prefix={"@"}
                        required={false}
                      />
                      <TextEditor
                        name="notes"
                        required={false}
                        label="Additional Information"
                      />
                      <MultipleSelectField
                        name="groups"
                        extraLabel={
                          <Button
                            startIcon={<PlusIcon />}
                            onClick={() => {
                              setOpenGroup(true);
                            }}
                          >
                            New Group
                          </Button>
                        }
                        selectOption={
                          groups
                            ? groups.groups?.length
                              ? groups.groups?.map((item) => {
                                  return {
                                    key: item.name,
                                    value: `${item.id}`,
                                  };
                                })
                              : []
                            : []
                        }
                        required={false}
                        label="Select Customer Group"
                      />
                    </div>
                  </AccordionDetails>
                </Accordion>

                <Accordion expanded={true} className="accordion">
                  <AccordionSummary
                    expandIcon={<ChevronDownIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className="accordion_summary"
                  >
                    <p>Shipping Details</p>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="">
                      <ValidatedInput
                        name="shipping_address.street"
                        placeholder="Raji "
                        label="Shipping Address"
                        type={"text"}
                        required={false}
                      />
                      <div className="form-group-flex">
                        {/* <SelectField
                          name="shipping_address.country"
                          isLoading={loadCountries}
                          defaultValue="Nigeria"
                          required={false}
                          selectOption={
                            countries && countries.length
                              ? countries.map((item) => {
                                  return { key: item.name, value: item.name };
                                })
                              : []
                          }
                          handleCustomChange={(val) => {
                            setSelectedCountry(val);
                          }}
                          label="Country"
                        /> */}
                        <AutoCompleteField
                          isLoading={loadCountries}
                          name="shipping_address.country"
                          label="Country"
                          required={false}
                          selectOption={
                            countries && countries.length
                              ? [
                                  { label: "Nigeria", value: "Nigeria" },
                                  ...countries.map((item) => {
                                    return {
                                      label: item.name,
                                      value: item.name,
                                    };
                                  }),
                                ]
                              : []
                          }
                          handleCustomChange={(val) => {
                            setSelectedCountry(val.value);
                          }}
                        />
                        <SelectField
                          name="shipping_address.state"
                          required={false}
                          isLoading={loadStates}
                          selectOption={
                            states && states.length
                              ? states.map((item) => {
                                  return { key: item, value: item };
                                })
                              : []
                          }
                          label="State"
                        />
                      </div>
                      <div className="form-group-flex">
                        <ValidatedInput
                          name="shipping_address.city"
                          placeholder="Enter City"
                          label="City"
                          required={false}
                          type={"text"}
                        />
                        <ValidatedInput
                          name="shipping_address.zip"
                          placeholder="Enter Zip Code"
                          label="Zip Code"
                          type={"number"}
                          required={false}
                        />
                      </div>

                      <div className="billing_address">
                        <div className="add_label">Billing Address</div>
                        <div className="check_box">
                          <Checkbox
                            checked={isShipping}
                            onChange={() => {
                              setIsShipping(!isShipping);
                            }}
                          />{" "}
                          <p>Same as shipping address</p>
                        </div>
                        <ValidatedInput
                          name="billing_address.street"
                          placeholder="Address"
                          required={false}
                        />
                      </div>

                      <div className="form-group-flex">
                        {/* <SelectField
                          name="billing_address.country"
                          isLoading={loadCountries}
                          defaultValue="Nigeria"
                          selectOption={
                            countries && countries.length
                              ? countries.map((item) => {
                                  return { key: item.name, value: item.name };
                                })
                              : []
                          }
                          required={false}
                          handleCustomChange={(val) => {
                            setSelectedCountryBilling(val);
                          }}
                          label="Country"
                        /> */}
                        <AutoCompleteField
                          isLoading={loadCountries}
                          name="billing_address.country"
                          label="Country"
                          required={false}
                          selectOption={
                            countries && countries.length
                              ? [
                                  { label: "Nigeria", value: "Nigeria" },
                                  ...countries.map((item) => {
                                    return {
                                      label: item.name,
                                      value: item.name,
                                    };
                                  }),
                                ]
                              : []
                          }
                          handleCustomChange={(val) => {
                            setSelectedCountryBilling(val.value);
                          }}
                        />
                        <SelectField
                          name="billing_address.state"
                          isLoading={loadStatesBilling}
                          required={false}
                          selectOption={
                            statesBilling && statesBilling.length
                              ? statesBilling.map((item) => {
                                  return { key: item, value: item };
                                })
                              : []
                          }
                          label="State"
                        />
                      </div>
                      <div className="form-group-flex">
                        <ValidatedInput
                          name="billing_address.city"
                          placeholder="Enter City"
                          required={false}
                          label="City"
                          type={"text"}
                        />{" "}
                        <ValidatedInput
                          name="billing_address.zip"
                          placeholder="Enter Zip Code"
                          label="Zip Code"
                          required={false}
                          type={"number"}
                        />
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
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
                variant="contained"
                type="button"
                onClick={() => {
                  reset();
                }}
                className="preview"
              >
                Clear Fields
              </Button>

              <LoadingButton
                loading={isEditing && !isValidating}
                variant="contained"
                className="add"
                type="submit"
              >
                Save Changes
              </LoadingButton>
            </div>
          </div>
        </form>
      </FormProvider>
      <QuickCreateGroupModal
        openModal={openGroup}
        closeModal={() => {
          setOpenGroup(false);
        }}
      />
    </div>
  );
};
