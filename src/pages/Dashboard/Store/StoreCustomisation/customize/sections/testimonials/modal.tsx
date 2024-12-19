import { useState } from "react";
import Button from "@mui/material/Button";
import { CircularProgress, IconButton } from "@mui/material";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { UploadIcon } from "assets/Icons/UploadIcon";
import InputField from "components/forms/InputField";
import TextAreaField from "components/forms/TextAreaField";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { AnyObject } from "Models";
import { IMAGE_TYPES, IMG_BASE_URL } from "utils/constants/general";
import { handleError } from "utils";
import { useUploadGeneralImageMutation } from "services";
import "../style.scss";

type ModalType = {
  openModal: boolean;
  closeModal: () => void;
  testimonialsInfo: any;
  setTestimonialsInfo: (data: any) => void;
  saveChanges: () => void;
};

export const TestimonialsModal = ({
  openModal,
  closeModal,
  testimonialsInfo,
  setTestimonialsInfo,
  saveChanges,
}: ModalType) => {
  const [image, setImage] = useState<any>(null);
  const [postGeneralImage, { isLoading: isUploading }] =
    useUploadGeneralImageMutation();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

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
        image: { image: base64Img, name: "testimonial" },
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

  const addToTestimonials = () => {
    if (name && image) {
      const data = [...testimonialsInfo, { name, comment, image }];
      setTestimonialsInfo(data);
      setImage(null);
      setName("");
      setComment("");
    }
  };

  const removeFromTestimonials = (index: number) => {
    const testimonials = [...testimonialsInfo];
    if (index > -1) {
      testimonials.splice(index, 1);
    }
    setTestimonialsInfo(testimonials);
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
            title="Testimonials"
            children={
              <p className="modal_description">
                Add your associated customer testimonials to your website.
              </p>
            }
          />

          <div className="customize_modal_body brands_modal testimonials_modal">
            <div className="list">
              {testimonialsInfo?.map((item: AnyObject, index: number) => (
                <div key={index} className="item">
                  <div className="info">
                    <img src={item?.image} alt="Customer img" />

                    <div className="block">
                      <p className="name">{item.name}</p>
                      <p className="comment">{item.comment}</p>
                    </div>
                  </div>

                  <IconButton
                    className="icon"
                    onClick={() => removeFromTestimonials(index)}
                  >
                    <TrashIcon stroke="#d90429" />
                  </IconButton>
                </div>
              ))}
            </div>

            <div className="form">
              <div className="bg_image_upload">
                <div className="preview">
                  {image && <img src={image} alt="preview" />}
                </div>

                <div className="uploader">
                  <p>
                    Recommended:
                    <br />
                    Max file size: 150kb
                  </p>

                  <input
                    id="testimonialImgUpload"
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
                        <UploadIcon stroke="#9BA2AC" />
                      )
                    }
                  >
                    <label htmlFor="testimonialImgUpload">Upload logo</label>
                  </Button>
                </div>
              </div>

              <div className="others">
                <InputField
                  type="text"
                  value={name}
                  placeholder="Customer name"
                  onChange={(e) => setName(e.target.value)}
                />
                <TextAreaField
                  placeholder="Comment"
                  onChange={(e) => setComment(e.target.value)}
                  className="h-[90px] w-full p-2"
                />
                <Button
                  className="btn_tertiary"
                  onClick={addToTestimonials}
                  disabled={!image || !name || !comment}
                >
                  Add testimonial
                </Button>
              </div>
            </div>
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
            disabled={image || name || comment || isUploading}
          >
            Save
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};
