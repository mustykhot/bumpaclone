import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "./style.scss";
import ValidatedInput from "components/forms/ValidatedInput";
import { ILayout } from "Models/customisation";
import { Button } from "@mui/material";

interface IProp {
  setShowModal: () => void;
  showModal: boolean;
  customiseData: ILayout
  setCustomiseData: (val: ILayout) => void
}

export type NewLetterFields = {
  header: string;
  sub_heading: string
};



const NewsLetterNotification = ({ setShowModal, showModal, customiseData, setCustomiseData }: IProp) => {

  const methods = useForm<NewLetterFields>({
    mode: "all",
  });

  const {
    formState: { isValid },
    handleSubmit,
    setValue,
  } = methods;

  const onSubmit: SubmitHandler<NewLetterFields> = async (data) => {
    let dataValue: ILayout = { ...customiseData }
    dataValue.newsletter.heading = data.header
    dataValue.newsletter.subheading = data.sub_heading
    setCustomiseData(dataValue)
    setShowModal()

  };

  useEffect(() => {
    if (customiseData && customiseData.newsletter.status) {
      setValue("header", customiseData?.newsletter?.heading as string, { shouldValidate: true })
      setValue("sub_heading", customiseData?.newsletter?.subheading as string, { shouldValidate: true })
    }
  }, [customiseData])

  return (
    <div className="news-modal">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <ModalRight closeModal={setShowModal} openModal={showModal}>
            <div className="modal_right_children">
              <div className="top_section">
                <ModalRightTitle
                  className="news-modal__right-title"
                  closeModal={setShowModal}
                  title="Newsletter and Pop-up Notification"
                  extraChild={
                    <div>
                      A newsletter and pop-up notification will be visible on your
                      website
                    </div>
                  }
                />

                <div className="news-modal__container">
                  <ValidatedInput
                    name="header"
                    type={"text"}
                    containerClass="news-modal__header-field"
                    label="Header"
                    placeholder="Enter newsletter header"
                  />

                  <ValidatedInput
                    name="sub_heading"
                    type={"text"}
                    containerClass="news-modal__header-field"
                    label="Sub Header"
                    placeholder="Enter newsletter header"
                  />
                </div>
              </div>
              <div className="bottom_section news-modal__footer">
                <div>
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

export default NewsLetterNotification;
