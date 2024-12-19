import { useState, useEffect } from "react";
import ModalRight from "components/ModalRight";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "./style.scss";
import { ILayout } from "Models/customisation";
import { Button } from "@mui/material";
import TextEditor from "components/forms/TextEditor";

interface IProp {
  setShowModal: () => void;
  showModal: boolean;
  customiseData: ILayout
  setCustomiseData: (val: ILayout) => void
}

export type CustomMessageFields = {
  message: string
};

const CustomMessageNotification = ({ setShowModal, showModal, customiseData, setCustomiseData }: IProp) => {
  const methods = useForm<CustomMessageFields>({
    mode: "all",
  });

  const {
    formState: { isValid },
    handleSubmit,
    setValue,
  } = methods;

  const onSubmit: SubmitHandler<CustomMessageFields> = async (data) => {
    let dataValue: ILayout = { ...customiseData }
    dataValue.custom_message.message = data.message
    setCustomiseData(dataValue)
    setShowModal()

  };

  useEffect(() => {
    if (customiseData && customiseData.custom_message.status) {
      setValue("message", customiseData?.custom_message.message as string, { shouldValidate: true })
    }
  }, [customiseData])

  return (
    <div className="message-modal">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalRight closeModal={setShowModal} openModal={showModal}>
            <div className="modal_right_children">
              <div className="top_section">
                <ModalRightTitle
                  className="message-modal__right-title"
                  closeModal={setShowModal}
                  title="Custom message (Top banner)"
                  extraChild={
                    <div>
                      Your custom message will be visible at the top of your website
                    </div>
                  }
                />

                <div className="message-modal__container">
                  <TextEditor name="message"
                    label="Content" />

                </div>
              </div>
              <div className="bottom_section message-modal__footer">
                <div >
                  <Button className="cancel" onClick={setShowModal}>Cancel</Button>
                  <Button className="save" type="submit" disabled={!isValid}>Save</Button>
                </div>
              </div>
            </div>
          </ModalRight>
        </form>
      </FormProvider>
    </div>
  );
};

export default CustomMessageNotification;
