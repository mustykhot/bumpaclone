import { useState } from "react";
import { SelectProductModalDiscount } from "../widgets/product/SelectProductModalDiscount";
import { Button } from "@mui/material";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { useFormContext } from "react-hook-form";
import { IMAGEURL, alt_image_url } from "utils/constants/general";
import { formatPrice } from "utils";
import { SelectCollectionModalDiscount } from "../widgets/product/SelectCollectionModalDiscount";
import { CollectionType } from "services/api.types";

const ProductListing = ({ product }: { product: any }) => {
  return (
    <div className="product_listing_container">
      <img
        src={
          product.alt_image_url
            ? product.alt_image_url
            : product.image
            ? `${IMAGEURL}${product.image}`
            : alt_image_url
        }
        alt="product"
      />
      <p className="name">{product.name}</p>
      <p className="price">{formatPrice(Number(product.price))}</p>
    </div>
  );
};
export const ProductSection = () => {
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openCollectionModal, setOpenCollectionModal] = useState(false);
  const { watch } = useFormContext();

  return (
    <>
      <SelectProductModalDiscount
        openModal={openProductModal}
        isCoupon={true}
        closeModal={() => {
          setOpenProductModal(false);
        }}
      />

      <SelectCollectionModalDiscount
        openModal={openCollectionModal}
        closeModal={() => {
          setOpenCollectionModal(false);
        }}
      />

      <div className="px-[16px]">
        {(watch("productList") && watch("productList")?.length) ||
        (watch("variationList") && watch("variationList")?.length) ? (
          ""
        ) : (
          <div
            onClick={() => {
              setOpenProductModal(true);
            }}
            className="pick_product"
          >
            <label>Select Products</label>
            <div>
              <p>{watch("all") && "All Products"}</p>
              <ChevronDownIcon />
            </div>
          </div>
        )}
        {(watch("productList") && watch("productList")?.length) ||
        (watch("variationList") && watch("variationList")?.length) ? (
          <>
            <div className="display_product_flex">
              {watch("productList").map((item: any) => (
                <ProductListing product={item} />
              ))}
              {watch("variationList").map((item: any) => (
                <ProductListing product={item} />
              ))}
            </div>
            <div className="select_product">
              <Button
                onClick={() => {
                  setOpenProductModal(true);
                }}
                variant="outlined"
              >
                Edit Selection
              </Button>
            </div>
          </>
        ) : (
          ""
        )}
        <div
          onClick={() => {
            setOpenCollectionModal(true);
          }}
          className="pick_product"
        >
          <label>Select Collections</label>
          <div>
            <p>
              {watch("collectionList") && watch("collectionList")?.length
                ? watch("collectionList")
                    .map((item: CollectionType) => item.tag)
                    .join(",")
                : ""}
            </p>
            <ChevronDownIcon />
          </div>
        </div>
      </div>
    </>
  );
};
