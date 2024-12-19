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
  image: any;
  finalAction: any;
  aspect: any;
  width: number;
  height: number;
};

const SingleCropModal = ({
  closeModal,
  openModal,
  image,
  finalAction,
  aspect,
  width,
  height,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<any>(1);
  const [rotation, setRotation] = useState<any>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [homeImagesToResize, setHomeImagesToResize] = useState<any[]>([]);
  const [resizedImage, setResizedImage] = useState<any>(null);
  const [imageToResize, setImageToResize] = useState<any>(null);
  const [step, setStep] = useState(0);
  const [isLoadingResize, setIsLoadingResize] = useState(false);
  const [selectResizeType, setSelectResizeType] = useState<"crop" | "fit" | "">(
    ""
  );

  const functionToResizeFile = async ({
    fileInput,
    name,
  }: {
    fileInput: any;
    name: string;
  }) => {
    try {
      const file = fileInput;
      const image = await resizeFile(file, width, height);
      setResizedImage({ image, name });
    } catch (err) {
      // console.log(err);
    }
  };

  const resizeAllfiles = async () => {
    setIsLoadingResize(true);
    if (imageToResize) {
      await functionToResizeFile({
        fileInput: imageToResize?.image,
        name: imageToResize?.name,
      });
    }
    setStep(1);
    setSelectResizeType("fit");
    setIsLoadingResize(false);
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
      // setImageToCrop(file);
      finalAction(file);
      closeModalAndResetStates();
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
    setResizedImage(null);
    setImageToResize(null);
    setStep(0);
    setSelectResizeType("");
    closeModal();
  };
  useEffect(() => {
    if (image) {
      setImageToCrop({
        image: image,
        name: image?.name,
      });
      setImageToResize({
        image: image,
        name: image?.name,
      });
    }
  }, [image]);

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
              ? "Preview Image"
              : "Crop Image"}
          </h2>

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

        {step === 0 && !selectResizeType && (
          <div className="select_resize_type">
            <p>Do you wish to crop your image?</p>
            <div className="btn_flex ">
              <Button
                onClick={() => {
                  finalAction(image);
                  closeModal();
                }}
                className=""
                variant="outlined"
              >
                No, Upload Image
              </Button>
              <Button
                onClick={() => {
                  setStep(1);
                  setSelectResizeType("crop");
                }}
                className="primary_styled_button"
                variant="contained"
              >
                Yes, Crop Image
              </Button>
              {/* <Button
                onClick={() => {
                  resizeAllfiles()
                }}
                variant="outlined"
              >
                {isLoadingResize ? (
                  <CircularProgress size="1.5rem" sx={{ color: "#009444" }} />
                ) : (
                  "Resize image"
                )}
              </Button> */}
            </div>
          </div>
        )}
        {step === 1 && selectResizeType === "crop" && (
          <>
            <div className="area_for_cropping">
              {imageToCrop?.image && (
                <Cropper
                  image={URL.createObjectURL(imageToCrop?.image)}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={aspect ? aspect : 930 / 1163}
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
          </>
        )}
        {step === 1 && selectResizeType === "fit" && (
          <div className="fit_container">
            <div className="area_for_cropping">
              {imageToResize && (
                <img
                  src={URL.createObjectURL(imageToResize?.image)}
                  alt="resized"
                />
              )}
            </div>

            <div className="button_box">
              <Button
                onClick={() => {
                  const finalset = resizedImage?.image;
                  finalAction(finalset);
                  closeModalAndResetStates();
                }}
                className="primary_styled_button"
                variant="contained"
                type="button"
              >
                Upload Image
              </Button>
            </div>
          </div>
        )}

        {/* <div className="button_box">
          <Button
            onClick={() => {
              finalAction(imageToCrop);
              closeModalAndResetStates();
            }}
            variant="contained"
            type="button"
          >
            Upload Image(s)
          </Button>
        </div> */}
      </div>
    </Modal>
  );
};

export default SingleCropModal;
