import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
} from "@mui/material";
import { UploadCloudIcon } from "assets/Icons/UploadCloudIcon";
import { UpgradeModal } from "components/UpgradeModal";
import { Toggle } from "components/Toggle";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import { useAppSelector } from "store/store.hooks";
import { getFileSize, handleError } from "utils";
import { RefrshIcon } from "assets/Icons/RefreshIcon";
import { XIcon } from "assets/Icons/XIcon";
import { useUploadGeneralImageMutation } from "services";
import { IMG_BASE_URL } from "utils/constants/general";

const SizeGuardUpload = () => {
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const { setValue, watch } = useFormContext();
  const [file, setFile] = useState<any>(null);

  const watchImage = watch("size_guard");
  const [expanded, setExpanded] = useState<boolean>(false);

  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [postGeneralImage, { isLoading: isUploading }] =
    useUploadGeneralImageMutation();

  const handleAccordionChange = (checked?: boolean) => {
    const shouldOpenUpgradeModal =
      isSubscriptionExpired ||
      isSubscriptionType === "free" ||
      isSubscriptionType === "starter";

    if (typeof checked === "boolean") {
      if (checked === false && shouldOpenUpgradeModal) {
        setOpenUpgradeModal(true);
      } else {
        setExpanded(checked);
      }
    } else {
      if (expanded === false && shouldOpenUpgradeModal) {
        setOpenUpgradeModal(true);
      } else {
        setExpanded(!expanded);
      }
    }
  };

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imgFile = e?.target?.files[0];
      if (imgFile) {
        setFile(imgFile);
        const reader = new FileReader();
        reader.onloadend = () => {
          // setImage(reader.result);
          uploadImage(reader.result);
        };
        reader?.readAsDataURL(imgFile);
      }
    }
  };

  const uploadImage = async (base64Img: any) => {
    try {
      let payload = {
        url: `/media/image/upload`,
        image: { image: base64Img, name: "sizeguard" },
      };
      let result = await postGeneralImage(payload);
      if ("data" in result) {
        const imgPath = `${IMG_BASE_URL}${result?.data?.image?.path}`;
        // setImage(imgPath);
        setValue("size_guard", imgPath);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const resetDefaultUpload = () => {
    setValue("size_guard", "");
    setFile(null);
  };

  console.log(watchImage, "watchImage");
  return (
    <>
      <div className="size-guard-upload">
        <Accordion
          className="accordion"
          expanded={expanded}
          onChange={() => {
            handleAccordionChange();
          }}
        >
          <AccordionSummary
            className="accordion_summary"
            aria-controls="panel1a-content"
            id="panel1a-header"
            expandIcon={
              <Toggle toggled={expanded} handlelick={handleAccordionChange} />
            }
          >
            <h5>Size Chart</h5>
          </AccordionSummary>
          <AccordionDetails className="accordion-details">
            <div className="form-group-flex">
              {watchImage ? (
                <div className="uploaded-image-container">
                  <img src={watchImage} alt="size" />

                  <div className="reset-reupload-container">
                    {file && (
                      <div className="name-size">
                        <p className="file-name">{file?.name}</p>
                        <p className="file-size">{getFileSize(file?.size)}</p>
                      </div>
                    )}
                    <div className="reset-reupload-buttons">
                      <label htmlFor="uploaded-image">
                        {isUploading ? (
                          <CircularProgress
                            size="1.5rem"
                            sx={{ color: "#000000" }}
                          />
                        ) : (
                          <>
                            <RefrshIcon stroke="#222D37" />
                            <span>Change</span>
                          </>
                        )}
                        <input
                          onChange={handleSelectImage}
                          name="uploaded-image"
                          id="uploaded-image"
                          hidden
                          type="file"
                        />
                      </label>
                      <Button
                        onClick={() => resetDefaultUpload()}
                        startIcon={<XIcon stroke="#D90429" />}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="upload-new-guard">
                  <p className="general">
                    You’re current using the general size chart from product
                    settings{" "}
                  </p>
                  <label>
                    {isUploading ? (
                      <CircularProgress
                        size="1.5rem"
                        sx={{ color: "#009444" }}
                      />
                    ) : (
                      <UploadCloudIcon stroke="#009444" />
                    )}
                    <p>Upload a different size chart for this product</p>
                    <input
                      accept="image/png, image/gif, image/jpeg"
                      required={false}
                      type="file"
                      hidden
                      onChange={handleSelectImage}
                    />
                  </label>
                </div>
              )}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>

      {openUpgradeModal && (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => setOpenUpgradeModal(false)}
          pro={true}
          title={`Add MOQ and MaxOQ to your website!`}
          subtitle={`Manage wholesales easily with MOQs`}
        />
      )}
    </>
  );
};

export default SizeGuardUpload;
