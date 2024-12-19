import { useState } from "react";

import Modal from "components/Modal";
import UploadMultiImage from "components/forms/UploadMultiImage";
import Button from "@mui/material/Button";
import { ModalTitleSection } from "components/Modal/ModalTitleSection";
import UploadMultipleProductImage from "components/forms/UploadMultipleProductImage";
type SelectVariantImageProps = {
  openModal: boolean;
  closeModal: () => void;
  handleFeildsChange: any;
  variantImageIndex: number | null;
};

export const SelectVariantImage = ({
  openModal,
  closeModal,
  variantImageIndex,
  handleFeildsChange,
}: SelectVariantImageProps) => {
  const [selectedImage, setSelectedImage] = useState<null | any>(null);
  const handleSelectVariantImage = () => {
    if (selectedImage) {
      handleFeildsChange("image", variantImageIndex, selectedImage.path);
      closeModal();
    }
  };
  return (
    <Modal openModal={openModal} closeModal={closeModal}>
      <div className="select_variant_modal">
        <ModalTitleSection
          title="Select product variant image"
          closeModal={closeModal}
          explanation={
            "Choose from the existing images you have uploaded or upload a new image for the variation."
          }
        />

        <UploadMultipleProductImage
          name="images"
          setSelectedImage={setSelectedImage}
          isVariation={true}
          required={true}
        />
        <div className="botton_container">
          <Button onClick={closeModal} variant={"outlined"}>
            Cancel
          </Button>
          <Button
            onClick={handleSelectVariantImage}
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
