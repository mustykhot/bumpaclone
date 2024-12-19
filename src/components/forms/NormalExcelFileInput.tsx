import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useState,
  useEffect,
  useCallback,
} from "react";

import { FieldValues } from "react-hook-form";
import { getFileSize, handleError } from "utils";
import { CircularProgress } from "@mui/material";
// import { useUploadFileMutation } from 'services';
import { validationProps } from "./ValidatedInput";
import { UploadIcon } from "assets/Icons/UploadIcon";
import { ClearIcon } from "assets/Icons/ClearIcon";
import { FileIcon } from "assets/Icons/FileIcon";
import { IconButton } from "@mui/material";
import { showToast } from "store/store.hooks";
import { useUploadGeneralImageMutation } from "services";
import { Base64type } from "./UploadMultipleProductImage";
import { useDropzone } from "react-dropzone";
import { SETTINGSROUTES } from "utils/constants/apiroutes";

export type defaultFileType = {
  url?: string;
  name?: string;
  mime_type?: string;
  size?: number;
};

type Props = {
  type?: "file" | "img";
  accepty?: string;
  height?: string | number;
  width?: string | number;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  isExcel?: boolean;
  labelText?: string;
  isReactHook?: boolean;
  onUpload?: (args: string) => void;
  defaultFile?: defaultFileType;
  uploadPath?: string;
  onFileChange?: (args: File) => void;
  onFileUpload?: (args: any) => void;
  extraType?: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

function NormalExcelFileInput<TFormValues extends FieldValues>({
  id,
  className = "",
  required = true,
  type = "img",
  accept = "image/*",
  height,
  width,
  onUpload,
  label,
  onFileChange,
  disabled,
  name,
  rules,
  isReactHook = true,
  labelText,
  defaultFile,
  uploadPath,
  isExcel = false,
  extraType,
  onFileUpload = () => {},
  ...props
}: validationProps<TFormValues> & Props) {
  const [file, setFile] = useState<any>("");
  const [fileUrl, setFileUrl] = useState<any>();

  const [postGeneralImage, { isLoading }] = useUploadGeneralImageMutation();
  // const { uploadImage, uploadSuccess, uploadError } = useSingleUploadHook();

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      setFile(acceptedFiles[0]);
      if (acceptedFiles && type === "img") {
        const reader = new FileReader();
        reader.readAsDataURL(acceptedFiles[0]);
        reader.addEventListener("load", async () => {
          const imageUrl = await uploadGeneralImage({
            name: file.name,
            image: `${reader?.result}`,
          });
          if (imageUrl.path) {
            setFileUrl(imageUrl.path);
            onFileUpload && onFileUpload(imageUrl.path);
          }
        });
      }
    },
    [file]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      validator: fileSizeValidator,
      onDrop,
      maxFiles: 1,
      disabled: disabled || isLoading,
    });
  function fileSizeValidator(file: any) {
    if (file?.size > 5_000_000) {
      return {
        code: "file-too-large",
        message: `File is larger than 5MB`,
      };
    }
    return null;
  }

  const uploadFile = (file: File) => {
    // setValue(name, file as any);
    const reader = new FileReader();
    setFile(file);
    if (file && type === "img") {
      reader.readAsDataURL(file);
      reader.addEventListener("load", async () => {
        const imageUrl = await uploadGeneralImage({
          name: file.name,
          image: `${reader?.result}`,
        });

        if (imageUrl.path) {
          setFileUrl(imageUrl.path);
          onFileUpload && onFileUpload(imageUrl.path);
        }
      });
    } else if (file) {
      setFile(file);
    }
  };

  //   upload Profile Avatar function
  const uploadGeneralImage = async (image: Base64type) => {
    try {
      const payload =
        uploadPath === `${SETTINGSROUTES.STORE_UPLOAD_LOGO}`
          ? { logo: image, url: uploadPath }
          : { image: image, url: uploadPath };
      let result = await postGeneralImage(payload);
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
        return { name: "", path: "" };
      }
    } catch (error) {
      handleError(error);
      return { name: "", path: "" };
    }
  };

  return (
    <>
      <div className="file-input">
        {labelText && <p className="label_text">{labelText}</p>}
        {isExcel && (file || defaultFile) ? (
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
          // <div onClick={(e) => e.stopPropagation()} {...getRootProps()}>

          <label
            style={{ minHeight: height, width }}
            // htmlFor={name}
            className=""
          >
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
              disabled={isLoading}
              className="sr-only"
              type={"file"}
              accept={accept}
            />
            {isLoading ? (
              <CircularProgress size="1.5rem" sx={{ zIndex: 10 }} />
            ) : file || defaultFile ? (
              <div className="flex flex-col py-2  justify-center items-center ">
                <UploadIcon />

                <div className="font-medium flex flex-col  justify-center items-center">
                  <p className="text-sm text-center my-2  max-w-full">
                    {file?.name || defaultFile?.name}
                  </p>
                  <small className="text-grey text-center text-xs">
                    {getFileSize(file?.size)}
                  </small>
                </div>
              </div>
            ) : (
              <div className=" empty_upload initial_label ">
                {isDragActive ? (
                  "Drop files here"
                ) : (
                  <>
                    <UploadIcon />
                    {label ? (
                      <span className="text-base">{label}</span>
                    ) : (
                      <div className="text_box">
                        <p className="drag ">Click to select image</p>

                        <p>Recommended dimension: 930 x 1163</p>
                        <p> Max file size: 5mb</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </label>
        )}
      </div>
    </>
  );
}

export default NormalExcelFileInput;
