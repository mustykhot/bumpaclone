import { User01Icon } from "assets/Icons/User01Icon";
import "./style.scss";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  selectCurrentUser,
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
  selectToken,
  selectUserLocation,
} from "store/slice/AuthSlice";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import InputField from "components/forms/InputField";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { useGetCollectionsQuery, useGetProductQuery } from "services";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper";
import {
  MenuItem,
  Button,
  CircularProgress,
  IconButton,
  Select,
  Skeleton,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ErrorMsg from "components/ErrorMsg";
import EmptyResponse from "components/EmptyResponse";
import InfiniteScroll from "react-infinite-scroll-component";
import { addToPosCart, getPosTotals } from "store/slice/PosSlice";
import { API_URL, IMAGEURL } from "utils/constants/general";
import { capitalizeText, formatPrice, truncateString } from "utils";
import PickVariantModal from "../widgets/PickVariantModal/PickVariantModal";
import {
  comparePriceMinAndMAx,
  getVariationPrice,
} from "pages/Dashboard/Products/widget/InventoryTable";
import { Toggle } from "components/Toggle";
import { PRODUCTROUTES } from "utils/constants/apiroutes";
import DropDownWrapper from "components/DropDownWrapper";
import { DotsVerticalIcon } from "assets/Icons/DotsVerticalIcon";
import { CollectionType } from "services/api.types";
import Loader from "components/Loader";
import { GrowthModal } from "components/GrowthModal";

// import useScanDetection from "use-scan-detection";

function includesButtonById(
  visibleButtons: CollectionType[],
  button: CollectionType
) {
  return visibleButtons.some((b) => b.id === button.id);
}

export const LoadingProductBox = () => {
  return (
    <div className="one_loading_box">
      <div className="image_side">
        <Skeleton animation="wave" width={"100%"} height={190} />
      </div>

      <div className="name_side">
        <Skeleton animation="wave" width={"100%"} height={22} />
        <Skeleton animation="wave" width={"100%"} height={18} />
      </div>
    </div>
  );
};
const ProductCard = ({
  item,
  isFetching,
}: {
  item: any;
  isFetching: boolean;
}) => {
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [optionName, setOptionName] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<any>(null);
  const [unavailable, setUnavailable] = useState(false);

  const previewSelectVariation = (variant: string) => {
    let variation: any = false;
    item?.variations.forEach(function (item: any) {
      if (item.variant?.toLowerCase() == variant?.toLowerCase()) {
        variation = item;
      }
    });
    if (variation) {
      setSelectedVariant(variation);
      setUnavailable(false);
    } else {
      setUnavailable(true);
      setSelectedVariant(null);
    }
  };
  const onChangeSelect = (value: any, option: any) => {
    setSelectedOptions({ ...selectedOptions, [option]: value });
  };
  const addtoCart = (quantity?: number) => {
    if (item?.variationCount > 0) {
      if (selectedVariant) {
        let payload = {
          id: selectedVariant.id,
          name: item?.name,
          itemId: item?.id,
          url: item?.url,
          price: Number(selectedVariant.price),
          variant: selectedVariant.id,
          total: Number(selectedVariant.price),
          options: optionName,
          stock: selectedVariant.quantity,
          unit: item?.unit,
          quantity: quantity,
          amountLeft: Number(selectedVariant.quantity) - 1,
          variantName: `${item?.name}(${selectedVariant.variant})`,
          description: item?.description,
          image: selectedVariant.image
            ? `${IMAGEURL}${selectedVariant.image}`
            : item?.alt_image_url,
        };
        if (selectedVariant.quantity !== 0) {
          dispatch(addToPosCart(payload));
        }
      }
    } else {
      let payload = {
        id: item?.id,
        name: item?.name,
        unit: item?.unit,
        url: item?.url,
        description: item?.description,
        price: Number(item.price),
        variant: null,
        total: Number(item?.price),
        stock: item?.quantity,
        image: item?.alt_image_url,
        amountLeft: Number(item?.quantity) - 1,
      };
      dispatch(addToPosCart(payload));
    }
    dispatch(getPosTotals());
  };

  useEffect(() => {
    if (selectedOptions) {
      if (Object.keys(selectedOptions).length === item?.options.length) {
        let variant: string[] = [];
        item?.options.forEach((option: any) => {
          variant.push(selectedOptions[option.name]);
        });
        let finalVariant = variant.join("-");
        setOptionName(variant.join(", "));
        previewSelectVariation(finalVariant);
      }
    }
  }, [selectedOptions]);

  return (
    <>
      <div
        onClick={() => {
          if (item?.variationCount > 0) {
            setOpenModal(true);
          } else {
            if (Number(item.quantity) < 5) {
              if (!isFetching) {
                if (Number(item.quantity) > 0) {
                  addtoCart();
                }
              }
            } else {
              if (Number(item.quantity) > 0) {
                addtoCart();
              }
            }
          }
        }}
        className="product_pos_card"
      >
        <div
          className="image_side"
          style={{
            backgroundImage: `url(${item?.alt_image_url})`,
          }}
        >
          {item?.quantity < 3 && (
            <div className="warning_cover">
              <div className="warning">
                <p>
                  {item?.quantity <= 0
                    ? "Out of stock"
                    : `${item?.quantity} Left`}
                </p>{" "}
              </div>
            </div>
          )}
        </div>
        <div className="name_side">
          <p className="name">{truncateString(item?.name, 15)}</p>
          <p className="price">
            {item?.variationCount > 0
              ? comparePriceMinAndMAx(
                  item?.max_selling_price,
                  item?.min_selling_price
                )
              : `${formatPrice(item?.price)}`}
          </p>
          {item.prevPrice && (
            <p className="slashed_price">{formatPrice(item.prevPrice)}</p>
          )}
        </div>
      </div>
      <PickVariantModal
        openModal={openModal}
        onChangeSelect={onChangeSelect}
        addtoCart={addtoCart}
        unavailable={unavailable}
        selectedVariant={selectedVariant}
        closeModal={() => {
          setOpenModal(false);
          setUnavailable(false);
          setSelectedVariant(null);
          setSelectedOptions(null);
        }}
        item={item}
      />
    </>
  );
};
type PropTypes = {
  page: number;
  search: string;
  setSelectedTag: any;
  selectedTag: any;
  data: any;
  setPage: any;
  isLoading: boolean;
  isFetching: boolean;
  isError: any;
  setSearch: any;
  setDataCount: (val: number) => void;
  dataCount: number;
  barcodes: any;
  onChangeBarcode: any;
  isLoadingBarCode?: boolean;
  fetchBarcodeData?: any;
};
const LeftPosProductArea = ({
  page,
  search,
  selectedTag,
  setSelectedTag,
  data,
  setPage,
  isLoading,
  isFetching,
  isError,
  setSearch,
  setDataCount,
  dataCount,
  barcodes,
  onChangeBarcode,
  isLoadingBarCode,
  fetchBarcodeData,
}: PropTypes) => {
  const user = useAppSelector(selectCurrentUser);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const [swipe, setSwipe] = useState<any>();
  const [switchSearch, setSwitchSearch] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [productArray, setproductArray] = useState<any[]>([]);
  const [openGrowthModal, setOpenGrowthModal] = useState(false);
  const inputref = useRef<any>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const lastBoxRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const [visibleButtons, setVisibleButtons] = useState<CollectionType[]>([]);
  const [overflowButtons, setOverflowButtons] = useState<CollectionType[]>([]);
  const [isLastRefRendering, setIsLastRefRendering] = useState(true);
  const {
    data: collectionLists,
    isLoading: loadCollection,
    isError: collectionError,
  } = useGetCollectionsQuery({});
  const listLength = collectionLists?.tags.length || 0;

  const updateButtonVisibility = (isLastRender?: boolean) => {
    if (parentRef.current && childRef.current && collectionLists?.tags) {
      const parentWidth = parentRef.current.offsetWidth - 88;
      const moreButtonWidth = 88;
      const allButtonWidth = 110;
      let gap = 16;
      let totalWidth = moreButtonWidth + allButtonWidth;
      const newVisibleButtons: CollectionType[] = [];
      const newOverflowButtons: CollectionType[] = [];

      for (let button of collectionLists?.tags) {
        const buttonElement = document.getElementById(`${button.id}`);
        if (buttonElement) {
          const buttonWidth = buttonElement.offsetWidth;

          if (totalWidth + buttonWidth + gap <= parentWidth) {
            newVisibleButtons.push(button);
            totalWidth += buttonWidth + gap;
          } else {
            newOverflowButtons.push(button);
          }
        }
      }

      setVisibleButtons(newVisibleButtons);
      setOverflowButtons(newOverflowButtons);
      if (isLastRender) {
        setIsLastRefRendering(false);
      }
    }
  };

  // useEffect(() => {
  //   if (collectionLists && collectionLists?.tags?.length > 0) {
  //     updateButtonVisibility();
  //   }
  // }, [collectionLists]);

  useLayoutEffect(() => {
    window.addEventListener("resize", () => {
      updateButtonVisibility();
    });
    return () => {
      window.removeEventListener("resize", () => {
        updateButtonVisibility();
      });
    };
  }, [collectionLists]);

  const fetchMoreData = () => {
    setPage(page + 1);
    setDataCount(dataCount + 30);
  };

  useEffect(() => {
    if (data) {
      let list: any = data?.products?.data.map((item: any) => {
        return {
          ...item,
          price: item.sales ? Number(item.sales) : Number(item.price),
          total: item.sales ? Number(item.sales) : Number(item.price),
          prevPrice: item.sales ? item.price : null,
          variations: item.variations.map((variant: any) => {
            return {
              ...variant,
              price: variant.sales
                ? Number(variant.sales)
                : Number(variant.price),
              prevPrice: variant.sales ? variant.price : null,
              total: variant.sales
                ? Number(variant.sales)
                : Number(variant.price),
            };
          }),
        };
      });

      setproductArray(list);
    }
  }, [data, search, selectedTag, isFetching, isLoading]);
  useEffect(() => {
    if (inputref?.current) {
      inputref?.current?.focus();
    }
  }, [inputref?.current]);

  useLayoutEffect(() => {
    if (lastBoxRef?.current) {
      updateButtonVisibility(true);
    }
  }, [lastBoxRef?.current]);
  useEffect(() => {
    if (collectionError) {
      setIsLastRefRendering(false);
    }
  }, [collectionError]);
  useEffect(() => {
    if (collectionLists && !collectionLists?.tags?.length) {
      setIsLastRefRendering(false);
    }
  }, [collectionLists]);

  return (
    <>
      {(loadCollection || isLoading || isLastRefRendering) && <Loader />}
      <div className="pd_left_pos_product_area">
        <div className="page_title_and_search_section">
          <div className="page_title_flex">
            <h1>Point of Sale</h1>

            <div className="search_side">
              {switchSearch ? (
                <InputField
                  value={barcodes}
                  onChange={(e) => {
                    onChangeBarcode(e);
                  }}
                  placeholder="Click/Focus here to Scan Products"
                  containerClass="search_field"
                  autoFocus={true}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      fetchBarcodeData(barcodes);
                    }
                  }}
                  ref={inputref}
                  suffix={
                    isLoadingBarCode ? (
                      <CircularProgress size="1rem" sx={{ color: "#009444" }} />
                    ) : (
                      ""
                    )
                  }
                />
              ) : (
                <InputField
                  type={"text"}
                  containerClass="search_field"
                  value={search}
                  onChange={(e: any) => {
                    setSearch(e.target.value);
                  }}
                  placeholder="Search products by name and SKU"
                  suffix={<SearchIcon />}
                />
              )}

              <div className="switch_box">
                <p>Scan Barcode</p>
                <Toggle
                  handlelick={() => {
                    if (
                      isSubscriptionExpired ||
                      (isSubscriptionType !== "growth" &&
                        isSubscriptionType !== "trial")
                    ) {
                      setOpenGrowthModal(true);
                    } else {
                      setSwitchSearch(!switchSearch);
                    }
                  }}
                  toggled={switchSearch}
                />
              </div>
            </div>
          </div>

          {!collectionError && (
            <div
              ref={parentRef}
              style={{
                visibility: isLastRefRendering ? "hidden" : "visible",
                display: collectionLists?.tags?.length ? "flex" : "none",
              }}
              className="collection_carousel"
            >
              <div ref={childRef} className="cover_all_collection">
                {loadCollection ? (
                  <Skeleton animation="wave" width="100%" height={20} />
                ) : (
                  <>
                    {visibleButtons.length ? (
                      <div
                        onClick={() => {
                          setSelectedTag(``);
                          setSearch("");
                        }}
                        className={`single_tag ${
                          selectedTag === "" ? "active" : ""
                        }`}
                      >
                        <p>All Products</p>
                      </div>
                    ) : (
                      ""
                    )}

                    {collectionLists?.tags?.length
                      ? collectionLists?.tags?.map((tag: any, i) => (
                          <div
                            onClick={() => {
                              setSelectedTag(`${tag.id}`);
                            }}
                            id={`${tag.id}`}
                            key={tag.id}
                            className={`single_tag ${
                              `${tag.id}` === selectedTag ? "active" : ""
                            }`}
                            ref={i === listLength - 1 ? lastBoxRef : null}
                            style={{
                              visibility: includesButtonById(
                                visibleButtons,
                                tag
                              )
                                ? "visible"
                                : "hidden",
                              display: includesButtonById(overflowButtons, tag)
                                ? "none"
                                : "block",
                            }}
                          >
                            <p> {tag.tag}</p>
                          </div>
                        ))
                      : ""}
                  </>
                )}
              </div>
              {overflowButtons?.length ? (
                <DropDownWrapper
                  closeOnChildClick
                  origin="right"
                  action={
                    <Button
                      sx={{
                        color: "#5C636D",
                        backgroundColor: " #EFF2F7",
                      }}
                      ref={moreButtonRef}
                      endIcon={<DotsVerticalIcon />}
                      className={"more_btn"}
                    >
                      More
                    </Button>
                  }
                >
                  <ul className="list_group">
                    {overflowButtons.map((el) => (
                      <li
                        onClick={() => {
                          setSelectedTag(`${el.id}`);
                        }}
                        key={el.id}
                        className={`${
                          `${el.id}` === selectedTag ? "active" : ""
                        }`}
                      >
                        {capitalizeText(el.tag)}
                      </li>
                    ))}
                  </ul>
                </DropDownWrapper>
              ) : (
                ""
              )}
            </div>
          )}
          {!collectionError && collectionLists?.tags?.length ? (
            <div className="mobile_select_collection">
              <Select
                displayEmpty
                value={selectedTag}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setSelectedTag(``);
                    setSearch("");
                  } else {
                    setSelectedTag(`${e.target.value}`);
                  }
                }}
                className="my-select dark"
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem disabled value="">
                  Select Collection
                </MenuItem>
                <MenuItem value="all">All Products</MenuItem>
                {collectionLists?.tags.map((item, i) => {
                  return (
                    <MenuItem key={i} value={item.id}>
                      {item.tag}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="product_listing_section">
          {isError && <ErrorMsg error={"Something went wrong"} />}
          {!isError && !isLoading && (
            <div className="list_of_order_products">
              {productArray.length ? (
                <div className="target_class" id="target">
                  <InfiniteScroll
                    dataLength={productArray.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<div></div>}
                    scrollableTarget={"target"}
                  >
                    <div
                      className={`products_wrapper ${
                        search ? "issearching" : ""
                      }`}
                    >
                      {productArray
                        // .filter((item) => item.quantity > 0) // Filter items with stock greater than 0
                        .map((item) => (
                          <ProductCard
                            isFetching={isFetching}
                            item={item}
                            key={item.id}
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
              ) : (
                <EmptyResponse
                  message={
                    search
                      ? "No product matches your search"
                      : `You have not added Products ${
                          selectedTag ? " to this collection" : ""
                        }`
                  }
                />
              )}
            </div>
          )}
          {isLoading && (
            <div className="loading_container">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <LoadingProductBox />
              ))}
            </div>
          )}
        </div>
      </div>
      <GrowthModal
        openModal={openGrowthModal}
        closeModal={() => {
          setOpenGrowthModal(false);
        }}
        title={`Generate barcodes easily on the Growth Plan`}
        subtitle={`Get better inventory tracking when you use Bumpa’s barcode generator.`}
        growthFeatures={[
          "Generate barcodes for better inventory tracking",
          "Upload business logo on website",
          "Create unique barcodes for your products & sell faster.",
        ]}
        buttonText={`Upgrade to Growth`}
        eventName="scan-barcode"
      />
    </>
  );
};

export default LeftPosProductArea;
