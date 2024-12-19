import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Checkbox } from "@mui/material";
import "./style.scss";
import ModalRight from "components/ModalRight";
import InputField from "components/forms/InputField";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { AnimatePresence, motion } from "framer-motion";
import { demoProduct, relatedProductType } from "./collectionProduct";
import { useGetProductQuery } from "services";
import { LoadingProductBox } from "pages/Dashboard/Orders/widgets/product/SelectProductModal";
import ErrorMsg from "components/ErrorMsg";
import EmptyResponse from "components/EmptyResponse";
import { IMAGEURL } from "utils/constants/general";
import { formatPrice } from "utils";
import { useFormContext } from "react-hook-form";
import InfiniteScroll from "react-infinite-scroll-component";
import { selectUserLocation } from "store/slice/AuthSlice";
import { useAppSelector } from "store/store.hooks";
type RelatedProductModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

const SingleProduct = ({
  product,
  selectedProductsId,
  selectedProducts,
  setSelectedProducts,
  setSelectedProductsId,
}: {
  product: any;
  setSelectedProducts: any;
  selectedProducts: any;
  selectedProductsId: number[];
  setSelectedProductsId: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const updateSelectedProduct = (id: number) => {
    if (selectedProductsId.includes(id)) {
      const filteredList = selectedProductsId.filter((item) => item !== id);
      const filteredProductList = selectedProducts.filter(
        (item: any) => item.id !== id
      );
      setSelectedProductsId(filteredList);
      setSelectedProducts(filteredProductList);
    } else {
      setSelectedProductsId((prev) => [...prev, id]);
      setSelectedProducts((prev: any) => [...prev, product]);
    }
  };

  return (
    <div className="single_related_product">
      <div className="related_product_flex">
        <div className="left_container">
          <Checkbox
            checked={selectedProductsId.includes(product.id)}
            onChange={(e) => {
              updateSelectedProduct(product.id);
            }}
          />
          <img src={product.alt_image_url} alt="product" />
        </div>
        <div className="right_container">
          <div className="top">
            <p className="name">{product.name}</p>
            <div className="price_container">
              <p className="price">{formatPrice(Number(product.price))}</p>
            </div>
          </div>
          <div className="bottom">
            <p className="count">{product.quantity} in Stock</p>
            {product.status === 0 && <p className="isPublished">Unpublishd</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CollectionProductModal = ({
  openModal,
  closeModal,
}: RelatedProductModalProps) => {
  const { setValue, watch } = useFormContext();
  const [searchValue, setSearchValue] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<any[]>(
    watch("productsList") ? watch("productsList") : []
  );
  const [hasMore, setHasMore] = useState(true);
  const [activityList, setActivityList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [selectedProductsId, setSelectedProductsId] = useState<number[]>(
    watch("products") ? watch("products") : []
  );
  const userLocation = useAppSelector(selectUserLocation);

  const { data, isLoading, isFetching, isError } = useGetProductQuery({
    search: searchValue,
    limit: 25,
    page,
    location_id: userLocation?.id,
  });

  const onSubmit = () => {
    setValue("products", selectedProductsId);
    setValue("productsList", selectedProducts);
    closeModal();
  };

  const fetchMoreData = () => {
    if (data?.products?.last_page === page) {
      setHasMore(false);
    } else {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    if (data) {
      let list = data.products.data;
      if (searchValue) {
        setActivityList(list);
      } else {
        if (page === 1) {
          setActivityList(list);
        } else {
          setActivityList((prev) => [...prev, ...list]);
        }
      }
    }
  }, [data, searchValue]);

  useEffect(() => {
    if (watch("productsList")) {
      setSelectedProducts(watch("productsList"));
    }
  }, [watch("productsList")]);
  useEffect(() => {
    if (watch("products")) {
      setSelectedProductsId(watch("products"));
    }
  }, [watch("products")]);
  return (
    <ModalRight
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <div className="modal_right_children">
        <div className="top_section" id="scroller_top">
          <ModalRightTitle
            closeModal={() => {
              closeModal();
            }}
            title="Select Products"
            children={
              <InputField
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setPage(1);
                }}
                placeholder="Search"
                containerClass="search_field"
                suffix={<SearchIcon />}
              />
            }
          />
          <div className="add_related_product_container">
            <div className="selected_count">
              <p>{selectedProducts.length} Selected</p>
            </div>
            <div className="list_product_to_add_container">
              {isError && <ErrorMsg error={"Something went wrong"} />}
              {/* {!isError && !isLoading ? (
                data && data.products.data.length ? (
                  data.products.data.map((item: any) => {
                    return (
                      <SingleProduct
                        setSelectedProducts={setSelectedProducts}
                        selectedProductsId={selectedProductsId}
                        setSelectedProductsId={setSelectedProductsId}
                        selectedProducts={selectedProducts}
                        product={item}
                        key={item.id}
                      />
                    );
                  })
                ) : (
                  <EmptyResponse message="No Product Available" />
                )
              ) : (
                ""
              )} */}
              {!isError && !isLoading ? (
                activityList && activityList.length ? (
                  <div className="single_related_product">
                    <InfiniteScroll
                      dataLength={activityList.length}
                      next={fetchMoreData}
                      scrollableTarget={"scroller_top"}
                      hasMore={hasMore}
                      loader={<h4></h4>}
                    >
                      {activityList.map((item: any, i: number) => (
                        <SingleProduct
                          setSelectedProducts={setSelectedProducts}
                          selectedProductsId={selectedProductsId}
                          setSelectedProductsId={setSelectedProductsId}
                          selectedProducts={selectedProducts}
                          product={item}
                          key={i}
                        />
                      ))}
                    </InfiniteScroll>
                  </div>
                ) : (
                  <EmptyResponse message="No Products Available" />
                )
              ) : (
                ""
              )}
              {(isLoading || isFetching) &&
                [1, 2, 3, 4].map((item) => <LoadingProductBox key={item} />)}
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
  );
};
