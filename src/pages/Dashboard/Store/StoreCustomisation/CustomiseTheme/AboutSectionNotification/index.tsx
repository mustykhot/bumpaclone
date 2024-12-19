import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "./style.scss";
import ValidatedTextArea from "components/forms/ValidatedTextArea";
import { Button } from "@mui/material";
import { ILayout } from "Models/customisation";
import TextEditor from "components/forms/TextEditor";

interface IProp {
  setShowModal: () => void;
  showModal: boolean;
  customiseData: ILayout
  setCustomiseData: (val: ILayout) => void
}

export type AboutUsFields = {
  message: string
};

const AboutSectionNotification = ({ setShowModal, showModal, customiseData, setCustomiseData }: IProp) => {

  const methods = useForm<AboutUsFields>({
    mode: "all",
  });

  const {
    formState: { isValid },
    handleSubmit,
    setValue,
  } = methods;

  const onSubmit: SubmitHandler<AboutUsFields> = async (data) => {
    let dataValue: ILayout = { ...customiseData }
    dataValue.about_us.message = data.message
    setCustomiseData(dataValue)
    setShowModal()
  };

  useEffect(() => {
    if (customiseData && customiseData.about_us.status) {
      setValue("message", customiseData?.about_us.message as string, { shouldValidate: true })
    }
  }, [customiseData])

  return (
    <div className="about-modal">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <ModalRight closeModal={setShowModal} openModal={showModal}>
            <div className="modal_right_children">
              <div className="top_section">
                <ModalRightTitle
                  className="about-modal__right-title"
                  closeModal={() => {
                    setShowModal();
                  }}
                  title="About us section"
                  extraChild={
                    <div>
                      The About Us section is visible at the bottom of your website.
                    </div>
                  }
                />

                <div className="about-modal__container">
                <TextEditor   name="message"
                    label="Content"/>
                </div>
              </div>
              <div className="bottom_section about-modal__footer">
                <div>
                  <Button type="button" className="cancel" onClick={setShowModal}>Cancel</Button>
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

export default AboutSectionNotification;
