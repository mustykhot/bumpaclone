import { IconButton } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useFormContext, get } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { UploadCloudIcon } from "assets/Icons/UploadCloudIcon";
import { Base64type, ImageUrl } from "./UploadMultipleProductImage";
import { useUploadGeneralImageMutation } from "services";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
import { IMAGEURL } from "utils/constants/general";

type UploadMultiImageType = {
  name: string;
  maxFiles?: number;
  dashed?: boolean;
  required?: boolean;
  setSelectedImage?: React.Dispatch<any>;
  isVariation?: boolean;
  label?: string;
  defaultImage?: any[] | null;

  uploadPath?: string;
};

function UploadMultiImage({
  name,
  maxFiles = 10,
  dashed = true,
  required = false,
  isVariation = false,
  setSelectedImage,
  label,
  uploadPath,
  defaultImage,
  ...props
}: UploadMultiImageType) {
  // const [imageArray, setImageArray] = useState([]);

  const {
    register,
    setValue,
    setError,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const watchImage = watch(name);
  const [imageFile, setImageFile] = useState(watchImage ? watchImage : []);
  const [imageUrlList, setImageUrlList] = useState<ImageUrl[]>(
    watchImage ? watchImage : []
  );
  const [postGeneralImage, { isLoading }] = useUploadGeneralImageMutation();

  const error = get(errors, name);

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      setImageFile([...imageFile, ...acceptedFiles]);
      acceptedFiles.forEach((file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener("load", async () => {
          const imageUrl = await uploadGeneralImage({
            name: file.name,
            image: `${reader?.result}`,
          });
          if (imageUrl.path) {
            setImageUrlList((prev) => [...prev, imageUrl]);
          }
        });
      });
    },
    [imageFile]
  );

  const uploadGeneralImage = async (image: Base64type) => {
    try {
      let result = await postGeneralImage({ image: image, url: uploadPath });
      if ("data" in result) {
        const imageUrlObj = {
          name: result.data.image.name,
          path: result.data.image.path,
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

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      validator: fileSizeValidator,
      onDrop,
      maxFiles: maxFiles || 10,
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

  const fileRejectionItems = fileRejections.map(({ file }: { file: any }) => (
    <span className="input-err-msg pt-[-10rem]" key={file.path}>
      {file.path} is greater than 1MB
    </span>
  ));

  const onSelectFile = (e: any) => {
    const selectedFiles = e.target.files;
    const selectedFileArray = Array.from(selectedFiles);
    if (selectedFiles[0]?.size > 5_000_000) {
      setError(name, {
        message: `${selectedFiles[0]?.name} is greater than 5MB`,
      });
    } else {
      clearErrors();
      setImageFile((prev: any) => [...prev, ...selectedFileArray]);
      selectedFileArray.forEach((file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener("load", async () => {
          // for upload product image

          const imageUrl = await uploadGeneralImage({
            name: file.name,
            image: `${reader?.result}`,
          });
          if (imageUrl.path) {
            setImageUrlList((prev) => [...prev, imageUrl]);
          }
        });
      });
    }
  };

  const handleDelete = (id: any) => {
    const updatedFiles = imageFile.filter((file: any) => file !== id);
    setImageFile(updatedFiles);
  };

  useEffect(() => {
    setValue(name, imageUrlList);
  }, [imageUrlList, name, setValue]);

  useEffect(() => {
    register(name, {
      required: required ? "This field is required" : "",
    });
  }, [name, register, required]);

  useEffect(() => {
    if (defaultImage) {
      setImageUrlList(defaultImage);
    }
  }, [defaultImage]);

  return (
    <div className="multiple_upload_section">
      {label && <label>{label}</label>}
      <div
        // htmlFor={props.name ? props.name : "logo"}
        className={`multiple_upload_container ${
          watchImage && watchImage?.length >= 1 ? "remove_bg" : ""
        } `}
      >
        {watchImage && watchImage?.length >= 1 ? (
          <div className="uploaded_image_container  ">
            {watchImage &&
              watchImage?.slice(0, maxFiles).map((item: any, i: any) => (
                <div className={`image_holder `} key={i}>
                  <img
                    src={`${IMAGEURL}${item.path}`}
                    alt="img"
                    className="image"
                  />

                  <IconButton
                    component="label"
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
                      handleDelete(item);
                      // removeFile(i);
                    }}
                  >
                    <TrashIcon />
                  </IconButton>
                </div>
              ))}

            {imageFile?.length < maxFiles && (
              <label htmlFor={name} className="final_label">
                <UploadCloudIcon />
                <p>Upload Images</p>
                <input
                  accept="image/* "
                  required={false}
                  multiple
                  {...props}
                  type="file"
                  onChange={onSelectFile}
                  id={name || "photo"}
                  name={name || "photo"}
                  // className="absolute inset-0 "
                  hidden
                />
              </label>
            )}
          </div>
        ) : (
          <div {...getRootProps()} onClick={(e) => e.stopPropagation()}>
            <label htmlFor={name} className="initial_label">
              <UploadCloudIcon />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <div className="text_box">
                  <p className="drag ">Drag or drop image</p>

                  <p>Recommended dimension: 930 x 1163</p>
                  <p> Max file size: 5mb</p>
                </div>
              )}
            </label>{" "}
            <input
              {...getInputProps()}
              required
              {...props}
              type="file"
              accept="image/*"
              multiple
              onChange={onSelectFile}
              id={name || "photo"}
              name={name || "photo"}
              // className="absolute inset-0 "
              hidden
            />
          </div>
        )}
      </div>
      <div className="">{fileRejectionItems}</div>
      {error && error?.message && (
        <div className={` ${!error && "hidden"} input-err-msg pt-[-10rem] `}>
          <p className="error_message">
            {" "}
            {error?.message || error?.name?.message || ""}
          </p>
        </div>
      )}
    </div>
  );
}

export default UploadMultiImage;
