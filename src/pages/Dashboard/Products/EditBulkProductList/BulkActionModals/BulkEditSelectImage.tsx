import { useEffect, useState } from "react";

import Modal from "components/Modal";
import Button from "@mui/material/Button";
import { ModalTitleSection } from "components/Modal/ModalTitleSection";
import NormalUploadMultiImage from "components/forms/NormalUploadMultiImage";
import { PRODUCTROUTES } from "utils/constants/apiroutes";
type BulkEditSelectProps = {
  openModal: boolean;
  closeModal: () => void;
  defaultImages?: null | any;
  handleChange: any;
  handleAddImageToVariationField?: any;
  imageIndex?: number | null;
  variantImageIndex?: number | null;
  isVariation?: boolean;
};

export const BulkEditSelectImage = ({
  openModal,
  closeModal,
  imageIndex,
  handleChange,
  defaultImages,
  handleAddImageToVariationField,
  variantImageIndex,
  isVariation = false,
}: BulkEditSelectProps) => {
  const [selectedImage, setSelectedImage] = useState<null | any>(null);
  const [uploadedImages, setUploadedImage] = useState<null | any>(null);
  const handleSelectImage = () => {
    if (uploadedImages) {
      handleChange("images", imageIndex, uploadedImages);
      closeModal();
    }
    if (isVariation) {
      handleAddImageToVariationField("image", variantImageIndex, selectedImage);
      closeModal();
    }
  };

  useEffect(() => {
    if (defaultImages) {
      setUploadedImage(defaultImages);
    }
  }, [defaultImages]);
  return (
    <Modal openModal={openModal} closeModal={closeModal}>
      <div className="select_variant_modal">
        <ModalTitleSection title="Product image" closeModal={closeModal} />
        <NormalUploadMultiImage
          defaultImages={defaultImages}
          isVariation={isVariation}
          handleFieldChange={handleChange}
          imageIndex={imageIndex}
          setSelectedImage={isVariation ? setSelectedImage : null}
          uploadPath={`${PRODUCTROUTES.UPLOADMEDIA}`}
          customChange={(val: any) => {
            setUploadedImage(val);
          }}
          name="productImages"
        />
        <div className="botton_container">
          <Button onClick={closeModal} variant={"outlined"}>
            Cancel
          </Button>
          <Button
            onClick={handleSelectImage}
            variant={"contained"}
            className="save"
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};
