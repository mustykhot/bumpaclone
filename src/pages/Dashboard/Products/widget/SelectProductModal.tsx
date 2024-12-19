import { MutableRefObject, useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import { Checkbox, CircularProgress, Skeleton } from "@mui/material";
import ModalRight from "components/ModalRight";
import InputField from "components/forms/InputField";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { useGetProductQuery, usePrintBarCodeMutation } from "services";
import Barcode from "react-jsbarcode";

import ErrorMsg from "components/ErrorMsg";
import {
  IMAGEURL,
  getObjWithValidValues,
  getObjWithValidValuesAndList,
} from "utils/constants/general";
import EmptyResponse from "components/EmptyResponse";
import { useFormContext } from "react-hook-form";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { addToCart } from "store/slice/OrderSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatPrice, getCurrencyFnc, handleError } from "utils";
import { selectCurrentStore, selectUserLocation } from "store/slice/AuthSlice";
import { LoadingProductBox } from "pages/Dashboard/Orders/widgets/product/SelectProductModal";
import { useReactToPrint } from "react-to-print";
type ProductModalProps = {
  openModal: boolean;
  closeModal: () => void;
  dispatchFunc?: (val: any) => void;
  showNewProductButton?: boolean;
  saveBtnMessage?: string;
  setOpenCreateProductModal?: (val: boolean) => void;
  defaultSelectedProductList: any[];
  setSelectBulk: any;
  setSelected: any;
  setSelectBulkFromApis: any;
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

  if (product.stock === 0) {
    return "";
  }
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
                  : `${getCurrencyFnc()}${product?.price || 0}`}
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
                          item?.price || 0
                        }`}</p>
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

export const SelectProductModal = ({
  openModal,
  closeModal,
  saveBtnMessage = "Save",
  defaultSelectedProductList,
  setSelected,
  setSelectBulk,
  setSelectBulkFromApis,
}: ProductModalProps) => {
  const componentRef = useRef() as any;
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [printValue, setPrintValue] = useState<any[]>([]);

  const store = useAppSelector(selectCurrentStore);
  const [searchValue, setSearchValue] = useState("");
  const [productList, setProductList] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const [printCode, { isLoading: printLoad }] = usePrintBarCodeMutation();
  const [activityList, setActivityList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const userLocation = useAppSelector(selectUserLocation);
  const [step, setStep] = useState(0);
  const [confirmForm, setConfirmForm] = useState({
    name: false,
    price: false,
    copy_per_product: 1,
  });

  const { data, isLoading, isFetching, isError } = useGetProductQuery({
    limit: 25,
    page,
    search: searchValue,
    location_id: userLocation?.id,
  });
  const onSubmit = async () => {
    const payload = {
      product_ids: productList
        .map((item: any) => {
          return item.itemId ? null : item.id;
        })
        .filter((el: any) => typeof el === "number"),
      product_variation_ids: productList
        .map((item: any) => {
          return item.variant;
        })
        .filter((el: any) => typeof el === "number"),
      location_id: userLocation?.id,
      config: {
        ...confirmForm,
      },
    };
    try {
      let result = await printCode(getObjWithValidValuesAndList(payload));
      if ("data" in result) {
        setPrintValue(result.data.data);
        showToast("Successful", "success");
        setStep(0);
        setSelected([]);
        setSelectBulk([]);
        setSelectBulkFromApis([]);
        closeModal();
        setProductList([]);
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
      let prepare = data.products.data
        .map((item: any) => {
          if (Number(item.quantity) <= 0) {
          } else {
            return {
              id: item.id,
              url: item.url,
              name: item.name,
              unit: item.unit,
              price: item.price,
              total: item.price,
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
                  price: variant.price,
                  total: variant.price,
                  discount: item.discount,
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
          }
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
  useEffect(() => {
    if (defaultSelectedProductList && defaultSelectedProductList.length) {
      let prepare = defaultSelectedProductList?.map((item: any) => {
        return {
          id: item.id,
          url: item.url,
          name: item.name,
          unit: item.unit,
          price: item.price,
          total: item.price,
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
              price: variant.price,
              total: variant.price,
              discount: item.discount,
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
      });
      prepare.forEach((item) => {
        if (item?.variations?.length) {
          item?.variations?.forEach((el: any) => {
            setProductList((prev: any) => [...prev, el]);
          });
        } else {
          setProductList((prev: any) => [...prev, item]);
        }
      });
    }
  }, [defaultSelectedProductList]);
  useEffect(() => {
    if (printValue.length) {
      handlePrint();
      setPrintValue([]);
    }
  }, [printValue]);
  return (
    <>
      <div className="cover_barcode_to_print hidden ">
        <div className="print_box" ref={componentRef}>
          {printValue?.map((item) => (
            <div className="single_barcode_print_box">
              <div className="store_name">
                <p>{store?.name} Store</p>
              </div>
              <div className="other_deatils">
                {item.name && <p className="product_name"> {item.name} </p>}
                {item?.optionValues?.length ? (
                  <div className="options_display">
                    {item?.optionValues?.map((el: any) => (
                      <p>
                        {el.option}: {el.value}
                      </p>
                    ))}
                  </div>
                ) : (
                  ""
                )}
                {item.price && (
                  <p className="price">{formatPrice(Number(item.price))}</p>
                )}

                <div className="code_border">
                  <Barcode value={item.barcode} />
                </div>
              </div>
            </div>
          ))}
          {/* <Barcode value="barcode-example" /> */}
        </div>
      </div>
      <ModalRight
        closeModal={() => {
          closeModal();
          setProductList([]);
          setStep(0);
          setSelected([]);
          setSelectBulk([]);
          setSelectBulkFromApis([]);
          setProductList([]);
        }}
        openModal={openModal}
      >
        <div className="modal_right_children">
          {step === 0 && (
            <div className="top_section" id="scroller_top">
              <ModalRightTitle
                closeModal={() => {
                  closeModal();
                  setStep(0);
                  setSelected([]);
                  setSelectBulk([]);
                  setSelectBulkFromApis([]);
                  setProductList([]);
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
                  <Button
                    onClick={() => {
                      setProductList([]);
                    }}
                    className="unselect"
                  >
                    Unselect All
                  </Button>
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
                    [1, 2, 3, 4].map((item) => (
                      <LoadingProductBox key={item} />
                    ))}
                  {isError && <ErrorMsg error={"Something went wrong"} />}
                </div>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="top_section" id="scroller_top">
              <ModalRightTitle
                closeModal={() => {
                  setStep(0);
                }}
                title="Confirm Selection"
              />
              <div className="add_related_product_container">
                <div className="confirm_checkboxes">
                  <Checkbox
                    checked={confirmForm.name}
                    onChange={() => {
                      setConfirmForm({
                        ...confirmForm,
                        name: !confirmForm.name,
                      });
                    }}
                  />
                  <p>Show product names on barcode</p>
                </div>
                <div className="confirm_checkboxes">
                  <Checkbox
                    checked={confirmForm.price}
                    onChange={() => {
                      setConfirmForm({
                        ...confirmForm,
                        price: !confirmForm.price,
                      });
                    }}
                  />
                  <p>Show product prices on barcodes</p>
                </div>

                <InputField
                  label="Copy per product"
                  value={confirmForm.copy_per_product}
                  placeholder="Enter how many copies per product"
                  type="number"
                  onChange={(e) => {
                    setConfirmForm({
                      ...confirmForm,
                      copy_per_product: Number(e.target.value),
                    });
                  }}
                />
              </div>
            </div>
          )}

          <div className="productOptionSubmit bottom_section">
            <Button
              type="button"
              className="cancel"
              onClick={() => {
                setProductList([]);
                setConfirmForm({
                  name: false,
                  price: false,
                  copy_per_product: 1,
                });
              }}
            >
              Clear
            </Button>
            {step === 0 ? (
              <Button
                type="button"
                className="save"
                onClick={() => {
                  setStep(1);
                }}
              >
                Continue
              </Button>
            ) : (
              <Button type="button" className="save" onClick={onSubmit}>
                {printLoad ? (
                  <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
                ) : (
                  "Print"
                )}
              </Button>
            )}
          </div>
        </div>
      </ModalRight>
    </>
  );
};
