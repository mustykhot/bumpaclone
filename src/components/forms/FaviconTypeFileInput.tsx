import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useRef,
  useState,
} from "react";
import { FieldValues } from "react-hook-form";
import { getFileSize, handleError } from "utils";
import { Button, CircularProgress } from "@mui/material";
import { UploadCloudIcon } from "assets/Icons/UploadCloudIcon";
import { RefrshIcon } from "assets/Icons/RefreshIcon";
import { XIcon } from "assets/Icons/XIcon";
import { validationProps } from "./ValidatedInput";
import { showToast, useAppDispatch } from "store/store.hooks";
import {
  useGetStoreInformationQuery,
  useUploadGeneralImageMutation,
} from "services";
import { Base64type } from "./UploadMultipleProductImage";
import {
  SETTINGSROUTES,
  CUSTOMISATION_ROUTES,
} from "utils/constants/apiroutes";
import SingleCropModal from "./SingleCropModal";

export type defaultFileType = {
  url?: string;
  name?: string;
  mime_type?: string;
  size?: number;
};

type Props = {
  type?: "file" | "img";
  accepty?: string;
  width?: string | number;
  height?: string | number;
  label?: string;
  customSize?: string;
  required?: boolean;
  disabled?: boolean;
  isExcel?: boolean;
  labelText?: string;
  isReactHook?: boolean;
  onUpload?: (args: string) => void;
  defaultFile?: defaultFileType;
  defaultImg?: string;
  dimensions?: string;
  uploadPath?: string;
  aspect?: any;
  cropWidth?: number;
  cropHeight?: number;
  onFileChange?: (args: File) => void;
  onFileUpload?: (args: any) => void;
  extraType?: string;
  addCrop?: boolean;
  resetDefaultUpload?: () => void;
  showModal?: (args: any) => void;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

function FaviconTypeFileInput<TFormValues extends FieldValues>({
  id,
  className = "",
  required = true,
  width,
  height,
  type = "img",
  accept = "image/png, image/gif, image/jpeg",
  onUpload,
  label,
  onFileChange,
  disabled,
  name,
  rules,
  isReactHook = true,
  labelText,
  defaultFile,
  defaultImg,
  uploadPath,
  dimensions,
  isExcel = false,
  extraType,
  aspect = 930 / 1163,
  cropWidth = 930,
  cropHeight = 1163,
  resetDefaultUpload,
  addCrop = true,
  onFileUpload = () => {},
  showModal = () => {},
  ...props
}: validationProps<TFormValues> & Props) {
  const fileInputRef = useRef<any>(null);
  const { data: storeData } = useGetStoreInformationQuery();
  const [openCrop, setOpenCrop] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<any>(null);
  const [file, setFile] = useState<any>("");
  const [fileUrl, setFileUrl] = useState<any>(null);
  const dispatch = useAppDispatch();
  const [postGeneralImage, { isLoading }] = useUploadGeneralImageMutation();

  const uploadFile = (file: File) => {
    // setValue(name, file as any);
    const reader = new FileReader();
    setFile(file);
    if (file && type === "img") {
      if (addCrop) {
        setOpenCrop(true);
        setImageToCrop(file);
      } else {
        finalSubmitFile(file);
      }
    } else if (file) {
      setFile(file);
    }
  };

  const finalSubmitFile = (image: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.addEventListener("load", async () => {
      const imageUrl = await uploadGeneralImage({
        name: image.name,
        image: `${reader?.result}`.split("base64,")[1],
      });
      if (imageUrl.path) {
        onFileUpload && onFileUpload(imageUrl.path);
      }
    });
  };

  //   upload Profile Avatar function
  const uploadGeneralImage = async (image: Base64type) => {
    try {
      const payload =
        uploadPath === `${SETTINGSROUTES.STORE_UPLOAD_LOGO}`
          ? {
              image: {
                logo: JSON.stringify({ name: image.name, data: image.image }),
              },
              url: uploadPath,
            }
          : uploadPath === `${SETTINGSROUTES.UPLAOD_PROFILE_AVATAR}`
          ? {
              image: {
                admin_avatar: JSON.stringify({
                  name: image.name,
                  data: image.image,
                }),
              },
              url: uploadPath,
            }
          : uploadPath === `${CUSTOMISATION_ROUTES.CUSTOMISATION}/uploadbanner`
          ? {
              image: {
                banner_image: JSON.stringify({
                  name: image.name,
                  data: image.image,
                }),
              },
              url: uploadPath,
            }
          : uploadPath === `${CUSTOMISATION_ROUTES.CUSTOMISATION}/uploadasset`
          ? {
              image: {
                favicon: JSON.stringify({
                  name: image.name,
                  data: image.image,
                }),
              },
              url: uploadPath,
            }
          : { image: image, url: uploadPath };
      let result = await postGeneralImage(payload);
      if ("data" in result) {
        setFileUrl(
          result?.data?.store?.logo_url ||
            result?.data?.image_url ||
            result?.data?.image?.image_url
        );

        onFileUpload && onFileUpload(result?.data?.image_url);

        const imageUrlObj = {
          name:
            extraType === "collection"
              ? result?.data?.name
              : result?.data?.image?.name,
          path:
            extraType === "collection"
              ? result?.data?.path
              : result?.data?.image?.path,
        };
        showToast("Upload Successful", "success");
        return imageUrlObj;
      } else {
        handleError(result);
        return { name: "", path: "" };
      }
    } catch (error) {
      handleError(error);
      return { name: "", path: "" };
    }
  };
  const handleDelete = () => {
    // setValue(name, null as any);
    setFileUrl(null);
    resetDefaultUpload && resetDefaultUpload();
    setFile("");
  };

  return (
    <>
      <div className="favicon-file-input">
        <div className="image_display_box">
          {fileUrl || defaultImg ? (
            <img
              src={`${
                fileUrl
                  ? `${fileUrl}?time=${new Date().getMilliseconds()}`
                  : `${defaultImg}?time=${new Date().getMilliseconds()}`
              }`}
              alt="img"
              className="image"
            />
          ) : (
            <img
              src={
                "https://ik.imagekit.io/uknntomzctt/logo96_AKuzKK_aZ.png?updatedAt=1692813471944"
              }
              alt="img"
              className="image"
            />
          )}
        </div>
        <div className="input_label_section">
          {fileUrl || defaultImg ? (
            <div className="added_image_section">
              <p className="file_name">{file?.name || "favicon.jpeg"}</p>
              {getFileSize(file?.size) !== "N/A" && (
                <p className="file_size">Size: {getFileSize(file?.size)}</p>
              )}
              <div className="button_flex">
                <label>
                  <input
                    onChange={(e) => {
                      let file = e.target.files && e.target?.files[0];
                      if (file) {
                        uploadFile(file);
                      }
                      if (onFileChange && file) {
                        onFileChange(file);
                      }
                    }}
                    name={name}
                    {...props}
                    hidden
                    ref={fileInputRef}
                    disabled={isLoading}
                    className="sr-only"
                    type={"file"}
                    accept={accept}
                  />
                  <div className="button_tag">
                    {isLoading ? (
                      <CircularProgress
                        size="1.5rem"
                        sx={{ zIndex: 10, color: "#222D37" }}
                      />
                    ) : (
                      <RefrshIcon stroke="#222D37" />
                    )}
                    <span>Change</span>
                  </div>{" "}
                </label>

                <Button
                  onClick={() => {
                    handleDelete();
                  }}
                  startIcon={<XIcon stroke="#D90429" />}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="empty_image_section">
              <p className="recommended">
                Recommended dimension: Square e.g {dimensions}
              </p>
              <p className="max_size">Max file size: 150kb</p>
              <div className="upload_button">
                <label className="make_thumbnail">
                  <input
                    onClick={showModal}
                    onChange={(e) => {
                      let file = e.target.files && e.target?.files[0];
                      if (file) {
                        uploadFile(file);
                      }
                      if (onFileChange && file) {
                        onFileChange(file);
                      }
                    }}
                    name={name}
                    {...props}
                    hidden
                    ref={fileInputRef}
                    disabled={isLoading}
                    className="sr-only"
                    type={"file"}
                    accept={accept}
                  />
                  <div className="button_tag">
                    {isLoading ? (
                      <CircularProgress
                        size="1.5rem"
                        sx={{ zIndex: 10, color: "#222D37" }}
                      />
                    ) : (
                      <UploadCloudIcon stroke="#222D37" />
                    )}
                    <span>Upload Image</span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
      <SingleCropModal
        openModal={openCrop}
        aspect={aspect}
        width={cropWidth}
        height={cropHeight}
        closeModal={() => {
          setOpenCrop(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
        image={imageToCrop}
        finalAction={(image: any) => {
          finalSubmitFile(image);
        }}
      />
    </>
  );
}

export default FaviconTypeFileInput;
