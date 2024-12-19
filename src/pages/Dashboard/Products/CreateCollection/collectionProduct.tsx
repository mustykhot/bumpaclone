import { useState } from "react";

import { useFormContext } from "react-hook-form";
import { Button } from "@mui/material";
import { CollectionProductModal } from "./collectionProductModal";
import { formatPrice, truncateString } from "utils";
import { IMAGEURL } from "utils/constants/general";

export type relatedProductType = {
  name: string;
  image: string;
  count: string;
  price: string;
  isPublished: boolean;
  id: string;
  variant?: {
    name: string;
    image: string;
    count: string;
    price: string;
    id: string;
    isPublished: boolean;
  }[];
};

export const demoProduct: relatedProductType[] = [
  {
    name: "Skechers runner",
    count: "20",
    price: "N23,300",
    image:
      "https://ik.imagekit.io/uknntomzctt/Rectangle_386_z5Gwgvq8e.png?ik-sdk-version=javascript-1.4.3&updatedAt=1677689117650",
    isPublished: false,
    id: "1",
  },
  {
    name: "Skechers runner",
    count: "20",
    price: "N23,300",
    image:
      "https://ik.imagekit.io/uknntomzctt/Rectangle_386_z5Gwgvq8e.png?ik-sdk-version=javascript-1.4.3&updatedAt=1677689117650",
    isPublished: true,
    id: "2",
  },
  {
    name: "Skechers runner",
    count: "20",
    price: "N23,300",
    id: "3",
    image:
      "https://ik.imagekit.io/uknntomzctt/Rectangle_386_z5Gwgvq8e.png?ik-sdk-version=javascript-1.4.3&updatedAt=1677689117650",
    isPublished: true,
  },
  {
    name: "Skechers runner",
    count: "20",
    price: "N23,300",
    id: "20",
    image:
      "https://ik.imagekit.io/uknntomzctt/Rectangle_386_z5Gwgvq8e.png?ik-sdk-version=javascript-1.4.3&updatedAt=1677689117650",
    isPublished: true,
    variant: [
      {
        name: "Skechers runner",
        count: "20",
        price: "N23,300",
        image:
          "https://ik.imagekit.io/uknntomzctt/Rectangle_386_z5Gwgvq8e.png?ik-sdk-version=javascript-1.4.3&updatedAt=1677689117650",
        isPublished: true,
        id: "4",
      },
      {
        name: "Skechers runner",
        count: "20",
        price: "N23,300",
        image:
          "https://ik.imagekit.io/uknntomzctt/Rectangle_386_z5Gwgvq8e.png?ik-sdk-version=javascript-1.4.3&updatedAt=1677689117650",
        isPublished: true,
        id: "5",
      },
      {
        name: "Skechers runner",
        count: "20",
        price: "N23,300",
        id: "6",
        image:
          "https://ik.imagekit.io/uknntomzctt/Rectangle_386_z5Gwgvq8e.png?ik-sdk-version=javascript-1.4.3&updatedAt=1677689117650",
        isPublished: true,
      },
    ],
  },
];

export const CollectionProduct = ({
  setOpenProductModal,
}: {
  setOpenProductModal?: (val: boolean) => void;
}) => {
  const [openModal, setOpenModal] = useState(false);
  const { watch } = useFormContext();

  return (
    <>
      <CollectionProductModal
        openModal={openModal}
        closeModal={() => {
          setOpenModal(false);
        }}
      />
      {watch("productsList") && (
        <div className={`related_products_container`}>
          {watch("productsList").map((product: any) => {
            return (
              <div className="single_product" key={product.id}>
                <img src={product.alt_image_url} alt="product" />
                <div className="text_box">
                  <p className="name">{product.name}</p>
                  <p className="price">{formatPrice(Number(product.price))}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex gap-2">
        <Button
          variant="outlined"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          {watch("productsList") && watch("productsList").length
            ? "Edit Selection"
            : "Select Products"}
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setOpenProductModal && setOpenProductModal(true);
          }}
        >
          Add a new product
        </Button>
      </div>
    </>
  );
};
