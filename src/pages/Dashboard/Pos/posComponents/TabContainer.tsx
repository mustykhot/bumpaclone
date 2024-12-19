import { useState } from "react";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import InputField from "components/forms/InputField";
import { SearchIcon } from "assets/Icons/SearchIcon";
import CardComponent from "./CardComponent";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper";
import product from "../../../../assets/images/product.png";
import { IconButton } from "@mui/material";
import { FilterIcon } from "assets/Icons/Filter";
import { RightArrowIcon } from "assets/Icons/RightArrowIcon";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};
const productsList = [
  {
    id: 1,
    name: "shoes",
    price: "5000",
    options: {
      size: ["10", "24"],
      color: ["red", "blue"],
    },
  },
  {
    id: 2,
    name: "sneakers",
    price: "7000",
    options: {
      size: ["45", "24"],
      color: ["yellow", "pink"],
    },
  },
  {
    id: 3,
    name: "shoes",
    price: "5000",
    options: {
      size: ["10", "24"],
      color: ["red", "blue"],
    },
  },
  {
    id: 4,
    name: "Cup Cake",
    price: "5200",
    options: {
      size: ["x", "XL"],
      color: ["chocolate", "velvet"],
    },
  },
  {
    id: 5,
    name: "Cookies",
    price: "800",
    options: {
      size: ["x", "XL"],
      color: ["chocolate", "velvet"],
    },
  },
  {
    id: 6,
    name: "Fabric",
    price: "9000",
    options: {
      size: ["x", "XL"],
      color: ["chocolate", "velvet"],
    },
  },
  {
    id: 7,
    name: "shoes",
    price: "5000",
    options: {
      size: ["10", "24"],
      color: ["red", "blue"],
    },
  },
  {
    id: 8,
    name: "shoes",
    price: "5000",
    options: {
      size: ["10", "24"],
      color: ["red", "blue"],
    },
  },
  {
    id: 9,
    name: "shoes",
    price: "5000",
    options: {
      size: ["10", "24"],
      color: ["red", "blue"],
    },
  },
  {
    id: 10,
    name: "shoes",
    price: "5000",
    options: {
      size: ["10", "24"],
      color: ["red", "blue"],
    },
  },
  {
    id: 11,
    name: "shoes",
    price: "5000",
    options: {
      size: ["10", "24"],
      color: ["red", "blue"],
    },
  },
  {
    id: 12,
    name: "shoes",
    price: "5000",
    options: {
      size: ["10", "24"],
      color: ["red", "blue"],
    },
  },
];
const collectionList = [
  { id: 1, name: "shoes" },
  { id: 2, name: " T-shirt" },
  { id: 3, name: "Toursers" },
  { id: 4, name: "Eye Glaseses" },
  { id: 5, name: "Rings" },
  { id: 6, name: "Toursers" },
  { id: 7, name: "Skirts" },
  { id: 8, name: "Sneakers" },
  { id: 9, name: "shoes" },
];

export const TabContainer = () => {
  const [open, setOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState<any>();

  const [swipe, setSwipe] = useState<any>();
  const [start, setStart] = useState<any>(false);
  const [end, setEnd] = useState<any>(false);

  const products = (
    // return (
    <div className="products mx-auto">
      <div className="pos-header items-center">
        <div className="input_container pos_search ">
          <InputField suffix={<SearchIcon />} placeholder={"Search"} />
        </div>
        <div className="filter ">
          <div className="icon_wrap">
            <IconButton
              type="button"
              className="pos-filter icon_button_container pad hamburger mobile"
            >
              <FilterIcon />
            </IconButton>
            {/* <HardDriveIcon /> */}
          </div>
        </div>
      </div>

      <div className="products_wrapper">
        <div
          className={open ? "products_overlay" : ""}
          onClick={() => {
            setOpen(false);
          }}
        ></div>
        {/* {productsList.map((ele) => ( */}
        <CardComponent products={productsList} open={open} setOpen={setOpen} />
        {/* ))} */}
      </div>
    </div>
  );

  const collections = (
    <div className="products mx-auto">
      <div className="pos-header items-center">
        <div className="input_container  ">
          <InputField suffix={<SearchIcon />} placeholder={"Search"} />
        </div>
        <div className="filter ">
          <div className="icon_wrap">
            <IconButton
              type="button"
              className="pos-filter icon_button_container pad hamburger mobile"
            >
              <FilterIcon />
            </IconButton>
          </div>
        </div>
      </div>
      <div className="collections_carousel">
        <div className="carousel_header">Select Collections</div>
        <div className="slider_wrapper">
          <div>
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
              {collectionList.map((ele, i) => (
                <div key={i}>
                  <SwiperSlide>
                    <motion.div
                      layout
                      key={ele.id}
                      className={
                        activeCollection === ele.id
                          ? "single_carousel single_carousel_active"
                          : "single_carousel"
                      }
                      onClick={() => {
                        setActiveCollection(ele.id);
                      }}
                    >
                      <motion.div className="carousel_content">
                        <div className="col_img">
                          <img
                            src={product}
                            alt="product"
                            style={{ borderRadius: "0" }}
                          />
                        </div>
                        <p className="name">{ele.name}</p>
                      </motion.div>
                    </motion.div>
                  </SwiperSlide>
                </div>
              ))}
            </Swiper>
            <div className="btn_wrapper">
              {/* {start && ( */}
              <div className={start ? " icon_wrap" : "hide_btn icon_wrap"}>
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
              {/* )} */}

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
          </div>
        </div>
      </div>

      <div className="products_wrapper">
        <div
          className={open ? "products_overlay" : ""}
          onClick={() => {
            setOpen(false);
          }}
        ></div>
        {/* {productsList.map((ele) => ( */}
        <CardComponent products={productsList} open={open} setOpen={setOpen} />
      </div>
    </div>
  );
  const [[page, direction], setPage] = useState([0, 0]);
  const tabs = [
    { title: "Products", body: products },
    { title: "Collections", body: collections },
  ];

  // We only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
  // then wrap that within 0-2 to find our image ID in the array below. By passing an
  // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
  // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
  // const imageIndex = wrap(0, images.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className="container">
      <AnimateSharedLayout>
        <ul className="tabs-header">
          {tabs.map(({ title }, i) => {
            const isActive = i === page;
            return (
              <li
                key={i}
                className={isActive ? "active-header" : ""}
                onClick={() => {
                  // set page and determin which direction we're going
                  setPage([i, i - page]);
                }}
              >
                <h4>{title}</h4>
                {isActive && (
                  <motion.div className="underline" layoutId="underline" />
                )}
              </li>
            );
          })}
          <div className="underline-bg" />
        </ul>
        <AnimatePresence initial={false} custom={direction}>
          <motion.section
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30, duration: 2 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          >
            {tabs[page].body}
          </motion.section>
        </AnimatePresence>
      </AnimateSharedLayout>
    </div>
  );
};
