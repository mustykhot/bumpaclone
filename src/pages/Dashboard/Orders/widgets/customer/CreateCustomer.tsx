import { useCallback } from "react";
import { debounce } from "lodash";
import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { useEffect, useState } from "react";
import InputField from "components/forms/InputField";
import TextAreaField from "components/forms/TextAreaField";
import {
  useCreateCustomerMutation,
  useGetCountriesQuery,
  useGetStatesQuery,
  useGetSingleCustomerQuery,
  useEditCustomerMutation,
} from "services";
import NormalSelectField from "components/forms/NormalSelectField";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import { CircularProgress } from "@mui/material";
import { getObjWithValidValues } from "utils/constants/general";
import { selectUserLocation } from "store/slice/AuthSlice";
import { useValidateField } from "utils/validateFields";

type TaxModalProps = {
  openModal: boolean;
  closeModal: () => void;
  id?: string;
  isEdit?: boolean;
  refetch?: any;
};

export const CreateCustomerModal = ({
  openModal,
  closeModal,
  id,
  isEdit,
  refetch,
}: TaxModalProps) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    handle: "",
    notes: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });

  const [selectedCountry, setSelectedCountry] = useState("");
  const { data: countries, isLoading: loadCountries } = useGetCountriesQuery();
  const { data: states, isLoading: loadStates } = useGetStatesQuery(
    selectedCountry,
    { skip: selectedCountry ? false : true }
  );
  const userLocation = useAppSelector(selectUserLocation);
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();
  const [editCustomer, { isLoading: isEditing }] = useEditCustomerMutation();
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [isValidating, setIsValidating] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const validateField = useValidateField();

  const [dryRunEditCustomer, { isLoading: isdryRunning }] =
    useEditCustomerMutation();
  const [dryRunCreateCustomer, { isLoading: isLoadingDryRunCreate }] =
    useCreateCustomerMutation();

  const {
    data: singleCustomer,
    isLoading: loadSingleCustomer,
    isError,
  } = useGetSingleCustomerQuery(
    { id: id, location_id: userLocation?.id },
    { skip: !isEdit } // Skip the query when isEdit is false
  );

  // this validates on set
  const validateFieldOnSet = async (id: any) => {
    try {
      const email = singleCustomer && singleCustomer.customer.email;
      const phone = singleCustomer && singleCustomer.customer.phone;

      const response = await dryRunEditCustomer({
        body: { email, phone },
        id: id,
        dryRun: true,
      }).unwrap();

      setPhoneError(undefined);
      setEmailError(undefined);
    } catch (err: any) {
      setPhoneError(err.data.errors.phone);
      setEmailError(err.data.errors.email);
    } finally {
    }
  };
  useEffect(() => {
    if (isEdit && singleCustomer) {
      validateFieldOnSet(singleCustomer.customer.id);
    }
  }, [singleCustomer, isEdit]);

  const handleInputs = async (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "phone" || name === "email") {
      await validateField(
        name,
        value,
        isEdit ? id : undefined,
        isEdit ? dryRunEditCustomer : dryRunCreateCustomer,
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

  useEffect(() => {
    if (singleCustomer?.customer) {
      setFormData({
        first_name: singleCustomer.customer.first_name || "",
        last_name: singleCustomer.customer.last_name || "",
        phone: singleCustomer.customer.phone || "",
        email: singleCustomer.customer.email || "",
        handle: singleCustomer.customer.handle || "",
        notes: singleCustomer.customer.notes || "",
        street: singleCustomer.customer?.address?.street || "",
        city: singleCustomer.customer?.address?.city || "",
        state: singleCustomer.customer?.address?.state || "",
        country: singleCustomer.customer?.address?.country || "",
        zip: singleCustomer.customer?.address?.zip?.toString() || "",
      });
    }
  }, [singleCustomer]);

  const onSubmit = async () => {
    const payload = {
      name: `${formData.first_name} ${formData.last_name}`,
      phone: formData.phone,
      email: formData.email,
      handle: formData.handle,
      notes: formData.notes,
      groups: [],
      addresses: [
        {
          type: "SHIPPING",
          default: 0,
          last_name: formData.last_name,
          first_name: formData.first_name,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zip: Number(formData.zip),
        },
        {
          type: "BILLING",
          default: 1,
          last_name: formData.last_name,
          first_name: formData.first_name,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zip: Number(formData.zip),
        },
      ],
    };

    let editPayload = {
      name: `${formData.first_name} ${formData.last_name}`,
      phone: formData.phone,
      email: formData.email,
      handle: formData.handle,
      notes: formData.notes,

      addresses: [
        {
          type: "SHIPPING",
          default: 0,
          last_name: formData.last_name,
          first_name: formData.first_name,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zip: Number(formData.zip),
        },
        {
          type: "BILLING",
          default: 0,
          last_name: formData.last_name,
          first_name: formData.first_name,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zip: Number(formData.zip),
        },
      ],
    };

    try {
      const finalPayload = isEdit ? editPayload : payload;

      let result;

      if (isEdit) {
        result = await editCustomer({
          body: getObjWithValidValues(editPayload),
          id,
          dryRun: false,
        });
      } else {
        result = await createCustomer({
          body: getObjWithValidValues(payload),
          dryRun: false,
        });
      }

      if ("data" in result) {
        refetch && refetch();
        showToast(
          isEdit ? "Updated successfully" : "Created successfully",
          "success"
        );

        setFormData({
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
          handle: "",
          notes: "",
          street: "",
          city: "",
          state: "",
          country: "",
          zip: "",
        });
        closeModal();

        if (typeof _cio !== "undefined") {
          _cio.track(
            isEdit ? "web_customer_edit" : "web_customer_add",
            finalPayload
          );
        }

        if (typeof mixpanel !== "undefined") {
          mixpanel.track("web_product_add", finalPayload);
          mixpanel.track(
            isEdit ? "web_customer_edit" : "web_customer_add",
            finalPayload
          );
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };
  const closeAll = () => {
    closeModal();
    if (isEdit) {
      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        handle: "",
        notes: "",
        street: "",
        city: "",
        state: "",
        country: "",
        zip: "",
      });
    }
  };

  return (
    <ModalRight
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <div className="modal_right_children">
        <div className="top_section">
          <ModalRightTitle
            closeModal={() => {
              closeAll();
            }}
            title={`${isEdit ? "Edit Customer" : "Add Customer"}`}
          />

          <div className="brief_form">
            <InputField
              name="first_name"
              placeholder="Raji "
              label="First Name"
              required={true}
              type={"text"}
              value={formData.first_name}
              onChange={(e) => {
                handleInputs(e);
              }}
            />
            <InputField
              name="last_name"
              placeholder=" Mustapha"
              label="Last Name"
              type={"text"}
              value={formData.last_name}
              onChange={(e) => {
                handleInputs(e);
              }}
            />
            <InputField
              name="email"
              placeholder="gift@getbumpa.com"
              label="Email"
              type={"text"}
              value={formData.email}
              onChange={(e) => {
                handleInputs(e);
              }}
              errMsg={emailError}
              extraClass={emailError && "errorbg"}
            />
            <InputField
              name="phone"
              placeholder="08087427344"
              label="Phone"
              type={"tel"}
              value={formData.phone}
              onChange={(e) => {
                handleInputs(e);
              }}
              errMsg={phoneError}
              extraClass={phoneError && "errorbg"}
            />
            <InputField
              name="handle"
              label="Handle"
              type={"text"}
              prefix={"@"}
              value={formData.handle}
              onChange={(e) => {
                handleInputs(e);
              }}
            />
            <TextAreaField
              label="Notes"
              onChange={(e) => {
                handleInputs(e);
              }}
              name="notes"
              height={"h-[120px]"}
              value={formData.notes}
            />
            <InputField
              name="street"
              label="Shipping Address"
              type={"text"}
              value={formData.street}
              onChange={(e) => {
                handleInputs(e);
              }}
            />
            <InputField
              name="city"
              label="City"
              type={"text"}
              value={formData.city}
              onChange={(e) => {
                handleInputs(e);
              }}
            />
            <InputField
              name="zip"
              label="Zip"
              type={"text"}
              value={formData.zip}
              onChange={(e) => {
                handleInputs(e);
              }}
            />
            <div className="form-group-flex">
              <NormalSelectField
                name="country"
                isLoading={loadCountries}
                required={false}
                selectOption={
                  countries && countries.length
                    ? [
                        { key: "Nigeria", value: "Nigeria" },
                        ...countries.map((item) => {
                          return { key: item.name, value: item.name };
                        }),
                      ]
                    : []
                }
                handleCustomChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setFormData({ ...formData, country: e.target.value });
                }}
                label="Country"
                value={formData.country}
              />
              <NormalSelectField
                name="state"
                required={false}
                isLoading={loadStates}
                handleCustomChange={(e) => {
                  setFormData({ ...formData, state: e.target.value });
                }}
                selectOption={
                  states && states.length
                    ? states.map((item) => {
                        return { key: item, value: item };
                      })
                    : []
                }
                label="State"
                value={formData.state}
              />
            </div>
          </div>
        </div>

        <div className=" bottom_section">
          <Button type="button" className="cancel" onClick={() => closeAll()}>
            Cancel
          </Button>

          <Button
            type="button"
            disabled={
              !(formData.first_name || formData.last_name) ||
              phoneError ||
              emailError
                ? true
                : false
            }
            className="save"
            onClick={onSubmit}
          >
            {isLoading ? (
              <CircularProgress sx={{ color: "#ffffff" }} size="1.5rem" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};
