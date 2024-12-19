import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { useState } from "react";
import InputField from "components/forms/InputField";
import { useCreateCustomerGroupMutation } from "services";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
import { CircularProgress } from "@mui/material";

type ModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const QuickCreateGroupModal = ({
  openModal,
  closeModal,
}: ModalProps) => {
  const [name, setName] = useState("");

  const [createGroup, { isLoading }] = useCreateCustomerGroupMutation();

  const onSubmit = async () => {
    const payload = {
      name,
    };
    try {
      let result = await createGroup(payload);
      if ("data" in result) {
        showToast("Created successfully", "success");
        if (typeof _cio !== "undefined") {
          _cio.track("web_customer_group", payload);
        }
        if (typeof mixpanel !== "undefined") {
          mixpanel.track("web_customer_group", payload);
        }
        closeModal();
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
            title="Create Group"
          />

          <div className="brief_form">
            <InputField
              name="name"
              label="Name"
              required={true}
              type={"text"}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
        </div>

        <div className=" bottom_section">
          <Button type="button" className="cancel" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="button" className="save" onClick={onSubmit}>
            {isLoading ? (
              <CircularProgress sx={{ color: "#ffffff" }} size="1.5rem" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};
