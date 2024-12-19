import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { useEffect, useState } from "react";
import InputField from "components/forms/InputField";
import {
  useCreateCustomerMutation,
  useCreateDnsMutation,
  useEditDnsMutation,
} from "services";
import NormalSelectField from "components/forms/NormalSelectField";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
import { CircularProgress } from "@mui/material";
import { getObjWithValidValues } from "utils/constants/general";
import { useParams } from "react-router-dom";

type TaxModalProps = {
  openModal: boolean;
  setDefaultFields?: any;
  defaultFields?: {
    type: string;
    host_name: string;
    ttl: string;
    address: string;
    host_id: string;
    priority: string;
  };
  closeModal: () => void;
};

const ttlList = [
  {
    label: "Automatic",
    value: "14400",
  },
];

const typeList = [
  {
    label: "AAAA",
    value: "AAAA",
  },
  {
    label: "ALIAS",
    value: "ALIAS",
  },
  {
    label: "CAA",
    value: "CAA",
  },
  {
    label: "MX",
    value: "MX",
  },
  {
    label: "TXT",
    value: "TXT",
  },
  {
    label: "CNAME",
    value: "CNAME",
  },
  {
    label: "MXE",
    value: "MXE",
  },
  {
    label: "NS",
    value: "NS",
  },
  {
    label: "URL301",
    value: "URL301",
  },
  {
    label: "FRAME",
    value: "FRAME",
  },
];

export const AddDnsModal = ({
  openModal,
  closeModal,
  defaultFields,
  setDefaultFields,
}: TaxModalProps) => {
  const { id } = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    host_name: "",
    ttl: "14400",
    address: "",
    priority: "",
  });
  const handleInputs = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [createDns, { isLoading }] = useCreateDnsMutation();
  const [editDns, { isLoading: loadEdit }] = useEditDnsMutation();
  const resetFields = () => {
    setFormData({
      type: "",
      host_name: "",
      ttl: "14400",
      address: "",
      priority: "",
    });
  };
  const onSubmit = async () => {
    if (defaultFields) {
      const payload = {
        type: formData.type,
        host_name: formData.host_name,
        ttl: formData.ttl,
        address: formData.address,
        host_id: defaultFields.host_id,
        priority: defaultFields.priority,
      };

      try {
        let result = await editDns({
          body: getObjWithValidValues(payload),
          id: id || "",
        });
        if ("data" in result) {
          showToast("Added successfully", "success");
          resetFields();
          setIsEdit(false);
          setDefaultFields(null);
          closeModal();
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    } else {
      const payload = {
        type: formData.type,
        host_name: formData.host_name,
        ttl: formData.ttl,
        address: formData.address,
        priority: formData.priority,
      };

      try {
        let result = await createDns({
          body: getObjWithValidValues(payload),
          id: id || "",
        });
        if ("data" in result) {
          showToast("Added successfully", "success");
          resetFields();
          closeModal();
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  useEffect(() => {
    if (defaultFields) {
      setIsEdit(true);
      setFormData({
        type: defaultFields.type,
        host_name: defaultFields.host_name,
        ttl: defaultFields.ttl,
        address: defaultFields.address,
        priority: defaultFields.priority,
      });
    }
  }, [defaultFields]);

  return (
    <ModalRight
      closeModal={() => {
        setDefaultFields(null);
        closeModal();
        defaultFields && resetFields();
      }}
      openModal={openModal}
    >
      <div className="modal_right_children">
        <div className="top_section">
          <ModalRightTitle
            closeModal={() => {
              closeModal();
              setDefaultFields(null);
              defaultFields && resetFields();
            }}
            title={defaultFields ? "Edit DNS Record" : "Add DNS Record"}
          />

          <div className="brief_form">
            {defaultFields ? (
              <InputField
                name="type"
                label="Record Type"
                type={"text"}
                value={formData.type}
                contentEditable={false}
                disabled={true}
              />
            ) : (
              <NormalSelectField
                name="type"
                required={false}
                selectOption={typeList.map((item) => {
                  return { key: item.label, value: item.value };
                })}
                handleCustomChange={(e) => {
                  setFormData({ ...formData, type: e.target.value });
                }}
                value={formData.type}
                label="Type"
              />
            )}
            {formData.type == "MX" && (
              <InputField
                name="priority"
                placeholder="Enter Priority"
                label="Priority"
                type={"number"}
                value={formData.priority}
                onChange={(e) => {
                  handleInputs(e);
                }}
              />
            )}

            <InputField
              name="host_name"
              placeholder="Enter host name"
              label="Host name"
              type={"text"}
              value={formData.host_name}
              onChange={(e) => {
                handleInputs(e);
              }}
            />

            <InputField
              name="address"
              placeholder="Enter value"
              label="Value"
              type={"text"}
              value={formData.address}
              onChange={(e) => {
                handleInputs(e);
              }}
            />

            <NormalSelectField
              name="ttl"
              required={false}
              selectOption={ttlList.map((item) => {
                return { key: item.label, value: item.value };
              })}
              handleCustomChange={(e) => {
                setFormData({ ...formData, ttl: e.target.value });
              }}
              value={formData.ttl}
              label="TTL"
            />
          </div>
        </div>

        <div className=" bottom_section">
          <Button type="button" className="cancel" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={false}
            className="save"
            onClick={onSubmit}
          >
            {isLoading || loadEdit ? (
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
