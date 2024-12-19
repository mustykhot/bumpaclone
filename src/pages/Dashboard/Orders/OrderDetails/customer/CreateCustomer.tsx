import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { useState } from "react";
import InputField from "components/forms/InputField";
import TextAreaField from "components/forms/TextAreaField";
import {
  useCreateCustomerMutation,
  useGetCountriesQuery,
  useGetStatesQuery,
} from "services";
import NormalSelectField from "components/forms/NormalSelectField";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
import { CircularProgress } from "@mui/material";
import { getObjWithValidValues } from "utils/constants/general";
type TaxModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const CreateCustomerModal = ({
  openModal,
  closeModal,
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
  const handleInputs = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const [selectedCountry, setSelectedCountry] = useState("");
  const { data: countries, isLoading: loadCountries } = useGetCountriesQuery();
  const { data: states, isLoading: loadStates } = useGetStatesQuery(
    selectedCountry,
    { skip: selectedCountry ? false : true }
  );
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

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
      let result = await createCustomer({
        body: getObjWithValidValues(payload),
      });

      if ("data" in result) {
        showToast("Created successfully", "success");
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
          _cio.track("web_customer_add", payload);
        }
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
      <div className="modal_right_children">
        <div className="top_section">
          <ModalRightTitle
            closeModal={() => {
              closeModal();
            }}
            title="Add Customer"
          />

          <div className="brief_form">
            <InputField
              name="first_name"
              placeholder="Raji "
              label="First Name"
              type={"text"}
              required={true}
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
              />
            </div>
          </div>
        </div>

        <div className=" bottom_section">
          <Button type="button" className="cancel" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={formData.first_name || formData.last_name ? false : true}
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
