import { useEffect } from "react";
import ModalRight from "components/ModalRight";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "./style.scss";
import ValidatedInput from "components/forms/ValidatedInput";
import { WhatsappIcon } from "assets/Icons/WhatsappIcon";
import { FacebookIcon } from "assets/Icons/FacebookIcon";
import { TwitterIcon } from "assets/Icons/TwitterIcon";
import { InstagramIcon } from "assets/Icons/InstagramIcon";
import { ILayout } from "Models/customisation";
import { Button } from "@mui/material";

interface IProp {
  setShowModal: () => void;
  showModal: boolean;
  customiseData: ILayout
  setCustomiseData: (val: ILayout) => void
}

export type SocialLinksFields = {
  facebook: string;
  instagram: string;
  twitter: string;
  whatsapp: string
};

const SocialmediaNotification = ({ setShowModal, showModal, customiseData, setCustomiseData }: IProp) => {
  const methods = useForm<SocialLinksFields>({
    mode: "all",
  });

  const {
    formState: { isValid },
    handleSubmit,
    setValue,
  } = methods;

  const onSubmit: SubmitHandler<SocialLinksFields> = async (data) => {
    let dataValue: ILayout = { ...customiseData }
    dataValue.social_links.facebook = data.facebook
    dataValue.social_links.instagram = data.instagram
    dataValue.social_links.twitter = data.twitter
    dataValue.social_links.whatsapp = data.whatsapp
    setCustomiseData(dataValue)
    setShowModal()
  };

  useEffect(() => {
    if (customiseData && customiseData.social_links.status) {
      setValue("facebook", customiseData?.social_links.facebook as string)
      setValue("instagram", customiseData?.social_links.instagram as string)
      setValue("twitter", customiseData?.social_links.twitter as string)
      setValue("whatsapp", customiseData?.social_links.whatsapp as string)
    }
  }, [customiseData])

  return (
    <div className="media-modal">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <ModalRight closeModal={setShowModal} openModal={showModal}>
            <div className="modal_right_children">
              <div className="top_section">
                <ModalRightTitle
                  className="media-modal__right-title"
                  closeModal={setShowModal}
                  title="Social media links (contact)"
                  extraChild={
                    <div>
                      Your social media handles will be shown on your website as
                      your contact information
                    </div>
                  }
                />

                <div className="media-modal__container">
                  <ValidatedInput
                    type={"text"}
                    containerClass="media-modal__input-field"
                    label="Whatsapp"
                    name="whatsapp"
                    placeholder="wa.me/15551234567"
                    prefix={<WhatsappIcon />}
                    required={false}
                  />

                  <ValidatedInput
                    type={"text"}
                    containerClass="media-modal__input-field"
                    name="facebook"
                    prefix={<FacebookIcon />}
                    label="Facebook"
                    placeholder="wa.me/15551234567"
                    required={false}
                  />

                  <ValidatedInput
                    type={"text"}
                    containerClass="media-modal__input-field"
                    name="instagram"
                    label="Instagram"
                    placeholder="wa.me/15551234567"
                    prefix={<InstagramIcon />}
                    required={false}
                  />

                  <ValidatedInput
                    type={"text"}
                    containerClass="media-modal__input-field"
                    name="twitter"
                    label="Twitter"
                    placeholder="wa.me/15551234567"
                    prefix={<TwitterIcon />}
                    required={false}
                  />
                </div>
              </div>
              <div className="bottom_section media-modal__footer">
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

export default SocialmediaNotification;
