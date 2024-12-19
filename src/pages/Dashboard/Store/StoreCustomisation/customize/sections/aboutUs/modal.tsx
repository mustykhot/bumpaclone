import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import { UploadIcon } from "assets/Icons/UploadIcon";
import InputField from "components/forms/InputField";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import NormalTextEditor from "components/forms/NormalTextEditor";
import { IMAGE_TYPES, IMG_BASE_URL } from "utils/constants/general";
import { handleError } from "utils";
import { useUploadGeneralImageMutation } from "services";
import "../style.scss";
type ModalType = {
  openModal: boolean;
  closeModal: () => void;
  data: any;
  saveChanges: (data: any) => void;
};

export const AboutUsModal = ({
  openModal,
  closeModal,
  data,
  saveChanges,
}: ModalType) => {
  const [image, setImage] = useState<any>(null);
  const [postGeneralImage, { isLoading: isUploading }] =
    useUploadGeneralImageMutation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (data) {
      setImage(data?.image);
      setTitle(data?.title);
      setContent(data?.content || "");
    }
  }, [data]);
  useEffect(() => {
    if (content === "<p><br></p>") {
      setContent("");
    }
  }, [content]);
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imgFile = e?.target?.files[0];
      if (imgFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
          uploadImage(reader.result);
        };
        reader?.readAsDataURL(imgFile);
      }
    }
  };

  const uploadImage = async (base64Img: any) => {
    try {
      let payload = {
        url: `/media/image/upload`,
        image: { image: base64Img, name: "aboutUsImg" },
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

  const handleFormSubmit = () => {
    const payload = {
      show: true,
      image,
      title,
      content,
    };
    saveChanges(payload);
    closeModal();
  };

  const isDisabled = () => {
    var value = false;
    if (!image) value = true;
    if (!title) value = true;
    if (!content) value = true;
    if (isUploading) value = true;
    return value;
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
            title="About Us"
            children={
              <p className="modal_description">
                Show an about us section on your website.
              </p>
            }
          />

          <div className="customize_modal_body countdown_modal about_us_modal">
            <div className="bg_image_upload">
              <div className="preview">
                {image && <img src={image} alt="" />}
              </div>

              <div className="uploader">
                <p>
                  Recommended:
                  <br />
                  Max file size: 150kb
                </p>

                <input
                  id="countdownBgImgUpload"
                  type="file"
                  onChange={handleSelectImage}
                  accept={IMAGE_TYPES}
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
                  <label htmlFor="countdownBgImgUpload">Upload Image</label>
                </Button>
              </div>
            </div>
            <InputField
              type="text"
              value={title}
              placeholder="Header (e.g; We are the best in...)"
              onChange={(e) => setTitle(e.target.value)}
            />

            <NormalTextEditor
              value={content}
              placeholder="Founded by the best leading..."
              handleChange={(val: string) => {
                setContent(val);
              }}
            />
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
              handleFormSubmit();
            }}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};
