import { useEffect } from "react";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
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

export type ReturbPolicyFields = {
  message: string
};

const ReturnPolicyNotification = ({ setShowModal, showModal, customiseData, setCustomiseData }: IProp) => {
  const methods = useForm<ReturbPolicyFields>({
    mode: "all",
  });

  const {
    formState: { isValid },
    handleSubmit,
    setValue,
  } = methods;

  const onSubmit: SubmitHandler<ReturbPolicyFields> = async (data) => {
    let dataValue: ILayout = { ...customiseData }
    dataValue.return_policy.message = data.message
    setCustomiseData(dataValue)
    setShowModal()
  };

  useEffect(() => {
    if (customiseData && customiseData?.return_policy?.message) {
      setValue("message", customiseData?.return_policy?.message as string, { shouldValidate: true })
    }
  }, [customiseData])
  return (
    <div className="policy-modal">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <ModalRight closeModal={setShowModal} openModal={showModal}>
            <div className="modal_right_children">
              <div className="top_section">
                <ModalRightTitle
                  className="policy-modal__right-title"
                  closeModal={() => {
                    setShowModal();
                  }}
                  title="Return Policy"
                  extraChild={
                    <div>
                      The Return policy section is visible in the footer of your
                      website.
                    </div>
                  }
                />

                <div className="policy-modal__container">
                  <TextEditor name="message"
                    label="Content" />


                </div>
              </div>
              <div className="bottom_section policy-modal__footer">
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

export default ReturnPolicyNotification;
