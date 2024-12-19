import { LoadingButton } from "@mui/lab";
import { Stepper, Step, StepLabel, IconButton, Button } from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import "./style.scss";
import prembly from "assets/images/prembly.png";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import { FileIcon } from "assets/Icons/FileIcon";
import { Upload01Icon } from "assets/Icons/Upload01Icon";
import { XIcon } from "assets/Icons/XIcon";
import Modal from "components/Modal";
import SelectField from "components/forms/SelectField";
import ValidatedInput from "components/forms/ValidatedInput";
import { useVerifyCacMutation } from "services";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  selectCurrentStore,
  selectCurrentUser,
  setStoreDetails,
} from "store/slice/AuthSlice";
import { handleError } from "utils";
import { CancelVerificationModal } from "../KycComponents/CancelVerification/CancelVerification";
import { CacFailModal } from "./CacFailModal";

type CacModalProps = {
  openModal: boolean;
  closeModal: () => void;
  handleSuccess: Function;
  handleCancel: Function;
  handleBack: Function;
};

export type CacField = {
  company_type?: string;
  rc_number?: number | null;
  company_name?: string;
  document?: string;
};

const companyTypeList = [
  {
    value: "BN",
    key: "Business Name (BN)",
  },
  {
    value: "IT",
    key: "Incorporated Trustee (IT)",
  },
  {
    value: "RC",
    key: "Registered Company (RC)",
  },
];

export const CacModal = ({
  closeModal,
  openModal,
  handleSuccess,
  handleCancel,
  handleBack,
}: CacModalProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const userStore = useAppSelector(selectCurrentStore);
  const [verifyCac, { isLoading: isVerifyCacLoading }] = useVerifyCacMutation();
  const [openCacFailModal, setOpenCacFailModal] = useState(false);
  const [cacErrorMessage, setCacErrorMessage] = useState({});
  const [openCancelVerificationModal, setOpenCancelVerificationModal] =
    useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const steps = ["BVN Verification", "NIN Verification", "CAC Verification"];
  const activeStep = 2;

  const methods = useForm<CacField>({
    mode: "all",
    defaultValues: {
      company_type: "",
      rc_number: null,
      document: "",
    },
  });

  const {
    formState: { isValid },
    setValue,
    handleSubmit,
    reset,
  } = methods;

  const onSubmit: SubmitHandler<CacField> = async (data) => {
    if (!data.document) {
      showToast("Please upload a CAC document", "error");
      return;
    }

    try {
      const result = await verifyCac(data);
      if ("data" in result) {
        if (typeof _cio !== "undefined") {
          _cio.track("web_cac_successful");
        }
        if (typeof mixpanel !== "undefined") {
          mixpanel.track("web_cac_successful");
        }
        dispatch(setStoreDetails(result.data.store));
        handleSuccess();
      } else {
        if (typeof _cio !== "undefined") {
          _cio.track("web_cac_fail");
        }
        if (typeof mixpanel !== "undefined") {
          mixpanel.track("web_cac_fail");
        }
        setCacErrorMessage(result.error);
        setOpenCacFailModal(true);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getStatusTextAndClass = (label: string) => {
    if (label === "BVN Verification" && user?.bvn_verified_at !== null) {
      return { text: "Completed", className: "completed" };
    }
    if (label === "NIN Verification" && user?.nin_verified_at !== null) {
      return { text: "Completed", className: "completed" };
    }
    if (label === "CAC Verification" && userStore?.cac !== null) {
      return { text: "Completed", className: "completed" };
    }
    if (label === "CAC Verification" && userStore?.cac === null) {
      return { text: "In Progress", className: "in-progress" };
    }
    return { text: "Pending", className: "pending" };
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      setUploadedFile(file);
      setFileUploaded(true);

      try {
        const base64String = await convertToBase64(file);
        setValue("document", base64String);

        if (file.type.startsWith("image/")) {
          setShowPreview(true);
          setImagePreview(base64String);
        } else if (file.type === "application/pdf") {
          setShowPreview(false);
          setImagePreview(null);
        } else {
          throw new Error("Unsupported file type");
        }
      } catch (error) {
        showToast("Error processing file. Please try again.", "error");
        handleResetFile();
      }
    } else {
      showToast("File size must be less than 2MB", "error");
    }
  };

  const handleContinue = () => {
    setShowPreview(false);
  };

  const handleResetFile = () => {
    setUploadedFile(null);
    setFileUploaded(false);
    setImagePreview(null);
    setValue("document", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadAgain = () => {
    handleResetFile();
    setShowPreview(false);
  };

  useEffect(() => {
    if (userStore) {
      setValue("company_name", userStore.business_name, {
        shouldValidate: true,
      });
    }
  }, [userStore, setValue]);

  const handleCloseModal = () => {
    reset();
    handleResetFile();
    closeModal();
  };

  const handleCancelVerification = () => {
    reset();
    handleResetFile();
    setOpenCancelVerificationModal(false);
    handleCancel();
  };

  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={handleCloseModal}
        closeOnOverlayClick={false}
      >
        <div className="cac_modal">
          <div className="back_section" onClick={() => handleBack()}>
            <IconButton type="button">
              <BackArrowIcon />
            </IconButton>
          </div>
          <div className="main">
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => {
                const { text: statusText, className: statusClass } =
                  getStatusTextAndClass(label);

                return (
                  <Step
                    key={label}
                    completed={
                      (label === "BVN Verification" &&
                        user?.bvn_verified_at !== null) ||
                      (label === "NIN Verification" &&
                        user?.nin_verified_at !== null) ||
                      (label === "CAC Verification" && userStore?.cac !== null)
                    }
                  >
                    <StepLabel>
                      <span className="step">STEP {index + 1}</span>
                      <h4>{label}</h4>
                      <span className={`status ${statusClass}`}>
                        {statusText}
                      </span>
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="box">
                  {!showPreview ? (
                    <>
                      <div className="box--header">
                        <h2>Upload CAC Document</h2>
                        <p>
                          Choose CAC document that clearly shows your business
                          name.
                        </p>
                      </div>
                      <div className="box--form">
                        <SelectField
                          name="company_type"
                          selectOption={companyTypeList}
                          placeholder="Choose company type"
                        />
                        <ValidatedInput
                          name="company_name"
                          placeholder="Enter business name"
                          type="text"
                          required
                          disabled
                        />
                        <ValidatedInput
                          name="rc_number"
                          placeholder="Enter RC number"
                          type="text"
                          required
                        />
                        {!fileUploaded ? (
                          <div className="custom-file-input">
                            <Button
                              type="button"
                              variant="outlined"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload01Icon />
                              <span>Upload CAC Certificate</span>
                            </Button>
                            <input
                              ref={fileInputRef}
                              name="document"
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handleFileChange}
                              style={{ display: "none" }}
                            />
                            <p>
                              We only accept .jpg, .png, .jpeg, or .pdf file
                              formats. Max file size: 2mb
                            </p>
                          </div>
                        ) : (
                          <div className="uploaded-input">
                            <div className="uploaded-input__one">
                              <FileIcon />
                              <p>
                                {uploadedFile?.name}{" "}
                                <span>
                                  {" "}
                                  (
                                  {(uploadedFile?.size
                                    ? uploadedFile.size / (1024 * 1024)
                                    : 0
                                  ).toFixed(2)}{" "}
                                  MB)
                                </span>
                              </p>
                            </div>
                            <IconButton onClick={handleResetFile}>
                              <XIcon stroke="#5C636D" />
                            </IconButton>
                          </div>
                        )}
                      </div>
                      <div className="button_container">
                        <LoadingButton
                          onClick={handleSubmit(onSubmit)}
                          loading={isVerifyCacLoading}
                          disabled={
                            isVerifyCacLoading || !isValid || !uploadedFile
                          }
                          variant="contained"
                        >
                          Submit
                        </LoadingButton>
                        <p
                          onClick={() => {
                            setOpenCancelVerificationModal(true);
                          }}
                        >
                          Cancel
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="box--header">
                        <h2>Preview</h2>
                      </div>
                      {imagePreview && (
                        <div className="image_preview">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="preview_image"
                          />
                        </div>
                      )}
                      <div className="button_container">
                        <Button variant="contained" onClick={handleContinue}>
                          Continue
                        </Button>
                        <p onClick={handleUploadAgain}>Upload Again</p>
                      </div>
                    </>
                  )}
                </div>
              </form>
            </FormProvider>
            {!showPreview && (
              <div className="powered-by">
                <h4>Powered by</h4>
                <img src={prembly} alt="Prembly" />
              </div>
            )}
          </div>
        </div>
      </Modal>
      {openCacFailModal && (
        <CacFailModal
          openModal={openCacFailModal}
          closeModal={() => setOpenCacFailModal(false)}
          errorMessage={cacErrorMessage}
          handleOpenCancelModal={() => {
            reset();
            setOpenCacFailModal(false);
            setOpenCancelVerificationModal(true);
          }}
        />
      )}
      {openCancelVerificationModal && (
        <CancelVerificationModal
          openModal={openCancelVerificationModal}
          closeModal={() => setOpenCancelVerificationModal(false)}
          handleCancelVerification={handleCancelVerification}
          handleDismissVerification={() => {
            setOpenCancelVerificationModal(false);
          }}
        />
      )}
    </>
  );
};
