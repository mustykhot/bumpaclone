import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Checkbox } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { SearchIcon } from "assets/Icons/SearchIcon";
import ModalRight from "components/ModalRight";
import InputField from "components/forms/InputField";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { useEditCollectionMutation, useGetProductQuery } from "services";
import { LoadingProductBox } from "pages/Dashboard/Orders/widgets/product/SelectProductModal";
import ErrorMsg from "components/ErrorMsg";
import Loader from "components/Loader";
import EmptyResponse from "components/EmptyResponse";
import { showToast, useAppSelector } from "store/store.hooks";
import { selectUserLocation } from "store/slice/AuthSlice";
import { getObjWithValidValues } from "utils/constants/general";
import { formatPrice, handleError } from "utils";
import "./style.scss";

type RelatedProductModalProps = {
  openModal: boolean;
  closeModal: () => void;
  tag: string;
  description: string;
  image_path: string;
  id: string;
  prevIds: number[];
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

export const AddCollectionProductModal = ({
  openModal,
  closeModal,
  tag,
  description,
  image_path,
  id,
  prevIds,
}: RelatedProductModalProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [selectedProductsId, setSelectedProductsId] = useState<number[]>([]);
  const [editCollection, { isLoading: loadEdit }] = useEditCollectionMutation();
  const [hasMore, setHasMore] = useState(true);
  const [activityList, setActivityList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const userLocation = useAppSelector(selectUserLocation);
  const { data, isLoading, isFetching, isError } = useGetProductQuery({
    search: searchValue,
    limit: 25,
    page,
    location_id: userLocation?.id,
  });

  const onSubmit = async () => {
    if (selectedProductsId.length) {
      const payload = {
        tag,
        description,
        image_path,
        products: [...prevIds, ...selectedProductsId],
      };
      try {
        let result = await editCollection({
          body: getObjWithValidValues(payload),
          id,
        });
        if ("data" in result) {
          showToast("Updated successfully", "success");
          closeModal();
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    } else {
      showToast("Select Products", "error");
    }
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

  return (
    <ModalRight
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      {loadEdit && <Loader />}
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

              {!isError && !isLoading ? (
                activityList && activityList.length ? (
                  <InfiniteScroll
                    dataLength={activityList.length}
                    next={fetchMoreData}
                    scrollableTarget={"scroller_top"}
                    hasMore={hasMore}
                    loader={<h4></h4>}
                  >
                    {activityList.map((item: any) => {
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
                    })}
                  </InfiniteScroll>
                ) : (
                  <EmptyResponse message="No Product Available" />
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
