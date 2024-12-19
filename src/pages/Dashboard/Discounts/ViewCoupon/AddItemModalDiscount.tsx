import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Box, Checkbox, Tab, Tabs } from "@mui/material";
import ModalRight from "components/ModalRight";
import InputField from "components/forms/InputField";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { AnimatePresence, motion } from "framer-motion";
import {
  useAddItemCouponMutation,
  useGetCollectionsQuery,
  useGetProductQuery,
} from "services";
import { LoadingProductBox } from "pages/Dashboard/Orders/widgets/product/SelectProductModal";
import ErrorMsg from "components/ErrorMsg";
import EmptyResponse from "components/EmptyResponse";
import { useParams } from "react-router-dom";
import { IMAGEURL } from "utils/constants/general";
import { formatPrice, handleError } from "utils";
import { CollectionType } from "services/api.types";
import { SingleCollectionProduct } from "../widgets/product/SelectCollectionModalDiscount";
import { showToast, useAppSelector } from "store/store.hooks";
import Loader from "components/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { selectUserLocation } from "store/slice/AuthSlice";

type ProductModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

const SingleRelatedProduct = ({
  product,
  productIdList,
  setProductIdList,
  setProductList,
  productList,
  variationList,
  setVariationList,
  setVariationIdList,
  variationIdList,
}: {
  product: any;
  productIdList: string[];
  setProductIdList: React.Dispatch<React.SetStateAction<string[]>>;
  productList: any[];
  setProductList: React.Dispatch<any>;
  variationList: any[];
  setVariationList: React.Dispatch<any>;
  variationIdList: string[];
  setVariationIdList: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [openVariant, setOpenVariant] = useState(false);
  const updateSelectedProduct = (id: string) => {
    if (productIdList.includes(id)) {
      const filteredList = productIdList.filter((item) => item !== id);
      const filteredProductList = productList.filter(
        (item: any) => item.id !== id
      );
      setProductIdList(filteredList);
      setProductList(filteredProductList);
    } else {
      setProductIdList((prev) => [...prev, id]);
      setProductList((prev: any) => [...prev, product]);
    }
  };

  const updateSelectedVariant = (item: any) => {
    if (variationIdList.includes(item.id)) {
      const filteredList = variationIdList.filter((el) => el !== item.id);
      const filteredVariationList = variationList.filter(
        (el: any) => el.id !== item.id
      );
      setVariationIdList(filteredList);
      setVariationList(filteredVariationList);
    } else {
      setVariationIdList((prev) => [...prev, item.id]);
      setVariationList((prev: any) => [...prev, item]);
    }
  };

  const updateBulkSelectedVariant = (list: any, checked: boolean) => {
    const variantIds = list?.map((item: any) => {
      return item.id;
    });

    if (checked && variantIds?.length) {
      let clone = variantIds?.map((row: string) => row);
      let cloneVariant = list?.map((row: string) => row);

      setVariationIdList((prev: any) => [...prev, ...clone]);
      setVariationList((prev: any) => [...prev, ...cloneVariant]);
    } else if (!checked && variantIds) {
      let filtered = variationIdList.filter(
        (item: any) => !variantIds?.includes(item)
      );
      let filteredVariant = list.filter(
        (item: any) => !variantIds?.includes(item.id)
      );
      setVariationIdList(filtered);
      setVariationList(filteredVariant);
    }
  };

  return (
    <div className="single_related_product">
      <div className="related_product_flex">
        <div className="left_container">
          {product.variations?.length ? (
            <Checkbox
              checked={product.variations.some((item: any) =>
                variationIdList.includes(item.id)
              )}
              onChange={(e) => {
                updateSelectedProduct(product.id);
                updateBulkSelectedVariant(product.variations, e.target.checked);
              }}
            />
          ) : (
            <Checkbox
              checked={productIdList.includes(product.id)}
              onChange={(e) => {
                if (product.variations?.length) {
                } else {
                  updateSelectedProduct(product.id);
                }
              }}
            />
          )}
          <img src={product.alt_image_url} alt="product" />
        </div>
        <div className="right_container">
          <div className="top">
            <p className="name">{product.name}</p>
            <div className="price_container">
              <p className="price">{formatPrice(Number(product.price))}</p>
              {product.variations?.length ? (
                <ChevronDownIcon
                  className={openVariant ? "rotate" : ""}
                  onClick={() => {
                    setOpenVariant(!openVariant);
                  }}
                />
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="bottom">
            <p className="count">{product.quantity} in Stock</p>
            {product.status === 0 && <p className="isPublished">Unpuplishd</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
const tabList = [
  { label: "Products", value: "products" },
  { label: "Collections", value: "collections" },
];
export const AddItemModalDiscount = ({
  openModal,
  closeModal,
}: ProductModalProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [tab, setTab] = useState("products");
  const [productList, setProductList] = useState<any>([]);
  const [productIdList, setProductIdList] = useState<string[]>([]);
  const [variationList, setVariationList] = useState<any[]>([]);
  const [variationIdList, setVariationIdList] = useState<string[]>([]);
  const [searchCollectionValue, setSearchCollectionValue] = useState("");
  const [collectionList, setCollectionList] = useState<CollectionType[]>([]);
  const [collectionIdList, setCollectionIdList] = useState<string[]>([]);
  const { id } = useParams();
  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const {
    data: collection,
    isLoading: loadCollection,
    isError: collectionError,
  } = useGetCollectionsQuery({
    search: searchCollectionValue,
  });
  const userLocation = useAppSelector(selectUserLocation);
  const [hasMore, setHasMore] = useState(true);
  const [activityList, setActivityList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError } = useGetProductQuery({
    search: searchValue,
    limit: 25,
    page,
    location_id: userLocation?.id,
  });
  const [addItem, { isLoading: loadAdd }] = useAddItemCouponMutation();
  const resetFnc = () => {
    setProductList([]);
    setProductIdList([]);
    setVariationIdList([]);
    setVariationList([]);
  };
  const onSubmit = async () => {
    const payload = {
      products: productIdList,
      product_variations: variationIdList,
      collections: collectionIdList,
    };
    try {
      let result = await addItem({ body: payload, id });
      if ("data" in result) {
        showToast("Added Successfully", "success");
        resetFnc();
        closeModal();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
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

  if (loadAdd) {
    return <Loader />;
  }
  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children add_item_to_discount">
          <div className="top_section" id="scroller_top">
            <ModalRightTitle
              className="remove_border"
              closeModal={() => {
                closeModal();
              }}
              title="Select Products/ Collections"
            />

            <div className="px-[32px] mb-[20px]">
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tab}
                  onChange={handleChangeTab}
                  scrollButtons={false}
                  className="tab_container"
                  centered
                >
                  {tabList.map((item, i) => (
                    <Tab key={i} value={item.value} label={item.label} />
                  ))}
                </Tabs>
              </Box>
            </div>
            {tab === "products" && (
              <div className="add_related_product_container">
                <InputField
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Product Name"
                  containerClass="search_field"
                  suffix={<SearchIcon />}
                />

                <div className="selected_count">
                  <p>{productList?.length + variationList?.length} Selected</p>
                  {productList?.length >= 1 ? (
                    <Button
                      onClick={() => {
                        resetFnc();
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
                  {isError && <ErrorMsg error={"Something went wrong"} />}

                  {/* {!isError && !isLoading ? (
                    data && data.products.data.length ? (
                      data.products.data.map((item: any) => {
                        return (
                          <SingleRelatedProduct
                            productIdList={productIdList}
                            setProductIdList={setProductIdList}
                            setProductList={setProductList}
                            productList={productList}
                            variationList={variationList}
                            setVariationList={setVariationList}
                            variationIdList={variationIdList}
                            setVariationIdList={setVariationIdList}
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
                    activityList && activityList?.length ? (
                      <div className="single_related_product">
                        <InfiniteScroll
                          dataLength={activityList?.length}
                          next={fetchMoreData}
                          scrollableTarget={"scroller_top"}
                          hasMore={hasMore}
                          loader={<h4></h4>}
                        >
                          {activityList.map((item: any) => (
                            <SingleRelatedProduct
                              productIdList={productIdList}
                              setProductIdList={setProductIdList}
                              setProductList={setProductList}
                              productList={productList}
                              variationList={variationList}
                              setVariationList={setVariationList}
                              variationIdList={variationIdList}
                              setVariationIdList={setVariationIdList}
                              product={item}
                              key={item.id}
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
                    [1, 2, 3, 4].map((item) => (
                      <LoadingProductBox key={item} />
                    ))}
                </div>
              </div>
            )}
            {tab === "collections" && (
              <div className="add_related_product_container">
                <InputField
                  value={searchValue}
                  onChange={(e) => {
                    setSearchCollectionValue(e.target.value);
                  }}
                  placeholder="Color"
                  containerClass="search_field"
                  suffix={<SearchIcon />}
                />

                <div className="selected_count">
                  <p>{collectionList?.length} Selected</p>
                  {collectionList?.length >= 1 ? (
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
                  {loadCollection &&
                    [1, 2, 3, 4].map((item) => (
                      <LoadingProductBox key={item} />
                    ))}
                  {collectionError && (
                    <ErrorMsg error={"Something went wrong"} />
                  )}

                  {!collectionError && !isLoading ? (
                    collection && collection?.tags?.length ? (
                      collection?.tags?.map((item: any) => {
                        return (
                          <SingleCollectionProduct
                            collectionIdList={collectionIdList}
                            setCollectionIdList={setCollectionIdList}
                            collectionList={collectionList}
                            setCollectionList={setCollectionList}
                            product={item}
                            key={item.id}
                          />
                        );
                      })
                    ) : (
                      <EmptyResponse message="No Collection Available" />
                    )
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )}
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
