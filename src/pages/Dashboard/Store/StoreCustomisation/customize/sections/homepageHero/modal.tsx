import { useState } from "react";
import Button from "@mui/material/Button";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { UploadIcon } from "assets/Icons/UploadIcon";
import InputField from "components/forms/InputField";
import TextAreaField from "components/forms/TextAreaField";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { AnyObject } from "Models";
import { useAppDispatch } from "store/store.hooks";
import {
  IMAGE_TYPES,
  IMG_BASE_URL,
  VIDEO_TYPES,
} from "utils/constants/general";
import { handleError, isImageOrVideo } from "utils";
import { useUploadGeneralImageMutation } from "services";
import { CircularProgress, IconButton } from "@mui/material";
import "../style.scss";

type ModalType = {
  openModal: boolean;
  closeModal: () => void;
  homepageHeroInfo: any;
  setHomepageHeroInfo: (data: any) => void;
  saveChanges: () => void;
};

export const HomepageHeroModal = ({
  openModal,
  closeModal,
  homepageHeroInfo,
  setHomepageHeroInfo,
  saveChanges,
}: ModalType) => {
  const dispatch = useAppDispatch();
  const [image, setImage] = useState<any>(null);
  const [video, setVideo] = useState<any>(null);
  const [videoType, setVideoType] = useState<any>("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const maxDescLength = 100;
  const [postGeneralImage, { isLoading: isUploading }] =
    useUploadGeneralImageMutation();

  const handleDescInput = (value: string) => {
    if (value.length <= maxDescLength) {
      setDesc(value);
    }
  };

  const addToHero = () => {
    const media = image ? image : video;
    const type = image ? "image" : "video";
    if (title && desc && media) {
      var newSlide = {
        title,
        desc,
        media,
        media_type: type,
        video_type: videoType,
      };
      if (type === "image") delete newSlide.video_type;
      const data = [...homepageHeroInfo, newSlide];
      setHomepageHeroInfo(data);
      setImage(null);
      setVideo(null);
      setTitle("");
      setDesc("");
    }
  };

  const removeFromHero = (index: number) => {
    const hero = [...homepageHeroInfo];
    if (index > -1) {
      hero.splice(index, 1);
    }
    setHomepageHeroInfo(hero);
  };

  const isMediaUploaded = image ? true : video ? true : false;

  const handleSelectMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(null);
    setVideo(null);

    if (e.target.files) {
      const file = e?.target?.files[0];
      const type = file && isImageOrVideo(file);

      if (type === "image") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
          uploadImage(reader.result);
        };
        reader?.readAsDataURL(file);
      }
      if (type === "video") {
        const videoUrl = URL.createObjectURL(file);
        setVideo(videoUrl);
        setVideoType(file.type);
        uploadVideo(file);
      }
    }
  };

  const uploadImage = async (base64Img: any) => {
    try {
      let payload = {
        url: `/media/image/upload`,
        image: { image: base64Img, name: "brand" },
      };
      let result = await postGeneralImage(payload);
      if ("data" in result) {
        const imgPath = `${IMG_BASE_URL}${result?.data?.image?.path}`;
        setImage(imgPath);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const uploadVideo = async (file: any) => {
    const formData = new FormData();
    formData.append("video", file);
    try {
      let payload = {
        url: `/media/shortVideoUpload`,
        image: formData,
      };
      let result = await postGeneralImage(payload);
      if ("data" in result) {
        const videoPath = result.data.url;
        setVideo(videoPath);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <ModalRight
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <div className="modal_right_children">
        <div className="top_section">
          <ModalRightTitle
            closeModal={() => {
              closeModal();
            }}
            title="Custom Hero"
            children={
              <p className="modal_description">
                Add up to 3 hero slides to be randomly showcased
              </p>
            }
          />

          <div className="customize_modal_body homepage_hero_modal">
            <div className="list">
              {homepageHeroInfo?.map((item: AnyObject, index: number) => (
                <div key={index} className="item">
                  <div className="info">
                    <div className="media">
                      {item?.media_type === "image" && (
                        <img src={item?.media} alt="" />
                      )}

                      {item?.media_type === "video" && (
                        <video autoPlay muted loop playsInline>
                          <source src={item?.media} type={item?.video_type} />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>

                    <div className="text">
                      <p className="title">{item.title}</p>
                      <p className="desc">{item.desc}</p>
                    </div>
                  </div>

                  <IconButton
                    className="icon"
                    onClick={() => removeFromHero(index)}
                  >
                    <TrashIcon stroke="#d90429" />
                  </IconButton>
                </div>
              ))}
            </div>

            {homepageHeroInfo?.length < 3 && (
              <div className="form">
                <div className="media_upload">
                  <div className="preview">
                    {image && <img src={image} alt="preview" />}

                    {video && (
                      <video autoPlay muted loop playsInline>
                        <source src={video} type={videoType} />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>

                  <div className="uploader">
                    <p>
                      Recommended:
                      <br />
                      Max image file size: 150kb
                      <br />
                      Max video file size: 10mb
                    </p>

                    <input
                      id="homeImg"
                      type="file"
                      onChange={handleSelectMedia}
                      accept={`${IMAGE_TYPES}, ${VIDEO_TYPES}`}
                    />

                    <Button
                      className="btn button_component btn_tertiary"
                      startIcon={
                        isUploading ? (
                          <CircularProgress
                            size="1.5rem"
                            sx={{ color: "#9BA2AC" }}
                          />
                        ) : (
                          <UploadIcon />
                        )
                      }
                    >
                      <label htmlFor="homeImg">Upload media</label>
                    </Button>
                  </div>
                </div>

                <div className="others">
                  <InputField
                    type="text"
                    value={title}
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <TextAreaField
                    value={desc}
                    placeholder="Short description"
                    className="h-[90px] w-full p-2"
                    onChange={(e) => handleDescInput(e.target.value)}
                  />
                  <p className="count">
                    {desc?.length}/{maxDescLength}
                  </p>

                  <Button
                    className="btn_tertiary"
                    onClick={addToHero}
                    disabled={
                      !isMediaUploaded || !title || !desc || isUploading
                    }
                  >
                    Add slide
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className=" bottom_section">
          <Button type="button" className="cancel" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            type="button"
            className="save"
            onClick={() => {
              saveChanges();
              closeModal();
            }}
            disabled={image || video || title || desc || isUploading}
          >
            Save
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};
