import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Checkbox } from "@mui/material";
import ModalRight from "components/ModalRight";
import InputField from "components/forms/InputField";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { AnimatePresence, motion } from "framer-motion";
import {
  demoProduct,
  relatedProductType,
} from "pages/Dashboard/Products/AddProduct/relatedProduct";
import { useFormContext } from "react-hook-form";
import { useGetCollectionsQuery, useGetProductQuery } from "services";
import { LoadingProductBox } from "pages/Dashboard/Orders/widgets/product/SelectProductModal";
import ErrorMsg from "components/ErrorMsg";
import EmptyResponse from "components/EmptyResponse";
import { IMAGEURL, alt_image_url } from "utils/constants/general";
import { formatPrice } from "utils";
import { CollectionType } from "services/api.types";

type CollectionModalProps = {
  openModal: boolean;
  closeModal: () => void;
  removeProductFromCollectionFnc: (collections: CollectionType[]) => void;
  listOfTagsForRemoval: any[];
};

const SingleRelatedProduct = ({
  product,
  collectionIdList,
  setCollectionIdList,
  collectionList,
  setCollectionList,
  productList,
}: {
  product: CollectionType;
  collectionIdList: string[];
  setCollectionIdList: React.Dispatch<React.SetStateAction<string[]>>;
  collectionList: CollectionType[];
  productList: number[];
  setCollectionList: React.Dispatch<React.SetStateAction<CollectionType[]>>;
}) => {
  const [openVariant, setOpenVariant] = useState(false);
  const updateSelectedCollection = (id: string) => {
    if (collectionIdList.includes(id)) {
      const filteredList = collectionIdList.filter((item) => item !== id);
      const filteredCollectionList = collectionList.filter(
        (item: CollectionType) => `${item.id}` !== id
      );
      setCollectionIdList(filteredList);
      setCollectionList(filteredCollectionList);
    } else {
      setCollectionIdList((prev) => [...prev, id]);
      setCollectionList((prev) => [...prev, product]);
    }
  };

  return (
    <div className="single_related_product">
      <div className="related_product_flex">
        <div className="left_container">
          <Checkbox
            checked={collectionIdList.includes(`${product.id}`)}
            onChange={() => {
              updateSelectedCollection(`${product.id}`);
            }}
          />
          <img
            src={
              product.image_path
                ? `${IMAGEURL}${product.image_path}`
                : alt_image_url
            }
            alt="product"
          />
        </div>
        <div className="right_container">
          <div className="top">
            <p className="name">{product.tag}</p>
            <div className="price_container">
              <p className="price">
                {`${
                  product.products.filter((item) =>
                    productList.includes(item.id)
                  ).length
                } Products`}
              </p>
              <ChevronDownIcon
                className={openVariant ? "rotate" : ""}
                onClick={() => {
                  setOpenVariant(!openVariant);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {product.products.filter((item) => productList.includes(item.id))
          .length &&
          openVariant && (
            <motion.div
              className="display_variant"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ type: "just" }}
            >
              {product.products
                .filter((item) => productList.includes(item.id))
                .map((item: any) => {
                  return (
                    <div className=" related_product_flex" key={item.id}>
                      <div className="left_container">
                        <img src={`${item.alt_image_url}`} alt="product" />
                      </div>
                      <div className="right_container">
                        <div className="top">
                          <p className="name">{item.name}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

export const RemoveProductFromCollectionModal = ({
  openModal,
  closeModal,
  removeProductFromCollectionFnc,
  listOfTagsForRemoval,
}: CollectionModalProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [collectionList, setCollectionList] = useState<CollectionType[]>([]);
  const [collectionIdList, setCollectionIdList] = useState<string[]>([]);
  const { data, isLoading, isError } = useGetCollectionsQuery({
    search: searchValue,
  });
  const [productList, setProductList] = useState<number[]>([]);
  useEffect(() => {
    let listOfProducts: any = [];
    listOfTagsForRemoval.forEach((item: any) => {
      if (!item.pivot) {
        item.products.forEach((el: any) => {
          if (!listOfProducts.includes(el.id)) {
            listOfProducts.push(el.id);
          }
        });
      } else {
        if (!listOfProducts.includes(item.pivot.product_id)) {
          listOfProducts.push(item.pivot.product_id);
        }
      }
    });
    setProductList(listOfProducts);
  }, [listOfTagsForRemoval]);

  const onSubmit = () => {
    removeProductFromCollectionFnc(collectionList);
    closeModal();
    setCollectionList([]);
    setCollectionIdList([]);
    setProductList([]);
  };
  return (
    <>
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
              title="Product Collections"
            />
            <div className="add_related_product_container">
              <InputField
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                placeholder="Color"
                containerClass="search_field"
                suffix={<SearchIcon />}
              />

              <div className="selected_count">
                <p>{collectionList.length} Selected</p>
                {collectionList.length >= 1 ? (
                  <Button
                    onClick={() => {
                      setCollectionList([]);
                      setCollectionIdList([]);
                    }}
                    className="unselect"
                  >
                    Unselect
                  </Button>
                ) : (
                  ""
                )}
              </div>

              <div className="list_product_to_add_container">
                {isLoading &&
                  [1, 2, 3, 4].map((item) => <LoadingProductBox key={item} />)}
                {isError && <ErrorMsg error={"Something went wrong"} />}

                {!isError && !isLoading ? (
                  data && data?.tags?.length ? (
                    data?.tags?.map((item: any) => {
                      if (
                        listOfTagsForRemoval
                          .map((el) => el.id)
                          .includes(item.id)
                      ) {
                        return (
                          <SingleRelatedProduct
                            collectionIdList={collectionIdList}
                            setCollectionIdList={setCollectionIdList}
                            collectionList={collectionList}
                            setCollectionList={setCollectionList}
                            productList={productList}
                            product={item}
                            key={item.id}
                          />
                        );
                      }
                    })
                  ) : (
                    <EmptyResponse message="No Collection Available" />
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <div className="productOptionSubmit bottom_section">
            <Button type="button" className="cancel" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="button" className="save" onClick={onSubmit}>
              Save
            </Button>
          </div>
        </div>
      </ModalRight>
    </>
  );
};
