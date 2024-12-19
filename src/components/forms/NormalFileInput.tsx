import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useRef,
  useState,
} from "react";
import { FieldValues } from "react-hook-form";
import { CircularProgress } from "@mui/material";
import { IconButton } from "@mui/material";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { UploadIcon } from "assets/Icons/UploadIcon";
import { ClearIcon } from "assets/Icons/ClearIcon";
import { FileIcon } from "assets/Icons/FileIcon";
import { validationProps } from "./ValidatedInput";
import { Base64type } from "./UploadMultipleProductImage";
import SingleCropModal from "./SingleCropModal";
import { showToast, useAppDispatch } from "store/store.hooks";
import { useUploadGeneralImageMutation } from "services";
import {
  SETTINGSROUTES,
  CUSTOMISATION_ROUTES,
} from "utils/constants/apiroutes";
import { getFileSize, handleError } from "utils";
import moment from "moment";

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
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

function NormalFileInput<TFormValues extends FieldValues>({
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
  ...props
}: validationProps<TFormValues> & Props) {
  const fileInputRef = useRef<any>(null);
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
              : extraType === "profile"
              ? "avatar"
              : result?.data?.image?.name,
          path:
            extraType === "collection"
              ? result?.data?.path
              : extraType === "profile"
              ? result?.data?.user?.avatar
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
    setFileUrl(null);
    resetDefaultUpload && resetDefaultUpload();
    setFile("");
  };

  return (
    <>
      <div className="file-input">
        {labelText && (
          <p className="label_text">
            {labelText}
            {!required && " (Optional)"}
          </p>
        )}
        {(fileUrl || defaultImg) && type === "img" ? (
          <div className={`image_holder`} onClick={() => {}}>
            <img
              src={`${
                fileUrl
                  ? `${fileUrl}?time=${moment().milliseconds()}`
                  : `${defaultImg}?time=${moment().milliseconds()}`
              }`}
              alt="img"
              className="image"
            />
            {isLoading ? (
              <div className="absolute_loading_box">
                <CircularProgress
                  size="1.5rem"
                  sx={{ zIndex: 10, color: "#ffffff" }}
                />
              </div>
            ) : (
              <>
                <div className="absolute_thumbnail_box">
                  <label className="make_thumbnail">
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
                      disabled={isLoading || disabled}
                      className="sr-only"
                      type={"file"}
                      accept={accept}
                    />
                    <p>Change Image</p>
                  </label>
                </div>
                <IconButton
                  sx={{
                    background: "#eee8e8 !important",
                    position: "absolute",
                    height: "30px",
                    width: "30px",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                  className="absolute top-2 right-2 cursor-pointer transition delete_icon "
                  onClick={() => {
                    handleDelete();
                  }}
                >
                  <TrashIcon />
                </IconButton>
              </>
            )}
          </div>
        ) : isExcel && (file || defaultFile) ? (
          <div className="display_excel">
            <div className="text_box">
              <FileIcon />
              <p className="excel_name"> {file?.name || defaultFile?.name}</p>
              <p className="excel_size"> {getFileSize(file?.size)}</p>
            </div>
            <IconButton
              onClick={() => {
                setFile("");
              }}
            >
              <ClearIcon stroke={"#5C636D"} />
            </IconButton>
          </div>
        ) : (
          <label style={{ minHeight: height, width }}>
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
              ref={fileInputRef}
              name={name}
              {...props}
              hidden
              disabled={isLoading || disabled}
              className="sr-only"
              type={"file"}
              accept={accept}
            />
            {isLoading ? (
              <CircularProgress size="1.5rem" sx={{ zIndex: 10 }} />
            ) : fileUrl || defaultImg ? (
              type !== "img" ? (
                <div className="flex py-2 space-x-3 justify-center items-center max-w-[80%]">
                  <UploadIcon />
                  <div className="font-medium max-w-[80%]">
                    <p className="text-sm -mb-2 truncate max-w-full">
                      {file?.name}
                    </p>
                    <small className="text-grey text-xs">
                      {getFileSize(file?.size)}
                    </small>
                  </div>
                </div>
              ) : (
                ""
              )
            ) : (
              <div className=" empty_upload initial_label ">
                <>
                  <UploadIcon />
                  {label ? (
                    <span className="text-base">{label}</span>
                  ) : (
                    <div className="text_box">
                      <p className="drag ">Click to select image</p>
                      {dimensions && addCrop && (
                        <p>Recommended dimension: {dimensions}</p>
                      )}
                      <p> Max file size: 5mb</p>
                    </div>
                  )}
                </>
              </div>
            )}
          </label>
        )}
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

export default NormalFileInput;
