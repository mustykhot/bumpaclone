import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useState,
  useEffect,
  useRef,
} from "react";

import { get, useFormContext, FieldValues } from "react-hook-form";
import { getFileSize, handleError } from "utils";
import { CircularProgress } from "@mui/material";
// import { useUploadFileMutation } from 'services';
import { validationProps } from "./ValidatedInput";
import { UploadIcon } from "assets/Icons/UploadIcon";
import { IconButton } from "@mui/material";
import { useUploadGeneralImageMutation } from "services";
import { Base64type } from "./UploadMultipleProductImage";
import { showToast } from "store/store.hooks";
import { IMAGEURL } from "utils/constants/general";
import { TrashIcon } from "assets/Icons/TrashIcon";
import SingleCropModal from "./SingleCropModal";

export type defaultFileType = {
  name?: string;
  path?: string;
};

type Props = {
  type?: "file" | "img";
  width?: string | number;
  height?: string | number;
  accept?: string;
  label?: string;
  required?: boolean;
  dimensions?: string;
  isExcel?: boolean;
  labelText?: string;
  uploadPath?: string;
  uploadPayload?: (args: any) => void;
  isReactHook?: boolean;
  extraType?: string;
  getFile?: (args: any) => void;
  onUpload?: (args: string) => void;
  defaultFile?: defaultFileType;
  onFileChange?: (args: File) => void;
  onFileUpload?: (args: any) => void;
  addCrop?: boolean;
  aspect?: any;
  cropWidth?: number;
  cropHeight?: number;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

function FileInput<TFormValues extends FieldValues>({
  id,
  className = "",
  required = true,
  type,
  width,
  height,
  onUpload,
  uploadPayload,
  label,
  onFileChange,
  getFile,
  name,
  rules,
  isReactHook = true,
  labelText,
  defaultFile,
  dimensions,
  uploadPath,
  extraType,
  aspect = 930 / 1163,
  cropWidth = 930,
  cropHeight = 1163,
  accept = "image/png, image/gif, image/jpeg",
  addCrop = true,
  onFileUpload = () => {},
  ...props
}: validationProps<TFormValues> & Props) {
  const {
    register,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<TFormValues>();
  const fileInputRef = useRef<any>(null);
  const [openCrop, setOpenCrop] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<any>(null);
  const watchFile = watch(name);
  const [file, setFile] = useState<any>("");
  const [fileUrl, setFileUrl] = useState<any>(watchFile ? watchFile : "");
  const [postGeneralImage, { isLoading }] = useUploadGeneralImageMutation();

  const error = get(errors, name);

  const uploadFile = (fileVal: File) => {
    setFile(fileVal);

    if (fileVal.size > 5_000_000) {
      setError(name, {
        message: `${fileVal.name} is greater than 5MB`,
      });
    } else {
      clearErrors();
      if (fileVal && type === "img") {
        if (addCrop) {
          setOpenCrop(true);
          setImageToCrop(fileVal);
        } else {
          finalSubmitFile(fileVal);
        }

        // reader.readAsDataURL(fileVal);
        // reader.addEventListener("load", async () => {
        //   getFile && getFile(reader.result);
        //   const imageUrl = await uploadGeneralImage({
        //     name: fileVal?.name || "",
        //     image: `${reader?.result}`,
        //   });

        //   if (imageUrl?.path) {
        //     setFileUrl(imageUrl?.path);
        //     setValue(name, imageUrl?.path as any);
        //     onFileUpload && onFileUpload(imageUrl?.path);
        //   }
        // });
      } else {
        setFile(fileVal);
      }
    }
  };

  const finalSubmitFile = (image: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.addEventListener("load", async () => {
      getFile && getFile(reader.result);
      const imageUrl = await uploadGeneralImage({
        name: image?.name || "",
        image: `${reader?.result}`,
      });

      if (imageUrl?.path) {
        setFileUrl(imageUrl?.path);
        setValue(name, imageUrl?.path as any);
        onFileUpload && onFileUpload(imageUrl?.path);
      }
    });
  };

  const uploadGeneralImage = async (image: Base64type) => {
    try {
      if (uploadPayload) {
        uploadPayload(image);
      } else {
        let result = await postGeneralImage({ image: image, url: uploadPath });
        if ("data" in result) {
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
          showToast("Upload Failed", "error");
          return { name: "", path: "" };
        }
      }
    } catch (error) {
      handleError(error);
      showToast("Upload Failed", "error");
      return { name: "", path: "" };
    }
  };

  const handleDelete = () => {
    setValue(name, null as any);
  };
  useEffect(() => {
    if (isReactHook) {
      register(name, {
        required: required ? "This field is required" : false,
        ...rules,
      });
    }
  }, [isReactHook, name, register, required, rules]);

  return (
    <>
      <div className="file-input">
        {labelText && <p className="label_text">{labelText}</p>}
        {watchFile && type === "img" ? (
          <div className={`image_holder`} onClick={() => {}}>
            <img
              src={`${IMAGEURL}${fileUrl ? fileUrl : watchFile}`}
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
                        // onchange handlers (upload directly on change or store file in an external state)
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
                      accept={accept}
                      hidden
                      disabled={isLoading}
                      className="sr-only"
                      type="file"
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
        ) : (
          <label style={{ minHeight: height, width }}>
            <input
              onChange={(e) => {
                let file = e.target.files && e.target?.files[0];
                // onchange handlers (upload directly on change or store file in an external state)
                if (file) {
                  uploadFile(file);
                }
                if (onFileChange && file) {
                  onFileChange(file);
                }
              }}
              name={name}
              {...props}
              ref={fileInputRef}
              accept={accept}
              hidden
              disabled={isLoading}
              className="sr-only"
              type="file"
            />
            {isLoading ? (
              <CircularProgress size="1.5rem" sx={{ zIndex: 10 }} />
            ) : watchFile ? (
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
                // <div className="relative group w-full h-full rounded-xl  flex items-center justify-center cursor-pointer">
                //   <Avatar
                //     src={`${IMAGEURL}${fileUrl ? fileUrl : watchFile}`}
                //     sx={{
                //       width: "100%",
                //       height: "100%",
                //       borderRadius: "0.75rem",
                //       objectFit: "contain",
                //       objectPosition: "center",
                //     }}
                //   ></Avatar>
                //   <div
                //     style={{ background: "rgba(0, 35, 63, 0.5)" }}
                //     className="absolute lg:invisible group-hover:visible transition-all inset-0  flex items-center justify-center rounded-xl cursor-pointer"
                //   >
                //     <Button
                //       type="button"
                //       variant="outlined"
                //       className="pointer-events-none"
                //       sx={{ borderColor: "white", color: "white" }}
                //     >
                //       Replace Image
                //     </Button>
                //   </div>
                // </div>
                <></>
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
                        <p>
                          Recommended dimension:{" "}
                          {dimensions || "930px x 1163px"}
                        </p>
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

      {error && <div className="input-err-msg">{error.message}</div>}
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

export default FileInput;
