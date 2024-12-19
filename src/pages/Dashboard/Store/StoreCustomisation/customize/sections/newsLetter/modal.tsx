import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import InputField from "components/forms/InputField";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "../style.scss";

type ModalType = {
  openModal: boolean;
  closeModal: () => void;
  data: any;
  saveChanges: (data: any) => void;
};

export const NewsletterModal = ({
  openModal,
  closeModal,
  data,
  saveChanges,
}: ModalType) => {
  const [desc, setDesc] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (data) {
      setTitle(data?.title);
      setDesc(data?.desc);
    }
  }, [data]);

  const handleFormSubmit = () => {
    const payload = {
      show: true,
      title: title,
      desc: desc,
    };
    saveChanges(payload);
    closeModal();
  };

  const isDisabled = () => {
    var value = false;
    if (!title) value = true;
    if (!desc) value = true;
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
            title="Newsletter"
            children={
              <p className="modal_description">
                Show a newsletter pop-up form to your website.
              </p>
            }
          />

          <div className="customize_modal_body countdown_modal">
            <InputField
              type="text"
              placeholder="Header (e.g; Receive our Monthly Newsletter)"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <InputField
              type="text"
              placeholder="Sub header (e.g; Stay on top of our offerings by being among...)"
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
        </div>

        <div className=" bottom_section">
          <Button type="button" className="cancel" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            type="button"
            className="save"
            onClick={() => {
              handleFormSubmit();
            }}
            disabled={isDisabled()}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};
