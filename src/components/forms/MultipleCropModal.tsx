import { Button, CircularProgress, IconButton, Slider } from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";
import Modal from "components/Modal";
import { useEffect, useState } from "react";
import uuid from "react-uuid";
import "./crop.scss";
import Cropper from "react-easy-crop";
import { zoomPercent } from "utils";
import getCroppedImg, { resizeFile } from "utils/cropImage";
import { showToast } from "store/store.hooks";
import { MinusIcon } from "assets/Icons/MinusIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";

type Props = {
  openModal: boolean;
  closeModal: () => void;
  images: any[];
  finalAction: any;
};

const MultipleCropModal = ({
  closeModal,
  openModal,
  images,
  finalAction,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [homeImages, setHomeImages] = useState<any[]>([]);
  const [homeImagesToResize, setHomeImagesToResize] = useState<any[]>([]);
  const [resizedImages, setResizedImages] = useState<any[]>([]);
  const [imageToCrop, setImageToCrop] = useState<any>(null);
  const [imageToResize, setImageToResize] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<any>(1);
  const [rotation, setRotation] = useState<any>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [step, setStep] = useState(0);
  const [isLoadingResize, setIsLoadingResize] = useState(false);
  const [selectResizeType, setSelectResizeType] = useState<"crop" | "fit" | "">(
    ""
  );
  const updateHomeImage = (newItem: any) => {
    const updatedImages = [...homeImages];
    const idToUpdate = newItem.id;
    const indexToUpdate = updatedImages.findIndex(
      (item) => item.id === idToUpdate
    );
    if (indexToUpdate !== -1) {
      updatedImages[indexToUpdate] = newItem;
    }
    setHomeImages(updatedImages);
  };
  const cropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const cropImage = async () => {
    setIsLoading(true);
    try {
      //@ts-ignore
      const { file, url } = await getCroppedImg(
        URL.createObjectURL(imageToCrop?.image),
        croppedAreaPixels,
        rotation,
        imageToCrop?.name
      );
      updateHomeImage({ id: imageToCrop?.id, image: file });
      showToast("Cropped Succefully", "success");
    } catch (error) {
      showToast("Something went wrong", "error");
    }
    setIsLoading(false);
  };
  const closeModalAndResetStates = () => {
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
    setImageToCrop(null);
    setHomeImages([]);
    setStep(0);
    setResizedImages([]);
    setImageToResize(null);
    setSelectResizeType("");
    closeModal();
  };

  const functionToResizeFile = async ({
    fileInput,
    name,
    id,
  }: {
    fileInput: any;
    name: string;
    id: string;
  }) => {
    try {
      const file = fileInput;
      const image = await resizeFile(file, 930, 1163);
      setResizedImages((prev: any) => [...prev, { file: image, name, id }]);
    } catch (err) {
      // console.log(err);
    }
  };

  const resizeAllfiles = async () => {
    setIsLoadingResize(true);
    for (let index = 0; index < homeImagesToResize?.length; index++) {
      await functionToResizeFile({
        fileInput: homeImagesToResize[index]?.image,
        name: homeImagesToResize[index]?.name,
        id: homeImagesToResize[index]?.id,
      });
    }
    setStep(1);
    setSelectResizeType("fit");
    setIsLoadingResize(false);
  };

  useEffect(() => {
    let newImageList = images.map((item) => {
      return {
        image: item,
        id: `${uuid()}`,
        name: item?.name,
      };
    });
    setHomeImages(newImageList);
    setImageToCrop(newImageList[0]);
    setHomeImagesToResize(newImageList);
  }, [images]);
  useEffect(() => {
    if (resizedImages && resizedImages?.length) {
      setImageToResize(resizedImages[0]);
    }
  }, [resizedImages]);
  return (
    <Modal
      closeOnOverlayClick={false}
      openModal={openModal}
      closeModal={closeModal}
      className="increaseZ"
    >
      <div className={`crop_modal_box ${step === 0 ? "smaller" : ""}`}>
        <div className="topic_side_of_modal">
          <h2>
            {step === 0
              ? "Crop Image"
              : selectResizeType === "fit"
              ? "Preview Images"
              : "Crop Image"}
          </h2>
          <div className="flex gap-2 items-center">
            {step === 1 && (
              <div className="button_box finish_btn_for_crop">
                <Button
                  onClick={() => {
                    const finalset = homeImages.map((item) => item.image);
                    finalAction(finalset);
                    closeModalAndResetStates();
                  }}
                  className="primary_styled_button"
                  variant="contained"
                  type="button"
                >
                  {homeImages?.length === 1 ? "Finish" : "Finish"}
                </Button>
              </div>
            )}
            <IconButton
              type="button"
              onClick={() => {
                if (step === 1) {
                  setStep(0);
                  setSelectResizeType("");
                } else {
                  closeModalAndResetStates();
                }
              }}
              className="icon_button_container"
            >
              <XIcon />
            </IconButton>
          </div>
        </div>
        {step === 0 && !selectResizeType && (
          <div className="select_resize_type">
            <p>Do you wish to crop your images?</p>
            <div className="btn_flex ">
              <Button
                onClick={() => {
                  finalAction(images);
                  closeModal();
                }}
                className=""
                variant="outlined"
              >
                No, Upload Images
              </Button>
              <Button
                onClick={() => {
                  setStep(1);
                  setSelectResizeType("crop");
                }}
                className="primary_styled_button"
                variant="contained"
              >
                Yes, Crop Images
              </Button>
              {/* <Button
                onClick={() => {
                  // setSelectResizeType("fit");
                  resizeAllfiles();
                }}
                variant="outlined"
              >
                {isLoadingResize ? (
                  <CircularProgress size="1.5rem" sx={{ color: "#009444" }} />
                ) : (
                  "Resize images"
                )}
              </Button> */}
            </div>
            {/* <div className="explanation_box">
              <p className="explanation">Explanation</p>
              <ul>
                <li>
                  Upload Images:
                  <span>
                    This allows you to upload image without cropping or resizing
                  </span>
                </li>
                <li>
                  Crop Images:
                  <span>This allows you to crop images before uploading</span>
                </li>
                <li>
                  Resize Images:
                  <span>This allows you to resize images before uploading</span>
                </li>
              </ul>
            </div> */}
          </div>
        )}
        {step === 1 && selectResizeType === "crop" && (
          <>
            <div className="area_for_cropping">
              {imageToCrop && (
                <Cropper
                  image={URL.createObjectURL(imageToCrop?.image)}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={930 / 1163}
                  onZoomChange={setZoom}
                  onCropChange={setCrop}
                  onRotationChange={setRotation}
                  onCropComplete={cropComplete}
                />
              )}
            </div>
            <div className="zoom_rotate_save_Area">
              <div className="zoom_cover">
                <div className="zoom_box">
                  <p>Zoom: {zoomPercent(zoom)} </p>
                  <div className="slide_and_control">
                    <IconButton
                      onClick={() => {
                        if (zoom <= 1) {
                        } else {
                          setZoom(zoom - 0.1);
                        }
                      }}
                    >
                      <MinusIcon stroke="#0D1821" />
                    </IconButton>
                    <Slider
                      valueLabelDisplay="auto"
                      valueLabelFormat={zoomPercent}
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={(e, zoom) => setZoom(zoom)}
                    />
                    <IconButton
                      onClick={() => {
                        if (zoom <= 30) {
                          setZoom(zoom + 0.1);
                        }
                      }}
                    >
                      <PlusIcon stroke="#0D1821" />
                    </IconButton>
                  </div>
                </div>
                <div className="zoom_box">
                  <p>Rotation: {rotation} </p>
                  <div className="slide_and_control">
                    <IconButton
                      onClick={() => {
                        if (rotation <= 0) {
                        } else {
                          setRotation(rotation - 30);
                        }
                      }}
                    >
                      <MinusIcon stroke="#0D1821" />
                    </IconButton>
                    <Slider
                      valueLabelDisplay="auto"
                      min={0}
                      max={360}
                      value={rotation}
                      onChange={(e, rotation) => setRotation(rotation)}
                    />
                    <IconButton
                      onClick={() => {
                        if (rotation <= 360) {
                          setRotation(rotation + 30);
                        }
                      }}
                    >
                      <PlusIcon stroke="#0D1821" />
                    </IconButton>
                  </div>
                </div>{" "}
              </div>
              <Button
                className="save_crop_btn"
                onClick={cropImage}
                variant="outlined"
              >
                {isLoading ? (
                  <CircularProgress size="1.5rem" sx={{ color: "#009444" }} />
                ) : (
                  "Crop & Save"
                )}
              </Button>
            </div>
            <div className="image_list_display_section remove_border">
              {homeImages.map((item: any, i: number) => (
                <div
                  onClick={() => {
                    setImageToCrop(item);
                  }}
                  className={`image_holder ${
                    item.id === imageToCrop?.id ? "active" : ""
                  }`}
                  key={i}
                >
                  <img src={URL.createObjectURL(item.image)} alt="crop" />
                </div>
              ))}
            </div>
            {/* <div className="button_box">
              <Button
                onClick={() => {
                  const finalset = homeImages.map((item) => item.image);
                  finalAction(finalset);
                  closeModalAndResetStates();
                }}
                className="primary_styled_button"
                variant="contained"
                type="button"
              >
                {homeImages?.length === 1 ? "Upload Image" : "Upload Images"}
              </Button>
            </div> */}
          </>
        )}
        {step === 1 && selectResizeType === "fit" && (
          <div className="fit_container">
            <div className="area_for_cropping">
              {imageToResize && (
                <img
                  src={URL.createObjectURL(imageToResize?.file)}
                  alt="resized"
                />
              )}
            </div>
            <div className="image_list_display_section">
              {resizedImages.map((item: any, i: number) => (
                <div
                  onClick={() => {
                    setImageToResize(item);
                  }}
                  className={`image_holder ${
                    item?.id === imageToResize?.id ? "active" : ""
                  }`}
                  key={i}
                >
                  <img src={URL.createObjectURL(item?.file)} alt="crop" />
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 1 && (
          <p className="number_of_image">Uploaded Images: {images?.length}</p>
        )}
      </div>
    </Modal>
  );
};

export default MultipleCropModal;
