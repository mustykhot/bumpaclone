import { useState } from "react";
import { CircularProgress, IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { UploadIcon } from "assets/Icons/UploadIcon";
import InputField from "components/forms/InputField";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { AnyObject } from "Models";
import { useAppDispatch } from "store/store.hooks";
import { IMAGE_TYPES, IMG_BASE_URL } from "utils/constants/general";
import { handleError } from "utils";
import { useUploadGeneralImageMutation } from "services";
import "../style.scss";

type ModalType = {
  openModal: boolean;
  closeModal: () => void;
  brandsInfo: any;
  setBrandsInfo: (data: any) => void;
  saveChanges: () => void;
};

export const BrandsModal = ({
  openModal,
  closeModal,
  brandsInfo,
  setBrandsInfo,
  saveChanges,
}: ModalType) => {
  const dispatch = useAppDispatch();
  const [image, setImage] = useState<any>(null);
  const [postGeneralImage, { isLoading: isUploading }] =
    useUploadGeneralImageMutation();
  const [name, setName] = useState("");

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

  const addToBrands = () => {
    if (name && image) {
      const data = [...brandsInfo, { name, logo: image }];

      setBrandsInfo(data);

      setImage(null);
      setName("");
    }
  };

  const removeFromBrands = (index: number) => {
    const brands = [...brandsInfo];

    if (index > -1) {
      brands.splice(index, 1);
    }

    setBrandsInfo(brands);
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
            title="Brands"
            children={
              <p className="modal_description">
                Add your associated brands to your website.{" "}
              </p>
            }
          />

          <div className="customize_modal_body brands_modal">
            <div className="list">
              {brandsInfo?.map((item: AnyObject, index: number) => (
                <div key={index} className="item">
                  <div className="info">
                    <img src={item?.logo} alt="Brand logo" />

                    <p>{item.name}</p>
                  </div>

                  <IconButton
                    className="icon"
                    onClick={() => removeFromBrands(index)}
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
                    id="brandImgUpload"
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
                    <label htmlFor="brandImgUpload">Upload logo</label>
                  </Button>
                </div>
              </div>

              <div className="others">
                <InputField
                  type="text"
                  value={name}
                  placeholder="Brand name"
                  onChange={(e) => setName(e.target.value)}
                />
                <Button
                  className="btn_tertiary"
                  onClick={addToBrands}
                  disabled={!image || !name || isUploading}
                >
                  Add brand
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
            disabled={image || name || isUploading}
          >
            Save
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};
