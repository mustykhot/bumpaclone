import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import InputField from "components/forms/InputField";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "../style.scss";
import { IconButton } from "@mui/material";
import { TrashIcon } from "assets/Icons/TrashIcon";

type ModalType = {
  openModal: boolean;
  closeModal: () => void;
  regulationsList: {
    icon: string;
    title: string;
    desc: string;
  }[];
  setRegulationsList: (data: any) => void;
  saveChanges: () => void;
};

export const RegulationsModal = ({
  openModal,
  closeModal,
  regulationsList,
  setRegulationsList,
  saveChanges,
}: ModalType) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const addToRegulations = () => {
    if (title && desc) {
      setRegulationsList([...regulationsList, { title, desc }]);
      setTitle("");
      setDesc("");
    }
  };

  const removeFromRegulations = (index: number) => {
    const regulations = [...regulationsList];

    if (index > -1) {
      regulations.splice(index, 1);
    }

    setRegulationsList(regulations);
  };

  const isDisabled = () => {
    var value = false;

    if (regulationsList?.length < 1) value = true;

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
            title="Store regulations"
            children={
              <p className="modal_description">
                Add a up to 4 of your store regulations to your website.
              </p>
            }
          />

          <div className="customize_modal_body regulations_modal">
            <div className="list">
              {regulationsList?.map((item, index) => (
                <div key={index} className="item">
                  <div className="info">
                    <p className="title">{item.title}</p>
                    <p className="desc">{item.desc}</p>
                  </div>

                  <IconButton
                    className="icon p-0"
                    onClick={() => removeFromRegulations(index)}
                  >
                    <TrashIcon stroke="#d90429" />
                  </IconButton>
                </div>
              ))}
            </div>

            {regulationsList?.length < 4 && (
              <div className="form">
                <InputField
                  type="text"
                  placeholder="Title (e.g; Free Shipping & Returns)"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
                <InputField
                  type="text"
                  placeholder="Description (e.g; Free shipping on all orders over $99)"
                  onChange={(e) => setDesc(e.target.value)}
                  value={desc}
                />
                <Button
                  className="btn_tertiary"
                  onClick={addToRegulations}
                  disabled={!title || !desc}
                >
                  Add
                </Button>
              </div>
            )}
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
              saveChanges();
              closeModal();
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
