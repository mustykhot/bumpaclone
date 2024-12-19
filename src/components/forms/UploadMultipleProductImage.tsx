import { Button, IconButton } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext, get } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { UploadCloudIcon } from "assets/Icons/UploadCloudIcon";
import { CheckIcon } from "assets/Icons/CheckIcon";
import { usePostProductImageMutation } from "services";
import { handleError } from "utils";
import { CircularProgress } from "@mui/material";
import { IMAGEURL } from "utils/constants/general";
import { showToast } from "store/store.hooks";
import Modal from "components/Modal";
import MultipleCropModal from "./MultipleCropModal";

type UploadMultipleProductImageType = {
  name: string;
  maxFiles?: number;
  dashed?: boolean;
  required?: boolean;
  setSelectedImage?: React.Dispatch<any>;
  isVariation?: boolean;
  label?: string;
  defaultImage?: any[] | null;
  defaultThumbnail?: string;
  addCrop?: boolean;
  isEdit?: boolean;
};
export type ImageUrl = {
  name: string;
  path: string;
  thumbnail_path?: string;
};
export type Base64type = {
  name: string;
  image: string;
};

function UploadMultipleProductImage({
  name,
  maxFiles = 10000,
  dashed = true,
  required = false,
  isVariation = false,
  setSelectedImage,
  label,
  defaultImage,
  defaultThumbnail,
  addCrop = true,
  isEdit = false,
  ...props
}: UploadMultipleProductImageType) {
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
  const fileInputRef = useRef<any>(null);
  const [openCrop, setOpenCrop] = useState(false);
  const [imagesToCrop, setImagesToCrop] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState(watchImage ? watchImage : []);
  const [postProductImage, { isLoading: loadPostProductImage }] =
    usePostProductImageMutation();
  const [imageUrlList, setImageUrlList] = useState<ImageUrl[]>(
    watchImage ? watchImage : []
  );
  const [thumbnail, setThumbnail] = useState("");
  const [variantImg, setVariantImg] = useState("");
  const error = get(errors, name);
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      clearErrors();
      if (addCrop) {
        setOpenCrop(true);
        setImagesToCrop(acceptedFiles);
      } else {
        finalSubmitFile(acceptedFiles);
      }

      // setImageFile([...imageFile, ...acceptedFiles]);

      // acceptedFiles.forEach((file: any) => {
      //   const reader = new FileReader();
      //   reader.readAsDataURL(file);
      //   reader.addEventListener("load", async () => {
      //     const imageUrl = await uploadProductImage({
      //       name: file.name,
      //       image: `${reader?.result}`,
      //     });
      //     if (imageUrl.path) {
      //       setImageUrlList((prev) => [...prev, imageUrl]);
      //     }
      //   });
      // });
    },
    // eslint-disable-next-line
    [imageFile]
  );
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      validator: fileSizeValidator,
      onDrop,
      maxFiles: maxFiles || 20,
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
      {/* <ul>
          {errors.map(e => (
            <li key={e.code}>{e.message}</li>
          ))}
        </ul> */}
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
      if (addCrop) {
        setOpenCrop(true);
        setImagesToCrop(selectedFileArray);
      } else {
        finalSubmitFile(selectedFileArray);
      }
    }
  };

  const finalSubmitFile = (images: any[]) => {
    setImageFile((prev: any) => [...prev, ...images]);
    images.forEach((file: any) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener("load", async () => {
        const imageUrl = await uploadProductImage({
          name: file.name,
          image: `${reader?.result}`,
        });
        if (imageUrl.path) {
          setImageUrlList((prev) => [...prev, imageUrl]);
        }
      });
    });
  };

  //   upload function
  const uploadProductImage = async (image: Base64type) => {
    try {
      let result = await postProductImage(image);
      if ("data" in result) {
        const imageUrlObj = {
          name: result.data.image.name,
          path: result.data.image.path,
          thumbnail_path: result.data.image.thumbnail_path,
        };
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

  const handleDelete = (item: any) => {
    const updatedFiles = imageUrlList.filter(
      (file: any) => file.path !== item.path
    );

    setImageUrlList(updatedFiles);
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
    if (variantImg) {
      setSelectedImage && setSelectedImage(variantImg);
    }
  }, [variantImg, setSelectedImage]);

  useEffect(() => {
    setThumbnail(defaultThumbnail || "");
  }, [defaultThumbnail]);
  useEffect(() => {
    if (defaultImage) {
      setImageUrlList(defaultImage);
    }
  }, [defaultImage]);

  return (
    <>
      <div className="multiple_upload_section">
        {label && (
          <label>
            {label}
            {!required && " (Optional)"}
          </label>
        )}
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
                  <div
                    className={`image_holder ${
                      thumbnail === item.name || variantImg === item
                        ? "thumbnail"
                        : ""
                    }`}
                    key={i}
                    onClick={() => {
                      isVariation && setVariantImg(item);
                    }}
                  >
                    <img
                      src={`${IMAGEURL}${item.path}`}
                      alt="img"
                      className="image"
                    />
                    {thumbnail !== item.name && !isVariation && (
                      <div className="absolute_thumbnail_box">
                        <Button
                          onClick={() => {
                            setThumbnail(item.name);
                            setValue("image", item);
                            if (isEdit) {
                              setValue("thumbImage", item);
                            }
                          }}
                          variant="contained"
                          className="make_thumbnail"
                        >
                          Make Thumbnail
                        </Button>
                      </div>
                    )}

                    {thumbnail === item.name && !isVariation && (
                      <div className="absolute_thumbnail_text">
                        <p>Thumbnail</p>
                      </div>
                    )}
                    {variantImg === item && isVariation && (
                      <div className="absolute_variation_text">
                        <CheckIcon />{" "}
                      </div>
                    )}
                    {!isVariation && (
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
                    )}
                  </div>
                ))}

              {watchImage?.length < maxFiles && (
                <label htmlFor={name} className="final_label">
                  {loadPostProductImage ? (
                    <CircularProgress size="1.5rem" />
                  ) : (
                    <>
                      <UploadCloudIcon />
                      <p>Upload Images</p>
                      <input
                        accept="image/png, image/gif, image/jpeg"
                        required={false}
                        multiple
                        {...props}
                        ref={fileInputRef}
                        type="file"
                        onChange={onSelectFile}
                        id={name || "photo"}
                        name={name || "photo"}
                        // className="absolute inset-0 "
                        hidden
                      />
                    </>
                  )}
                </label>
              )}
            </div>
          ) : (
            <>
              {loadPostProductImage ? (
                <CircularProgress size="1.5rem" sx={{}} />
              ) : (
                <div {...getRootProps()} onClick={(e) => e.stopPropagation()}>
                  <label htmlFor={name} className="initial_label">
                    <UploadCloudIcon />
                    {isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <div className="text_box">
                        <p className="drag ">Drag or drop image</p>

                        <p>Recommended dimension: 930px x 1163px</p>
                        <p> Max file size: 5mb</p>
                      </div>
                    )}
                  </label>{" "}
                  <input
                    {...getInputProps()}
                    accept="image/png, image/gif, image/jpeg"
                    required={false}
                    {...props}
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={onSelectFile}
                    id={name || "photo"}
                    name={name || "photo"}
                    // className="absolute inset-0 "
                    hidden
                  />
                </div>
              )}
            </>
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

        <MultipleCropModal
          openModal={openCrop}
          closeModal={() => {
            setOpenCrop(false);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
          images={imagesToCrop}
          finalAction={(images: any[]) => {
            finalSubmitFile(images);
          }}
        />
      </div>
    </>
  );
}

export default UploadMultipleProductImage;
