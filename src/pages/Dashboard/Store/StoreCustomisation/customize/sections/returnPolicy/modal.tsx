import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import NormalTextEditor from "components/forms/NormalTextEditor";
import "../style.scss";

type ModalType = {
  openModal: boolean;
  closeModal: () => void;
  data: any;
  saveChanges: (data: any) => void;
};

export const ReturnPolicyModal = ({
  openModal,
  closeModal,
  data,
  saveChanges,
}: ModalType) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (data) {
      setContent(data?.content || "");
    }
  }, [data]);

  useEffect(() => {
    if (content === "<p><br></p>") {
      setContent("");
    }
  }, [content]);

  const handleFormSubmit = () => {
    const payload = {
      show: true,
      content,
    };
    saveChanges(payload);
    closeModal();
  };

  const isDisabled = () => {
    var value = false;
    if (!content) value = true;
    return value;
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
            title="Return Policy"
            children={
              <p className="modal_description">
                Show a return policy section on your website.
              </p>
            }
          />

          <div className="customize_modal_body about_us_modal">
            <div className="modal_body">
              <NormalTextEditor
                value={content}
                placeholder="This is our return policy as of..."
                handleChange={(val: string) => {
                  setContent(val);
                }}
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
            className="save"
            onClick={handleFormSubmit}
            disabled={isDisabled()}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};
