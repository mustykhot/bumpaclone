import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import { TrashIcon } from "assets/Icons/TrashIcon";
import InputField from "components/forms/InputField";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import NormalTextEditor from "components/forms/NormalTextEditor";
import "../style.scss";

type ModalType = {
  openModal: boolean;
  closeModal: () => void;
  faqList: {
    title: string;
    content: string;
  }[];
  setFaqList: (data: any) => void;
  saveChanges: () => void;
};

export const FaqModal = ({
  openModal,
  closeModal,
  faqList,
  setFaqList,
  saveChanges,
}: ModalType) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (content === "<p><br></p>") {
      setContent("");
    }
  }, [content]);

  const addToFaq = () => {
    if (title && content) {
      setFaqList([...faqList, { title, content }]);
      setTitle("");
      setContent("");
    }
  };

  const removeFromFaq = (index: number) => {
    const faq = [...faqList];

    if (index > -1) {
      faq.splice(index, 1);
    }

    setFaqList(faq);
  };

  const isDisabled = () => {
    var value = false;

    if (faqList?.length < 1) value = true;
    if (title) value = true;
    if (content) value = true;

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
            title="Store FAQs"
            children={
              <p className="modal_description">
                Add your store faqs to your website.{" "}
              </p>
            }
          />

          <div className="customize_modal_body regulations_modal">
            <div className="list">
              {faqList?.map((item, index) => (
                <div key={index} className="item">
                  <div className="info">
                    <p className="title">{item.title}</p>
                    <p
                      className="desc"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    ></p>
                  </div>
                  <IconButton
                    className="icon p-0"
                    onClick={() => removeFromFaq(index)}
                  >
                    <TrashIcon stroke="#d90429" />
                  </IconButton>
                </div>
              ))}
            </div>

            <div className="form">
              <InputField
                type="text"
                placeholder="Title (e.g; How long will it take to get my order?)"
                value={title}
                readOnly={false}
                onChange={(e) => setTitle(e.target.value)}
              />

              <NormalTextEditor
                value={content}
                placeholder="Enter more information here..."
                handleChange={(val: string) => {
                  setContent(val);
                }}
              />

              <Button
                className="btn_tertiary"
                onClick={addToFaq}
                disabled={!title || !content}
              >
                Add
              </Button>
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
            onClick={() => {
              saveChanges();
              closeModal();
            }}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};
