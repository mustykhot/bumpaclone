import { Button, IconButton } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { UploadCloudIcon } from "assets/Icons/UploadCloudIcon";
import { CheckIcon } from "assets/Icons/CheckIcon";
import { IMAGEURL } from "utils/constants/general";
import { Base64type, ImageUrl } from "./UploadMultipleProductImage";
import { CircularProgress } from "@mui/material";
import { handleError } from "utils";
import { useUploadGeneralImageMutation } from "services";
import { showToast } from "store/store.hooks";
import MultipleCropModal from "./MultipleCropModal";

type UploadMultiImageType = {
  name: string;
  maxFiles?: number;
  dashed?: boolean;
  required?: boolean;
  setSelectedImage?: React.Dispatch<any> | null;
  isVariation?: boolean;
  label?: string;
  customChange?: Function;
  defaultImages?: any;
  uploadPath?: string;
  handleFieldChange?: any;
  imageIndex?: any;
};

function NormalUploadMultiImage({
  name,
  maxFiles = 20,
  dashed = true,
  required = false,
  isVariation = false,
  setSelectedImage,
  label,
  customChange,
  defaultImages,
  uploadPath,
  handleFieldChange,
  imageIndex,
  ...props
}: UploadMultiImageType) {
  // const [imageArray, setImageArray] = useState([]);

  const [imageFile, setImageFile] = useState<any>(
    defaultImages ? defaultImages : []
  );
  const [imageUrlList, setImageUrlList] = useState<ImageUrl[]>(
    defaultImages ? defaultImages : []
  );
  const fileInputRef = useRef<any>(null);
  const [thumbnail, setThumbnail] = useState("");
  const [variantImg, setVariantImg] = useState("");
  const [postGeneralImage, { isLoading }] = useUploadGeneralImageMutation();
  const [openCrop, setOpenCrop] = useState(false);
  const [imagesToCrop, setImagesToCrop] = useState<any[]>([]);

  // const [postProductImage, { isLoading: loadPostProductImage }] =
  //   usePostProductImageMutation();
  const [error, setError] = useState("");
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      setError("");
      setOpenCrop(true);
      setImagesToCrop(acceptedFiles);
      // setImageFile([...imageFile, ...acceptedFiles]);
      // acceptedFiles.forEach((file: any) => {
      //   const reader = new FileReader();
      //   reader.readAsDataURL(file);
      //   reader.addEventListener("load", async () => {
      //     const imageUrl = await uploadGeneralImage({
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
      {file.path} is greater than 5MB
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
      setError(`${selectedFiles[0]?.name} is greater than 5MB`);
    } else {
      setError("");
      setOpenCrop(true);
      setImagesToCrop(selectedFileArray);
      // setImageFile((prev: any) => [...prev, ...selectedFileArray]);
      // selectedFileArray.forEach((file: any) => {
      //   const reader = new FileReader();
      //   reader.readAsDataURL(file);
      //   reader.addEventListener("load", async () => {
      //     // for upload product image

      //     const imageUrl = await uploadGeneralImage({
      //       name: file.name,
      //       image: `${reader?.result}`,
      //     });
      //     if (imageUrl.path) {
      //       setImageUrlList((prev) => [...prev, imageUrl]);
      //     }
      //   });
      // });
    }
  };

  const finalSubmitFile = (images: any[]) => {
    setImageFile((prev: any) => [...prev, ...images]);
    images.forEach((file: any) => {
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
  };

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

  // you can add others under here

  const handleDelete = (item: any) => {
    const updatedFiles = imageUrlList.filter(
      (file: any) => file.path !== item.path
    );
    setImageUrlList(updatedFiles);
  };

  useEffect(() => {
    if (imageUrlList) {
      customChange && customChange(imageUrlList);
    }
  }, [imageUrlList, customChange]);

  useEffect(() => {
    if (variantImg) {
      setSelectedImage && setSelectedImage(variantImg);
    }
  }, [variantImg, setSelectedImage]);
  return (
    <div className="multiple_upload_section">
      {label && <label>{label}</label>}
      <div
        // htmlFor={props.name ? props.name : "logo"}
        className={`multiple_upload_container ${
          imageUrlList && imageUrlList?.length >= 1 ? "remove_bg" : ""
        } `}
      >
        {imageUrlList && imageUrlList?.length >= 1 ? (
          <div className="uploaded_image_container  ">
            {imageUrlList &&
              imageUrlList?.slice(0, maxFiles).map((item: any, i: any) => (
                <div
                  className={`image_holder ${
                    thumbnail === item || variantImg === item ? "thumbnail" : ""
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
                  {thumbnail !== item && !isVariation && (
                    <div className="absolute_thumbnail_box">
                      <Button
                        onClick={() => {
                          setThumbnail(item);
                          // for thumbnail image in product bulk edit
                          handleFieldChange &&
                            handleFieldChange("image", imageIndex, item.path);
                        }}
                        variant="contained"
                        className="make_thumbnail"
                      >
                        Make Thumbnail
                      </Button>
                    </div>
                  )}

                  {thumbnail === item && !isVariation && (
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

            {imageUrlList?.length < maxFiles && (
              <label htmlFor={name} className="final_label">
                {isLoading ? (
                  <CircularProgress size="1.5rem" />
                ) : (
                  <>
                    <UploadCloudIcon />
                    <p>Upload Image</p>
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
                      className="absolute inset-0 "
                      hidden
                    />
                  </>
                )}
              </label>
            )}
          </div>
        ) : (
          <>
            {isLoading ? (
              <CircularProgress size="1.5rem" sx={{}} />
            ) : (
              <div onClick={(e) => e.stopPropagation()}>
                <label htmlFor={name} className="initial_label">
                  <UploadCloudIcon />
                  {/* {isDragActive ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    
                  )} */}
                  <div className="text_box">
                    <p className="drag ">Click to Upload image</p>

                    <p>Recommended dimension: 930 x 1163</p>
                    <p> Max file size: 5mb</p>
                  </div>
                </label>

                <input
                  // {...getInputProps()}
                  required
                  {...props}
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  multiple
                  onChange={onSelectFile}
                  ref={fileInputRef}
                  id={name || "photo"}
                  name={name || "photo"}
                  // id={props.name ? props.name : "photos"}
                  // name={props.name ? props.name : "photos"}
                  className="absolute inset-0 "
                  hidden
                />
              </div>
            )}
          </>
        )}
      </div>
      <div className="">{fileRejectionItems}</div>
      {error && (
        <div className={` ${!error && "hidden"} input-err-msg pt-[-10rem] `}>
          <p className="error_message">{error}</p>
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
  );
}

export default NormalUploadMultiImage;
