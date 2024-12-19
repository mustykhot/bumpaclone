import { useState } from "react";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";

import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import InputField from "components/forms/InputField";

import { useCreateCustomerMutation } from "services";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
import { getObjWithValidValues } from "utils/constants/general";

type ModalProps = {
  openModal: boolean;
  closeModal: () => void;
  extraFnc?: (id: string, cb?: () => void) => void;
  extraLoad?: boolean;
};

export const CreateCustomerModal = ({
  openModal,
  closeModal,
  extraFnc,
  extraLoad,
}: ModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const handleInputs = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const onSubmit = async () => {
    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
    };
    try {
      let result = await createCustomer({
        body: getObjWithValidValues(payload),
      });

      if ("data" in result) {
        showToast("Created successfully", "success");
        setFormData({
          name: "",
          phone: "",
          email: "",
        });
        if (typeof _cio !== "undefined") {
          _cio.track("web_customer_add", payload);
        }
        if (extraFnc) {
          extraFnc(`${result?.data?.customer?.id}`, () => {
            closeModal();
          });
        } else {
          closeModal();
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleCloseFnc = () => {
    if (!extraLoad && !isLoading) {
      closeModal();
      setFormData({
        name: "",
        phone: "",
        email: "",
      });
    } else {
    }
  };

  return (
    <ModalRight closeModal={() => handleCloseFnc()} openModal={openModal}>
      <div className="modal_right_children">
        <div className="top_section">
          <ModalRightTitle
            closeModal={() => handleCloseFnc()}
            title="Add Customer"
          />

          <div className="brief_form">
            <InputField
              name="name"
              placeholder="Raji "
              label="Full Name"
              required={true}
              type={"text"}
              value={formData.name}
              onChange={(e) => {
                handleInputs(e);
              }}
            />
            <InputField
              name="phone"
              placeholder="08087427344"
              label="Phone"
              type={"tel"}
              required={true}
              value={formData.phone}
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
          </div>
        </div>

        <div className=" bottom_section">
          <Button
            type="button"
            className="cancel"
            onClick={() => handleCloseFnc()}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={
              (formData.name && formData.phone ? false : true) ||
              isLoading ||
              extraLoad
            }
            className="save"
            onClick={onSubmit}
          >
            {isLoading || extraLoad ? (
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
