import { useState, useEffect } from "react";
import InputField from "components/forms/InputField";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { useGetProductQuery } from "services";
import EmptyResponse from "components/EmptyResponse";
import ErrorMsg from "components/ErrorMsg";
import { Checkbox, Skeleton } from "@mui/material";
import "../style.scss";
import "./style.scss";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Button, FormControl, MenuItem } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { IMAGEURL } from "utils/constants/general";
import { formatPrice, truncateString } from "utils";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  addToPosCart,
  getPosTotals,
  selectActiveCartDiscount,
} from "store/slice/PosSlice";
import { selectUserLocation } from "store/slice/AuthSlice";

interface SelectedOptions {
  [key: number]: { [key: string]: string };
}

export type orderFields = {
  // added_options: any;
  // product: any;
  myOptions: any;
};

export const LoadingProductBox = () => {
  return (
    <div className="one_loading_box">
      <div className="left_box">
        <Skeleton animation="wave" width={"100%"} height={"100%"} />
      </div>

      <div className="price_box">
        <Skeleton animation="wave" width={"100%"} height={"100%"} />
      </div>
      <div className="price_box">
        <Skeleton animation="wave" width={"100%"} height={"100%"} />
      </div>
    </div>
  );
};

export const ProductItem = ({
  open,
  item,
  activeCard,
  handleCardClick,
}: {
  open: boolean;
  item: any;
  activeCard: string;
  handleCardClick: (id: string) => void;
}) => {
  const dispatch = useAppDispatch();
  const [optionName, setOptionName] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const previewSelectVariation = (variant: string) => {
    let variation: any = false;
    item.variations.forEach(function (item: any) {
      if (item.variant == variant) {
        variation = item;
      }
    });
    if (variation) {
      setSelectedVariant(variation);
    }
  };

  const onChangeSelect = (value: any, option: any) => {
    setSelectedOptions({ ...selectedOptions, [option]: value });
  };

  const addtoCart = () => {
    if (item?.variations?.length) {
      if (selectedVariant) {
        let payload = {
          id: selectedVariant.id,
          name: item.name,
          itemId: item.id,
          url: item.url,
          price: Number(selectedVariant.price),
          variant: selectedVariant.id,
          total: Number(selectedVariant.price),
          options: optionName,
          stock: selectedVariant.stock,
          unit: item.unit,
          amountLeft: Number(item.stock) - 1,
          variantName: `${item.name}(${selectedVariant.variant})`,
          description: item.description,
          image: selectedVariant.image
            ? `${IMAGEURL}${selectedVariant.image}`
            : item.alt_image_url,
        };
        if (selectedVariant.stock !== 0) {
          dispatch(addToPosCart(payload));
        }
      }
    } else {
      let payload = {
        id: item.id,
        name: item.name,
        unit: item.unit,
        url: item.url,
        description: item.description,
        price: Number(item.price),
        variant: null,
        total: Number(item.price),
        stock: item.stock,
        image: item.alt_image_url,
        amountLeft: Number(item.stock) - 1,
      };
      dispatch(addToPosCart(payload));
    }
    dispatch(getPosTotals());
  };

  useEffect(() => {
    if (Object.keys(selectedOptions).length === item.options.length) {
      let variant: string[] = [];
      item.options.forEach((option: any) => {
        variant.push(selectedOptions[option.name]);
      });
      let finalVariant = variant.join("-");
      setOptionName(variant.join(", "));
      previewSelectVariation(finalVariant);
    }
  }, [selectedOptions]);

  return (
    <div
      id={item.id}
      className={
        activeCard && activeCard !== item.id
          ? "p_card overlay_card"
          : activeCard && activeCard === item.id
          ? "p_card card_open"
          : "p_card"
      }
      onClick={() => {
        handleCardClick(item.id);
      }}
    >
      <div className="p-[12px] w-full">
        <div className="img_container">
          <img
            src={
              selectedVariant && selectedVariant?.image
                ? `${IMAGEURL}${selectedVariant?.image}`
                : `${item.alt_image_url}`
            }
            alt="item"
          />
        </div>
        <div className="p_details">
          <p className="p_name">{truncateString(item.name, 15)}</p>
          <div className="stock_alert w-full">
            <p className="p_price">
              {selectedVariant
                ? formatPrice(Number(selectedVariant.price))
                : formatPrice(Number(item.price))}
            </p>
            {selectedVariant
              ? selectedVariant.stock < 3 && (
                  <p className="stock_left">{selectedVariant.stock} left</p>
                )
              : item.stock < 3 && (
                  <p className="stock_left">{item.stock} left</p>
                )}
          </div>
        </div>
      </div>

      <div className="variation_aspect">
        {open && activeCard && item.id === activeCard && (
          <div
            className={
              item.options.length >= 2
                ? "variation"
                : item.options.length === 1
                ? "variation one_option"
                : "variation no_options"
            }
          >
            <div
              style={{ minWidth: "100%", width: "100%", margin: 0 }}
              // sx={{ m: 1, minWidth: "100%", margin: 0 }}
            >
              {item.options.map((option: any, i: number) => (
                <Select
                  key={i}
                  displayEmpty
                  onChange={(e) => {
                    onChangeSelect(e.target.value, option.name);
                  }}
                  renderValue={(value) => (value ? value : option.name)}
                  inputProps={{ "aria-label": "Without label" }}
                  size="small"
                  sx={{ m: 1, minWidth: "100%", margin: 0 }}
                  className="pos_select previewProductOption"
                >
                  {option.values.map((value: any) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              ))}
              <div className="cart_btn mt-2">
                <Button
                  variant="contained"
                  className="w-full "
                  type="submit"
                  onClick={() => {
                    addtoCart();
                  }}
                  disabled={
                    item?.variations?.length
                      ? selectedVariant && selectedVariant.stock !== 0
                        ? false
                        : true
                      : false
                  }
                >
                  Add To Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Products = ({
  scrollableTarget,
}: {
  scrollableTarget: React.RefObject<any>;
}) => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [dataCount, setDataCount] = useState(50);
  const [searchProducts, setSearchProducts] = useState("");
  const [option, setOption] = useState<any>("");
  const [activeCard, setActiveCard] = useState("");
  const [close, setClose] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [productArray, setproductArray] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const userLocation = useAppSelector(selectUserLocation);

  const { data, isLoading, isFetching, isError } = useGetProductQuery({
    limit: Number(dataCount),
    page: page,
    search: searchProducts,
    location_id: userLocation?.id,
  });
  const fetchMoreData = () => {
    if (data?.products?.last_page === page) {
      setHasMore(false);
    } else {
      setPage(page + 1);
    }
  };
  useEffect(() => {
    if (data) {
      let list: any = data?.products?.data;
      if (searchProducts) {
        setproductArray(list);
        // if (page === 1) {
        //   setproductArray(list);
        // } else {
        //   setproductArray((prev) => [...prev, ...list]);
        // }
      } else {
        if (page === 1) {
          setproductArray(list);
        } else {
          setproductArray((prev) => [...prev, ...list]);
        }
      }
    }
  }, [data, searchProducts]);

  // close card when close is true
  useEffect(() => {
    if (close) {
      setOpen(false);
      setActiveCard("");
    }
  }, [close]);
  // close card when active card is null
  useEffect(() => {
    if (!activeCard) {
      setClose(false);
    }
  }, [activeCard]);

  const methods = useForm<orderFields>({
    mode: "all",
  });
  const {
    formState: { isValid },
    handleSubmit,
    setValue,
  } = methods;

  const handleCardClick = (id: string) => {
    setOpen(true);
    setActiveCard(id);
  };

  return (
    <div className="products_conatiner product_tab_side">
      <div className="pos-header items-center">
        <div className="input_container pos_search ">
          <InputField
            suffix={<SearchIcon />}
            placeholder={"Search"}
            value={searchProducts}
            onChange={(e: any) => {
              setSearchProducts(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="pos-footer">
        {isError && <ErrorMsg error={"Something went wrong"} />}
        {!isError && !isLoading && (
          <>
            {productArray && (
              <>
                {productArray.length >= 1 ? (
                  <div id="target">
                    <InfiniteScroll
                      dataLength={productArray.length}
                      next={fetchMoreData}
                      hasMore={hasMore}
                      loader={<div></div>}
                      scrollableTarget={"target"}
                    >
                      <div className="products_wrapper">
                        {productArray
                          .filter((item) => item.stock > 0) // Filter items with stock greater than 0
                          .map((item, i) => (
                            <ProductItem
                              open={open}
                              activeCard={activeCard}
                              handleCardClick={handleCardClick}
                              item={item}
                              key={i}
                            />
                          ))}
                        {isFetching && (
                          <>
                            {[1, 2, 3, 4].map((item) => (
                              <LoadingProductBox />
                            ))}
                          </>
                        )}
                      </div>
                    </InfiniteScroll>
                  </div>
                ) : productArray &&
                  productArray.length < 1 &&
                  searchProducts ? (
                  <EmptyResponse message=" No product matches your search" />
                ) : (
                  <EmptyResponse message="You have not added Products" />
                )}
              </>
            )}
          </>
        )}
        {isLoading && (
          <div className="loading_container">
            {[1, 2, 3, 4].map((item) => (
              <LoadingProductBox />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
