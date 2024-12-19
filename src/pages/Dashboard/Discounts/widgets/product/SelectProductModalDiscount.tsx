import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Checkbox } from "@mui/material";
import ModalRight from "components/ModalRight";
import InputField from "components/forms/InputField";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { AnimatePresence, motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { useGetProductQuery } from "services";
import { LoadingProductBox } from "pages/Dashboard/Orders/widgets/product/SelectProductModal";
import ErrorMsg from "components/ErrorMsg";
import EmptyResponse from "components/EmptyResponse";
import { IMAGEURL, alt_image_url } from "utils/constants/general";
import { formatPrice } from "utils";
import InfiniteScroll from "react-infinite-scroll-component";
import { WarningModal } from "../../ViewDiscount/WarningModal/WarningModal";
import { selectUserLocation } from "store/slice/AuthSlice";
import { useAppSelector } from "store/store.hooks";

type ProductModalProps = {
  openModal: boolean;
  isCoupon?: boolean;
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
  isCoupon = false,
}: {
  product: any;
  isCoupon?: boolean;
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
  const { watch } = useFormContext();
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
    } else if (!checked && variantIds?.length) {
      let filtered = variationIdList.filter(
        (item: any) => !variantIds?.includes(item)
      );

      let filteredVariant = variationList.filter(
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
              disabled={watch("all")}
              checked={
                watch("all")
                  ? true
                  : product.variations.some((item: any) =>
                      variationIdList.includes(item.id)
                    )
              }
              onChange={(e) => {
                if (isCoupon) {
                  updateSelectedProduct(product.id);
                }
                updateBulkSelectedVariant(product.variations, e.target.checked);
              }}
            />
          ) : (
            <Checkbox
              disabled={watch("all")}
              checked={watch("all") ? true : productIdList.includes(product.id)}
              onChange={(e) => {
                if (product.variations?.length) {
                } else {
                  updateSelectedProduct(product.id);
                }
              }}
            />
          )}
          <img
            onClick={() => {
              if (product.variations?.length) {
                setOpenVariant(!openVariant);
              }
            }}
            className={`image ${
              product.variations?.length ? "has_variation" : ""
            }`}
            src={product.alt_image_url}
            alt="product"
          />
        </div>
        <div
          className={`right_container ${
            product.variations?.length ? "has_variation" : ""
          } `}
          onClick={() => {
            if (product.variations?.length) {
              setOpenVariant(!openVariant);
            }
          }}
        >
          <div className="top">
            <p className="name">{product.name}</p>
            <div className="price_container">
              <p className="price">
                {" "}
                {product.variations?.length
                  ? ""
                  : formatPrice(Number(product.price))}{" "}
              </p>

              {isCoupon ? (
                ""
              ) : product.variations?.length ? (
                <ChevronDownIcon className={openVariant ? "rotate" : ""} />
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
      {isCoupon ? (
        ""
      ) : (
        <AnimatePresence>
          {product.variations?.length && openVariant && (
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
                        disabled={watch("all")}
                        checked={
                          watch("all")
                            ? true
                            : variationIdList.includes(item.id)
                        }
                        onChange={(e) => {
                          updateSelectedVariant(item);
                        }}
                      />
                      <img
                        src={
                          item.image
                            ? `${IMAGEURL}${item.image}`
                            : alt_image_url
                        }
                        alt="product"
                      />
                    </div>
                    <div className="right_container">
                      <div className="top">
                        <p className="name">{`${product.name}(${item.variant})`}</p>
                        <div className="price_container">
                          <p className="price">
                            {formatPrice(Number(item.price))}
                          </p>
                        </div>
                      </div>
                      <div className="bottom">
                        <p className="count">{item.quantity} in Stock</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export const SelectProductModalDiscount = ({
  openModal,
  closeModal,
  isCoupon = false,
}: ProductModalProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [productList, setProductList] = useState<any>([]);
  const [productIdList, setProductIdList] = useState<string[]>([]);
  const [variationList, setVariationList] = useState<any[]>([]);
  const [variationIdList, setVariationIdList] = useState<string[]>([]);
  const { setValue, watch } = useFormContext();
  const [hasMore, setHasMore] = useState(true);
  const [activityList, setActivityList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const userLocation = useAppSelector(selectUserLocation);
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const { data, isLoading, isFetching, isError } = useGetProductQuery({
    search: searchValue,
    limit: 25,
    page,
    location_id: userLocation?.id,
  });

  const onSubmit = () => {
    if (isCoupon) {
      handleSubmit({ exclude: false });
    } else {
      const discountProductActive = productList.filter(
        (item: any) => item.has_discount
      );
      const discountVariationActive = variationList.filter(
        (item: any) => item.has_discount
      );
      if (discountProductActive?.length || discountVariationActive?.length) {
        setOpenWarningModal(true);
      } else {
        handleSubmit({ exclude: false });
      }
    }
  };

  const handleSubmit = ({ exclude = false }: { exclude: boolean }) => {
    if (isCoupon) {
      setValue("productIdList", productIdList);
      setValue("productList", productList);
      setValue("variationList", variationList);
      setValue("variationIdList", variationIdList);
    } else {
      if (exclude) {
        const discountProductActiveIds = productList.filter(
          (item: any) => !item.has_discount
        );

        const discountVariationActiveIds = variationList.filter(
          (item: any) => !item.has_discount
        );

        setValue(
          "productIdList",
          discountProductActiveIds.map((item: any) => item.id)
        );
        setValue("productList", discountProductActiveIds);
        setValue("variationList", discountVariationActiveIds);
        setValue(
          "variationIdList",
          discountVariationActiveIds.map((item) => item.id)
        );
        setOpenWarningModal(false);
      } else {
        setValue("productIdList", productIdList);
        setValue("productList", productList);
        setValue("variationList", variationList);
        setValue("variationIdList", variationIdList);
        setOpenWarningModal(false);
      }
    }
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
      let list = data.products.data.map((item: any) => {
        return {
          ...item,
          variations: item.variations.map((el: any) => {
            return { ...el, variantLastName: `${item.name}(${el.variant})` };
          }),
        };
      });

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
    <>
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
            />
            <div className="add_related_product_container">
              <InputField
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setPage(1);
                }}
                placeholder="Color"
                containerClass="search_field"
                suffix={<SearchIcon />}
              />

              <div className="selected_count">
                <p>
                  {watch("all")
                    ? "All"
                    : productList.length + variationList.length}{" "}
                  Selected
                </p>
                {watch("all") ||
                productList.length >= 1 ||
                variationList.length >= 1 ? (
                  <Button
                    onClick={() => {
                      setProductList([]);
                      setProductIdList([]);
                      setVariationIdList([]);
                      setVariationList([]);
                      setValue("all", false);
                    }}
                    className="unselect"
                  >
                    Unselect All
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setProductList([]);
                      setProductIdList([]);
                      setVariationIdList([]);
                      setVariationList([]);
                      setValue("productIdList", []);
                      setValue("productList", []);
                      setValue("variationList", []);
                      setValue("variationIdList", []);
                      setValue("all", true);
                    }}
                    className="unselect"
                  >
                    Select All
                  </Button>
                )}
              </div>

              <div className="list_product_to_add_container">
                {isError && <ErrorMsg error={"Something went wrong"} />}

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
                          <SingleRelatedProduct
                            isCoupon={isCoupon}
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
                  [1, 2, 3, 4].map((item) => <LoadingProductBox key={item} />)}
              </div>
            </div>
          </div>

          <div className="productOptionSubmit bottom_section">
            <Button
              type="button"
              className="cancel"
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </Button>
            <Button type="button" className="save" onClick={onSubmit}>
              Save
            </Button>
          </div>
        </div>
      </ModalRight>
      <WarningModal
        openModal={openWarningModal}
        closeModal={() => {
          setOpenWarningModal(false);
        }}
        btnAction={() => {
          handleSubmit({ exclude: false });
        }}
        exludeAction={() => {
          handleSubmit({ exclude: true });
        }}
      />
    </>
  );
};
