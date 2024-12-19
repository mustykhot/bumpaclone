import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@mui/material/Button";
import { Checkbox } from "@mui/material";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import ModalRight from "components/ModalRight";
import InputField from "components/forms/InputField";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import ErrorMsg from "components/ErrorMsg";
import EmptyResponse from "components/EmptyResponse";
import { useGetProductQuery } from "services";
import { IMAGEURL } from "utils/constants/general";
import { getCurrencyFnc } from "utils";
import { LoadingProductBox } from "../Orders/widgets/product/SelectProductModal";
import "./style.scss";

type ProductModalProps = {
  openModal: boolean;
  closeModal: () => void;
  dispatchFunc: (val: any) => void;
  duplicateAllFnc: () => void;
  showNewProductButton?: boolean;
  saveBtnMessage?: string;
  setOpenCreateProductModal?: (val: boolean) => void;
  setProductsToMove: any;
  productList: any[];
  setProductList: any;
  moveAction?: string;
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
      setSelectedProducts((prev) => [...prev, ...list]);
    } else if (!checked && list) {
      const filtered = selectedProducts.filter((elemA: any) => {
        return !list.some((elemB: any) => elemB.id === elemA.id);
      });
      setSelectedProducts(filtered);
    }
  };

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
                updateSelectedVariant(product.variations, e.target.checked);
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
                if (product.variations.length) {
                } else {
                  updateSelectedProduct(product);
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
                  : `${getCurrencyFnc()}${product.price}`}
              </p>
              {product.variations.length ? (
                <ChevronDownIcon className={openVariant ? "rotate" : ""} />
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="bottom">
            {Number(product.quantity) === 0 ? (
              <p className="count text-[red]">Out of stock</p>
            ) : (
              <p className="count">{product.quantity} in Stock</p>
            )}

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
                        updateSelectedProduct(item);
                      }}
                    />
                    <img src={item.image} alt="product" />
                  </div>
                  <div className="right_container">
                    <div className="top">
                      <p className="name">{item.name}</p>
                      <div className="price_container">
                        <p className="price">{`${getCurrencyFnc()}${
                          item.price
                        }`}</p>
                      </div>
                    </div>
                    <div className="bottom">
                      <p className="count">{item.quantity} in Stock</p>
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

export const SelectLocationProductModal = ({
  openModal,
  closeModal,
  dispatchFunc,
  setProductsToMove,
  productList,
  setProductList,
  moveAction,
  duplicateAllFnc,
}: ProductModalProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [activityList, setActivityList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const { id } = useParams();
  const { data, isLoading, isFetching, isError } = useGetProductQuery({
    limit: 25,
    page,
    search: searchValue,
    location_id: Number(id || 0),
  });

  const onSubmit = () => {
    if (productList.length) {
      dispatchFunc(productList);
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
            price: item.price,
            total: item.price,
            discount: item.sales,
            quantity: item.quantity,
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
                price: variant.price,
                total: variant.price,
                discount: item.discount,
                quantity: variant.quantity,
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
        closeOnOverlayClick={false}
        closeModal={() => {}}
        openModal={openModal}
      >
        <div className="modal_right_children">
          <div className="top_section" id="scroller_top">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
                setProductsToMove([]);
              }}
              title="Select Products"
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
                {productList.length ? (
                  <Button
                    onClick={() => {
                      setProductList([]);
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
                duplicateAllFnc();
              }}
            >
              {moveAction === "duplicate" ? "Duplicate All" : "Move All"}
            </Button>
            <Button
              type="button"
              disabled={productList?.length ? false : true}
              className="save"
              onClick={onSubmit}
            >
              {moveAction === "duplicate" ? "Duplicate " : "Move "} selected
              Products
            </Button>
          </div>
        </div>
      </ModalRight>
    </>
  );
};
