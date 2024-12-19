import Modal from "components/Modal";
import { IconButton } from "@mui/material";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import ValidatedInput from "components/forms/ValidatedInput";
import { LoadingButton } from "@mui/lab";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useVerifyBVNMutation } from "services";
import { handleError } from "utils";
import { showToast } from "store/store.hooks";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  btnAction: () => void;
};

type BvnFeilds = {
  bvn: string;
};

const BvnVerificationModal = ({
  closeModal,
  openModal,
  btnAction,
}: propType) => {
  const [verifyBVN, { isLoading }] = useVerifyBVNMutation();

  const methods = useForm<BvnFeilds>({
    mode: "all",
  });

  const {
    formState: { isValid },
    handleSubmit,
  } = methods;

  const onSubmit: SubmitHandler<BvnFeilds> = async (data) => {
    try {
      const payload = {
        bvn: data.bvn,
      };
      const result = await verifyBVN(payload);

      if ("data" in result) {
        btnAction();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Modal
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="pin_wrap">
          <div className="" onClick={() => closeModal()}>
            <IconButton type="button" className="back_btn_wrap">
              <BackArrowIcon />
            </IconButton>
          </div>

          <div className="modal_body ">
            <h3>BVN Verification</h3>
            <p className="w-[80%] text-center">
              Enter your BVN number to continue
            </p>

            <div className="bg-grey-05 text-black-02 p-2 rounded-[8px] mt-10">
              Dial <span className="text-primary">*565*0#</span> to get your BVN
              from your registered line
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="px-4 w-[100%]">
                <div className="mt-8">
                  <ValidatedInput
                    name="bvn"
                    type={"text"}
                    rules={{
                      validate: (value) =>
                        value?.length == 11 || "Your BVN must be 11 characters",
                    }}
                  />
                </div>

                <div className="mt-12 w-[100%]">
                  <LoadingButton
                    variant="contained"
                    className="w-[100%]"
                    type="submit"
                    disabled={!isValid}
                    loading={isLoading}
                  >
                    Verify
                  </LoadingButton>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BvnVerificationModal;
