import { useState, useEffect } from "react";
import ModalRight from "components/ModalRight";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "../NewsLetterNotification.tsx/style.scss";
import { ILayout } from "Models/customisation";
import { Button } from "@mui/material";
import ValidatedInput from "components/forms/ValidatedInput";

interface IProp {
  setShowModal: () => void;
  showModal: boolean;
  customiseData: ILayout;
  setCustomiseData: (val: ILayout) => void;
}

export type BannerTextFields = {
  title: string;
  sub_title: string;
};

const BannerTextNotification = ({
  setShowModal,
  showModal,
  customiseData,
  setCustomiseData,
}: IProp) => {
  const methods = useForm<BannerTextFields>({
    mode: "all",
  });

  const {
    formState: { isValid },
    handleSubmit,
    setValue,
  } = methods;

  const onSubmit: SubmitHandler<BannerTextFields> = async (data) => {
    let dataValue: ILayout = { ...customiseData };
    dataValue.hero_banner.banner_title = data.title;
    dataValue.hero_banner.banner_subtitle = data.sub_title;
    setCustomiseData(dataValue);
    setShowModal();
  };

  useEffect(() => {
    if (customiseData && customiseData.hero_banner.status) {
      setValue("title", customiseData?.hero_banner.banner_title as string, {
        shouldValidate: true,
      });
      setValue(
        "sub_title",
        customiseData?.hero_banner.banner_subtitle as string,
        { shouldValidate: true }
      );
    }
  }, [customiseData]);

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
                  title="Banner Text"
                  extraChild={
                    <div>
                      The banner texts will be visible in the store banner
                      section
                    </div>
                  }
                />

                <div className="news-modal__container">
                  <ValidatedInput
                    required={false}
                    name="title"
                    type={"text"}
                    containerClass="news-modal__header-field"
                    label="Title"
                    placeholder="Enter title e.g Fashion House"
                  />

                  <ValidatedInput
                    required={false}
                    name="sub_title"
                    type={"text"}
                    containerClass="news-modal__header-field"
                    label="Sub Title"
                    placeholder="Enter sub-title e.g Your number one stop for everything fashion"
                  />
                </div>
              </div>
              <div className="bottom_section message-modal__footer">
                <div>
                  <Button className="cancel" onClick={setShowModal}>
                    Cancel
                  </Button>
                  <Button className="save" type="submit" disabled={!isValid}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </ModalRight>
        </form>
      </FormProvider>
    </div>
  );
};

export default BannerTextNotification;
