import { useEffect, useState } from "react";
import { ModalTitleSection } from "components/Modal/ModalTitleSection";
import Modal from "components/Modal";
import "./style.scss";

type PreviewImagesModalProps = {
  openModal: boolean;
  closeModal: () => void;
  images: any[];
  firstImage: any;
};

export const PreviewImagesModal = ({
  closeModal,
  openModal,
  images,
  firstImage,
}: PreviewImagesModalProps) => {
  const [selectedImage, setSelectedimage] = useState<string | null>(
    firstImage ? firstImage : images[0]
  );
  useEffect(() => {
    setSelectedimage(firstImage);
  }, [firstImage]);
  return (
    <Modal openModal={openModal} closeModal={closeModal}>
      <div className="preview_image_details_modal">
        <ModalTitleSection title="Product Images" closeModal={closeModal} />
        <div className="preview_content">
          <div className="image_section">
            <div
              className="big_image_container"
              style={{
                backgroundImage: `url(${selectedImage})`,
              }}
            ></div>
            <div className="image_flex">
              {images?.map((item: any, i: number) => {
                return (
                  <img
                    key={i}
                    src={`${item}`}
                    alt="products"
                    onClick={() => {
                      setSelectedimage(item);
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div className="product_details"></div>
        </div>
      </div>
    </Modal>
  );
};
