import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Checkbox, Skeleton } from "@mui/material";
import ModalRight from "components/ModalRight";
import InputField from "components/forms/InputField";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { AnimatePresence, motion } from "framer-motion";

import { PlusIcon } from "assets/Icons/PlusIcon";
import { useGetProductQuery } from "services";
import ErrorMsg from "components/ErrorMsg";
import { IMAGEURL } from "utils/constants/general";
import EmptyResponse from "components/EmptyResponse";
import { useFormContext } from "react-hook-form";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { addToCart } from "store/slice/OrderSlice";
import "./style.scss";
import InfiniteScroll from "react-infinite-scroll-component";
import { selectUserLocation } from "store/slice/AuthSlice";
import { formatNumber, getCurrencyFnc } from "utils";
type ProductModalProps = {
  openModal: boolean;
  closeModal: () => void;
  dispatchFunc?: (val: any) => void;
  showNewProductButton?: boolean;
  saveBtnMessage?: string;
  setOpenCreateProductModal?: (val: boolean) => void;
};

const SingleProduct = ({
  product,
  selectedProducts,
  setSelectedProducts,
}: {
  product: any;
  selectedProducts: any[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const [openVariant, setOpenVariant] = useState(false);
  const updateSelectedProduct = (product: any) => {
    const index = selectedProducts.findIndex(
      (elem: any) => elem.id === product.id
    );
    if (index !== -1) {
      const filteredList = selectedProducts.filter(
        (item) => item.id !== product.id
      );
      setSelectedProducts(filteredList);
    } else {
      setSelectedProducts((prev: any) => [...prev, product]);
    }
  };

  const updateSelectedVariant = (list: any, checked: boolean) => {
    if (checked && list) {
      let filterStock = list.filter((item: any) => Number(item.stock) !== 0);
      setSelectedProducts((prev) => [...prev, ...filterStock]);
    } else if (!checked && list) {
      const filtered = selectedProducts.filter((elemA: any) => {
        return !list.some((elemB: any) => elemB.id === elemA.id);
      });
      setSelectedProducts(filtered);
    }
  };

  // if (product.stock === 0) {
  //   return "";
  // }
  return (
    <div className="single_related_product">
      <div className="related_product_flex">
        <div className="left_container">
          {product.variations.length ? (
            <Checkbox
              checked={product.variations.some((item: any) =>
                selectedProducts.some((el) => el.id === item.id)
              )}
              onChange={(e) => {
                if (Number(product.stock) !== 0) {
                  updateSelectedVariant(product.variations, e.target.checked);
                }
                product.variations.some((item: any) =>
                  selectedProducts.some((el) => el.id === item.id)
                )
                  ? setOpenVariant(false)
                  : setOpenVariant(true);
              }}
            />
          ) : (
            <Checkbox
              checked={selectedProducts.some(
                (elem: any) => elem.id === product.id
              )}
              onChange={(e) => {
                if (Number(product.stock) !== 0) {
                  if (product.variations.length) {
                  } else {
                    updateSelectedProduct(product);
                  }
                }
              }}
            />
          )}
          <img
            onClick={() => {
              if (product.variations.length) {
                setOpenVariant(!openVariant);
              }
            }}
            className={`${product.variations.length ? "has_variation" : ""}`}
            src={product.alt_image_url}
            alt="product"
          />
        </div>
        <div
          className={`right_container ${
            product.variations.length ? "has_variation" : ""
          } `}
          onClick={() => {
            if (product.variations.length) {
              setOpenVariant(!openVariant);
            }
          }}
        >
          <div className="top">
            <p className="name">{product.name}</p>
            <div className="price_container">
              <p className="price">
                {product.variations.length
                  ? ""
                  : `${getCurrencyFnc()}${formatNumber(Number(product.price))}`}
              </p>
              {product.variations.length ? (
                <ChevronDownIcon className={openVariant ? "rotate" : ""} />
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="bottom">
            <p className="count">{product.stock} in Stock</p>
            {product.status === 0 && <p className="isPublished">Unpuplishd</p>}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {product.variations.length && openVariant && (
          <motion.div
            className="display_variant"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ type: "just" }}
          >
            {product.variations.map((item: any) => {
              return (
                <div className=" related_product_flex" key={item.id}>
                  <div className="left_container">
                    <Checkbox
                      checked={selectedProducts.some(
                        (elem: any) => elem.id === item.id
                      )}
                      onChange={(e) => {
                        if (Number(item.stock) !== 0) {
                          updateSelectedProduct(item);
                        }
                      }}
                    />
                    <img src={item.image} alt="product" />
                  </div>
                  <div className="right_container">
                    <div className="top">
                      <p className="name">{item.name}</p>
                      <div className="price_container">
                        <p className="price">{`${getCurrencyFnc()}${formatNumber(
                          Number(item.price)
                        )}`}</p>
                      </div>
                    </div>
                    <div className="bottom">
                      <p className="count">{item.stock} in Stock</p>
                      {item.status === 0 && (
                        <p className="isPublished">Unpublished</p>
                      )}
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

export const LoadingProductBox = () => {
  return (
    <div className="single_loading_box">
      <div className="left_box">
        <Skeleton animation="wave" width={"100%"} height={"100%"} />
      </div>
      <div className="right_box">
        <div className="top_right_box">
          <Skeleton animation="wave" width={"100%"} height={20} />
        </div>
        <div className="bottom_right_box">
          <Skeleton animation="wave" width={"100%"} height={20} />
        </div>
      </div>
    </div>
  );
};

export const SelectProductModal = ({
  openModal,
  closeModal,
  dispatchFunc,
  showNewProductButton = true,
  saveBtnMessage = "Save",
  setOpenCreateProductModal,
}: ProductModalProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [productList, setProductList] = useState<any>([]);
  const { watch, setValue } = useFormContext();
  const [hasMore, setHasMore] = useState(true);
  const [activityList, setActivityList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  const userLocation = useAppSelector(selectUserLocation);

  const { data, isLoading, isFetching, isError } = useGetProductQuery({
    limit: 25,
    page,
    search: searchValue,
    location_id: userLocation?.id,
  });
  const onSubmit = () => {
    if (dispatchFunc) {
      dispatchFunc(productList);
    } else {
      productList.forEach((item: any) => {
        dispatch(addToCart(item));
      });
    }
    closeModal();
    setProductList([]);
    if (watch("shipping_record_id")) {
      setValue("shipping_record_id", "");
      setValue("automatedShippingCourier", null);
      setValue("shipping_price", "");

      showToast(
        "The selected shipping record has been cleared. Please re-add it.",
        "warning",
        6000
      );
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
      let prepare = data.products.data
        .map((item: any) => {
          return {
            id: item.id,
            url: item.url,
            name: item.name,
            unit: item.unit,
            price: item.sales ? item.sales : item.price,
            total: item.sales ? item.sales : item.price,
            discount: item.sales,
            stock: item.quantity,
            description: item.description,
            thumbnail_url: item.alt_image_url,
            alt_image_url: item.alt_image_url,
            image: item.image ? item.image : item.images[0],
            variations: item.variations.map((variant: any) => {
              return {
                id: variant.id,
                variant: variant.id,
                itemId: item.id,
                url: item.url,
                name: `${item.name}(${variant.variant})`,
                unit: item.unit,
                price: variant.sales ? variant.sales : variant.price,
                total: variant.sales ? variant.sales : variant.price,
                discount: item.sales,
                stock: variant.quantity,
                description: item.description,
                image: variant.image
                  ? `${IMAGEURL}${variant.image}`
                  : item.alt_image_url,
                thumbnail_url: variant.image
                  ? `${IMAGEURL}${variant.image}`
                  : item.alt_image_url,
              };
            }),
          };
        })
        .filter((item: any) => item !== undefined);
      if (searchValue) {
        setActivityList(prepare);
      } else {
        if (page === 1) {
          setActivityList(prepare);
        } else {
          setActivityList((prev) => [...prev, ...prepare]);
        }
      }
    }
  }, [data, searchValue]);

  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
          setProductList([]);
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
              extraChild={
                showNewProductButton ? (
                  <Button
                    variant="outlined"
                    startIcon={<PlusIcon stroke={"#009444"} />}
                    onClick={() => {
                      setOpenCreateProductModal &&
                        setOpenCreateProductModal(true);
                    }}
                  >
                    New Product
                  </Button>
                ) : null
              }
            />
            <div className="add_related_product_container">
              <InputField
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by product name"
                containerClass="search_field"
                suffix={<SearchIcon />}
              />

              <div className="selected_count">
                <p>{productList.length} Selected</p>
                {productList?.length ? (
                  <Button
                    onClick={() => {
                      setProductList([]);
                    }}
                    className="unselect"
                  >
                    Unselect All
                  </Button>
                ) : (
                  ""
                )}
              </div>

              <div className="list_product_to_add_container">
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
                        {activityList.map((item: any) => (
                          <SingleProduct
                            selectedProducts={productList}
                            setSelectedProducts={setProductList}
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
                  [1, 2, 3, 4].map((item) => <LoadingProductBox key={item} />)}
                {isError && <ErrorMsg error={"Something went wrong"} />}
              </div>
            </div>
          </div>

          <div className="productOptionSubmit bottom_section">
            <Button
              type="button"
              className="cancel"
              onClick={() => {
                setProductList([]);
              }}
            >
              Clear
            </Button>
            <Button type="button" className="save" onClick={onSubmit}>
              {saveBtnMessage}
            </Button>
          </div>
        </div>
      </ModalRight>
    </>
  );
};
