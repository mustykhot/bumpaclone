import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import InputField from "components/forms/InputField";
import { SearchIcon } from "assets/Icons/SearchIcon";
import CardComponent from "./CardComponent";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper";
import { Skeleton } from "@mui/material";
import { IconButton } from "@mui/material";
import { RightArrowIcon } from "assets/Icons/RightArrowIcon";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import { useGetCollectionsQuery } from "services";
import { IMAGEURL } from "utils/constants/general";
import alt_collection_url from "assets/images/alt_collection_url.png";
import EmptyResponse from "components/EmptyResponse";
import ErrorMsg from "components/ErrorMsg";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { formatPrice, truncateString } from "utils";
import { Button, FormControl, MenuItem } from "@mui/material";
import { ProductItem } from "./Products";

interface SelectedOptions {
  [key: number]: { [key: string]: string };
}

export type orderFields = {
  // added_options: any;
  // product: any;
  myOptions: any;
};
export const LoadingCollectionBox = () => {
  return (
    <div className="one_loading_box">
      <div className="left_box">
        <Skeleton animation="wave" width={"100%"} height={"100%"} />
      </div>
    </div>
  );
};
const Collections = ({}: {}) => {
  const [open, setOpen] = useState(false);
  const [swipe, setSwipe] = useState<any>();
  const [start, setStart] = useState<any>(false);
  const [end, setEnd] = useState<any>(false);
  const [page, setPage] = useState(1);
  const [dataCount, setDataCount] = useState("25");
  const [search, setSearch] = useState("");
  const [option, setOption] = useState<any>("");
  const [activeCard, setActiveCard] = useState("");
  const [close, setClose] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [productArray, setproductArray] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

  const fetchMoreData = () => {
    // if (data?.products?.last_page === page) {
    //   setHasMore(false);
    // } else {
    //   setPage(page + 1);
    // }
  };

  interface Collection {
    id: number;
    name?: string;
    products: Product[];
  }

  interface Product {
    id: string;
    name: string;
  }

  const {
    data: collectionLists,
    isLoading,
    isError,
  } = useGetCollectionsQuery({
    search: search,
  });
  const [activeCollection, setActiveCollection] = useState<
    Collection | null | any
  >(null);

  const handleCollectionClick = (collection: Collection) => {
    setActiveCollection(collection);
  };
  useEffect(() => {
    if (
      collectionLists &&
      collectionLists.tags &&
      collectionLists.tags.length > 0
    ) {
      setActiveCollection(collectionLists.tags[0]);
    } else if (
      search &&
      collectionLists &&
      collectionLists.tags &&
      collectionLists.tags.length < 1
    ) {
      setActiveCollection(null);
    }
  }, [collectionLists, search]);

  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value);
  };

  const handleCardClick = (id: any) => {
    setOpen(true);
    setActiveCard(id);
  };

  const handleSelectChange = (
    productId: number,
    optionType: string,
    selectedValue: string
  ) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [productId]: {
        ...prevState[productId],
        [optionType]: selectedValue,
      },
    }));
  };

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

  return (
    <div className="products_conatiner">
      <div className="collectiont_top_side">
        <div className="pos-header items-center">
          <div className="input_container  ">
            <InputField
              suffix={<SearchIcon />}
              placeholder={"Search"}
              type={"text"}
              value={search}
              onChange={(e: any) => {
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="collections_carousel">
          {collectionLists &&
          collectionLists.tags &&
          collectionLists.tags.length < 1 &&
          search ? (
            <EmptyResponse message="No collections match your search" />
          ) : (
            <div className="carousel_header">Select Collections</div>
          )}
          <div className="slider_wrapper">
            <div>
              {isLoading && (
                <div className="loading_container">
                  {[1, 2, 3, 4].map((item) => (
                    <LoadingCollectionBox />
                  ))}
                </div>
              )}
              {isError && <ErrorMsg error={"Something went wrong"} />}
              {!isError && !isLoading && (
                <>
                  <Swiper
                    // loop={true}
                    modules={[Pagination, Navigation, Autoplay]}
                    breakpoints={{
                      0: {
                        slidesPerView: 2,
                        spaceBetween: 14,
                      },
                      640: {
                        slidesPerView: 3,
                        spaceBetween: 14,
                      },
                      768: {
                        slidesPerView: 4,
                        spaceBetween: 12,
                      },
                      1024: {
                        slidesPerView: 5,
                        spaceBetween: 10,
                      },
                      1500: {
                        slidesPerView: 5,
                        spaceBetween: 10,
                      },
                    }}
                    onReachBeginning={() => {
                      setStart(false);
                    }}
                    onReachEnd={() => {
                      setEnd(true);
                    }}
                    onBeforeInit={(swipper) => setSwipe(swipper)}
                  >
                    {/* {collectionList.map((ele, i) => ( */}
                    {collectionLists?.tags?.map((ele: any, i: number) => (
                      <div key={i} className="swiper_card">
                        <SwiperSlide>
                          <div
                            key={ele.id}
                            className={
                              activeCollection?.id === ele.id
                                ? "single_carousel single_carousel_active"
                                : "single_carousel"
                            }
                            onClick={() => {
                              handleCollectionClick(ele);
                            }}
                          >
                            <div className="carousel_content">
                              <img
                                src={
                                  ele.image_path
                                    ? `${IMAGEURL}${ele.image_path}`
                                    : alt_collection_url
                                }
                                alt="collection"
                                style={{ borderRadius: "0" }}
                              />

                              <p className="name">{ele.tag}</p>
                            </div>
                          </div>
                        </SwiperSlide>
                      </div>
                    ))}
                  </Swiper>
                  <div className="btn_wrapper">
                    {/* {start && ( */}
                    <div
                      className={start ? " icon_wrap" : "hide_btn icon_wrap"}
                    >
                      <IconButton
                        type="button"
                        className="slide_btn_prev"
                        onClick={() => {
                          swipe?.slidePrev();
                          setEnd(false);
                        }}
                      >
                        <BackArrowIcon />
                      </IconButton>
                    </div>
                  </div>
                  <div className="btn_wrapper right_arrow">
                    {!end && (
                      <IconButton
                        type="button"
                        className="slide_btn_next"
                        onClick={() => {
                          swipe?.slideNext();
                          setStart(true);
                        }}
                      >
                        <RightArrowIcon />
                      </IconButton>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="products_wrapper"> */}
      <div className="pos-footer collection-footer">
        {activeCollection && (
          <>
            {activeCollection?.products?.length > 0 ? (
              <div id="target">
                <InfiniteScroll
                  dataLength={activeCollection?.products?.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={<div></div>}
                  scrollableTarget={"target"}
                >
                  <div className="products_wrapper">
                    {activeCollection?.products
                      .filter((item: any) => item.stock > 0) // Filter items with stock greater than 0
                      .map((item: any, i: number) => (
                        <ProductItem
                          open={open}
                          activeCard={activeCard}
                          handleCardClick={handleCardClick}
                          item={item}
                          key={i}
                        />
                      ))}
                  </div>
                </InfiniteScroll>
              </div>
            ) : (
              // <div className="products_wrapper">
              //   <CardComponent
              //     products={activeCollection?.products}
              //     open={open}
              //     setOpen={setOpen}
              //   />
              // </div>

              <div className="empty_margin">
                <EmptyResponse
                  message={`No products in the ${activeCollection.tag} collection `}
                />
              </div>
            )}
            {/* <CardComponent products={collectionList} open={open} setOpen={setOpen} /> */}
          </>
        )}
      </div>
      {/* </div> */}
    </div>
  );
};

export default Collections;
