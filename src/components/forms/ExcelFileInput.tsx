import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useState,
  useEffect,
  useCallback,
} from "react";

import { get, useFormContext, FieldValues } from "react-hook-form";
import { getFileSize, handleError } from "utils";
import { Avatar, Button, CircularProgress } from "@mui/material";
// import { useUploadFileMutation } from 'services';
import { validationProps } from "./ValidatedInput";
import { UploadIcon } from "assets/Icons/UploadIcon";
import { ClearIcon } from "assets/Icons/ClearIcon";
import { FileIcon } from "assets/Icons/FileIcon";
import { IconButton } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useUploadGeneralImageMutation } from "services";
import { Base64type } from "./UploadMultipleProductImage";
import { showToast } from "store/store.hooks";
import { IMAGEURL } from "utils/constants/general";

export type defaultFileType = {
  name?: string;
  path?: string;
};

type Props = {
  type?: "file" | "img";
  height?: string | number;
  width?: string | number;

  label?: string;
  required?: boolean;
  isExcel?: boolean;
  labelText?: string;
  uploadPath?: string;
  isReactHook?: boolean;
  extraType?: string;
  onUpload?: (args: string) => void;
  defaultFile?: defaultFileType;
  onFileChange?: (args: File) => void;
  onFileUpload?: (args: any) => void;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

function ExcelFileInput<TFormValues extends FieldValues>({
  id,
  className = "",
  required = true,
  type,
  height,
  width,
  onUpload,
  label,
  onFileChange,
  name,
  rules,
  isReactHook = true,
  labelText,
  defaultFile,
  isExcel = false,
  uploadPath,
  extraType,
  onFileUpload = () => {},
  ...props
}: validationProps<TFormValues> & Props) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<TFormValues>();
  const watchFile = watch(name);
  const [file, setFile] = useState<any>("");
  const [fileUrl, setFileUrl] = useState<any>(watchFile ? watchFile : "");

  const [postGeneralImage, { isLoading }] = useUploadGeneralImageMutation();

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
            setValue(name, imageUrl.path as any);
          }
        });
      }
    },
    // eslint-disable-next-line
    [file]
  );

  const { isDragActive } = useDropzone({
    validator: fileSizeValidator,
    onDrop,
    maxFiles: 1,
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

  const error = get(errors, name);

  const uploadFile = (fileVal: File) => {
    const reader = new FileReader();
    setFile(fileVal);
    if (fileVal && type === "img") {
      reader.readAsDataURL(fileVal);
      reader.addEventListener("load", async () => {
        const imageUrl = await uploadGeneralImage({
          name: fileVal?.name || "",
          image: `${reader?.result}`,
        });
        if (imageUrl.path) {
          setFileUrl(imageUrl.path);
          setValue(name, imageUrl.path as any);
          onFileUpload && onFileUpload(imageUrl.path);
        }
      });
    } else {
      setFile(fileVal);
    }
  };

  const uploadGeneralImage = async (image: Base64type) => {
    try {
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
    } catch (error) {
      handleError(error);
      showToast("Upload Failed", "error");
      return { name: "", path: "" };
    }
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
        {isExcel && (file || watchFile) ? (
          <div className="display_excel">
            <div className="text_box">
              <FileIcon />
              <p className="excel_name"> {file?.name}</p>
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
            // htmlFor={name}
            style={{ minHeight: height, width }}
            className=""
          >
            {isLoading ? (
              <CircularProgress size="1.5rem" sx={{ zIndex: 10 }} />
            ) : fileUrl ? (
              // <div className="flex flex-col py-2  justify-center items-center ">
              //   <UploadIcon />
              //   <div className="font-medium flex flex-col  justify-center items-center">
              //     <p className="text-sm text-center my-2  max-w-full">
              //       {file?.name || defaultFile?.name}
              //     </p>
              //     <small className="text-grey text-center text-xs">
              //       {getFileSize(file?.size)}
              //     </small>
              //   </div>
              // </div>
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
                <div className="relative group w-full h-full rounded-xl  flex items-center justify-center cursor-pointer">
                  <Avatar
                    src={`${IMAGEURL}${fileUrl}`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "0.75rem",
                    }}
                  ></Avatar>
                  <div
                    style={{ background: "rgba(0, 35, 63, 0.5)" }}
                    className="absolute lg:invisible group-hover:visible transition-all inset-0  flex items-center justify-center rounded-xl cursor-pointer"
                  >
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => {}}
                      className="pointer-events-none"
                      sx={{ borderColor: "white", color: "white" }}
                    >
                      Replace Image
                    </Button>
                  </div>
                </div>
              )
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
            <input
              // {...getInputProps()}
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
              hidden
              // disabled={isLoading}
              className="sr-only"
              type="file"
            />
          </label>
        )}
      </div>

      {error && <div className="input-err-msg">{error.message}</div>}
    </>
  );
}

export default ExcelFileInput;
